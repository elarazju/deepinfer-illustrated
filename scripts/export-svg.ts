import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { parse } from 'yaml';

const base = process.env.PREVIEW_URL ?? 'http://127.0.0.1:5173';
const db=parse(await fs.readFile('facts.yaml','utf8'));
const requested=process.argv.slice(2);
const kinds=requested.length?requested:['overview','system','timeline','experts','yoco','storage','routing','recipe','model'];
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL??'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:2});
await fs.mkdir('public/figures',{recursive:true});
try{
  for(const lang of ['zh','en'])for(const theme of ['light','dark'])for(const kind of kinds){
    await page.goto(`${base}/?figure=${kind}&lang=${lang}&theme=${theme}`,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForFunction(({lang,theme})=>document.documentElement.lang===(lang==='zh'?'zh-CN':'en')&&document.documentElement.dataset.theme===theme,{lang,theme});
    const svg=await page.locator('svg.diagram').evaluate((element,{commit,kind})=>{
      const clone=element.cloneNode(true) as SVGSVGElement;
      const props=['fill','stroke','stroke-width','stroke-dasharray','opacity','fill-opacity','font-family','font-size','font-weight','letter-spacing','text-anchor','paint-order'];
      const originals=[element,...element.querySelectorAll('*')];
      const copies=[clone,...clone.querySelectorAll('*')];
      originals.forEach((node,i)=>{
        const style=getComputedStyle(node);
        for(const prop of props)(copies[i] as SVGElement).style.setProperty(prop,style.getPropertyValue(prop));
        copies[i].removeAttribute('class');
        for(const attr of [...copies[i].attributes])if(attr.name.startsWith('data-'))copies[i].removeAttribute(attr.name);
      });
      const viewBox=clone.viewBox.baseVal;
      const width=viewBox.width, height=viewBox.height;
      clone.setAttribute('viewBox',`0 0 ${width} ${height+45}`);
      clone.setAttribute('width','1200');clone.setAttribute('height',String(1200*(height+45)/width));
      clone.style.background=getComputedStyle(document.documentElement).getPropertyValue('--surface');
      for(const a of clone.querySelectorAll('a')){
        const href=a.getAttribute('href');
        if(href?.startsWith('#'))a.setAttribute('href',`https://elarazju.github.io/deepinfer-illustrated/${href}`);
      }
      const ns='http://www.w3.org/2000/svg';
      const source=document.createElementNS(ns,'text');
      source.setAttribute('x','20');source.setAttribute('y',String(height+27));
      source.setAttribute('font-size','11');source.setAttribute('font-family','sans-serif');
      source.setAttribute('fill',getComputedStyle(document.documentElement).getPropertyValue('--muted'));
      source.textContent=`DeepInfer Illustrated · ${kind} · source ${commit.slice(0,7)} · CC BY 4.0 · unofficial`;
      clone.appendChild(source);
      const metadata=document.createElementNS(ns,'metadata');
      metadata.textContent=`Evidence: https://github.com/deepseek-ai/DeepInfer/tree/${commit}; facts.yaml in https://github.com/elarazju/deepinfer-illustrated.`;
      clone.appendChild(metadata);
      return new XMLSerializer().serializeToString(clone);
    },{commit:db.commit,kind});
    const stem=`public/figures/${kind}-${lang}-${theme}`;
    await fs.writeFile(`${stem}.svg`,svg);
    await page.setContent(`<style>body{margin:0;width:1200px}svg{display:block}</style>${svg}`);
    await page.locator('svg').screenshot({path:`${stem}.png`});
  }
  console.log(`Exported ${kinds.length*4} SVG + PNG pairs.`);
}finally{await browser.close();}
