import { createContext, use, useMemo, type ReactNode } from 'react';

/**
 * Light-only theme provider.
 *
 * Since the site is now exclusively light-themed, the theme context is
 * simplified to just provide the mounted state for hydration safety.
 */

type ThemeContextValue = {
  /** Always 'light' */
  theme: 'light';
  /** Always 'light' */
  resolvedTheme: 'light';
  /** No-op — kept for API compatibility. */
  setTheme: () => void;
  /**
   * False during prerender and until hydration completes.
   * Controls that depend on client state must wait for this.
   */
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: () => {},
      mounted: true,
    }),
    [],
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
