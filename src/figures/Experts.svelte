<script lang="ts">
  import { dictionaries, facts, type Locale } from '../lib/data';
  import Frame from './Frame.svelte';
  let { locale }: { locale: Locale } = $props();
  const kind = 'experts';
  let t = $derived(dictionaries[locale]);
  let labels = $derived(t.figures.experts);
  const pe = facts['eplb.prefill'].values!;
  const de = facts['eplb.decode'].values!;
</script>
<Frame {kind} label={labels.caption}>

    <text x="420" y="35" text-anchor="middle" class="label">{labels.workflow}</text>
    {#each [0,1,2,3] as row}
      <text x="35" y={84+row*51} class="small">{labels.device} {String.fromCharCode(65+row)}</text>
      {#each [0,1,2,3,4,5] as col}
        {@const replica = col === 5}
        <g class="node gpu">
          <rect x={155+col*100} y={58+row*51} width="86" height="39" rx="6" class:replica />
          <text x={198+col*100} y={83+row*51} text-anchor="middle" class="mono">
            {replica ? 'E★' : `E${row*5+col}`}
          </text>
        </g>
      {/each}
    {/each}
    <text x="420" y="278" text-anchor="middle" class="small">E★ = {labels.replica} · {labels.caption}</text>
    <text x="420" y="310" text-anchor="middle" class="small">{t.figureNotes.eplbColumns}</text>
    <text x="420" y="339" text-anchor="middle" class="mono">Prefill: {pe.redundant} / {pe.window} / {pe.interval} · moe_lb {pe.moeEP4} / {pe.moeEP2}</text>
    <text x="420" y="368" text-anchor="middle" class="mono">Decode: {de.redundant} / {de.window} / {de.interval} · moe_lb {de.moe.toFixed(3)}</text>
    <text x="420" y="397" text-anchor="middle" class="small">{t.figureNotes.moeDefinition}</text>
</Frame>
