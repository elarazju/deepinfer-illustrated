import fs from 'node:fs';
import { parse } from 'yaml';
import { chapters } from '../src/lib/chapters';
const db=parse(fs.readFileSync('facts.yaml','utf8'));
const counts=[];
const plain=(s:string)=>s.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g,'$2').replace(/\[\[([^\]]+)\]\]/g,'$1');
for(const lang of ['zh','en']){
  const dict=JSON.parse(fs.readFileSync(`src/i18n/${lang}.json`,'utf8'));
  for(const [i,chapter] of chapters.entries()){
    const entry=dict.reading[(chapter as any).copyIndex ?? i];
    const visible=plain(entry?.blocks.map((b:any)=>b.text).join('\n') ?? '');
    const all=visible+'\n'+chapter.facts.map(id=>db.facts.find((f:any)=>f.id===id)[lang]).join('\n');
    const count=(text:string)=>lang==='zh'?[...text.replace(/\s/g,'')].length:text.trim().split(/\s+/).filter(Boolean).length;
    counts.push({chapter:chapter.id,lang,visible:count(visible),withDetails:count(all),unit:lang==='zh'?'non-whitespace characters':'words'});
  }
}
fs.writeFileSync('research/content-lengths.json',JSON.stringify(counts,null,2));
console.table(counts);
