/* ============================================================
   CAS — app.js
   Theme, drawer, mega menu, hero slideshow, scroll reveal,
   counters, parallax, rail, tilt, ripple. Vanilla, no deps.

   Two rules this file follows:
     1. Nothing here may be load-bearing for content. Every value a
        visitor needs is already in the HTML; JS only animates it.
        If this file fails to load the page must still be correct.
     2. Every motion path checks prefers-reduced-motion, and anything
        that moves on its own has a visible pause control.
   ============================================================ */
(function () {
  "use strict";

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduced = motionQuery.matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Theme ---------- */
  (function theme() {
    var KEY = "cas-theme";
    var root = document.documentElement;
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) {}
    if (stored === "dark" || stored === "light") root.setAttribute("data-theme", stored);

    function label(btn, next) {
      btn.setAttribute("aria-label", next === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
    $$("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var isDark = root.getAttribute("data-theme") === "dark" ||
          (!root.hasAttribute("data-theme") &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);
        var next = isDark ? "light" : "dark";
        root.setAttribute("data-theme", next);
        label(btn, next);
        try { localStorage.setItem(KEY, next); } catch (e) {}
      });
    });
  })();

  /* ---------- Viewport chrome height ----------
     Publishes the combined height of everything stacked above the hero
     (alert band + utility bar + header) so the hero can fill exactly the
     remaining viewport. CSS carries a 140px fallback, so this only refines
     the value — it is never required for a correct layout. */
  (function chromeHeight() {
    var parts = [".site-header"];
    function measure() {
      var total = 0;
      parts.forEach(function (sel) {
        var el = $(sel);
        if (el && el.offsetParent !== null) total += el.getBoundingClientRect().height;
      });
      if (total > 0) document.documentElement.style.setProperty("--chrome-h", Math.round(total) + "px");
    }
    measure();
    window.addEventListener("resize", function () { window.requestAnimationFrame(measure); }, { passive: true });
    window.addEventListener("load", measure);
  })();

  /* ---------- Sticky header ---------- */
  (function stickyHeader() {
    var header = $("[data-header]");
    if (!header) return;
    // On the homepage the masthead floats over the hero photograph, so the
    // whole wrapper — not just the header bar — has to know it is scrolled:
    // that is what swaps the transparent treatment for the solid one.
    var masthead = $("[data-masthead]");
    var ticking = false;
    function update() {
      var stuck = window.scrollY > 8;
      header.classList.toggle("is-stuck", stuck);
      if (masthead) masthead.classList.toggle("is-stuck", stuck);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  })();

  /* ---------- Notice ticker ----------
     Hover and focus pausing are pure CSS; this only wires the explicit
     button, which is the control WCAG 2.2.2 actually requires. */
  (function ticker() {
    var band = $("[data-ticker]");
    if (!band) return;
    var btn = $("[data-ticker-pause]", band);
    if (!btn) return;
    btn.addEventListener("click", function () {
      var paused = band.classList.toggle("is-paused");
      btn.setAttribute("aria-pressed", paused ? "true" : "false");
      btn.setAttribute("aria-label", paused ? "Resume scrolling notices" : "Pause scrolling notices");
    });
  })();

  /* ---------- Opening notice dialog ----------
     Native <dialog>.showModal() gives the focus trap, Escape-to-close and
     inert background for free. Shown once per session: sessionStorage, not
     localStorage, so a genuinely new visit sees current admissions news but
     moving around the site does not re-interrupt.

     Deliberately not shown when the visitor arrived on a deep link with a
     hash — they were sent to a specific place, and a modal over it is rude. */
  (function noticeDialog() {
    var dlg = $("[data-notice-dialog]");
    if (!dlg || typeof dlg.showModal !== "function") return;

    var KEY = "cas-notices-dismissed";
    var seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch (e) {}
    if (seen || window.location.hash) return;

    function dismiss() {
      try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
      if (dlg.open) dlg.close();
    }
    $$("[data-notice-close]", dlg).forEach(function (b) {
      b.addEventListener("click", dismiss);
    });
    // Escape fires `close` directly; record the dismissal either way.
    dlg.addEventListener("close", dismiss);
    // Click on the backdrop (the dialog element itself, outside its content).
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dismiss(); });

    // Let the hero paint first; an immediate modal covers a page the visitor
    // has not seen yet.
    window.setTimeout(function () {
      if (!dlg.open) { try { dlg.showModal(); } catch (e) {} }
    }, reduced ? 0 : 700);
  })();

  /* ---------- Mega menu ----------
     Hover opens it for pointer users; click/Enter and Escape make it
     fully operable from the keyboard, which hover alone never is. */
  (function dropdowns() {
    var triggers = $$("[data-menu-trigger]");
    if (!triggers.length) return;
    var openKey = null, closeTimer = null;

    function panelFor(key) { return $('[data-menu-panel="' + key + '"]'); }

    function open(key) {
      if (openKey === key) return;
      close();
      var panel = panelFor(key);
      if (!panel) return;
      panel.hidden = false;
      var t = $('[data-menu-trigger="' + key + '"]');
      if (t) t.setAttribute("aria-expanded", "true");
      openKey = key;
    }
    function close() {
      if (!openKey) return;
      var panel = panelFor(openKey);
      if (panel) panel.hidden = true;
      var t = $('[data-menu-trigger="' + openKey + '"]');
      if (t) t.setAttribute("aria-expanded", "false");
      openKey = null;
    }
    function cancelClose() { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; } }
    function scheduleClose() { cancelClose(); closeTimer = setTimeout(close, 180); }

    triggers.forEach(function (t) {
      var key = t.getAttribute("data-menu-trigger");
      t.addEventListener("mouseenter", function () { cancelClose(); open(key); });
      t.addEventListener("mouseleave", scheduleClose);
      t.addEventListener("click", function (e) {
        e.preventDefault();
        openKey === key ? close() : open(key);
      });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          open(key);
          var first = panelFor(key) && panelFor(key).querySelector("a");
          if (first) first.focus();
        }
      });
      var panel = panelFor(key);
      if (panel) {
        panel.addEventListener("mouseenter", cancelClose);
        panel.addEventListener("mouseleave", scheduleClose);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && openKey) {
        var t = $('[data-menu-trigger="' + openKey + '"]');
        close();
        if (t) t.focus();
      }
    });
    document.addEventListener("focusin", function (e) {
      if (!openKey) return;
      var panel = panelFor(openKey);
      var trigger = $('[data-menu-trigger="' + openKey + '"]');
      if (panel && !panel.contains(e.target) && e.target !== trigger) close();
    });
    document.addEventListener("click", function (e) {
      if (!openKey) return;
      var panel = panelFor(openKey);
      if (panel && !panel.contains(e.target) && !e.target.closest("[data-menu-trigger]")) close();
    });
  })();

  /* ---------- Mobile drawer ---------- */
  (function drawer() {
    var toggle = $("[data-drawer-toggle]");
    var panel  = $("[data-drawer]");
    var close  = $("[data-drawer-close]");
    if (!toggle || !panel) return;

    var FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
    var lastFocus = null;

    function onKey(e) {
      if (e.key === "Escape") { closeDrawer(); return; }
      if (e.key !== "Tab") return;
      var items = $$(FOCUSABLE, panel);
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    function openDrawer() {
      lastFocus = document.activeElement;
      panel.hidden = false;
      document.body.style.overflow = "hidden";
      toggle.setAttribute("aria-expanded", "true");
      document.addEventListener("keydown", onKey);
      var f = panel.querySelector(FOCUSABLE);
      if (f) f.focus();
    }
    function closeDrawer() {
      panel.hidden = true;
      document.body.style.overflow = "";
      toggle.setAttribute("aria-expanded", "false");
      document.removeEventListener("keydown", onKey);
      if (lastFocus) lastFocus.focus();
    }
    toggle.addEventListener("click", function () {
      toggle.getAttribute("aria-expanded") === "true" ? closeDrawer() : openDrawer();
    });
    if (close) close.addEventListener("click", closeDrawer);
    panel.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeDrawer();
    });
  })();

  /* ---------- Hero slideshow ----------
     WCAG 2.2.2: anything that auto-advances for more than 5s needs a
     mechanism to pause it. This deck exposes a real pause button, stops
     on hover and on keyboard focus, and stops entirely when the tab is
     hidden or the visitor prefers reduced motion. */
  (function heroDeck() {
    var hero = $("[data-hero]");
    if (!hero) return;
    var slides = $$("[data-hero-slide]", hero);
    if (slides.length < 2) return;

    var dots     = $$("[data-hero-dot]", hero);
    var caption  = $("[data-hero-caption]", hero);
    var playBtn  = $("[data-hero-playpause]", hero);
    var live     = $("[data-hero-live]", hero);
    var DWELL    = 3000;

    var index = 0;
    var timer = null;
    var userPaused = false;
    var hovering = false;
    var focused = false;

    function shouldRun() {
      return !reduced && !userPaused && !hovering && !focused && !document.hidden;
    }

    /* Slides 2..n ship with their URLs in data- attributes so the browser
       does not fetch six full-width images before first paint. Promote them
       to real attributes only when needed. */
    function hydrate(slide) {
      if (!slide || slide.dataset.hydrated) return;
      slide.dataset.hydrated = "1";
      Array.prototype.forEach.call(slide.querySelectorAll("source[data-srcset]"), function (s) {
        s.srcset = s.getAttribute("data-srcset");
        s.removeAttribute("data-srcset");
      });
      var img = slide.querySelector("img[data-src]");
      if (img) {
        if (img.getAttribute("data-srcset")) {
          img.srcset = img.getAttribute("data-srcset");
          img.removeAttribute("data-srcset");
        }
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
      }
    }

    /* Fetch and decode the next slide during the current one's dwell, so a
       cross-fade never reveals a half-painted image. */
    function preload(i) {
      hydrate(slides[(i + 1) % slides.length]);
    }

    function show(i, announce) {
      index = (i + slides.length) % slides.length;
      hydrate(slides[index]);   // covers dot/arrow/swipe jumps, not just +1
      slides.forEach(function (s, n) {
        var on = n === index;
        s.classList.toggle("is-active", on);
        s.setAttribute("aria-hidden", on ? "false" : "true");
      });
      dots.forEach(function (d, n) {
        d.setAttribute("aria-current", n === index ? "true" : "false");
      });
      var cap = slides[index].getAttribute("data-caption") || "";
      if (caption) caption.textContent = cap;
      // Only announce on deliberate navigation; announcing every
      // automatic advance would spam a screen reader continuously.
      if (announce && live) live.textContent = "Slide " + (index + 1) + " of " + slides.length + ". " + cap;
      preload(index);
    }

    function restartDotFill() {
      // Re-trigger the CSS progress animation on the active dot.
      var d = dots[index];
      if (!d) return;
      d.classList.remove("is-ticking");
      void d.offsetWidth;
      d.classList.add("is-ticking");
    }

    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      stop();
      if (!shouldRun()) { hero.classList.add("is-paused"); return; }
      hero.classList.remove("is-paused");
      restartDotFill();
      timer = setInterval(function () { show(index + 1); restartDotFill(); }, DWELL);
    }

    function goto(i, announce) { show(i, announce); start(); }

    dots.forEach(function (d, n) {
      d.addEventListener("click", function () { goto(n, true); });
    });

    // Edge arrows. Same path as the dots and the arrow keys, so a click,
    // a tap and a keypress all restart the dwell timer identically.
    var prevBtn = $("[data-hero-prev]", hero);
    var nextBtn = $("[data-hero-next]", hero);
    if (prevBtn) prevBtn.addEventListener("click", function () { goto(index - 1, true); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goto(index + 1, true); });

    if (playBtn) {
      playBtn.addEventListener("click", function () {
        userPaused = !userPaused;
        playBtn.setAttribute("aria-pressed", userPaused ? "true" : "false");
        playBtn.setAttribute("aria-label", userPaused ? "Play slideshow" : "Pause slideshow");
        start();
      });
    }

    hero.addEventListener("mouseenter", function () { hovering = true; start(); });
    hero.addEventListener("mouseleave", function () { hovering = false; start(); });
    hero.addEventListener("focusin",  function () { focused = true;  start(); });
    hero.addEventListener("focusout", function (e) {
      if (!hero.contains(e.relatedTarget)) { focused = false; start(); }
    });
    document.addEventListener("visibilitychange", start);

    hero.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft")  { e.preventDefault(); goto(index - 1, true); }
      if (e.key === "ArrowRight") { e.preventDefault(); goto(index + 1, true); }
    });

    /* Touch: horizontal swipe only, and only once the gesture is clearly
       horizontal, so it never steals a vertical scroll. */
    var sx = 0, sy = 0, tracking = false;
    hero.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) return;
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; tracking = true;
    }, { passive: true });
    hero.addEventListener("touchend", function (e) {
      if (!tracking) return;
      tracking = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        goto(index + (dx < 0 ? 1 : -1), true);
      }
    }, { passive: true });

    // React if the visitor changes their motion preference mid-session.
    var onMotionChange = function () { reduced = motionQuery.matches; start(); };
    motionQuery.addEventListener ? motionQuery.addEventListener("change", onMotionChange)
                                 : motionQuery.addListener(onMotionChange);

    show(0);
    start();
  })();

  /* ---------- Scroll reveal ---------- */
  (function reveal() {
    var items = $$(".reveal");
    if (!items.length) return;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    items.forEach(function (el) {
      var sibs = el.parentElement ? $$(".reveal", el.parentElement) : [];
      var idx = sibs.indexOf(el);
      if (idx > 0 && idx < 8) el.style.setProperty("--reveal-delay", (idx * 70) + "ms");
      io.observe(el);
    });
  })();

  /* ---------- Counters ----------
     The real figure is already the element's text content — the build
     writes it there. We read it, count up to it, and put it back. A
     visitor with no JS, a blocked script, reduced motion, or a counter
     that never scrolls into view always sees the true number, never 0.
     (The previous version started every counter at a literal "0" in the
     markup, so the page claimed the institute had 0 publications and 0
     patents until the animation happened to fire.) */
  (function counters() {
    var nodes = $$("[data-count]");
    if (!nodes.length) return;

    function fmt(n) { return n.toLocaleString("en-IN"); }

    function run(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      if (isNaN(target)) target = parseFloat(String(el.textContent).replace(/[^0-9.]/g, ""));
      if (isNaN(target)) return;
      var suffix = el.getAttribute("data-count-suffix") || "";
      if (reduced) { el.textContent = fmt(target) + suffix; return; }

      // Start partway up rather than from zero: shorter, less gimmicky,
      // and the figure is never wildly wrong mid-animation.
      var from = Math.floor(target * 0.55);
      var dur = 1100, start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = fmt(Math.round(from + (target - from) * eased)) + suffix;
        if (p < 1) window.requestAnimationFrame(step);
        else el.textContent = fmt(target) + suffix;
      }
      window.requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) { nodes.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        run(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    nodes.forEach(function (n) { io.observe(n); });
  })();

  /* ---------- Parallax ---------- */
  (function parallax() {
    if (reduced) return;
    var nodes = $$("[data-parallax]");
    if (!nodes.length) return;
    var sy = 0, raf = null;
    function apply() {
      nodes.forEach(function (o) {
        var d = parseFloat(o.getAttribute("data-parallax")) || 0.05;
        o.style.transform = "translate3d(0," + (sy * d) + "px,0)";
      });
      raf = null;
    }
    window.addEventListener("scroll", function () {
      sy = window.scrollY;
      if (sy < window.innerHeight * 1.5 && !raf) raf = window.requestAnimationFrame(apply);
    }, { passive: true });
  })();

  /* ---------- Horizontal rail ---------- */
  (function rails() {
    $$("[data-rail]").forEach(function (rail) {
      var wrap = rail.closest(".rail-wrap") || rail.parentElement;
      var prev = wrap && wrap.querySelector("[data-rail-prev]");
      var next = wrap && wrap.querySelector("[data-rail-next]");
      if (!prev || !next) return;

      function step() {
        var first = rail.firstElementChild;
        return first ? first.getBoundingClientRect().width + 20 : 300;
      }
      function sync() {
        prev.disabled = rail.scrollLeft < 8;
        next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
      }
      prev.addEventListener("click", function () { rail.scrollBy({ left: -step(), behavior: reduced ? "auto" : "smooth" }); });
      next.addEventListener("click", function () { rail.scrollBy({ left:  step(), behavior: reduced ? "auto" : "smooth" }); });
      rail.addEventListener("scroll", function () { window.requestAnimationFrame(sync); }, { passive: true });
      window.addEventListener("resize", sync, { passive: true });
      sync();
    });
  })();

  /* ---------- Card tilt ---------- */
  (function tilt() {
    if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    $$(".tilt").forEach(function (el) {
      var raf = null, tx = 0, ty = 0;
      function apply() { el.style.setProperty("--tilt-x", tx + "deg"); el.style.setProperty("--tilt-y", ty + "deg"); raf = null; }
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        ty = ((e.clientX - r.left) / r.width - 0.5) * 6;
        tx = -((e.clientY - r.top) / r.height - 0.5) * 6;
        if (!raf) raf = window.requestAnimationFrame(apply);
      });
      el.addEventListener("pointerleave", function () { tx = ty = 0; if (!raf) raf = window.requestAnimationFrame(apply); });
    });
  })();

  /* ---------- Button ripple ---------- */
  (function ripple() {
    if (reduced) return;
    document.addEventListener("pointerdown", function (e) {
      var btn = e.target.closest ? e.target.closest(".btn") : null;
      if (!btn) return;
      var r = btn.getBoundingClientRect();
      var size = Math.max(r.width, r.height);
      var span = document.createElement("span");
      span.className = "ripple";
      span.style.width = span.style.height = size + "px";
      span.style.left = (e.clientX - r.left - size / 2) + "px";
      span.style.top = (e.clientY - r.top - size / 2) + "px";
      btn.appendChild(span);
      window.setTimeout(function () { span.remove(); }, 700);
    });
  })();
})();
