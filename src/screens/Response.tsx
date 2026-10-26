import { useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Photo } from '../components/Photo';
import { Screen } from '../components/Screen';
import { getActivity } from '../data/activities';
import { getFriend, ME } from '../data/people';
import { WHEN, WHEN_KEYS, type WhenKey } from '../data/when';
import { timeAgo } from '../lib/format';
import { useStore } from '../state/store';

/** The friend's side of an invite. Without a backend this is a preview, so the reply updates this device only. */
export function Response() {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [picking, setPicking] = useState(false);
  const [pick, setPick] = useState<WhenKey | null>(null);
  const answered = useRef(false);

  const invite = state.invites.find((i) => i.id === id);
  const a = getActivity(invite?.activityId);
  const f = getFriend(invite?.friendId);
  if (!invite || !a || !f) return <Navigate to="/invites" replace />;
  if (invite.status !== 'pending' && !answered.current) return <Navigate to="/invites" replace />;

  const yes = () => {
    answered.current = true;
    dispatch({ type: 'reply', id: invite.id, status: 'confirmed' });
    navigate(`/confirmed/${invite.id}`, { replace: true });
  };
  const no = () => {
    answered.current = true;
    dispatch({ type: 'reply', id: invite.id, status: 'declined' });
    navigate('/invites', { replace: true, state: { notice: `${f.first} said not today. That’s okay.` } });
  };
  const suggest = () => {
    if (!pick) return;
    answered.current = true;
    dispatch({ type: 'suggest', id: invite.id, when: pick });
    navigate('/invites', {
      replace: true,
      state: { notice: `${f.first} suggested ${WHEN[pick].label.toLowerCase()} instead.` },
    });
  };

  return (
    <Screen back>
      <div className="eyebrow">{f.first.toUpperCase()}’S VIEW · NEW INVITE</div>
      <h1 className="title">
        A little plan <em>for you.</em>
      </h1>

      <div className="ticket-card">
        <Photo activity={a} className="ticket-card__photo" caption={<span>photo: {a.title.toLowerCase()}</span>}>
          <span>
            {a.minutes} MIN · {a.where.toUpperCase()}
          </span>
        </Photo>
        <blockquote className="ticket-card__quote">“{invite.message}”</blockquote>
        <div className="ticket-card__from">
          <span className="avatar avatar--sm" style={{ background: '#DDE3CC' }}>
            {ME.initials}
          </span>
          From {ME.first} · sent {timeAgo(invite.sentAt)}
        </div>
      </div>

      {picking ? (
        <div className="foot">
          <div className="label">PICK A TIME THAT WORKS</div>
          <div className="chips chips--center" role="radiogroup" aria-label="Another time">
            {WHEN_KEYS.filter((k) => k !== invite.when).map((k) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={k === pick}
                className={k === pick ? 'chip chip--on' : 'chip'}
                onClick={() => setPick(k)}
              >
                {WHEN[k].label}
              </button>
            ))}
          </div>
          <button type="button" className="btn btn--ink" onClick={suggest} disabled={!pick}>
            Send suggestion
          </button>
          <button type="button" className="textbtn" onClick={() => setPicking(false)}>
            Back
          </button>
        </div>
      ) : (
        <div className="foot foot--tight">
          <button type="button" className="btn btn--ink" onClick={yes}>
            Sounds good ✓
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => setPicking(true)}>
            Suggest another time
          </button>
          <button type="button" className="textbtn" onClick={no}>
            Not today, thanks
          </button>
          <div className="hint hint--faint">Any answer is okay. No explanation needed.</div>
        </div>
      )}
    </Screen>
  );
}
