#!/usr/bin/env node
// Draws every Boiler Room logo and icon from the text grids below, so each shape stays on the
// pixel grid. Edit a grid, then run: node design-system/pixel-art.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

const COLORS = {
  deep: '#086288',
  steel: '#4D8DBA',
  sky: '#97D7FF',
  cream: '#FFEFC4',
  ink: '#0B2E40',
  white: '#FFFFFF',
  pink: '#FF9EB5',
};

/* The mascot: a little boiler with a play-button belly. 24 x 24.
   k outline, b body, l highlight, w white, e eyes and mouth, p blush, c screen. */
const BOILER = [
  '............bb..bb......',
  '...........bwwbbwwb.....',
  '..........bwwwwwwwwb....',
  '..........bwwwwwwwwb....',
  '...........bbbbbbbb.....',
  '........................',
  '............kkkkkk......',
  '.............klbk.......',
  '......kkkkkkkkkkkk......',
  '.....kllbbbbbbbbbbk.....',
  '....klwbwebbbbwebbbk....',
  '....klbbeebbbbeebbbk....',
  '.kkkklppbbebbebbppbk....',
  '.kllklbbbbbeebbbbbbk....',
  '.kkkklbbbbbbbbbbbbbk....',
  '....klbbbkkkkkkkbbbk....',
  '....kbbbbkceccckbbbk....',
  '....kbbbbkceecckbbbk....',
  '....kbbbbkceeeckbbbk....',
  '....kbbbbkceecckbbbk....',
  '.....kbbbkceccckbbk.....',
  '......kkkkkkkkkkkk......',
  '......kbbk....kbbk......',
  '......kkkk....kkkk......',
];

const BOILER_BLINK = BOILER.map((row, y) => (y === 10 ? '....klwbbbbbbbbbbbbk....' : row));

const PALETTE_LIGHT = {
  k: COLORS.deep,
  b: COLORS.steel,
  l: COLORS.sky,
  w: COLORS.white,
  e: COLORS.ink,
  p: COLORS.pink,
  c: COLORS.cream,
};
// On the deep background the deep outline disappears, so it turns to ink.
const PALETTE_ON_DEEP = { ...PALETTE_LIGHT, k: COLORS.ink };

/* A rising puff of steam, for animation. 9 x 6. */
const PUFF = [
  '...bbb...',
  '.bbwwwbb.',
  'bwwwwwwwb',
  'bwwwwwwwb',
  '.bbbbbbb.',
  '.........',
];

/* The wordmark letters. 9 rows: 3 for ascenders, 6 for the x-height. */
const GLYPHS = {
  b: ['##....', '##....', '##....', '#####.', '##..##', '##..##', '##..##', '##..##', '#####.'],
  o: ['......', '......', '......', '.####.', '##..##', '##..##', '##..##', '##..##', '.####.'],
  i: ['..', '##', '..', '##', '##', '##', '##', '##', '##'],
  l: ['##.', '##.', '##.', '##.', '##.', '##.', '##.', '##.', '.##'],
  e: ['......', '......', '......', '.####.', '##..##', '######', '##....', '##....', '.#####'],
  r: ['.....', '.....', '.....', '##.##', '####.', '##...', '##...', '##...', '##...'],
  m: [
    '..........',
    '..........',
    '..........',
    '#########.',
    '##..##..##',
    '##..##..##',
    '##..##..##',
    '##..##..##',
    '##..##..##',
  ],
};

/* Icons. 12 x 12, one colour, drawn in currentColor. */
const ICONS = {
  play: [
    '............',
    '...#........',
    '...##.......',
    '...###......',
    '...####.....',
    '...#####....',
    '...#####....',
    '...####.....',
    '...###......',
    '...##.......',
    '...#........',
    '............',
  ],
  check: [
    '............',
    '..........##',
    '.........###',
    '........###.',
    '.##....###..',
    '.###..###...',
    '..######....',
    '...####.....',
    '....##......',
    '............',
    '............',
    '............',
  ],
  'arrow-right': [
    '............',
    '......#.....',
    '......##....',
    '......###...',
    '......####..',
    '###########.',
    '###########.',
    '......####..',
    '......###...',
    '......##....',
    '......#.....',
    '............',
  ],
  clock: [
    '....####....',
    '..##....##..',
    '.#........#.',
    '.#...#....#.',
    '#....#.....#',
    '#....#.....#',
    '#....####..#',
    '#..........#',
    '.#........#.',
    '.#........#.',
    '..##....##..',
    '....####....',
  ],
  sparkle: [
    '.....#......',
    '.....#......',
    '.....#......',
    '....###.....',
    '...#####....',
    '###########.',
    '...#####....',
    '....###.....',
    '.....#......',
    '.....#......',
    '.....#......',
    '............',
  ],
  mail: [
    '............',
    '............',
    '############',
    '##........##',
    '#.#......#.#',
    '#..#....#..#',
    '#...####...#',
    '#..........#',
    '#..........#',
    '############',
    '............',
    '............',
  ],
  download: [
    '.....##.....',
    '.....##.....',
    '.....##.....',
    '.....##.....',
    '..########..',
    '...######...',
    '....####....',
    '.....##.....',
    '............',
    '#..........#',
    '#..........#',
    '############',
  ],
  search: [
    '..####......',
    '.#....#.....',
    '#......#....',
    '#......#....',
    '#......#....',
    '#......#....',
    '.#....#.....',
    '..####.##...',
    '.......###..',
    '........###.',
    '.........###',
    '..........##',
  ],
  clapper: [
    '............',
    '############',
    '##..##..##.#',
    '############',
    '............',
    '############',
    '#..........#',
    '#..........#',
    '#..........#',
    '#..........#',
    '############',
    '............',
  ],
  shield: [
    '.##########.',
    '.#........#.',
    '.#.....##.#.',
    '.#....##..#.',
    '.#.#.##...#.',
    '.#.###....#.',
    '.#..#.....#.',
    '..#......#..',
    '...#....#...',
    '....#..#....',
    '.....##.....',
    '............',
  ],
  brush: [
    '..........##',
    '.........###',
    '........###.',
    '.......###..',
    '......###...',
    '.....###....',
    '....##......',
    '..###.......',
    '.####.......',
    '.####.......',
    '###.........',
    '##..........',
  ],
  film: [
    '############',
    '#.#......#.#',
    '###......###',
    '#.#......#.#',
    '###......###',
    '#.#......#.#',
    '###......###',
    '#.#......#.#',
    '###......###',
    '#.#......#.#',
    '############',
    '............',
  ],
  note: [
    '....########',
    '....########',
    '....#......#',
    '....#......#',
    '....#......#',
    '....#......#',
    '....#......#',
    '..###....###',
    '.####...####',
    '.####...####',
    '..##.....##.',
    '............',
  ],
  gear: [
    '.....##.....',
    '..##.##.##..',
    '..########..',
    '.###....###.',
    '..##....##..',
    '###......###',
    '###......###',
    '..##....##..',
    '.###....###.',
    '..########..',
    '..##.##.##..',
    '.....##.....',
  ],
  eye: [
    '............',
    '............',
    '....####....',
    '..##....##..',
    '.#...##...#.',
    '#...####...#',
    '.#...##...#.',
    '..##....##..',
    '....####....',
    '............',
    '............',
    '............',
  ],
  user: [
    '....####....',
    '...######...',
    '...######...',
    '...######...',
    '....####....',
    '............',
    '..########..',
    '.##########.',
    '############',
    '############',
    '############',
    '............',
  ],
  warning: [
    '.....##.....',
    '....####....',
    '....#..#....',
    '...##..##...',
    '...#.##.#...',
    '..##.##.##..',
    '..#..##..#..',
    '.##......##.',
    '.#...##...#.',
    '##........##',
    '############',
    '............',
  ],
  globe: [
    '....####....',
    '..##.##.##..',
    '.#..#..#..#.',
    '.#..#..#..#.',
    '############',
    '#...#..#...#',
    '#...#..#...#',
    '############',
    '.#..#..#..#.',
    '.#..#..#..#.',
    '..##.##.##..',
    '....####....',
  ],
  plus: [
    '............',
    '............',
    '.....##.....',
    '.....##.....',
    '.....##.....',
    '..########..',
    '..########..',
    '.....##.....',
    '.....##.....',
    '.....##.....',
    '............',
    '............',
  ],
  cloud: [
    '............',
    '............',
    '............',
    '....###.....',
    '..##...##...',
    '.#.......##.',
    '#..........#',
    '#..........#',
    '.##########.',
    '............',
    '............',
    '............',
  ],
};

/** Merges each row's runs of one colour into a single rect. */
function rects(grid, palette, dx = 0, dy = 0) {
  const out = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const key = row[x];
      if (!(key in palette)) {
        x += 1;
        continue;
      }
      let end = x;
      while (row[end + 1] === key) end += 1;
      out.push(
        `<rect x="${x + dx}" y="${y + dy}" width="${end - x + 1}" height="1" fill="${palette[key]}"/>`,
      );
      x = end + 1;
    }
  });
  return out.join('');
}

function svg(width, height, body, scale, title) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" ` +
    `width="${width * scale}" height="${height * scale}" shape-rendering="crispEdges" role="img">` +
    `<title>${title}</title>${body}</svg>\n`
  );
}

/** Lays letters out on one baseline, with one empty column between letters. */
function word(text) {
  const rows = Array.from({ length: 9 }, () => '');
  [...text].forEach((char, index) => {
    const glyph = char === ' ' ? Array(9).fill('..') : GLYPHS[char];
    if (!glyph) throw new Error(`No glyph for "${char}"`);
    glyph.forEach((line, y) => {
      rows[y] += (index > 0 ? '.' : '') + line;
    });
  });
  return rows;
}

/** A wordmark with its offset shadow. Returns the drawing and its size. */
function wordmark(lines, fill, shadow) {
  const blocks = lines.map(word);
  const width = Math.max(...blocks.map((block) => block[0].length)) + 1;
  const gap = 2;
  const height = blocks.length * 9 + (blocks.length - 1) * gap + 1;
  const body = blocks
    .map((block, index) => {
      const top = index * (9 + gap);
      return rects(block, { '#': shadow }, 1, top + 1) + rects(block, { '#': fill }, 0, top);
    })
    .join('');
  return { width, height, body };
}

const files = {};
const LOGO = 'logo';

files[`${LOGO}/boiler-mark.svg`] = svg(24, 24, rects(BOILER, PALETTE_LIGHT), 4, 'Boiler Room');
files[`${LOGO}/boiler-mark-blink.svg`] = svg(24, 24, rects(BOILER_BLINK, PALETTE_LIGHT), 4, 'Boiler Room');
files[`${LOGO}/boiler-mark-on-deep.svg`] = svg(24, 24, rects(BOILER, PALETTE_ON_DEEP), 4, 'Boiler Room');
files[`${LOGO}/puff.svg`] = svg(9, 6, rects(PUFF, PALETTE_LIGHT), 4, 'Steam');

const lockup = (palette, fill, shadow) => {
  const mark = wordmark(['boiler', 'room'], fill, shadow);
  const gap = 4;
  const top = Math.round((24 - mark.height) / 2);
  const body =
    rects(BOILER, palette) +
    `<g transform="translate(${24 + gap} ${top})">${mark.body}</g>`;
  return svg(24 + gap + mark.width, 24, body, 4, 'Boiler Room');
};

files[`${LOGO}/lockup.svg`] = lockup(PALETTE_LIGHT, COLORS.deep, COLORS.sky);
files[`${LOGO}/lockup-on-deep.svg`] = lockup(PALETTE_ON_DEEP, COLORS.cream, COLORS.ink);

for (const [name, lines, fill, shadow] of [
  ['wordmark', ['boiler room'], COLORS.deep, COLORS.sky],
  ['wordmark-stacked', ['boiler', 'room'], COLORS.deep, COLORS.sky],
  ['wordmark-on-deep', ['boiler room'], COLORS.cream, COLORS.ink],
]) {
  const mark = wordmark(lines, fill, shadow);
  files[`${LOGO}/${name}.svg`] = svg(mark.width, mark.height, mark.body, 4, 'Boiler Room');
}

const iconMarkup = {};
for (const [name, grid] of Object.entries(ICONS)) {
  if (grid.length !== 12 || grid.some((row) => row.length !== 12)) {
    throw new Error(`Icon "${name}" is not 12 x 12`);
  }
  const body = rects(grid, { '#': 'currentColor' });
  iconMarkup[name] =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true">${body}</svg>`;
  files[`icons/${name}.svg`] = `${iconMarkup[name]}\n`;
}

// Lets a static page write <i data-icon="check"></i> and get the inline SVG, even from file://.
files['icons/icons.js'] =
  `// Generated by pixel-art.mjs. Replaces <i data-icon="name"></i> with the inline pixel icon.\n` +
  `window.BR_ICONS = ${JSON.stringify(iconMarkup, null, 2)};\n` +
  `function brIcons(root = document) {\n` +
  `  for (const el of root.querySelectorAll('[data-icon]')) {\n` +
  `    const markup = window.BR_ICONS[el.dataset.icon];\n` +
  `    if (markup) el.innerHTML = markup;\n` +
  `  }\n` +
  `}\n` +
  `document.addEventListener('DOMContentLoaded', () => brIcons());\n`;

for (const [rows, name] of [
  [BOILER, 'BOILER'],
  [PUFF, 'PUFF'],
]) {
  const width = rows[0].length;
  if (rows.some((row) => row.length !== width)) throw new Error(`${name} rows differ in width`);
}

for (const [path, content] of Object.entries(files)) {
  const target = join(here, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}
console.log(`Wrote ${Object.keys(files).length} files`);
