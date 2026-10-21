import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'});
const results=[];
try{
  for(const lang of ['zh','en'])for(const theme of ['light','dark']){
    const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});
    const page=await context.newPage();
    await page.goto(`http://127.0.0.1:5173/?lang=${lang}&theme=${theme}`,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
    const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    results.push({lang,theme,violations:audit.violations,incomplete:audit.incomplete.map(i=>({id:i.id,description:i.description}))});
    await page.locator('#basics .term').first().focus();
    await page.locator('.term-popover').waitFor();
    const popup=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    results.push({lang,theme,state:'term-open',violations:popup.violations,incomplete:popup.incomplete.map(i=>({id:i.id,description:i.description}))});
    await context.close();
  }
}finally{await browser.close();}
await fs.mkdir('research',{recursive:true});
await fs.writeFile('research/accessibility-results.json',JSON.stringify(results,null,2));
const violations=results.flatMap(r=>r.violations.map(v=>({lang:r.lang,theme:r.theme,id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
console.log(JSON.stringify(violations,null,2));
if(violations.length)process.exit(1);
console.log('PASS: automated WCAG A/AA checks in both languages and themes. Manual review still applies.');
