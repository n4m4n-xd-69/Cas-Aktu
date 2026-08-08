import { Container, Heading, Section } from '~/components';

export function meta() {
  return [{ title: 'Maintenance | Centre for Advanced Studies' }];
}

export default function Maintenance() {
  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>Site Maintenance</Heading>
        <p>
          This site is currently undergoing scheduled maintenance. We will be
          back online shortly.
        </p>
        <p>
          We apologize for any inconvenience. Please check back soon or contact
          us at <a href="mailto:cas@aktu.ac.in">cas@aktu.ac.in</a> if you need
          immediate assistance.
        </p>
      </Section>
    </Container>
  );
}
