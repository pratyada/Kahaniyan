// Series shelf — horizontal row of stacked series cards.

import { useNavigate } from 'react-router-dom';
import ShelfSection from './ShelfSection.jsx';
import ShelfRow from './ShelfRow.jsx';
import SeriesCard from '../cards/SeriesCard.jsx';
import { SERIES } from '../../data/series.js';

export default function SeriesShelf() {
  const navigate = useNavigate();

  if (SERIES.length === 0) return null;

  return (
    <ShelfSection title="📺 Series" subtitle="Multi-episode stories — same characters, new adventures">
      <ShelfRow>
        {SERIES.map((s) => (
          <SeriesCard key={s.id} series={s} onClick={() => navigate(`/series/${s.id}`)} />
        ))}
      </ShelfRow>
    </ShelfSection>
  );
}
