# eval-lpc72m1-scene-library-first-scene
Direction: DIR card on the practice board

Scene named: `status-relay`, row 11 of `docs/motion/scenes/README.md` on `boiler-room` `dev`.
Its spec file is `docs/motion/scenes/status-relay.md`, and that file is the source of every
frame, pixel and tag value below. Do not copy values from here: read that file.

Why this scene and not row 1: the README's build order starts at `type-card`, but on `dev` rows 1 to
10 and 13 already have a scene file in `packages/motion/src/scenes/` and a test in
`packages/motion/test/` (`type-card`, `end-card`, `logo-reveal`, `word-slam`, `site-hero`,
`feature-card`, `proof-bars`, `stat-counter`, `site-scroll`, `tile-wall`, `colour-event`). Rebuilding
a built scene ships nothing. `status-relay` is the first row in README order with no file in
`packages/motion/src/scenes/` and no entry in `scenes/registry.ts`. `packages/schema`
`sceneRegistry` already lists it with `{ text: { headline: 40, label: 12 } }`.

Problem: Films from the Director cannot use the Long template's "how it works" rows (README:
`status-relay`, "Used in templates: Long"), and the Standard template cannot use it as its proof-row
substitute. The registry validates the type but has no template to draw it, so such a film cannot
render (`IMPLEMENTED_SCENE_TYPES` in `scenes/registry.ts` omits it).

Acceptance criteria:
  1. `packages/motion/src/scenes/status-relay.tsx` exists and is registered in
     `sceneImplementations` as `'status-relay'`; `IMPLEMENTED_SCENE_TYPES` includes it, and the
     existing registry test still passes, including the check that the motion registry's validator
     view equals the schema `sceneRegistry`.
  2. Registry values equal the status-relay file's Registry entry: `kind: 'product'`, ground
     `base` for Neutral Cut and `plate` for Kinetic Plate, `text {headline: 40, label: 12}`, anchors
     `actor` and `status` with entry `{axis: 'x', sign: 1, v: 46}` on the first card, props `accent?`.
  3. Every visible word comes from `scene.text` (`headline`, up to 3 `label`s). No copy and no
     numeral comes from `scene.props`. Without labels the chips are greeked and show no numerals.
  4. The status-relay file's Acceptance stills all hold, as unit tests on the layout and timing
     functions (no render needed): `f=0` first card actor moving in on x, later cards ground only on
     `f` 0 and 1; `f=6` actor at the same pixel position as the previous card; `f=12` words at
     different opacities; `f=22` (16 on the first card) the full `headline`, cap height at least
     78 px; `f=50` chips on the rail, first absorbing; `f=59` every chip absorbed; `f=dur-1`
     content present.
  5. A test over `f` 0 to 59 asserts the scene is a pure function of `f` (same input, same output; no
     timers, no `Math.random()`, no wall-clock), per `CLAUDE.md`.
  6. At most 3 chips: the third arrives at `f=54` and is absorbed by `f=59`. Chip `c` starts at
     `f=16+4c`, travels 30 frames on `Easing.bezier(0.85, 0, 0.15, 1)`.
  7. Hold: when `dur` is over 60, the scene holds its final state from `f=60` with the shimmer and
     the actor drift still running. Over `f` 0 to `dur-1`, no run of more than 30 frames has MAD
     below 0.02 (frames blank by T5 entry excepted).
  8. Layout for 16:9, 9:16 and 1:1 follows the file's Layout table. Copy that does not fit throws a
     layout error naming the scene and text id (README "Fit or fail"). Type is never below `capS`.
  9. Frame numbers come from `sceneFrames` or `toFrame`; no `seconds * fps` anywhere
     (`CLAUDE.md`).
  10. `lint` (Biome), `typecheck` and `test` pass for the workspace on the branch that lands on
     `dev`.

Build order: two pull requests. The first adds the pure layout and timing functions and their unit tests (criteria 4, 6 and 8). The second adds the component and its registry entry (criteria 1, 2, 3, 5 and 7) and imports the first one's functions, so it cannot start until the first is merged into dev.

Out of scope: any other scene (including `rail-words`, `cell-type`, `iso-chain` and re-doing built
scenes); Researcher, render service, Director, Art Director, Quality Check and the pipeline joining
them; the customer dashboard; T10 conveyor mode (the file reserves it for later); a rendered
acceptance-still run by Quality Check; any change to `main`.

UI: no. This is a Remotion scene template, with no web page or dashboard screen. The only visuals
are the film frames specified in `status-relay.md`, so there is no `DESIGN` card.

Data and claims: nothing is stored. Copy and any number come only from `scene.text`, and any number
in a label must cite a claim whose verbatim `quote` contains it (`CLAUDE.md`). Every parameter value
and its evidence tag ([M] [F] [E] [D] [N]) is in `status-relay.md` and `docs/motion/reference-spec.md`;
this spec adds no number of its own except the counts above, which are copied from that file.

Open questions:
  1. Reading of "first scene". Row 1 `type-card` is already on `dev`; this spec picks the first
     unbuilt row, `status-relay`. If the CEO meant row 1 literally, the DIR is already met by existing
     code and needs only a lint/typecheck/test pass.
  2. Budget. The README marks `status-relay` Effort L, and the DIR sets $5 for the slug. There is no
     prior cost figure, so I cannot say whether $5 holds. The engineering lead should comment on the
     BUILD card early if it will not, and a FOUNDER card is the route to raise it.
  3. The optional SVG actor from `assetIds[0]` (file, Text and assets) needs the asset pipeline. This
     spec requires only the CSS-drawn accent square. The SVG path is left to the lead, as it is optional
     in the file.
  4. The DIR's "SHIP card is done" step has no procedure in product's skill. This spec leaves it to
     engineering and the CEO.
