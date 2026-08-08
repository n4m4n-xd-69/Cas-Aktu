import { Link } from 'react-router';

import { Card, Container, Grid, Heading, Lede, Section } from '~/components';
import { getNotices } from '~/data/loaders';

export function meta() {
  return [
    { title: 'Notices | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Official notices, announcements, and admissions updates from CAS.',
    },
  ];
}

export default function Notices() {
  const notices = getNotices();

  return (
    <Container>
      <Section>
        <Heading level={1}>Notices</Heading>
        <Lede>
          {notices.length} official notices, announcements, and admissions
          updates.
        </Lede>
      </Section>

      <Section>
        <Grid columns={2}>
          {notices.map((notice) => (
            <Card key={notice.slug}>
              <Card.Eyebrow>
                {notice.notice_type} • {notice.status}
              </Card.Eyebrow>
              <Card.Title>
                <Link to={`/updates/notices/${notice.slug}`}>
                  {notice.title}
                </Link>
              </Card.Title>
              <Card.Body>{notice.summary}</Card.Body>
              {notice.session && (
                <Card.Foot>Session: {notice.session}</Card.Foot>
              )}
            </Card>
          ))}
        </Grid>
      </Section>
    </Container>
  );
}
