import { Link } from 'react-router';

import { Card, Container, Grid, Heading, Lede, Section } from '~/components';
import { getDocumentTypeCounts, getDocuments } from '~/data/loaders';

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

export default function Documents() {
  const documents = getDocuments();
  const typeCounts = getDocumentTypeCounts();

  return (
    <Container>
      <Section>
        <Heading level={1}>Documents</Heading>
        <Lede>
          {documents.length} documents including syllabi, timetables,
          guidelines, notices, and reports.
        </Lede>
      </Section>

      <Section>
        <Heading level={2}>By type</Heading>
        <div style={{ marginTop: 'var(--space-4)' }}>
          <Grid columns={4}>
            {Object.entries(typeCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => (
                <Card key={type}>
                  <Card.Title>{type}</Card.Title>
                  <Card.Body>{count} documents</Card.Body>
                </Card>
              ))}
          </Grid>
        </div>
      </Section>

      <Section>
        <Heading level={2}>Recent documents</Heading>
        <Grid columns={3}>
          {documents.slice(0, 12).map((doc) => (
            <Card key={doc.slug}>
              <Card.Eyebrow>
                {doc.type} • {doc.area}
              </Card.Eyebrow>
              <Card.Title>
                <Link to={`/documents/${doc.slug}`}>{doc.title}</Link>
              </Card.Title>
              {doc.session && <Card.Foot>Session: {doc.session}</Card.Foot>}
            </Card>
          ))}
        </Grid>
      </Section>
    </Container>
  );
}
