import { useTheme } from '~/theme/ThemeProvider';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  // During SSR/prerendering, ThemeProvider might not be available yet
  let theme = 'system';
  let setTheme = () => {};

  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    setTheme = themeContext.setTheme;
  } catch {
    // ThemeProvider not available (e.g., during prerendering)
    // Component will hydrate client-side with proper context
  }

  const cycleTheme = () => {
    const next =
      theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
  };

  const icon = theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '💻';
  const label =
    theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System';

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={styles.toggle}
      aria-label={`Theme: ${label}. Click to cycle.`}
      title={`Theme: ${label}`}
      suppressHydrationWarning
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
