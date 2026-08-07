import {
  createContext,
  use,
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

import { THEME_STORAGE_KEY } from './theme-script';

/**
 * `system` is the default and is represented by the ABSENCE of the data-theme
 * attribute, not by a resolved value. tokens.css sets `color-scheme: light
 * dark` and declares every colour through light-dark(), so with no attribute
 * the OS preference applies and keeps applying when the user changes it.
 * Writing a resolved value would freeze the page against that.
 */
export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (next: Theme) => void;
  /**
   * False during prerender and until hydration completes. Any control that
   * renders the CURRENT theme must wait for this, or the prerendered HTML
   * (which cannot know the visitor's choice) will not match the first client
   * render and React will report a hydration mismatch.
   */
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/* ------------------------------------------------------------------ *
 * External stores
 *
 * The theme lives in localStorage and the OS preference lives in a media
 * query — both are external mutable sources, which is precisely what
 * useSyncExternalStore is for. Reading them in an effect and calling setState
 * would tear on hydration and would miss changes made in another tab.
 * ------------------------------------------------------------------ */

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribeTheme(onChange: () => void) {
  listeners.add(onChange);
  // `storage` fires when another tab changes the theme.
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** Returns a primitive, so repeated calls are referentially stable. */
function getThemeSnapshot(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    // Storage throws in some private modes and under strict cookie policies.
    return 'system';
  }
}

const getServerThemeSnapshot = (): Theme => 'system';

const DARK_QUERY = '(prefers-color-scheme: dark)';

function subscribeSystem(onChange: () => void) {
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const getSystemSnapshot = () => window.matchMedia(DARK_QUERY).matches;
const getServerSystemSnapshot = () => false;

/** Subscribes to nothing; the client snapshot differs from the server one. */
const subscribeNever = () => () => {};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const systemDark = useSyncExternalStore(
    subscribeSystem,
    getSystemSnapshot,
    getServerSystemSnapshot,
  );

  const mounted = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    try {
      if (next === 'system') window.localStorage.removeItem(THEME_STORAGE_KEY);
      else window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable: still apply for this page view.
    }
    if (next === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', next);
    emit();
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme:
        theme === 'system' ? (systemDark ? 'dark' : 'light') : theme,
      setTheme,
      mounted,
    }),
    [theme, systemDark, setTheme, mounted],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return context;
}
