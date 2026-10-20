import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { parse } from 'yaml';
import { parse as parseSvelte } from 'svelte/compiler';

const db = parse(fs.readFileSync('facts.yaml','utf8'));
const facts = new Map<string, any>();
const errors: string[] = [];
for (const fact of db.facts) {
  if (facts.has(fact.id)) errors.push(`Duplicate fact: ${fact.id}`);
  facts.set(fact.id, fact);
  if (!fact.ref || !fact.zh || !fact.en) errors.push(`Missing evidence or translation: ${fact.id}`);
  if (!['confirmed','inferred','unverified'].includes(fact.status)) errors.push(`Invalid status: ${fact.id}`);
  if (fact.source === 'qa_pdf' && !/^pp?\.\d/.test(fact.ref)) errors.push(`Missing PDF page: ${fact.id}`);
  if (fact.source === 'background') {
    if (!fact.id.startsWith('bg.') || fact.status !== 'confirmed' || !/^https:\/\//.test(fact.url ?? '')) errors.push(`Invalid background: ${fact.id}`);
  }
  if (!['qa_pdf','background'].includes(fact.source)) {
    const [file, line] = fact.ref.split(':');
    if (!line || !/^\d+$/.test(line)) errors.push(`Missing line: ${fact.id}`);
    const source = path.join('vendor/deepinfer',file);
    if (fs.existsSync('vendor/deepinfer')) {
      if (!fs.existsSync(source)) errors.push(`Missing source: ${source}`);
      else if (+line > fs.readFileSync(source,'utf8').split('\n').length) errors.push(`Line out of bounds: ${fact.ref}`);
    }
  }
}
function files(dir: string): string[] {
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(f=>f.isDirectory()?files(path.join(dir,f.name)):[path.join(dir,f.name)]);
}
const referenced = new Set<string>();
for(const file of files('src').filter(f=>/\.(svelte|ts)$/.test(f))) {
  const source=fs.readFileSync(file,'utf8');
  for(const match of source.matchAll(/['"]((?:bg|snippet|release|system|zos|eplb|yoco|swa|storage|lb|recipe|so|dspark|model)\.[a-z_]+)['"]/g)){
    const id=match[1];referenced.add(id);
    if(!facts.has(id))errors.push(`Unknown fact ${id} in ${file}`);
    if(facts.get(id)?.status==='unverified')errors.push(`Unverified fact used: ${id}`);
  }
  if(file.endsWith('.svelte')){
    const ast=parseSvelte(source);
    const walk=(node:any)=>{
      if(!node||typeof node!=='object')return;
      if(node.type==='Attribute')return; // SVG geometry, URLs and control bounds are not visible prose.
      if(node.type==='Text' && /\d/.test(node.data.replace(/\bL1\b|\(N[+−]1\)/g,'')) && !['FIELDNOTES / 001','00'].includes(node.data.trim()))
        errors.push(`Numeric literal outside evidence data (${file}): ${node.data.trim()}`);
      for(const value of Object.values(node))if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object')walk(value);
    };
    walk(ast.html);
  }
}
const zh=JSON.parse(fs.readFileSync('src/i18n/zh.json','utf8'));
const en=JSON.parse(fs.readFileSync('src/i18n/en.json','utf8'));
function shape(v:any):any { if(Array.isArray(v))return v.map(shape);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,v])=>[k,shape(v)]));return typeof v; }
assert.deepEqual(shape(zh),shape(en),'Translation keys and array sizes differ');
// All factual prose lives in facts.yaml and renders beside a source badge. UI
// dictionaries may contain mathematical labels; whitelist those exact labels.
const uiEvidence: Record<string,string[]> = {
  'figures.storage.persistent':['storage.block'],
  'swa.blockHit':['swa.hit'],
  'swa.limit':['swa.hit'],
  'figureNotes.moeDefinition':['eplb.prefill'],
  'figureNotes.tiers':['lb.prefill'],
  'figureNotes.stream':['recipe.stream'],
};
function checkNumeric(value:string,ids:string[],label:string) {
  const allowed = new Set(ids.flatMap(id=>[...((facts.get(id)?.zh??'')+' '+(facts.get(id)?.en??'')).matchAll(/\d+(?:\.\d+)?/g)].map(m=>m[0])));
  for(const number of value.matchAll(/\d+(?:\.\d+)?/g))if(!allowed.has(number[0]))errors.push(`Unregistered number ${number[0]} (${label})`);
}
const glossary = parse(fs.readFileSync('glossary.yaml','utf8'));
const terms = new Map<string,any>(glossary.map((entry:any)=>[entry.id,entry]));
if(terms.size!==glossary.length) errors.push('Duplicate glossary ID');
for(const entry of glossary){
  if(!entry.id || !entry.first_chapter || !Array.isArray(entry.refs) || !entry.refs.length || !Array.isArray(entry.related)) errors.push(`Invalid glossary structure: ${entry.id}`);
  if(JSON.stringify(shape(entry.zh))!==JSON.stringify(shape(entry.en))) errors.push(`Glossary translation mismatch: ${entry.id}`);
  for(const lang of ['zh','en']) {
    for(const key of ['term','short','long']) if(typeof entry[lang]?.[key]!=='string' || !entry[lang][key]) errors.push(`Missing glossary ${entry.id}.${lang}.${key}`);
    checkNumeric(Object.values(entry[lang]??{}).join(' '),entry.refs??[],`glossary.${entry.id}.${lang}`);
  }
  for(const id of entry.refs??[])if(!facts.has(id)||facts.get(id).status==='unverified') errors.push(`Invalid glossary ref: ${id}`);
  for(const id of entry.related??[])if(!terms.has(id)) errors.push(`Invalid related term: ${id}`);
}
function checkTerms(value:any,label:string){
  if(typeof value==='string')for(const match of value.matchAll(/\[\[([^|\]]+)(?:\|[^\]]*)?\]\]/g))if(!terms.has(match[1])) errors.push(`Unknown term ${match[1]} (${label})`);
  if(value&&typeof value==='object')for(const [key,item] of Object.entries(value))checkTerms(item,`${label}.${key}`);
}
checkTerms(zh,'zh');checkTerms(en,'en');
for(const [lang,dict] of Object.entries({zh,en})){
  const walk=(value:any,key='', inherited:string[]=[])=>{
    if(typeof value==='string'){
      if(/\d/.test(value)&&key!=='license'&&!key.endsWith('.ref')&&!key.includes('.refs.')&&!key.endsWith('.id')) {
        const termRefs=[...value.matchAll(/\[\[([^|\]]+)(?:\|[^\]]*)?\]\]/g)].flatMap(m=>terms.get(m[1])?.refs??[]);
        const displayed=value.replace(/\[\[([^|\]]+)(?:\|([^\]]*))?\]\]/g,(_,id,label)=>label??terms.get(id)?.[lang]?.term??id);
        checkNumeric(displayed,[...inherited,...termRefs,...(uiEvidence[key]??[])],`${lang}.${key}`);
      }
    }else if(value&&typeof value==='object'){
      const refs=Array.isArray(value.refs)?value.refs:inherited;
      for(const id of refs)if(!facts.has(id)||facts.get(id).status==='unverified')errors.push(`Invalid prose evidence: ${id}`);
      for(const [k,v] of Object.entries(value))walk(v,key?`${key}.${k}`:k,refs);
    }
  };walk(dict);
}
assert.equal(db.demo_defaults.dspark.confidence.length,facts.get('dspark.method').values.drafts);
assert.equal(db.demo_defaults.dspark.stepTime.length,db.demo_defaults.dspark.confidence.length+1);
assert(db.demo_defaults.dspark.stepTime.every((n:number)=>n>0));
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`PASS: ${facts.size} facts; ${referenced.size} referenced IDs; translations aligned; no unverified references. Local source line checks ${fs.existsSync('vendor/deepinfer')?'enabled':'skipped (vendor absent)'}.`);
