import type { CrossfadeSlide } from '~/components/Crossfade';

export type MediaSlide = CrossfadeSlide;

export type CardKey = 'labs' | 'programs' | 'areas' | 'innovations' | 'life';

/**
 * Four slides, 3s each. Slide 0 is the LCP image and renders at 2400px; slides
 * 1-3 crossfade behind a headline and are never inspected closely, so they render
 * at 1800px (see scripts/build-home-media.mjs) — fix-round change, see
 * task-4-report.md "Fix round" for why.
 */
export const HERO_SLIDES: readonly MediaSlide[] = [
  {
    src: '/assets/home/hero/hero-01.jpg',
    webp: '/assets/home/hero/hero-01.webp',
    alt: 'The Centre for Advanced Studies building at AKTU Lucknow, viewed from the entrance plaza with its signage and forecourt',
  },
  {
    src: '/assets/home/hero/hero-02.jpg',
    webp: '/assets/home/hero/hero-02.webp',
    alt: 'A bright reading room in the CAS library, with study tables and floor-to-ceiling bookshelves',
  },
  {
    src: '/assets/home/hero/hero-03.jpg',
    webp: '/assets/home/hero/hero-03.webp',
    alt: 'A low-angle view of the Centre for Advanced Studies building, its red entrance columns and rooftop signage against the sky',
  },
  {
    src: '/assets/home/hero/hero-04.jpg',
    webp: '/assets/home/hero/hero-04.webp',
    alt: "Researchers' workbench in the CAS materials chemistry laboratory, lined with instrumentation and fume hoods",
  },
];

/** Static grid — no rotation. */
export const CAMPUS_TOUR: readonly MediaSlide[] = [
  {
    src: '/assets/home/campus/campus-01.jpg',
    webp: '/assets/home/campus/campus-01.webp',
    alt: 'Lounge seating and bookshelves in the CAS library, with a bust overlooking the reading area',
  },
  {
    src: '/assets/home/campus/campus-02.jpg',
    webp: '/assets/home/campus/campus-02.webp',
    alt: 'A CAS lecture classroom with a chalkboard, projector screen and rows of desks',
  },
  {
    src: '/assets/home/campus/campus-03.jpg',
    webp: '/assets/home/campus/campus-03.webp',
    alt: 'The student common room at CAS, with a table tennis table and seating by the windows',
  },
  {
    src: '/assets/home/campus/campus-04.jpg',
    webp: '/assets/home/campus/campus-04.webp',
    alt: 'A long, sunlit corridor lined with classroom doors at CAS',
  },
];

/** Five slides per tile, 5s each, staggered 800ms apart by CardStrip. */
export const CARD_SETS: Record<CardKey, readonly MediaSlide[]> = {
  labs: [
    {
      src: '/assets/home/labs/labs-01.jpg',
      webp: '/assets/home/labs/labs-01.webp',
      alt: 'An orange industrial robotic arm mounted on a fixture table in the CAS robotics laboratory',
    },
    {
      src: '/assets/home/labs/labs-02.jpg',
      webp: '/assets/home/labs/labs-02.webp',
      alt: 'A surface characterisation instrument on a bench in the CAS nanotechnology laboratory',
    },
    {
      src: '/assets/home/labs/labs-03.jpg',
      webp: '/assets/home/labs/labs-03.webp',
      alt: 'A row of fume hoods and safety cabinets in the CAS materials laboratory',
    },
    {
      src: '/assets/home/labs/labs-04.jpg',
      webp: '/assets/home/labs/labs-04.webp',
      alt: 'A scale-model CyberCity simulation table used for cybersecurity and smart-infrastructure research at CAS',
    },
    {
      src: '/assets/home/labs/labs-05.jpg',
      webp: '/assets/home/labs/labs-05.webp',
      alt: 'Automated assembly and inspection stations on the factory floor of the CAS industrial automation laboratory',
    },
  ],
  /**
   * Fix-round (curation finding 2): #3 and #4 used to be unpeopled rooms facing
   * blank projection screens — replaced with two individually-verified real
   * photographs from images/python. #2 stays as-is; no cleanly better
   * people-in-classroom substitute turned up for it specifically. See
   * task-4-report.md "Fix round" for the full re-check of python/seminar/
   * workshop23/ai (only python had photographs; the rest are posters/flyers).
   */
  programs: [
    {
      src: '/assets/home/programs/programs-01.jpg',
      webp: '/assets/home/programs/programs-01.webp',
      alt: 'Students at laptops during a Python programming workshop at CAS, with an instructor presenting',
    },
    {
      src: '/assets/home/programs/programs-02.jpg',
      webp: '/assets/home/programs/programs-02.webp',
      alt: 'A packed classroom of students following a technical workshop session at CAS',
    },
    {
      src: '/assets/home/programs/programs-03.jpg',
      webp: '/assets/home/programs/programs-03.webp',
      alt: 'Instructors addressing a full Python workshop classroom, with students seated at laptop workstations and a projection screen at the front',
    },
    {
      src: '/assets/home/programs/programs-04.jpg',
      webp: '/assets/home/programs/programs-04.webp',
      alt: 'Students working at laptops in a packed coding workshop at CAS, with instructors observing at the back of the room',
    },
    {
      src: '/assets/home/programs/programs-05.jpg',
      webp: '/assets/home/programs/programs-05.webp',
      alt: 'Rows of workstations in the CAS General Purpose computer laboratory',
    },
  ],
  /**
   * Fix-round (curation finding 1): stays instrument- and facility-led. Three
   * frames that used to live here (solar install, CyberCity, 3D printer) read as
   * outcomes/demonstrations rather than facilities, so they moved to
   * `innovations`. Backfilled with three of the four equipment close-ups that
   * used to sit in `innovations` — already clean/uncaptioned/byte-verified from
   * the first curation pass.
   */
  areas: [
    {
      src: '/assets/home/areas/areas-01.jpg',
      webp: '/assets/home/areas/areas-01.webp',
      alt: 'A Zeiss GeminiSEM scanning electron microscope in the CAS nanotechnology laboratory',
    },
    {
      src: '/assets/home/areas/areas-02.jpg',
      webp: '/assets/home/areas/areas-02.webp',
      alt: 'Server racks in the CAS artificial intelligence and computing laboratory',
    },
    {
      src: '/assets/home/areas/areas-03.jpg',
      webp: '/assets/home/areas/areas-03.webp',
      alt: 'A simultaneous thermal analyser used for materials research at CAS',
    },
    {
      src: '/assets/home/areas/areas-04.jpg',
      webp: '/assets/home/areas/areas-04.webp',
      alt: 'A precision stereo microscope measurement setup in a CAS laboratory',
    },
    {
      src: '/assets/home/areas/areas-05.jpg',
      webp: '/assets/home/areas/areas-05.webp',
      alt: "A Lee's disc apparatus used for thermal conductivity experiments at CAS",
    },
  ],
  /**
   * Fix-round (curation finding 1): five slides, not four. The old four
   * equipment close-ups here didn't signal an idea, prototype, demonstration or
   * outcome, and were visually indistinguishable from `areas`/`labs` — swapped
   * for frames that show CAS research becoming something tangible: a printer
   * mid-print, a student wiring up solar panels, the CyberCity smart-city model
   * (in close-up and as the full installation being viewed), and students flying
   * a competition drone. See task-4-report.md "Fix round".
   */
  innovations: [
    {
      src: '/assets/home/innovations/innovations-01.jpg',
      webp: '/assets/home/innovations/innovations-01.webp',
      alt: 'A 3D printer mid-print on an orange plumbing fitting in the CAS 3D printing lab, with a finished part sitting beside it',
    },
    {
      src: '/assets/home/innovations/innovations-02.jpg',
      webp: '/assets/home/innovations/innovations-02.webp',
      alt: 'A student assembling a rooftop solar panel array for CAS energy research',
    },
    {
      src: '/assets/home/innovations/innovations-03.jpg',
      webp: '/assets/home/innovations/innovations-03.webp',
      alt: 'A model train passing through a miniature smart-city installation used for CAS cybersecurity research',
    },
    {
      src: '/assets/home/innovations/innovations-04.jpg',
      webp: '/assets/home/innovations/innovations-04.webp',
      alt: 'Students flying a racing drone on the CAS lawn during a technical festival',
    },
    {
      src: '/assets/home/innovations/innovations-05.jpg',
      webp: '/assets/home/innovations/innovations-05.webp',
      alt: 'The full CyberCity smart-city model in the CAS cyber lab — a miniature metro, power plant and water-treatment works — with two people viewing it beside a wall display',
    },
  ],
  /**
   * Fix-round (curation finding 1): #2 (the drone photo) moved to
   * `innovations`, where it reads as a demonstrated outcome rather than
   * community life. Backfilled with another candid, on-campus, non-ceremonial
   * frame from the same event.
   */
  life: [
    {
      src: '/assets/home/life/life-01.jpg',
      webp: '/assets/home/life/life-01.webp',
      alt: "Students at a robotics obstacle course on the CAS lawn, with the campus's two landmark buildings behind",
    },
    {
      src: '/assets/home/life/life-02.jpg',
      webp: '/assets/home/life/life-02.webp',
      alt: 'Students and staff crowding a balcony to watch a robot-combat competition below during a CAS technical festival',
    },
    {
      src: '/assets/home/life/life-03.jpg',
      webp: '/assets/home/life/life-03.webp',
      alt: 'Students operating a wired robot on an obstacle track during the Kalam Technical Fest at CAS',
    },
    {
      src: '/assets/home/life/life-04.jpg',
      webp: '/assets/home/life/life-04.webp',
      alt: 'Students steering a wired rover through an obstacle course as onlookers watch at CAS',
    },
    {
      src: '/assets/home/life/life-05.jpg',
      webp: '/assets/home/life/life-05.webp',
      alt: "A chalkboard decorated for Teacher's Day celebrations at CAS, with balloons and a cake",
    },
  ],
};
