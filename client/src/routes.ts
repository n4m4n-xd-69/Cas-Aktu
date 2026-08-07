import { type RouteConfig, index, route } from '@react-router/dev/routes';

/**
 * S1 probe routes.
 *
 * These exist to prove the prerenderer's output shape, not to represent the
 * site. They cover the three URL forms the live site uses:
 *
 *   /                            root
 *   /about                       single segment
 *   /people/faculty/:slug        deep path with a dynamic segment
 *
 * The real route tree — ~20 modules generating 392 pages — is built at S4.
 */
const routes: RouteConfig = [
  index('routes/home.tsx'),
  route('about', 'routes/about.tsx'),
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
