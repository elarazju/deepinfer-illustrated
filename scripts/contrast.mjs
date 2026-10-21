import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'});
const results=[];
try {
  const page=await browser.newPage();
  for(const theme of ['light','dark']){
    await page.goto(`http://127.0.0.1:5173/?theme=${theme}`,{waitUntil:'networkidle'});
    const pairs=await page.evaluate(()=>{
      const css=getComputedStyle(document.documentElement);
      return ['background','cpu','gpu','storage','network','closed','highlight'].map(name=>({
        name,foreground:css.getPropertyValue(`--${name}`).trim(),background:css.getPropertyValue(`--${name}-soft`).trim(),
      }));
    });
    const luminance=hex=>{
      const rgb=hex.replace('#','').match(/../g).map(n=>parseInt(n,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);
      return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
    };
    for(const pair of pairs){
      const a=luminance(pair.foreground),b=luminance(pair.background);
      const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
      results.push({theme,...pair,ratio,passes:ratio>=4.5});
    }
  }
}finally{await browser.close();}
await fs.mkdir('research',{recursive:true});
await fs.writeFile('research/contrast-results.json',JSON.stringify(results,null,2));
if(results.some(r=>!r.passes))throw Error(JSON.stringify(results.filter(r=>!r.passes)));
console.log(`PASS: ${results.length} text/token color pairs exceed 4.5:1.`);
