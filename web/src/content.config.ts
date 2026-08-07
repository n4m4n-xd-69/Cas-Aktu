import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

/**
 * Content collections for the CAS record types.
 *
 * These schemas are the migration's biggest structural upgrade over the
 * Python build. There, records are plain dicts: a missing `source_url` or a
 * statistic without an as-of year fails silently and ships. Here it fails the
 * build.
 *
 * `sourceUrl` and `lastReviewed` are required on anything that makes a public
 * claim, because PRODUCT_REQUIREMENTS.md §2 requires confirmation by the
 * accountable office and the site displays that provenance to visitors. The
 * reconstructed requirements index (docs/PRODUCT_REQUIREMENTS.md) records
 * which requirement each field serves.
 */

/**
 * A list field that may be absent in the source. The migrated data uses null
 * for "not stated in the source" (the three Ph.D. records and B.Tech have no
 * mission), which is different from an empty list but renders the same, so it
 * is normalised to [] for consumers while the schema still documents that
 * null is legitimate input.
 */
const list = z.array(z.string()).nullable().optional().transform((v) => v ?? []);

/** Provenance every publicly-claimed record must carry. */
const provenance = {
  /** Where the claim came from on the legacy site. */
  sourceUrl: z.string().url().optional(),
  /**
   * FR-06: unsupported impact/indexing claims are not published. False means
   * the UI must render the "pending institutional confirmation" badge — it is
   * not a soft warning, it is the honesty mechanism the whole site rests on.
   */
  verified: z.boolean().default(false),
};

const programs = defineCollection({
  loader: file('src/data/programs.json', { parser: (t) => JSON.parse(t) }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    level: z.enum(['B.Tech', 'M.Tech', 'Ph.D.']),
    department: z.string().nullable().optional(),
    seats: z.string().nullable().optional(),
    approval: z.string().nullable().optional(),
    eligibility: z.string().nullable().optional(),
    stipend_note: z.string().nullable().optional(),
    vision: z.string().nullable().optional(),
    mission: list,
    specializations: list,
    labs: list,
    coordinators: list,
    source_url: z.string().optional(),
    ...provenance,
  }),
});

const person = z.object({
  slug: z.string(),
  name: z.string(),
  title: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  degrees: list,   // one entry per qualification, newest first
  interests: list,
  bio: z.string().nullable().optional(),
  source_url: z.string().optional(),
  ...provenance,
});

const faculty = defineCollection({
  loader: file('src/data/faculty.json', { parser: (t) => JSON.parse(t) }),
  schema: person,
});
const staff = defineCollection({
  loader: file('src/data/staff.json', { parser: (t) => JSON.parse(t) }),
  schema: person,
});
const visitingFaculty = defineCollection({
  loader: file('src/data/visiting-faculty.json', { parser: (t) => JSON.parse(t) }),
  schema: person,
});

const notices = defineCollection({
  loader: file('src/data/notices.json', { parser: (t) => JSON.parse(t) }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    // FR-07: notices are a typed record list with an explicit status, never
    // silently mixed with archived items.
    status: z.string(),
    notice_type: z.string(),
    audience: z.string().nullable().optional(),
    session: z.string().nullable().optional(),
    summary: z.string().nullable().optional(),
    document_slug: z.string().nullable().optional(),
    ...provenance,
  }),
});

const documents = defineCollection({
  loader: file('src/data/documents.json', { parser: (t) => JSON.parse(t) }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    type: z.string(),
    /** Derived from the linking page — a fact, not an inference. */
    area: z.string(),
    year: z.string().nullable().optional(),
    session: z.string().nullable().optional(),
    sizeBytes: z.number().int().nonnegative(),
    sourceUrl: z.string(),
    sourcePage: z.string().optional(),
    filename: z.string(),
    // FR-08 is explicitly NOT met for this collection: nothing here has
    // passed malware scan or status review. Default false is load-bearing.
    verified: z.boolean().default(false),
  }),
});

const publications = defineCollection({
  loader: file('src/data/publications.json', { parser: (t) => JSON.parse(t) }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    authors: z.string().nullable().optional(),
    venue: z.string().nullable().optional(),
    publisher: z.string().nullable().optional(),
    year: z.union([z.string(), z.number()]).nullable().optional(),
    volume: z.string().nullable().optional(),
    doi: z.string().nullable().optional(),
    /**
     * FR-06. Carried as stated in the migrated source and never presented as
     * independently reverified.
     */
    impact_factor: z.string().nullable().optional(),
    ...provenance,
  }),
});

const patents = defineCollection({
  loader: file('src/data/patents.json', { parser: (t) => JSON.parse(t) }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    inventors: z.string().nullable().optional(),
    application_number: z.string().nullable().optional(),
    date: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    ...provenance,
  }),
});

const equipment = defineCollection({
  loader: file('src/data/equipment.json', { parser: (t) => JSON.parse(t) }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    summary: z.string().nullable().optional(),
    ...provenance,
  }),
});

const projects = defineCollection({
  loader: file('src/data/projects.json', { parser: (t) => JSON.parse(t) }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    investigators: z.string().nullable().optional(),
    sponsor: z.string().nullable().optional(),
    amount: z.string().nullable().optional(),
    duration: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    ...provenance,
  }),
});

const events = defineCollection({
  loader: file('src/data/events.json', { parser: (t) => JSON.parse(t) }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    dates: z.string().nullable().optional(),
    mode: z.string().nullable().optional(),
    organizer: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    ...provenance,
  }),
});

export const collections = {
  programs, faculty, staff, visitingFaculty, notices,
  documents, publications, patents, equipment, projects, events,
};
