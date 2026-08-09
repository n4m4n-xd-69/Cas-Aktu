import type { Route } from './+types/updates.notices.$slug';

import { Container, Heading, Lede, Section } from '~/components';
import { getNotices } from '~/data/loaders';

export function meta({ params }: Route.MetaArgs) {
  const notices = getNotices();
  const notice = notices.find((n) => n.slug === params.slug);

  if (!notice) {
    return [{ title: 'Notice Not Found | Centre for Advanced Studies' }];
  }

  return [
    { title: `${notice.title} | Centre for Advanced Studies` },
    { name: 'description', content: notice.summary },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const notices = getNotices();
  const notice = notices.find((n) => n.slug === params.slug);

  if (!notice) {
    throw new Response('Notice not found', { status: 404 });
  }

  return { notice };
}

export default function NoticeDetail({ loaderData }: Route.ComponentProps) {
  const { notice } = loaderData;

  return (
    <Container width="prose">
      <Section>
        <p
          style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}
        >
          {notice.notice_type} • {notice.status}
        </p>
        <Heading level={1}>{notice.title}</Heading>
        <Lede>{notice.summary}</Lede>

        <h2>Notice details</h2>
        <p>
          <strong>Type:</strong> {notice.notice_type}
        </p>
        <p>
          <strong>Status:</strong> {notice.status}
        </p>
        {notice.audience && (
          <p>
            <strong>Audience:</strong> {notice.audience}
          </p>
        )}
        {notice.session && (
          <p>
            <strong>Session:</strong> {notice.session}
          </p>
        )}
        {notice.document_slug && (
          <p>
            <strong>Related Document:</strong>{' '}
            <a href={`/documents/${notice.document_slug}`}>
              {notice.document_slug}
            </a>
          </p>
        )}
      </Section>
    </Container>
  );
}
