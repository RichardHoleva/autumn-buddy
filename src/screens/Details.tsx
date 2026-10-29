import { Link, Navigate, useParams } from 'react-router-dom';
import { BackButton, Screen } from '../components/Screen';
import { Photo } from '../components/Photo';
import { getActivity } from '../data/activities';
import { useStore } from '../state/store';

export function Details() {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const a = getActivity(id);
  if (!a) return <Navigate to="/discover" replace />;

  const rainy = getActivity(a.rainyAlt);
  const saved = state.saved.includes(a.id);
  // The store ignores a repeat save too; this just keeps the saved button inert.
  const save = () => {
    if (!saved) dispatch({ type: 'save', id: a.id });
  };

  return (
    <Screen bleed>
      {/* Zero-height sticky bar: keeps Back on screen while the page scrolls on short phones. */}
      <div className="topbar">
        <BackButton className="roundlight" />
      </div>
      <Photo activity={a} className="hero" caption={<span className="hero__cap">photo: {a.detailPhoto}</span>} />

      <div className="sheet">
        <h1 className="sheet__title">{a.title}</h1>
        <p className="sheet__tagline">{a.tagline}</p>

        <ul className="tags" aria-label="Quick info">
          <li className="tag">{a.minutes} min</li>
          <li className="tag">{a.where}</li>
          {a.group && <li className="tag">{a.group}</li>}
        </ul>

        <section className="section" aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="label section__label">
            HOW IT WORKS
          </h2>
          <ol className="steps">
            {a.steps.slice(0, 3).map((s, i) => (
              <li key={s} className="step">
                <span className="step__n">{i + 1}</span>
                <span className="step__t">{s}</span>
              </li>
            ))}
          </ol>
        </section>

        {rainy && (
          <Link to={`/rainy/${a.id}`} className="rainnote">
            <span>
              If it rains: <strong>{rainy.title}</strong>
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        )}

        <div className="sheet__foot">
          <Link to={`/invite/${a.id}`} className="btn btn--accent">
            Invite friends →
          </Link>
          <button
            type="button"
            className={saved ? 'btn btn--ghost btn--sm btn--saved' : 'btn btn--ghost btn--sm'}
            aria-disabled={saved}
            onClick={save}
          >
            {saved ? '✓ Saved' : 'Save for later'}
          </button>
        </div>
      </div>
    </Screen>
  );
}
