import { Link } from 'react-router';

import { Card, Container, Grid, Heading, Lede, Section } from '~/components';
import { getPublications } from '~/data/loaders';

export function meta() {
  return [
    { title: 'Publications | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Research publications from CAS faculty in international journals and conferences.',
    },
  ];
}

export default function Publications() {
  const publications = getPublications();

  return (
    <Container>
      <Section>
        <Heading level={1}>Publications</Heading>
        <Lede>
          {publications.length} research publications from CAS faculty in
          international journals and conferences.
        </Lede>
      </Section>

      <Section>
        <Grid columns={2}>
          {publications.map((pub) => (
            <Card key={pub.id}>
              <Card.Eyebrow>{pub.year}</Card.Eyebrow>
              <Card.Title>
                <Link to={`/research/publications/${pub.id}`}>{pub.title}</Link>
              </Card.Title>
              <Card.Body>
                {pub.authors} • {pub.venue}
              </Card.Body>
              {pub.impact_factor && (
                <Card.Foot>IF: {pub.impact_factor}</Card.Foot>
              )}
            </Card>
          ))}
        </Grid>
      </Section>
    </Container>
  );
}
