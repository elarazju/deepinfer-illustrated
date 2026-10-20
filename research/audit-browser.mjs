import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium, webkit } from '@playwright/test';
const results=[];
for(const [engine,type] of [['chrome',chromium],['webkit',webkit]]){
  const browser=await type.launch(engine==='chrome'?{channel:'chrome'}:{});
  for(const lang of ['zh','en'])for(const theme of ['light','dark'])for(const width of [1280,375]){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`http://127.0.0.1:5173/?lang=${lang}&theme=${theme}`,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    const data=await page.evaluate(()=>{
      const facts=[...document.querySelectorAll('.chapter')].map(e=>({id:e.id,facts:e.querySelectorAll('[data-fact]').length,reading:e.querySelector('.chapter-reading')?.textContent.length??0}));
      const svgIssues=[];
      for(const svg of document.querySelectorAll('svg.diagram')){
        const vb=svg.viewBox.baseVal;
        for(const t of svg.querySelectorAll('text')){
          const box=t.getBBox();
          if(box.x < -1||box.x+box.width>vb.width+1)svgIssues.push({figure:svg.dataset.figure,text:t.textContent,x:box.x,width:box.width,viewWidth:vb.width});
        }
      }
      return {overflow:document.documentElement.scrollWidth>innerWidth,chapters:facts,svgIssues,downloadLinks:[...document.querySelectorAll('a[download]')].map(a=>a.href)};
    });
    assert.equal(data.overflow,false);
    assert.equal(data.chapters.length,8);
    for(const detail of await page.locator('.chapter-reading').all()){await detail.locator('summary').click();assert(await detail.getAttribute('open')!==null);}
    const confidence=page.locator('#dspark input[type=range]').first();
    await confidence.focus();await page.keyboard.press('Home');
    assert((await page.locator('#dspark .metrics strong').first().innerText()).startsWith('0'));
    await page.locator('#dspark .text-button').click();
    await page.locator('#swa input[type=range]').first().focus();await page.keyboard.press('Home');
    assert.equal(await page.locator('#swa .metrics strong').first().innerText(),'0');
    assert(await page.locator('#scheduling .demo-actions > button').isDisabled());
    const missing=[];
    for(const url of data.downloadLinks){const r=await page.request.get(url);if(!r.ok())missing.push({url,status:r.status()});}
    assert.deepEqual(errors,[]);
    results.push({engine,lang,theme,width,...data,missingDownloads:missing,errors,keyboardAndReducedMotion:'pass'});
    await page.close();
  }
  await browser.close();
}
await fs.writeFile('research/independent-browser-results.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results.map(({engine,lang,theme,width,overflow,svgIssues,missingDownloads})=>({engine,lang,theme,width,overflow,svgIssues,missingDownloads})),null,2));
