import { Link, Navigate, useParams } from 'react-router-dom';
import { Photo } from '../components/Photo';
import { Screen, useGoBack } from '../components/Screen';
import { getActivity } from '../data/activities';

export function Rainy() {
  const { id } = useParams();
  const keepOriginal = useGoBack(`/details/${id}`);

  const planA = getActivity(id);
  const planB = getActivity(planA?.rainyAlt);
  if (!planA || !planB) return <Navigate to="/discover" replace />;

  return (
    <Screen back>
      <div className="eyebrow eyebrow--olive">WEATHER-PROOF BACKUP</div>
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

      <div className="foot foot--tight foot--gap6">
        {/* Replace, so Back from the indoor plan returns to Plan A instead of this screen. */}
        <Link to={`/details/${planB.id}`} replace className="btn btn--ink">
          See indoor plan →
        </Link>
        <button type="button" className="textbtn textbtn--accent" onClick={keepOriginal}>
          Keep original plan
        </button>
      </div>
    </Screen>
  );
}
