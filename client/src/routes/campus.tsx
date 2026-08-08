import { Container, Grid, Heading, Lede, Section } from '~/components';

export function meta() {
  return [
    { title: 'Campus | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Infrastructure, library, hostels, and student life at the CAS campus.',
    },
  ];
}

export default function Campus() {
  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>Campus</Heading>
        <Lede>
          Infrastructure, library, hostels, and student life at the CAS campus.
        </Lede>

        <h2>Campus facilities</h2>
        <p>
          CAS is located on the campus of Dr. A.P.J. Abdul Kalam Technical
          University (AKTU), Lucknow, providing students access to world-class
          infrastructure and facilities.
        </p>

        <div style={{ marginTop: 'var(--space-6)' }}>
          <Grid columns={2}>
          <div>
            <h3>Campus-wide connectivity</h3>
            <p>
              1 Gbps Wi-Fi with 1 Gbps LAN connectivity and 10 Gbps traffic
              support across the campus.
            </p>
          </div>

          <div>
            <h3>24-hour security</h3>
            <p>
              HD CCTV surveillance, round-the-clock security at entry points,
              and a full perimeter compound wall.
            </p>
          </div>

          <div>
            <h3>Residential facilities</h3>
            <p>
              Separate hostels for men and women, approximately 75 single-seater
              rooms each, with internet and security.
            </p>
          </div>

          <div>
            <h3>Digital library</h3>
            <p>
              Access to international science and engineering books, journals,
              and e-resource consortia.
            </p>
          </div>
        </Grid>
        </div>
      </Section>
    </Container>
  );
}
