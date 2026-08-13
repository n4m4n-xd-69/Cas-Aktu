import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const SRC = 'source-assets/images';
const OUT = 'public/assets/home';

/** file: path under source-assets/images · alt: written by hand, never a filename */
const SETS = {
  hero: {
    width: 2400,
    // Fix-round (curation findings, see task-4-report.md "Fix round"): slide 0 is the
    // LCP image and stays at the set default 2400px. Slides 1-3 crossfade behind a
    // headline and are never inspected closely, so they now render at 1800px
    // (per-item `width` override below) — ~40% fewer bytes, spent on stronger frames
    // instead of the byte-constrained ones the first pass shipped.
    items: [
      {
        file: '3-d79113381dee.jpg',
        webpQuality: 58,
        jpegQuality: 55,
        alt: 'The Centre for Advanced Studies building at AKTU Lucknow, viewed from the entrance plaza with its signage and forecourt',
      },
      {
        file: '3-3e3165184a5b.jpg',
        width: 1800,
        // Busy frame (bookshelves are high-frequency detail) — overridden down to
        // clear the whole-directory cap alongside hero-03 below.
        webpQuality: 64,
        jpegQuality: 56,
        alt: 'A bright reading room in the CAS library, with study tables and floor-to-ceiling bookshelves',
      },
      {
        file: '5-a5d54dc84361.jpg',
        width: 1800,
        // Busiest frame in the set (foliage/facade detail compresses poorly, same
        // failure mode the first curation pass hit at 2400px) — overridden down.
        webpQuality: 60,
        jpegQuality: 54,
        alt: 'A low-angle view of the Centre for Advanced Studies building, its red entrance columns and rooftop signage against the sky',
      },
      {
        file: '3-fb8defe50f10.jpg',
        width: 1800,
        alt: "Researchers' workbench in the CAS materials chemistry laboratory, lined with instrumentation and fume hoods",
      },
    ],
  },
  campus: {
    width: 600,
    items: [
      {
        file: '4-34063d4e9ecc.jpg',
        alt: 'Lounge seating and bookshelves in the CAS library, with a bust overlooking the reading area',
      },
      {
        file: '3-669366fe798c.jpg',
        alt: 'A CAS lecture classroom with a chalkboard, projector screen and rows of desks',
      },
      {
        file: '4-ccec8fb2c96b.jpg',
        alt: 'The student common room at CAS, with a table tennis table and seating by the windows',
      },
      {
        file: '4-46faf9320821.jpg',
        alt: 'A long, sunlit corridor lined with classroom doors at CAS',
      },
    ],
  },
  labs: {
    width: 800,
    items: [
      {
        file: '1-5fcd0cbb627a.jpeg',
        alt: 'An orange industrial robotic arm mounted on a fixture table in the CAS robotics laboratory',
      },
      {
        file: '4-41f19077f0e7.jpg',
        alt: 'A surface characterisation instrument on a bench in the CAS nanotechnology laboratory',
      },
      {
        file: '4-0bd47e2301fe.jpg',
        alt: 'A row of fume hoods and safety cabinets in the CAS materials laboratory',
      },
      {
        file: '5-119a0fd0e142.jpg',
        alt: "A scale-model CyberCity simulation table used for cybersecurity and smart-infrastructure research at CAS",
      },
      {
        file: '3-64f20bd9819f.jpg',
        alt: 'Automated assembly and inspection stations on the factory floor of the CAS industrial automation laboratory',
      },
    ],
  },
  // Fix-round (curation finding 2): #3 and #4 were unpeopled rooms facing blank
  // projection screens (near-duplicates of each other) — replaced with two more
  // individually-verified real photographs from images/python (the rest of that
  // bucket, plus images/seminar, images/workshop23 and images/ai, were re-checked
  // frame by frame and confirmed to be 100% poster/flyer graphics, no photographs
  // among them — see task-4-report.md). #2 stays: no cleanly better people-in-
  // classroom substitute turned up for it specifically (see report).
  programs: {
    width: 800,
    items: [
      {
        file: 'py5-632d6d817220.jpg',
        alt: 'Students at laptops during a Python programming workshop at CAS, with an instructor presenting',
      },
      {
        file: '1-aab9d938ce00.jpg',
        alt: 'A packed classroom of students following a technical workshop session at CAS',
      },
      {
        file: 'py6-ec90796b2ee3.jpg',
        alt: 'Instructors addressing a full Python workshop classroom, with students seated at laptop workstations and a projection screen at the front',
      },
      {
        file: 'py1-aa3e36bc3aa5.jpg',
        alt: 'Students working at laptops in a packed coding workshop at CAS, with instructors observing at the back of the room',
      },
      {
        file: 'gpl-0b63f288b762.jpg',
        alt: 'Rows of workstations in the CAS General Purpose computer laboratory',
      },
    ],
  },
  // Fix-round (curation finding 1): areas stays instrument- and facility-led. The
  // three frames that used to live here (solar install, CyberCity, 3D printer) read
  // as outcomes/demonstrations, not facilities, so they moved to `innovations`.
  // Backfilled with three of the four equipment close-ups that used to sit in
  // `innovations` — they're exactly the "instrument-led" material this set wants,
  // already clean/uncaptioned/byte-verified from the first curation pass.
  areas: {
    width: 800,
    items: [
      {
        file: '5-d0bab9192228.jpg',
        alt: 'A Zeiss GeminiSEM scanning electron microscope in the CAS nanotechnology laboratory',
      },
      {
        file: 'ai2-52524885e979.jpeg',
        alt: 'Server racks in the CAS artificial intelligence and computing laboratory',
      },
      {
        file: 'tga-8358d7b52d43.jpg',
        alt: 'A simultaneous thermal analyser used for materials research at CAS',
      },
      {
        file: 'fpw-f95205eb1435.jpg',
        alt: 'A precision stereo microscope measurement setup in a CAS laboratory',
      },
      {
        file: 'ldtc-e4e270250f2a.jpg',
        alt: "A Lee's disc apparatus used for thermal conductivity experiments at CAS",
      },
    ],
  },
  // Fix-round (curation finding 1): the old four equipment close-ups here didn't
  // signal an idea, prototype, demonstration or outcome — swapped for frames that
  // show CAS research becoming something tangible: a printer mid-print, a student
  // wiring up solar panels, the CyberCity smart-city model (in close-up and as the
  // full installation being viewed), and students flying a competition drone.
  innovations: {
    width: 800,
    items: [
      {
        file: '2-e02b0f1d7ed1.jpg',
        alt: 'A 3D printer mid-print on an orange plumbing fitting in the CAS 3D printing lab, with a finished part sitting beside it',
      },
      {
        file: 'est3-3213b51d6fc8.jpg',
        alt: 'A student assembling a rooftop solar panel array for CAS energy research',
      },
      {
        file: '1-feb83970814a.jpg',
        alt: 'A model train passing through a miniature smart-city installation used for CAS cybersecurity research',
      },
      {
        file: '1-9-c487927f4a0b.jpeg',
        webpQuality: 62,
        alt: 'Students flying a racing drone on the CAS lawn during a technical festival',
      },
      {
        file: '2-6b2da2bae044.jpg',
        alt: 'The full CyberCity smart-city model in the CAS cyber lab — a miniature metro, power plant and water-treatment works — with two people viewing it beside a wall display',
      },
    ],
  },
  // Fix-round (curation finding 1): #2 (the drone photo) moved to `innovations`,
  // where it reads as a demonstrated outcome rather than community life. Backfilled
  // with another candid, on-campus, non-ceremonial frame from the same event.
  life: {
    width: 800,
    // Byte-budget escalation (brief step 4): default webp quality 78 put three
    // busy outdoor-crowd frames over the 70KB/image cap; 72 still left one frame
    // within ~500 bytes of the cap. Dropped to 68 for a safe margin.
    webpQuality: 68,
    items: [
      {
        file: '1-8-b3381beba030.jpeg',
        alt: "Students at a robotics obstacle course on the CAS lawn, with the campus's two landmark buildings behind",
      },
      {
        file: '1-5-1cc897810aa9.jpeg',
        // Busy crowd frame — the set-wide quality-68 override still left this over
        // the 70KB/image cap; pushed down further, matching the escalation the
        // first curation pass already applied to this same set.
        webpQuality: 56,
        alt: 'Students and staff crowding a balcony to watch a robot-combat competition below during a CAS technical festival',
      },
      {
        file: '1-9b669eed82ab.jpg',
        alt: 'Students operating a wired robot on an obstacle track during the Kalam Technical Fest at CAS',
      },
      {
        file: '4-455d6bb1e7aa.jpg',
        alt: 'Students steering a wired rover through an obstacle course as onlookers watch at CAS',
      },
      {
        file: 'cl2-a9219695af58.jpg',
        alt: "A chalkboard decorated for Teacher's Day celebrations at CAS, with balloons and a cake",
      },
    ],
  },
};

await rm(OUT, { recursive: true, force: true });

const manifest = {};

for (const [set, { width, items, webpQuality = 78 }] of Object.entries(SETS)) {
  await mkdir(path.join(OUT, set), { recursive: true });
  manifest[set] = [];

  for (const [
    i,
    { file, alt, width: itemWidth, webpQuality: itemWebpQuality, jpegQuality: itemJpegQuality },
  ] of items.entries()) {
    const name = `${set}-${String(i + 1).padStart(2, '0')}`;
    const input = path.join(SRC, file);
    const base = sharp(input).resize({ width: itemWidth ?? width, withoutEnlargement: true });

    // jpg is the no-webp fallback path; quality 68 (not the brief template's 82)
    // because the whole-directory 4MB cap (webp+jpg together) needed it — see report.
    await base
      .clone()
      .jpeg({ quality: itemJpegQuality ?? 68, mozjpeg: true })
      .toFile(path.join(OUT, set, `${name}.jpg`));
    await base
      .clone()
      .webp({ quality: itemWebpQuality ?? webpQuality })
      .toFile(path.join(OUT, set, `${name}.webp`));

    manifest[set].push({ src: `/assets/home/${set}/${name}.jpg`, webp: `/assets/home/${set}/${name}.webp`, alt });
  }
}

console.log(JSON.stringify(manifest, null, 2));
