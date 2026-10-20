import fs from 'node:fs/promises';
import {chromium} from '@playwright/test';
const sections=process.argv.length>2?process.argv.slice(2):['home','journey','system','scheduling','experts','yoco','storage','routing','recipe','model'];
await fs.mkdir('research/audit-montages',{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
const page=await browser.newPage({viewport:{width:2000,height:1000}});
for(const section of sections){
  const cards=[];
  for(const lang of ['zh','en'])for(const theme of ['light','dark'])for(const width of [1280,375]){
    const name=`${lang}-${theme}-${width}-${section}.png`;
    const data=await fs.readFile(`research/screenshots/${name}`);
    cards.push(`<div><p>${name}</p><img src="data:image/png;base64,${data.toString('base64')}"></div>`);
  }
  await page.setContent(`<style>body{margin:0;background:#bbb;font:12px sans-serif;display:grid;grid-template-columns:repeat(8,250px)}div{padding:5px}img{width:240px;display:block}p{height:28px;margin:0}</style>${cards.join('')}`);
  await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
  await page.screenshot({path:`research/audit-montages/${section}.png`,fullPage:true});
}
await browser.close();
