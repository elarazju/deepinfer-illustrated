import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';

const base = process.env.PREVIEW_URL ?? 'https://elarazju.github.io/deepinfer-illustrated/';
const browser = await chromium.launch({ channel: 'chrome' });
const results: object[] = [];
try {
  for (const [lang, theme, width] of [['zh', 'light', 1280], ['en', 'dark', 375]] as const) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(`${base}?lang=${lang}&theme=${theme}`, { waitUntil: 'networkidle' });
    assert.equal(response?.status(), 200);
    assert.equal(await page.locator('.chapter').count(), 8);
    assert.equal(await page.locator('#decode-lab #dspark').count(), 1);
    assert.equal(await page.locator('#experts #dspark').count(), 0);
    assert(await page.locator('#model .tutorial-opening').isVisible());
    assert.equal(await page.locator('#model .tutorial-opening .inference-label, #model .tutorial-body .inference-label').count(),4);
    const manifestResponse=await page.request.get(`${base}figures/manifest.json`);
    assert.equal(manifestResponse.status(),200);
    const manifest=await manifestResponse.json();
    assert.equal(Object.keys(manifest.files).length,72);
    if(process.env.CHECK_COMMIT) assert.equal(manifest.commit,process.env.CHECK_COMMIT);
    assert.equal(await page.locator('html').getAttribute('lang'), lang === 'zh' ? 'zh-CN' : 'en');
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const confidence = page.locator('#dspark input[type=range]').first();
    await confidence.focus();
    await page.keyboard.press('Home');
    assert.equal(await confidence.inputValue(), '0');
    assert((await page.locator('#dspark .metrics strong').first().innerText()).startsWith('0'));
    const links = await page.locator('a[download]').evaluateAll(nodes =>
      [...new Set(nodes.map(node => (node as HTMLAnchorElement).href))]);
    assert(links.length >= 18);
    for (const url of links) {
      assert(url.startsWith(base), `Download escapes project base: ${url}`);
      const asset = await page.request.get(url);
      assert.equal(asset.status(), 200, url);
      const body = await asset.body();
      assert.equal(createHash('sha256').update(body).digest('hex'),manifest.files[url.split('/').at(-1)!],`Published image does not match its build: ${url}`);
      if (url.endsWith('.svg')) assert(body.toString().includes('<svg'), url);
      if (url.endsWith('.png')) assert.equal(body.subarray(1, 4).toString(), 'PNG', url);
    }
    assert.deepEqual(errors, []);
    results.push({ lang, theme, width, status: 'passed', downloads: links.length, exportCommit:manifest.commit, errors });
    await page.close();
  }
  await fs.writeFile('research/published-results.json', JSON.stringify({
    base, checkedAt: new Date().toISOString(), results
  }, null, 2));
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
}
