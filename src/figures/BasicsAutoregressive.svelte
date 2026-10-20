<script lang="ts">
  import {dictionaries,type Locale} from '../lib/data';
  import Frame from './Frame.svelte';
  let {locale}:{locale:Locale}=$props();
  let t=$derived(dictionaries[locale].figures['basics-autoregressive']);
  const rows=[{y:75,count:4,cached:3},{y:260,count:6,cached:5}];
</script>
<Frame kind="basics-autoregressive" label={t.caption} height={445}>
  {#each rows as row,j}
    <text x="28" y={row.y-30} class="label">{j===0?t.prompt:t.later}</text>
    <text x="28" y={row.y+28} class="small">{t.tokens}</text>
    <text x="28" y={row.y+97} class="small">{t.cache}</text>
    {#each Array.from({length:row.count},(_,i)=>i) as i}
      <g class={`node ${i<3?'cpu':'gpu'}`}><rect x={240+i*86} y={row.y} width="70" height="44" rx="5"/><text x={275+i*86} y={row.y+28} text-anchor="middle">{`t${i}`}</text></g>
      <g class="node storage"><rect x={240+i*86} y={row.y+65} width="70" height="44" rx="5" style={i>=row.cached?'fill:none;stroke-dasharray:4 4':''}/><text x={275+i*86} y={row.y+93} text-anchor="middle">{i<row.cached?'K / V':'…'}</text></g>
    {/each}
    <text x="790" y={row.y+140} text-anchor="end" class="small">{t.pending}</text>
  {/each}
</Frame>
