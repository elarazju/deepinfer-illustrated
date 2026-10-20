import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const browser=await chromium.launch({channel:'chrome'});
try{for(const lang of ['zh','en']){
 const context=await browser.newContext({viewport:{width:375,height:812}}); const page=await context.newPage();
 await page.goto(`http://127.0.0.1:5173/?lang=${lang}`);
 const term=page.locator('.term').first(); await term.focus();
 await page.locator('.term-popover').waitFor();
 await page.keyboard.press('Tab');
 if(!await page.locator('.term-popover a').first().evaluate(el=>el===document.activeElement))throw Error('Popover link is not keyboard reachable');
 await page.keyboard.press('Escape');
 if(await page.locator('.term-popover').count())throw Error('Escape failed');
 if(!await term.evaluate(el=>el===document.activeElement))throw Error('Focus not restored');
 await term.click();
 const results=await new AxeBuilder({page}).analyze();
 if(results.violations.length)throw Error(JSON.stringify(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))));
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow');
 await context.close(); console.log(lang+' term keyboard, mobile, axe PASS');
}}finally{await browser.close();}

