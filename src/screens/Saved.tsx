import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Photo } from '../components/Photo';
import { Screen } from '../components/Screen';
import { getActivity, type Activity, type Where } from '../data/activities';
import { useStore } from '../state/store';

type Filter = 'All' | Where;
const FILTERS: Filter[] = ['All', 'Outdoors', 'Indoors'];
const UNDO_MS = 5000;

export function Saved() {
  const { state, dispatch } = useStore();
  const [filter, setFilter] = useState<Filter>('All');
  // The last thing removed, so a slip of the thumb can be undone for a few seconds.
  const [removed, setRemoved] = useState<{ id: string; title: string } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Newest first.
  const saved = [...state.saved]
    .reverse()
    .map(getActivity)
    .filter((a): a is Activity => !!a);
  const shown = saved.filter((a) => filter === 'All' || a.where === filter);

  const remove = (a: Activity) => {
    dispatch({ type: 'unsave', id: a.id });
    setRemoved({ id: a.id, title: a.title });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setRemoved(null), UNDO_MS);
  };
  const undo = () => {
    if (!removed) return;
    dispatch({ type: 'save', id: removed.id });
    window.clearTimeout(timer.current);
    setRemoved(null);
  };

  return (
    <Screen tabs>
      <div className="eyebrow">YOUR COLLECTION</div>
      <div className="titlebar">
        <h1 className="title title--bare">
          Saved for <em>later.</em>
        </h1>
        <div className="titlebar__count" aria-label={`${saved.length} saved`}>
          {saved.length}
        </div>
      </div>
      <p className="sub">Good ideas, ready whenever you are.</p>

      {saved.length > 0 && (
        <div className="chips chips--pad" role="group" aria-label="Filter">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={f === filter ? 'chip chip--on' : 'chip'}
              aria-pressed={f === filter}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {saved.length === 0 ? (
        <div className="empty">
          <div className="empty__title">
            Nothing saved <em>yet.</em>
          </div>
          <p className="empty__copy">Swipe right on an idea you like, or tap Save, and it will wait for you here.</p>
          <Link to="/discover" className="btn btn--ink btn--sm btn--auto">
            Explore activities →
          </Link>
        </div>
      ) : shown.length === 0 ? (
        <div className="empty">
          <p className="empty__copy">Nothing saved in {filter.toLowerCase()} yet.</p>
        </div>
      ) : (
        <ul className="scards">
          {shown.map((a) => (
            <li key={a.id} className="scard">
              <Link to={`/details/${a.id}`} className="scard__main">
                <Photo activity={a} stripe={6} className="scard__thumb" caption={null} />
                <div>
                  <div className="scard__title">{a.title}</div>
                  <div className="scard__meta">
                    {a.minutes} MIN · {a.where.toUpperCase()}
                  </div>
                </div>
              </Link>
              <div className="scard__actions">
                <Link to={`/invite/${a.id}`} className="scard__act scard__act--invite">
                  Invite friends →
                </Link>
                <button
                  type="button"
                  className="scard__act scard__act--remove"
                  aria-label={`Remove ${a.title} from Saved`}
                  onClick={() => remove(a)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Always present so screen readers hear the message; it floats above the tab bar while the list scrolls. */}
      <div className="toast" aria-live="polite">
        {removed && (
          <div key={removed.id} className="toast__msg">
            <span>Removed {removed.title}</span>
            <button type="button" className="toast__undo" onClick={undo}>
              Undo
            </button>
          </div>
        )}
      </div>
    </Screen>
  );
}
