import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Photo } from '../components/Photo';
import { Screen } from '../components/Screen';
import { ACTIVITIES, TOTAL } from '../data/activities';
import { WEATHER } from '../data/when';
import { dateLine, pad2 } from '../lib/format';
import { useStore } from '../state/store';

const SWIPE_DISTANCE = 100;
const EXIT_MS = 260;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function Discover() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();

  const remaining = useMemo(
    () => ACTIVITIES.filter((a) => !state.saved.includes(a.id) && !state.skipped.includes(a.id)),
    [state.saved, state.skipped],
  );
  const card = remaining[0];

  const [dx, setDx] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'drag' | 'leave'>('idle');
  const origin = useRef({ x: 0, moved: false });
  const leaving = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const decide = (dir: 1 | -1) => {
    if (!card || leaving.current) return;
    leaving.current = true;
    setPhase('leave');
    setDx(dir * 480);
    const id = card.id;
    timer.current = window.setTimeout(() => {
      dispatch({ type: dir > 0 ? 'save' : 'skip', id });
      leaving.current = false;
      setPhase('idle');
      setDx(0);
    }, EXIT_MS);
  };

  // Arrow keys on desktop: right saves, left skips.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') decide(1);
      else if (e.key === 'ArrowLeft') decide(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (leaving.current) return;
    origin.current = { x: e.clientX, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
    setPhase('drag');
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== 'drag') return;
    const d = e.clientX - origin.current.x;
    if (Math.abs(d) > 6) origin.current.moved = true;
    setDx(d);
  };
  const onUp = () => {
    if (phase !== 'drag' || !card) return;
    if (Math.abs(dx) > SWIPE_DISTANCE) {
      decide(dx > 0 ? 1 : -1);
    } else {
      setPhase('idle');
      setDx(0);
      if (!origin.current.moved) navigate(`/details/${card.id}`);
    }
  };
  const onCancel = () => {
    if (phase !== 'drag') return;
    setPhase('idle');
    setDx(0);
  };

  return (
    <Screen tabs>
      <div className="dateline">
        <span>
          {dateLine()} · {WEATHER.temperature}
        </span>
        <span>SUNSET {WEATHER.sunset}</span>
      </div>
      <h1 className="title title--discover">
        Find your <em className="accent">little moment.</em>
      </h1>

      {card ? (
        <div className="deck">
          {remaining.length > 1 && <div className="deck__layer deck__layer--a" />}
          {remaining.length > 1 && <div className="deck__layer deck__layer--b" />}
          <div
            key={card.id}
            className="card"
            role="group"
            aria-label={`${card.title}. Swipe right to save, left to skip, or tap for details.`}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onCancel}
            style={{
              transform: `translateX(${dx}px) rotate(${dx / 22}deg)`,
              transition: phase === 'drag' ? 'none' : `transform ${EXIT_MS}ms cubic-bezier(.2,.7,.3,1)`,
            }}
          >
            <Photo activity={card} className="card__photo">
              <div className="card__no">
                No. {pad2(card.no)} / {pad2(TOTAL)}
              </div>
              <div className="stamp stamp--save" style={{ opacity: clamp01((dx - 30) / 70) }}>
                SAVE
              </div>
              <div className="stamp stamp--skip" style={{ opacity: clamp01((-dx - 30) / 70) }}>
                SKIP
              </div>
            </Photo>
            <div className="card__meta">
              <span>{card.minutes} MIN</span>
              <span>·</span>
              <span>{card.where.toUpperCase()}</span>
            </div>
            <div className="card__title">{card.title}</div>
            <div className="card__desc">{card.blurb}</div>
          </div>
        </div>
      ) : (
        <div className="deck">
          <div className="deck__end">
            <div className="deck__end-title">
              That’s every idea <em>for now.</em>
            </div>
            <p className="deck__end-copy">
              {state.skipped.length > 0
                ? 'Skipped a few? They can come back whenever you like.'
                : 'You saved all of them. Time to send a friendly invite.'}
            </p>
            {state.skipped.length > 0 && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => dispatch({ type: 'resetSkipped' })}>
                Bring back skipped ({state.skipped.length})
              </button>
            )}
            {state.saved.length > 0 && (
              <Link to="/saved" className="textbtn textbtn--accent">
                See saved →
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="actions">
        <button type="button" className="round" aria-label="Skip" disabled={!card} onClick={() => decide(-1)}>
          ×
        </button>
        <button type="button" className="pillbtn" aria-label="Save" disabled={!card} onClick={() => decide(1)}>
          Save
          <span className="mono-count">{state.saved.length}</span>
        </button>
        {card ? (
          <Link to={`/invite/${card.id}`} className="cta">
            Invite a friend →
          </Link>
        ) : (
          <Link to="/saved" className="cta">
            Open saved →
          </Link>
        )}
      </div>
    </Screen>
  );
}
