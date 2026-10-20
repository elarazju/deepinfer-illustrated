export type TextPart = {text: string; term?: string};
export function parseTerms(text: string): TextPart[] {
  const parts: TextPart[] = [];
  const pattern = /\[\[([a-z][a-z0-9-]*)(?:\|([^\]\n]+))?\]\]/g;
  let start = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index! > start) parts.push({text:text.slice(start,match.index)});
    parts.push({term:match[1],text:match[2]??''});
    start=match.index!+match[0].length;
  }
  if(start<text.length)parts.push({text:text.slice(start)});
  return parts;
}
