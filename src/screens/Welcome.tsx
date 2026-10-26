import { Link } from 'react-router-dom';
import { Photo } from '../components/Photo';
import { Screen } from '../components/Screen';
import { ACTIVITIES } from '../data/activities';

const [hero, leaves, rainy] = [ACTIVITIES[0], ACTIVITIES[1], ACTIVITIES[2]];

export function Welcome() {
  return (
    <Screen>
      <div className="eyebrow eyebrow--welcome">AUTUMN BUDDY · SEASON ’26</div>
      <h1 className="welcome__title">
        Little plans.
        <br />
        <em>Better together.</em>
      </h1>

      <div className="collage" aria-hidden="true">
        <Photo activity={leaves} className="collage__card collage__card--left" />
        <Photo activity={rainy} className="collage__card collage__card--right" />
        <div className="collage__front">
          <Photo activity={hero} className="collage__photo" caption={<span>photo: warm cup</span>} />
          <div className="collage__name">{hero.title}</div>
          <div className="collage__meta">
            {hero.minutes} MIN · {hero.where.toUpperCase()}
          </div>
        </div>
      </div>

      <p className="welcome__copy">
        Discover simple autumn activities, save what you love, and invite a friend whenever you’re ready.
      </p>

      <div className="foot foot--welcome">
        <Link to="/discover" className="btn btn--ink btn--split">
          Explore activities
          <span className="btn__arrow">→</span>
        </Link>
        <div className="hint">No pressure. Just possibilities.</div>
      </div>
    </Screen>
  );
}
