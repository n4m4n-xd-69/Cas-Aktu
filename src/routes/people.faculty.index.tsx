import { useMemo, useState } from 'react';
import { Link } from 'react-router';

import {
  Card,
  Container,
  EmptyState,
  FadeIn,
  Grid,
  PageHeader,
  SearchField,
  Section,
} from '~/components';
import { getFaculty } from '~/data/loaders';

export function meta() {
  return [
    { title: 'Faculty | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Faculty members at CAS conducting research and teaching in Computer Science, Mechatronics, Nanotechnology, Manufacturing, and Energy Science.',
    },
  ];
}

export default function Faculty() {
  const allFaculty = getFaculty();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return allFaculty;

    const q = search.toLowerCase();
    return allFaculty.filter(
      (person) =>
        person.name.toLowerCase().includes(q) ||
        person.title.toLowerCase().includes(q) ||
        person.department?.toLowerCase().includes(q) ||
        person.interests?.some((i) => i.toLowerCase().includes(q)),
    );
  }, [allFaculty, search]);

  return (
    <>
      <PageHeader
        eyebrow="People"
        title="Faculty"
        lede={`${allFaculty.length} faculty members conducting research and teaching across five specialised departments.`}
      >
        <SearchField
          label="Search faculty"
          placeholder="Search by name, title, department or interest…"
          value={search}
          onChange={setSearch}
          resultCount={filtered.length}
        />
      </PageHeader>

      <Section>
        <Container>
          {filtered.length > 0 ? (
            <FadeIn>
              <Grid columns={3}>
                {filtered.map((person) => (
                  <Card key={person.slug}>
                    <Card.Title>
                      <Link to={`/people/faculty/${person.slug}`}>
                        {person.name}
                      </Link>
                    </Card.Title>
                    <Card.Body>{person.title}</Card.Body>
                    {person.department && (
                      <Card.Foot>{person.department}</Card.Foot>
                    )}
                  </Card>
                ))}
              </Grid>
            </FadeIn>
          ) : (
            <EmptyState
              title="No faculty members match that search"
              description={`Nothing found for “${search}”. Try a department, a research interest, or part of a name.`}
            />
          )}
        </Container>
      </Section>
    </>
  );
}
