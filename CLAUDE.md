# CLAUDE.md — "For Zahra" letters site

Every change to this project follows this file. If a request conflicts with it, point out the conflict and ask before going ahead.

## 1. Purpose

A private, long-lived gift website for Zahra: a set of digital letters she opens over time, mostly on her phone from a home-screen icon.

- **Open When…**: letters for feelings and situations (sad, bad day, stressed, miss me, can't sleep, need a laugh, doubt yourself, we had a fight, anxious, proud of yourself, bored, need a hug). These are **always openable**.
- **Open On…**: letters tied to dates (Christmas 2026, New Year's 2027, Valentine's 2027, 6-month anniversary, National Girlfriend Day 2027-08-01, after school is finished, 1-year anniversary, her birthday). Each one is **locked until its date**.
- A letter has a written message, plus optional photo(s) and an optional voice note.
- The site grows over months. **Adding a letter means adding one Markdown file plus its media, with no code changes.** Never add anything that breaks this, such as a hand-maintained list of letters.

Tone: warm, soft, personal, calm. It's a love letter, not a product. No analytics, tracking, ads, cookie banners, third-party embeds or social sharing.

## 2. Stack

| Concern | Choice |
|---|---|
| Build | Vite 8 + React 19 + TypeScript (strict-ish, see tsconfig) |
| Routing | `react-router` v8, **HashRouter** (reason in §4) |
| Styling | Plain CSS + CSS custom properties. **No Tailwind, CSS-in-JS or UI kits.** One `.css` file sits next to each component. |
| Content | Markdown + YAML frontmatter, parsed **at build time** by a Vite plugin and served as `virtual:letters` |
| Parsing | `yaml` (frontmatter), `marked` (Markdown → HTML). Both are **devDependencies that run only at build time**. They must never be imported by browser code. |
| Backend | None. Output is fully static (`dist/`). |
| Hosting | Cloudflare Pages or Netlify: build `npm run build`, output `dist`, Node ≥ 20.19 |

### ⚠️ Dependencies

**Do not add, remove or upgrade any dependency (runtime or dev) without asking first.** Explain what it's for, its size, and why it can't reasonably be done by hand. Most things here (animations, carousels, date maths, audio players) should be built with plain React and CSS.

### Commands

```bash
npm run dev            # dev server (letters keep their real lock state)
npm run dev:unlocked   # dev server with every Open On letter unlocked, for previewing
npm run build          # type-check, validate all content, and build to dist/
npm run preview        # serve dist/ locally
npm run typecheck
npm run lint
```

Before saying any task is done, run `npm run build` and make sure it passes.

## 3. Folder structure

```
content/                     ← THE ONLY PLACE YOU EDIT TO ADD LETTERS
  when/*.md                  Open When letters (one file per letter)
  on/*.md                    Open On letters (one file per letter)
  media/                     photos + voice notes, referenced by path relative to this folder
public/                      copied as-is: manifest, home-screen icons, _headers, robots.txt
src/
  main.tsx                   entry: imports tokens.css + global.css
  App.tsx                    router + content-error screen
  content/
    schema.ts                letter types + PURE validation rules. Runs at build time; the browser imports its TYPES only.
    index.ts                 the app's content API: whenLetters, onLetters, getLetter(), mediaUrl(), renderBody()
    unlock.ts                date-unlock rules (isUnlocked, daysUntil)
    virtual-letters.d.ts     types for the generated `virtual:letters` module
  pages/                     route components (+ co-located .css)
  components/                shared components (+ co-located .css), created when needed
  styles/
    tokens.css               ALL design tokens. The single source of colour/type/radius/shadow/spacing.
    global.css               reset + base element styles
vite/validate-content.ts     Vite plugin: reads + validates + renders all letters → `virtual:letters`
vite.config.ts               base: './', registers the plugin
netlify.toml                 Netlify build settings (Cloudflare Pages: set the same in its dashboard)
.env.unlocked                env for `npm run dev:unlocked`
```

## 4. Routing

**HashRouter** (`/#/open-on`, `/#/letter/christmas-2026`), chosen on purpose:
- The site is static files with no server. With hash URLs, every deep link, refresh and home-screen launch loads `index.html` on any host, with no `_redirects`/rewrite rules that could break when moving between Cloudflare and Netlify.
- iOS home-screen web apps reopen at their saved URL. Hash routes always resolve.
- SEO and pretty URLs don't matter here, because the site is private and `noindex`.

Planned routes: `/` (home), `/open-when`, `/open-on`, `/letter/:id`. Letter ids are unique across both sections, so `/letter/:id` is enough.

`vite.config.ts` uses `base: './'` so the build works from any path. Reference assets through imports or `mediaUrl()`, never through hard-coded absolute `/…` paths.

## 5. How to add a letter

1. Put any media in `content/media/`. Subfolders are fine and encouraged, e.g. `content/media/christmas-2026/tree.jpg`.
2. Create **one** Markdown file:
   - feelings/situations → `content/when/<id>.md`
   - date-locked → `content/on/<id>.md`
3. The filename must be exactly `<id>.md`.
4. Run `npm run dev` to check it, then `npm run build`. If anything is wrong, the build fails and lists every problem in plain English.

No code changes, imports or registries are needed. New files are picked up automatically.

### Frontmatter format

The file starts with a `---` line, then YAML fields, then another `---` line, then the message in Markdown.

**Quoting:** if a value contains `: ` (colon + space), or starts with `"`, `'`, `#`, `*`, `[` or `{`, wrap the whole value in double quotes, for example `teaser: "Warning: contains terrible jokes."`. The validator points this out if you forget.

```markdown
---
id: christmas-2026                 # required · lowercase-kebab-case · must equal the filename · unique across BOTH folders
title: Open on Christmas           # required · shown on the card and as the letter heading
teaser: Our first Christmas letter # required · short line on the card · max 90 characters
order: 1                           # required · number · cards sort by order, then title
unlockDate: 2026-12-25             # Open On ONLY · required · YYYY-MM-DD, or null for "date TBD"
photos:                            # optional · list
  - christmas-2026/tree.jpg        #   plain filename, or…
  - file: christmas-2026/us.jpg    #   …with alt text (preferred, see Accessibility)
    alt: Us by the tree, laughing
voiceNote: christmas-2026/hi.m4a   # optional · one audio file
---
Merry Christmas, my love!

The message is **Markdown**: paragraphs, *italics*, lists. A single line break stays a line break.
```

Rules the validator enforces (see `src/content/schema.ts`):
- Unknown fields are errors. This catches typos like `teasr` or `unlock_date`.
- `unlockDate` in an Open When letter is an error. Move the file to `content/on/` instead.
- `unlockDate` must be a real calendar date (`2027-02-30` is rejected).
- Photos must be jpg/jpeg/png/webp/avif/gif/svg. Voice notes must be m4a/mp3/aac/ogg/opus/wav/webm. Every referenced file must exist in `content/media/`.
- The body can't be empty.

Media guidance: resize photos to about 1600px on the long edge and keep them under about 400 KB (JPEG/WebP). For voice notes, use **AAC `.m4a` or `.mp3`**, because those play on iPhone Safari. Avoid `.ogg`/`.opus` for anything she needs to hear on iOS. Files under 4 KB get inlined into the JS by Vite, which is fine.

### How loading works

All parsing happens at **build time** in `vite/validate-content.ts`:
1. It reads every `content/{when,on}/*.md` and runs it through `parseLetter()` in `schema.ts`.
2. It checks ids are unique, sorts by `order` then title, and renders each body to HTML with `marked`.
3. It emits the virtual module `virtual:letters`: the letters as JSON (with `bodyHtml`), plus hashed URLs for **only the media files letters reference**. Unreferenced files in `content/media/` are not shipped.

Because of this, the YAML and Markdown parsers never reach her phone. App code reads content only through `src/content/index.ts`, and **must use `import type` (never a value import) from `schema.ts`**, or the YAML parser gets bundled.

If a letter is broken:
- `npm run build` stops with a list of every problem.
- `npm run dev` prints problems in the terminal and shows them in the browser error overlay, and the app shows a "A letter needs fixing" screen. Adding, editing or deleting any file under `content/` re-runs everything and reloads the page, with no restart needed.

Change validation rules only in `schema.ts`. Keep it pure: no `fs`, no `import.meta`, no DOM.

## 6. Date-unlock rules (Open On)

Implemented in `src/content/unlock.ts`. Don't duplicate this logic anywhere else.

**Key dates** (relationship began 2026-06-30). These are the source of truth for every Open On letter:

| Occasion | `unlockDate` | File |
|---|---|---|
| Christmas | 2026-12-25 | `on/christmas-2026.md` |
| 6 month anniversary | 2026-12-30 | `on/six-month-anniversary.md` |
| New Year's Day | 2027-01-01 | `on/new-years-2027.md` |
| Valentine's Day | 2027-02-14 | `on/valentines-2027.md` |
| 1 year anniversary | 2027-06-30 | `on/one-year-anniversary.md` |
| National Girlfriend Day | 2027-08-01 | `on/girlfriend-day-2027.md` |
| Her birthday (3 September) | 2027-09-03 | `on/birthday-2027.md` |
| School finished | `null` (TBD) | `on/school-finished.md` |

Yearly occasions get a new file per year (e.g. `birthday-2028.md`) instead of reusing old ones, so past letters stay readable.
- `unlockDate: YYYY-MM-DD` unlocks at **00:00 in the viewer's local time** on that day. Christmas opens at midnight wherever Zahra's phone is.
- `unlockDate: null` means **date TBD**. It always stays locked and shows "Date to be revealed" (no countdown). Use this for the anniversaries, her birthday and "after school is finished" until the date is known.
- A locked card shows its title, teaser and the date or countdown, but **never** any body text, photos or voice note.
- Once unlocked, a letter stays open forever.
- Countdown: `daysUntil()` gives whole calendar days. 0 means today.
- `npm run dev:unlocked` (`VITE_UNLOCK_ALL=true`) unlocks everything, **in dev only**. Production builds ignore it.
- **Honest limitation:** locking is a UI promise, not security. Letter text ships in the JS bundle, so a determined person could read it early. Never put anything truly secret here. If real locking is ever wanted, it needs a backend, so ask first.
- Read the current time with `new Date()` only through these helpers, so tests and previews can pass a fixed `now`.

## 7. Design rules

All values come from `src/styles/tokens.css`. **Never hard-code a hex colour, font family, shadow or radius in a component.** Add a token first if one is missing.

**Palette** (pink pastel, soft, airy):

| Token | Hex | Use |
|---|---|---|
| `--color-cream` | #FFF8F5 | page background |
| `--color-blush` | #FFE4EC | cards, theme colour |
| `--color-petal` | #FBD3E0 | locked cards, subtle fills |
| `--color-rose` | #F8B7CC | highlights, decorative fills |
| `--color-lavender` | #E8DDF5 | secondary accent, alternate cards |
| `--color-mauve` | #B5779A | accents: icons, borders, dividers, **large** display text only |
| `--color-mauve-ink` | #7E4566 | links and small accent text (AA-safe mauve) |
| `--color-plum` | #5A3A4E | body text |

Prefer the semantic tokens (`--bg-card`, `--text-body`, `--text-link`, …) over raw palette tokens.

**Contrast (checked, WCAG 2.x):**
- Plum body text passes AA on every palette background: cream 9.3, blush 8.2, lavender 7.5, petal 7.2, rose 5.9.
- Mauve `#B5779A` **fails AA as text** (3.3:1 on cream, under 3:1 elsewhere). Never use it for body copy, links or small text. It may be used for ≥ 24px display text **on cream only** (AA large = 3:1), or for non-text decoration.
- Mauve-ink `#7E4566` passes AA on cream/blush/petal/lavender (≥ 5.3). **Not on rose** (4.31): put plum text on rose.
- If you add any new colour pairing, check its contrast and note the ratio in `tokens.css`.

**Type:**
- Display/headings: `--font-display` (Cormorant Garamond), **italic**, weight 400–600.
- Letter body: `--font-letter` (Caveat) at `--text-letter` (24px). **Never below 20px.** Use it only for the letter body and short handwritten flourishes, never for UI controls, dates or long instructions.
- UI (buttons, labels, dates, captions): `--font-ui` (Nunito), at least 16px for readable text and 14px for captions.
- Fonts load from Google Fonts in `index.html` with `display=swap`. Don't add font weights you don't use.

**Shape and depth:**
- Radius 20–28px (`--radius-md`, `--radius-lg`, `--radius-xl`) for cards, sheets, images and buttons. Pills use `--radius-pill`.
- Shadows only from `--shadow-sm/md/lg` (pink-tinted). **No grey/black shadows. No hard black borders.** If a border is needed, use `--border-soft`.

**Layout:**
- Mobile-first: write base styles for a ~375px phone and add `min-width` media queries for larger screens.
- Reading column max `--content-max`, page gutter `--gutter`. No horizontal scroll at 320px.
- Respect safe-area insets (already on `body`) because the app runs standalone from the home screen.
- Use `100dvh`, not `100vh`.

**Motion:** gentle and slow (`--ease-soft`, `--duration-*`). Durations go to 0 under `prefers-reduced-motion`, so always use the tokens. No autoplaying audio, no parallax, no confetti that can't be skipped.

## 8. Accessibility rules

- Semantic HTML first: `<main>`, `<nav>`, `<h1>`–`<h3>` in order, `<button>` for actions, `<a>`/`<Link>` for navigation. No clickable `<div>`s.
- Each route has exactly one `<h1>`. Update `document.title` per route (e.g. "Open when you miss me · For Zahra").
- Touch targets are at least `--tap-min` (44×44px).
- Visible focus everywhere (the global `:focus-visible` ring). Never remove outlines without a replacement.
- Locked cards: still focusable and announced, using a real `<button>` with `aria-disabled="true"` plus text like "Locked until 25 December 2026" (or "Date to be revealed"). Don't rely on colour or a lock icon alone.
- Images: use the frontmatter `alt` when present. Otherwise use a generic but honest fallback ("Photo from: <title>"). Decorative images get `alt=""`.
- Voice notes: native `<audio controls preload="none">` (or a custom player with full keyboard and screen-reader support), labelled with the letter title. Never autoplay.
- Letter body HTML from `renderBody()` must keep its semantic structure (paragraphs, lists, emphasis).
- Respect `prefers-reduced-motion`. Don't convey meaning through animation alone.
- Text must stay readable at 200% zoom, so use `rem` font sizes.
- Contrast rules are in §7.

## 9. Conventions

- TypeScript: no `any`. Letter types come from `src/content/schema.ts`.
- Components: function components, named by file (`LetterCard.tsx` + `LetterCard.css`). Use BEM-ish class names (`.card`, `.card__teaser`, `.card--locked`).
- `renderBody()` returns build-time-rendered HTML that is injected with `dangerouslySetInnerHTML`. That's acceptable **only** because we write the letters ourselves. Never render untrusted or user-submitted text this way.
- Keep the site private: `noindex` meta, `robots.txt` and `X-Robots-Tag` (in `public/_headers`) stay in place.
- Don't commit real secrets. There are none, and there's no backend.
- Sample letters are marked "*(Sample letter — replace this with your own words.)*". Replace or delete them before giving her the link.
