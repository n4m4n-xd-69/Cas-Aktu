import type { Route } from './+types/research.equipment.$id';

import { Container, Heading, Lede, Section } from '~/components';
import { getEquipment } from '~/data/loaders';

export function meta({ params }: Route.MetaArgs) {
  const equipment = getEquipment();
  const item = equipment.find((e) => e.id === params.id);

  if (!item) {
    return [{ title: 'Equipment Not Found | Centre for Advanced Studies' }];
  }

  return [
    { title: `${item.name} | Centre for Advanced Studies` },
    { name: 'description', content: item.summary },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const equipment = getEquipment();
  const item = equipment.find((e) => e.id === params.id);

  if (!item) {
    throw new Response('Equipment not found', { status: 404 });
  }

  return { item };
}

export default function EquipmentDetail({ loaderData }: Route.ComponentProps) {
  const { item } = loaderData;

  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>{item.name}</Heading>
        <Lede>{item.summary}</Lede>
      </Section>
    </Container>
  );
}
