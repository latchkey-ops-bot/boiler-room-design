# eval-lbsh0m-cell-type
Direction: DIR card on the practice board
Problem: the long film has no Cell World set piece, so films whose site has a grid aesthetic fall back to a generic card.
Acceptance criteria:
  1. A cell-type template in packages/motion renders the dot lattice, the dot-matrix headline and the solid panel, per docs/motion/scenes/cell-type.md on dev of the code repo.
  2. Its registry entry matches the spec's table: kind setpiece, text { headline: 16 }, anchor panel, prop accent.
  3. Tests cover the grid size in 16:9, 9:16 and 1:1, the panel padding of 2 cells snapped to whole cells, and that the scene is a pure function of frame.
  4. pnpm lint, pnpm typecheck and pnpm test pass.
Out of scope: iso-chain, sound design.
UI: no
Data and claims: the headline comes from scene.text; no numbers are shown.
Open questions: none.

## The scene spec, from docs/motion/scenes/cell-type.md

# `cell-type`

**Kind** setpiece. **Effort** L. **Asset tier** none. **Refs** ref D, ref G.

## Purpose

A Cell World set piece. A dot lattice fills the frame, a short line of type grows out of it as
dot-matrix glyphs, then the dots around the type merge into a solid panel and the type flips to
solid glyphs (the cell threshold: the glyph shape persists, the render state changes) [M ref D
lattice-to-window].

108 frames, Long row 17, as the alternative to `iso-chain` [D]. One set piece per film [N].

## Registry entry

| Field     | Value                                     | Tag |
| --------- | ----------------------------------------- | --- |
| `kind`    | `setpiece`                                | [D] |
| `ground`  | Neutral Cut `base`, Kinetic Plate `plate` | [N] |
| `text`    | `{ headline: 16 }`                        | [N] |
| `anchors` | `panel`: the panel box                    | [N] |
| `props`   | `accent?`                                 | [D] |

## Text and assets

| Input           | Required | Limit                                                                                                |
| --------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `headline` text | yes      | 1 to 3 words, 16 characters, one line. Glyphs must be at least 7 cells tall, so it renders at `capD` |
| Assets          | none     |                                                                                                      |

## Layout

Grid pitch `p = 27` px (H / 40 at 16:9, S / 40 elsewhere). Dot centres at
`((c + 0.5) * p, (r + 0.5) * p)` [N].

|       | 16:9                                                                                            | 9:16                            | 1:1                   | Tag |
| ----- | ----------------------------------------------------------------------------------------------- | ------------------------------- | --------------------- | --- |
| Grid  | 71 x 40 cells                                                                                   | 40 x 71 cells                   | 40 x 40 cells         | [N] |
| Text  | `capD`, font size `Math.min(capDerivedSize, fitText({withinWidth: 0.8 * W}).fontSize)`, centred | width 0.86 W, centred at 0.45 H | width 0.80 W, centred | [N] |
| Panel | the text's ink box padded by 2 cells on every side, snapped to whole cells                      | same                            | same                  | [N] |
| Dots  | on cells in `ink`, off cells in `muted` at 30%                                                  |                                 |                       | [N] |

**Sampling [D].** Render the headline once to an offscreen canvas at the grid's size and read the
alpha at each dot centre: a cell is on when alpha is 0.5 or more. Memoise the on/off grid in a
module `Map` keyed by text, font and size, so it is a pure cache and not state carried across
frames.

## Motion

Dot radius `rad` is in units of `p`. Radius 0.71 covers a cell corner to corner, so dots merge.

| Phase              | Frames        | Motion                                                                                                                                                                                                                            | Tag                                                                 |
| ------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Lattice            | `f = 0`       | Every dot at `rad = 0.12`. The frame is not blank                                                                                                                                                   
