# scene-library-second-scene
Direction: crd_n8grqvytkxznbstv16b4ksyban

Scene named: `rail-words`, row 12 of `docs/motion/scenes/README.md` on `boiler-room` `dev`. Its spec
file is `docs/motion/scenes/rail-words.md`, and that file is the source of every frame, pixel and
tag value below. Do not copy values from here: read that file.

Why this scene: the DIR says to take the next unbuilt scene in README order and skip `status-relay`
(row 11, built under `scene-library-first-scene`). On `dev`, `packages/motion/src/scenes/` holds
files for rows 1 to 10 and 13, and `scenes/registry.ts` has no `rail-words` or `status-relay`
entry. Rows 1 to 10 and 13 are built, row 11 is taken, so row 12 `rail-words` is the first unbuilt
row. `packages/schema` `sceneRegistry` already lists it with `{ text: { headline: 14, subhead: 14 } }`.
Preconditions checked on `dev`: `packages/motion` and `docs/motion/scenes` both exist.

Problem: Films from the Director cannot use the Long template's breadth rows (README: `rail-words`,
"Used in templates: Long", two in a row, rows 15 and 16 of that template). The registry validates the
type but no template draws it, so such a film cannot render (`IMPLEMENTED_SCENE_TYPES` omits it).

Acceptance criteria:
  1. `packages/motion/src/scenes/rail-words.tsx` exists and is registered in `sceneImplementations`
     as `'rail-words'`; `IMPLEMENTED_SCENE_TYPES` includes it, and the existing registry test still
     passes, including the check that the motion registry's validator view equals the schema
     `sceneRegistry`.
  2. Registry values equal the file's Registry entry: `kind: 'product'`, ground `base` for Neutral
     Cut and `plate` for Kinetic Plate, `text {headline: 14, subhead: 14}`, anchor `rails` (the top
     rail) with entry and exit `{axis: 'x', sign: -1, v: 46}`, props `accent?`.
  3. Every visible word comes from `scene.text` (`headline` on the top rail, `subhead` on the bottom
     rail, each 1 or 2 words). No copy and no numeral comes from `scene.props`. Without a centre
     asset the centre element is a greeked panel of grey bars with no numerals.
  4. The file's Acceptance stills all hold, as unit tests on the layout and timing functions (no
     render needed): `f=0` both words on screen moving in opposite directions at 46 px/f; `f=22`
     each rail word wholly inside the safe area, centred, at display size; every `f` 14 to 34 both
     words wholly inside the safe area; `f=40` centre element at rest in the band with one rim lit;
     glyph scale 1 on every frame.
  5. Motion functions match the file: `v(f) = 6 + 40 * 0.72 ** f`, `D(f)` as written there, top rail
     moving left and bottom rail moving right, both centred at `f=22`. The centre element enters from
     `+0.3 W` with `arriveN(f, 0.72, 14)` then drifts left at 7.8 px/f. A test asserts `v(0)` is 46
     and `v(f)` tends to 6.
  6. Blur only while a rail moves faster than 30 px/f, horizontal, `0.08 * capD`, on type only.
  7. T1 exit: `seamOut` on both rails for `f` 52 to 62, top `-1`, bottom `+1`, on top of the cruise.
  8. A test over `f` 0 to 62 asserts the scene is a pure function of `f` (same input, same output; no
     timers, no `Math.random()`, no wall-clock), per `CLAUDE.md`.
  9. Layout for 16:9, 9:16 and 1:1 follows the file's Layout table. Copy that does not fit throws a
     layout error naming the scene and text id (README "Fit or fail"). Type is never below `capS`.
     A word up to 0.8 W wide stays inside the safe area per the file's Bleed check.
  10. Frame numbers come from `sceneFrames` or `toFrame`; no `seconds * fps` anywhere (`CLAUDE.md`).
  11. `lint` (Biome), `typecheck` and `test` pass for the workspace on the branch that lands on `dev`.

Out of scope: any other scene (including `status-relay`, `cell-type`, `iso-chain` and re-doing built
scenes); Researcher, render service, Director, Art Director, Quality Check and the pipeline joining
them; the customer dashboard; a rendered acceptance-still run by Quality Check; any change to `main`.

UI: no. This is a Remotion scene template with no web page or dashboard screen. The only visuals are
the film frames specified in `rail-words.md`, so there is no `DESIGN` card.

Data and claims: nothing is stored. Copy and any number come only from `scene.text`, and any number
in a rail word must cite a claim whose verbatim `quote` contains it (`CLAUDE.md`). Every parameter
value and its evidence tag ([M] [F] [E] [D] [N]) is in `rail-words.md` and
`docs/motion/reference-spec.md`; this spec adds no number of its own, only values copied from the file.

Open questions:
  1. Scene length. The file gives 63 frames and a T1 exit at `f` 52 to 62, and says nothing for a
     longer `dur`. Proposed default for the engineer: hold the last state with the cruise drift
     running, and flag it in the PR. Needs a call if the Director can give it longer.
  2. Asset tier. The file's header says tier 4 but its Text and assets table takes a tier 1 to 3 crop
     as the optional centre element. This spec follows the table. The captured or uploaded asset
     path is optional; the greeked panel alone meets criterion 3.
  3. Budget. Effort is M and the DIR sets $5 for the slug with no prior cost figure. The engineering
     lead should comment on the BUILD card early if it will not hold; a FOUNDER card raises it.
  4. The DIR's "SHIP card is done" step has no procedure in product's skill. This spec leaves it to
     engineering and the CEO. Note the open FOUNDER deadlock card on the first slug's SHIP card.
