import { motion } from 'motion/react';
import { Link } from 'react-router';

import {
  Card,
  Container,
  Eyebrow,
  Grid,
  Heading,
  Lede,
  Section,
  Stack,
} from '~/components';
import {
  fadeUp,
  staggerContainer,
  staggerItem,
  heroReveal,
  scaleUp,
  transition,
} from '~/lib/motion';
import type { Route } from './+types/about';

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'About | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Learn about the Centre for Advanced Studies — our mission, vision, history, and commitment to academic excellence.',
    },
  ];
}

/* ------------------------------------------------------------------ */
/* About Hero                                                          */
/* ------------------------------------------------------------------ */

function AboutHero() {
  return (
    <section className="about-hero">
      <div className="about-hero-bg">
        <div className="about-hero-gradient" />
      </div>
      <Container>
        <div className="about-hero-content">
          <motion.div
            custom={0}
            variants={heroReveal}
            initial="hidden"
            animate="visible"
          >
            <Eyebrow>About CAS</Eyebrow>
          </motion.div>
          <motion.h1
            custom={1}
            variants={heroReveal}
            initial="hidden"
            animate="visible"
            className="about-hero-title"
          >
            Shaping the future
            <br />
            <span className="about-hero-accent">through knowledge</span>
          </motion.h1>
          <motion.p
            custom={2}
            variants={heroReveal}
            initial="hidden"
            animate="visible"
            className="about-hero-lede"
          >
            Founded with a vision to create a world-class institution for
            advanced learning and research, the Centre for Advanced Studies
            brings together brilliant minds to solve tomorrow's challenges.
          </motion.p>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Mission & Vision                                                    */
/* ------------------------------------------------------------------ */

function MissionVision() {
  return (
    <Section spacing="loose">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <Grid columns={2}>
            <motion.div variants={staggerItem}>
              <div className="mv-card">
                <div className="mv-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <path d="M14 3L17.09 9.26L24 10.27L19 15.14L20.18 22.02L14 18.77L7.82 22.02L9 15.14L4 10.27L10.91 9.26L14 3Z" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="mv-title">Our Mission</h3>
                <p className="mv-text">
                  To advance knowledge through cutting-edge research, foster
                  innovation through interdisciplinary collaboration, and prepare
                  the next generation of leaders who will address the world's most
                  complex challenges with creativity, integrity, and compassion.
                </p>
              </div>
            </motion.div>
            <motion.div variants={staggerItem}>
              <div className="mv-card">
                <div className="mv-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <circle cx="14" cy="14" r="10" stroke="var(--brand)" strokeWidth="1.5" />
                    <path d="M14 4V14L20 20" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="mv-title">Our Vision</h3>
                <p className="mv-text">
                  To be recognized globally as a centre of excellence in
                  education and research, where diverse perspectives converge to
                  create transformative knowledge that enriches lives, empowers
                  communities, and drives sustainable progress for humanity.
                </p>
              </div>
            </motion.div>
          </Grid>
        </motion.div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Values                                                              */
/* ------------------------------------------------------------------ */

const VALUES = [
  {
    icon: '🎯',
    title: 'Excellence',
    desc: 'We pursue the highest standards in everything we do — from research methodology to classroom instruction.',
  },
  {
    icon: '🤝',
    title: 'Collaboration',
    desc: 'Breakthroughs happen at the intersection of disciplines. We foster partnerships across boundaries.',
  },
  {
    icon: '🌱',
    title: 'Sustainability',
    desc: 'Our research and operations are guided by a commitment to environmental and social responsibility.',
  },
  {
    icon: '💡',
    title: 'Innovation',
    desc: 'We encourage bold thinking, creative problem-solving, and the courage to challenge conventional wisdom.',
  },
  {
    icon: '🌍',
    title: 'Diversity',
    desc: 'A multiplicity of perspectives strengthens our scholarship and enriches our community.',
  },
  {
    icon: '📚',
    title: 'Integrity',
    desc: 'Academic honesty, ethical conduct, and transparency form the bedrock of our institution.',
  },
];

function Values() {
  return (
    <Section tone="subtle" spacing="loose">
      <Container>
        <motion.div
          className="section-header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <Eyebrow>Our Values</Eyebrow>
          <Heading level={2}>What drives us</Heading>
          <Lede>
            The principles that guide our decisions, shape our culture, and
            define our commitment to the academic community.
          </Lede>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          style={{ marginTop: 'var(--space-10)' }}
        >
          <Grid columns={3}>
            {VALUES.map((value) => (
              <motion.div key={value.title} variants={staggerItem}>
                <Card>
                  <Card.Icon>
                    <span style={{ fontSize: '1.25rem' }}>{value.icon}</span>
                  </Card.Icon>
                  <Card.Title>{value.title}</Card.Title>
                  <Card.Body>{value.desc}</Card.Body>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

const TIMELINE = [
  { year: '2008', title: 'Foundation', desc: 'CAS established with three initial departments and a vision for excellence.' },
  { year: '2012', title: 'First Graduating Class', desc: '120 students graduated with distinction, many joining top research institutions.' },
  { year: '2016', title: 'Research Expansion', desc: 'Five new research centres opened, including the Quantum Computing Lab.' },
  { year: '2020', title: 'Global Recognition', desc: 'Ranked among the top 100 institutions for research output in engineering.' },
  { year: '2024', title: 'New Campus', desc: 'State-of-the-art campus inaugurated with sustainable design principles.' },
];

function Timeline() {
  return (
    <Section spacing="loose">
      <Container>
        <motion.div
          className="section-header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <Eyebrow>Our Journey</Eyebrow>
          <Heading level={2}>Milestones that define us</Heading>
        </motion.div>

        <div className="timeline">
          {TIMELINE.map((item, i) => (
            <motion.div
              key={item.year}
              className="timeline-item"
              variants={i % 2 === 0 ? fadeUp : fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              <div className="timeline-marker">
                <div className="timeline-dot" />
                {i < TIMELINE.length - 1 && <div className="timeline-line" />}
              </div>
              <div className="timeline-content">
                <span className="timeline-year">{item.year}</span>
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-desc">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function About() {
  return (
    <>
      <AboutHero />
      <MissionVision />
      <Values />
      <Timeline />
      <style>{aboutStyles}</style>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const aboutStyles = `
/* ---- About Hero ---- */
.about-hero {
  position: relative;
  padding: calc(var(--header-h) + var(--space-16)) 0 var(--space-16);
  overflow: hidden;
  background: var(--bg);
}

.about-hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.about-hero-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 30% 50%, rgba(41, 43, 136, 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 80% 30%, rgba(165, 30, 45, 0.04) 0%, transparent 70%);
}

.about-hero-content {
  position: relative;
  z-index: 1;
  max-width: 640px;
}

.about-hero-title {
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--text);
  margin-bottom: var(--space-6);
}

.about-hero-accent {
  background: var(--gradient-brand);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.about-hero-lede {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
}

/* ---- Mission & Vision ---- */
.mv-card {
  padding: var(--space-8);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  height: 100%;
  transition:
    border-color var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out);
}

.mv-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-card-hover);
}

.mv-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: var(--brand-light);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-5);
}

.mv-title {
  font-family: var(--font-sans);
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  color: var(--text);
  margin-bottom: var(--space-3);
  letter-spacing: var(--tracking-snug);
}

.mv-text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

/* ---- Section header ---- */
.section-header {
  max-width: 56ch;
  margin-bottom: var(--space-2);
}

/* ---- Timeline ---- */
.timeline {
  margin-top: var(--space-10);
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 640px;
}

.timeline-item {
  display: flex;
  gap: var(--space-6);
  position: relative;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 20px;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--brand);
  border: 3px solid var(--brand-light);
  flex-shrink: 0;
  z-index: 1;
}

.timeline-line {
  width: 2px;
  flex: 1;
  background: var(--border);
  margin-top: var(--space-1);
}

.timeline-content {
  padding-bottom: var(--space-8);
}

.timeline-year {
  display: inline-block;
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--brand);
  background: var(--brand-light);
  padding: 0.15rem 0.6rem;
  border-radius: var(--radius-full);
  margin-bottom: var(--space-2);
}

.timeline-title {
  font-family: var(--font-sans);
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  color: var(--text);
  margin-bottom: var(--space-2);
  letter-spacing: var(--tracking-snug);
}

.timeline-desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .about-hero-title {
    font-size: var(--text-4xl);
  }
}
`;
