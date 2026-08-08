import type { Config } from '@react-router/dev/config';

export default {
  // The design spec lays the app out as src/components, src/routes, src/styles
  // rather than React Router's default `app/`. See
  // docs/superpowers/specs/2026-08-07-react-migration-design.md section 5.
  appDirectory: 'src',

  // NOT the default `build/`. The repository root already contains build/ —
  // the Python static site generator — and this app is nested one level down,
  // so a default-named output directory invites confusion between the two
  // during the stages where both exist.
  buildDirectory: 'dist',

  // Prerendered SPA: loaders run at build time and every listed URL is written
  // as a complete HTML document, then hydrates client-side. This is the
  // mechanism that keeps 392 indexed URLs crawlable without a server.
  ssr: false,

  // S4 prerender list.
  // Group 1 (Home): 1 route
  // Group 2 (Core): 7 routes
  // Group 3 (Academics): 14 routes
  // Group 4 (People): 64 routes (1 main + 4 categories + 59 profiles)
  prerender: [
    '/',
    '/about',
    '/contact',
    '/campus',
    '/admissions',
    '/search',
    '/accessibility',
    '/sitemap',
    '/academics',
    '/academics/btech',
    '/academics/mtech',
    '/academics/phd',
    '/academics/programs',
    '/academics/programs/mtech-cse',
    '/academics/programs/mtech-nanotechnology',
    '/academics/programs/mtech-energy-science-technology',
    '/academics/programs/mtech-mechatronics',
    '/academics/programs/mtech-manufacturing-technology-automation',
    '/academics/programs/phd-cse',
    '/academics/programs/phd-mechatronics',
    '/academics/programs/phd-nanotechnology',
    '/academics/programs/btech',
    '/people',
    '/people/faculty',
    '/people/faculty/anuj-kumar-sharma',
    '/people/faculty/saurabh-mishra',
    '/people/faculty/av-ullas',
    '/people/faculty/siddharth-yadav',
    '/people/faculty/vijay-singh',
    '/people/faculty/vibhu-kumar-tripathi',
    '/people/faculty/naresh-chandra-maurya',
    '/people/faculty/parul-singh',
    '/people/faculty/prachi-gupta',
    '/people/faculty/narendra-pal',
    '/people/faculty/hrishikesh-kumar-singh',
    '/people/faculty/chandramani-upadhyay',
    '/people/faculty/rohit-prakash',
    '/people/former',
    '/people/former/mk-dutta',
    '/people/former/manish-gaur',
    '/people/former/piyush-jaiswal',
    '/people/former/shiv-prakash',
    '/people/former/arun-kumar',
    '/people/former/rabesh-kumar-singh',
    '/people/former/jitendra-kumar',
    '/people/former/gopal-ji',
    '/people/former/pushpendra-kumar-singh-rathore',
    '/people/former/gyanprakash-d-maurya',
    '/people/former/dipesh-kumar-mishra',
    '/people/former/pappu-kumar-harijan',
    '/people/former/prateek-raj-gautam',
    '/people/former/jagrati-singh',
    '/people/former/manjari-shukla',
    '/people/former/ashu-sharma',
    '/people/former/sajal-agarwal',
    '/people/former/anupam-keshari',
    '/people/former/brajendra-singh-sengar',
    '/people/former/narendra-singh',
    '/people/former/dipesh-kumar',
    '/people/former/ramkrishna-sahoo',
    '/people/former/neelam-dayal',
    '/people/former/manish-raj',
    '/people/former/amrit-pal',
    '/people/former/chitra-singh',
    '/people/former/prashant-rawat',
    '/people/former/vrinda-yadav',
    '/people/former/anamika-jain',
    '/people/former/biswajit-mandal',
    '/people/former/varun-chitransh',
    '/people/former/chandresh-kumar-rastogi',
    '/people/visiting',
    '/people/visiting/kb-naik',
    '/people/visiting/vijay-tiwari',
    '/people/visiting/kv-arya',
    '/people/visiting/vrijendra-singh',
    '/people/visiting/manish-kumar',
    '/people/staff',
    '/people/staff/veer-vikram-singh',
    '/people/staff/diyanshu-chauhan',
    '/people/staff/gaurav-rai',
    '/people/staff/shubhi-pandey',
    '/people/staff/sadka-kouser',
    '/people/staff/ram-kumar-pathak',
    '/people/staff/anurag-chaubey',
    '/people/staff/monika-singh',
    '/people/staff/mukesh-kumar-mourya',
  ],
} satisfies Config;
