import { Link } from 'react-router';

import {
  Button,
  Card,
  Container,
  Grid,
  Heading,
  Lede,
  Section,
} from '~/components';
import { getPrograms } from '~/data/loaders';

export function meta() {
  return [
    { title: 'Ph.D. Programmes | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Doctoral research programmes at CAS in Computer Science, Mechatronics, and Nanotechnology.',
    },
  ];
}

export default function PhD() {
  const programs = getPrograms().filter((p) => p.level === 'Ph.D.');

  return (
    <Container>
      <Section>
        <Heading level={1}>Ph.D. Programmes</Heading>
        <Lede>
          Doctoral research programmes in advanced technology areas. Full-time
          and part-time options available.
        </Lede>

        <div style={{ marginTop: 'var(--space-6)' }}>
          <Button variant="primary" href="/admissions">
            Admissions
          </Button>
        </div>
      </Section>

      <Section>
        <Heading level={2}>{programs.length} Ph.D. programmes</Heading>
        <Grid columns={3}>
          {programs.map((program) => (
            <Card key={program.slug}>
              <Card.Title>
                <Link to={`/academics/programs/${program.slug}`}>
                  {program.title}
                </Link>
              </Card.Title>
              <Card.Body>{program.department}</Card.Body>
            </Card>
          ))}
        </Grid>
      </Section>
    </Container>
  );
}
