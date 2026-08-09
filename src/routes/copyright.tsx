import { Container, Heading, Lede, Section } from '~/components';

export function meta() {
  return [
    { title: 'Copyright | Centre for Advanced Studies' },
    {
      name: 'description',
      content: 'Copyright notice and intellectual property information.',
    },
  ];
}

export default function Copyright() {
  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>Copyright</Heading>
        <Lede>Copyright notice and intellectual property information.</Lede>

        <h2>Website content</h2>
        <p>
          © 2026 Centre for Advanced Studies, Dr. A.P.J. Abdul Kalam Technical
          University. All rights reserved.
        </p>
        <p>
          The content, design, and layout of this website are protected by
          copyright and other intellectual property rights. Unauthorized use,
          reproduction, or distribution of any materials from this website is
          prohibited without prior written permission.
        </p>

        <h2>Academic materials</h2>
        <p>
          Course materials, research publications, and other academic content
          remain the property of their respective authors and are protected by
          copyright. Use of these materials is subject to applicable copyright
          laws and institutional policies.
        </p>

        <h2>Permitted use</h2>
        <p>
          You may view, download, and print materials from this website for
          personal, non-commercial use only. Any other use requires explicit
          written permission from CAS.
        </p>
      </Section>
    </Container>
  );
}
