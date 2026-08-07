/* ============================================================
   CAS — facets.js
   Client-side filtering, sorting and progressive disclosure for
   long record lists. Currently drives /documents/ (158 records).

   Why client-side: the site is statically generated with no backend, so a
   query string cannot be answered by a server. Every record is already in
   the HTML, so filtering is a matter of hiding rows — which keeps the full
   list printable, Ctrl-F-able and crawlable on one URL.

   Progressive enhancement contract:
     - The controls ship `hidden` and are revealed here. With scripting off
       the page is the complete list, exactly as before. We never show a
       control that cannot work.
     - Filter state lives in the query string, so a filtered view is
       shareable and survives Back.
     - Focus is never moved by applying a filter. The result count is
       announced politely.
   ============================================================ */
(function () {
  "use strict";

  var root = document.querySelector("[data-facets]");
  if (!root) return;

  var $  = function (s, c) { return (c || root).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || root).querySelectorAll(s)); };

  var PAGE = 24;                       // rows revealed per step
  var FIELDS = ["area", "type", "year"];

  var list      = $("[data-facet-list]");
  var rows      = $$("[data-facet-list] > li");
  var status    = $("[data-facet-status]");
  var chipsWrap = $("[data-facet-chips]");
  var empty     = $("[data-facet-empty]");
  var emptyBits = $("[data-facet-empty-detail]");
  var moreWrap  = $("[data-facet-more]");
  var moreBtn   = $("[data-facet-load-more]");
  var searchBox = $("[data-facet-search]");
  var sortSel   = $("[data-facet-sort]");
  var rail      = $("[data-facet-rail]");
  var clearBtn  = $("[data-facet-clear]");
  var clearBtn2 = $("[data-facet-clear-2]");
  var sheetOpen = $("[data-facet-sheet-open]");
  var sheetClose= $("[data-facet-sheet-close]");
  var appliedN  = $("[data-facet-applied-count]");

  if (!list || !rows.length) return;

  var shown = PAGE;
  var query = "";

  /* ---------- state ---------- */

  function selected() {
    var out = {};
    FIELDS.forEach(function (f) { out[f] = []; });
    $$('input[data-facet]:checked').forEach(function (cb) {
      out[cb.getAttribute("data-facet")].push(cb.value);
    });
    return out;
  }

  function rowValue(row, field) {
    var v = row.getAttribute("data-" + field) || "";
    // Undated records are filterable under an explicit label rather than
    // silently dropping out of the Year facet.
    if (field === "year" && !v) return "Not dated";
    return v;
  }

  function matches(row, sel) {
    for (var i = 0; i < FIELDS.length; i++) {
      var f = FIELDS[i];
      if (sel[f].length && sel[f].indexOf(rowValue(row, f)) === -1) return false;
    }
    if (query && (row.getAttribute("data-title") || "").indexOf(query) === -1) return false;
    return true;
  }

  /* ---------- sorting ---------- */

  function sortRows(mode) {
    var dir = mode.charAt(0) === "-" ? -1 : 1;
    var key = dir === -1 ? mode.slice(1) : mode;
    var sorted = rows.slice().sort(function (a, b) {
      var av, bv;
      if (key === "size") { av = +a.getAttribute("data-size"); bv = +b.getAttribute("data-size"); }
      else if (key === "year") {
        // Undated sorts last under "newest first" rather than pretending to be year 0.
        av = +(a.getAttribute("data-year") || 0);
        bv = +(b.getAttribute("data-year") || 0);
      } else {
        av = a.getAttribute("data-title") || "";
        bv = b.getAttribute("data-title") || "";
        return av < bv ? -dir : av > bv ? dir : 0;
      }
      return (av - bv) * dir;
    });
    var frag = document.createDocumentFragment();
    sorted.forEach(function (r) { frag.appendChild(r); });
    list.appendChild(frag);
    rows = sorted;
  }

  /* ---------- counts ---------- */

  /* Each option shows how many records it would leave, given the *other*
     facets already applied — so a visitor can see a filter is worth using
     before using it, and never lands on an empty result by accident. */
  function updateCounts(sel) {
    $$('input[data-facet]').forEach(function (cb) {
      var field = cb.getAttribute("data-facet");
      var probe = {};
      FIELDS.forEach(function (f) { probe[f] = f === field ? [] : sel[f]; });
      var n = 0;
      for (var i = 0; i < rows.length; i++) {
        if (matches(rows[i], probe) && rowValue(rows[i], field) === cb.value) n++;
      }
      var badge = cb.parentNode.querySelector("[data-facet-count]");
      if (badge) badge.textContent = n;
      // Zero-result options stay operable (so a selected one can be undone)
      // but are visibly and programmatically marked.
      var opt = cb.closest(".facet__opt");
      if (opt) opt.classList.toggle("is-zero", n === 0 && !cb.checked);
    });
  }

  /* ---------- chips ---------- */

  function renderChips(sel) {
    var any = FIELDS.some(function (f) { return sel[f].length; }) || !!query;
    chipsWrap.hidden = !any;
    if (clearBtn) clearBtn.hidden = !any;
    if (appliedN) {
      var n = FIELDS.reduce(function (a, f) { return a + sel[f].length; }, 0) + (query ? 1 : 0);
      appliedN.textContent = n;
      appliedN.hidden = n === 0;
    }
    if (!any) { chipsWrap.innerHTML = ""; return; }

    var html = "";
    FIELDS.forEach(function (f) {
      sel[f].forEach(function (v) {
        html += '<button type="button" class="chip" data-chip-field="' + f + '" data-chip-value="' +
                v.replace(/"/g, "&quot;") + '">' + v +
                '<span class="chip__x" aria-hidden="true">×</span>' +
                '<span class="u-visually-hidden"> — remove filter</span></button>';
      });
    });
    if (query) {
      html += '<button type="button" class="chip" data-chip-field="q">“' + query +
              '”<span class="chip__x" aria-hidden="true">×</span>' +
              '<span class="u-visually-hidden"> — clear title filter</span></button>';
    }
    chipsWrap.innerHTML = html;
  }

  /* ---------- URL ---------- */

  function syncUrl(sel) {
    var p = new URLSearchParams();
    FIELDS.forEach(function (f) { if (sel[f].length) p.set(f, sel[f].join("|")); });
    if (query) p.set("q", query);
    var qs = p.toString();
    history.replaceState(null, "", qs ? "?" + qs : location.pathname);
  }

  function readUrl() {
    var p = new URLSearchParams(location.search);
    FIELDS.forEach(function (f) {
      var raw = p.get(f);
      if (!raw) return;
      var want = raw.split("|");
      $$('input[data-facet="' + f + '"]').forEach(function (cb) {
        if (want.indexOf(cb.value) !== -1) cb.checked = true;
      });
    });
    var q = p.get("q");
    if (q && searchBox) { searchBox.value = q; query = q.toLowerCase(); }
  }

  /* ---------- render ---------- */

  function apply(resetPage) {
    if (resetPage !== false) shown = PAGE;
    var sel = selected();
    var visible = 0, total = 0;

    for (var i = 0; i < rows.length; i++) {
      var ok = matches(rows[i], sel);
      if (ok) {
        total++;
        if (visible < shown) { rows[i].hidden = false; visible++; }
        else rows[i].hidden = true;
      } else {
        rows[i].hidden = true;
      }
    }

    var all = rows.length;
    status.textContent = total === all
      ? all + " documents"
      : total + " of " + all + " documents" + (total > visible ? " — showing " + visible : "");

    empty.hidden = total !== 0;
    list.hidden  = total === 0;
    if (total === 0) {
      var bits = [];
      FIELDS.forEach(function (f) { if (sel[f].length) bits.push(sel[f].join(", ")); });
      if (query) bits.push("“" + query + "”");
      emptyBits.textContent = bits.length
        ? "Nothing matches " + bits.join(" + ") + "."
        : "";
    }

    moreWrap.hidden = total <= visible;
    if (!moreWrap.hidden) {
      var next = Math.min(PAGE, total - visible);
      moreBtn.textContent = "Show " + next + " more";
    }

    updateCounts(sel);
    renderChips(sel);
    syncUrl(sel);
  }

  /* ---------- wiring ---------- */

  $$('input[data-facet]').forEach(function (cb) {
    cb.addEventListener("change", function () { apply(); });
  });

  if (searchBox) {
    var t = null;
    searchBox.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { query = searchBox.value.trim().toLowerCase(); apply(); }, 140);
    });
  }

  if (sortSel) {
    sortSel.addEventListener("change", function () { sortRows(sortSel.value); apply(false); });
  }

  chipsWrap.addEventListener("click", function (e) {
    var chip = e.target.closest("[data-chip-field]");
    if (!chip) return;
    var f = chip.getAttribute("data-chip-field");
    if (f === "q") { query = ""; if (searchBox) searchBox.value = ""; }
    else {
      var v = chip.getAttribute("data-chip-value");
      $$('input[data-facet="' + f + '"]').forEach(function (cb) { if (cb.value === v) cb.checked = false; });
    }
    apply();
    // Focus would otherwise be lost with the chip that was just removed.
    (searchBox || status).focus({ preventScroll: true });
  });

  function clearAll() {
    $$('input[data-facet]').forEach(function (cb) { cb.checked = false; });
    query = "";
    if (searchBox) searchBox.value = "";
    apply();
  }
  if (clearBtn)  clearBtn.addEventListener("click", clearAll);
  if (clearBtn2) clearBtn2.addEventListener("click", function () { clearAll(); closeSheet(); });

  moreBtn.addEventListener("click", function () {
    var firstNew = shown;
    shown += PAGE;
    apply(false);
    // Send focus to the first newly revealed row so keyboard users continue
    // where the list grew, not back at the top.
    var vis = rows.filter(function (r) { return !r.hidden; });
    var target = vis[firstNew];
    var link = target && target.querySelector("a");
    if (link) link.focus({ preventScroll: true });
  });

  /* ---------- mobile sheet ---------- */

  function openSheet() {
    root.classList.add("is-sheet-open");
    document.body.style.overflow = "hidden";
    sheetOpen.setAttribute("aria-expanded", "true");
    var first = $('input[data-facet]');
    if (first) first.focus({ preventScroll: true });
    document.addEventListener("keydown", onSheetKey);
  }
  function closeSheet() {
    if (!root.classList.contains("is-sheet-open")) return;
    root.classList.remove("is-sheet-open");
    document.body.style.overflow = "";
    sheetOpen.setAttribute("aria-expanded", "false");
    sheetOpen.focus({ preventScroll: true });
    document.removeEventListener("keydown", onSheetKey);
  }
  function onSheetKey(e) { if (e.key === "Escape") closeSheet(); }

  if (sheetOpen)  sheetOpen.addEventListener("click", openSheet);
  if (sheetClose) sheetClose.addEventListener("click", closeSheet);

  /* ---------- boot ---------- */

  // Reveal the controls only now that they are known to work.
  [rail, sheetOpen, sheetClose,
   $("[data-facet-searchwrap]"), $("[data-facet-sortwrap]")]
    .forEach(function (el) { if (el) el.hidden = false; });
  if (sheetOpen) sheetOpen.setAttribute("aria-expanded", "false");
  root.classList.add("is-enhanced");

  readUrl();
  if (sortSel) sortRows(sortSel.value);
  apply();
})();
