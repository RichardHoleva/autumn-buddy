import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import { getActivity } from '../data/activities';
import { getFriend } from '../data/people';
import { WHEN, type WhenKey } from '../data/when';

export type InviteStatus = 'pending' | 'confirmed' | 'suggested' | 'declined';

export interface Invite {
  id: string;
  activityId: string;
  friendId: string;
  when: WhenKey;
  /** Set when the friend suggests a different time. */
  suggestedWhen?: WhenKey;
  message: string;
  status: InviteStatus;
  sentAt: number;
}

interface State {
  saved: string[];
  skipped: string[];
  invites: Invite[];
}

type Action =
  | { type: 'save'; id: string }
  | { type: 'skip'; id: string }
  | { type: 'resetSkipped' }
  | { type: 'send'; invite: Invite }
  | { type: 'reply'; id: string; status: 'confirmed' | 'declined' }
  | { type: 'suggest'; id: string; when: WhenKey }
  | { type: 'accept'; id: string }
  | { type: 'swap'; id: string; activityId: string };

const KEY = 'autumn-buddy:v1';
const EMPTY: State = { saved: [], skipped: [], invites: [] };

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const s = JSON.parse(raw) as Partial<State>;
    const ids = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => !!getActivity(x as string)) : []);
    const invites = Array.isArray(s.invites)
      ? s.invites.filter((i) => i && getActivity(i.activityId) && getFriend(i.friendId) && i.when in WHEN)
      : [];
    return { saved: ids(s.saved), skipped: ids(s.skipped), invites };
  } catch {
    return EMPTY;
  }
}

function patch(invites: Invite[], id: string, change: Partial<Invite>): Invite[] {
  return invites.map((i) => (i.id === id ? { ...i, ...change } : i));
}

function reducer(state: State, a: Action): State {
  switch (a.type) {
    case 'save':
      if (state.saved.includes(a.id)) return state;
      return { ...state, saved: [...state.saved, a.id], skipped: state.skipped.filter((x) => x !== a.id) };
    case 'skip':
      if (state.saved.includes(a.id) || state.skipped.includes(a.id)) return state;
      return { ...state, skipped: [...state.skipped, a.id] };
    case 'resetSkipped':
      return { ...state, skipped: [] };
    case 'send':
      return { ...state, invites: [a.invite, ...state.invites] };
    case 'reply':
      return { ...state, invites: patch(state.invites, a.id, { status: a.status, suggestedWhen: undefined }) };
    case 'suggest':
      return { ...state, invites: patch(state.invites, a.id, { status: 'suggested', suggestedWhen: a.when }) };
    case 'accept': {
      const inv = state.invites.find((i) => i.id === a.id);
      if (!inv?.suggestedWhen) return state;
      return {
        ...state,
        invites: patch(state.invites, a.id, { status: 'confirmed', when: inv.suggestedWhen, suggestedWhen: undefined }),
      };
    }
    case 'swap':
      return { ...state, invites: patch(state.invites, a.id, { activityId: a.activityId }) };
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

/** An invite is "open" while it is waiting on a reply or on the sender to answer a suggested time. */
export function hasOpenInvites(invites: Invite[]): boolean {
  return invites.some((i) => i.status === 'pending' || i.status === 'suggested');
}
