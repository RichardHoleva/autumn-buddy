import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Photo } from '../components/Photo';
import { Screen } from '../components/Screen';
import { getActivity } from '../data/activities';
import { FRIENDS, getFriend } from '../data/people';
import { WHEN, WHEN_KEYS, type WhenKey } from '../data/when';
import { newId } from '../lib/format';
import { useStore } from '../state/store';

export function Invite() {
  const { id } = useParams();
  const a = getActivity(id);
  const { dispatch } = useStore();
  const navigate = useNavigate();

  const [friendId, setFriendId] = useState(FRIENDS[0].id);
  const [when, setWhen] = useState<WhenKey>('after-class');
  // Until the sender edits the message, it follows the friend / time they pick.
  const [custom, setCustom] = useState<string | null>(null);

  if (!a) return <Navigate to="/discover" replace />;
  const friend = getFriend(friendId) ?? FRIENDS[0];

  const message = custom ?? `Hey ${friend.first}! Fancy ${a.invitePhrase} ${WHEN[when].phrase}? No pressure at all.`;

  const send = () => {
    const text = message.trim();
    if (!text) return;
    const invite = { id: newId(), activityId: a.id, friendId: friend.id, when, message: text, status: 'pending' as const, sentAt: Date.now() };
    dispatch({ type: 'send', invite });
    navigate('/invites', { replace: true, state: { notice: `Invite sent to ${friend.first}. No rush on their end.` } });
  };

  return (
    <Screen back>
      <div className="eyebrow">A LITTLE INVITATION</div>
      <h1 className="title">
        Better with <em>a buddy.</em>
      </h1>
      <p className="sub">Keep it casual, just like the activity.</p>

      <div className="invcard">
        <div className="invcard__act">
          <Photo activity={a} stripe={5} className="invcard__thumb" caption={null} />
          <div>
            <div className="invcard__title">{a.title}</div>
            <div className="invcard__meta">
              {a.minutes} MIN · {a.near} · FLEXIBLE
            </div>
          </div>
        </div>

        <div className="invcard__sec">
          <div className="label">TO</div>
          <div className="people" role="radiogroup" aria-label="Send to">
            {FRIENDS.map((f) => {
              const on = f.id === friendId;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  className={on ? 'person person--on' : 'person'}
                  onClick={() => setFriendId(f.id)}
                >
                  <span className="avatar" style={on ? undefined : { background: f.tint }}>
                    {f.initials}
                  </span>
                  {on ? `${f.name} ✓` : f.first}
                </button>
              );
            })}
          </div>
        </div>

        <div className="invcard__msg">
          <label className="label" htmlFor="invite-message">
            MESSAGE
          </label>
          <textarea
            id="invite-message"
            className="msg"
            rows={3}
            value={message}
            onChange={(e) => setCustom(e.target.value)}
          />
        </div>
      </div>

      <div className="label label--pad">WHEN</div>
      <div className="chips chips--when" role="radiogroup" aria-label="When">
        {WHEN_KEYS.map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={k === when}
            className={k === when ? 'chip chip--on' : 'chip'}
            onClick={() => setWhen(k)}
          >
            {WHEN[k].label}
          </button>
        ))}
      </div>

      <div className="foot">
        <div className="hint">They can say yes, no, or suggest another time.</div>
        <button type="button" className="btn btn--accent" onClick={send} disabled={!message.trim()}>
          Send friendly invite →
        </button>
      </div>
    </Screen>
  );
}
