import { Link } from 'react-router';

import { getNotices } from '~/data/loaders';
import { useAdmissionsSeason } from '~/lib/admissions';
import styles from './AdmissionsRail.module.css';

/**
 * Admission notices, shown only during the July–September intake.
 *
 * Two independent gates. The season gate is client-only because the site is
 * prerendered (see useAdmissionsSeason). The data gate means an open window
 * with no live notices renders nothing at all rather than an empty shell —
 * we never invent admission content.
 */
export function AdmissionsRail() {
  const inSeason = useAdmissionsSeason();
  const notices = getNotices().filter(
    (notice) => notice.notice_type === 'Admission' && notice.status === 'Open',
  );

  if (!inSeason || notices.length === 0) return null;

  return (
    <aside className={styles.rail} aria-labelledby="admissions-title">
      <p className={styles.eyebrow}>Admissions open</p>
      <h3 id="admissions-title" className={styles.title}>
        Applying to CAS
      </h3>

      <ul className={styles.list}>
        {notices.map((notice) => (
          <li key={notice.slug}>
            <Link to={`/updates/notices/${notice.slug}`}>
              <span className={styles.noticeTitle}>{notice.title}</span>
              <span className={styles.noticeMeta}>
                {notice.session ? `Session ${notice.session}` : notice.audience}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link to="/admissions" className={styles.all}>
        All admission information <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
