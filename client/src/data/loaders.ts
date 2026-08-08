/**
 * Data loaders — the single CMS swap point.
 *
 * Route modules import from here, never from JSON directly. When the Python
 * generator is retired at S7 and this switches to a headless CMS, only this
 * file changes. Routes stay unchanged.
 *
 * All collections are imported synchronously — React Router's prerenderer runs
 * these loaders at build time, not in the browser, so there is no fetch cost
 * and no bundle-size penalty for importing all the JSON at once. The data is
 * baked into each route's prerendered HTML.
 */

import type {
  Document,
  Equipment,
  Event,
  Notice,
  Patent,
  Person,
  Program,
  Project,
  Publication,
} from './schema';

// JSON imports are side-effect-free at build time. Vite resolves these as
// regular ES modules (not dynamic imports) because the paths are static.
import documentsJson from './collections/documents.json';
import equipmentJson from './collections/equipment.json';
import eventsJson from './collections/events.json';
import facultyJson from './collections/faculty.json';
import formerFacultyJson from './collections/former-faculty.json';
import noticesJson from './collections/notices.json';
import patentsJson from './collections/patents.json';
import programsJson from './collections/programs.json';
import projectsJson from './collections/projects.json';
import publicationsJson from './collections/publications.json';
import staffJson from './collections/staff.json';
import visitingFacultyJson from './collections/visiting-faculty.json';

/* ------------------------------------------------------------------ *
 * Programs
 * ------------------------------------------------------------------ */

export function getPrograms(): Program[] {
  return programsJson as Program[];
}

export function getProgram(slug: string): Program | null {
  return getPrograms().find((p) => p.slug === slug) ?? null;
}

/* ------------------------------------------------------------------ *
 * People
 * ------------------------------------------------------------------ */

export function getFaculty(): Person[] {
  return facultyJson as Person[];
}

export function getFormerFaculty(): Person[] {
  return formerFacultyJson as Person[];
}

export function getStaff(): Person[] {
  return staffJson as Person[];
}

export function getVisitingFaculty(): Person[] {
  return visitingFacultyJson as Person[];
}

/**
 * All people (current + former + staff + visiting), in the order the four
 * collections were exported. Used nowhere today, but here in case a future
 * route needs a combined directory.
 */
export function getAllPeople(): Person[] {
  return [
    ...getFaculty(),
    ...getFormerFaculty(),
    ...getStaff(),
    ...getVisitingFaculty(),
  ];
}

export function getPerson(slug: string): Person | null {
  return getAllPeople().find((p) => p.slug === slug) ?? null;
}

/* ------------------------------------------------------------------ *
 * Notices
 * ------------------------------------------------------------------ */

export function getNotices(): Notice[] {
  return noticesJson as Notice[];
}

export function getNotice(slug: string): Notice | null {
  return getNotices().find((n) => n.slug === slug) ?? null;
}

/* ------------------------------------------------------------------ *
 * Events
 * ------------------------------------------------------------------ */

export function getEvents(): Event[] {
  return eventsJson as Event[];
}

export function getEvent(id: string): Event | null {
  return getEvents().find((e) => e.id === id) ?? null;
}

/* ------------------------------------------------------------------ *
 * Publications
 * ------------------------------------------------------------------ */

export function getPublications(): Publication[] {
  return publicationsJson as Publication[];
}

export function getPublication(id: string): Publication | null {
  return getPublications().find((p) => p.id === id) ?? null;
}

/* ------------------------------------------------------------------ *
 * Patents
 * ------------------------------------------------------------------ */

export function getPatents(): Patent[] {
  return patentsJson as Patent[];
}

export function getPatent(id: string): Patent | null {
  return getPatents().find((p) => p.id === id) ?? null;
}

/* ------------------------------------------------------------------ *
 * Equipment
 * ------------------------------------------------------------------ */

export function getEquipment(): Equipment[] {
  return equipmentJson as Equipment[];
}

export function getEquipmentItem(id: string): Equipment | null {
  return getEquipment().find((e) => e.id === id) ?? null;
}

/* ------------------------------------------------------------------ *
 * Projects
 * ------------------------------------------------------------------ */

export function getProjects(): Project[] {
  return projectsJson as Project[];
}

export function getProject(id: string): Project | null {
  return getProjects().find((p) => p.id === id) ?? null;
}

/* ------------------------------------------------------------------ *
 * Documents
 * ------------------------------------------------------------------ */

export function getDocuments(): Document[] {
  return documentsJson as Document[];
}

export function getDocument(slug: string): Document | null {
  return getDocuments().find((d) => d.slug === slug) ?? null;
}

/**
 * Document counts by type, for the faceted filter UI at S5.
 *
 * Returns a map of type → count, sorted descending by count. The current
 * Python build's facet rail is driven by an identical grouping in
 * pages/documents_pages.py.
 */
export function getDocumentTypeCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const doc of getDocuments()) {
    counts.set(doc.type, (counts.get(doc.type) ?? 0) + 1);
  }
  return new Map([...counts.entries()].sort((a, b) => b[1] - a[1]));
}

/**
 * Document counts by area, for the faceted filter UI at S5.
 */
export function getDocumentAreaCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const doc of getDocuments()) {
    counts.set(doc.area, (counts.get(doc.area) ?? 0) + 1);
  }
  return new Map([...counts.entries()].sort((a, b) => b[1] - a[1]));
}
