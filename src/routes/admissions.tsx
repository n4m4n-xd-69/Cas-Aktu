import { Button, Container, Heading, Lede, Section } from '~/components';
import { getNotices, getPrograms } from '~/data/loaders';

export function meta() {
  return [
    { title: 'Admissions | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'B.Tech, M.Tech, and Ph.D. admissions for Centre for Advanced Studies.',
    },
  ];
}

export default function Admissions() {
  const programs = getPrograms();
  const notices = getNotices();
  const openNotices = notices.filter((n) => n.status === 'Open');

  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>Admissions</Heading>
        <Lede>B.Tech, M.Tech, and Ph.D. admissions for session 2026-27.</Lede>

        <h2>Programmes offered</h2>
        <p>
          CAS offers {programs.length} academic programmes across five
          specialized departments:
        </p>
        <ul>
          {programs.map((p) => (
            <li key={p.slug}>{p.title}</li>
          ))}
        </ul>

        <h2>Current admissions</h2>
        {openNotices.length > 0 ? (
          <>
            <p>
              {openNotices.length} admission
              {openNotices.length === 1 ? '' : 's'} currently open:
            </p>
            <ul>
              {openNotices.map((n) => (
                <li key={n.slug}>
                  <strong>{n.title}</strong> — {n.summary}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No admissions currently open. Check back for updates.</p>
        )}

        <div style={{ marginTop: 'var(--space-6)' }}>
          <Button variant="primary" href="/updates/notices">
            View all notices
          </Button>
        </div>

        <h2>Eligibility</h2>
        <p>
          Eligibility criteria vary by programme. GATE-qualified candidates are
          preferred for M.Tech programmes. Please refer to individual programme
          pages and current admission notices for detailed requirements.
        </p>
      </Section>
    </Container>
  );
}
