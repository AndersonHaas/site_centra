import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const results = [];
try {
  for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 960 }, hasTouch: width < 1024, isMobile: width < 1024 });
    await context.addInitScript(() => {
      window.layoutShifts = [];
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.layoutShifts.push(entry.value);
      }).observe({ type: 'layout-shift', buffered: true });
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto('http://127.0.0.1:3000/br', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(700);
    const hero = await page.locator('.hero-totem').evaluate(el => ({
      naturalWidth: el.naturalWidth, naturalHeight: el.naturalHeight,
      width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height,
      src: el.currentSrc, sizes: el.sizes, transform: getComputedStyle(el).transform,
    }));
    assert.equal(hero.transform, 'none');
    assert(hero.src.includes('/_next/image?'));
    if (width < 1024) {
      assert.equal(await page.locator('.hero-photo').evaluate(el => getComputedStyle(el).position), 'absolute');
      assert.equal(await page.locator('.hero-atmosphere').evaluate(el => getComputedStyle(el).display), 'block');
      assert.equal(await page.locator('canvas').count(), 0);
      assert.equal(await page.locator('#fundacao li').count(), 3);
      assert.equal(await page.locator('html.lenis').count(), 0);
    } else {
      await page.locator('#fundacao canvas').waitFor();
      assert.equal(await page.locator('html.lenis').count(), 1);
    }
    const cls = await page.evaluate(() => window.layoutShifts.reduce((a, b) => a + b, 0));
    assert(cls < .1, `CLS ${cls} at ${width}`);
    assert.deepEqual(errors, [], `Browser errors at ${width}`);
    await page.locator('.hero').screenshot({ path: `artifacts/responsive/hero-${width}.png` });
    if (width === 1440) {
      await page.evaluate(() => {
        const el = document.querySelector('#fundacao');
        const y = el.getBoundingClientRect().top + scrollY;
        window.scrollTo({ top: y + innerHeight * .4, behavior: 'instant' });
      });
      await page.waitForTimeout(1200);
      await page.screenshot({ path: 'artifacts/responsive/foundation-desktop.png' });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForTimeout(300);
      assert.equal(await page.locator('#fundacao canvas').count(), 0);
      assert.equal(await page.locator('#fundacao li').count(), 3);
      assert.equal(await page.locator('html.lenis').count(), 0);
    }
    results.push({ width, cls, hero, errors });
    console.log(`PASS ${width}: images, motion, hydration; CLS ${cls.toFixed(4)}`);
    await context.close();
  }
} finally {
  await browser.close();
  await writeFile('artifacts/responsive/runtime.json', JSON.stringify(results, null, 2));
}
