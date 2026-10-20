<script lang="ts">
  import {dictionaries,type Locale} from '../lib/data';import Frame from './Frame.svelte';
  let {locale}:{locale:Locale}=$props();let t=$derived(dictionaries[locale].figures['basics-prefill-decode']);
</script>
<Frame kind="basics-prefill-decode" label={t.caption} height={370}>
  {#each [false,true] as decode,i}
    {@const x=28+i*420}
    <text {x} y="40" class="label">{decode?t.decode:t.prefill}</text>
    {#each Array.from({length:6},(_,k)=>k) as k}
      <g class={`node ${decode&&k<5?'storage':'gpu'}`}><rect x={x+k*58} y="76" width="48" height="50" rx="5"/><text x={x+k*58+24} y="107" text-anchor="middle">{`t${k}`}</text></g>
    {/each}
    <text {x} y="163" class="small">{decode?t.single:t.many}</text>
    <path d={`M${x+170} 179 V211`} class="edge gpu" marker-end="url(#arrow-basics-prefill-decode)"/>
    <text {x} y="250" class="small">{decode?t.memory:t.compute}</text>
    <text {x} y="289" class="small">{decode?t.kv:t.weights}</text>
  {/each}
</Frame>
