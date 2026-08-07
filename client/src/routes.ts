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
export default [
  index('routes/home.tsx'),
  route('about', 'routes/about.tsx'),
  route('people/faculty/:slug', 'routes/person.tsx'),
] satisfies RouteConfig;
