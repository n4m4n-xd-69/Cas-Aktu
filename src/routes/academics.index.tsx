import {
  Button,
  Card,
  Container,
  Grid,
  Heading,
  Lede,
  Section,
} from '~/components';
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

        {/* Cards rather than bare <div><h3>: these tiles sat directly under
            the page h1, which skipped a heading level (WCAG 1.3.1). Card.Title
            renders h2, so the outline is h1 -> h2 and the inline styles go
            with it. */}
        <div style={{ marginTop: 'var(--space-8)' }}>
          <Grid columns={3}>
            <Card>
              <Card.Title>{mtechPrograms.length} M.Tech programmes</Card.Title>
              <Card.Body>
                Two-year postgraduate programmes in specialized technology
                domains
              </Card.Body>
              <Card.Foot>
                <Button variant="secondary" href="/academics/mtech">
                  View M.Tech
                </Button>
              </Card.Foot>
            </Card>

            <Card>
              <Card.Title>{phdPrograms.length} Ph.D. programmes</Card.Title>
              <Card.Body>
                Doctoral research programmes in advanced technology areas
              </Card.Body>
              <Card.Foot>
                <Button variant="secondary" href="/academics/phd">
                  View Ph.D.
                </Button>
              </Card.Foot>
            </Card>

            <Card>
              <Card.Title>{btechPrograms.length} B.Tech programme</Card.Title>
              <Card.Body>
                Four-year undergraduate engineering programme
              </Card.Body>
              <Card.Foot>
                <Button variant="secondary" href="/academics/btech">
                  View B.Tech
                </Button>
              </Card.Foot>
            </Card>
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
