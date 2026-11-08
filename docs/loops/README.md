# The two loops

Two animated diagrams of how Boiler Room works, made for presenting. Open either page by
double-clicking it; it needs no server or install. Each page links to the other.

| Page | The loop |
| --- | --- |
| [`production-loop.html`](production-loop.html) | **Making the film.** A URL goes through the production crew: Researcher, Director, the Validator, the founder's approval, Art Director, render, Quality Check and Account Manager. The Validator sends one made-up number back to the Director on the way. |
| [`company-loop.html`](company-loop.html) | **Running the company.** The CEO agent sets a goal on the board, Product writes the spec, Design draws it, the engineering lead plans it, engineers build it, the lead ships it to staging, the CEO checks it, and the lead releases it to production. |

Both are drawn from the design system: its tokens, components, Boyle and pixel icons.

## Presenting

The pages play on their own and loop. The stage is 1600 by 900 and scales to fit any screen.

| Key | Does |
| --- | --- |
| Right arrow | Next step, animated |
| Left arrow | Previous step |
| Space | Pause or play |
| S | Show or hide the Live, Building and Planned badges |
| F | Full screen |

Leave the badges on for judges: they show what runs today and what is still being built. They
were set from the system map's data on 2026-11-08, so update them in each page when a step goes
live.

## How it works

`loops.js` builds the stage from the stations, pipes and steps each page passes to `BRLoop`, and
`loops.css` styles it. Like the films, the whole picture is a pure function of the frame number at
12 frames a second, so stepping and replaying land on the same picture every time.

To change a step, edit its entry in the page's `steps` list: where the packet goes (`to`), what it
carries (`carry`), the badge the station shows (`verdict`) and the caption (`title`, `text`). A
`via` names a send-back pipe to travel instead of the main line.
