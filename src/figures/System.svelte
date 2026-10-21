<script lang="ts">
  import { dictionaries, facts, type Locale } from '../lib/data';
  import Frame from './Frame.svelte';
  import Box from './Box.svelte';
  import Edge from './Edge.svelte';
  let { locale }: { locale: Locale } = $props();
  const kind = 'system';
  let t = $derived(dictionaries[locale]);
  let labels = $derived(t.figures.system);
  const parallel = facts['system.parallelism'].values!;
  const minimum = facts['system.minimum'].values!;
</script>
<Frame {kind} label={labels.caption}>

    <Box x={35} y={55} w={190} h={80} label={labels.encoder}/>
    <Box x={320} y={55} w={190} h={80} label={labels.prefill}/>
    <Box x={610} y={55} w={190} h={80} label={labels.decode}/>
    <Edge kind="system" x1={225} y1={95} x2={312} y2={95}/>
    <Edge kind="system" x1={510} y1={95} x2={602} y2={95}/>
    <text class="small" x="260" y="68" text-anchor="middle">E → P</text>
    <text class="small" x="557" y="68" text-anchor="middle">P → D</text>
    <text class="mono" x="415" y="166" text-anchor="middle">EP {parallel.prefillMin}–{parallel.prefillMax}</text>
    <text class="mono" x="705" y="166" text-anchor="middle">EP {parallel.decodeMin}–{parallel.decodeMax}</text>
    <text class="small" x="230" y="224" text-anchor="middle">{t.figureNotes.efficient}: {t.figureNotes.efficientUnit.replace('{p}',String(minimum.prefill)).replace('{d}',String(minimum.decode))}</text>
    <Box x={220} y={260} w={400} h={80} label={labels.cache} color={'storage'} closed={true}/>
    <Edge kind="system" x1={415} y1={255} x2={415} y2={180} color={'storage'}/>
    <path d="M 705 185 V 300 H 630" class="edge storage" marker-end={`url(#arrow-${kind})`} />
    <text class="small" x="420" y="380" text-anchor="middle">{labels.caption}</text>
</Frame>
