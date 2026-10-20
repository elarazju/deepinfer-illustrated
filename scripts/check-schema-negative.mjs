import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const glossary=fs.readFileSync('glossary.yaml','utf8');
const dict=fs.readFileSync('src/i18n/zh.json','utf8');
try {
 fs.writeFileSync('glossary.yaml',JSON.stringify([{id:'probe',zh:{term:'Probe',short:'Probe',long:'Probe.'},en:{term:'Probe',short:'Probe',long:'Probe.'},refs:['missing.ref'],first_chapter:'basics',related:[]}]));
 let result=spawnSync(process.execPath,['--import','tsx','scripts/check-facts.ts'],{encoding:'utf8'});
 if(result.status===0 || !result.stderr.includes('Invalid glossary ref')) throw new Error('Missing ref was not caught');
 fs.writeFileSync('glossary.yaml',glossary);
 const data=JSON.parse(dict); data.heroText+=' [[missing-term]]'; fs.writeFileSync('src/i18n/zh.json',JSON.stringify(data));
 result=spawnSync(process.execPath,['--import','tsx','scripts/check-facts.ts'],{encoding:'utf8'});
 if(result.status===0 || !result.stderr.includes('Unknown term')) throw new Error('Missing term was not caught');
 const malformed=JSON.parse(dict); malformed.heroText+=' [[kmp|[[kmp|KMP]]]]'; fs.writeFileSync('src/i18n/zh.json',JSON.stringify(malformed));
 result=spawnSync(process.execPath,['--import','tsx','scripts/check-facts.ts'],{encoding:'utf8'});
 if(result.status===0 || !result.stderr.includes('Malformed term marker')) throw new Error('Nested marker was not caught');
 console.log('Negative glossary ref, unknown term and malformed term validation: PASS');
} finally {fs.writeFileSync('glossary.yaml',glossary);fs.writeFileSync('src/i18n/zh.json',dict);}
