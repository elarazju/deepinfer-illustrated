<script lang="ts">
  import {dictionaries,type Locale} from '../lib/data';import Frame from './Frame.svelte';import Box from './Box.svelte';import Edge from './Edge.svelte';
  let {locale}:{locale:Locale}=$props();let t=$derived(dictionaries[locale].figures['basics-parallel']);const kind='basics-parallel';
</script>
<Frame {kind} label={t.caption} height={400}>
  <text x="28" y="40" class="label">{t.dp}</text><text x="450" y="40" class="label">{t.ep}</text>
  {#each [0,1] as i}
    <Box x={28} y={90+i*125} w={130} h={52} label={`${t.request} ${String.fromCharCode(65+i)}`} color="cpu"/>
    <Edge {kind} x1={165} y1={116+i*125} x2={210} y2={116+i*125}/>
    <Box x={217} y={90+i*125} w={180} h={52} label={t.copy}/>
    <Box x={490+i*170} y={155} w={130} h={75} label={`E${i*2} · E${i*2+1}`}/>
  {/each}
  <text x="450" y="95" class="small">{t.dispatch}</text>
  <Edge {kind} x1={620} y1={110} x2={555} y2={147}/><Edge {kind} x1={620} y1={110} x2={725} y2={147}/>
  <Edge {kind} x1={555} y1={238} x2={620} y2={280}/><Edge {kind} x1={725} y1={238} x2={620} y2={280}/>
  <text x="450" y="320" class="small">{t.combine}</text>
</Frame>
