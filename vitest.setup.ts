// jsdom (the `test.environment` in vite.config.ts) does not implement
// `window.matchMedia` at all — it is `undefined`, not a stub. Any hook that
// reads a media query (useSlideshow's usePrefersReducedMotion) throws under
// jsdom without this polyfill. The mock reports "no match" for every query,
// which is the correct inert default for tests that don't specifically
// exercise reduced-motion behaviour.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
