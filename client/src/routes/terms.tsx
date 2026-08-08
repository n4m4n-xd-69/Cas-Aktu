import { Container, Heading, Lede, Section } from '~/components';

export function meta() {
  return [
    { title: 'Terms of Use | Centre for Advanced Studies' },
    {
      name: 'description',
      content: 'Terms of use for the CAS website and services.',
    },
  ];
}

export default function Terms() {
  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>Terms of Use</Heading>
        <Lede>
          Terms and conditions for using the CAS website and services.
        </Lede>

        <h2>Acceptance of terms</h2>
        <p>
          By accessing and using this website, you accept and agree to be bound
          by these terms of use. If you do not agree to these terms, please do
          not use this website.
        </p>

        <h2>Use of website</h2>
        <p>
          This website is provided for informational and educational purposes.
          You agree to use the website only for lawful purposes and in a manner
          that does not infringe the rights of others or restrict their use of
          the website.
        </p>

        <h2>Accuracy of information</h2>
        <p>
          We strive to ensure that information on this website is accurate and
          up-to-date. However, we make no warranties or representations about
          the accuracy, completeness, or suitability of any information
          provided.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          CAS and AKTU shall not be liable for any damages arising from the use
          or inability to use this website, including but not limited to direct,
          indirect, incidental, or consequential damages.
        </p>

        <h2>Changes to terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use
          of the website following any changes constitutes acceptance of the
          modified terms.
        </p>
      </Section>
    </Container>
  );
}
