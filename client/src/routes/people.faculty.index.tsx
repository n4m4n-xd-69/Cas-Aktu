import { useMemo, useState } from 'react';
import { Link } from 'react-router';

import {
  Card,
  Container,
  FadeIn,
  Grid,
  Heading,
  Lede,
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

  const filteredFaculty = useMemo(() => {
    if (!search) return allFaculty;

    const lowerSearch = search.toLowerCase();
    return allFaculty.filter(
      (person) =>
        person.name.toLowerCase().includes(lowerSearch) ||
        person.title.toLowerCase().includes(lowerSearch) ||
        (person.department &&
          person.department.toLowerCase().includes(lowerSearch)) ||
        (person.interests &&
          person.interests.some((interest) =>
            interest.toLowerCase().includes(lowerSearch),
          )),
    );
  }, [allFaculty, search]);

  return (
    <Container>
      <Section>
        <Heading level={1}>Faculty</Heading>
        <Lede>
          {allFaculty.length} faculty members conducting research and teaching
          across five specialized departments.
        </Lede>
      </Section>

      <Section>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <input
            type="search"
            placeholder="Search faculty by name, title, department, or interests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search faculty"
            style={{
              width: '100%',
              padding: 'var(--space-3) var(--space-4)',
              fontSize: 'var(--text-base)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface)',
              color: 'var(--text)',
            }}
          />
        </div>

        {search && (
          <p
            style={{
              marginBottom: 'var(--space-4)',
              color: 'var(--text-secondary)',
            }}
          >
            Showing {filteredFaculty.length} of {allFaculty.length} faculty
            member
            {filteredFaculty.length !== 1 ? 's' : ''}
          </p>
        )}

        <FadeIn>
          <Grid columns={3}>
            {filteredFaculty.map((person, i) => (
              <FadeIn key={person.slug} delay={i * 50}>
                <Card>
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
              </FadeIn>
            ))}
          </Grid>
        </FadeIn>

        {filteredFaculty.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            No faculty members found matching "{search}"
          </p>
        )}
      </Section>
    </Container>
  );
}
