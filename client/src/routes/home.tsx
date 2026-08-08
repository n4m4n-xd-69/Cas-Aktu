import { Link } from 'react-router';

import {
  Bento,
  Button,
  Container,
  FadeIn,
  Heading,
  Section,
  Stat,
} from '~/components';
import {
  getEquipment,
  getEvents,
  getFaculty,
  getNotices,
  getPatents,
  getPrograms,
  getProjects,
  getPublications,
} from '~/data/loaders';
import styles from './home.module.css';

export function meta() {
  return [
    { title: 'Home | Centre for Advanced Studies' },
    {
      name: 'description',
      content:
        'Centre for Advanced Studies — an in-campus research institute of Dr. A.P.J. Abdul Kalam Technical University, Lucknow. M.Tech, Ph.D. and B.Tech programmes in computing, mechatronics, nanotechnology, manufacturing and energy.',
    },
    { property: 'og:title', content: 'Home | Centre for Advanced Studies' },
    {
      property: 'og:description',
      content:
        'Centre for Advanced Studies — an in-campus research institute of Dr. A.P.J. Abdul Kalam Technical University, Lucknow.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Centre for Advanced Studies' },
  ];
}

/**
 * Home page.
 *
 * S8: the figures that were flat <Grid> cells are now a bento — the layout
 * carries the hierarchy so the copy does not have to. The dark panel is the
 * page's single contrast anchor; everything else stays on paper.
 */
export default function Home() {
  const programs = getPrograms();
  const faculty = getFaculty();
  const equipment = getEquipment();
  const publications = getPublications();
  const patents = getPatents();
  const projects = getProjects();
  const events = getEvents();
  const notices = getNotices();

  return (
    <>
      <section className={styles.hero}>
        <Container>
          <div className={styles.hero__inner}>
            <p className={styles.hero__eyebrow}>
              Dr. A.P.J. Abdul Kalam Technical University
            </p>
            <h1 className={styles.hero__title}>Centre for Advanced Studies</h1>
            <p className={styles.hero__lede}>
              An in-campus research institute in Lucknow, running M.Tech, Ph.D.
              and B.Tech programmes across computing, mechatronics,
              nanotechnology, manufacturing and energy science.
            </p>
            <div className={styles.hero__actions}>
              <Button variant="primary" href="/academics">
                View programmes
              </Button>
              <Button variant="secondary" href="/admissions">
                Admissions
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <Heading level={2} className={styles.sectionTitle}>
            The Centre at a glance
          </Heading>
          <FadeIn>
            <Bento>
              <Bento.Item span={5} tone="ink">
                <p className={styles.panelEyebrow}>Academics</p>
                <Stat
                  value={programs.length}
                  label="Academic programmes"
                  detail="M.Tech, Ph.D. and B.Tech"
                  onInk
                />
                <p className={styles.panelBody}>
                  Five specialisations, each anchored to a research group and
                  its laboratories.
                </p>
                <Link to="/academics" className={styles.panelLink}>
                  Browse programmes →
                </Link>
              </Bento.Item>

              <Bento.Item span={4}>
                <Stat
                  value={faculty.length}
                  label="Faculty members"
                  detail="Teaching and supervising"
                />
                <Link to="/people/faculty" className={styles.itemLink}>
                  Meet the faculty →
                </Link>
              </Bento.Item>

              <Bento.Item span={3}>
                <Stat value={equipment.length} label="Research facilities" />
                <Link to="/research/facilities" className={styles.itemLink}>
                  Facilities →
                </Link>
              </Bento.Item>

              <Bento.Item span={3}>
                <Stat value={publications.length} label="Publications" />
                <Link to="/research/publications" className={styles.itemLink}>
                  Read →
                </Link>
              </Bento.Item>

              <Bento.Item span={3}>
                <Stat value={patents.length} label="Patents" />
                <Link to="/research/patents" className={styles.itemLink}>
                  View →
                </Link>
              </Bento.Item>

              <Bento.Item span={3}>
                <Stat value={projects.length} label="Funded projects" />
                <Link to="/research/projects" className={styles.itemLink}>
                  View →
                </Link>
              </Bento.Item>

              <Bento.Item span={3} tone="subtle">
                <Stat value={events.length} label="Events and workshops" />
                <Link to="/updates/events" className={styles.itemLink}>
                  What&rsquo;s on →
                </Link>
              </Bento.Item>
            </Bento>
          </FadeIn>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container>
          <Heading level={2} className={styles.sectionTitle}>
            Latest notices
          </Heading>
          <FadeIn>
            <ul className={styles.notices}>
              {notices.slice(0, 5).map((notice) => (
                <li key={notice.slug} className={styles.notice}>
                  <Link
                    to={`/updates/notices/${notice.slug}`}
                    className={styles.notice__link}
                  >
                    <span className={styles.notice__title}>{notice.title}</span>
                    <span className={styles.notice__meta}>
                      {notice.session}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </FadeIn>
          <div className={styles.more}>
            <Button variant="secondary" href="/updates">
              All news and notices
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
