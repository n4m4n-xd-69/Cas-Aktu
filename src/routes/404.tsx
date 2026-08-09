import { Container, Heading, Section } from '~/components';

export function meta() {
  return [
    { title: 'Page Not Found | Centre for Advanced Studies' },
    {
      name: 'description',
      content: 'The page you are looking for could not be found.',
    },
  ];
}

export default function NotFound() {
  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>404 — Page Not Found</Heading>
        <p>
          The page you are looking for does not exist. It may have been moved or
          deleted.
        </p>
        <p>
          <a href="/">Return to home page</a>
        </p>
      </Section>
    </Container>
  );
}
