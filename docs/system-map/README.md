# Boiler Room system map

One page that shows how Boiler Room works and how much of the company runs without the founder. Open [`index.html`](index.html) by double-clicking it; it needs no server or install.

The page holds what is live right now, both diagrams, the scoreboard, the human boundary and the guard rails. It answers the three questions the judges ask: what did the agents deliver, what decisions did they make, and where did you need to step in?

Most of this is the design, not what runs today. The scoreboard keeps those two apart: "Stages live today" is the real number, "Agent-run stages" is the target.

## Right now

As of 2026-11-07:

- **Live:** Naive account, ElevenLabs account, AgentMail inbox
- **Building:** Validator, Motion library

Click any image below to open it at full size. This first one stays readable at page width; the diagram images carry the same panels above the detail.

![Right now, the scoreboard for the three judge questions, and the key](scoreboard.png)

## Diagram 1: how Boiler Room works

Both ways in feed one ten-step pipeline. The heavy dashed arrows are the two feedback loops. The DECIDE marker on the export arrow is an open question: whether an exported edit passes the Validator first.

![Diagram 1: the ten-step pipeline, the systems it uses, and the two feedback loops](technical.png)

## Diagram 2: how the company runs itself

Eleven stages form a closed loop around the human boundary. Each tab marks a stage where a person acts: the founder, another person or a customer. This image also carries the scoreboard and the guard rails.

![Diagram 2: the scoreboard, the eleven-stage company loop around the human boundary, and the guard rails](autonomy.png)

## Vocabulary

Every part has a status, shown by its border and a labelled chip. Only live parts are drawn with a solid card.

| Status | Meaning | Border |
| --- | --- | --- |
| `live` | Working and verified | Solid |
| `building` | Work in progress | Dashed |
| `planned` | Agreed but not started | Dotted |
| `decide` | A decision is still open | Dash and dot |

Stages, agents and customer steps also have an autonomy level, shown by a left stripe and a labelled tag. Accounts, infrastructure, undecided parts and outputs have none, so they have no stripe. Autonomy is the design, so the stripe stays faint and the tag has no pill until the part is live.

| Autonomy | Meaning | Stripe |
| --- | --- | --- |
| `agent` | Runs with no human | Solid |
| `approval` | Agent does the work, a human approves | Hatched |
| `customer` | The customer acts | Dotted |
| `human` | A person does it | Crossed |

Mark something `live` only once it is working and verified. A connected account is not a working step: the ElevenLabs account is live while the Audio step is still planned.

## Update the map

Everything you need to change is in the `MAP` object at the top of the script in `index.html`.

1. Change the word. For example, when the Validator is merged and verified, change its `status` from `'building'` to `'live'`.
2. Update `lastUpdated`.
3. Reload the page. Borders, chips, the Right now lists, the key and the scoreboard all follow from the data.
4. Update the [Right now](#right-now) lists at the top of this README by hand.
5. [Regenerate the images](#regenerate-the-images) so GitHub shows the same thing.

| To change | Edit in `MAP` |
| --- | --- |
| A status or autonomy level | That node's `status` or `autonomy` |
| Real results (videos, leads, emails, replies) | `counters` |
| Where a person acts | That stage's `person` and `who` (`founder`, `customer` or `person`). Leave `person` out and the tab disappears. |
| What comes next | `next`: part ids in order. It reads "Not set yet" until you add some. |
| An open question | `questions`. Delete one once it is answered and its marks go with it, then change the stage or the drawing to match the answer. |
| The Naive balance, ElevenLabs credits or plan limits | `guardRails` |

Colours are CSS variables on `:root` at the top of the page, with a dark set below them. When the brand is chosen, swap those and nothing else.

To add a node, draw a `<g data-node="your-id">` in the SVG and add an entry with the same `id` to the data. A node with an autonomy level needs `data-show-autonomy` on its drawing; a node with `autonomy: null` must not have it. If the data and the drawings stop matching, or a word is misspelled, the page shows a warning at the top and `render.mjs` refuses to run.

## Regenerate the images

`render.mjs` captures `technical.png`, `autonomy.png` and `scoreboard.png` from the page at 2x scale, always in the light theme. It needs Playwright, which stays outside the repo:

```bash
TOOLS=/tmp/system-map-tools
npm install --prefix "$TOOLS" playwright
"$TOOLS/node_modules/.bin/playwright" install chromium
PLAYWRIGHT_DIR="$TOOLS" node docs/system-map/render.mjs
```

After the first time, you only need the `TOOLS=` line and the last line.
