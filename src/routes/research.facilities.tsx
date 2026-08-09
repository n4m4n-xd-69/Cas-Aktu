import { Container, Grid, Heading, Lede, Section } from '~/components';

export function meta() {
  return [
    { title: 'Research Facilities | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'State-of-the-art research facilities at CAS supporting advanced technology research and innovation.',
    },
  ];
}

export default function Facilities() {
  return (
    <Container width="prose">
      <Section>
        <Heading level={1}>Research Facilities</Heading>
        <Lede>
          State-of-the-art research facilities supporting advanced technology
          research and innovation.
        </Lede>

        <h2>Laboratory infrastructure</h2>
        <p>
          CAS provides cutting-edge laboratory facilities across five
          specialized departments: Computer Science and Engineering,
          Mechatronics, Nanotechnology, Manufacturing Technology and Automation,
          and Energy Science and Technology.
        </p>

        <div style={{ marginTop: 'var(--space-6)' }}>
          <Grid columns={2}>
            <div>
              <h3>Advanced instrumentation</h3>
              <p>
                High-end research equipment including electron microscopes, 3D
                printing systems, robotics platforms, and nano-fabrication
                tools.
              </p>
            </div>

            <div>
              <h3>Computational resources</h3>
              <p>
                NVIDIA DGX-2 server with 2 petaflops computing power, Google
                Code Lab workstations, and specialized simulation software.
              </p>
            </div>

            <div>
              <h3>Collaborative spaces</h3>
              <p>
                Dedicated research labs for faculty and students with 24/7
                access, collaborative workspaces, and project development areas.
              </p>
            </div>

            <div>
              <h3>Safety and compliance</h3>
              <p>
                Full safety equipment, environmental controls, and adherence to
                international research standards and protocols.
              </p>
            </div>
          </Grid>
        </div>
      </Section>
    </Container>
  );
}
