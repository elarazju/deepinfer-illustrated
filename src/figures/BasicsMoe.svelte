<script lang="ts">
  import {database,dictionaries,type Locale} from '../lib/data';
  import Frame from './Frame.svelte';
  import Box from './Box.svelte';
  import Edge from './Edge.svelte';
  let {locale}:{locale:Locale}=$props();
  let t=$derived(dictionaries[locale].figures['basics-moe']);
  const kind='basics-moe';
  const {scores,k}=database.demo_defaults.moe;
  // Top-k by score; ties are not part of this illustrative example.
  const chosen=new Set([...scores.keys()].sort((a,b)=>scores[b]-scores[a]).slice(0,k));
  const maxScore=Math.max(...scores);
  const rowY=(i:number)=>124+i*62;
  const middle=rowY((scores.length-1)/2);
</script>
<Frame {kind} label={t.caption} height={420}>
  <Box x={20} y={middle-28} w={135} h={56} label={t.token} color="cpu"/>
  <Edge {kind} x1={158} y1={middle} x2={196} y2={middle}/>

  <g class="node gpu"><rect x="202" y="62" width="236" height="290" rx="10"/></g>
  <text x="320" y="92" text-anchor="middle" class="label">{t.gate}</text>
  {#each scores as score,i}
    {@const selected=chosen.has(i)}
    <text x="218" y={rowY(i)+6} class="mono" style="font-size:14px">{`E${i}`}</text>
    <rect x="256" y={rowY(i)-7} width="110" height="14" rx="4" fill="var(--surface)"/>
    <rect x="256" y={rowY(i)-7} width={score/maxScore*110} height="14" rx="4" fill={selected?'var(--gpu)':'var(--closed)'} opacity={selected?1:.55}/>
    <text x="428" y={rowY(i)+5} text-anchor="end" class="mono" style="font-size:13px">{score.toFixed(2)}</text>

    <Box x={500} y={rowY(i)-23} w={110} h={46} label={`E${i}`} color={selected?'gpu':'closed'}/>
    {#if selected}
      <Edge {kind} x1={440} y1={rowY(i)} x2={492} y2={rowY(i)} color="gpu"/>
      <Edge {kind} x1={612} y1={rowY(i)} x2={682} y2={middle} color="gpu"/>
    {:else}
      <text x="620" y={rowY(i)+5} class="small" style="font-size:12px">{t.idle}</text>
    {/if}
  {/each}
  <text x="555" y="42" text-anchor="middle" class="label">{t.experts}</text>

  <Box x={690} y={middle-28} w={130} h={56} label={t.combine}/>
  <text x="755" y={middle+50} text-anchor="middle" class="small" style="font-size:12px">{t.weighted}</text>
  <text x="28" y="398" class="small">{t.rule} · k = {k} · {t.toy}</text>
</Frame>
