import {
  Button,
  Card,
  Container,
  Grid,
  Heading,
  Lede,
  Section,
} from '~/components';
import {
  getEquipment,
  getPatents,
  getProjects,
  getPublications,
} from '~/data/loaders';

export function meta() {
  return [
    { title: 'Research | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Research at CAS: publications, patents, projects, and state-of-the-art equipment and facilities.',
    },
  ];
}

export default function Research() {
  const publications = getPublications();
  const patents = getPatents();
  const projects = getProjects();
  const equipment = getEquipment();

  return (
    <Container>
      <Section>
        <Heading level={1}>Research</Heading>
        <Lede>
          Research at CAS: publications, patents, projects, and state-of-the-art
          equipment and facilities.
        </Lede>

        <div style={{ marginTop: 'var(--space-8)' }}>
          <Grid columns={3}>
            <Card>
              <Card.Title>Publications</Card.Title>
              <Card.Body>
                {publications.length} research publications in international
                journals and conferences.
              </Card.Body>
              <Card.Foot>
                <Button variant="secondary" href="/research/publications">
                  View publications
                </Button>
              </Card.Foot>
            </Card>

            <Card>
              <Card.Title>Patents</Card.Title>
              <Card.Body>
                {patents.length} patents filed and granted for innovative
                technologies and systems.
              </Card.Body>
              <Card.Foot>
                <Button variant="secondary" href="/research/patents">
                  View patents
                </Button>
              </Card.Foot>
            </Card>

            <Card>
              <Card.Title>Projects</Card.Title>
              <Card.Body>
                {projects.length} sponsored research projects in cutting-edge
                technology domains.
              </Card.Body>
              <Card.Foot>
                <Button variant="secondary" href="/research/projects">
                  View projects
                </Button>
              </Card.Foot>
            </Card>
          </Grid>
        </div>

        <div style={{ marginTop: 'var(--space-6)' }}>
          <Grid columns={3}>
            <Card>
              <Card.Title>Equipment</Card.Title>
              <Card.Body>
                {equipment.length} advanced research instruments and systems
                across five specialized labs.
              </Card.Body>
              <Card.Foot>
                <Button variant="secondary" href="/research/equipment">
                  View equipment
                </Button>
              </Card.Foot>
            </Card>

            <Card>
              <Card.Title>Facilities</Card.Title>
              <Card.Body>
                State-of-the-art research facilities supporting advanced
                technology research.
              </Card.Body>
              <Card.Foot>
                <Button variant="secondary" href="/research/facilities">
                  View facilities
                </Button>
              </Card.Foot>
            </Card>
          </Grid>
        </div>
      </Section>
    </Container>
  );
}
