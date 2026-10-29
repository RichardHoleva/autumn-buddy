# Autumn Buddy

Discover simple autumn activities, save what you love, and invite friends. Mobile-first React app built from the Autumn Buddy design (`../Autumn Buddy.dc.html`).

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
| `#/saved` | Saved list with All / Outdoors / Indoors filter |
| `#/invites` | Invites sent from the earlier in-app flow and their status (history is reworked in a later step) |
| `#/details/:id` | Activity details: quick info, three steps, rainy-day option, **Invite friends** and **Save for later** (shows ✓ Saved once saved). Also what a shared link opens. |
| `#/invite/:id` | Pick a time (After class / This weekend / Flexible), edit the friendly message, then **Share invitation**. Works for one friend or a group chat; no account or in-app friends. |
| `#/respond/:inviteId` | The friend's view: say yes, suggest another time, or decline |
| `#/confirmed/:inviteId` | Confirmed plan ticket |
| `#/rainy/:id` | Indoor backup plan; swaps the plan on a confirmed invite |

## How it works

- State (saved, skipped, invites) lives in `localStorage` under `autumn-buddy:v1`. Clear it to reset the app.
- There is no backend. **Share invitation** opens the phone's own share sheet (the Web Share API), so the sender picks any messaging app and any friend or group chat there. Nothing is sent by Autumn Buddy, and it can't know whether a message was delivered, so the app never says "sent".
- Web Share needs HTTPS (GitHub Pages is) and a browser that supports it. Otherwise the button becomes **Copy invitation** (Clipboard API, with an older copy method as backup).
- The shared link is `<site>/#/details/:id`, which opens the activity with no account. It is only added when the app is served from a public address; on `localhost` or a LAN address (`npm run dev:phone`) it is left out, since a friend couldn't open it. Share and clipboard are also unavailable on plain-HTTP LAN addresses, so expect the copy fallback there.
- The message is built in `src/lib/invitation.ts`; sharing and copying are in `src/lib/share.ts`.
- Invites already stored from the earlier flow still show under **Invites**, and **DEMO · SEE ALEX'S VIEW** still opens the friend's side. The new share flow does not add to that list yet. The friends list and the signed-in user ("Sam") in `src/data/people.ts` are only used by those older screens.
- Activities, copy and photo slots are in `src/data/activities.ts`. Set `image` on an activity to use a real photo instead of the striped placeholder.
- Date is live. Temperature, sunset time and rain time are placeholders in `src/data/when.ts` until a weather source is connected.

## Layout

```
src/
  data/      activities, people, when/weather
  state/     store.tsx (reducer + localStorage)
  screens/   one file per screen
  components Screen shell, tab bar, photo placeholder
  styles.css design tokens and all styles
```
