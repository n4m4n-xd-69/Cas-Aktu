import { Link } from 'react-router';

import { Card, Container, Grid, Heading, Lede, Section } from '~/components';
import { getProjects } from '~/data/loaders';

export function meta() {
  return [
    { title: 'Projects | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Sponsored research projects at CAS in cutting-edge technology domains.',
    },
  ];
}

export default function Projects() {
  const projects = getProjects();

  return (
    <Container>
      <Section>
        <Heading level={1}>Projects</Heading>
        <Lede>
          {projects.length} sponsored research projects in cutting-edge
          technology domains.
        </Lede>
      </Section>

      <Section>
        <Grid columns={2}>
          {projects.map((project) => (
            <Card key={project.id}>
              <Card.Eyebrow>
                {project.sponsor} • {project.status}
              </Card.Eyebrow>
              <Card.Title>
                <Link to={`/research/projects/${project.id}`}>
                  {project.title}
                </Link>
              </Card.Title>
              <Card.Body>
                {project.investigators} • {project.duration}
              </Card.Body>
              {project.amount && (
                <Card.Foot>Funding: {project.amount}</Card.Foot>
              )}
            </Card>
          ))}
        </Grid>
      </Section>
    </Container>
  );
}
