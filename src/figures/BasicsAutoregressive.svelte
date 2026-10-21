<script lang="ts">
  import {dictionaries,type Locale} from '../lib/data';
  import Frame from './Frame.svelte';
  let {locale}:{locale:Locale}=$props();
  let t=$derived(dictionaries[locale].figures['basics-autoregressive']);
  const kind='basics-autoregressive';
  // Three prompt tokens; each row adds sampled output, and the newest token has no KV yet.
  const prompt=3;
  const rows=[{y:80,count:4},{y:290,count:6}];
  const cellX=(i:number)=>240+i*86;
</script>
<Frame {kind} label={t.caption} height={480}>
  {#each rows as row,j}
    {@const last=row.count-1}
    <text x="28" y={row.y-34} class="label">{j===0?t.prompt:t.later}</text>
    <text x="28" y={row.y+28} class="small">{t.tokens}</text>
    <text x="28" y={row.y+97} class="small">{t.cache}</text>
    {#each Array.from({length:row.count},(_,i)=>i) as i}
      <g class={`node ${i<prompt?'cpu':'gpu'}`}><rect x={cellX(i)} y={row.y} width="70" height="44" rx="5"/><text x={cellX(i)+35} y={row.y+28} text-anchor="middle">{`t${i}`}</text></g>
      {#if i<last}
        <g class="node storage"><rect x={cellX(i)} y={row.y+65} width="70" height="44" rx="5"/><text x={cellX(i)+35} y={row.y+93} text-anchor="middle">K / V</text></g>
      {:else}
        <rect x={cellX(i)} y={row.y+65} width="70" height="44" rx="5" fill="none" stroke="var(--storage)" stroke-dasharray="4 4"/>
        <text x={cellX(i)+35} y={row.y+93} text-anchor="middle" class="small">?</text>
        <path d={`M ${cellX(i)+35} ${row.y+113} V ${row.y+128}`} stroke="var(--muted)"/>
        <text x={cellX(i)+35} y={row.y+146} text-anchor="middle" class="small">{t.pending}</text>
      {/if}
    {/each}
  {/each}
  <path d={`M ${cellX(3)+35} 245 V 278`} class="edge gpu" marker-end={`url(#arrow-${kind})`}/>
  <text x={cellX(3)+48} y="266" class="small">{t.append}</text>
</Frame>
