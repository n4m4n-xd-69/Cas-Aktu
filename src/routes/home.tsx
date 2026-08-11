import { Link } from 'react-router';

import { Container, FadeIn } from '~/components';
import { CampusBand } from '~/components/home/CampusBand';
import { Hero } from '~/components/home/Hero';
import {
  getEquipment,
  getFaculty,
  getNotices,
  getPatents,
  getPrograms,
  getProjects,
  getPublications,
} from '~/data/loaders';
import styles from './home.module.css';

const EXPLORE = [
  {
    title: 'Academic programmes',
    detail: 'Postgraduate, doctoral and undergraduate study',
    href: '/academics',
    image: '/assets/home/student-workshop.jpeg',
    alt: 'Students working at computers during a CAS technical workshop',
  },
  {
    title: 'Research & innovation',
    detail: 'Interdisciplinary work with real-world application',
    href: '/research',
    image: '/assets/home/nano-characterization.jpg',
    alt: 'Nano-characterization equipment in a CAS laboratory',
  },
  {
    title: 'Labs & facilities',
    detail: 'Specialist infrastructure for advanced engineering',
    href: '/research/facilities',
    image: '/assets/home/robotics-laboratory.jpeg',
    alt: 'Industrial robotic arm in the CAS robotics laboratory',
  },
  {
    title: 'Campus & library',
    detail: 'Learning spaces within the AKTU campus',
    href: '/campus',
    image: '/assets/home/central-library.jpg',
    alt: 'Reading and study area inside the university library',
  },
] as const;

export function meta() {
  return [
    { title: 'Centre for Advanced Studies | AKTU Lucknow' },
    {
      name: 'description',
      content:
        'Centre for Advanced Studies is the in-campus research institute of Dr. A.P.J. Abdul Kalam Technical University, Lucknow, offering advanced programmes and interdisciplinary research facilities.',
    },
    {
      property: 'og:title',
      content: 'Centre for Advanced Studies | AKTU Lucknow',
    },
    {
      property: 'og:description',
      content:
        'Advanced education, interdisciplinary research and specialist laboratories at AKTU Lucknow.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Centre for Advanced Studies' },
  ];
}

export default function Home() {
  const programs = getPrograms();
  const faculty = getFaculty();
  const equipment = getEquipment();
  const publications = getPublications();
  const patents = getPatents();
  const projects = getProjects();
  const notices = getNotices().filter((notice) => notice.status === 'Open');

  const stats = [
    { value: programs.length, label: 'Academic programmes' },
    { value: faculty.length, label: 'Faculty members' },
    { value: equipment.length, label: 'Research facilities' },
    { value: publications.length, label: 'Publications' },
  ];

  return (
    <div className={styles.homePage} data-home-page>
      <Hero />
      <CampusBand />

      <section id="explore" className={styles.explore} aria-labelledby="explore-title">
        <Container width="wide">
          <FadeIn>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>Explore the centre</p>
                <h2 id="explore-title">Study, research and life at CAS</h2>
              </div>
              <Link to="/about" className={styles.textLink}>
                About CAS <span aria-hidden="true">→</span>
              </Link>
            </div>
          </FadeIn>

          <div className={styles.exploreGrid}>
            {EXPLORE.map((item, index) => (
              <FadeIn key={item.href} delay={index * 60}>
                <Link to={item.href} className={styles.exploreCard}>
                  <img
                    src={item.image}
                    alt={item.alt}
                    width={1600}
                    height={1200}
                    loading="lazy"
                  />
                  <span className={styles.cardScrim} aria-hidden="true" />
                  <span className={styles.cardContent}>
                    <span className={styles.cardTitle}>{item.title}</span>
                    <span className={styles.cardDetail}>{item.detail}</span>
                  </span>
                  <span className={styles.cardArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className={styles.snapshot} aria-labelledby="snapshot-title">
        <Container width="wide" className={styles.snapshotGrid}>
          <FadeIn className={styles.snapshotIntro}>
            <p className={styles.eyebrow}>Centre at a glance</p>
            <h2 id="snapshot-title">
              Advanced study, grounded in real facilities.
            </h2>
            <p>
              CAS brings academic programmes, specialist laboratories and
              applied research together within Dr. A.P.J. Abdul Kalam
              Technical University. The centre is built for work across
              disciplines—not around isolated departments.
            </p>
            <Link to="/about" className={styles.textLink}>
              Learn about the centre <span aria-hidden="true">→</span>
            </Link>
          </FadeIn>

          <FadeIn className={styles.stats} delay={80}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </FadeIn>
        </Container>
      </section>

      <section className={styles.researchFeature} aria-labelledby="research-title">
        <div className={styles.researchImage}>
          <img
            src="/assets/home/sensors-laboratory.jpg"
            alt="Sensors and instrumentation laboratory at the Centre for Advanced Studies"
            width={1600}
            height={1065}
            loading="lazy"
          />
        </div>
        <div className={styles.researchContent}>
          <FadeIn>
            <p className={styles.eyebrow}>Research at CAS</p>
            <h2 id="research-title">Ideas move from laboratory to application.</h2>
            <p>
              Researchers work across intelligent systems, robotics,
              cybersecurity, advanced manufacturing, nanomaterials and
              sustainable energy—with facilities designed for hands-on
              experimentation.
            </p>
            <div className={styles.researchLinks}>
              <Link to="/research/facilities">
                Laboratories & facilities <span aria-hidden="true">→</span>
              </Link>
              <Link to="/research/projects">
                {projects.length} research projects <span aria-hidden="true">→</span>
              </Link>
              <Link to="/research/patents">
                {patents.length} patents in the collection{' '}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className={styles.updates} aria-labelledby="updates-title">
        <Container width="wide">
          <FadeIn>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>Current information</p>
                <h2 id="updates-title">Notices and student resources</h2>
              </div>
              <Link to="/updates" className={styles.textLink}>
                View all updates <span aria-hidden="true">→</span>
              </Link>
            </div>
          </FadeIn>

          <div className={styles.updatesGrid}>
            <FadeIn className={styles.noticeColumn}>
              <div className={styles.columnLabel}>Open notices</div>
              <ul className={styles.noticeList}>
                {notices.slice(0, 4).map((notice) => (
                  <li key={notice.slug}>
                    <Link to={`/updates/notices/${notice.slug}`}>
                      <span className={styles.noticeType}>
                        {notice.notice_type}
                      </span>
                      <span className={styles.noticeTitle}>{notice.title}</span>
                      <span className={styles.noticeMeta}>
                        {notice.session ?? notice.audience}
                      </span>
                      <span className={styles.noticeArrow} aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn className={styles.quickColumn} delay={80}>
              <div className={styles.columnLabel}>Useful destinations</div>
              <nav className={styles.quickLinks} aria-label="Useful destinations">
                <Link to="/admissions">
                  <span>Admissions</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link to="/documents">
                  <span>Academic documents</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link to="/people/faculty">
                  <span>Faculty directory</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link to="/contact">
                  <span>Contact & directions</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </nav>
            </FadeIn>
          </div>
        </Container>
      </section>
    </div>
  );
}
