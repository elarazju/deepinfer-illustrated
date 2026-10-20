<script lang="ts">
  import { dictionaries, type Locale } from '../lib/data';
  import Frame from './Frame.svelte';
  import Box from './Box.svelte';
  import Edge from './Edge.svelte';
  let { locale }: { locale: Locale } = $props();
  const kind = 'model';
  let t = $derived(dictionaries[locale]);
  let labels = $derived(t.figures.model);
</script>
<Frame {kind} label={labels.caption}>

    <Box x={25} y={45} w={210} h={65} label={labels.residual} color={'gpu'}/>
    <Box x={310} y={45} w={210} h={65} label={labels.mhc} color={'gpu'}/>
    <Box x={600} y={45} w={210} h={65} label={labels.engram} color={'storage'}/>
    <Edge kind="model" x1={235} y1={78} x2={302} y2={78}/>
    <Edge kind="model" x1={600} y1={78} x2={528} y2={78}/>
    <Box x={310} y={170} w={210} h={65} label={labels.attention} color={'gpu'}/>
    <Edge kind="model" x1={415} y1={110} x2={415} y2={162}/>
    <Box x={310} y={295} w={210} h={65} label={labels.moe} color={'gpu'}/>
    <Edge kind="model" x1={415} y1={235} x2={415} y2={287}/>
    <Box x={25} y={170} w={210} h={65} label={labels.kv} color={'storage'}/>
    <Edge kind="model" x1={235} y1={202} x2={302} y2={202}/>
    <Box x={600} y={170} w={210} h={65} label={labels.indexer} color={'gpu'}/>
    <Edge kind="model" x1={600} y1={202} x2={528} y2={202}/>
    <text x="130" y="280" text-anchor="middle" class="small">{labels.reuse}</text>
    <text x="420" y="400" text-anchor="middle" class="small">{labels.caption}</text>
</Frame>
