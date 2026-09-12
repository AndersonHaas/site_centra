// Temporary local route exercises the real portfolio component with existing
// photos. It never changes the production data source or needs remote data.
import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdir, writeFile, unlink, rmdir } from 'node:fs/promises';

const routeDir = 'app/[locale]/responsive-qa';
await mkdir(routeDir);
const source = `import { Portfolio } from '@/components/sections/Portfolio';
import { Navbar } from '@/components/sections/Navbar';
import { setRequestLocale } from 'next-intl/server';
import type { Market } from '@/lib/group/market';
export default async function Page({params}: {params: Promise<{locale: Market}>}) {
 const {locale} = await params; setRequestLocale(locale);
 const base = {cidade:'', uf:'', detalhes:'', status:'finalizado' as const};
 return <><Navbar market={locale}/><main className="pt-[70px]"><Portfolio projects={[
 {...base,slug:'br',client:'C.Vale',title:'Obra de teste Brasil',country:'BR',images:['/images/portfolio/cvale-obra-285-cd-1.jpg','/images/portfolio/cvale-obra-285-cd-2.jpg','/images/portfolio/cvale-obra-285-cd-3.jpg']},
 {...base,slug:'py',client:'Cliente de teste com nome longo',title:'Obra de teste Paraguay',country:'PY',images:['/images/portfolio/copacol-silo-jesuitas-1.jpg']}
 ]}/></main></>;
}`;
let browser;
const results = [];
try {
  await writeFile(`${routeDir}/page.tsx`, source);
  browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  for (const market of ['br', 'py']) {
    const page = await browser.newPage({ viewport: { width: 320, height: 740 }, reducedMotion: 'reduce' });
    await page.goto(`http://127.0.0.1:3000/${market}/responsive-qa`, { waitUntil: 'networkidle' });
    const cards = page.locator('main button.group');
    assert.equal(await cards.count(), 2);
    const country = page.locator('[data-portfolio-filters] [role=group]').nth(1);
    await country.locator('button').nth(1).click();
    assert.equal(await cards.count(), 1);
    assert.equal(await country.locator('button').nth(1).getAttribute('aria-pressed'), 'true');
    await page.locator('[data-portfolio-filters] [role=group]').first().locator('button').nth(2).click();
    assert.equal(await cards.count(), 0);
    await page.locator('main [role=status]').waitFor();
    await page.locator('[data-portfolio-filters] [role=group]').first().locator('button').first().click();
    await cards.first().click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    await page.waitForFunction(() =>
      [...document.querySelectorAll('[role="dialog"] img')].length === 3 &&
      [...document.querySelectorAll('[role="dialog"] img')].every((image) =>
        image.complete && image.naturalWidth > 0,
      ),
    );
    await page.keyboard.press('ArrowRight');
    assert((await dialog.innerText()).includes('02 / 03'));
    await page.keyboard.press('ArrowLeft');
    assert((await dialog.innerText()).includes('01 / 03'));
    await page.setViewportSize({ width: 844, height: 390 });
    for (const button of await dialog.locator('button').all()) {
      const box = await button.boundingBox();
      assert(box && box.width >= 44 && box.height >= 44 && box.y >= 0 && box.y + box.height <= 390);
    }
    await page.screenshot({ path: `artifacts/responsive/${market}-gallery-landscape.png` });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    assert(await page.evaluate(() => Boolean(document.activeElement.closest('[role=dialog]'))));
    await page.keyboard.press('Escape');
    assert(await cards.first().evaluate(el => el === document.activeElement));
    assert.equal(await page.locator('body').evaluate(el => el.style.overflow), '');
    results.push(`${market}: combined filters, empty state, gallery arrows, landscape controls, focus trap/restore`);
    console.log(results.at(-1));
    await page.close();
  }
} finally {
  await browser?.close();
  await unlink(`${routeDir}/page.tsx`);
  await rmdir(routeDir);
  await writeFile('artifacts/responsive/gallery.json', JSON.stringify(results, null, 2));
}
