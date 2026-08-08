import { Container, Heading, Lede, Section } from '~/components';

export function meta() {
  return [
    { title: 'Accessibility | Centre for Advanced Studies' },
    {
      name: 'description',
      content: 'Accessibility statement for the CAS website.',
    },
  ];
}

export default function Accessibility() {
  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>Accessibility statement</Heading>
        <Lede>
          This page is a structural placeholder, not a published policy. It is
          not legally binding and must not be treated as CAS's actual
          accessibility statement.
        </Lede>

        <h2>Commitment to accessibility</h2>
        <p>
          Centre for Advanced Studies is committed to ensuring digital
          accessibility for people with disabilities. We are continually
          improving the user experience for everyone and applying relevant
          accessibility standards.
        </p>

        <h2>Conformance status</h2>
        <p>
          This website aims to conform to WCAG 2.1 Level AA standards.
          Conformance status pending formal audit.
        </p>

        <h2>Technical specifications</h2>
        <p>
          This website is built using modern web standards including HTML5,
          CSS3, and JavaScript. It is designed to be compatible with assistive
          technologies including screen readers.
        </p>

        <h2>Feedback</h2>
        <p>
          We welcome feedback on the accessibility of this website. If you
          encounter accessibility barriers, please contact us at{' '}
          <a href="mailto:info@cas.res.in">info@cas.res.in</a>.
        </p>

        <h2>Known limitations</h2>
        <p>
          This is a development preview. A complete accessibility audit and
          statement will be published before production launch.
        </p>
      </Section>
    </Container>
  );
}
