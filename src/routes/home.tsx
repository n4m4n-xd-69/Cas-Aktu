import { CampusBand, CardStrip, Hero, InfoRow, StatsBand } from '~/components/home';

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
  return (
    <div data-home-page>
      <Hero />
      <CampusBand />
      <CardStrip />
      <StatsBand />
      <InfoRow />
    </div>
  );
}
