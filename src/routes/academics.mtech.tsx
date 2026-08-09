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
    { title: 'M.Tech Programmes | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Two-year M.Tech programmes at CAS in Computer Science, Mechatronics, Nanotechnology, Manufacturing Technology, and Energy Science.',
    },
  ];
}

export default function MTech() {
  const programs = getPrograms().filter((p) => p.level === 'M.Tech');

  return (
    <Container>
      <Section>
        <Heading level={1}>M.Tech Programmes</Heading>
        <Lede>
          Two-year postgraduate programmes in specialized technology domains.
          AICTE-approved, GATE-preferred admissions.
        </Lede>

        <div style={{ marginTop: 'var(--space-6)' }}>
          <Button variant="primary" href="/admissions">
            Admissions
          </Button>
        </div>
      </Section>

      <Section>
        <Heading level={2}>{programs.length} M.Tech programmes</Heading>
        <Grid columns={2}>
          {programs.map((program) => (
            <Card key={program.slug}>
              <Card.Title>
                <Link to={`/academics/programs/${program.slug}`}>
                  {program.title}
                </Link>
              </Card.Title>
              <Card.Body>
                {program.department} • {program.seats}
              </Card.Body>
            </Card>
          ))}
        </Grid>
      </Section>
    </Container>
  );
}
