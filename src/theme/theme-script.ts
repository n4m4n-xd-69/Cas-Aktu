/**
 * Scripts that must execute before first paint.
 *
 * These are injected as inline <script> tags in root.tsx, not run from a
 * component effect. React effects run after hydration, which is far too late:
 * the theme would flash and the layout would shift. Both failure modes are
 * documented in templates/_layout.html on the site this replaces.
 *
 * Each is minified by hand and wrapped in try/catch. They run before any
 * bundle loads, so a throw here would leave the page unstyled.
 */

export const THEME_STORAGE_KEY = 'cas-theme';

/**
 * 1. Marks that scripts are running, and resolves the stored theme.
 *
 * `js-on` gates the scroll-reveal hidden state in base.css. Without it, every
 * `.reveal` element renders visible — which is exactly what a visitor with no
 * JavaScript, or a failed bundle, must get (FR-02). Never move this into
 * React; if it lands after hydration, content is invisible until then.
 *
 * The theme read only ever writes an explicit "light" or "dark". Absence of
 * the attribute means "follow the OS", which tokens.css already handles via
 * `color-scheme: light dark` and light-dark(). Writing a resolved value here
 * would freeze the page against later OS changes.
 */
export const prePaintScript = `document.documentElement.classList.add("js-on");
(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

/**
 * 2. Publishes the height of the fixed page chrome as --chrome-h.
 *
 * A full-viewport hero sizes itself against the space the chrome leaves. This
 * has to run inline, immediately after the chrome markup is parsed and before
 * <main> exists, so the hero is laid out correctly on the first pass. Running
 * it from a bundle instead resized the hero after first paint and cost
 * 0.06 CLS on the current site — a measured regression, not a theoretical one.
 *
 * The CSS carries a 140px fallback, so this is a refinement and never a
 * dependency: if it finds nothing it writes nothing.
 *
 * Selector note: the original queried `.site-header`, a global class name.
 * Class names are module-scoped now and hash per build, so the header instead
 * carries a stable `data-site-chrome` attribute. Any element added to the
 * fixed chrome at S4 (alert band, utility bar, header) must carry it.
 */
export const chromeHeightScript = `(function(){try{var t=0;
document.querySelectorAll("[data-site-chrome]").forEach(function(e){t+=e.getBoundingClientRect().height;});
if(t>0)document.documentElement.style.setProperty("--chrome-h",Math.round(t)+"px");}catch(e){}})();`;
