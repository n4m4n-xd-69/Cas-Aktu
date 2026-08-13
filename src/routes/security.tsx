import { Container, Heading, Lede, Section } from '~/components';

export function meta() {
  return [
    { title: 'Security | Centre for Advanced Studies' },
    {
      name: 'description',
      content: 'Information security and responsible disclosure policy.',
    },
  ];
}

export default function Security() {
  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>Security</Heading>
        <Lede>Information security and responsible disclosure policy.</Lede>

        <h2>Our commitment</h2>
        <p>
          We take the security of our systems and the protection of user data
          seriously. We implement industry-standard security measures to protect
          our website and services.
        </p>

        <h2>Responsible disclosure</h2>
        <p>
          If you discover a security vulnerability in our systems, we encourage
          you to report it to us responsibly. Please email details to{' '}
          <a href="mailto:cas@aktu.ac.in">cas@aktu.ac.in</a> with the subject
          line "Security Vulnerability Report".
        </p>

        <h2>What to include</h2>
        <p>
          Please provide a detailed description of the vulnerability, steps to
          reproduce it, and any potential impact. We will investigate all
          reports and work to address confirmed vulnerabilities promptly.
        </p>

        <h2>Safe harbor</h2>
        <p>
          We will not pursue legal action against researchers who discover and
          report security vulnerabilities in good faith, provided they follow
          responsible disclosure practices and do not exploit the vulnerability
          beyond what is necessary for demonstration purposes.
        </p>
      </Section>
    </Container>
  );
}
