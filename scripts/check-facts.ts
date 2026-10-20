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
  if (fact.source !== 'qa_pdf') {
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
  for(const match of source.matchAll(/['"]((?:release|system|zos|eplb|yoco|swa|storage|lb|recipe|so|dspark|model)\.[a-z_]+)['"]/g)){
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
  'figures.storage.1':['storage.block'],
  'swa.blockHit':['swa.hit'],
  'swa.limit':['swa.hit'],
  'figureNotes.moeDefinition':['eplb.prefill'],
};
function checkNumeric(value:string,ids:string[],label:string) {
  const allowed = new Set(ids.flatMap(id=>[...(facts.get(id)?.zh??'').matchAll(/\d+(?:\.\d+)?/g)].map(m=>m[0])));
  for(const number of value.matchAll(/\d+(?:\.\d+)?/g))if(!allowed.has(number[0]))errors.push(`Unregistered number ${number[0]} (${label})`);
}
for(const [lang,dict] of Object.entries({zh,en})){
  const walk=(value:any,key='')=>{
    if(typeof value==='string'){
      if(/\d/.test(value)&&key!=='license'&&!key.startsWith('reading.'))checkNumeric(value,uiEvidence[key]??[],`${lang}.${key}`);
    }else if(value&&typeof value==='object')for(const [k,v] of Object.entries(value))walk(v,key?`${key}.${k}`:k);
  };walk(dict);
  dict.reading.forEach((block:any,i:number)=>{
    for(const id of block.refs)if(!facts.has(id)||facts.get(id).status==='unverified')errors.push(`Invalid prose evidence: ${id}`);
    checkNumeric(block.text,block.refs,`${lang}.reading.${i}`);
  });
}
assert.equal(db.demo_defaults.dspark.confidence.length,facts.get('dspark.method').values.drafts);
assert.equal(db.demo_defaults.dspark.stepTime.length,db.demo_defaults.dspark.confidence.length+1);
assert(db.demo_defaults.dspark.stepTime.every((n:number)=>n>0));
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`PASS: ${facts.size} facts; ${referenced.size} referenced IDs; translations aligned; no unverified references. Local source line checks ${fs.existsSync('vendor/deepinfer')?'enabled':'skipped (vendor absent)'}.`);
