export function evaluateDrafts(confidence: number[], time: number[]) {
  let cumulative = 1;
  let expected = 1;
  const rates: number[] = [];
  const candidates = [{ k: 0, expected, time: time[0], throughput: expected / time[0] }];
  confidence.forEach((p, index) => {
    cumulative *= Math.max(0, Math.min(1, p));
    rates.push(cumulative);
    expected += cumulative;
    candidates.push({ k: index + 1, expected, time: time[index + 1], throughput: expected / time[index + 1] });
  });
  const best = candidates.reduce((a, b) => b.throughput > a.throughput ? b : a);
  return { rates, candidates, best };
}
export function cacheReplay(length: number, hit: number, cached: boolean, block: number, margin: number) {
  const cap = Math.max(0, length - margin);
  const maxHit = Math.floor(cap / block) * block;
  const alignedHit = Math.max(0, Math.min(maxHit, Math.floor(hit / block) * block));
  const start = cached ? alignedHit : Math.max(0, alignedHit - block);
  return { cap, maxHit, hit: alignedHit, start, replay: alignedHit - start };
}
export function timelineModel(async: boolean, durations: { cpuSchedule: number; forward: number; sample: number; post: number }) {
  const gpu = durations.forward + durations.sample;
  const cpu = durations.cpuSchedule + durations.post;
  const total = async ? Math.max(gpu, cpu) : gpu + cpu;
  return { total, idle: (total - gpu) / total, gpu, cpu };
}

export function kvSize(tokens: number, layers: number, heads: number, dimension: number, bytes: number) {
  const values=[tokens,layers,heads,dimension,bytes];
  if(values.some(n=>!Number.isFinite(n)||n<0)) throw new RangeError('KV dimensions must be finite and nonnegative');
  const size=2*values.reduce((a,b)=>a*b,1);
  return {bytes:size,readBytes:size};
}
export function generationFrame(step: number, promptTokens: number, outputTokens: number) {
  const generated=Math.max(0,Math.min(outputTokens,Math.floor(step)));
  return {generated,visible:promptTokens+generated,cached:generated===0?0:promptTokens+generated-1,done:generated===outputTokens};
}
