import type { Route } from './+types/person';

/**
 * Runs at build time, not in the browser: with ssr:false plus a prerender
 * list, React Router executes loaders during the build and inlines the result.
 * This route exists to prove that, and to prove the deep dynamic URL shape
 * (/people/faculty/:slug/) survives prerendering.
 */
export function loader({ params }: Route.LoaderArgs) {
  return { slug: params.slug };
}

// `loaderData`, not `data` — the Remix-era name is gone in React Router 7+,
// and it is optional here because a route with an error boundary may render
// meta with no loader result.
export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: `${loaderData?.slug ?? 'Person'} | Centre for Advanced Studies` },
    { name: 'description', content: 'S1 scaffold placeholder.' },
  ];
}

export default function Person({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h1>{loaderData.slug}</h1>
      <p>S1 scaffold. Faculty profiles are built at S4 from the data layer.</p>
    </>
  );
}
