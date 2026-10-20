import fs from 'node:fs';
import { parse } from 'yaml';
const db=parse(fs.readFileSync('facts.yaml','utf8'));
const src=fs.readFileSync('src/lib/data.ts','utf8');
const entries=[...src.matchAll(/id: '([^']+)'[^\n]+facts: \[([^\]]+)\]/g)];
const counts=[];
for(const lang of ['zh','en']){
  const dict=JSON.parse(fs.readFileSync(`src/i18n/${lang}.json`,'utf8'));
  for(let i=0;i<7;i++){
    const ids=[...entries[i][2].matchAll(/'([^']+)'/g)].map(m=>m[1]);
    const text=ids.map(id=>db.facts.find((f:any)=>f.id===id)[lang]).join('\n')+'\n'+dict.reading[i].text;
    const count=lang==='zh'?[...text.replace(/\s/g,'')].length:text.split(/\s+/).length;
    counts.push({chapter:entries[i][1],lang,count,unit:lang==='zh'?'non-whitespace characters':'words'});
    if(count<800||count>1500)throw new Error(`${entries[i][1]} ${lang}: ${count} outside 800–1500`);
  }
}
fs.writeFileSync('research/content-lengths.json',JSON.stringify(counts,null,2));
console.table(counts);
