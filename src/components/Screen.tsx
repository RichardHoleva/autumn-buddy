import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../state/store';

/**
 * Goes back one step. react-router stores the history position in history.state.idx; 0 means the page was
 * opened directly (a shared link, a refresh) with nothing to go back to, so fall back to `fallback`.
 */
export function useGoBack(fallback = '/discover') {
  const navigate = useNavigate();
  return () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate(fallback, { replace: true });
  };
}

export function BackButton({ className = 'back' }: { className?: string }) {
  const goBack = useGoBack();
  return (
    <button type="button" className={className} onClick={goBack} aria-label="Back">
      ←
    </button>
  );
}

function TabBar() {
  const { state } = useStore();
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
      </div>
    </nav>
  );
}

interface Props {
  children: ReactNode;
  /** Show the Discover / Saved tab bar. */
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
      <div className={bleed ? 'screen__body screen__body--bleed' : back ? 'screen__body screen__body--back' : 'screen__body'}>
        {children}
      </div>
      {tabs && <TabBar />}
    </div>
  );
}
