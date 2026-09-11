import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';

const root = 'artifacts/responsive';
await mkdir(root, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const results = [];
const record = name => { results.push(name); console.log(`PASS ${name}`); };
try {
  for (const market of ['br', 'py']) {
    const context = await browser.newContext({ viewport: { width: 320, height: 740 }, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:3000/${market}`, { waitUntil: 'networkidle' });
    const toggle = page.locator('button[aria-controls="mobile-menu"]');
    await toggle.click();
    assert.equal(await page.locator('body').evaluate(el => el.style.overflow), 'hidden');
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      assert(await page.evaluate(() => Boolean(document.activeElement.closest('header'))));
    }
    await page.keyboard.press('Escape');
    assert(await toggle.evaluate(el => el === document.activeElement));
    assert.equal(await page.locator('body').evaluate(el => el.style.overflow), '');
    await toggle.click();
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.waitForTimeout(400);
    assert.equal(await page.locator('body').evaluate(el => el.style.overflow), '');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    record(`${market}: menu focus, Escape and resize restore scroll`);
    await page.setViewportSize({ width: 844, height: 240 });
    await toggle.click();
    assert(await page.locator('#mobile-menu').evaluate(el => el.scrollHeight > el.clientHeight));
    await page.locator('#mobile-menu a').last().focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(600);
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    record(`${market}: short landscape menu scrolls and contact closes menu`);
    await page.setViewportSize({ width: 390, height: 844 });
    const contacts = await page.locator('#contato a').evaluateAll(els => els.map(el => el.getAttribute('href')));
    assert(contacts.some(h => h.startsWith('mailto:')));
    assert(contacts.some(h => h.startsWith('https://wa.me/')));
    assert.equal(await page.locator('#fundacao canvas').count(), 0);
    assert.equal(await page.locator('#fundacao h3').count(), 3);
    assert.equal(await page.locator('html').evaluate(el => el.classList.contains('lenis')), false);
    record(`${market}: mobile native scrolling, all foundation stages and contact destinations`);

    let response = { status: 500, body: { error: 'send_failed' } };
    let requests = 0;
    await page.route('**/api/contato', async route => {
      requests++;
      await new Promise(r => setTimeout(r, 250));
      if (response.abort) return route.abort();
      await route.fulfill({ status: response.status, contentType: 'application/json', body: JSON.stringify(response.body) });
    });
    const submit = page.locator('#contato button[type=submit]');
    await submit.click();
    assert.equal(await page.locator('#contato [aria-invalid=true]').count(), 2);
    assert.equal(requests, 0);
    await page.locator('#nome').fill('Teste local');
    await page.locator('#email').fill('teste@example.com');
    assert.equal(await page.locator('#email').evaluate(el => getComputedStyle(el).fontSize), '16px');
    await submit.click();
    assert(await submit.isDisabled());
    await page.locator('#contato [role=alert]').waitFor();
    response = { status: 400, body: { fieldErrors: { email: 'email_invalid' } } };
    await submit.click();
    await page.locator('#email[aria-invalid=true]').waitFor();
    response = { abort: true };
    await submit.click();
    await page.locator('#contato [role=alert]').waitFor();
    response = { status: 200, body: { ok: true } };
    await submit.click();
    await page.locator('#contato h3').waitFor();
    record(`${market}: form validation, sending, server field error, failure, network failure and success (intercepted)`);

    await page.goto(`http://127.0.0.1:3000/${market}/sobre`);
    const other = market === 'br' ? 'py' : 'br';
    await page.locator(`header div.lg\\:hidden a[hreflang="${other === 'py' ? 'es-PY' : 'pt-BR'}"]`).click();
    await page.waitForURL(`**/${other}/sobre`);
    record(`${market}: market switching preserves shared route`);
    await context.close();
  }
} finally {
  await browser.close();
  await writeFile(`${root}/interactions.json`, JSON.stringify(results, null, 2));
}
