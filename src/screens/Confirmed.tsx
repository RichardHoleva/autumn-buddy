import { Link, Navigate, useParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { getActivity } from '../data/activities';
import { getFriend, ME } from '../data/people';
import { WHEN } from '../data/when';
import { pad2 } from '../lib/format';
import { useStore } from '../state/store';

export function Confirmed() {
  const { id } = useParams();
  const { state } = useStore();
  const invite = state.invites.find((i) => i.id === id);
  const a = getActivity(invite?.activityId);
  const f = getFriend(invite?.friendId);
  if (!invite || !a || !f || invite.status !== 'confirmed') return <Navigate to="/invites" replace />;

  return (
    <Screen back>
      <div className="eyebrow eyebrow--olive">✓ PLAN CONFIRMED</div>
      <h1 className="title">
        Something to look <em>forward to.</em>
      </h1>
      <p className="sub">{f.first} is in for a tiny autumn adventure.</p>

      <div className="ticket">
        <div className="ticket__top">
          <div className="ticket__kicker">ADMIT TWO · NO. {pad2(a.no)}</div>
          <div className="ticket__title">{a.title}</div>
          <div className="ticket__who">
            <div className="ticket__avatars">
              <span className="avatar avatar--ticket" style={{ background: '#F6F2EA' }}>
                {ME.initials}
              </span>
              <span className="avatar avatar--ticket avatar--overlap" style={{ background: f.tint }}>
                {f.initials}
              </span>
            </div>
            You &amp; {f.first}
          </div>
        </div>
        <div className="ticket__tear">
          <i className="ticket__notch ticket__notch--l" />
          <i className="ticket__notch ticket__notch--r" />
        </div>
        <dl className="ticket__rows">
          <div>
            <dt>When</dt>
            <dd>{WHEN[invite.when].plan}</dd>
          </div>
          <div>
            <dt>Meet</dt>
            <dd>{a.meet}</dd>
          </div>
          <div>
            <dt>Length</dt>
            <dd>{a.minutes} minutes</dd>
          </div>
        </dl>
      </div>
      <p className="note">No rush. You can change this plan.</p>

      <div className="foot foot--tight">
        {a.rainyAlt && (
          <Link to={`/rainy/${a.id}?invite=${invite.id}`} className="btn btn--ghost btn--sm">
            Weather changed? Swap plan
          </Link>
        )}
        <Link to="/discover" className="btn btn--ink">
          Back to activities
        </Link>
      </div>
    </Screen>
  );
}
