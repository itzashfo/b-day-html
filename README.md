# Happy 17th Birthday, Jo ✦

A cinematic, single-page birthday experience built for Joanna Manuel's 17th birthday. Pure HTML/CSS/JS — no backend, no build step, no dependencies.

## What it does

1. **Headphone prompt** — a quiet, mysterious opening screen that asks the visitor to put on headphones. Nothing about the birthday is revealed yet.
2. **Threshold** — a short "Ready? / Some experiences are better heard." beat, then a second deliberate click to enter (this is what lets the audio autoplay past browser restrictions).
3. **Cinematic intro** — a ~10 second sequence of large serif type over a particle field, ending in "HAPPY BIRTHDAY / JO / 17".
4. **Hero** — the full name and date.
5. **Message** — a short birthday note, revealed line by line as you scroll.
6. **A few moments** — an editorial photo gallery (varied sizes, not a grid of squares) with a fullscreen lightbox (arrow keys, swipe, counter).
7. **17** — a giant interactive number; clicking it releases a small particle burst.
8. **Birthday card** — a click-to-open card with the final message.
9. **A secret star** — a small hidden Easter egg near the 17 section.
10. **Finale** — the closing lines, a bigger particle release, and the music fading out naturally. A "Replay the experience" link restarts everything.

Throughout: ambient particles, film grain, a vignette, a custom cursor on desktop, and a thin dot-navigation on the right that tracks scroll position.

## File structure

```
birthday-site/
├── index.html
├── style.css
├── script.js
├── README.md
├── audio/
│   └── birthday-remake.mp3
├── images/
│   ├── jo01.jpg … jo06.jpg
└── assets/
    └── favicon.svg
```

## Customizing it

Almost everything content-specific lives in one place: the `birthdayConfig` object at the top of `script.js`.

```js
const birthdayConfig = {
  fullName: "Joanna Manuel",
  nickname: "Jo",
  age: 17,
  birthday: "17 September 2026",
  music: "audio/birthday-remake.mp3",
  photos: [
    "images/jo01.jpg",
    "images/jo02.jpg",
    // ...
  ]
};
```

- **Name / nickname / age / date** — used to build alt text and the photo counter. The big display text ("JO", "17", "Joanna Manuel", "17 • 09 • 2026") is written directly into `index.html` in a few places (hero, cinematic reveal, finale) since it's meant to be art-directed rather than templated — search for "Jo" / "17" / "Joanna Manuel" in `index.html` if you want to reuse this for someone else.
- **Adding a photo** — drop `jo07.jpg` into `/images/`, then add `"images/jo07.jpg"` to the `photos` array above. The gallery renders itself from this list, so no other HTML needs to change. Photos are laid out in an editorial pattern that repeats every 6 images.
- **Changing the music** — replace `/audio/birthday-remake.mp3` with your own file (or rename your file to match and update `music` in the config and the `src` on the `<audio>` tag in `index.html`).

## Local testing

Because the page loads a Google Fonts stylesheet and local audio/image files, open it through a local server rather than double-clicking the file (some browsers block local audio/fetch under `file://`):

```bash
cd birthday-site
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying

This is a static site — any static host works.

**GitHub Pages**
1. Push the folder contents to a repository.
2. Repo Settings → Pages → set the source branch/folder.
3. Your site will be live at `https://<username>.github.io/<repo>/`.

**Cloudflare Pages / Netlify / Vercel**
1. Connect the repository (or drag-and-drop the folder in the dashboard, where supported).
2. Build command: none. Output directory: the project root (where `index.html` lives).
3. Deploy.

## Notes

- The headphone prompt uses `sessionStorage`-free behavior by design — nothing is written that permanently marks the intro as "seen," but a refresh mid-way through the current tab session keeps things visually smooth via the normal browser cache.
- If the audio file fails to load, the site shows a small "Music couldn't be loaded, but the experience can continue" message and keeps working — nothing else is blocked by audio.
- Respects `prefers-reduced-motion`: particle counts and large transforms are reduced automatically.
