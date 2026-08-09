import type { Route } from './+types/research.projects.$id';

import { Container, Heading, Lede, Section } from '~/components';
import { getProjects } from '~/data/loaders';

export function meta({ params }: Route.MetaArgs) {
  const projects = getProjects();
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    return [{ title: 'Project Not Found | Centre for Advanced Studies' }];
  }

  return [
    { title: `${project.title} | Centre for Advanced Studies` },
    {
      name: 'description',
      content: `${project.title}. Sponsored by ${project.sponsor}. Principal Investigators: ${project.investigators}.`,
    },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const projects = getProjects();
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    throw new Response('Project not found', { status: 404 });
  }

  return { project };
}

export default function ProjectDetail({ loaderData }: Route.ComponentProps) {
  const { project } = loaderData;

  return (
    <Container width="prose">
      <Section>
        <p
          style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}
        >
          {project.sponsor} • {project.status}
        </p>
        <Heading level={1}>{project.title}</Heading>
        <Lede>Principal Investigators: {project.investigators}</Lede>

        <h2>Project details</h2>
        <p>
          <strong>Sponsor:</strong> {project.sponsor}
        </p>
        <p>
          <strong>Principal Investigators:</strong> {project.investigators}
        </p>
        <p>
          <strong>Duration:</strong> {project.duration}
        </p>
        <p>
          <strong>Status:</strong> {project.status}
        </p>
        {project.amount && (
          <p>
            <strong>Funding:</strong> {project.amount}
          </p>
        )}
      </Section>
    </Container>
  );
}
