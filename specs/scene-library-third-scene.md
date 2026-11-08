# scene-library-third-scene
Direction: crd_wr97nq4caharveys2rdsty5t4v

Scene named: `cell-type`, row 14 of `docs/motion/scenes/README.md` on `boiler-room` `dev`. Its spec
file is `docs/motion/scenes/cell-type.md`, and that file is the source of every frame, pixel and
tag value below. Do not copy values from here: read that file.

Why this scene: the DIR says to take the next unbuilt scene in README order. On `dev`,
`packages/motion/src/scenes/` holds files for rows 1 to 13 (`status-relay`, `rail-words` included)
and has no `cell-type` or `iso-chain` file. Row 14 is the first unbuilt row. `packages/schema`
`sceneRegistry` already lists it as `{ text: { headline: 16 } }`.
Preconditions checked on `dev`: `packages/motion` and `docs/motion/scenes` both exist.

Problem: the Long template's set-piece row (README: `cell-type`, "Long, or `iso-chain`", row 17)
has no drawable scene, so a Long film that picks `cell-type` cannot render. The registry validates
the type but no template draws it.

Acceptance criteria:
  1. `packages/motion/src/scenes/cell-type.tsx` exists and is registered in `sceneImplementations`
     as `'cell-type'`; `IMPLEMENTED_SCENE_TYPES` includes it; the existing registry test still
     passes, including the check that the motion registry's validator view equals the schema
     `sceneRegistry`.
  2. Registry values equal the file's Registry entry: `kind: 'setpiece'`, ground `base` for Neutral
     Cut and `plate` for Kinetic Plate, `text {headline: 16}`, anchor `panel` (the panel box),
     props `accent?`.
  3. Every visible word comes from `scene.text.headline` (1 to 3 words, 16 characters, one line).
     No copy and no numeral comes from `scene.props`. There is no asset.
  4. Layout follows the file's Layout table for 16:9, 9:16 and 1:1: pitch `p = S / 40` (27 px at
     16:9, as the file states), grid 71x40 / 40x71 / 40x40, dot centres `((c+0.5)p, (r+0.5)p)`,
     text at `capD` capped by the fit-text size, panel = ink box padded 2 cells, snapped to cells.
  5. Sampling follows the file: headline drawn once offscreen at grid size, a cell is on when
     alpha >= 0.5, memoised in a module `Map` keyed by text, font and size. A unit test shows
     the same key returns the same grid and that no state carries across frames.
  6. Timing functions match the file's Motion table and are unit tested as pure functions of `f`
     (no render needed): `f=0` every dot at `rad 0.12`; on-cell start `t0 = round(24*c/cols)` and
     radius `0.12 + 0.34*arriveN(f-t0, 0.3, 6)`; hold drift `1 + 0.0013*(f-30)` for `f` 30 to 59;
     panel dots grow to `0.75` on `Easing.bezier(0.85,0,0.15,1)` over `f` 60 to 89, off-cell colour
     `muted` 30% to `ink` and outside dots to 0 on the same curve; `f=90` solid `ink` panel with
     `brand.radius` corners, headline knocked out in the ground colour at the same position and
     size; hold drift from `f=90`.
  7. The file's Acceptance stills hold as tests on layout and timing: `f=0` all dots equal;
     `f=30` headline readable as dot-matrix (on cells larger than off cells); `f=75` panel dots
     part-merged and outside dots shrinking; `f=89` no ground showing inside the panel (radius
     covers the cell); `f=90` glyph shape and position equal to `f=89`.
  8. Copy that does not fit in one line, or glyphs under 7 cells tall, throws a layout error
     naming the scene and text id (README "Fit or fail"). Type is never below `capS`.
  9. Entry T3 and exit T3 / T5 chapter are supported as the file's Transitions table says; the
     scene does not step on twos.
  10. A test over `f` 0 to 107 asserts the scene is a pure function of `f`: no timers,
      `Math.random()` or wall-clock (`CLAUDE.md`).
  11. Frame numbers come from `sceneFrames` or `toFrame`; no `seconds * fps` anywhere (`CLAUDE.md`).
  12. `lint` (Biome), `typecheck` and `test` pass for the workspace on the branch that lands on `dev`.

Out of scope: any other scene (including `iso-chain` and re-doing built scenes); Researcher, render
service, Director, Art Director, Quality Check and the pipeline joining them; the customer
dashboard; a rendered acceptance-still run by Quality Check; any change to `main`.

UI: no. This is a Remotion scene template with no web page or dashboard screen, so there is no
`DESIGN` card.

Data and claims: nothing is stored. Copy and any number come only from `scene.text`, and any number
in the headline must cite a claim whose verbatim `quote` contains it (`CLAUDE.md`). Every parameter
and its evidence tag is in `cell-type.md` and `docs/motion/reference-spec.md`; this spec adds no
number of its own.

Open questions:
  1. Scene length. The file gives 108 frames and says nothing for a longer `dur`. Proposed default:
     hold the last state with the drift running, and flag it in the PR.
  2. Pitch wording. The file says `p = 27` px and "H / 40 at 16:9, S / 40 elsewhere"; at 16:9
     H = S = 1080, so both give 27. Build with `S / 40`.
  3. Canvas sampling in tests. The file samples an offscreen canvas, which unit tests may not
     have. Proposed: put the sampler behind a small function so tests inject a fixed grid; the
     real canvas path is checked by the typecheck and a render by Quality Check, not by this slug.
  4. Panel clipping. At 9:16 the headline is 0.86 W wide, so the 2-cell padding may leave the
     frame by the file's own numbers. Proposed: clamp the panel to the grid and flag in the PR.
  5. Budget. Effort is L; the DIR sets $5 for the slug, and neither earlier slug reported a cost
     overrun. The engineering lead comments on the BUILD card early if it will not hold; a FOUNDER
     card raises it.
  6. SHIP chain. The DIR asks that SHIP is blocked only by the last MERGE card, to avoid the
     deadlock on `crd_haq4jzsx2hx9m3kbyp8m2jy8cx`. Engineering owns the card plan.
