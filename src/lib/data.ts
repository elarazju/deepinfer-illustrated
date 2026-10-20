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
  if (fact.source === 'qa_pdf') return `${database.repository.replace('https://github.com/','https://raw.githubusercontent.com/')}/${database.commit}/${encodeURI(database.qa_path)}#page=${fact.ref.match(/\d+/)?.[0] ?? '1'}`;
  const [path, line] = fact.ref.split(':');
  return `${database.repository}/blob/${database.commit}/${path}${line ? `#L${line}` : ''}`;
}
export { chapters } from './chapters';
