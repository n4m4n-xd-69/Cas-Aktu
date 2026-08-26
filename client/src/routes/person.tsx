import { motion } from 'motion/react';
import { Link } from 'react-router';

import {
  Badge,
  Breadcrumb,
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
  slideLeft,
  transition,
} from '~/lib/motion';
import type { Route } from './+types/person';

/**
 * Runs at build time, not in the browser.
 */
export function loader({ params }: Route.LoaderArgs) {
  return { slug: params.slug };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: `${loaderData?.slug ?? 'Person'} | Centre for Advanced Studies` },
    {
      name: 'description',
      content: `Faculty profile for ${loaderData?.slug ?? 'a member'} at the Centre for Advanced Studies.`,
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Profile data (mock)                                                 */
/* ------------------------------------------------------------------ */

const PROFILE = {
  name: 'Dr. Priya Sharma',
  title: 'Professor & Head of Department',
  department: 'Department of Nanotechnology',
  email: 'priya.sharma@cas.edu',
  phone: '+91 1234 567 890',
  office: 'Room 302, Block A',
  specializations: ['Nanomaterials', 'Quantum Dots', 'Surface Engineering', 'Thin Films'],
  bio: 'Dr. Priya Sharma is a leading researcher in nanomaterials and surface engineering with over 15 years of experience. Her work on quantum dot synthesis has been published in Nature Materials and Advanced Functional Materials. She leads a team of 12 researchers and has supervised 8 doctoral theses.',
  education: [
    { degree: 'Ph.D. in Materials Science', institution: 'IIT Bombay', year: '2008' },
    { degree: 'M.Tech in Nanotechnology', institution: 'IIT Kanpur', year: '2004' },
    { degree: 'B.Tech in Chemical Engineering', institution: 'NIT Trichy', year: '2002' },
  ],
  publications: 48,
  citations: 1240,
  hIndex: 18,
  projects: 6,
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Person({ loaderData }: Route.ComponentProps) {
  return (
    <>
      {/* Hero */}
      <section className="person-hero">
        <div className="person-hero-bg">
          <div className="person-hero-gradient" />
        </div>
        <Container>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'People', href: '/#people' },
              { label: 'Faculty' },
            ]}
          />

          <motion.div
            className="person-hero-content"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="person-avatar" variants={heroReveal} custom={0}>
              <div className="person-avatar-inner">
                <span className="person-avatar-initials">PS</span>
              </div>
              <div className="person-avatar-ring" />
            </motion.div>

            <motion.div className="person-info" variants={heroReveal} custom={1}>
              <Eyebrow>{PROFILE.department}</Eyebrow>
              <h1 className="person-name">{PROFILE.name}</h1>
              <p className="person-title-text">{PROFILE.title}</p>
              <p className="person-bio">{PROFILE.bio}</p>

              <div className="person-specializations">
                {PROFILE.specializations.map((spec) => (
                  <span key={spec} className="person-spec-tag">{spec}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Stats */}
      <Section spacing="tight">
        <Container>
          <motion.div
            className="person-stats-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { value: PROFILE.publications, label: 'Publications' },
              { value: PROFILE.citations.toLocaleString(), label: 'Citations' },
              { value: PROFILE.hIndex, label: 'h-index' },
              { value: PROFILE.projects, label: 'Active Projects' },
            ].map((stat) => (
              <motion.div key={stat.label} className="person-stat-card" variants={staggerItem}>
                <span className="person-stat-value">{stat.value}</span>
                <span className="person-stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* Details */}
      <Section spacing="loose">
        <Container>
          <div className="person-details-grid">
            <motion.div
              className="person-detail-section"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="person-detail-heading">Education</h2>
              <div className="person-education-list">
                {PROFILE.education.map((edu) => (
                  <div key={edu.degree} className="person-edu-item">
                    <span className="person-edu-year">{edu.year}</span>
                    <div>
                      <p className="person-edu-degree">{edu.degree}</p>
                      <p className="person-edu-institution">{edu.institution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="person-detail-section"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="person-detail-heading">Contact</h2>
              <div className="person-contact-list">
                <div className="person-contact-item">
                  <span className="person-contact-label">Email</span>
                  <a href={`mailto:${PROFILE.email}`} className="person-contact-value">
                    {PROFILE.email}
                  </a>
                </div>
                <div className="person-contact-item">
                  <span className="person-contact-label">Phone</span>
                  <span className="person-contact-value">{PROFILE.phone}</span>
                </div>
                <div className="person-contact-item">
                  <span className="person-contact-label">Office</span>
                  <span className="person-contact-value">{PROFILE.office}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      <style>{personStyles}</style>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const personStyles = `
/* ---- Person Hero ---- */
.person-hero {
  position: relative;
  padding: calc(var(--header-h) + var(--space-10)) 0 var(--space-12);
  overflow: hidden;
  background: var(--bg);
}

.person-hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.person-hero-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 50% at 20% 60%, rgba(41, 43, 136, 0.05) 0%, transparent 70%);
}

.person-hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  gap: var(--space-10);
  align-items: flex-start;
  margin-top: var(--space-6);
}

.person-avatar {
  position: relative;
  flex-shrink: 0;
}

.person-avatar-inner {
  width: 140px;
  height: 140px;
  border-radius: var(--radius-2xl);
  background: var(--gradient-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.person-avatar-initials {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--weight-bold);
  color: white;
}

.person-avatar-ring {
  position: absolute;
  inset: -6px;
  border-radius: calc(var(--radius-2xl) + 6px);
  border: 2px solid var(--brand-light);
  z-index: 0;
}

.person-info {
  flex: 1;
  min-width: 0;
}

.person-name {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--weight-bold);
  color: var(--text);
  margin-bottom: var(--space-2);
}

.person-title-text {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
}

.person-bio {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  max-width: 60ch;
  margin-bottom: var(--space-5);
}

.person-specializations {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.person-spec-tag {
  display: inline-flex;
  padding: 0.3rem 0.8rem;
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--brand);
  background: var(--brand-light);
  border-radius: var(--radius-full);
}

/* ---- Stats ---- */
.person-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.person-stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-6);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  text-align: center;
  transition:
    border-color var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out);
}

.person-stat-card:hover {
  border-color: var(--brand);
  box-shadow: var(--shadow-glow);
}

.person-stat-value {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  color: var(--brand);
  line-height: 1;
}

.person-stat-label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  font-weight: var(--weight-medium);
}

/* ---- Details ---- */
.person-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-10);
}

.person-detail-heading {
  font-family: var(--font-sans);
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  color: var(--text);
  margin-bottom: var(--space-5);
  letter-spacing: var(--tracking-snug);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--border);
}

.person-education-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.person-edu-item {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
}

.person-edu-year {
  display: inline-flex;
  padding: 0.15rem 0.6rem;
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--brand);
  background: var(--brand-light);
  border-radius: var(--radius-full);
  flex-shrink: 0;
  margin-top: 2px;
}

.person-edu-degree {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--text);
}

.person-edu-institution {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin-top: 2px;
}

.person-contact-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.person-contact-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.person-contact-label {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.person-contact-value {
  font-size: var(--text-sm);
  color: var(--text);
  text-decoration: none;
}

a.person-contact-value:hover {
  color: var(--brand);
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .person-hero-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .person-bio {
    max-width: none;
  }

  .person-specializations {
    justify-content: center;
  }

  .person-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .person-details-grid {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
}
`;
