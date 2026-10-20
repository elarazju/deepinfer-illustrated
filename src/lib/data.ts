import { parse } from 'yaml';
import raw from '../../facts.yaml?raw';
import zh from '../i18n/zh.json';
import en from '../i18n/en.json';

export type Locale = 'zh' | 'en';
export type Dictionary = typeof zh;
export const dictionaries = { zh, en };
export type Fact = {
  id: string; zh: string; en: string;
  source: 'qa_pdf' | 'readme' | 'code';
  ref: string; status: 'confirmed' | 'inferred' | 'unverified';
  values?: Record<string, number>;
};
export const database = parse(raw) as {
  commit: string; repository: string; qa_path: string; facts: Fact[];
  demo_defaults: {
    dspark: { confidence: number[]; stepTime: number[]; mode: string };
    swa: { length: number; hit: number; cached: boolean; min: number; max: number };
    timeline: { async: boolean; cpuSchedule: number; forward: number; sample: number; post: number };
  };
};
export const facts = Object.fromEntries(database.facts.map(f => [f.id, f]));
export function sourceUrl(fact: Fact) {
  if (fact.source === 'qa_pdf') return `${database.repository}/blob/${database.commit}/${encodeURI(database.qa_path)}#page=${fact.ref.match(/\d+/)?.[0] ?? '1'}`;
  const [path, line] = fact.ref.split(':');
  return `${database.repository}/blob/${database.commit}/${path}${line ? `#L${line}` : ''}`;
}
export const chapters = [
  { id: 'system', facts: ['system.disaggregation', 'system.parallelism', 'system.minimum', 'release.scope'], code: 'README.md', line: 33 },
  { id: 'scheduling', figure: 'timeline', facts: ['zos.serial', 'zos.overlap', 'zos.remap'], code: 'csrc/engine/zos.cpp', line: 142 },
  { id: 'experts', facts: ['eplb.strategy', 'eplb.prefill', 'eplb.decode', 'eplb.code'], code: 'deepinfer/model_executor/eplb/policy.py', line: 73 },
  { id: 'yoco', facts: ['yoco.ced', 'yoco.replay', 'yoco.config', 'swa.hit', 'yoco.equivalence'], code: 'deepinfer/model_executor/models/v4_modules/yoco.py', line: 14 },
  { id: 'storage', facts: ['storage.block', 'storage.ec', 'storage.pipeline', 'storage.swa', 'storage.ttl'], closed: true },
  { id: 'routing', facts: ['lb.prefill', 'lb.chunk', 'lb.decode'], closed: true },
  { id: 'recipe', facts: ['recipe.encode', 'so.pipeline', 'recipe.stream'], code: 'deepinfer/structure_output/matcher.py', line: 58 },
  { id: 'model', facts: ['model.mhc', 'model.engram', 'model.index', 'model.precision'], code: 'deepinfer/model_executor/models/v4_modules/cross_layer.py', line: 22 },
];
export const stationTargets = ['recipe', 'storage', 'routing', 'system', 'yoco', 'storage', 'experts', 'recipe'];
