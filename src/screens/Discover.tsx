import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Photo } from '../components/Photo';
import { Screen } from '../components/Screen';
import { ACTIVITIES } from '../data/activities';
import { WEATHER } from '../data/when';
import { dateLine } from '../lib/format';
import { useStore } from '../state/store';

const SWIPE_DISTANCE = 100;
const EXIT_MS = 260;
/** How long the "Saved" confirmation stays up. Keep in sync with the `note` animation in styles.css. */
const SAVED_NOTE_MS = 2200;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function IconSkip() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function IconSave() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20.2C7 16.7 3.5 13.5 3.5 9.6 3.5 7.2 5.3 5.5 7.6 5.5c1.7 0 3.4.9 4.4 2.5 1-1.6 2.7-2.5 4.4-2.5 2.3 0 4.1 1.7 4.1 4.1 0 3.9-3.5 7.1-8.5 10.6z" />
    </svg>
  );
}

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
  // `n` makes back-to-back saves restart the confirmation instead of reusing the old element.
  const [savedNote, setSavedNote] = useState<{ title: string; n: number } | null>(null);
  const origin = useRef({ x: 0, moved: false });
  const leaving = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const noteTimer = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      window.clearTimeout(noteTimer.current);
    },
    [],
  );

  const decide = (dir: 1 | -1) => {
    if (!card || leaving.current) return;
    leaving.current = true;
    setPhase('leave');
    setDx(dir * 480);
    const id = card.id;
    if (dir > 0) {
      setSavedNote({ title: card.title, n: Date.now() });
      window.clearTimeout(noteTimer.current);
      noteTimer.current = window.setTimeout(() => setSavedNote(null), SAVED_NOTE_MS);
    }
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
        {remaining.length > 0 && (
          <span>
            {remaining.length} {remaining.length === 1 ? 'IDEA' : 'IDEAS'} LEFT
          </span>
        )}
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
              <div className="stamp stamp--save" style={{ opacity: clamp01((dx - 30) / 70) }}>
                SAVE
              </div>
              <div className="stamp stamp--skip" style={{ opacity: clamp01((-dx - 30) / 70) }}>
                SKIP
              </div>
            </Photo>
            <div className="card__body">
              <div className="card__title">{card.title}</div>
              <div className="card__meta">
                {card.minutes} min · {card.where}
              </div>
              <div className="card__desc">{card.blurb}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="deck deck--end">
          <div className="deck__end">
            <div className="deck__end-title">
              That’s every idea <em>for now.</em>
            </div>
            <p className="deck__end-copy">
              {state.skipped.length > 0
                ? 'Skipped a few? They can come back whenever you like.'
                : 'You saved every idea. Open one to plan it with a friend.'}
            </p>
            {state.saved.length > 0 && (
              <Link to="/saved" className="btn btn--accent btn--sm btn--auto">
                See saved →
              </Link>
            )}
            {state.skipped.length > 0 && (
              <button
                type="button"
                className={state.saved.length > 0 ? 'btn btn--ghost btn--sm btn--auto' : 'btn btn--accent btn--sm btn--auto'}
                onClick={() => dispatch({ type: 'resetSkipped' })}
              >
                Bring back skipped ({state.skipped.length})
              </button>
            )}
          </div>
        </div>
      )}

      {/* One quiet line under the card: the gesture hint, swapped for a confirmation when something is saved. */}
      <div className="feedback">
        {card && (
          <p className={savedNote ? 'feedback__hint feedback__hint--off' : 'feedback__hint'}>
            Swipe left to skip, right to save, tap to open.
          </p>
        )}
        <div className="feedback__live" aria-live="polite">
          {savedNote && (
            <p key={savedNote.n} className="feedback__saved">
              <span aria-hidden="true">✓</span> Saved · {savedNote.title}
            </p>
          )}
        </div>
      </div>

      {card && (
        <div className="actions">
          <button type="button" className="swipebtn swipebtn--skip" onClick={() => decide(-1)}>
            <IconSkip />
            Skip
          </button>
          <Link to={`/details/${card.id}`} className="cta" aria-label={`View activity: ${card.title}`}>
            View activity <span className="cta__arrow">→</span>
          </Link>
          <button type="button" className="swipebtn swipebtn--save" onClick={() => decide(1)}>
            <IconSave />
            Save
          </button>
        </div>
      )}
    </Screen>
  );
}
