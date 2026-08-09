import { Container, Heading, Lede, Section } from '~/components';

export function meta() {
  return [
    { title: 'Sitemap | Centre for Advanced Studies' },
    {
      name: 'description',
      content: 'Site map of all section and listing pages on the CAS website.',
    },
  ];
}

export default function Sitemap() {
  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>Sitemap</Heading>
        <Lede>
          Section and listing pages. Individual records (people, documents,
          notices, publications, and more) are linked from their listing page.
        </Lede>

        <h2>About</h2>
        <ul>
          <li>
            <a href="/about">About CAS</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
          <li>
            <a href="/campus">Campus & facilities</a>
          </li>
        </ul>

        <h2>Academics</h2>
        <ul>
          <li>
            <a href="/academics">All programmes</a>
          </li>
          <li>
            <a href="/admissions">Admissions</a>
          </li>
          <li>
            <a href="/documents">Document library</a>
          </li>
        </ul>

        <h2>People</h2>
        <ul>
          <li>
            <a href="/people">All people</a>
          </li>
          <li>
            <a href="/people/faculty">Faculty</a>
          </li>
          <li>
            <a href="/people/visiting">Visiting faculty</a>
          </li>
          <li>
            <a href="/people/staff">Staff</a>
          </li>
          <li>
            <a href="/people/former">Former members</a>
          </li>
        </ul>

        <h2>Research</h2>
        <ul>
          <li>
            <a href="/research">Research overview</a>
          </li>
          <li>
            <a href="/research/publications">Publications</a>
          </li>
          <li>
            <a href="/research/patents">Patents</a>
          </li>
          <li>
            <a href="/research/projects">Projects</a>
          </li>
          <li>
            <a href="/research/equipment">Equipment</a>
          </li>
          <li>
            <a href="/research/facilities">Facilities</a>
          </li>
        </ul>

        <h2>Updates</h2>
        <ul>
          <li>
            <a href="/updates">All updates</a>
          </li>
          <li>
            <a href="/updates/notices">Notices</a>
          </li>
          <li>
            <a href="/updates/events">Events & workshops</a>
          </li>
        </ul>

        <h2>Legal & policies</h2>
        <ul>
          <li>
            <a href="/privacy">Privacy notice</a>
          </li>
          <li>
            <a href="/copyright">Copyright</a>
          </li>
          <li>
            <a href="/terms">Terms of use</a>
          </li>
          <li>
            <a href="/security">Security</a>
          </li>
          <li>
            <a href="/accessibility">Accessibility</a>
          </li>
        </ul>

        <h2>Other</h2>
        <ul>
          <li>
            <a href="/search">Search</a>
          </li>
          <li>
            <a href="/sitemap">Sitemap</a> (this page)
          </li>
        </ul>
      </Section>
    </Container>
  );
}
