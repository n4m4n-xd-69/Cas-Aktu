import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Filter controls for the document library — the first React island.
 *
 * ## Why React renders the CONTROLS but not the LIST
 *
 * The obvious approach is to pass all 158 records in as props and let React
 * render the rows. That would be wrong here: with JavaScript disabled the
 * island never hydrates and the page would be empty. For a public
 * institutional record library that is a content-availability failure, not a
 * degraded experience.
 *
 * So the 158 rows are rendered statically by documents/index.astro and exist
 * in the HTML on first byte. This island renders only the controls and
 * toggles `hidden` on those existing rows. Result:
 *
 *   - JS off  -> all 158 records readable, printable, Ctrl-F-able, crawlable
 *   - JS on   -> filtering, sorting, counts, chips, URL state
 *
 * It is the same contract the vanilla facets.js implementation had, kept
 * deliberately when moving to React rather than lost to the framework.
 */

type Facet = 'area' | 'type' | 'year';
const FACETS: Facet[] = ['area', 'type', 'year'];
const PAGE = 24;

export interface Props {
  /** Build-time counts, so options show their weight before being clicked. */
  options: Record<Facet, [string, number][]>;
  total: number;
}

interface RowView {
  el: HTMLElement;
  area: string;
  type: string;
  year: string;
  title: string;
  size: number;
}

export default function DocumentFilters({ options, total }: Props) {
  const [selected, setSelected] = useState<Record<Facet, string[]>>({
    area: [], type: [], year: [],
  });
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('title');
  const [shown, setShown] = useState(PAGE);
  const [sheetOpen, setSheetOpen] = useState(false);
  const rowsRef = useRef<RowView[] | null>(null);
  const listRef = useRef<HTMLElement | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  /* Read the statically-rendered rows once. They are the source of truth for
     content; this island never creates or destroys them. */
  useEffect(() => {
    const list = document.querySelector<HTMLElement>('[data-facet-list]');
    if (!list) return;
    listRef.current = list;
    rowsRef.current = Array.from(list.children).map((el) => {
      const e = el as HTMLElement;
      return {
        el: e,
        area: e.dataset.area ?? '',
        type: e.dataset.type ?? '',
        year: e.dataset.year || 'Not dated',
        title: (e.dataset.title ?? '').toLowerCase(),
        size: Number(e.dataset.size ?? 0),
      };
    });
  }, []);

  /* Restore state from the URL so a filtered view is shareable. */
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const next = { area: [], type: [], year: [] } as Record<Facet, string[]>;
    FACETS.forEach((f) => {
      const raw = p.get(f);
      if (raw) next[f] = raw.split('|');
    });
    setSelected(next);
    setQuery(p.get('q') ?? '');
  }, []);

  const matches = (r: RowView, sel: Record<Facet, string[]>) => {
    for (const f of FACETS) {
      if (sel[f].length && !sel[f].includes(r[f])) return false;
    }
    return !query || r.title.includes(query.toLowerCase());
  };

  const visibleCount = useMemo(() => {
    const rows = rowsRef.current;
    if (!rows) return total;
    return rows.filter((r) => matches(r, selected)).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, query, total]);

  /* Apply to the DOM. Sorting reorders the real nodes so print and Ctrl-F
     follow what is on screen. */
  useEffect(() => {
    const rows = rowsRef.current;
    const list = listRef.current;
    if (!rows || !list) return;

    const dir = sort.startsWith('-') ? -1 : 1;
    const key = sort.replace('-', '');
    const ordered = [...rows].sort((a, b) => {
      if (key === 'size') return (a.size - b.size) * dir;
      if (key === 'year') return (Number(a.year) || 0) - (Number(b.year) || 0) ? ((Number(a.year) || 0) - (Number(b.year) || 0)) * dir : 0;
      return a.title < b.title ? -dir : a.title > b.title ? dir : 0;
    });
    const frag = document.createDocumentFragment();
    ordered.forEach((r) => frag.appendChild(r.el));
    list.appendChild(frag);

    let seen = 0;
    ordered.forEach((r) => {
      const ok = matches(r, selected);
      r.el.hidden = !ok || seen >= shown;
      if (ok) seen++;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, query, sort, shown]);

  /* Keep the URL in step. */
  useEffect(() => {
    const p = new URLSearchParams();
    FACETS.forEach((f) => selected[f].length && p.set(f, selected[f].join('|')));
    if (query) p.set('q', query);
    const qs = p.toString();
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  }, [selected, query]);

  const toggle = (f: Facet, v: string) => {
    setShown(PAGE);
    setSelected((s) => ({
      ...s,
      [f]: s[f].includes(v) ? s[f].filter((x) => x !== v) : [...s[f], v],
    }));
  };

  const clearAll = () => {
    setSelected({ area: [], type: [], year: [] });
    setQuery('');
    setShown(PAGE);
  };

  /** Count a given option would leave, given the OTHER facets already set. */
  const countFor = (f: Facet, v: string) => {
    const rows = rowsRef.current;
    if (!rows) return null;
    const probe = { ...selected, [f]: [] as string[] };
    return rows.filter((r) => matches(r, probe) && r[f] === v).length;
  };

  const appliedCount =
    FACETS.reduce((n, f) => n + selected[f].length, 0) + (query ? 1 : 0);

  return (
    <>
      <button
        type="button"
        ref={openerRef}
        className="btn btn--secondary browse__sheet-open"
        aria-expanded={sheetOpen}
        onClick={() => setSheetOpen(true)}
      >
        Filters
        {appliedCount > 0 && <span className="badge">{appliedCount}</span>}
      </button>

      <aside
        className="browse__rail"
        aria-label="Filter documents"
        data-sheet-open={sheetOpen || undefined}
        onKeyDown={(e) => { if (e.key === 'Escape') { setSheetOpen(false); openerRef.current?.focus(); } }}
      >
        <div className="browse__rail-head">
          <h2 className="browse__rail-title">Filter</h2>
          {appliedCount > 0 && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={clearAll}>
              Clear all
            </button>
          )}
          <button
            type="button"
            className="icon-btn browse__sheet-close"
            aria-label="Close filters"
            onClick={() => { setSheetOpen(false); openerRef.current?.focus(); }}
          >
            ✕
          </button>
        </div>

        {FACETS.map((f) => (
          <fieldset className="facet" key={f}>
            <legend className="facet__legend">{f}</legend>
            {options[f].map(([value, buildCount]) => {
              const live = countFor(f, value);
              const n = live ?? buildCount;
              const checked = selected[f].includes(value);
              return (
                <div className={`facet__opt${n === 0 && !checked ? ' is-zero' : ''}`} key={value}>
                  <input
                    type="checkbox"
                    id={`f-${f}-${value}`}
                    checked={checked}
                    onChange={() => toggle(f, value)}
                  />
                  <label htmlFor={`f-${f}-${value}`}>
                    {value}
                    <span className="facet__count">{n}</span>
                  </label>
                </div>
              );
            })}
          </fieldset>
        ))}
      </aside>

      <div className="browse__bar">
        <div className="browse__search">
          <label htmlFor="doc-search" className="u-visually-hidden">
            Filter documents by title
          </label>
          <input
            id="doc-search"
            type="search"
            className="field"
            placeholder="Filter by title…"
            value={query}
            autoComplete="off"
            onChange={(e) => { setQuery(e.target.value); setShown(PAGE); }}
          />
        </div>
        <div className="browse__sort">
          <label htmlFor="doc-sort" className="u-visually-hidden">Sort documents</label>
          <select id="doc-sort" className="field" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="title">Title A–Z</option>
            <option value="-title">Title Z–A</option>
            <option value="-year">Newest first</option>
            <option value="-size">Largest file</option>
            <option value="size">Smallest file</option>
          </select>
        </div>
      </div>

      {appliedCount > 0 && (
        <div className="chips">
          {FACETS.flatMap((f) =>
            selected[f].map((v) => (
              <button type="button" className="chip" key={`${f}-${v}`} onClick={() => toggle(f, v)}>
                {v}
                <span className="chip__x" aria-hidden="true">×</span>
                <span className="u-visually-hidden"> — remove filter</span>
              </button>
            )),
          )}
          {query && (
            <button type="button" className="chip" onClick={() => setQuery('')}>
              “{query}”<span className="chip__x" aria-hidden="true">×</span>
              <span className="u-visually-hidden"> — clear title filter</span>
            </button>
          )}
        </div>
      )}

      <p className="browse__count" role="status" aria-live="polite">
        {visibleCount === total
          ? `${total} documents`
          : `${visibleCount} of ${total} documents`}
      </p>

      {visibleCount === 0 && (
        <div className="empty-state">
          <p className="empty-state__title">No documents match these filters</p>
          <button type="button" className="btn btn--secondary" onClick={clearAll}>
            Clear all filters
          </button>
        </div>
      )}

      {visibleCount > shown && (
        <div className="browse__more">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setShown((s) => s + PAGE)}
          >
            Show {Math.min(PAGE, visibleCount - shown)} more
          </button>
        </div>
      )}
    </>
  );
}
