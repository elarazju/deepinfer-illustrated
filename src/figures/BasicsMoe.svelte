<script lang="ts">
  import {dictionaries,type Locale} from '../lib/data';import Frame from './Frame.svelte';import Box from './Box.svelte';import Edge from './Edge.svelte';
  let {locale}:{locale:Locale}=$props();let t=$derived(dictionaries[locale].figures['basics-moe']);const kind='basics-moe';
</script>
<Frame {kind} label={t.caption} height={400}>
  <Box x={28} y={156} w={135} h={56} label={t.token} color="cpu"/>
  <Edge {kind} x1={170} y1={184} x2={212} y2={184}/>
  <Box x={220} y={156} w={140} h={56} label={t.gate}/>
  <text x="460" y="35" class="label">{t.experts}</text>
  {#each [0,1,2,3] as i}
    <Box x={475} y={58+i*76} w={105} h={48} label={`E${i}`} color={i===1||i===2?'gpu':'closed'}/>
    {#if i===1||i===2}<Edge {kind} x1={367} y1={184} x2={468} y2={82+i*76}/><Edge {kind} x1={586} y1={82+i*76} x2={669} y2={184}/>{/if}
  {/each}
  <Box x={675} y={156} w={140} h={56} label={t.combine}/>
  <text x="28" y="365" class="small">{t.selected}</text>
</Frame>
