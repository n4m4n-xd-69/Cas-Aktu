import { Link } from 'react-router';

import { Card, Container, Grid, Heading, Lede, Section } from '~/components';
import { getStaff } from '~/data/loaders';

export function meta() {
  return [
    { title: 'Staff | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Administrative and technical staff supporting CAS operations and research.',
    },
  ];
}

export default function Staff() {
  const staff = getStaff();

  return (
    <Container>
      <Section>
        <Heading level={1}>Staff</Heading>
        <Lede>
          {staff.length} administrative and technical staff supporting CAS
          operations and research.
        </Lede>
      </Section>

      <Section>
        <Grid columns={3}>
          {staff.map((person) => (
            <Card key={person.slug}>
              <Card.Title>
                <Link to={`/people/staff/${person.slug}`}>{person.name}</Link>
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
