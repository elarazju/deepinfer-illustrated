import fs from 'node:fs';
import { parse } from 'yaml';
import { chapters } from '../src/lib/chapters';
const db=parse(fs.readFileSync('facts.yaml','utf8'));
const counts=[];
for(const lang of ['zh','en']){
  const dict=JSON.parse(fs.readFileSync(`src/i18n/${lang}.json`,'utf8'));
  for(let i=0;i<7;i++){
    const chapter=chapters[i];
    const text=chapter.facts.map(id=>db.facts.find((f:any)=>f.id===id)[lang]).join('\n')+'\n'+dict.reading[i].blocks.map((b:any)=>b.text).join('\n');
    const count=lang==='zh'?[...text.replace(/\s/g,'')].length:text.split(/\s+/).length;
    counts.push({chapter:chapter.id,lang,count,unit:lang==='zh'?'non-whitespace characters':'words'});
    if(count<800||count>1500)throw new Error(`${chapter.id} ${lang}: ${count} outside 800–1500`);
  }
}
fs.writeFileSync('research/content-lengths.json',JSON.stringify(counts,null,2));
console.table(counts);
