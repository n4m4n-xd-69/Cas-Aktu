import type { Route } from './+types/updates.events.$id';

import { Container, Heading, Lede, Section } from '~/components';
import { getEvents } from '~/data/loaders';

export function meta({ params }: Route.MetaArgs) {
  const events = getEvents();
  const event = events.find((e) => e.id === params.id);

  if (!event) {
    return [{ title: 'Event Not Found | Centre for Advanced Studies' }];
  }

  return [
    { title: `${event.title} | Centre for Advanced Studies` },
    {
      name: 'description',
      content: `${event.title}. Organized by ${event.organizer}. ${event.dates}.`,
    },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const events = getEvents();
  const event = events.find((e) => e.id === params.id);

  if (!event) {
    throw new Response('Event not found', { status: 404 });
  }

  return { event };
}

export default function EventDetail({ loaderData }: Route.ComponentProps) {
  const { event } = loaderData;

  return (
    <Container width="prose">
      <Section>
        <p
          style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}
        >
          {event.mode} • {event.status}
        </p>
        <Heading level={1}>{event.title}</Heading>
        <Lede>
          {event.organizer} • {event.dates}
        </Lede>

        <h2>Event details</h2>
        <p>
          <strong>Organizer:</strong> {event.organizer}
        </p>
        <p>
          <strong>Dates:</strong> {event.dates}
        </p>
        <p>
          <strong>Mode:</strong> {event.mode}
        </p>
        <p>
          <strong>Status:</strong> {event.status}
        </p>
      </Section>
    </Container>
  );
}
