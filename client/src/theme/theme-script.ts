/**
 * Scripts that must execute before first paint.
 *
 * Light-only: the pre-paint script just marks that JS is running.
 * No theme resolution needed.
 */

export const THEME_STORAGE_KEY = 'cas-theme';

/**
 * Marks that scripts are running.
 *
 * `js-on` gates the scroll-reveal hidden state in base.css. Without it, every
 * `.reveal` element renders visible — which is exactly what a visitor with no
 * JavaScript, or a failed bundle, must get.
 */
export const prePaintScript = `document.documentElement.classList.add("js-on");`;

/**
 * Publishes the height of the fixed page chrome as --chrome-h.
 */
export const chromeHeightScript = `(function(){try{var t=0;
document.querySelectorAll("[data-site-chrome]").forEach(function(e){t+=e.getBoundingClientRect().height;});
if(t>0)document.documentElement.style.setProperty("--chrome-h",Math.round(t)+"px");}catch(e){}})();`;
