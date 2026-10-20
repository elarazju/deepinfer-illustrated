<script lang="ts">
  import { dictionaries, type Locale } from '../lib/data';
  import Frame from './Frame.svelte';
  import Box from './Box.svelte';
  import Edge from './Edge.svelte';
  let { locale }: { locale: Locale } = $props();
  const kind = 'recipe';
  let t = $derived(dictionaries[locale]);
  let labels = $derived(t.figures.recipe);
</script>
<Frame {kind} label={labels.caption}>

    {#each [labels.request,labels.encode,labels.engine] as label, i}
      <Box x={25+i*275} y={35} w={240} h={65} label={label} color={i===2?'gpu':'cpu'}/>
      {#if i<2}<Edge kind="recipe" x1={265+i*275} y1={68} x2={292+i*275} y2={68}/>{/if}
    {/each}
    <text x="285" y="130" text-anchor="middle" class="small">{t.figureNotes.encoding}</text>
    <Box x={25} y={170} w={240} h={65} label={labels.constraint} color={'cpu'}/>
    <Box x={300} y={170} w={240} h={65} label={labels.compile} color={'cpu'} closed={true}/>
    <Box x={575} y={170} w={240} h={65} label={labels.mask} color={'gpu'}/>
    <Edge kind="recipe" x1={265} y1={202} x2={292} y2={202}/>
    <Edge kind="recipe" x1={540} y1={202} x2={567} y2={202}/>
    <Edge kind="recipe" x1={695} y1={165} x2={695} y2={108}/>
    <Box x={575} y={300} w={240} h={65} label={labels.parser} color={'cpu'}/>
    <Box x={300} y={300} w={240} h={65} label={labels.response} color={'cpu'}/>
    <path d="M 820 70 H 832 V 332 H 820" class="edge network" />
    <Edge kind="recipe" x1={575} y1={332} x2={548} y2={332}/>
    <text x="420" y="398" text-anchor="middle" class="small">{t.figureNotes.stream}</text>
</Frame>
