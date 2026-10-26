# Autumn Buddy

Discover simple autumn activities, save what you love, and invite a friend. Mobile-first React app built from the Autumn Buddy design (`../Autumn Buddy.dc.html`).

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
| `#/discover` | Swipe deck. Drag right to save, left to skip, tap for details. Arrow keys work on desktop. |
| `#/saved` | Saved list with All / Outdoors / Indoors filter |
| `#/invites` | Sent invites and their status |
| `#/details/:id` | Activity details |
| `#/invite/:id` | Pick a friend and time, edit the message, send |
| `#/respond/:inviteId` | The friend's view: say yes, suggest another time, or decline |
| `#/confirmed/:inviteId` | Confirmed plan ticket |
| `#/rainy/:id` | Indoor backup plan; swaps the plan on a confirmed invite |

## How it works

- State (saved, skipped, invites) lives in `localStorage` under `autumn-buddy:v1`. Clear it to reset the app.
- There is no backend yet. A sent invite shows as "Waiting", and the **DEMO · SEE ALEX'S VIEW** link on it opens the friend's side so you can reply from this device. Real delivery between people needs an API and accounts.
- The friends list and the signed-in user ("Sam") are in `src/data/people.ts`.
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
