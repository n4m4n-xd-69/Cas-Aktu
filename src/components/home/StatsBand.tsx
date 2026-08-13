import { Container } from '~/components';
import {
  getEquipment,
  getEvents,
  getFaculty,
  getProjects,
  getPrograms,
  getPublications,
} from '~/data/loaders';
import styles from './StatsBand.module.css';

export function StatsBand() {
  const stats = [
    { value: getPrograms().length, label: 'Academic Programmes' },
    { value: getFaculty().length, label: 'Faculty Members' },
    { value: getEquipment().length, label: 'Research Facilities' },
    { value: getPublications().length, label: 'Publications' },
    { value: getProjects().length, label: 'Funded Projects' },
    { value: getEvents().length, label: 'Events & Workshops' },
  ];

  return (
    <section className={styles.band} aria-label="The centre in numbers">
      <Container width="wide" className={styles.row}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </Container>
    </section>
  );
}
