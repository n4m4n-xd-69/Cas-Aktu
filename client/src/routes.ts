import { type RouteConfig, index, route } from '@react-router/dev/routes';

/**
 * Route tree.
 *
 * S4: building the full 392-page route tree. Groups completed:
 *   - Group 1: Home (1 page)
 *   - Group 2: Core pages (7 pages)
 *   - Group 3: Academics (14 pages)
 *   - Group 4: People (64 pages)
 *
 * Remaining: Groups 5-9 (306 pages).
 */
const routes: RouteConfig = [
  // Home
  index('routes/home.tsx'),

  // Core pages (Group 2)
  route('about', 'routes/about.tsx'),
  route('contact', 'routes/contact.tsx'),
  route('campus', 'routes/campus.tsx'),
  route('admissions', 'routes/admissions.tsx'),
  route('search', 'routes/search.tsx'),
  route('accessibility', 'routes/accessibility.tsx'),
  route('sitemap', 'routes/sitemap.tsx'),

  // Academics (Group 3)
  route('academics', 'routes/academics.tsx', [
    index('routes/academics.index.tsx'),
    route('btech', 'routes/academics.btech.tsx'),
    route('mtech', 'routes/academics.mtech.tsx'),
    route('phd', 'routes/academics.phd.tsx'),
    route('programs', 'routes/academics.programs.tsx', [
      index('routes/academics.programs.index.tsx'),
      route(':slug', 'routes/academics.programs.$slug.tsx'),
    ]),
  ]),

  // People (Group 4)
  route('people', 'routes/people.tsx', [
    index('routes/people.index.tsx'),
    route('faculty', 'routes/people.faculty.tsx', [
      index('routes/people.faculty.index.tsx'),
      route(':slug', 'routes/people.faculty.$slug.tsx'),
    ]),
    route('former', 'routes/people.former.tsx', [
      index('routes/people.former.index.tsx'),
      route(':slug', 'routes/people.former.$slug.tsx'),
    ]),
    route('visiting', 'routes/people.visiting.tsx', [
      index('routes/people.visiting.index.tsx'),
      route(':slug', 'routes/people.visiting.$slug.tsx'),
    ]),
    route('staff', 'routes/people.staff.tsx', [
      index('routes/people.staff.index.tsx'),
      route(':slug', 'routes/people.staff.$slug.tsx'),
    ]),
  ]),
];

/**
 * Development-only component gallery, added at S2.
 *
 * Registered only when NODE_ENV is not "production", so it is never built,
 * never prerendered, and never reachable from the deployed site. It is the
 * verification surface for the primitives — every variant rendered on one
 * page, in both themes — and stays useful as the library grows through S4-S8.
 */
if (process.env.NODE_ENV !== 'production') {
  routes.push(route('_primitives', 'routes/_primitives.tsx'));
}

export default routes;
