import fs from 'node:fs';
import { parse } from 'yaml';
import { chapters } from '../src/lib/chapters';
const db=parse(fs.readFileSync('facts.yaml','utf8'));
const counts=[];
const terms=new Map(parse(fs.readFileSync('glossary.yaml','utf8')).map((entry:any)=>[entry.id,entry]));
for(const lang of ['zh','en']){
  const dict=JSON.parse(fs.readFileSync(`src/i18n/${lang}.json`,'utf8'));
  const plain=(s:string)=>s.replace(/\[\[([^|\]]+)(?:\|([^\]]+))?\]\]/g,(_,id,label)=>label??(terms.get(id) as any)?.[lang].term??id);
  const count=(text:string)=>lang==='zh'?[...plain(text).replace(/\s/g,'')].length:plain(text).trim().split(/\s+/).filter(Boolean).length;
  for(const [i,chapter] of chapters.entries()){
    const entry=dict.reading[(chapter as any).copyIndex ?? i];
    const copy=dict.chapters[chapter.copyIndex];
    const paragraphs=entry.blocks.map((b:any)=>b.text).join('\n');
    const notes=db.facts.find((f:any)=>f.id===chapter.snippet).snippet.notes.map((n:any)=>n[lang]);
    const visible=[copy.intro,copy.question,paragraphs,...notes,...entry.takeaways,entry.next].join('\n');
    const all=visible+'\n'+entry.scope+'\n'+chapter.facts.map(id=>db.facts.find((f:any)=>f.id===id)[lang]).join('\n');
    counts.push({chapter:chapter.id,lang,paragraphsOnly:count(paragraphs),visible:count(visible),withDetails:count(all),unit:lang==='zh'?'non-whitespace characters':'words'});
  }
}
fs.mkdirSync('research',{recursive:true});
fs.writeFileSync('research/content-lengths.json',JSON.stringify(counts,null,2));
console.table(counts);
