import { Link, Navigate, useParams } from 'react-router-dom';
import { BackButton, Screen } from '../components/Screen';
import { Photo } from '../components/Photo';
import { getActivity, TOTAL } from '../data/activities';
import { pad2 } from '../lib/format';

export function Details() {
  const { id } = useParams();
  const a = getActivity(id);
  if (!a) return <Navigate to="/discover" replace />;

  return (
    <Screen bleed>
      <Photo activity={a} className="hero" caption={<span className="hero__cap">photo: {a.detailPhoto}</span>}>
        <div className="hero__bar">
          <BackButton className="roundlight" />
          <div className="counter">
            {pad2(a.no)} / {pad2(TOTAL)}
          </div>
        </div>
      </Photo>

      <div className="sheet">
        <h1 className="sheet__title">{a.title}</h1>
        <p className="sheet__tagline">{a.tagline}</p>

        <dl className="facts">
          <div className="fact">
            <dt>TIME</dt>
            <dd>{a.minutes} min</dd>
          </div>
          <div className="fact">
            <dt>WHERE</dt>
            <dd>{a.where}</dd>
          </div>
          <div className="fact">
            <dt>WHO</dt>
            <dd>{a.who}</dd>
          </div>
        </dl>

        <ol className="steps">
          {a.steps.map((s, i) => (
            <li key={s} className="step">
              <span className="step__n">{i + 1}</span>
              <span className="step__t">{s}</span>
            </li>
          ))}
        </ol>

        <div className="sheet__foot">
          {a.rainyAlt && (
            <Link to={`/rainy/${a.id}`} className="swapnote">
              <span>Rainy outside? There’s a cozy swap.</span>
              <strong>See it →</strong>
            </Link>
          )}
          <Link to={`/invite/${a.id}`} className="btn btn--accent">
            Invite a friend →
          </Link>
        </div>
      </div>
    </Screen>
  );
}
