import { useSyncExternalStore } from 'react';

/**
 * July, August and September, inclusive.
 *
 * Takes an explicit date rather than reading the clock so the boundary
 * months are reachable from a test — you cannot browse in November today.
 */
export function isAdmissionsSeason(date: Date): boolean {
  const month = date.getMonth(); // 0-indexed: July is 6
  return month >= 6 && month <= 8;
}

/** The season never changes mid-session, so there is nothing to subscribe to. */
const subscribe = () => () => {};

/**
 * Client-only season gate.
 *
 * react-router.config.ts sets `ssr: false` with 392 prerendered routes, so this
 * page is static HTML baked at build time. Reading the clock during render would
 * freeze the build month into the artifact: a June build would never open in July,
 * and an August build would still be advertising admissions the following March.
 *
 * The server snapshot is therefore always false — the prerendered HTML ships the
 * closed state, and the rail appears on hydration when genuinely in season.
 */
export function useAdmissionsSeason(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => isAdmissionsSeason(new Date()),
    () => false,
  );
}
