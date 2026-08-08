import { Button, Container, Grid, Heading, Lede, Section } from '~/components';
import { getPrograms } from '~/data/loaders';

export function meta() {
  return [
    { title: 'Academics | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Academic programmes at CAS: M.Tech, Ph.D., and B.Tech in Computer Science, Mechatronics, Nanotechnology, Manufacturing, and Energy Science.',
    },
  ];
}

export default function Academics() {
  const programs = getPrograms();
  const mtechPrograms = programs.filter((p) => p.level === 'M.Tech');
  const phdPrograms = programs.filter((p) => p.level === 'Ph.D.');
  const btechPrograms = programs.filter((p) => p.level === 'B.Tech');

  return (
    <Container>
      <Section>
        <Heading level={1}>Academics</Heading>
        <Lede>
          CAS offers postgraduate and undergraduate programmes in cutting-edge
          technology domains, designed to develop research excellence and
          industry-ready professionals.
        </Lede>

        <div style={{ marginTop: 'var(--space-8)' }}>
          <Grid columns={3}>
            <div>
              <h3>{mtechPrograms.length} M.Tech programmes</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Two-year postgraduate programmes in specialized technology
                domains
              </p>
              <Button variant="secondary" href="/academics/mtech">
                View M.Tech
              </Button>
            </div>

            <div>
              <h3>{phdPrograms.length} Ph.D. programmes</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Doctoral research programmes in advanced technology areas
              </p>
              <Button variant="secondary" href="/academics/phd">
                View Ph.D.
              </Button>
            </div>

            <div>
              <h3>{btechPrograms.length} B.Tech programme</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Four-year undergraduate engineering programme
              </p>
              <Button variant="secondary" href="/academics/btech">
                View B.Tech
              </Button>
            </div>
          </Grid>
        </div>

        <div style={{ marginTop: 'var(--space-8)' }}>
          <Button variant="primary" href="/academics/programs">
            View all programmes
          </Button>
        </div>
      </Section>
    </Container>
  );
}
