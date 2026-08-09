import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const SRC = 'source-assets/images';
const OUT = 'public/assets/home';

/** file: path under source-assets/images · alt: written by hand, never a filename */
const SETS = {
  hero: {
    width: 2400,
    // Byte-budget escalation (brief step 4): tried set-wide quality 72, still busted
    // the 220KB/image cap on both exterior frames (foliage/facade detail compresses
    // poorly at 2400px). Per-item overrides below on the two exteriors; interiors
    // stay at the set default because they were already comfortably under cap.
    items: [
      {
        file: '3-d79113381dee.jpg',
        webpQuality: 58,
        jpegQuality: 55,
        alt: 'The Centre for Advanced Studies building at AKTU Lucknow, viewed from the entrance plaza with its signage and forecourt',
      },
      {
        file: '2-93fd68a4c727.jpg',
        alt: 'An industrial robotic arm inside a glass safety enclosure in the CAS automation laboratory',
      },
      {
        file: '4-bc803ec1f7ad.jpg',
        webpQuality: 46,
        jpegQuality: 55,
        alt: 'An angled street view of the Centre for Advanced Studies building along the AKTU campus road',
      },
      {
        file: '3-fb8defe50f10.jpg',
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
        file: '4-02ca26960854.jpg',
        alt: 'The Shanti Swaroop Bhatnagar seminar hall at CAS, set up with a lectern and projection screen',
      },
      {
        file: '4-57ee06ff0e16.jpg',
        alt: 'The MOOC recording room at CAS, used for producing online course content',
      },
      {
        file: 'gpl-0b63f288b762.jpg',
        alt: 'Rows of workstations in the CAS General Purpose computer laboratory',
      },
    ],
  },
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
        file: 'est3-3213b51d6fc8.jpg',
        alt: 'A student assembling a rooftop solar panel array for CAS energy research',
      },
      {
        file: '1-feb83970814a.jpg',
        alt: 'A model train passing through a miniature smart-city installation used for CAS cybersecurity research',
      },
      {
        file: '3-42a89367c41f.jpg',
        alt: 'A Stratasys 3D printer with its lid open in the CAS additive manufacturing lab',
      },
    ],
  },
  innovations: {
    width: 800,
    items: [
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
      {
        file: 'hem-b2c097433daf.jpg',
        alt: 'A Hall effect measurement apparatus used in CAS materials research',
      },
    ],
  },
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
        file: '1-9-c487927f4a0b.jpeg',
        alt: 'Students flying a racing drone on the CAS lawn during a technical festival',
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

  for (const [i, { file, alt, webpQuality: itemWebpQuality, jpegQuality: itemJpegQuality }] of items.entries()) {
    const name = `${set}-${String(i + 1).padStart(2, '0')}`;
    const input = path.join(SRC, file);
    const base = sharp(input).resize({ width, withoutEnlargement: true });

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
