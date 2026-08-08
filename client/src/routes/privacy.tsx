import { Container, Heading, Lede, Section } from '~/components';

export function meta() {
  return [
    { title: 'Privacy Notice | Centre for Advanced Studies' },
    {
      name: 'description',
      content: 'Privacy notice and data protection policy for CAS.',
    },
  ];
}

export default function Privacy() {
  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>Privacy Notice</Heading>
        <Lede>How we collect, use, and protect your personal information.</Lede>

        <h2>Data we collect</h2>
        <p>
          We collect personal information you provide when applying to
          programmes, registering for events, or contacting us. This may include
          your name, email address, phone number, educational qualifications,
          and other relevant details.
        </p>

        <h2>How we use your data</h2>
        <p>
          We use your information to process applications, communicate about
          programmes and events, maintain academic records, and improve our
          services. We do not sell or share your personal information with third
          parties without your consent.
        </p>

        <h2>Data protection</h2>
        <p>
          We implement appropriate technical and organizational security
          measures to protect your personal information from unauthorized
          access, disclosure, or loss.
        </p>

        <h2>Your rights</h2>
        <p>
          You have the right to access, correct, or delete your personal
          information. To exercise these rights, please contact us at{' '}
          <a href="mailto:cas@aktu.ac.in">cas@aktu.ac.in</a>.
        </p>
      </Section>
    </Container>
  );
}
