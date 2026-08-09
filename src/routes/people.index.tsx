import {
  Button,
  Card,
  Container,
  Grid,
  Heading,
  Lede,
  Section,
} from '~/components';
import {
  getFaculty,
  getFormerFaculty,
  getStaff,
  getVisitingFaculty,
} from '~/data/loaders';

export function meta() {
  return [
    { title: 'People | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Faculty, visiting faculty, staff, and former members of the Centre for Advanced Studies.',
    },
  ];
}

export default function People() {
  const faculty = getFaculty();
  const visiting = getVisitingFaculty();
  const staff = getStaff();
  const former = getFormerFaculty();

  return (
    <Container>
      <Section>
        <Heading level={1}>People</Heading>
        <Lede>
          Faculty, visiting faculty, staff, and former members of the Centre for
          Advanced Studies.
        </Lede>

        <div style={{ marginTop: 'var(--space-8)' }}>
          <Grid columns={4}>
            <Card>
              <Card.Title>Faculty</Card.Title>
              <Card.Body>
                {faculty.length} faculty members conducting research and
                teaching across five specialized departments.
              </Card.Body>
              <Card.Foot>
                <Button variant="secondary" href="/people/faculty">
                  View faculty
                </Button>
              </Card.Foot>
            </Card>

            <Card>
              <Card.Title>Visiting Faculty</Card.Title>
              <Card.Body>
                {visiting.length} visiting faculty members contributing
                expertise and research collaboration.
              </Card.Body>
              <Card.Foot>
                <Button variant="secondary" href="/people/visiting">
                  View visiting faculty
                </Button>
              </Card.Foot>
            </Card>

            <Card>
              <Card.Title>Staff</Card.Title>
              <Card.Body>
                {staff.length} administrative and technical staff supporting CAS
                operations and research.
              </Card.Body>
              <Card.Foot>
                <Button variant="secondary" href="/people/staff">
                  View staff
                </Button>
              </Card.Foot>
            </Card>

            <Card>
              <Card.Title>Former Members</Card.Title>
              <Card.Body>
                {former.length} former faculty members who have contributed to
                CAS over the years.
              </Card.Body>
              <Card.Foot>
                <Button variant="secondary" href="/people/former">
                  View former members
                </Button>
              </Card.Foot>
            </Card>
          </Grid>
        </div>
      </Section>
    </Container>
  );
}
