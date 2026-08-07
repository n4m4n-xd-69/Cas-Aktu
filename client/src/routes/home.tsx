import * as motion from 'motion/react-client';

import { transition } from '~/lib/motion';
import type { Route } from './+types/home';

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'Home | Centre for Advanced Studies' },
    {
      name: 'description',
      content: 'S1 scaffold placeholder. The real home page is built at S4.',
    },
  ];
}

/**
 * S1 placeholder. Exercises Motion inside a prerendered route to prove
 * animation does not break static generation or hydration.
 *
 * `initial={false}` is load-bearing, not stylistic. With `initial="hidden"`
 * the prerenderer writes the hidden state into the static HTML:
 *
 *     <div style="opacity:0;transform:translateY(8px)"><h1>…</h1></div>
 *
 * The text is still there for crawlers, but a visitor whose JavaScript fails
 * or is still loading sees an empty page. The current site deliberately avoids
 * this: templates/_layout.html only adds the `js-on` class once scripts run,
 * so scroll-reveal starts hidden for them and everyone else gets visible
 * content (FR-02). Entrance animations therefore belong on client-side
 * navigation, not on the first prerendered paint — where they would also delay
 * LCP on a content site.
 */
export default function Home() {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={transition.base}
    >
      <h1>Centre for Advanced Studies</h1>
      <p>S1 scaffold. Route tree and content arrive at S4.</p>
    </motion.div>
  );
}
