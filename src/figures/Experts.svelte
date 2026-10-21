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
  const slots = Array.from({length: demo.slots}, (_, i) => i);
  const totals = (rows: typeof demo.before) => rows.map(row=>row.reduce((n,e)=>n+e.load,0));
  const imbalance = (rows: typeof demo.before) => {
    const loads=totals(rows); return Math.max(...loads)/(loads.reduce((a,b)=>a+b,0)/loads.length);
  };
</script>
<Frame {kind} label={labels.caption} height={590}>
  <text x="25" y="32" class="label">{labels.before}</text>
  <text x="335" y="32" class="label">{labels.allocate}</text>
  <text x="565" y="32" class="label">{labels.after}</text>
  <text x="420" y="62" text-anchor="middle" class="small">{labels.toy}</text>
  {#each [demo.before,demo.after] as rows,panel}
    {@const x=panel===0?25:565}
    {#each rows as row,i}
      {@const sum=totals(rows)[i]}
      <text {x} y={100+i*100} class="small">{labels.device} {String.fromCharCode(65+i)} · {sum}</text>
      {#each slots as j}
        {@const expert=row[j]}
        {#if expert}
          {@const hot=expert.load===demo.hotLoad}
          {@const replica=/[′″]/.test(expert.name)}
          <rect x={x+j*82} y={112+i*100} width="76" height="35" rx="6"
            fill={hot?'var(--highlight-soft)':'var(--gpu-soft)'}
            stroke={hot?'var(--highlight)':'var(--gpu)'} stroke-dasharray={replica?'4 3':undefined}/>
          <text x={x+j*82+38} y={135+i*100} text-anchor="middle" class="mono" style="font-size:12px">{expert.name}: {expert.load}</text>
        {:else}
          <rect x={x+j*82} y={112+i*100} width="76" height="35" rx="6" class="idle-block"/>
          <text x={x+j*82+38} y={134+i*100} text-anchor="middle" class="small" style="font-size:12px">{labels.slot}</text>
        {/if}
      {/each}
      <rect {x} y={158+i*100} width="240" height="10" rx="4" fill="var(--line)"/>
      <rect {x} y={158+i*100} width={sum/demo.maxLoad*240} height="10" rx="4" fill={sum===demo.maxLoad?'var(--highlight)':'var(--gpu)'}/>
    {/each}
    <text {x} y="403" class="mono">moe_lb = {imbalance(rows).toFixed(2)}</text>
  {/each}
  {#each demo.replicaGroups as group,g}
    {@const top=112+g*120}
    <text x="420" y={top} text-anchor="middle" class="mono">{group.original}</text>
    {#each group.replicas as replica,r}
      {@const rx=group.replicas.length===1?420:(r===0?365:475)}
      <Edge {kind} x1={420} y1={top+10} x2={rx} y2={top+52}/>
      <text x={rx} y={top+76} text-anchor="middle" class="mono">{replica}</text>
    {/each}
  {/each}
  <text x="420" y="350" text-anchor="middle" class="small">{labels.sameWeights}</text>
  <text x="420" y="376" text-anchor="middle" class="small">{labels.splitLoad}</text>
  <path d="M 25 428 H 815" stroke="var(--line)"/>
  <text x="420" y="462" text-anchor="middle" class="small">{t.figureNotes.eplbColumns}</text>
  <text x="420" y="497" text-anchor="middle" class="mono">Prefill: {pe.redundant} / {pe.window} / {pe.interval} · moe_lb {pe.moeEP4} / {pe.moeEP2}</text>
  <text x="420" y="532" text-anchor="middle" class="mono">Decode: {de.redundant} / {de.window} / {de.interval} · moe_lb {de.moe.toFixed(3)}</text>
  <text x="420" y="568" text-anchor="middle" class="small">{t.figureNotes.moeDefinition}</text>
</Frame>
