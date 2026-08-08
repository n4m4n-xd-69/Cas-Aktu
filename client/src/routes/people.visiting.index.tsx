import { Link } from 'react-router';

import { Card, Container, Grid, Heading, Lede, Section } from '~/components';
import { getVisitingFaculty } from '~/data/loaders';

export function meta() {
  return [
    { title: 'Visiting Faculty | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Visiting faculty members contributing expertise and research collaboration.',
    },
  ];
}

export default function VisitingFaculty() {
  const visiting = getVisitingFaculty();

  return (
    <Container>
      <Section>
        <Heading level={1}>Visiting Faculty</Heading>
        <Lede>
          {visiting.length} visiting faculty members contributing expertise and
          research collaboration.
        </Lede>
      </Section>

      <Section>
        <Grid columns={3}>
          {visiting.map((person) => (
            <Card key={person.slug}>
              <Card.Title>
                <Link to={`/people/visiting/${person.slug}`}>
                  {person.name}
                </Link>
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
