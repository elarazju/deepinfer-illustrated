<script lang="ts">
  import {dictionaries,type Locale} from '../lib/data';
  import Frame from './Frame.svelte';
  let {locale}:{locale:Locale}=$props();
  let t=$derived(dictionaries[locale].figures['basics-prefill-decode']);
  // Bar lengths are qualitative: both stages read the same weights once per forward pass;
  // prefill computes every prompt position, decode computes one new position but also reads history KV.
  const cells=8, bar=340, weights=150, kv=150;
  const panels=[
    {x:28, decode:false, work:bar},
    {x:448, decode:true, work:bar/cells},
  ];
</script>
<Frame kind="basics-prefill-decode" label={t.caption} height={420}>
  {#each panels as panel}
    {@const x=panel.x}
    <text {x} y="40" class="label">{panel.decode?t.decode:t.prefill}</text>
    {#each Array.from({length:cells},(_,k)=>k) as k}
      {@const cached=panel.decode&&k<cells-1}
      <g class={`node ${cached?'storage':'gpu'}`}><rect x={x+k*43} y="66" width="37" height="40" rx="4"/></g>
    {/each}
    <text {x} y="132" class="small">{panel.decode?t.single:t.many}</text>

    <text {x} y="178" class="small">{t.workBar}</text>
    <rect {x} y="190" width={bar} height="16" rx="4" fill="var(--line)"/>
    <rect {x} y="190" width={panel.work} height="16" rx="4" fill="var(--gpu)"/>

    <text {x} y="242" class="small">{t.readBar}</text>
    <rect {x} y="254" width={weights} height="16" rx="4" fill="var(--muted)" opacity=".55"/>
    <text x={x+8} y="291" class="small" style="font-size:12px">{t.weightPart}</text>
    {#if panel.decode}
      <rect x={x+weights+4} y="254" width={kv} height="16" rx="4" fill="var(--storage)"/>
      <text x={x+weights+12} y="291" class="small" style="font-size:12px">{t.kvPart}</text>
    {/if}
    <text {x} y="318" class="small" style="font-size:12px">{panel.decode?t.kv:t.weights}</text>

    <rect {x} y="340" width="364" height="48" rx="8" fill={panel.decode?'var(--storage-soft)':'var(--gpu-soft)'} stroke={panel.decode?'var(--storage)':'var(--gpu)'}/>
    <text x={x+182} y="370" text-anchor="middle" style="font-size:16px">{panel.decode?t.memory:t.compute}</text>
  {/each}
  <text x="420" y="410" text-anchor="middle" class="small" style="font-size:12px">{t.scale}</text>
</Frame>
