# eval-lbce9v1-status-relay
Direction: DIR card on the practice board
Problem: the film has no status-relay scene, so a product whose page shows a live status falls back to a generic card.
Acceptance criteria:
  1. Pure layout and timing functions for the status-relay scene in packages/motion/src/scenes/status-relay-layout.ts, per docs/motion/scenes/status-relay.md on dev of the code repo, with unit tests of the scene file's acceptance stills on those functions.
  2. A status-relay component in packages/motion/src/scenes/status-relay.tsx that draws the scene with those functions (no duplicated numbers), registered in sceneImplementations as 'status-relay'.
  3. Tests that the scene is a pure function of frame, and that the registry entry matches the scene file.
  4. pnpm lint, pnpm typecheck and pnpm test pass.
Build order: two pull requests. The first adds the layout and timing functions and their tests. The second adds the component and its registry entry, and imports the first one's functions, so it cannot start until the first is merged into dev.
Out of scope: sound design.
UI: no
Data and claims: the headline and labels come from scene.text; no numbers are shown.
Open questions: none.

## The scene spec, from docs/motion/scenes/status-relay.md

# `status-relay`

**Kind** product. **Effort** L. **Asset tier** 4. **Refs** ref C, ref D.

## Purpose

How it works, without fake UI. One persistent actor and one status line. The line rewrites itself
word by word around the fixed actor, and abstract chips run along a rail into the actor. The
narrator is the continuity [M ref C text relay].

60 frames, three in a row in Long (rows 9 to 11) [D]. As the Standard substitute for a proof row it
takes that row's 96 frames, and holds its final state from `f = 60` [N].

## Registry entry

| Field     | Value                                                                                                                             | Tag |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- | --- |
| `kind`    | `product`                                                                                                                         | [D] |
| `ground`  | Neutral Cut `base`, Kinetic Plate `plate`                                                                                         | [N] |
| `text`    | `{ headline: 40, label: 12 }`                                                                                                     | [N] |
| `anchors` | `actor`: the actor box, identical on every card. `status`: the line's slot. Entry `{axis: 'x', sign: 1, v: 46}` on the first card | [N] |
| `props`   | `accent?`                                                                                                                         | [D] |

## Text and assets

| Input           | Required      | Limit                                                                                                                  |
| --------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `headline` text | yes           | The status line, 2 to 6 words, 40 characters, one line. Rendered at `capS`, never as small text carrying the story [D] |
| `label` text    | no, up to 3   | One per chip, 2 words, 12 characters. Without labels the chips are greeked                                             |
| Actor           | none required | A CSS-drawn rounded square in the accent. An SVG from `assetIds[0]` (captured, or generated and labelled) replaces it  |

Tier 4 rules apply: chips and panels are abstract, greeked by default, with no numerals unless a
label cites a claim [D rule 2]. The scene must be visible to the customer at script approval [D].

## Layout

|             | 16:9                                                                                            | 9:16                                                | 1:1                                  | Tag                       |
| ----------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------ | ------------------------- |
| Actor       | 151 px square (0.14 H), centred at (0.30 W, 0.50 H)                                             | centred at (0.50 W, 0.38 H)                         | centred at (0.50 W, 0.36 H)          | [N]                       |
| Status line | `capS`, left-aligned from 0.38 W, vertically centred on the actor, max 0.57 W                   | centred, baseline 0.52 H, box 929 px                | centred, baseline 0.60 H, box 864 px | [N]; [M] 0.65 W cap holds |
| Rail        | 2 px `muted` line from the left frame edge to the actor's left side, on the actor's centre line | vertical, from the top edge to the actor's top side | horizontal, as 16:9                  | [N]                       |
| Chips       | pill 120 x 40 px, `muted` at 40%, label in the body family at 22 px when given                  | same                                                | same                                 | [N
