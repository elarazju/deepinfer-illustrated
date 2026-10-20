import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium, webkit } from '@playwright/test';
const base=process.env.PREVIEW_URL??'http://127.0.0.1:5173';
const directory='research/screenshots';
await fs.mkdir(directory,{recursive:true});
const results:any[]=[];
const sections=['basics','journey','system','scheduling','decode-lab','experts','recipe','routing','yoco','storage','model','glossary'];
for(const engine of ['chrome','webkit']){
  const browser=engine==='chrome'?await chromium.launch({channel:'chrome'}):await webkit.launch();
  try{
    for(const lang of ['zh','en'])for(const theme of ['light','dark'])for(const width of [1280,375]){
      const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
      const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto(`${base}/?lang=${lang}&theme=${theme}`,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.locator('html').getAttribute('lang'),lang==='zh'?'zh-CN':'en');
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
      assert(!overflow,`${engine}/${lang}/${theme}/${width}: page overflow`);
      assert.equal(await page.locator('.chapter').count(),10);
      assert.equal(await page.locator('#experts #dspark').count(),0);
      assert.equal(await page.locator('#decode-lab #dspark').count(),1);
      assert.equal(await page.locator('.chapter-evidence[open]').count(),0);
      assert(await page.locator('#system .tutorial-body').isVisible());
      for(const id of sections)assert.equal(await page.locator(`#${id}`).count(),1);
      const term=page.locator('#basics .term').first();
      await term.focus();await page.locator('.term-popover').waitFor();
      await page.keyboard.press('Tab');
      assert(await page.locator('.term-popover a').first().evaluate(el=>el===document.activeElement));
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.term-popover').count(),0);
      assert(await term.evaluate(el=>el===document.activeElement));
      for(const path of ['beginner','advanced','code']){
        const choice=page.locator(`[data-path="${path}"]`);await choice.focus();await page.keyboard.press('Enter');
        assert.equal(await choice.getAttribute('aria-pressed'),'true');
      }
      const contextLength=page.locator('#kv-growth input').first();await contextLength.focus();await page.keyboard.press('End');
      assert.equal(await contextLength.inputValue(),'32768');
      await page.locator('#autoregressive-player button').nth(1).click();
      assert.equal(await page.locator('.generation-tokens .cached').count(),3);
      await page.locator('[data-path=""]').click();
      // Keyboard changes the modeled result, not just the slider appearance.
      const confidence=page.locator('#dspark input[type=range]').first();
      await confidence.focus();await page.keyboard.press('Home');
      assert.equal(await confidence.inputValue(),'0');
      assert((await page.locator('#dspark .metrics strong').first().innerText()).startsWith('0'));
      await page.locator('#dspark .text-button').click();
      await page.locator('#dspark .segmented button').nth(1).click();
      assert((await page.locator('#dspark .metrics strong').first().innerText()).startsWith('5'));
      await page.locator('#dspark .segmented button').first().click();
      const swa=page.locator('#swa');
      await swa.locator('.segmented button').first().click();
      assert.equal(await swa.locator('.metrics strong').nth(1).innerText(),'0');
      await swa.locator('.segmented button').nth(1).click();
      assert.equal(await swa.locator('.metrics strong').nth(1).innerText(),'128');
      await swa.locator('input[type=range]').first().focus();await page.keyboard.press('Home');
      assert.equal(await swa.locator('.metrics strong').first().innerText(),'0');
      const timeline=page.locator('#scheduling .demo');
      await timeline.locator('.segmented button').nth(1).click();
      assert.equal(await timeline.locator('.timeline-result strong').innerText(),'33.3%');
      await timeline.locator('.segmented button').first().click();
      assert.equal(await timeline.locator('.timeline-result strong').innerText(),'0.0%');
      assert(await timeline.locator('.demo-actions > button').isDisabled(),'reduced motion must disable play');
      // Return to defaults before screenshots; each section is captured independently.
      await page.reload({waitUntil:'networkidle'});
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.waitForFunction(()=>window.scrollY===0);
      if(engine==='chrome'){
        await page.screenshot({path:`${directory}/${lang}-${theme}-${width}-home.png`});
        for(const id of sections){
          const section=page.locator(`#${id}`);
          await section.scrollIntoViewIfNeeded();
          await page.evaluate(()=>(document.activeElement as HTMLElement)?.blur());
          await section.screenshot({path:`${directory}/${lang}-${theme}-${width}-${id}.png`,style:'.site-header,.skip-link{visibility:hidden!important}'});
        }
      }
      assert.deepEqual(errors,[]);
      results.push({engine,lang,theme,width,overflow,interactions:'pass',reducedMotion:'pass',consoleErrors:errors});
      console.log(`PASS ${engine}/${lang}/${theme}/${width}`);
      await page.close();
    }
    const page=await browser.newPage({reducedMotion:'no-preference'});
    await page.goto(`${base}/?lang=en`,{waitUntil:'networkidle'});
    await page.locator('#scheduling .demo-actions > button').click();
    await page.waitForFunction(()=>Number((document.querySelector('#scheduling .demo > input') as HTMLInputElement)?.value)>0);
    await page.locator('#scheduling .demo-actions > button').click();
    const paused=await page.locator('#scheduling .demo > input').inputValue();
    await page.waitForTimeout(150);
    assert.equal(await page.locator('#scheduling .demo > input').inputValue(),paused);
    await page.close();
    const systemPage=await browser.newPage({colorScheme:'dark'});
    await systemPage.goto(`${base}/?lang=en`,{waitUntil:'networkidle'});
    assert.equal(await systemPage.locator('html').getAttribute('data-theme'),'dark','fresh visit follows system');
    await systemPage.emulateMedia({colorScheme:'light'});
    await systemPage.waitForFunction(()=>document.documentElement.dataset.theme==='light');
    await systemPage.locator('.theme-toggle').click();
    await systemPage.reload({waitUntil:'networkidle'});
    assert.equal(await systemPage.locator('html').getAttribute('data-theme'),'dark','explicit choice persists');
    await systemPage.close();
  }finally{await browser.close();}
}
await fs.writeFile('research/browser-results.json',JSON.stringify({checkedAt:new Date().toISOString(),checks:['basics','glossary','term-keyboard','reading-paths','models','theme','animation','overflow','page-errors'],screenshots:104,results,note:'WebKit is an engine check, not real Safari/macOS/iOS certification.'},null,2));
console.log(`PASS: ${results.length} browser/locale/theme/width combinations; interaction, animation, reduced-motion checks. Screenshots in ${directory}.`);
