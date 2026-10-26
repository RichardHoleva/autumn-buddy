import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Photo } from '../components/Photo';
import { Screen } from '../components/Screen';
import { getActivity } from '../data/activities';
import { WEATHER } from '../data/when';
import { useStore } from '../state/store';

export function Rainy() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { state, dispatch } = useStore();
  const navigate = useNavigate();

  const planA = getActivity(id);
  const planB = getActivity(planA?.rainyAlt);
  if (!planA || !planB) return <Navigate to="/discover" replace />;

  // With an invite attached, swap the plan on it; otherwise start a fresh invite for the indoor idea.
  const inviteId = params.get('invite');
  const invite = inviteId ? state.invites.find((i) => i.id === inviteId) : undefined;

  const useIndoor = () => {
    if (invite) {
      dispatch({ type: 'swap', id: invite.id, activityId: planB.id });
      navigate(`/confirmed/${invite.id}`, { replace: true });
    } else {
      navigate(`/invite/${planB.id}`, { replace: true });
    }
  };

  return (
    <Screen back>
      <div className="eyebrow eyebrow--olive">WEATHER-PROOF BACKUP · RAIN FROM {WEATHER.rainFrom}</div>
      <h1 className="title">
        Rain? Plan B <em>is cozy.</em>
      </h1>
      <p className="sub">Keep the plan, skip the cold.</p>

      <div className="plana">
        <span className="plana__tag">PLAN A</span>
        <span className="plana__title">{planA.title}</span>
      </div>
      <div className="arrow" aria-hidden="true">
        ↓
      </div>

      <div className="planb">
        <Photo
          activity={planB}
          className="planb__photo"
          stripe={8}
          caption={<span>photo: {planB.detailPhoto}</span>}
        />
        <div className="planb__head">
          <span className="planb__title">{planB.title}</span>
          <span className="planb__tag">PLAN B</span>
        </div>
        <div className="planb__meta">
          {planB.minutes} MIN · {planB.where.toUpperCase()}
        </div>
        <div className="planb__desc">{planB.blurb}</div>
      </div>
      <p className="note note--pad">Same friend. Same easy feeling. New place.</p>

      <div className="foot foot--tight foot--gap6">
        <button type="button" className="btn btn--ink" onClick={useIndoor}>
          Use indoor plan →
        </button>
        <button type="button" className="textbtn textbtn--accent" onClick={() => navigate(-1)}>
          Keep original plan
        </button>
      </div>
    </Screen>
  );
}
