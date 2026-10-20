import { chromium } from '@playwright/test';
const browser=await chromium.launch({channel:'chrome'});
const requested=process.argv.slice(2);
const sections=requested.length?requested:['journey','system','scheduling','experts','yoco','storage','routing','recipe','model'];
try{
  for(const lang of ['zh','en'])for(const theme of ['light','dark'])for(const width of [1280,375]){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    await page.goto(`http://127.0.0.1:5173/?lang=${lang}&theme=${theme}`,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    const prefix=`research/screenshots/${lang}-${theme}-${width}`;
    await page.screenshot({path:`${prefix}-home.png`});
    for(const id of sections){
      const section=page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      await page.evaluate(()=>(document.activeElement as HTMLElement)?.blur());
      await section.screenshot({path:`${prefix}-${id}.png`,style:'.site-header,.skip-link{visibility:hidden!important}'});
    }
    await page.close();
  }
}finally{await browser.close();}
console.log(`Captured ${8*(sections.length+1)} unobstructed home/section screenshots.`);
