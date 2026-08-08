import { Link } from 'react-router';

import { Button, Container, Heading, Lede, Section } from '~/components';
import { getPrograms } from '~/data/loaders';

export function meta() {
  return [
    { title: 'B.Tech Programme | Centre for Advanced Studies' },
    {
      name: 'description',
      content: 'Four-year undergraduate engineering programme at CAS.',
    },
  ];
}

export default function BTech() {
  const programs = getPrograms().filter((p) => p.level === 'B.Tech');
  const program = programs[0];

  if (!program) {
    return (
      <Container width="prose">
        <Section>
          <Heading level={1}>B.Tech Programme</Heading>
          <p>Programme information not available.</p>
        </Section>
      </Container>
    );
  }

  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>B.Tech Programme</Heading>
        <Lede>Four-year undergraduate engineering programme.</Lede>

        <div style={{ marginTop: 'var(--space-6)' }}>
          <Button variant="primary" href="/admissions">
            Admissions
          </Button>
        </div>

        <h2>{program.title}</h2>
        <p>
          <strong>Department:</strong> {program.department}
        </p>
        <p>
          <strong>Seats:</strong> {program.seats}
        </p>
        <p>
          <strong>Approval:</strong> {program.approval}
        </p>

        <div style={{ marginTop: 'var(--space-6)' }}>
          <Link to={`/academics/programs/${program.slug}`}>
            View full details →
          </Link>
        </div>
      </Section>
    </Container>
  );
}
