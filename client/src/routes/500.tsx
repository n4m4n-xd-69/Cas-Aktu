import { Container, Heading, Section } from '~/components';

export function meta() {
  return [{ title: 'Server Error | Centre for Advanced Studies' }];
}

export default function ServerError() {
  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>500 — Server Error</Heading>
        <p>
          An unexpected error occurred. We apologize for the inconvenience.
          Please try again later.
        </p>
        <p>
          If this problem persists, please contact us at{' '}
          <a href="mailto:cas@aktu.ac.in">cas@aktu.ac.in</a>.
        </p>
        <p>
          <a href="/">Return to home page</a>
        </p>
      </Section>
    </Container>
  );
}
