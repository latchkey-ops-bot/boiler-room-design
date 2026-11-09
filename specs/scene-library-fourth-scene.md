# scene-library-fourth-scene
Direction: crd_vz8gmh04j7njwgvp338tc380rr

Scene named: `iso-chain`, row 15 of `docs/motion/scenes/README.md` on `boiler-room` `dev`. Its spec
file is `docs/motion/scenes/iso-chain.md`, and that file is the source of every frame, pixel, angle
and tag value below. Do not copy values from here: read that file.

Why this scene: the DIR says to take the next unbuilt scene in README order. On `dev`,
`packages/motion/src/scenes/` holds files for rows 1 to 14 (`status-relay`, `rail-words` and
`cell-type` included) and has no `iso-chain` file. Row 15 is the only unbuilt row.
`packages/schema` `sceneRegistry` already lists it as `{ text: { headline: 32, label: 16 } }`.
Preconditions checked on `dev`: `packages/motion` and `docs/motion/scenes` both exist.

Problem: the Long template's set-piece row (README row 17: `cell-type` or `iso-chain`) has one
drawable alternative. A Long film that picks `iso-chain`, the Cell World projection morph, cannot
render, because the registry validates the type but no template draws it.

Acceptance criteria:
  1. `packages/motion/src/scenes/iso-chain.tsx` exists and is registered in `sceneImplementations`
     as `'iso-chain'`; `IMPLEMENTED_SCENE_TYPES` includes it; the existing registry test still
     passes, including the check that the motion registry's validator view equals the schema
     `sceneRegistry`.
  2. Registry values equal the file's Registry entry: `kind: 'setpiece'`, ground `base` for Neutral
     Cut and `plate` for Kinetic Plate, `text {headline: 32, label: 16}`, anchor `chain` (the
     chain's box), props `count?` (3 | 4 | 5, default 3), `hero?` (default the middle object),
     `hues?` (one categorical hue index per object).
  3. Every visible word comes from `scene.text` (`headline`: 5 words, 32 characters; `label`: up to
     3 items, 2 words, 16 characters each). No copy and no numeral comes from `scene.props`.
  4. Layout follows the file's Layout table for 16:9, 9:16 and 1:1: object count cap (5 / 3 / 4),
     side, gap, centre, headline baseline and label size as the table states. Projection is
     orthographic: no `perspective` on the chain container.
  5. Tones: every cube has exactly three solid tones (top = the object's hue, left = black 12%,
     right = black 24% in OKLCH mix), with no gradient and no lighting. Tested on the colour values
     the component computes.
  6. Timing functions match the file's Motion table and are unit tested as pure functions of `f`:
     face-on to iso `f` 0 to 25 with `a` 0 to 63.6 deg and `b` 0 to 45 deg on `camera.skew` (nonzero
     slope at `f = 0`); extrude of object `i` from `f = 26 + 4i` over 30 frames on `step`; labels
     from `f = 56 + 4i` with `wordRise(f - start, j, 1, 26, 0.5)`; headline `wordRise(f - 6, j, 1,
     72, 0.75)`; open to hex `f` 72 to 97 with `a` 63.6 to 54.7 deg; point aperture `f` 76 to 95
     with radius `faceDiagonal / 2 * arriveN(f - 76, 0.72, 14)`; hold `f` 98 to 107 with
     `rotateZ(45 + 0.05 * (f - 98))`.
  7. The file's Acceptance stills hold as tests on layout and timing: `f=0` flat squares already
     turning; `f=25` angles `rotateX(63.6deg) rotateZ(45deg)`; `f=72` every object fully extruded
     (with `count` 5 the last finishes at `f=72`) in three tones; `f=97` the hero silhouette is a
     regular hexagon (`a` = 54.7 deg); only the hero carries a texture; each label has its swatch
     and each hue keeps one concept.
  8. Hero texture: `assetIds[0]` of `kind: 'image'` is drawn on the hero only; with no asset the
     accent colour fills the aperture. No other object ever carries an image.
  9. Copy that does not fit throws a layout error naming the scene and text id (README "Fit or
     fail"). Headline never below `capS`.
  10. Entry T3 and exit T5 chapter / T3 are supported as the file's Transitions table says; the
      scene does not step on twos; no run of more than 30 frames with MAD below 0.02.
  11. A test over `f` 0 to 107 asserts the scene is a pure function of `f`: no timers,
      `Math.random()` or wall-clock (`CLAUDE.md`).
  12. Frame numbers come from `sceneFrames` or `toFrame`; no `seconds * fps` anywhere (`CLAUDE.md`).
  13. `lint` (Biome), `typecheck` and `test` pass for the workspace on the branch that lands on `dev`.

Out of scope: any other scene or re-doing built scenes; Researcher, render service, Director, Art
Director, Quality Check and the pipeline joining them; the customer dashboard; a rendered
acceptance-still run by Quality Check; any change to `main`.

UI: no. This is a Remotion scene template with no web page or dashboard screen, so there is no
`DESIGN` card.

Data and claims: nothing is stored. Copy comes only from `scene.text`, and any number in it must
cite a claim whose verbatim `quote` contains it (`CLAUDE.md`). Every parameter and its evidence tag
is in `iso-chain.md` and `docs/motion/reference-spec.md`; this spec adds no number of its own.

Open questions:
  1. Scene length. The file gives 108 frames and says nothing for a longer `dur`. Proposed default,
     as for `cell-type`: hold the last state with the hold rotation running, and flag it in the PR.
  2. Hold drift. The file's hold rotation runs `f` 98 to 107 only. Proposed: continue the same
     rate past 107 if `dur` is longer.
  3. Categorical hues. The file derives up to 3 extra hues in OKLCH from `brand.primary` at matched
     lightness. Proposed: reuse the existing brand colour helpers in `packages/motion/src/brand`,
     and take `hues` as an index into that derived list.
  4. Projection in tests. CSS 3D cannot be rendered in a unit test. Proposed: compute angles, face
     tones and boxes in pure functions and test those; the rendered check belongs to Quality Check,
     not this slug.
  5. Budget. Effort is L, as for `cell-type`, which the $5 slug held to. The engineering lead
     comments on the BUILD card early if it will not hold; a FOUNDER card raises it.
  6. SHIP chain. The DIR asks that SHIP is blocked only by the last MERGE card, to avoid the
     deadlock on `crd_haq4jzsx2hx9m3kbyp8m2jy8cx`. Engineering owns the card plan.
