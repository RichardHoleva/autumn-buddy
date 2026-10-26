import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Photo } from '../components/Photo';
import { Screen } from '../components/Screen';
import { getActivity } from '../data/activities';
import { getFriend } from '../data/people';
import { WHEN } from '../data/when';
import { pad2, timeAgo } from '../lib/format';
import { useStore, type Invite } from '../state/store';

function Status({ invite }: { invite: Invite }) {
  switch (invite.status) {
    case 'pending':
      return <span className="pill pill--wait">Waiting</span>;
    case 'confirmed':
      return <span className="pill pill--yes">Confirmed ✓</span>;
    case 'suggested':
      return <span className="pill pill--new">New time</span>;
    case 'declined':
      return <span className="pill pill--no">Not this time</span>;
  }
}

function Row({ invite }: { invite: Invite }) {
  const { dispatch } = useStore();
  const navigate = useNavigate();
  const a = getActivity(invite.activityId);
  const f = getFriend(invite.friendId);
  if (!a || !f) return null;

  const main = invite.status === 'confirmed' ? `/confirmed/${invite.id}` : `/details/${a.id}`;

  return (
    <li className="row row--invite">
      <Link to={main} className="row__main">
        <Photo activity={a} stripe={6} className="thumb" caption={pad2(a.no)} />
        <div>
          <div className="row__title">{a.title}</div>
          <div className="row__meta">
            TO {f.first.toUpperCase()} · {WHEN[invite.when].label.toUpperCase()}
          </div>
          <div className="row__meta">SENT {timeAgo(invite.sentAt).toUpperCase()}</div>
        </div>
      </Link>
      <Status invite={invite} />

      {invite.status === 'pending' && (
        <Link to={`/respond/${invite.id}`} className="row__demo">
          DEMO · SEE {f.first.toUpperCase()}’S VIEW →
        </Link>
      )}

      {invite.status === 'suggested' && invite.suggestedWhen && (
        <div className="row__extra">
          <p className="row__note">
            {f.first} suggested <strong>{WHEN[invite.suggestedWhen].label.toLowerCase()}</strong> instead.
          </p>
          <div className="row__buttons">
            <button
              type="button"
              className="btn btn--ink btn--xs"
              onClick={() => {
                dispatch({ type: 'accept', id: invite.id });
                navigate(`/confirmed/${invite.id}`);
              }}
            >
              Sounds good ✓
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--xs"
              onClick={() => dispatch({ type: 'reply', id: invite.id, status: 'declined' })}
            >
              Not this time
            </button>
          </div>
        </div>
      )}

      {invite.status === 'declined' && (
        <div className="row__extra">
          <p className="row__note">That’s okay. Any answer is fine.</p>
          <Link to={`/invite/${a.id}`} className="row__act">
            Invite someone else →
          </Link>
        </div>
      )}
    </li>
  );
}

export function Invites() {
  const { state } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<string | null>(
    (location.state as { notice?: string } | null)?.notice ?? null,
  );

  // Show a one-off notice (e.g. "Invite sent"), then clear it from history so a reload doesn't repeat it.
  useEffect(() => {
    if (!notice) return;
    navigate(location.pathname, { replace: true, state: null });
    const t = window.setTimeout(() => setNotice(null), 3800);
    return () => window.clearTimeout(t);
  }, [notice]);

  const open = state.invites.filter((i) => i.status === 'pending' || i.status === 'suggested').length;

  return (
    <Screen tabs>
      <div className="eyebrow">YOUR INVITES</div>
      <div className="titlebar">
        <h1 className="title title--bare">
          Little plans, <em>sent.</em>
        </h1>
        <div className="titlebar__count" aria-label={`${state.invites.length} invites`}>
          {state.invites.length}
        </div>
      </div>
      <p className="sub">
        {open > 0 ? `${open} waiting on a reply. No rush.` : 'Friendly, flexible, no pressure.'}
      </p>

      {notice && (
        <div className="notice" role="status">
          {notice}
        </div>
      )}

      {state.invites.length === 0 ? (
        <div className="empty">
          <div className="empty__title">
            Nothing sent <em>yet.</em>
          </div>
          <p className="empty__copy">Pick an activity you like and invite a friend. They can say yes, no, or suggest another time.</p>
          <Link to="/discover" className="btn btn--ink btn--sm btn--auto">
            Find something to do →
          </Link>
        </div>
      ) : (
        <ul className="list">
          {state.invites.map((i) => (
            <Row key={i.id} invite={i} />
          ))}
        </ul>
      )}
    </Screen>
  );
}
