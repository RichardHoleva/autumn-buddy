import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import { getActivity } from '../data/activities';

interface State {
  saved: string[];
  skipped: string[];
}

type Action =
  | { type: 'save'; id: string }
  | { type: 'unsave'; id: string }
  | { type: 'skip'; id: string }
  | { type: 'resetSkipped' };

// The key keeps its version so anyone's saved and skipped ideas survive; stored invites from the old flow are ignored.
const KEY = 'autumn-buddy:v1';
const EMPTY: State = { saved: [], skipped: [] };

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const s = JSON.parse(raw) as Partial<State>;
    // Known activities only, each at most once, and never both saved and skipped.
    const ids = (v: unknown) =>
      Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === 'string' && !!getActivity(x)))] : [];
    const saved = ids(s.saved);
    return { saved, skipped: ids(s.skipped).filter((id) => !saved.includes(id)) };
  } catch {
    return EMPTY;
  }
}

function reducer(state: State, a: Action): State {
  switch (a.type) {
    case 'save':
      if (state.saved.includes(a.id)) return state;
      return { saved: [...state.saved, a.id], skipped: state.skipped.filter((x) => x !== a.id) };
    case 'unsave':
      if (!state.saved.includes(a.id)) return state;
      return { ...state, saved: state.saved.filter((x) => x !== a.id) };
    case 'skip':
      if (state.saved.includes(a.id) || state.skipped.includes(a.id)) return state;
      return { ...state, skipped: [...state.skipped, a.id] };
    case 'resetSkipped':
      return { ...state, skipped: [] };
  }
}

const Ctx = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable (private mode, quota): the app still works for this session */
    }
  }, [state]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
