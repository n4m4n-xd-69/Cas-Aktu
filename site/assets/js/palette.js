/* ============================================================
   CAS — palette.js
   Command palette: Ctrl/⌘+K or "/" from any page.

   Index delivery
   --------------
   The 388-entry index lives in assets/js/search-index.js as a classic
   script assigning window.__CAS_INDEX__. It is injected on first open, so
   it costs nothing until someone searches and is then cached for every
   subsequent page. A classic script is used rather than fetch() because
   fetch() is blocked on file:// pages, and this site is reviewed by opening
   it from disk.

   Accessibility (WCAG 2.2 AA, combobox pattern)
   ---------------------------------------------
   - input is role=combobox with aria-expanded and aria-activedescendant
   - results are a role=listbox of role=option
   - the active option is tracked by id, never by moving focus
   - result count announced politely
   - Escape closes and restores focus to whatever opened it
   - the dialog itself is a native <dialog>, so the focus trap and inert
     background come from the browser
   ============================================================ */
(function () {
  "use strict";

  var dlg = document.querySelector("[data-palette]");
  if (!dlg || typeof dlg.showModal !== "function") return;

  var input   = dlg.querySelector("[data-palette-input]");
  var listbox = dlg.querySelector("[data-palette-list]");
  var status  = dlg.querySelector("[data-palette-status]");
  var hintEl  = dlg.querySelector("[data-palette-hint]");
  var prefix  = document.documentElement.getAttribute("data-asset-prefix") || "";

  var RECENT_KEY = "cas-recent-pages";
  var MAX_RESULTS = 12;

  var index = null;
  var loading = false;
  var results = [];
  var active = -1;
  var opener = null;

  /* ---------- index ---------- */

  function loadIndex(then) {
    if (index) { then(); return; }
    if (window.__CAS_INDEX__) { index = window.__CAS_INDEX__; then(); return; }
    if (loading) return;
    loading = true;
    var s = document.createElement("script");
    s.src = prefix + "assets/js/search-index.js";
    s.onload = function () {
      index = window.__CAS_INDEX__ || [];
      loading = false;
      then();
    };
    s.onerror = function () {
      loading = false;
      status.textContent = "Search index could not be loaded.";
      listbox.innerHTML = "";
    };
    document.head.appendChild(s);
  }

  /* ---------- recents (device-local, no PII) ---------- */

  function recents() {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function remember(item) {
    try {
      var list = recents().filter(function (r) { return r.p !== item.p; });
      list.unshift({ t: item.t, p: item.p, s: item.s });
      localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 6)));
    } catch (e) {}
  }

  /* ---------- url ---------- */

  // Index paths are directory URLs; over file:// those resolve to a folder
  // listing, so the filename is made explicit — same rule the generator
  // applies to static markup.
  function pageUrl(p) {
    if (p === "." || p === "") return prefix + "index.html";
    return prefix + (p.charAt(p.length - 1) === "/" ? p + "index.html" : p);
  }

  /* ---------- scoring ---------- */

  var PREFIXES = {
    "#": { label: "Documents", section: "Documents" },
    "@": { label: "People",    section: "People" },
    ">": { label: "Sections",  section: null, pagesOnly: true }
  };

  function parse(raw) {
    var first = raw.charAt(0);
    if (PREFIXES[first]) return { mode: first, q: raw.slice(1).trim() };
    return { mode: null, q: raw.trim() };
  }

  function score(item, q) {
    var t = item.t.toLowerCase();
    var i = t.indexOf(q);
    if (i === 0) return 0;                      // title starts with the query
    if (i > 0) {
      // word-boundary match ranks above a mid-word one
      return (t.charAt(i - 1) === " " ? 10 : 40) + i;
    }
    if (item.d && item.d.toLowerCase().indexOf(q) !== -1) return 120;  // summary match
    if (item.s && item.s.toLowerCase().indexOf(q) !== -1) return 200;  // section match
    return -1;
  }

  function search(raw) {
    var p = parse(raw);
    var q = p.q.toLowerCase();
    var pool = index || [];

    if (p.mode && PREFIXES[p.mode].section) {
      pool = pool.filter(function (it) { return it.s === PREFIXES[p.mode].section; });
    } else if (p.mode === ">") {
      // Top-level sections only — no deep records.
      pool = pool.filter(function (it) { return (it.p.match(/\//g) || []).length <= 1; });
    }

    if (!q) return pool.slice(0, MAX_RESULTS);

    var out = [];
    for (var i = 0; i < pool.length; i++) {
      var s = score(pool[i], q);
      if (s >= 0) out.push({ it: pool[i], s: s });
    }
    out.sort(function (a, b) { return a.s - b.s || a.it.t.length - b.it.t.length; });
    return out.slice(0, MAX_RESULTS).map(function (r) { return r.it; });
  }

  /* ---------- render ---------- */

  function row(item, i, kind) {
    var id = "pal-opt-" + i;
    var meta = kind === "recent" ? "Recent" : (item.s || "");
    return '<li class="palette__opt" role="option" id="' + id + '" aria-selected="false" data-i="' + i + '">' +
             '<span class="palette__opt-title">' + esc(item.t) + '</span>' +
             (item.d ? '<span class="palette__opt-desc">' + esc(item.d) + '</span>' : "") +
             '<span class="palette__opt-meta">' + esc(meta) + '</span>' +
           '</li>';
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function render(raw) {
    var kind = "result";
    if (!raw.trim()) {
      var r = recents();
      if (r.length) { results = r; kind = "recent"; }
      else { results = search(""); }
    } else {
      results = search(raw);
    }

    listbox.innerHTML = results.map(function (it, i) { return row(it, i, kind); }).join("");
    active = results.length ? 0 : -1;
    paint();

    if (!raw.trim()) {
      status.textContent = kind === "recent"
        ? results.length + " recent page" + (results.length === 1 ? "" : "s")
        : "Type to search " + (index ? index.length : 0) + " pages";
    } else {
      status.textContent = results.length
        ? results.length + " result" + (results.length === 1 ? "" : "s")
        : 'No results for "' + raw.trim() + '"';
    }

    var p = parse(raw);
    hintEl.textContent = p.mode ? PREFIXES[p.mode].label + " only" : "";
  }

  function paint() {
    var opts = listbox.children;
    for (var i = 0; i < opts.length; i++) {
      var on = i === active;
      opts[i].setAttribute("aria-selected", on ? "true" : "false");
      opts[i].classList.toggle("is-active", on);
    }
    // Focus never leaves the input — the combobox pattern points at the
    // active option by id instead, which is what screen readers follow.
    if (active >= 0 && opts[active]) {
      input.setAttribute("aria-activedescendant", opts[active].id);
      opts[active].scrollIntoView({ block: "nearest" });
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  }

  function go(i) {
    var item = results[i];
    if (!item) return;
    remember(item);
    window.location.href = pageUrl(item.p);
  }

  /* ---------- open / close ---------- */

  function open(initial) {
    opener = document.activeElement;
    dlg.showModal();
    input.setAttribute("aria-expanded", "true");
    input.value = initial || "";
    loadIndex(function () { render(input.value); });
    render(input.value);
    input.focus();
  }

  function close() {
    input.setAttribute("aria-expanded", "false");
    if (dlg.open) dlg.close();
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
  }

  /* ---------- events ---------- */

  input.addEventListener("input", function () { render(input.value); });

  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown")      { e.preventDefault(); if (results.length) { active = (active + 1) % results.length; paint(); } }
    else if (e.key === "ArrowUp")   { e.preventDefault(); if (results.length) { active = (active - 1 + results.length) % results.length; paint(); } }
    else if (e.key === "Home")      { if (results.length) { e.preventDefault(); active = 0; paint(); } }
    else if (e.key === "End")       { if (results.length) { e.preventDefault(); active = results.length - 1; paint(); } }
    else if (e.key === "Enter")     { e.preventDefault(); go(active); }
  });

  listbox.addEventListener("click", function (e) {
    var li = e.target.closest("[data-i]");
    if (li) go(+li.getAttribute("data-i"));
  });
  listbox.addEventListener("mousemove", function (e) {
    var li = e.target.closest("[data-i]");
    if (li) { active = +li.getAttribute("data-i"); paint(); }
  });

  dlg.addEventListener("close", function () { input.setAttribute("aria-expanded", "false"); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });
  dlg.querySelectorAll("[data-palette-close]").forEach(function (b) {
    b.addEventListener("click", close);
  });

  document.addEventListener("keydown", function (e) {
    var k = e.key.toLowerCase();
    if ((e.metaKey || e.ctrlKey) && k === "k") { e.preventDefault(); dlg.open ? close() : open(); return; }
    if (dlg.open) return;
    // "/" is a search shortcut only when the user is not already typing.
    var t = e.target;
    var typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
    if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); open(); }
  });

  // Any element can open it — the header search button does.
  document.querySelectorAll("[data-palette-open]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); open(); });
  });
})();
