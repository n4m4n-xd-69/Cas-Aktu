import type { Route } from './+types/documents.$slug';

import { Container, Heading, Lede, Section } from '~/components';
import { getDocuments } from '~/data/loaders';

export function meta({ params }: Route.MetaArgs) {
  const documents = getDocuments();
  const document = documents.find((d) => d.slug === params.slug);

  if (!document) {
    return [{ title: 'Document Not Found | Centre for Advanced Studies' }];
  }

  return [
    { title: `${document.title} | Centre for Advanced Studies` },
    {
      name: 'description',
      content: `${document.title}. ${document.type} — ${document.area}.`,
    },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const documents = getDocuments();
  const document = documents.find((d) => d.slug === params.slug);

  if (!document) {
    throw new Response('Document not found', { status: 404 });
  }

  return { document };
}

export default function DocumentDetail({ loaderData }: Route.ComponentProps) {
  const { document } = loaderData;

  return (
    <Container width="prose">
      <Section>
        <p
          style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}
        >
          {document.type} • {document.area}
        </p>
        <Heading level={1}>{document.title}</Heading>
        <Lede>
          {document.type} — {document.area}
        </Lede>

        <h2>Document details</h2>
        <p>
          <strong>Type:</strong> {document.type}
        </p>
        <p>
          <strong>Area:</strong> {document.area}
        </p>
        {document.year && (
          <p>
            <strong>Year:</strong> {document.year}
          </p>
        )}
        {document.session && (
          <p>
            <strong>Session:</strong> {document.session}
          </p>
        )}
        {document.sizeBytes && (
          <p>
            <strong>Size:</strong> {(document.sizeBytes / 1024).toFixed(0)} KB
          </p>
        )}
        {document.filename && (
          <p>
            <strong>Filename:</strong> {document.filename}
          </p>
        )}
        {document.sourceUrl && (
          <p>
            <strong>Source:</strong>{' '}
            <a
              href={document.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View original document
            </a>
          </p>
        )}
      </Section>
    </Container>
  );
}
