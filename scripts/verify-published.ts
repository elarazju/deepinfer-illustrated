import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import {figureKinds} from '../src/lib/figure-kinds.mjs';
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
    assert.equal(await page.locator('.chapter').count(), 10);
    assert.equal(await page.locator('#decode-lab #dspark').count(), 1);
    assert.equal(await page.locator('#experts #dspark').count(), 0);
    assert(await page.locator('#model .tutorial-opening').isVisible());
    assert((await page.locator('#model .tutorial-opening .inference-label, #model .tutorial-body .inference-label').count())>0);
    const manifestResponse=await page.request.get(`${base}figures/manifest.json`);
    assert.equal(manifestResponse.status(),200);
    const manifest=await manifestResponse.json();
    assert.equal(Object.keys(manifest.files).length,figureKinds.length*8);
    if(process.env.CHECK_COMMIT) assert.equal(manifest.commit,process.env.CHECK_COMMIT);
    assert.equal(await page.locator('html').getAttribute('lang'), lang === 'zh' ? 'zh-CN' : 'en');
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.locator('[data-path="beginner"]').click();
    assert.equal(await page.locator('#experts a[rel=next]').getAttribute('href'),'#recipe');
    await page.locator('#basics .term').first().focus();await page.locator('.term-popover').waitFor();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.term-popover').count(),0);
    const confidence = page.locator('#dspark input[type=range]').first();
    await confidence.focus();
    await page.keyboard.press('Home');
    assert.equal(await confidence.inputValue(), '0');
    assert((await page.locator('#dspark .metrics strong').first().innerText()).startsWith('0'));
    const links = await page.locator('a[download]').evaluateAll(nodes =>
      [...new Set(nodes.map(node => (node as HTMLAnchorElement).href))]);
    assert.equal(links.length,figureKinds.length*2);
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
  const resultPath = process.env.RESULT_PATH ?? 'research/published-results.json';
  await fs.mkdir(path.dirname(resultPath), { recursive: true });
  await fs.writeFile(resultPath, JSON.stringify({
    base, checkedAt: new Date().toISOString(), results
  }, null, 2));
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
}
