import { Container, Heading, Lede, Section } from '~/components';
import {
  getDocuments,
  getEquipment,
  getEvents,
  getFaculty,
  getFormerFaculty,
  getNotices,
  getPatents,
  getPrograms,
  getProjects,
  getPublications,
  getStaff,
  getVisitingFaculty,
} from '~/data/loaders';

export function meta() {
  return [
    { title: 'About | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'S1 proof route — demonstrates prerender with directory-form URLs.',
    },
  ];
}

export default function About() {
  // S3 proof: loaders work, counts match the Python export exactly.
  const counts = {
    programmes: getPrograms().length,
    faculty: getFaculty().length,
    formerFaculty: getFormerFaculty().length,
    staff: getStaff().length,
    visitingFaculty: getVisitingFaculty().length,
    notices: getNotices().length,
    events: getEvents().length,
    publications: getPublications().length,
    patents: getPatents().length,
    equipment: getEquipment().length,
    projects: getProjects().length,
    documents: getDocuments().length,
  };
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <Container>
      <Section>
        <Heading level={1}>About</Heading>
        <Lede>
          S1 proof route — demonstrates prerender with directory-form URLs. Now
          also proving S3: the data layer is wired and record counts match the
          Python export.
        </Lede>

        <h2 style={{ marginTop: 'var(--space-8)' }}>
          Data Layer — S3 Verification
        </h2>
        <p>
          All 12 collections loaded through <code>src/data/loaders.ts</code>:
        </p>
        <ul>
          <li>Programmes: {counts.programmes}</li>
          <li>Faculty: {counts.faculty}</li>
          <li>Former Faculty: {counts.formerFaculty}</li>
          <li>Staff: {counts.staff}</li>
          <li>Visiting Faculty: {counts.visitingFaculty}</li>
          <li>Notices: {counts.notices}</li>
          <li>Events: {counts.events}</li>
          <li>Publications: {counts.publications}</li>
          <li>Patents: {counts.patents}</li>
          <li>Equipment: {counts.equipment}</li>
          <li>Projects: {counts.projects}</li>
          <li>Documents: {counts.documents}</li>
        </ul>
        <p>
          <strong>Total: {total} records</strong>
        </p>
      </Section>
    </Container>
  );
}
