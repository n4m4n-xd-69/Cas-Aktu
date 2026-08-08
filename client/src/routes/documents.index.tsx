import { useMemo, useState } from 'react';
import { Link } from 'react-router';

import {
  Card,
  ChipGroup,
  Container,
  FadeIn,
  Grid,
  Heading,
  Lede,
  Pagination,
  Section,
} from '~/components';
import { getDocumentTypeCounts, getDocuments } from '~/data/loaders';
import { useURLState } from '~/lib/useURLState';

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
  const [currentPage, setCurrentPage] = useState(1);

  const types = useMemo(
    () => ['all', ...Object.keys(typeCounts).sort()],
    [typeCounts],
  );

  const filteredDocuments = useMemo(() => {
    let docs = allDocuments;

    if (selectedType !== 'all') {
      docs = docs.filter((d) => d.type === selectedType);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.title.toLowerCase().includes(lowerSearch) ||
          d.type.toLowerCase().includes(lowerSearch) ||
          d.area.toLowerCase().includes(lowerSearch),
      );
    }

    return docs;
  }, [allDocuments, selectedType, search]);

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <Container>
      <Section>
        <Heading level={1}>Documents</Heading>
        <Lede>
          {allDocuments.length} documents including syllabi, timetables,
          guidelines, notices, and reports.
        </Lede>
      </Section>

      <Section>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <input
            type="search"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: '100%',
              padding: 'var(--space-3) var(--space-4)',
              fontSize: 'var(--text-base)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface)',
              color: 'var(--text)',
            }}
          />
        </div>

        <div style={{ marginBottom: 'var(--space-6)' }}>
          <ChipGroup>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setCurrentPage(1);
                }}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  fontSize: 'var(--text-sm)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  background:
                    selectedType === type
                      ? 'var(--brand)'
                      : 'var(--surface-secondary)',
                  color: selectedType === type ? 'white' : 'var(--text)',
                  cursor: 'pointer',
                  fontWeight:
                    selectedType === type
                      ? 'var(--weight-semibold)'
                      : 'inherit',
                }}
              >
                {type === 'all' ? 'All' : type}
                {type !== 'all' &&
                  ` (${typeCounts[type as keyof typeof typeCounts] || 0})`}
              </button>
            ))}
          </ChipGroup>
        </div>

        <p
          style={{
            marginBottom: 'var(--space-4)',
            color: 'var(--text-secondary)',
          }}
        >
          Showing {filteredDocuments.length} document
          {filteredDocuments.length !== 1 ? 's' : ''}
        </p>

        <FadeIn>
          <Grid columns={3}>
            {paginatedDocuments.map((doc, i) => (
              <FadeIn key={doc.slug} delay={i * 50}>
                <Card>
                  <Card.Eyebrow>
                    {doc.type} • {doc.area}
                  </Card.Eyebrow>
                  <Card.Title>
                    <Link to={`/documents/${doc.slug}`}>{doc.title}</Link>
                  </Card.Title>
                  {doc.session && <Card.Foot>Session: {doc.session}</Card.Foot>}
                </Card>
              </FadeIn>
            ))}
          </Grid>
        </FadeIn>

        {totalPages > 1 && (
          <div style={{ marginTop: 'var(--space-8)' }}>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Section>
    </Container>
  );
}
