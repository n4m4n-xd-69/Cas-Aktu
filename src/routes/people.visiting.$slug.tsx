import type { Route } from './+types/people.visiting.$slug';

import { Container, Heading, Lede, Section } from '~/components';
import { getVisitingFaculty } from '~/data/loaders';

export function meta({ params }: Route.MetaArgs) {
  const visiting = getVisitingFaculty();
  const person = visiting.find((p) => p.slug === params.slug);

  if (!person) {
    return [
      {
        title:
          'Visiting Faculty Member Not Found | Centre for Advanced Studies',
      },
    ];
  }

  return [
    { title: `${person.name} | Centre for Advanced Studies` },
    {
      name: 'description',
      content: `${person.name}, visiting ${person.title} at the Centre for Advanced Studies${person.department ? `, ${person.department}` : ''}.`,
    },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const visiting = getVisitingFaculty();
  const person = visiting.find((p) => p.slug === params.slug);

  if (!person) {
    throw new Response('Visiting faculty member not found', { status: 404 });
  }

  return { person };
}

export default function VisitingFacultyProfile({
  loaderData,
}: Route.ComponentProps) {
  const { person } = loaderData;

  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>{person.name}</Heading>
        <Lede>{person.title}</Lede>

        {person.department && (
          <>
            <h2>Department</h2>
            <p>{person.department}</p>
          </>
        )}

        {person.degrees && person.degrees.length > 0 && (
          <>
            <h2>Education</h2>
            <ul>
              {person.degrees.map((degree) => (
                <li key={degree}>{degree}</li>
              ))}
            </ul>
          </>
        )}

        {person.interests && person.interests.length > 0 && (
          <>
            <h2>Research interests</h2>
            <ul>
              {person.interests.map((interest) => (
                <li key={interest}>{interest}</li>
              ))}
            </ul>
          </>
        )}

        {person.bio && (
          <>
            <h2>Biography</h2>
            <p>{person.bio}</p>
          </>
        )}
      </Section>
    </Container>
  );
}
