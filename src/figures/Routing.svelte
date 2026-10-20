<script lang="ts">
  import { dictionaries, type Locale } from '../lib/data';
  import Frame from './Frame.svelte';
  import Box from './Box.svelte';
  import Edge from './Edge.svelte';
  let { locale }: { locale: Locale } = $props();
  const kind = 'routing';
  let t = $derived(dictionaries[locale]);
  let labels = $derived(t.figures.routing);
</script>
<Frame {kind} label={labels.caption}>

    <Box x={25} y={160} w={165} h={70} label={labels.request} color={'cpu'}/>
    <path d="M 190 195 H 230 V 75 H 270 M 230 195 H 270 M 230 195 V 315 H 270" class="edge network" />
    {#each [{label: labels.tiers, target: labels.prefill}, {label: labels.decodeCost, target: labels.decode}, {label: labels.patches, target: labels.encoder}] as item, i}
      <Box x={280} y={40+i*120} w={300} h={70} label={item.label} color={'closed'} closed={true}/>
      <Edge kind="routing" x1={580} y1={75+i*120} x2={640} y2={75+i*120}/>
      <Box x={650} y={40+i*120} w={165} h={70} label={item.target}/>
    {/each}
    <text x="430" y="103" text-anchor="middle" class="small" style="font-size:12px">{t.figureNotes.tiers}</text>
    <text x="430" y="135" text-anchor="middle" class="small">{t.figureNotes.cost}</text>
</Frame>
