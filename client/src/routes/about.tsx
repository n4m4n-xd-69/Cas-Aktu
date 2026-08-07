import type { Route } from './+types/about';

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'About | Centre for Advanced Studies' },
    {
      name: 'description',
      content: 'S1 scaffold placeholder. The real about page is built at S4.',
    },
  ];
}

/** S1 placeholder: probes the single-segment URL shape (/about/). */
export default function About() {
  return (
    <>
      <h1>About</h1>
      <p>S1 scaffold. Content arrives at S4.</p>
    </>
  );
}
