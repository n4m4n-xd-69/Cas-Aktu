import {
  Button,
  Card,
  Container,
  Grid,
  Heading,
  Lede,
  Section,
} from '~/components';
import { getEvents, getNotices } from '~/data/loaders';

export function meta() {
  return [
    { title: 'Updates | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Latest news, notices, and events from the Centre for Advanced Studies.',
    },
  ];
}

export default function Updates() {
  const notices = getNotices();
  const events = getEvents();

  return (
    <Container>
      <Section>
        <Heading level={1}>Updates</Heading>
        <Lede>
          Latest news, notices, and events from the Centre for Advanced Studies.
        </Lede>

        <div style={{ marginTop: 'var(--space-8)' }}>
          <Grid columns={2}>
            <Card>
              <Card.Title>Notices</Card.Title>
              <Card.Body>
                {notices.length} official notices, announcements, and admissions
                updates.
              </Card.Body>
              <Card.Foot>
                <Button variant="secondary" href="/updates/notices">
                  View notices
                </Button>
              </Card.Foot>
            </Card>

            <Card>
              <Card.Title>Events</Card.Title>
              <Card.Body>
                {events.length} workshops, training programmes, and academic
                events.
              </Card.Body>
              <Card.Foot>
                <Button variant="secondary" href="/updates/events">
                  View events
                </Button>
              </Card.Foot>
            </Card>
          </Grid>
        </div>
      </Section>
    </Container>
  );
}
