import assert from 'node:assert/strict';
import {chromium,webkit} from '@playwright/test';
for(const engine of [chromium,webkit]){
  const browser=await engine.launch(engine===chromium?{channel:'chrome'}:{});
  try {
    const page=await browser.newPage({viewport:{width:375,height:812},reducedMotion:'reduce'});
    await page.goto('http://127.0.0.1:5173/?lang=en&path=code',{waitUntil:'networkidle'});
    assert.equal(await page.locator('[data-path="code"]').getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('#experts a[rel=next]').getAttribute('href'),'#yoco');
    for(const [path,first,last] of [['beginner','basics','recipe'],['advanced','journey','storage'],['code','scheduling','model']]){
      const button=page.locator(`[data-path="${path}"]`);
      await button.focus();await page.keyboard.press('Enter');
      assert.equal(await button.getAttribute('aria-pressed'),'true');
      assert.equal(new URL(page.url()).searchParams.get('path'),path);
      assert.equal(await page.locator('.sidebar nav .in-route').first().getAttribute('href'),`#${first}`);
      assert.equal(await page.locator('.sidebar nav .in-route').last().getAttribute('href'),`#${last}`);
      await page.reload({waitUntil:'networkidle'});
      assert.equal(await page.locator(`[data-path="${path}"]`).getAttribute('aria-pressed'),'true');
    }
    await page.goto('http://127.0.0.1:5173/?lang=en',{waitUntil:'networkidle'});
    assert.equal(await page.locator('[data-path="code"]').getAttribute('aria-pressed'),'true','stored route');
    await page.goto('http://127.0.0.1:5173/?path=invalid',{waitUntil:'networkidle'});
    assert.equal(await page.locator('[data-path=""]').getAttribute('aria-pressed'),'true','invalid URL uses page order');
    assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
    await page.close();
    const blocked=await browser.newPage();
    await blocked.addInitScript(()=>{
      Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage denied');}});
      Object.defineProperty(window,'matchMedia',{value(){throw new Error('Media query denied');}});
    });
    const errors=[];blocked.on('pageerror',error=>errors.push(error.message));
    await blocked.goto('http://127.0.0.1:5173/?path=beginner',{waitUntil:'networkidle'});
    await blocked.locator('[data-path="code"]').click();
    await blocked.locator('.theme-toggle').click();
    assert.equal(await blocked.locator('#basics').count(),1);
    assert.deepEqual(errors,[]);
    console.log(`${engine.name()}: routes, keyboard, persistence, invalid URL, denied browser APIs PASS`);
  } finally {await browser.close();}
}
