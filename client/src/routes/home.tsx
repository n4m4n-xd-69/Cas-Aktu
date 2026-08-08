import { Button, Container, Grid, Heading, Lede, Section } from '~/components';
import {
  getEquipment,
  getEvents,
  getFaculty,
  getPatents,
  getPrograms,
  getProjects,
  getPublications,
} from '~/data/loaders';

export function meta() {
  return [
    { title: 'Home | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Centre for Advanced Studies — an in-campus research institute of Dr. A.P.J. Abdul Kalam Technical University, Lucknow. M.Tech, Ph.D. and B.Tech programmes in computing, mechatronics, nanotechnology, manufacturing and energy.',
    },
    { property: 'og:title', content: 'Home | Centre for Advanced Studies' },
    {
      property: 'og:description',
      content:
        'Centre for Advanced Studies — an in-campus research institute of Dr. A.P.J. Abdul Kalam Technical University, Lucknow.',
    },
    { property: 'og:type', content: 'website' },
    {
      property: 'og:site_name',
      content: 'Centre for Advanced Studies',
    },
  ];
}

/**
 * Home page — institutional landing page.
 *
 * S4: basic content with data from S3 loaders. S8: premium cinematic redesign
 * (hero slideshow, asymmetric mosaic, sticky features, horizontal rails).
 */
export default function Home() {
  const programs = getPrograms();
  const faculty = getFaculty();
  const equipment = getEquipment();
  const publications = getPublications();
  const patents = getPatents();
  const projects = getProjects();
  const events = getEvents();

  return (
    <>
      <Section>
        <Container>
          <Heading level={1}>Centre for Advanced Studies</Heading>
          <Lede>
            An in-campus research institute of Dr. A.P.J. Abdul Kalam Technical
            University, Lucknow. M.Tech, Ph.D. and B.Tech programmes in
            computing, mechatronics, nanotechnology, manufacturing and energy
            science.
          </Lede>
          <div
            style={{
              marginTop: 'var(--space-6)',
              display: 'flex',
              gap: 'var(--space-3)',
              flexWrap: 'wrap',
            }}
          >
            <Button variant="primary" href="/academics">
              View programmes
            </Button>
            <Button variant="secondary" href="/admissions">
              Admissions
            </Button>
          </div>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container>
          <Heading level={2}>By the numbers</Heading>
          <Grid columns={4}>
            <div>
              <h3
                style={{ fontSize: 'var(--text-5xl)', color: 'var(--brand)' }}
              >
                {programs.length}
              </h3>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                }}
              >
                Academic programmes
              </p>
            </div>
            <div>
              <h3
                style={{ fontSize: 'var(--text-5xl)', color: 'var(--brand)' }}
              >
                {faculty.length}
              </h3>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                }}
              >
                Faculty members
              </p>
            </div>
            <div>
              <h3
                style={{ fontSize: 'var(--text-5xl)', color: 'var(--brand)' }}
              >
                {equipment.length}
              </h3>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                }}
              >
                Research facilities
              </p>
            </div>
            <div>
              <h3
                style={{ fontSize: 'var(--text-5xl)', color: 'var(--brand)' }}
              >
                {publications.length}
              </h3>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                }}
              >
                Publications
              </p>
            </div>
          </Grid>
        </Container>
      </Section>

      <Section>
        <Container>
          <Heading level={2}>Research output</Heading>
          <Grid columns={3}>
            <div>
              <h3>{patents.length} patents</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Filed and under examination
              </p>
            </div>
            <div>
              <h3>{projects.length} active projects</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Government-funded research
              </p>
            </div>
            <div>
              <h3>{events.length} events</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Workshops and training programmes
              </p>
            </div>
          </Grid>
        </Container>
      </Section>
    </>
  );
}
