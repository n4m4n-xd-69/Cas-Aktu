import { useState } from 'react';

import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Chip,
  ChipGroup,
  Container,
  Eyebrow,
  Grid,
  Heading,
  Lede,
  Pagination,
  Rule,
  Section,
  Stack,
} from '~/components';

/**
 * Development-only component gallery. Not registered in production builds
 * (see routes.ts) and never prerendered.
 *
 * Purpose: render every primitive and every variant on one page so S2's
 * "no visual regressions" check can be made by looking, and so later stages
 * have somewhere to see the library.
 */
export default function Primitives() {
  const [page, setPage] = useState(4);
  const [filters, setFilters] = useState(['Patents', '2024', 'Nanotechnology']);

  return (
    <Container>
      <Section spacing="tight">
        <Eyebrow>Development only</Eyebrow>
        <Heading level={1}>Component primitives</Heading>
        <Lede>
          Every primitive ported at S2, with each variant that survives into the
          React app. This route is not built in production.
        </Lede>
      </Section>

      <Rule />

      <Section spacing="tight">
        <Heading level={2}>Breadcrumb</Heading>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Research', href: '/research' },
            { label: 'Patents' },
          ]}
        />
      </Section>

      <Rule />

      <Section spacing="tight">
        <Heading level={2}>Button</Heading>
        <Stack>
          <div
            style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}
          >
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
            <Button variant="secondary" size="sm">
              Small
            </Button>
            <Button variant="primary" href="https://example.org">
              As a link
            </Button>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-3)',
              flexWrap: 'wrap',
              background: 'var(--ink)',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <Button variant="ondark">On dark</Button>
          </div>
        </Stack>
      </Section>

      <Rule />

      <Section spacing="tight">
        <Heading level={2}>Badge</Heading>
        <div
          style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}
        >
          <Badge tone="open">Open</Badge>
          <Badge tone="closing">Closing soon</Badge>
          <Badge tone="archived">Archived</Badge>
          <Badge tone="draft">Draft</Badge>
          <Badge tone="canceled">Cancelled</Badge>
        </div>
      </Section>

      <Rule />

      <Section spacing="tight">
        <Heading level={2}>Chip</Heading>
        <ChipGroup>
          {filters.map((f) => (
            <Chip
              key={f}
              onDismiss={() => setFilters((cur) => cur.filter((x) => x !== f))}
              dismissLabel={`Remove filter: ${f}`}
            >
              {f}
            </Chip>
          ))}
          {filters.length === 0 ? <Chip>No filters applied</Chip> : null}
        </ChipGroup>
      </Section>

      <Rule />

      <Section spacing="tight">
        <Heading level={2}>Card and Grid</Heading>
        <Grid columns={3}>
          {['Nanotechnology', 'Mechatronics', 'Computer Science'].map(
            (name) => (
              <Card key={name}>
                <Card.Eyebrow>Programme</Card.Eyebrow>
                <Card.Title>
                  <a href="#card">M.Tech {name}</a>
                </Card.Title>
                <Card.Body>
                  Two-year postgraduate programme. Whole-card click target via
                  the title link.
                </Card.Body>
                <Card.Foot>18 seats</Card.Foot>
              </Card>
            ),
          )}
        </Grid>
        <div style={{ marginTop: 'var(--space-6)' }}>
          <Card feature>
            <Card.Title>Feature card</Card.Title>
            <Card.Body>Larger padding, subtle background.</Card.Body>
          </Card>
        </div>
      </Section>

      <Rule />

      <Section spacing="tight">
        <Heading level={2}>Pagination</Heading>
        <Pagination page={page} totalPages={12} onPageChange={setPage} />
      </Section>

      <Rule />

      <Section tone="subtle" spacing="tight">
        <Heading level={2}>Section tones</Heading>
        <p>This band uses tone=&quot;subtle&quot;.</p>
      </Section>
    </Container>
  );
}
