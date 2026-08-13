import { useMemo, useState } from 'react';
import { Link } from 'react-router';

import {
  Card,
  Container,
  EmptyState,
  FadeIn,
  Grid,
  PageHeader,
  Pagination,
  SearchField,
  Section,
} from '~/components';
import { getDocumentTypeCounts, getDocuments } from '~/data/loaders';
import { useURLState } from '~/lib/useURLState';
import styles from './documents.module.css';

export function meta() {
  return [
    { title: 'Documents | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Document library with syllabi, timetables, guidelines, notices, and reports.',
    },
  ];
}

const ITEMS_PER_PAGE = 24;

export default function Documents() {
  const allDocuments = getDocuments();
  const typeCounts = getDocumentTypeCounts();
  const [selectedType, setSelectedType] = useURLState<string>('type', 'all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // getDocumentTypeCounts returns a Map, already ordered by count descending.
  // Until S8 this read Object.keys(typeCounts), which on a Map is always []
  // — the filter row silently rendered nothing but "All" from S5 onward.
  // Count order beats alphabetical here: it puts Timetable and Syllabus first,
  // which is what the library is mostly made of.
  const types = useMemo(() => ['all', ...typeCounts.keys()], [typeCounts]);

  const filtered = useMemo(() => {
    let docs = allDocuments;

    if (selectedType !== 'all') {
      docs = docs.filter((d) => d.type === selectedType);
    }

    if (search) {
      const q = search.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q) ||
          d.area.toLowerCase().includes(q),
      );
    }

    return docs;
  }, [allDocuments, selectedType, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  function reset() {
    setSearch('');
    setSelectedType('all');
    setPage(1);
  }

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="Documents"
        lede={`${allDocuments.length} syllabi, timetables, guidelines, notices and reports.`}
      >
        <SearchField
          label="Search documents"
          placeholder="Search by title, type or department…"
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          resultCount={filtered.length}
        />

        <div
          className={styles.filters}
          role="group"
          aria-label="Filter by type"
        >
          {types.map((type) => {
            const active = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                className={styles.filter}
                aria-pressed={active}
                onClick={() => {
                  setSelectedType(type);
                  setPage(1);
                }}
              >
                {type === 'all' ? 'All' : type}
                <span className={styles.filter__count}>
                  {type === 'all'
                    ? allDocuments.length
                    : (typeCounts.get(type) ?? 0)}
                </span>
              </button>
            );
          })}
        </div>
      </PageHeader>

      <Section>
        <Container>
          <p className={styles.count}>
            Showing {pageItems.length} of {filtered.length} document
            {filtered.length === 1 ? '' : 's'}
          </p>

          {filtered.length > 0 ? (
            <>
              <FadeIn>
                <Grid columns={3}>
                  {pageItems.map((doc) => (
                    <Card key={doc.slug}>
                      <Card.Eyebrow>
                        {doc.type} · {doc.area}
                      </Card.Eyebrow>
                      <Card.Title>
                        <Link to={`/documents/${doc.slug}`}>{doc.title}</Link>
                      </Card.Title>
                      {doc.session && (
                        <Card.Foot>Session {doc.session}</Card.Foot>
                      )}
                    </Card>
                  ))}
                </Grid>
              </FadeIn>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No documents match those filters"
              description="Try a different type, or clear the filters to see the full library."
            >
              <button type="button" className={styles.reset} onClick={reset}>
                Clear filters
              </button>
            </EmptyState>
          )}
        </Container>
      </Section>
    </>
  );
}
