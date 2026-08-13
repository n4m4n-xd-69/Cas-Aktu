import type { Route } from './+types/research.publications.$id';

import { Container, Heading, Lede, Section } from '~/components';
import { getPublications } from '~/data/loaders';

export function meta({ params }: Route.MetaArgs) {
  const publications = getPublications();
  const publication = publications.find((p) => p.id === params.id);

  if (!publication) {
    return [{ title: 'Publication Not Found | Centre for Advanced Studies' }];
  }

  return [
    { title: `${publication.title} | Centre for Advanced Studies` },
    {
      name: 'description',
      content: `${publication.authors} (${publication.year}). ${publication.title}. ${publication.venue}.`,
    },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const publications = getPublications();
  const publication = publications.find((p) => p.id === params.id);

  if (!publication) {
    throw new Response('Publication not found', { status: 404 });
  }

  return { publication };
}

export default function PublicationDetail({
  loaderData,
}: Route.ComponentProps) {
  const { publication } = loaderData;

  return (
    <Container width="prose">
      <Section>
        <p
          style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}
        >
          {publication.year}
        </p>
        <Heading level={1}>{publication.title}</Heading>
        <Lede>{publication.authors}</Lede>

        <h2>Publication details</h2>
        <p>
          <strong>Venue:</strong> {publication.venue}
        </p>
        {publication.volume && (
          <p>
            <strong>Volume:</strong> {publication.volume}
          </p>
        )}
        {publication.publisher && (
          <p>
            <strong>Publisher:</strong> {publication.publisher}
          </p>
        )}
        {publication.impact_factor && (
          <p>
            <strong>Impact Factor:</strong> {publication.impact_factor}
          </p>
        )}
        {publication.doi && (
          <p>
            <strong>DOI:</strong>{' '}
            <a
              href={`https://doi.org/${publication.doi}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {publication.doi}
            </a>
          </p>
        )}
      </Section>
    </Container>
  );
}
