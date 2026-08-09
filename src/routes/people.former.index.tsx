import { Link } from 'react-router';

import { Card, Container, Grid, Heading, Lede, Section } from '~/components';
import { getFormerFaculty } from '~/data/loaders';

export function meta() {
  return [
    { title: 'Former Faculty | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Former faculty members who have contributed to CAS over the years.',
    },
  ];
}

export default function FormerFaculty() {
  const former = getFormerFaculty();

  return (
    <Container>
      <Section>
        <Heading level={1}>Former Faculty</Heading>
        <Lede>
          {former.length} former faculty members who have contributed to CAS
          over the years.
        </Lede>
      </Section>

      <Section>
        <Grid columns={4}>
          {former.map((person) => (
            <Card key={person.slug}>
              <Card.Title>
                <Link to={`/people/former/${person.slug}`}>{person.name}</Link>
              </Card.Title>
              <Card.Body>{person.title}</Card.Body>
              {person.department && <Card.Foot>{person.department}</Card.Foot>}
            </Card>
          ))}
        </Grid>
      </Section>
    </Container>
  );
}
