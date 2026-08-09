import { Link } from 'react-router';

import { Card, Container, Grid, Heading, Lede, Section } from '~/components';
import { getPrograms } from '~/data/loaders';

export function meta() {
  return [
    { title: 'All Programmes | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'All academic programmes at CAS: M.Tech, Ph.D., and B.Tech across five specialized departments.',
    },
  ];
}

export default function Programs() {
  const programs = getPrograms();

  return (
    <Container>
      <Section>
        <Heading level={1}>All Programmes</Heading>
        <Lede>
          {programs.length} academic programmes across Computer Science,
          Mechatronics, Nanotechnology, Manufacturing Technology, and Energy
          Science.
        </Lede>
      </Section>

      <Section>
        <Grid columns={2}>
          {programs.map((program) => (
            <Card key={program.slug}>
              <Card.Eyebrow>{program.level}</Card.Eyebrow>
              <Card.Title>
                <Link to={`/academics/programs/${program.slug}`}>
                  {program.title}
                </Link>
              </Card.Title>
              <Card.Body>
                {program.department} • {program.seats}
              </Card.Body>
              <Card.Foot>{program.approval}</Card.Foot>
            </Card>
          ))}
        </Grid>
      </Section>
    </Container>
  );
}
