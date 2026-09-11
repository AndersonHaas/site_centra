import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';

const phase = process.argv[2] || 'after';
const root = `artifacts/responsive/${phase}`;
await mkdir(root, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const allRoutes = ['/br', '/py', ...['br', 'py'].flatMap(m => ['sobre', 'portfolio', 'aviso-legal'].map(p => `/${m}/${p}`)), ...['pre-moldados', 'metalurgica', 'guindastes'].map(p => `/br/${p}`)];
const routes = process.argv[3] === 'home' ? allRoutes.slice(0, 2) : allRoutes;
const viewports = [[320, 740], [375, 812], [390, 844], [430, 932], [768, 1024], [1024, 900], [1440, 960], [844, 390]];
const results = [];
try {
  for (const [width, height] of viewports) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', isMobile: width < 1024, hasTouch: width < 1024 });
    const page = await context.newPage();
    for (const route of routes) {
      await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      // Reveal every section before recording the full-page layout.
      await page.evaluate(async () => {
        const delay = ms => new Promise(r => setTimeout(r, ms));
        for (let y = 0; y < document.body.scrollHeight; y += innerHeight * .75) { window.scrollTo({ top: y, behavior: 'instant' }); await delay(60); }
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
      await page.waitForTimeout(700);
      const metrics = await page.evaluate(() => ({
        width: innerWidth, documentWidth: document.documentElement.scrollWidth,
        overflow: [...document.querySelectorAll('main *, header *, footer *')].filter(el => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1) && getComputedStyle(el).visibility !== 'hidden' && !el.closest('[data-allow-overflow]');
        }).slice(0, 20).map(el => ({ tag: el.tagName, text: el.textContent?.slice(0, 70), class: el.className?.baseVal ?? el.className })),
      }));
      results.push({ route, width, height, ...metrics });
      await page.screenshot({ path: `${root}/${route.slice(1).replaceAll('/', '-')}-${width}x${height}.png`, fullPage: true });
      console.log(`${phase} ${route} ${width}x${height}: document ${metrics.documentWidth}, overflow ${metrics.overflow.length}`);
    }
    await context.close();
  }
} finally {
  await writeFile(`${root}/metrics.json`, JSON.stringify(results, null, 2));
  await browser.close();
}
