# Boiler Room design system

Draft v0, for review. Open [`design-system/index.html`](design-system/index.html) to see all of it
rendered, then the three samples in [`design-system/samples/`](design-system/samples/). Everything
opens by double-clicking: no server, no install.

The samples show the system on real screens. They are not the app: rebuild them in the app's own
components, using the tokens and rules below.

## What's here

| Path | Contents |
| --- | --- |
| `design-system/index.html` | The system on one page: principles, logo, colour, type, pixel rules, components, icons, motion |
| `design-system/samples/landing.html` | Marketing site for founders: launch week, how it works, channels, the crew, claims, the launch wall |
| `design-system/samples/dashboard.html` | A founder's video: launch countdown, pipeline tracker, the crew's decisions, all videos |
| `design-system/samples/script-review.html` | The one step a customer acts on: preview, timeline, claims, approve |
| `design-system/tokens.css` | Every token as a CSS variable, prefixed `--br-` |
| `design-system/tokens.json` | The same tokens as data, for the app's build |
| `design-system/components.css` | The sample components, showing how tokens combine |
| `design-system/logo/` | Mark, blink frame, lockups, wordmarks, steam puff. All SVG |
| `design-system/icons/` | 20 pixel icons as SVG, plus `icons.js` for static pages |
| `design-system/pixel-art.mjs` | Draws every logo and icon from text grids. Edit a grid, run `node design-system/pixel-art.mjs` |

## Direction

**Light, pixelated and a little bit cute, for founders.** A sunny boiler room run by a tiny crew.
The pixel art says "made by machines, with care". The light palette keeps it friendly where most AI
tools go dark.

From [latchkey.dev](https://latchkey.dev) it keeps square corners, hard offset shadows on buttons,
numbered labels like `01 · HOW IT WORKS` and JetBrains Mono for labels and data. It changes the
rest: light instead of black, real pixel art instead of isometric tiles, and a mascot named Boyle.

**Pixel art, readable words.** The mascot, icons, frames, shadows and big numbers are pixels. Every
word you read is set in a smooth face, so the page stays easy to read at any size.

The crew is the brand. Agents are characters with jobs, so the UI always shows who did what, what
they decided, and when a person needs to step in. That also answers the judges' three questions.

## Audience and voice

The reader is a founder in launch week: shipping the product, writing the launch post, updating
investors. The video is the last thing on their list.

- **Founder to founder.** Short, plain and a little warm. "You're busy shipping", not "Leverage
  AI-powered video generation".
- **Talk about launch day,** not the technology: the date, the channels (X, LinkedIn, Product Hunt,
  YouTube, Reels, TikTok) and the one step they take, approving the script.
- **Show the crew.** Name the agent that did the work and what it decided.
- **No made-up stats, on our pages either.** Don't claim customer counts, speed or savings we
  haven't measured. The sample launches on the launch wall are placeholders and say so.
- **Countdowns over clocks.** A founder thinks "11 days to launch", so the dashboard leads with it.

## Logo

A 24 by 24 pixel boiler with steam on top, a valve on its side and a play button on its belly. The
wordmark, `boiler room` in lower case, is drawn on the same pixel grid with a one-pixel steam
shadow.

| File | Use |
| --- | --- |
| `lockup.svg` | Default. Mark and two-line wordmark |
| `lockup-on-deep.svg` | On Pipe blue. The outline turns ink so it doesn't vanish |
| `boiler-mark.svg` | App icon, favicon, avatar, small spaces |
| `boiler-mark-blink.svg` | Second frame for the blink animation |
| `wordmark.svg`, `wordmark-stacked.svg`, `wordmark-on-deep.svg` | Nav bars, beside the mark |
| `puff.svg` | Steam puff for animation |

- Draw it at whole multiples of its grid: the mark at 24, 48, 72 or 96px, the wordmark at 20, 30 or
  40px tall. In-between sizes smear the pixels.
- Keep one mark-width of clear space around it.
- Don't smooth, blur, rotate, recolour or outline it.

## Colour

| Token | Hex | Name | Use |
| --- | --- | --- | --- |
| `--br-deep` | `#086288` | Pipe | Headings, primary buttons, outlines. 6.5:1 on paper |
| `--br-steel` | `#4D8DBA` | Steel | Mascot body, field outlines, large text only. 3.5:1 |
| `--br-sky` | `#97D7FF` | Steam | Fills, hard shadows, highlights. Never text on light |
| `--br-cream` | `#FFEFC4` | Butter | Warm panels, claim highlights, the belly screen |
| `--br-ink` | `#0B2E40` | Ink | Body text. 13.7:1 on paper |
| `--br-muted` | `#3D6A87` | Muted | Captions, secondary text. 5.6:1 on paper |
| `--br-paper` | `#FFFBEF` | Paper | Page background |
| `--br-white` | `#FFFFFF` | White | Cards and inputs |
| `--br-sky-soft` | `#DDF2FF` | | Cool panels, hover, selected rows |
| `--br-cream-deep` | `#F4DB9A` | | Dashed rules, the dot grid |
| `--br-pink` | `#FF9EB5` | Blush | The mascot's cheeks |
| `--br-mint` | `#9FE3C1` | Mint | Done, sparingly |

Status colours are a soft fill with an ink that passes 4.5:1 on it:

| State | Fill | Ink | Means |
| --- | --- | --- | --- |
| Done | `#DDF7E9` | `#17654A` | Finished, passed, delivered |
| Working | `#DDF2FF` | `#086288` | An agent is on it |
| Queued | `#FFEFC4` | `#7A5300` | Waiting its turn |
| Needs you | `#FFE1EA` | `#A3214C` | A person has to act. The only pink state |
| Failed | `#FFE1DE` | `#A82A20` | Sent back, needs a fix |

Rules:

- The page is paper, cards are white, blue does the talking.
- Text on a sky fill is ink, not deep. Deep on sky is only 4.33:1.
- No dark mode for now. Dark appears only inside a customer's own video preview.
- A customer's video uses the customer's brand from `campaign.json`, never ours. In the script
  review sample, the preview is Nova's navy with Nova's radius; the frame around it is ours.

## Type

Words stay readable; the pixels live in the art. Pixel type is only for big numbers.

| Role | Font | Weights | Notes |
| --- | --- | --- | --- |
| Headings, buttons, tabs | Bricolage Grotesque | 700, 800 | Bold and readable, with character. Tight letter spacing on big sizes |
| Body and UI text | Nunito | 400, 600, 700, 800 | Rounded, easy to read at 14 to 19px |
| Labels, badges, table heads, data | JetBrains Mono | 400, 600 | Labels: 600, 11px, upper case, spaced 0.06em. Shared with Latchkey |
| Scoreboard numbers | Pixelify Sans | 700 | `.score`. 24px and up, numbers only: countdowns, counts, 16:9, the 18 |

All four are free on Google Fonts. In Next.js load them with `next/font/google`.

| Token | Size / line height | Face | Use |
| --- | --- | --- | --- |
| `--br-text-display` | 64 / 1.0 | Bricolage 800 | Landing hero only |
| `--br-text-h1` | 44 / 1.05 | Bricolage 800 | Page title |
| `--br-text-h2` | 32 / 1.1 | Bricolage 800 | Section |
| `--br-text-h3` | 24 / 1.15 | Bricolage 700 | Card title |
| `--br-text-h4` | 19 / 1.2 | Bricolage 700 | Small title |
| `--br-text-lg` | 18 / 1.6 | Nunito 400 | Lede |
| `--br-text-md` | 16 / 1.6 | Nunito 400 | Body |
| `--br-text-sm` | 14 / 1.5 | Nunito 400 | Secondary |
| `--br-text-label` | 11 / 1.4 | JetBrains Mono 600 | Labels |
| `--br-text-mono` | 13 / 1.5 | JetBrains Mono 400 | Data |
| `.score` | 24 and up | Pixelify Sans 700 | Numbers only |

Turn ligatures off (`font-variant-ligatures: none`). Pixelify Sans draws "fi" as one glyph that
reads as "A", and it costs nothing in the other faces.

## Pixel rules

One pixel is `--br-px`, 3px. Every outline, notch and shadow is a whole multiple of it.

1. **No rounded corners.** Corners are notched: the corner pixel is missing.
2. **Hard shadows only.** A solid block offset two pixels down and right, in Steam by default. No
   blur, no glow, no glass.
3. **No smooth gradients.** Colour changes in hard steps. A gradient with hard stops is fine.
4. **Sections meet in a dithered edge**, a 12px band of solid, checker and sparse pixels, instead of
   a fade (`.dither`).
5. **Frame sizes:** 2px for badges and small fields, 3px by default, 4px for hero moments. One size
   per component.
6. **Pixel art scales by whole numbers** and uses `image-rendering: pixelated`.

The frame is drawn with `box-shadow`, so any element can wear it and `--br-px` scales it:

```css
.px {
  --frame: var(--br-deep);   /* outline */
  --drop: var(--br-sky);     /* shadow */
  --lift: calc(var(--br-px) * 2);
  margin: var(--br-px);      /* the frame sits outside the box */
  box-shadow:
    0 calc(var(--br-px) * -1) 0 0 var(--frame),
    0 var(--br-px) 0 0 var(--frame),
    calc(var(--br-px) * -1) 0 0 0 var(--frame),
    var(--br-px) 0 0 0 var(--frame),
    calc(var(--lift) + var(--br-px)) var(--lift) 0 0 var(--drop),
    var(--lift) calc(var(--lift) + var(--br-px)) 0 0 var(--drop),
    var(--lift) var(--lift) 0 0 var(--drop);
}
```

The element needs an opaque background. In Tailwind, make it a plugin utility.

## Space and layout

- A 4px grid: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Content is at most 1160px wide, with a 24px gutter, 16px on phones.
- The app shell is a 248px sidebar and a content column. Under 860px the sidebar becomes a top bar.
- Every sample works at 390px wide with no sideways scroll. Wide content, such as the pipeline
  tracker or a table, scrolls inside its own frame.

## Components

`components.css` has these, to show the rules applied:

- **Buttons:** primary (Pipe), secondary (white), steam (sky, for the main call to action on blue),
  cream, ghost, danger, disabled. Small and large. Hover lifts one pixel, press drops into the
  shadow, in one frame with no easing.
- **Fields:** text input, the URL field with its button inside, error state, checkbox, toggle.
- **Badges:** queued, working, needs you, done, failed, plain. Mono labels with a square LED.
- **Alerts:** info, needs you, done, failed.
- **Tabs, segmented control, progress bar** (fills block by block).
- **Cards:** white, cream, sky, flat and quiet.
- **Claims:** any number on screen gets a butter highlight with a pixel underline, and its source
  quote is one click away. This is the product's no-invented-claims rule, made visible.
- **Crew tiles:** one per agent. Done is mint, needs you is pink and bobs, working is sky, waiting
  is paper with a steel outline.
- **Pipeline tracker** (dashboard sample): ten stations on one pipe. Done pipes are filled; pipes
  still to come are dashed.
- **Launch countdown** (dashboard sample): days to launch in scoreboard numbers, with the channels
  the founder will post to.
- **Launch wall** (landing sample): founders' launches, each with its video, where it launched and
  a cheer button. A proposed community feature: nothing like it exists in the product yet.

## Icons

20 icons on a 12 by 12 grid, one colour, drawn in `currentColor`: play, check, arrow-right, clock,
sparkle, mail, download, search, clapper, shield, brush, film, note, gear, eye, user, warning,
globe, plus, cloud. Use them at 12, 24 or 36px.

Each crew member has an icon: Researcher `search`, Director `clapper`, Validator `shield`, Art
Director `brush`, Motion `film`, Audio `note`, Render `gear`, Quality Check `eye`, Account Manager
`mail`, the customer `user`.

To add one, draw its grid in `ICONS` in `pixel-art.mjs` and run the script. In the app, generate
React components from the same grids, or import the SVGs.

## Motion

Motion moves in frames, not curves, like a sprite and like the video renderer.

- One frame is 83ms, 12 frames a second (`--br-frame`).
- Use `steps()` timing, never an ease.
- Button press and hover: one frame.
- The mascot blinks for 2 frames every 4 seconds, and steam puffs rise in 9 steps.
- The step that needs a person bobs 3px every 4 frames. A working badge's LED blinks.
- Everything stops under `prefers-reduced-motion`.

## Open questions for review

None open. The four questions from the first review were decided on 2026-11-07 and are logged below.

## Decisions

| Date | Decision | Why |
| --- | --- | --- |
| 2026-11-07 | Light only, butter paper background | Asked for light and cute, unlike Latchkey's black |
| 2026-11-07 | Pipe, Steel, Steam and Butter as the brand colours | Given by the founder |
| 2026-11-07 | Pixelify Sans, Nunito, Silkscreen, JetBrains Mono | Pixel voice on top, readable body underneath, mono shared with Latchkey |
| 2026-11-07 | Bricolage Grotesque for headings, JetBrains Mono for labels, Pixelify only for big numbers. Silkscreen dropped | Pixel text was hard to read. The pixels now live in the art, frames and numbers |
| 2026-11-07 | Founders in launch week are the audience | They are who we're targeting. Copy talks about launch day and channels |
| 2026-11-07 | Launch wall and launch countdown in the samples | The founder community angle, and how founders think about time |
| 2026-11-07 | A boiler mascot with a play-button belly | Says "boiler" and "video" in one shape |
| 2026-11-07 | The mascot is named Boyle | A boiler pun that also nods to Boyle's law of pressure, chosen by the founder |
| 2026-11-07 | The launch wall becomes an opt-in showcase of real films | Founders choose to appear when their film is delivered, and Boiler Room's own film goes first. No cheering or posting yet. It doubles as marketing the GTM agents can run |
| 2026-11-07 | Steam: the cloud stays in the logo, a rising trail of puffs plays in motion | The cloud stays clean at favicon size. Rising steam means the crew is working on a film |
| 2026-11-07 | The pixel is 3px on the marketing site and 2px in the dashboard | Chunky and cute where we sell, calmer where customers work every day. Set `--br-px` per surface |
| 2026-11-07 | Pink stays the "needs you" colour | Coral sits too close to the existing "failed" red and would read as an error |
| 2026-11-07 | Notched frames and hard shadows, 3px pixel | The pixel look, built with CSS anyone can apply |
| 2026-11-07 | Motion in 12fps steps | Pixel art moves in frames, and it matches the renderer's rule |
| 2026-11-07 | Every number shows its source | The product's claims rule, made visible |
