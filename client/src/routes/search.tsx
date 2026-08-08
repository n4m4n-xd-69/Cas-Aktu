import { Container, Heading, Lede, Section } from '~/components';

export function meta() {
  return [
    { title: 'Search | Centre for Advanced Studies' },
    {
      name: 'description',
      content: 'Search page titles and summaries across the CAS website.',
    },
  ];
}

/**
 * Search page.
 *
 * S4: placeholder. S5: wired to the command palette (Ctrl+K) with full-text
 * search across pages, people, documents, and research outputs.
 */
export default function Search() {
  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>Search</Heading>
        <Lede>
          Search page titles and summaries across the site. Press Ctrl+K from
          any page to open the command palette.
        </Lede>

        <p>
          <strong>Note:</strong> Full search functionality is implemented at S5
          (interactive features). The command palette will provide instant
          search across pages, people, documents, publications, and other
          content.
        </p>

        <h2>Browse by section</h2>
        <ul>
          <li>
            <a href="/academics">Academics</a> — programmes and departments
          </li>
          <li>
            <a href="/people">People</a> — faculty, staff, and visiting faculty
          </li>
          <li>
            <a href="/research">Research</a> — publications, patents, projects,
            equipment
          </li>
          <li>
            <a href="/updates">Updates</a> — notices and events
          </li>
          <li>
            <a href="/documents">Documents</a> — syllabi, regulations,
            timetables
          </li>
        </ul>
      </Section>
    </Container>
  );
}
