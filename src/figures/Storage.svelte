<script lang="ts">
  import { dictionaries, facts, type Locale } from '../lib/data';
  import Frame from './Frame.svelte';
  import Box from './Box.svelte';
  import Edge from './Edge.svelte';
  let { locale }: { locale: Locale } = $props();
  const kind = 'storage';
  let t = $derived(dictionaries[locale]);
  let labels = $derived(t.figures.storage);
  const ec = facts['storage.ec'].values!;
  const ttl = facts['storage.ttl'].values!;
</script>
<Frame {kind} label={labels.caption}>

    <text x="28" y="45" class="label">{labels.block}</text>
    {#each [{text: labels.persistent, color: 'storage'}, {text: labels.host, color: 'storage'}, {text: labels.device, color: 'gpu'}] as item, i}
      <Box x={25+i*277} y={70} w={245} h={65} label={item.text} color={item.color} closed={i < 2}/>
      {#if i<2}<Edge kind="storage" x1={270+i*277} y1={102} x2={295+i*277} y2={102}/>{/if}
    {/each}
    <text x="420" y="167" text-anchor="middle" class="small">{labels.overlap} · GDR</text>
    <text x="420" y="193" text-anchor="middle" class="small">EC {ec.data}+{ec.parity} · {t.figureNotes.fanout}: {ec.request} → {ec.response}</text>
    <path d="M 25 205 H 815" stroke="var(--line)" />
    <text x="28" y="247" class="label">{labels.swa}</text>
    {#each [labels.memory,labels.directory,labels.restore] as label, i}
      <Box x={25+i*277} y={280} w={245} h={65} label={label} color={'storage'} closed={true}/>
      {#if i<2}<Edge kind="storage" x1={270+i*277} y1={312} x2={295+i*277} y2={312}/>{/if}
    {/each}
    <text x="420" y="390" text-anchor="middle" class="small">Block KV TTL: agent {ttl.agent} / chatbot {ttl.chatbot} {t.figureNotes.days}</text>
</Frame>
