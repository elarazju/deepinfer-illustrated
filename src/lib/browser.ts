export function safeMedia(query: string) {
  try { return window.matchMedia(query); }
  catch { return {matches: query.includes('reduced-motion'), addEventListener() {}, removeEventListener() {}}; }
}
