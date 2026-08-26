import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Link } from 'react-router';

import {
  Button,
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
  float,
} from '~/lib/motion';
import type { Route } from './+types/home';

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Advancing knowledge through interdisciplinary research, innovative teaching, and a commitment to academic excellence.',
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="hero" style={heroStyle}>
      {/* Decorative background elements */}
      <motion.div style={{ y: bgY }} className="hero-bg">
        <div className="hero-gradient" />
        <div className="hero-grid-pattern" />
        <motion.div
          className="hero-orb hero-orb-1"
          variants={float}
          initial="initial"
          animate="animate"
        />
        <motion.div
          className="hero-orb hero-orb-2"
          variants={float}
          initial="initial"
          animate="animate"
          style={{ animationDelay: '2s' }}
        />
      </motion.div>

      <motion.div style={{ opacity }} className="hero-content">
        <Container>
          <div className="hero-inner">
            <motion.div
              custom={0}
              variants={heroReveal}
              initial="hidden"
              animate="visible"
              className="hero-badge"
            >
              <span className="hero-badge-dot" />
              Admissions Open 2026–27
            </motion.div>

            <motion.h1
              custom={1}
              variants={heroReveal}
              initial="hidden"
              animate="visible"
              className="hero-title"
            >
              Centre for
              <br />
              <span className="hero-title-accent">Advanced Studies</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={heroReveal}
              initial="hidden"
              animate="visible"
              className="hero-lede"
            >
              Advancing knowledge through interdisciplinary research, innovative
              teaching, and a commitment to academic excellence that shapes the
              leaders of tomorrow.
            </motion.p>

            <motion.div
              custom={3}
              variants={heroReveal}
              initial="hidden"
              animate="visible"
              className="hero-actions"
            >
              <Link to="/about" className="hero-btn-primary">
                Explore Programmes
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M7 5L12 9L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link to="/about" className="hero-btn-secondary">
                Virtual Tour
              </Link>
            </motion.div>

            <motion.div
              custom={4}
              variants={heroReveal}
              initial="hidden"
              animate="visible"
              className="hero-stats"
            >
              {[
                { value: '12+', label: 'Programmes' },
                { value: '200+', label: 'Faculty' },
                { value: '50+', label: 'Research Labs' },
                { value: '95%', label: 'Placement' },
              ].map((stat) => (
                <div key={stat.label} className="hero-stat">
                  <span className="hero-stat-value">{stat.value}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </Container>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Programmes                                                          */
/* ------------------------------------------------------------------ */

const PROGRAMMES = [
  {
    eyebrow: 'Postgraduate',
    title: 'M.Tech Nanotechnology',
    body: 'Two-year programme covering nanomaterials, nanoelectronics, and molecular engineering with hands-on lab experience.',
    seats: '18 seats',
    icon: '🔬',
  },
  {
    eyebrow: 'Postgraduate',
    title: 'M.Tech Mechatronics',
    body: 'Integrates mechanical engineering, electronics, and computing to design intelligent systems and automation.',
    seats: '24 seats',
    icon: '⚙️',
  },
  {
    eyebrow: 'Postgraduate',
    title: 'M.Tech Computer Science',
    body: 'Advanced computing with specializations in AI, machine learning, cybersecurity, and distributed systems.',
    seats: '30 seats',
    icon: '💻',
  },
  {
    eyebrow: 'Doctoral',
    title: 'Ph.D. Programme',
    body: 'Interdisciplinary doctoral research across all departments with dedicated supervisors and funded positions.',
    seats: 'Rolling admissions',
    icon: '🎓',
  },
  {
    eyebrow: 'Certificate',
    title: 'Executive Programme',
    body: 'Short-term professional development courses for industry professionals seeking advanced skills.',
    seats: '40 seats',
    icon: '📊',
  },
  {
    eyebrow: 'Postgraduate',
    title: 'M.Tech VLSI Design',
    body: 'Specialized programme in chip design, verification, and fabrication with industry-standard EDA tools.',
    seats: '20 seats',
    icon: '🔌',
  },
];

function Programmes() {
  return (
    <Section spacing="loose" id="programmes">
      <Container>
        <motion.div
          className="section-header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <Eyebrow>Academic Programmes</Eyebrow>
          <Heading level={2}>Shape your future with us</Heading>
          <Lede>
            World-class programmes designed to push the boundaries of knowledge
            and prepare you for the challenges of tomorrow.
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
            {PROGRAMMES.map((prog) => (
              <motion.div key={prog.title} variants={staggerItem}>
                <Card>
                  <Card.Icon>
                    <span style={{ fontSize: '1.25rem' }}>{prog.icon}</span>
                  </Card.Icon>
                  <Card.Eyebrow>{prog.eyebrow}</Card.Eyebrow>
                  <Card.Title>
                    <a href="#programmes">{prog.title}</a>
                  </Card.Title>
                  <Card.Body>{prog.body}</Card.Body>
                  <Card.Foot>{prog.seats}</Card.Foot>
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
/* Stats Band                                                          */
/* ------------------------------------------------------------------ */

function StatsBand() {
  const stats = [
    { value: '392', label: 'Research Papers', suffix: '+' },
    { value: '48', label: 'Active Projects', suffix: '' },
    { value: '15', label: 'Industry Partners', suffix: '+' },
    { value: '2,400', label: 'Alumni Network', suffix: '+' },
  ];

  return (
    <section className="stats-band">
      <Container>
        <motion.div
          className="stats-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat-item"
              variants={staggerItem}
              custom={i}
            >
              <span className="stat-value">
                {stat.value}
                {stat.suffix}
              </span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Research Highlights                                                 */
/* ------------------------------------------------------------------ */

const RESEARCH = [
  {
    title: 'Quantum Computing Lab',
    desc: 'Pioneering research in quantum algorithms and error correction for next-generation computing.',
    tag: 'Active',
  },
  {
    title: 'Sustainable Energy Systems',
    desc: 'Developing novel photovoltaic materials and energy storage solutions for a carbon-neutral future.',
    tag: 'Funded',
  },
  {
    title: 'AI & Healthcare',
    desc: 'Applying machine learning to medical imaging, drug discovery, and personalized treatment plans.',
    tag: 'Collaborative',
  },
];

function Research() {
  return (
    <Section spacing="loose" id="research">
      <Container>
        <motion.div
          className="section-header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <Eyebrow>Research</Eyebrow>
          <Heading level={2}>Pushing boundaries</Heading>
          <Lede>
            Our research centres are at the forefront of discovery, tackling
            some of the world's most pressing challenges.
          </Lede>
        </motion.div>

        <motion.div
          className="research-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {RESEARCH.map((item, i) => (
            <motion.div
              key={item.title}
              className="research-card"
              variants={scaleUp}
              whileHover={{ y: -4, transition: transition.base }}
            >
              <div className="research-card-number">0{i + 1}</div>
              <h3 className="research-card-title">{item.title}</h3>
              <p className="research-card-desc">{item.desc}</p>
              <span className="research-card-tag">{item.tag}</span>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA                                                                 */
/* ------------------------------------------------------------------ */

function CTA() {
  return (
    <section className="cta-section">
      <Container>
        <motion.div
          className="cta-card"
          variants={scaleUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="cta-content">
            <Heading level={2}>Ready to begin your journey?</Heading>
            <Lede>
              Join a community of scholars, researchers, and innovators shaping
              the future of technology and science.
            </Lede>
            <div className="cta-actions">
              <Link to="/about" className="cta-btn-primary">
                Apply Now
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M7 5L12 9L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link to="/about" className="cta-btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
          <div className="cta-decoration">
            <div className="cta-circle cta-circle-1" />
            <div className="cta-circle cta-circle-2" />
            <div className="cta-circle cta-circle-3" />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <>
      <Hero />
      <Programmes />
      <StatsBand />
      <Research />
      <CTA />
      <style>{pageStyles}</style>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const heroStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  paddingTop: 'var(--header-h)',
};

const pageStyles = `
/* ---- Hero ---- */
.hero {
  background: var(--bg);
}

.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 70% 40%, rgba(41, 43, 136, 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 60% 50% at 20% 80%, rgba(165, 30, 45, 0.04) 0%, transparent 70%);
}

.hero-grid-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(41, 43, 136, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(41, 43, 136, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 70%);
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.hero-orb-1 {
  width: 500px;
  height: 500px;
  background: rgba(41, 43, 136, 0.08);
  top: -100px;
  right: -100px;
}

.hero-orb-2 {
  width: 400px;
  height: 400px;
  background: rgba(165, 30, 45, 0.05);
  bottom: -80px;
  left: -80px;
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
}

.hero-inner {
  max-width: 720px;
  padding: var(--space-16) 0 var(--space-20);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.4rem 1rem;
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--brand);
  background: var(--brand-light);
  border: 1px solid rgba(41, 43, 136, 0.12);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-6);
}

.hero-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--success);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.3); }
}

.hero-title {
  font-family: var(--font-display);
  font-size: var(--text-6xl);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--text);
  margin-bottom: var(--space-6);
}

.hero-title-accent {
  background: var(--gradient-brand);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-lede {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  max-width: 54ch;
  margin-bottom: var(--space-8);
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-bottom: var(--space-12);
}

.hero-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.85rem 1.75rem;
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--on-brand);
  background: var(--brand);
  border-radius: var(--radius-full);
  text-decoration: none;
  box-shadow: var(--shadow-md), 0 0 0 0 rgba(41, 43, 136, 0);
  transition:
    background var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out),
    box-shadow var(--dur-fast) var(--ease-out);
}

.hero-btn-primary:hover {
  background: var(--brand-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), 0 0 0 4px rgba(41, 43, 136, 0.12);
  color: var(--on-brand);
}

.hero-btn-primary svg {
  transition: transform var(--dur-fast) var(--ease-out);
}

.hero-btn-primary:hover svg {
  transform: translateX(3px);
}

.hero-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.85rem 1.75rem;
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-full);
  text-decoration: none;
  transition:
    border-color var(--dur-fast) var(--ease-out),
    background var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
}

.hero-btn-secondary:hover {
  border-color: var(--brand);
  color: var(--brand);
  transform: translateY(-2px);
}

.hero-stats {
  display: flex;
  gap: var(--space-10);
  flex-wrap: wrap;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.hero-stat-value {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  color: var(--brand);
  line-height: 1;
}

.hero-stat-label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  font-weight: var(--weight-medium);
}

/* ---- Section header ---- */
.section-header {
  max-width: 56ch;
  margin-bottom: var(--space-2);
}

/* ---- Stats band ---- */
.stats-band {
  background: var(--ink);
  padding: var(--space-12) 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-8);
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.stat-value {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--weight-bold);
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--on-ink-dim);
  font-weight: var(--weight-medium);
}

/* ---- Research ---- */
.research-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
  margin-top: var(--space-10);
}

.research-card {
  position: relative;
  padding: var(--space-8);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition:
    border-color var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out);
}

.research-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-card-hover);
}

.research-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-brand);
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-out);
}

.research-card:hover::before {
  opacity: 1;
}

.research-card-number {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--weight-bold);
  color: var(--bg-muted);
  line-height: 1;
  margin-bottom: var(--space-4);
}

.research-card-title {
  font-family: var(--font-sans);
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  color: var(--text);
  margin-bottom: var(--space-3);
  letter-spacing: var(--tracking-snug);
}

.research-card-desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}

.research-card-tag {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--brand);
  background: var(--brand-light);
  border-radius: var(--radius-full);
}

/* ---- CTA ---- */
.cta-section {
  padding: var(--space-16) 0;
}

.cta-card {
  position: relative;
  padding: var(--space-16) var(--space-12);
  background: var(--gradient-brand);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  text-align: center;
}

.cta-content {
  position: relative;
  z-index: 1;
  max-width: 56ch;
  margin: 0 auto;
}

.cta-content h2 {
  color: white;
  margin-bottom: var(--space-4);
}

.cta-content .lede {
  color: rgba(255, 255, 255, 0.8);
  margin: 0 auto var(--space-8);
}

.cta-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.cta-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.85rem 1.75rem;
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--brand);
  background: white;
  border-radius: var(--radius-full);
  text-decoration: none;
  box-shadow: var(--shadow-md);
  transition:
    transform var(--dur-fast) var(--ease-out),
    box-shadow var(--dur-fast) var(--ease-out);
}

.cta-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  color: var(--brand);
}

.cta-btn-primary svg {
  transition: transform var(--dur-fast) var(--ease-out);
}

.cta-btn-primary:hover svg {
  transform: translateX(3px);
}

.cta-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.85rem 1.75rem;
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: white;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-full);
  text-decoration: none;
  backdrop-filter: blur(8px);
  transition:
    background var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
}

.cta-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  color: white;
}

.cta-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cta-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.cta-circle-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  right: -100px;
}

.cta-circle-2 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: -50px;
}

.cta-circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .hero-inner {
    padding: var(--space-10) 0 var(--space-12);
  }

  .hero-title {
    font-size: var(--text-4xl);
  }

  .hero-stats {
    gap: var(--space-6);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }

  .research-grid {
    grid-template-columns: 1fr;
  }

  .cta-card {
    padding: var(--space-10) var(--space-6);
  }
}

@media (max-width: 480px) {
  .hero-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-stats {
    flex-direction: column;
    gap: var(--space-4);
  }

  .cta-actions {
    flex-direction: column;
  }
}
`;
