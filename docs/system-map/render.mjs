#!/usr/bin/env node
// Regenerates technical.png, autonomy.png and scoreboard.png from index.html at 2x scale.
// Usage: PLAYWRIGHT_DIR=/path/to/folder/with/playwright node docs/system-map/render.mjs
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const toolsDir = process.env.PLAYWRIGHT_DIR ?? here;

let chromium;
try {
  ({ chromium } = createRequire(join(toolsDir, 'package.json'))('playwright'));
} catch {
  console.error(`Could not load playwright from ${toolsDir}. See "Regenerate the images" in README.md.`);
  process.exit(1);
}

// Each image captures one view of the page. Light theme, so they read the same on GitHub.
const shots = [
  { file: 'technical.png', view: 'technical', width: 1336 },
  { file: 'autonomy.png', view: 'company', width: 1496 },
  // Stays readable inline on GitHub. Wider than the page's 900px breakpoint, to keep the columns.
  { file: 'scoreboard.png', view: 'scoreboard', width: 920 },
];

const browser = await chromium.launch();
try {
  for (const { file, view, width } of shots) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      deviceScaleFactor: 2,
      colorScheme: 'light',
    });
    await page.goto(pathToFileURL(join(here, 'index.html')).href);
    await page.evaluate(() => document.fonts.ready);

    const problems = page.locator('#map-problems');
    if (await problems.isVisible()) throw new Error(await problems.textContent());

    await page.evaluate(value => { document.documentElement.dataset.view = value; }, view);
    await page.screenshot({ path: join(here, file), fullPage: true });
    await page.close();
    console.log(`Wrote ${file}`);
  }
} finally {
  await browser.close();
}
