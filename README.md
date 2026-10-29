# Autumn Buddy

Discover simple autumn activities, save what you love, and share them with friends. Mobile-first React app built from the Autumn Buddy design (`../Autumn Buddy.dc.html`).

## Run it

Double-click `start.bat`, or from this folder:

```
npm install      # first time only
npm run dev      # http://localhost:5173
```

- **On your phone:** run `npm run dev:phone`, then open the `Network` address Vite prints (phone and PC on the same Wi-Fi). Use "Add to Home Screen" to install it.
- **Production build:** `npm run build` writes a static site to `dist/` that works from any host or folder.

## Deploy to GitHub Pages

This project includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.
After pushing the `app` folder to a GitHub repository:

1. Open the repository on GitHub and go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to the `main` branch, or run the workflow manually from the **Actions** tab.

The site will be published at:

```
https://YOUR-GITHUB-USERNAME.github.io/REPOSITORY-NAME/
```

The app uses hash routing, so links such as `#/discover` continue to work on
GitHub Pages.

## Screens

| Route | Screen |
| --- | --- |
| `#/` | Welcome |
| `#/discover` | Swipe deck. Drag right to save, left to skip, tap the card (or **View activity**) for details. Skip / Save buttons and arrow keys work too. |
| `#/saved` | Saved ideas as cards (All / Outdoors / Indoors filter). Tap a card to open it, **Invite friends** to share it, or **Remove** (with a few seconds to **Undo**). |
| `#/details/:id` | Activity details: quick info, three steps, rainy-day option, **Invite friends** and **Save for later** (tap again to remove). Also what a shared link opens. |
| `#/invite/:id` | Pick a time (After class / This weekend / Flexible), edit the friendly message, then **Share invitation**. Works for one friend or a group chat; no account or in-app friends. |
| `#/rainy/:id` | The indoor backup for an outdoor activity, with a way to open it |

Discover and Saved are the two tabs. Every other screen has a Back button, and after sharing, the Invite screen offers **Back to Discover**. The old `#/invites`, `#/respond/…` and `#/confirmed/…` links redirect to Discover.

## How it works

- State (saved and skipped ideas) lives in `localStorage` under `autumn-buddy:v1`. Clear it to reset the app. Invites stored by older versions are ignored and dropped on the next save.
- There is no backend. **Share invitation** opens the phone's own share sheet (the Web Share API), so the sender picks any messaging app and any friend or group chat there. Nothing is sent by Autumn Buddy, and it can't know whether a message was delivered, so the app never says "sent".
- Web Share needs HTTPS (GitHub Pages is) and a browser that supports it. Otherwise the button becomes **Copy invitation** (Clipboard API, with an older copy method as backup).
- The shared link is `<site>/#/details/:id`, which opens the activity with no account. It is only added when the app is served from a public address; on `localhost` or a LAN address (`npm run dev:phone`) it is left out, since a friend couldn't open it. Share and clipboard are also unavailable on plain-HTTP LAN addresses, so expect the copy fallback there.
- The message is built in `src/lib/invitation.ts`; sharing and copying are in `src/lib/share.ts`.
- Nothing is tracked after sharing: there is no invite history, no replies and no accounts.
- Activities, copy and photo slots are in `src/data/activities.ts`. Set `image` on an activity to use a real photo instead of the striped placeholder.
- The date is live. The temperature on Discover is a fixed placeholder in `src/data/when.ts` until a weather source is connected.

## Layout

```
src/
  data/      activities, when options and the placeholder temperature
  lib/       invitation.ts (message and link), share.ts (share sheet and copy), format.ts
  state/     store.tsx (saved and skipped ideas, localStorage)
  screens/   one file per screen
  components Screen shell (Back button, tab bar), photo placeholder
  styles.css design tokens and all styles
```
