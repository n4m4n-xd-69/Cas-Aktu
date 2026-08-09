import type { Route } from './+types/research.patents.$id';

import { Container, Heading, Lede, Section } from '~/components';
import { getPatents } from '~/data/loaders';

export function meta({ params }: Route.MetaArgs) {
  const patents = getPatents();
  const patent = patents.find((p) => p.id === params.id);

  if (!patent) {
    return [{ title: 'Patent Not Found | Centre for Advanced Studies' }];
  }

  return [
    { title: `${patent.title} | Centre for Advanced Studies` },
    {
      name: 'description',
      content: `${patent.title}. Application Number: ${patent.application_number}. Status: ${patent.status}.`,
    },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const patents = getPatents();
  const patent = patents.find((p) => p.id === params.id);

  if (!patent) {
    throw new Response('Patent not found', { status: 404 });
  }

  return { patent };
}

export default function PatentDetail({ loaderData }: Route.ComponentProps) {
  const { patent } = loaderData;

  return (
    <Container width="prose">
      <Section>
        <p
          style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}
        >
          {patent.date} • {patent.status}
        </p>
        <Heading level={1}>{patent.title}</Heading>
        <Lede>Application Number: {patent.application_number}</Lede>

        <h2>Patent details</h2>
        <p>
          <strong>Application Number:</strong> {patent.application_number}
        </p>
        <p>
          <strong>Date:</strong> {patent.date}
        </p>
        <p>
          <strong>Status:</strong> {patent.status}
        </p>

        {patent.inventors && (
          <>
            <h2>Inventors</h2>
            <p>{patent.inventors}</p>
          </>
        )}
      </Section>
    </Container>
  );
}
