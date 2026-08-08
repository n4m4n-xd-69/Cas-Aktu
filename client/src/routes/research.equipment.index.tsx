import { Link } from 'react-router';

import { Card, Container, Grid, Heading, Lede, Section } from '~/components';
import { getEquipment } from '~/data/loaders';

export function meta() {
  return [
    { title: 'Equipment | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Advanced research equipment and instrumentation at CAS across five specialized labs.',
    },
  ];
}

export default function Equipment() {
  const equipment = getEquipment();

  return (
    <Container>
      <Section>
        <Heading level={1}>Equipment</Heading>
        <Lede>
          {equipment.length} advanced research instruments and systems across
          five specialized labs.
        </Lede>
      </Section>

      <Section>
        <Grid columns={3}>
          {equipment.map((item) => (
            <Card key={item.id}>
              <Card.Title>
                <Link to={`/research/equipment/${item.id}`}>{item.name}</Link>
              </Card.Title>
              <Card.Body>{item.summary}</Card.Body>
            </Card>
          ))}
        </Grid>
      </Section>
    </Container>
  );
}
