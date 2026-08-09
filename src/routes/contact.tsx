import { Container, Heading, Lede, Section } from '~/components';

export function meta() {
  return [
    { title: 'Contact | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Contact details for Centre for Advanced Studies (CAS), Dr. A.P.J. Abdul Kalam Technical University, Lucknow.',
    },
  ];
}

export default function Contact() {
  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>Contact</Heading>
        <Lede>Centre for Advanced Studies (CAS)</Lede>

        <h2>Address</h2>
        <p>
          Centre for Advanced Studies
          <br />
          Dr. A.P.J. Abdul Kalam Technical University
          <br />
          Lucknow, Uttar Pradesh
          <br />
          India
        </p>

        <h2>Email</h2>
        <p>
          General inquiries:{' '}
          <a href="mailto:info@cas.res.in">info@cas.res.in</a>
        </p>

        <h2>Phone</h2>
        <p>Contact details pending confirmation by the accountable office.</p>

        <h2>Location</h2>
        <p>
          CAS is located on the campus of Dr. A.P.J. Abdul Kalam Technical
          University (AKTU), Lucknow.
        </p>
      </Section>
    </Container>
  );
}
