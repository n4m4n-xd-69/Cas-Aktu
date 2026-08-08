import { Link } from 'react-router';

import { Card, Container, Grid, Heading, Lede, Section } from '~/components';
import { getFaculty } from '~/data/loaders';

export function meta() {
  return [
    { title: 'Faculty | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Faculty members at CAS conducting research and teaching in Computer Science, Mechatronics, Nanotechnology, Manufacturing, and Energy Science.',
    },
  ];
}

export default function Faculty() {
  const faculty = getFaculty();

  return (
    <Container>
      <Section>
        <Heading level={1}>Faculty</Heading>
        <Lede>
          {faculty.length} faculty members conducting research and teaching
          across five specialized departments.
        </Lede>
      </Section>

      <Section>
        <Grid columns={3}>
          {faculty.map((person) => (
            <Card key={person.slug}>
              <Card.Title>
                <Link to={`/people/faculty/${person.slug}`}>{person.name}</Link>
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
