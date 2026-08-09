import { Link } from 'react-router';

import { Card, Container, Grid, Heading, Lede, Section } from '~/components';
import { getPatents } from '~/data/loaders';

export function meta() {
  return [
    { title: 'Patents | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Patents filed and granted for innovative technologies and systems developed at CAS.',
    },
  ];
}

export default function Patents() {
  const patents = getPatents();

  return (
    <Container>
      <Section>
        <Heading level={1}>Patents</Heading>
        <Lede>
          {patents.length} patents filed and granted for innovative technologies
          and systems.
        </Lede>
      </Section>

      <Section>
        <Grid columns={2}>
          {patents.map((patent) => (
            <Card key={patent.id}>
              <Card.Eyebrow>
                {patent.date} • {patent.status}
              </Card.Eyebrow>
              <Card.Title>
                <Link to={`/research/patents/${patent.id}`}>
                  {patent.title}
                </Link>
              </Card.Title>
              <Card.Body>Application: {patent.application_number}</Card.Body>
            </Card>
          ))}
        </Grid>
      </Section>
    </Container>
  );
}
