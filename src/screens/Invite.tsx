import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Photo } from '../components/Photo';
import { Screen } from '../components/Screen';
import { getActivity, type Activity } from '../data/activities';
import { WHEN, WHEN_KEYS, type WhenKey } from '../data/when';
import { activityUrl, buildMessage, retimeMessage } from '../lib/invitation';
import { canShareNatively, copyText, shareNatively } from '../lib/share';

const NOTE_MS = 4000;

interface Note {
  kind: 'ok' | 'error';
  text: string;
  /** Restarts the entrance animation when the same kind of note appears twice in a row. */
  n: number;
}

export function Invite() {
  const { id } = useParams();
  const a = getActivity(id);
  if (!a) return <Navigate to="/discover" replace />;
  // Keyed so switching activity (e.g. via the rainy-day plan) starts from a fresh message.
  return <InviteForm key={a.id} activity={a} />;
}

function InviteForm({ activity: a }: { activity: Activity }) {
  const [when, setWhen] = useState<WhenKey>('flexible');
  // Until the sender edits the message, it follows the activity and time they pick.
  const [custom, setCustom] = useState<string | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  // Set once the share sheet has closed normally or the text was copied; offers the way back to browsing.
  const [done, setDone] = useState(false);
  const noteTimer = useRef<number | undefined>(undefined);
  const field = useRef<HTMLTextAreaElement>(null);

  useEffect(() => () => window.clearTimeout(noteTimer.current), []);

  const canShare = canShareNatively();
  const url = activityUrl(a.id);
  const suggested = buildMessage(a, when);
  const message = custom ?? suggested;
  const edited = custom !== null && custom !== suggested;

  const clearNote = () => {
    window.clearTimeout(noteTimer.current);
    setNote(null);
  };
  const showNote = (kind: Note['kind'], text: string) => {
    window.clearTimeout(noteTimer.current);
    setNote({ kind, text, n: Date.now() });
    noteTimer.current = window.setTimeout(() => setNote(null), NOTE_MS);
  };

  const pickWhen = (next: WhenKey) => {
    if (custom !== null) setCustom(retimeMessage(custom, when, next));
    setWhen(next);
    clearNote();
  };
  const edit = (value: string) => {
    setCustom(value);
    clearNote();
  };
  const reset = () => {
    setCustom(null);
    clearNote();
  };

  const copy = async (text: string, okText: string) => {
    if (await copyText(url ? `${text}\n${url}` : text)) {
      showNote('ok', okText);
      setDone(true);
    } else {
      showNote('error', 'Couldn’t copy. Select the text and copy it.');
      field.current?.focus();
      field.current?.select();
    }
  };

  const share = async () => {
    const text = message.trim();
    if (!text) return;
    if (!canShare) {
      await copy(text, 'Copied. Paste it into any chat.');
      return;
    }
    // The share sheet needs the click's user gesture, so this must be the first thing that runs.
    const outcome = await shareNatively({ title: a.title, text, ...(url ? { url } : {}) });
    if (outcome === 'cancelled') clearNote();
    else if (outcome === 'failed') await copy(text, 'Copied instead. Paste it into any chat.');
    // 'shared' only means the sheet closed normally; we can't know it was delivered, so we say nothing about that.
    else setDone(true);
  };

  return (
    <Screen back>
      <div className="eyebrow">A LITTLE INVITATION</div>
      <h1 className="title">
        Better with <em>friends.</em>
      </h1>

      <div className="invcard">
        <div className="invcard__act">
          <Photo activity={a} className="invcard__thumb" sizes="56px" eager />
          <div>
            <div className="invcard__title">{a.title}</div>
            <div className="invcard__meta">
              {a.minutes} MIN · {a.where.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="invcard__sec">
          <div className="label" id="invite-when">
            WHEN?
          </div>
          <div className="chips chips--card" role="radiogroup" aria-labelledby="invite-when">
            {WHEN_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={k === when}
                className={k === when ? 'chip chip--on' : 'chip'}
                onClick={() => pickWhen(k)}
              >
                {WHEN[k].label}
              </button>
            ))}
          </div>
        </div>

        <div className="invcard__msg">
          <div className="invcard__head">
            <label className="label" htmlFor="invite-message">
              MESSAGE
            </label>
            {edited ? (
              <button type="button" className="invcard__reset" onClick={reset}>
                RESET
              </button>
            ) : (
              <span className="invcard__hint">TAP TO EDIT</span>
            )}
          </div>
          <textarea
            id="invite-message"
            ref={field}
            className="msg"
            rows={6}
            value={message}
            placeholder="Write a short message…"
            onChange={(e) => edit(e.target.value)}
          />
          {url && <p className="invcard__note">A link to this activity is added {canShare ? 'when you share' : 'when you copy'}.</p>}
        </div>
      </div>

      <div className="invfoot">
        <button type="button" className="btn btn--accent" onClick={share} disabled={!message.trim()}>
          {canShare ? 'Share invitation' : 'Copy invitation'}
        </button>
        <div className="sharenote">
          {done ? (
            <Link
              to="/discover"
              className={note ? 'sharenote__next sharenote__next--off' : 'sharenote__next'}
              tabIndex={note ? -1 : undefined}
            >
              Back to Discover →
            </Link>
          ) : (
            <p className={note ? 'sharenote__hint sharenote__hint--off' : 'sharenote__hint'}>
              {canShare
                ? 'Share with a friend or group chat. They don’t need Autumn Buddy.'
                : 'Paste it into a chat with a friend or group. They don’t need Autumn Buddy.'}
            </p>
          )}
          <div className="sharenote__live" aria-live="polite">
            {note && (
              <p key={note.n} className={`sharenote__msg sharenote__msg--${note.kind}`}>
                {note.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </Screen>
  );
}
