import fs from 'node:fs/promises';
import { chromium, webkit } from '@playwright/test';
await fs.mkdir('research/tutorial-audit',{recursive:true});
const results=[];
const finalCheck=process.argv.includes('--final');
for(const [engine,type] of [['chrome',chromium],['webkit',webkit]]){
 const browser=await type.launch(engine==='chrome'?{channel:'chrome'}:{});
 for(const lang of ['zh','en'])for(const theme of ['light','dark'])for(const width of [1280,375]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:5173/?lang=${lang}&theme=${theme}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  const geometry=await page.evaluate(()=>{
   const issues=[],collisions=[];
   for(const svg of document.querySelectorAll('svg.diagram')){
    const texts=[...svg.querySelectorAll('text')].map(t=>({text:t.textContent,b:t.getBBox()}));
    const vb=svg.viewBox.baseVal;
    for(const t of texts)if(t.b.x<0||t.b.y<0||t.b.x+t.b.width>vb.width||t.b.y+t.b.height>vb.height)issues.push({figure:svg.dataset.figure,text:t.text});
    for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){
     const a=texts[i].b,b=texts[j].b;
     if(Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>1)collisions.push({figure:svg.dataset.figure,a:texts[i].text,b:texts[j].text});
    }
   }
   return {overflow:document.documentElement.scrollWidth>innerWidth,issues,collisions,chapters:document.querySelectorAll('.chapter').length,labs:document.querySelectorAll('#decode-lab').length};
  });
  if(engine==='chrome'){
   for(const kind of finalCheck?['timeline','experts','yoco']:['system','timeline','experts','yoco','storage','routing','recipe','model']){
    const fig=page.locator(`svg[data-figure="${kind}"]`).first();
    if(await fig.count())await fig.screenshot({path:`research/tutorial-audit/${kind}-${lang}-${theme}-${width}.png`});
   }
   for(const id of finalCheck?['storage']:['yoco','scheduling','decode-lab','storage']){
    await page.locator(`#${id}`).evaluate(e=>e.scrollIntoView({block:'start'}));
    await page.screenshot({path:`research/tutorial-audit/page-${id}-${lang}-${theme}-${width}.png`});
   }
  }
  results.push({engine,lang,theme,width,...geometry,errors});
  await page.close();
 }
 await browser.close();
}
await fs.writeFile(`research/tutorial-audit/${finalCheck?'final-':''}results.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
