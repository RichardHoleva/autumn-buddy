import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { hasOpenInvites, useStore } from '../state/store';

export function BackButton({ className = 'back' }: { className?: string }) {
  const navigate = useNavigate();
  const goBack = () => {
    // react-router stores the history position in history.state.idx; 0 means a deep link with nothing to go back to.
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate('/discover', { replace: true });
  };
  return (
    <button type="button" className={className} onClick={goBack} aria-label="Back">
      ←
    </button>
  );
}

function TabBar() {
  const { state } = useStore();
  const open = hasOpenInvites(state.invites);
  const tab = ({ isActive }: { isActive: boolean }) => (isActive ? 'tab tab--on' : 'tab');
  return (
    <nav className="tabbar" aria-label="Main">
      <div className="tabbar__inner">
        <NavLink to="/discover" end className={tab}>
          Discover
        </NavLink>
        <NavLink to="/saved" end className={tab}>
          Saved
          {state.saved.length > 0 && <span className="tab__count">{state.saved.length}</span>}
        </NavLink>
        <NavLink to="/invites" end className={tab}>
          Invites
          {open && <span className="tab__dot" role="img" aria-label="Waiting on a reply" />}
        </NavLink>
      </div>
    </nav>
  );
}

interface Props {
  children: ReactNode;
  /** Show the Discover / Saved / Invites tab bar. */
  tabs?: boolean;
  /** Show a floating back button. */
  back?: boolean;
  /** Let content run under the top edge (Details hero). */
  bleed?: boolean;
}

export function Screen({ children, tabs, back, bleed }: Props) {
  return (
    <div className="screen">
      {back && <BackButton />}
      <div className={bleed ? 'screen__body screen__body--bleed' : 'screen__body'}>{children}</div>
      {tabs && <TabBar />}
    </div>
  );
}
