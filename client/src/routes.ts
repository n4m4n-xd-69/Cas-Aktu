import { type RouteConfig, index, route } from '@react-router/dev/routes';

/**
 * Route tree.
 *
 * S4: building the full 392-page route tree. Groups completed:
 *   - Group 1: Home (1 page)
 *   - Group 2: Core pages (7 pages)
 *
 * Remaining: Groups 3-9 (384 pages).
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

  // S1 probe route (will be replaced by dynamic person routes in Group 4)
  route('people/faculty/:slug', 'routes/person.tsx'),
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
