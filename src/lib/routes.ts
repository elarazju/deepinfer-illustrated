import { chapters, decodeMetadata } from './chapters';
import { dictionaries, type Locale } from './data';

export const pageOrder = ['basics','journey','system','scheduling','decode-lab','experts','recipe','routing','yoco','storage','model'];
export const readingPaths = {
  beginner: ['basics','journey','system','scheduling','decode-lab','experts','recipe'],
  advanced: pageOrder.filter(id=>!['basics','model'].includes(id)),
  code: ['scheduling','experts','yoco','recipe','model'],
};
export type ReadingPath = keyof typeof readingPaths | '';
export function parsePath(value: string | null): ReadingPath {
  return value && Object.hasOwn(readingPaths,value) ? value as ReadingPath : '';
}
export function routeFor(path: ReadingPath) { return path ? readingPaths[path] : pageOrder; }
export function neighbors(id: string, path: ReadingPath) {
  const route=routeFor(path);
  const index=route.indexOf(id);
  return index<0 ? {previous: undefined,next:route[0]} : {previous:route[index-1],next:route[index+1]};
}
export function sectionTitle(id: string, locale: Locale) {
  const t=dictionaries[locale];
  if(id==='basics') return t.glossaryUi.basics;
  if(id==='journey') return t.overview;
  if(id==='decode-lab') return t.decodeLab.title;
  const chapter=chapters.find(c=>c.id===id);
  return chapter ? t.chapters[chapter.copyIndex].short : id;
}
export function sectionLevel(id:string) {
  return id===decodeMetadata.id ? decodeMetadata.level : chapters.find(c=>c.id===id)?.level??'beginner';
}
