import type { CrossfadeSlide } from '~/components/Crossfade';

export type MediaSlide = CrossfadeSlide;

export type CardKey = 'labs' | 'programs' | 'areas' | 'innovations' | 'life';

/** Four slides, 3s each. Slide 0 is the LCP image. */
export const HERO_SLIDES: readonly MediaSlide[] = [
  {
    src: '/assets/home/hero/hero-01.jpg',
    webp: '/assets/home/hero/hero-01.webp',
    alt: 'The Centre for Advanced Studies building at AKTU Lucknow, viewed from the entrance plaza with its signage and forecourt',
  },
  {
    src: '/assets/home/hero/hero-02.jpg',
    webp: '/assets/home/hero/hero-02.webp',
    alt: 'An industrial robotic arm inside a glass safety enclosure in the CAS automation laboratory',
  },
  {
    src: '/assets/home/hero/hero-03.jpg',
    webp: '/assets/home/hero/hero-03.webp',
    alt: 'An angled street view of the Centre for Advanced Studies building along the AKTU campus road',
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
      alt: 'The Shanti Swaroop Bhatnagar seminar hall at CAS, set up with a lectern and projection screen',
    },
    {
      src: '/assets/home/programs/programs-04.jpg',
      webp: '/assets/home/programs/programs-04.webp',
      alt: 'The MOOC recording room at CAS, used for producing online course content',
    },
    {
      src: '/assets/home/programs/programs-05.jpg',
      webp: '/assets/home/programs/programs-05.webp',
      alt: 'Rows of workstations in the CAS General Purpose computer laboratory',
    },
  ],
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
      alt: 'A student assembling a rooftop solar panel array for CAS energy research',
    },
    {
      src: '/assets/home/areas/areas-04.jpg',
      webp: '/assets/home/areas/areas-04.webp',
      alt: 'A model train passing through a miniature smart-city installation used for CAS cybersecurity research',
    },
    {
      src: '/assets/home/areas/areas-05.jpg',
      webp: '/assets/home/areas/areas-05.webp',
      alt: 'A Stratasys 3D printer with its lid open in the CAS additive manufacturing lab',
    },
  ],
  /**
   * Four slides, not five. images/innov (32 candidates) is entirely academic
   * conference-style posters, not photographs; images/devices (7 candidates) is
   * real product photography but every frame carries a baked-in caption band.
   * Both violate the brief's no-burnt-in-text rule wholesale. Substituted with
   * clean, uncaptioned instrumentation photography from images/equip, but only
   * four frames there cleared both the "no watermark/date-stamp" and resolution
   * bars — see task-4-report.md.
   */
  innovations: [
    {
      src: '/assets/home/innovations/innovations-01.jpg',
      webp: '/assets/home/innovations/innovations-01.webp',
      alt: 'A simultaneous thermal analyser used for materials research at CAS',
    },
    {
      src: '/assets/home/innovations/innovations-02.jpg',
      webp: '/assets/home/innovations/innovations-02.webp',
      alt: 'A precision stereo microscope measurement setup in a CAS laboratory',
    },
    {
      src: '/assets/home/innovations/innovations-03.jpg',
      webp: '/assets/home/innovations/innovations-03.webp',
      alt: "A Lee's disc apparatus used for thermal conductivity experiments at CAS",
    },
    {
      src: '/assets/home/innovations/innovations-04.jpg',
      webp: '/assets/home/innovations/innovations-04.webp',
      alt: 'A Hall effect measurement apparatus used in CAS materials research',
    },
  ],
  life: [
    {
      src: '/assets/home/life/life-01.jpg',
      webp: '/assets/home/life/life-01.webp',
      alt: "Students at a robotics obstacle course on the CAS lawn, with the campus's two landmark buildings behind",
    },
    {
      src: '/assets/home/life/life-02.jpg',
      webp: '/assets/home/life/life-02.webp',
      alt: 'Students flying a racing drone on the CAS lawn during a technical festival',
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
