import { Link } from 'react-router';

import { Container } from '~/components';
import { getEvents, getNotices } from '~/data/loaders';
import styles from './InfoRow.module.css';

const QUICK_LINKS = [
  { to: '/admissions', label: 'Admissions' },
  { to: '/campus', label: 'Campus' },
  { to: '/documents', label: 'Forms & Downloads' },
  { to: '/people/faculty', label: 'Faculty Directory' },
  { to: '/contact', label: 'Contact Directory' },
];

export function InfoRow() {
  const notices = getNotices().filter((notice) => notice.status === 'Open');

  /*
   * There is no separate news collection — notices are the centre's only
   * announcement stream. Slicing the same array into both the "Latest News"
   * and "Notices" columns rendered the same three items twice, side by side.
   * Splitting on notice_type instead keeps the two columns disjoint by
   * construction and reads correctly in both directions: admission calls are
   * the news, and the academic/registration circulars are the notices.
   */
  const news = notices.filter((notice) => notice.notice_type === 'Admission');
  const circulars = notices.filter(
    (notice) => notice.notice_type !== 'Admission',
  );

  /*
   * Every event in the archive is Completed or Postponed — there is not a
   * single forthcoming one — so a column headed "Upcoming Events" would be
   * false regardless of how it is filtered. Same rule the admissions rail
   * follows: never present content the data does not support. The heading
   * states what these actually are, and matches the stats band's own
   * "Events & Workshops" label.
   */
  const events = getEvents().slice(0, 3);

  return (
    <section className={styles.row} aria-label="News, events and notices">
      <Container width="wide" className={styles.grid}>
        <div className={styles.col}>
          <h2 className={styles.heading}>About CAS</h2>
          <p className={styles.text}>
            The Centre for Advanced Studies at AKTU fosters cutting-edge
            research, interdisciplinary collaboration and innovation for
            societal impact.
          </p>
          <Link to="/about" className={styles.more}>
            Know more <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.col}>
          <h2 className={styles.heading}>Latest News</h2>
          <ul className={styles.list}>
            {news.slice(0, 3).map((notice) => (
              <li key={notice.slug}>
                <Link to={`/updates/notices/${notice.slug}`}>{notice.title}</Link>
              </li>
            ))}
          </ul>
          <Link to="/updates" className={styles.more}>
            View all <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.col}>
          <h2 className={styles.heading}>Events &amp; Workshops</h2>
          <ul className={styles.list}>
            {events.map((event) => (
              <li key={event.id}>
                <Link to={`/updates/events/${event.id}`}>{event.title}</Link>
              </li>
            ))}
          </ul>
          <Link to="/updates/events" className={styles.more}>
            View all <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.col}>
          <h2 className={styles.heading}>Notices</h2>
          <ul className={styles.list}>
            {circulars.slice(0, 4).map((notice) => (
              <li key={notice.slug}>
                <Link to={`/updates/notices/${notice.slug}`}>{notice.title}</Link>
              </li>
            ))}
          </ul>
          <Link to="/updates/notices" className={styles.more}>
            View all <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.col}>
          <h2 className={styles.heading}>Quick Links</h2>
          <ul className={styles.list}>
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
