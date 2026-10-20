<script lang="ts">
  import { dictionaries, database, facts, type Locale } from '../lib/data';
  import Frame from './Frame.svelte';
  import Edge from './Edge.svelte';
  let { locale }: { locale: Locale } = $props();
  const kind = 'experts';
  let t = $derived(dictionaries[locale]);
  let labels = $derived(t.figures.experts);
  const demo = database.demo_defaults.eplb;
  const pe = facts['eplb.prefill'].values!;
  const de = facts['eplb.decode'].values!;
  const totals = (rows: typeof demo.before) => rows.map(row=>row.reduce((n,e)=>n+e.load,0));
  const imbalance = (rows: typeof demo.before) => {
    const loads=totals(rows); return Math.max(...loads)/(loads.reduce((a,b)=>a+b,0)/loads.length);
  };
</script>
<Frame {kind} label={labels.caption} height={570}>
  <text x="25" y="32" class="label">{labels.before}</text>
  <text x="335" y="32" class="label">{labels.allocate}</text>
  <text x="565" y="32" class="label">{labels.after}</text>
  <text x="420" y="62" text-anchor="middle" class="small">{labels.toy}</text>
  {#each [demo.before,demo.after] as rows,panel}
    {@const x=panel===0?25:565}
    {#each rows as row,i}
      {@const sum=totals(rows)[i]}
      <text {x} y={100+i*100} class="small">{labels.device} {String.fromCharCode(65+i)} · {sum}</text>
      {#each row as expert,j}
        <g class:replica={expert.name.includes('′')}>
          <rect x={x+j*82} y={112+i*100} width="76" height="35" rx="6"
            fill={expert.load===demo.hotLoad?'var(--highlight-soft)':'var(--gpu-soft)'}
            stroke={expert.load===demo.hotLoad?'var(--highlight)':'var(--gpu)'}/>
          <text x={x+j*82+38} y={135+i*100} text-anchor="middle" class="mono" style="font-size:12px">{expert.name}: {expert.load}</text>
        </g>
      {/each}
      <rect {x} y={158+i*100} width="240" height="10" rx="4" fill="var(--line)"/>
      <rect {x} y={158+i*100} width={sum/demo.maxLoad*240} height="10" rx="4" fill={sum===demo.maxLoad?'var(--highlight)':'var(--gpu)'}/>
    {/each}
    <text {x} y="403" class="mono">moe_lb = {imbalance(rows).toFixed(2)}</text>
  {/each}
  <text x="420" y="130" text-anchor="middle" class="mono">{demo.original}</text>
  <Edge {kind} x1={420} y1={145} x2={355} y2={220}/>
  <Edge {kind} x1={420} y1={145} x2={485} y2={220}/>
  <text x="355" y="248" text-anchor="middle" class="mono">{demo.replicas[0]}</text>
  <text x="485" y="248" text-anchor="middle" class="mono">{demo.replicas[1]}</text>
  <text x="420" y="290" text-anchor="middle" class="small">{labels.sameWeights}</text>
  <text x="420" y="320" text-anchor="middle" class="small">{labels.splitLoad}</text>
  <text x="420" y="438" text-anchor="middle" class="small">{t.figureNotes.moeDefinition}</text>
  <text x="420" y="476" text-anchor="middle" class="small">{t.figureNotes.eplbColumns}</text>
  <text x="420" y="509" text-anchor="middle" class="mono">Prefill: {pe.redundant} / {pe.window} / {pe.interval} · moe_lb {pe.moeEP4} / {pe.moeEP2}</text>
  <text x="420" y="542" text-anchor="middle" class="mono">Decode: {de.redundant} / {de.window} / {de.interval} · moe_lb {de.moe.toFixed(3)}</text>
</Frame>
