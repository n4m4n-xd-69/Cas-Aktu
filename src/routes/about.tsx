import { Container, Heading, Lede, Section } from '~/components';
import {
  getFaculty,
  getPrograms,
  getStaff,
  getVisitingFaculty,
} from '~/data/loaders';

export function meta() {
  return [
    { title: 'About | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Centre for Advanced Studies (CAS) is an in-campus, research-driven institute of Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow.',
    },
  ];
}

export default function About() {
  const programs = getPrograms();
  const faculty = getFaculty();
  const visiting = getVisitingFaculty();
  const staff = getStaff();

  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>About CAS</Heading>
        <Lede>
          Centre for Advanced Studies (CAS) is an in-campus, research-driven
          institute of Dr. A.P.J. Abdul Kalam Technical University (AKTU),
          Lucknow.
        </Lede>

        <h2>Overview</h2>
        <p>
          CAS is dedicated to advanced research and postgraduate education in
          emerging technology areas. The institute offers M.Tech, B.Tech, and
          Ph.D. programmes across five specialized departments.
        </p>

        <h2>Programmes</h2>
        <p>
          CAS offers {programs.length} academic programmes spanning Computer
          Science & Engineering, Mechatronics, Manufacturing Technology &
          Automation, Nanotechnology, and Energy Science & Technology.
        </p>

        <h2>People</h2>
        <p>
          The institute has {faculty.length} faculty members, {visiting.length}{' '}
          visiting faculty, and {staff.length} staff members dedicated to
          advancing research and education in cutting-edge technology domains.
        </p>

        <h2>Mission</h2>
        <p>
          To become a centre of excellence in advanced technology research and
          education, fostering innovation and developing industry-ready
          professionals equipped to address real-world challenges.
        </p>
      </Section>
    </Container>
  );
}
