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
- The invitation card also has a **LINK** row with a **Copy link** button, so the link can be copied on its own as well as sent through the share sheet. Unlike the shared message, "Copy link" works on any address, including `localhost` (marked "this device only").
- The message is built in `src/lib/invitation.ts`; sharing and copying are in `src/lib/share.ts`.
- Nothing is tracked after sharing: there is no invite history, no replies and no accounts.
- Activities and their copy are in `src/data/activities.ts`. Photos are described in the [Photos](#photos) section below.
- The date is live. The temperature on Discover is a fixed placeholder in `src/data/when.ts` until a weather source is connected.

## Photos

Every activity has a photo, shown on Discover, Details, Saved, the invitation card, the Welcome collage and the rainy-day "Plan B" card.

- **Where they live:** `public/images/activities/`. Each activity has two JPEGs named after its `id`: `<id>.jpg` (1080 px wide) and `<id>-480.jpg` (480 px wide, for thumbnails). About 1.6 MB for all twelve.
- **How they are wired:** each activity in `src/data/activities.ts` has `image` (the path, with no leading slash so it works under a GitHub Pages sub-path), `imageAlt` (what the photo shows, for screen readers) and an optional `imageFocus` (a CSS `object-position`, to keep the subject in frame when a card crops the photo).
- **How they render:** the `Photo` component (`src/components/Photo.tsx`) draws an `<img>` with `object-fit: cover` and a `srcset`, so thumbnails download the small file and cards and heroes the large one. The box gets its size from CSS, so nothing shifts while a photo loads. A soft tint shows until it arrives, and stays (with the description attached) if the file is missing. Discover also fetches the next card's photo ahead of time.
- **Swapping a photo:** save the new image over `<id>.jpg` and `<id>-480.jpg` (same names, a 4:5 crop works best), then update `imageAlt` and, if the subject is off-centre, `imageFocus`. A new activity needs the same two files plus the three fields.

**Credits.** All photos are from [Pexels](https://www.pexels.com/) under the [Pexels license](https://www.pexels.com/license/) (free to use and modify, attribution not required). They were cropped, resized and lightly colour-adjusted to sit together.

| Activity | Photo | Photographer |
| --- | --- | --- |
| Hot Drink Walk | [Cozy Autumn Scene with Coffee and Leaves](https://www.pexels.com/photo/cozy-autumn-scene-with-coffee-and-leaves-40107301/) | elena_ sher |
| Leaf Hunt | [Hand Holding Autumn Leaves in Vibrant Fall Colors](https://www.pexels.com/photo/hand-holding-autumn-leaves-in-vibrant-fall-colors-34988628/) | Rahime Gül |
| Rainy Day Swap | [Cup of Tea and an Eyeglasses on the Stacks of Books Near the Window](https://www.pexels.com/photo/cup-of-tea-and-an-eyeglasses-on-the-stacks-of-books-near-the-window-8549590/) | Taryn Elliott |
| Golden Hour Bench | [Brown Wooden Park Bench Under Green Leaf Tree during Sunset](https://www.pexels.com/photo/brown-wooden-park-bench-under-green-leaf-tree-during-sunset-908986/) | Robin McPherson |
| Cinnamon Bake | [Flat-lay Photography of Person Holding Round White Bowl](https://www.pexels.com/photo/flat-lay-photography-of-person-holding-round-white-bowl-302544/) | Pixabay (as credited on Pexels) |
| Market Wander | [Pumpkins on Wooden Crates](https://www.pexels.com/photo/pumpkins-on-wooden-crates-13352333/) | Shonna Franks |

## Layout

```
public/
  images/activities/  the photos (<id>.jpg and <id>-480.jpg)
src/
  data/      activities, when options and the placeholder temperature
  lib/       invitation.ts (message and link), share.ts (share sheet and copy), images.ts (photo URLs), format.ts
  state/     store.tsx (saved and skipped ideas, localStorage)
  screens/   one file per screen
  components Screen shell (Back button, tab bar), Photo
  styles.css design tokens and all styles
```
