import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Photo } from '../components/Photo';
import { Screen } from '../components/Screen';
import { getActivity, type Activity, type Where } from '../data/activities';
import { pad2 } from '../lib/format';
import { useStore } from '../state/store';

type Filter = 'All' | Where;
const FILTERS: Filter[] = ['All', 'Outdoors', 'Indoors'];

export function Saved() {
  const { state } = useStore();
  const [filter, setFilter] = useState<Filter>('All');

  // Newest first.
  const saved = [...state.saved]
    .reverse()
    .map(getActivity)
    .filter((a): a is Activity => !!a);
  const shown = saved.filter((a) => filter === 'All' || a.where === filter);

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
            Find something to do →
          </Link>
        </div>
      ) : shown.length === 0 ? (
        <div className="empty">
          <p className="empty__copy">Nothing saved in {filter.toLowerCase()} yet.</p>
        </div>
      ) : (
        <ul className="list">
          {shown.map((a) => (
            <li key={a.id} className="row">
              <Link to={`/details/${a.id}`} className="row__main">
                <Photo activity={a} stripe={6} className="thumb" caption={pad2(a.no)} />
                <div>
                  <div className="row__title">{a.title}</div>
                  <div className="row__meta">
                    {a.minutes} MIN · {a.where.toUpperCase()}
                  </div>
                </div>
              </Link>
              <Link to={`/invite/${a.id}`} className="row__act">
                Invite →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Screen>
  );
}
