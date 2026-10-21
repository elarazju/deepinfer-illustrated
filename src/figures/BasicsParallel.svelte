<script lang="ts">
  import {dictionaries,type Locale} from '../lib/data';
  import Frame from './Frame.svelte';
  import Box from './Box.svelte';
  import Edge from './Edge.svelte';
  let {locale}:{locale:Locale}=$props();
  let t=$derived(dictionaries[locale].figures['basics-parallel']);
  const kind='basics-parallel';
  // One MoE layer on two devices: attention runs data-parallel, experts run expert-parallel.
  const lanes=[{x:250,request:'A',experts:'E0 · E1'},{x:560,request:'B',experts:'E2 · E3'}];
  const w=230, center=(x:number)=>x+w/2;
</script>
<Frame {kind} label={t.caption} height={560}>
  {#each lanes as lane,i}
    <rect x={lane.x-14} y="44" width={w+28} height="470" rx="12" fill="none" stroke="var(--line)" stroke-dasharray="6 5"/>
    <text x={center(lane.x)} y="72" text-anchor="middle" class="mono">{t.device} {i}</text>
    <Box x={lane.x} y={88} w={w} h={44} label={`${t.request} ${lane.request}`} color="cpu"/>
    <Edge {kind} x1={center(lane.x)} y1={134} x2={center(lane.x)} y2={156}/>
    <Box x={lane.x} y={162} w={w} h={50} label={t.attention}/>
    <Box x={lane.x} y={312} w={w} h={50} label={`${t.experts} ${lane.experts}`}/>
    <Box x={lane.x} y={452} w={w} h={44} label={t.next}/>
  {/each}
  <!-- dispatch: each device sends tokens to both expert groups -->
  {#each lanes as from}
    {#each lanes as to}
      <Edge {kind} x1={center(from.x)+(from===to?0:(to.x>from.x?40:-40))} y1={214}
        x2={center(to.x)+(from===to?0:(to.x>from.x?-40:40))} y2={306}/>
      <Edge {kind} x1={center(from.x)+(from===to?0:(to.x>from.x?40:-40))} y1={364}
        x2={center(to.x)+(from===to?0:(to.x>from.x?-40:40))} y2={446}/>
    {/each}
  {/each}

  <text x="28" y="182" class="label">DP</text>
  <text x="28" y="206" class="small" style="font-size:12px">{t.dpNote}</text>
  <text x="28" y="264" class="small" style="font-size:12px">{t.dispatch}</text>
  <text x="28" y="332" class="label">EP</text>
  <text x="28" y="356" class="small" style="font-size:12px">{t.epNote}</text>
  <text x="28" y="414" class="small" style="font-size:12px">{t.combine}</text>
  <text x="420" y="545" text-anchor="middle" class="small" style="font-size:12px">{t.toy}</text>
</Frame>
