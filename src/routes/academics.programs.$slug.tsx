import type { Route } from './+types/academics.programs.$slug';

import { Button, Container, Heading, Lede, Section } from '~/components';
import { getProgram } from '~/data/loaders';

export function meta({ params }: Route.MetaArgs) {
  const program = getProgram(params.slug);

  if (!program) {
    return [{ title: 'Programme Not Found | Centre for Advanced Studies' }];
  }

  return [
    { title: `${program.title} | Centre for Advanced Studies` },
    {
      name: 'description',
      content: `${program.title} — ${program.department}. ${program.seats}. ${program.approval}.`,
    },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const program = getProgram(params.slug);

  if (!program) {
    throw new Response('Programme not found', { status: 404 });
  }

  return { program };
}

export default function ProgramDetail({ loaderData }: Route.ComponentProps) {
  const { program } = loaderData;

  return (
    <Container width="prose">
      <Section>
        <p
          style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}
        >
          {program.level}
        </p>
        <Heading level={1}>{program.title}</Heading>
        <Lede>{program.department}</Lede>

        <div style={{ marginTop: 'var(--space-6)' }}>
          <Button variant="primary" href="/admissions">
            Apply now
          </Button>
        </div>

        <h2>Programme details</h2>
        <p>
          <strong>Seats:</strong> {program.seats}
        </p>
        <p>
          <strong>Approval:</strong> {program.approval}
        </p>

        {program.specializations && program.specializations.length > 0 && (
          <>
            <h2>Specializations</h2>
            <ul>
              {program.specializations.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
          </>
        )}

        {program.vision && (
          <>
            <h2>Vision</h2>
            <p>{program.vision}</p>
          </>
        )}

        {program.mission && program.mission.length > 0 && (
          <>
            <h2>Mission</h2>
            <ul>
              {program.mission.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        )}

        {program.labs && program.labs.length > 0 && (
          <>
            <h2>Laboratory facilities</h2>
            <ul>
              {program.labs.map((lab) => (
                <li key={lab}>{lab}</li>
              ))}
            </ul>
          </>
        )}

        {program.eligibility && (
          <>
            <h2>Eligibility</h2>
            <p>{program.eligibility}</p>
          </>
        )}

        {program.stipend_note && (
          <>
            <h2>Stipend</h2>
            <p>{program.stipend_note}</p>
          </>
        )}
      </Section>
    </Container>
  );
}
