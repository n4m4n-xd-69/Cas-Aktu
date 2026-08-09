import { Link } from 'react-router';

import { Card, Container, Grid, Heading, Lede, Section } from '~/components';
import { getEvents } from '~/data/loaders';

export function meta() {
  return [
    { title: 'Events | Centre for Advanced Studies' },
    {
      name: 'description',
      content: 'Workshops, training programmes, and academic events at CAS.',
    },
  ];
}

export default function Events() {
  const events = getEvents();

  return (
    <Container>
      <Section>
        <Heading level={1}>Events</Heading>
        <Lede>
          {events.length} workshops, training programmes, and academic events.
        </Lede>
      </Section>

      <Section>
        <Grid columns={3}>
          {events.map((event) => (
            <Card key={event.id}>
              <Card.Eyebrow>
                {event.mode} • {event.status}
              </Card.Eyebrow>
              <Card.Title>
                <Link to={`/updates/events/${event.id}`}>{event.title}</Link>
              </Card.Title>
              <Card.Body>
                {event.organizer} • {event.dates}
              </Card.Body>
            </Card>
          ))}
        </Grid>
      </Section>
    </Container>
  );
}
