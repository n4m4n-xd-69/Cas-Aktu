/*
 * /search/ — the full-page search. Shares one index with the command
 * palette (window.__CAS_INDEX__, assets/js/search-index.js) rather than
 * carrying its own inline copy, which used to add 49KB to this page's HTML.
 *
 * The index is a classic script, not fetch()ed JSON: fetch() is blocked on
 * file:// pages and the site is reviewed by opening it from disk.
 *
 * Requirements implemented (docs/UX_UI_SPECIFICATION.md #6, FR-09):
 *  - Filters after 2+ characters.
 *  - Result count is announced politely (aria-live).
 *  - Zero-result view suggests sections instead of fabricating an answer.
 *  - Ranking: title prefix, then title substring, then summary match.
 */
(function () {
  "use strict";
  var input = document.querySelector("[data-search-input]");
  var results = document.querySelector("[data-search-results]");
  var status = document.querySelector("[data-search-status]");
  if (!input || !results || !status) return;

  var prefix = document.documentElement.getAttribute("data-asset-prefix") || "";
  var index = null;

  function withIndex(then) {
    if (index) { then(); return; }
    if (window.__CAS_INDEX__) { index = window.__CAS_INDEX__; then(); return; }
    var s = document.createElement("script");
    s.src = prefix + "assets/js/search-index.js";
    s.onload = function () { index = window.__CAS_INDEX__ || []; then(); };
    s.onerror = function () { status.textContent = "Search index could not be loaded."; };
    document.head.appendChild(s);
  }

  var MAX_RESULTS = 25;

  // Result paths are directory URLs ("academics/programs/"). Over file://
  // those resolve to a directory listing rather than the page, so make the
  // index.html explicit — the same form the generator writes into static
  // markup, and equally valid when served over HTTP.
  function pageUrl(path) {
    return path.charAt(path.length - 1) === "/" ? path + "index.html" : path;
  }

  function render(query) {
    results.innerHTML = "";
    if (query.length < 2) {
      status.textContent = "Type at least 2 characters to search.";
      return;
    }
    var q = query.toLowerCase();
    var scored = [];
    for (var i = 0; i < index.length; i++) {
      var item = index[i];
      var title = item.t.toLowerCase();
      var idx = title.indexOf(q);
      var score;
      if (idx === 0) score = 0;                       // title starts with query
      else if (idx > 0) score = 10 + idx;             // title contains it
      else if (item.d && item.d.toLowerCase().indexOf(q) !== -1) score = 200;  // summary
      else continue;
      scored.push({ item: item, score: score });
    }
    scored.sort(function (a, b) { return a.score - b.score; });
    var shown = scored.slice(0, MAX_RESULTS);

    if (shown.length === 0) {
      status.textContent = "No results for \"" + query + "\".";
      var empty = document.createElement("li");
      empty.className = "record-row";
      empty.innerHTML =
        '<div>No results. Try <a href="../academics/programs/index.html">Programs</a>, ' +
        '<a href="../admissions/index.html">Admissions</a>, ' +
        '<a href="../updates/notices/index.html">Notices</a>, or ' +
        '<a href="../contact/index.html">Contact</a>.</div>';
      results.appendChild(empty);
      return;
    }

    status.textContent = shown.length + " result" + (shown.length === 1 ? "" : "s") + " for \"" + query + "\".";
    shown.forEach(function (s) {
      var li = document.createElement("li");
      li.className = "record-row";
      var a = document.createElement("a");
      a.href = "../" + pageUrl(s.item.p);
      a.textContent = s.item.t;
      var meta = document.createElement("div");
      meta.className = "record-row__meta";
      meta.textContent = s.item.s;
      var titleDiv = document.createElement("div");
      titleDiv.className = "record-row__title";
      titleDiv.appendChild(a);
      li.appendChild(titleDiv);
      li.appendChild(meta);
      results.appendChild(li);
    });
  }

  input.addEventListener("input", function () {
    var v = input.value.trim();
    if (v.length < 2) { render(v); return; }
    withIndex(function () { render(v); });
  });

  // Support ?q= for direct/shareable search links (UX spec: "filter state is
  // shareable via URL").
  var params = new URLSearchParams(window.location.search);
  var initial = params.get("q");
  if (initial) {
    input.value = initial;
    withIndex(function () { render(initial.trim()); });
  }
})();
