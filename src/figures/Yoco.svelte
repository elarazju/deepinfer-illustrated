<script lang="ts">
  import { dictionaries, facts, type Locale } from '../lib/data';
  import Frame from './Frame.svelte';
  import Box from './Box.svelte';
  let { locale }: { locale: Locale } = $props();
  let labels = $derived(dictionaries[locale].figures.yoco);
  const replay = facts['yoco.replay'].values!;
  const layout = {left:230, step:69, cells:8};
  const tokens = Array.from({length:layout.cells},(_,i)=>i);
</script>

<Frame kind="yoco" label={labels.caption} height={600}>
  <text x="28" y="34" class="label">{labels.fullPath}</text>
  <text x="28" y="91" class="small">{labels.tokens}</text>
  {#each tokens as i}
    <g class="node cpu">
      <rect x={layout.left+i*layout.step} y="62" width="58" height="42" rx="6"/>
      <text x={layout.left+i*layout.step+29} y="89" text-anchor="middle" class="mono">{`t${i}`}</text>
    </g>
  {/each}
  <path d="M 490 108 V 132" class="edge cpu" marker-end="url(#arrow-yoco)"/>
  <Box x={230} y={140} w={310} h={54} label={labels.encoder}/>
  <path d="M 545 167 H 582" class="edge network" marker-end="url(#arrow-yoco)"/>
  <Box x={590} y={140} w={190} h={54} label={labels.hidden}/>
  <path d="M 685 198 V 246" class="edge storage" marker-end="url(#arrow-yoco)"/>
  <text x="670" y="226" text-anchor="end" class="small">{labels.projection}</text>

  <text x="28" y="270" class="label">{labels.cachedPath}</text>
  <text x="28" y="310" class="small">{labels.cache}</text>
  {#each tokens as i}
    <g class="node storage">
      <rect x={layout.left+i*layout.step} y="258" width="58" height="62" rx="6"/>
      <path d={`M ${layout.left+i*layout.step} 289 h58`} stroke="var(--storage)"/>
      <text x={layout.left+i*layout.step+29} y="279" text-anchor="middle" class="mono">{`K${i}`}</text>
      <text x={layout.left+i*layout.step+29} y="311" text-anchor="middle" class="mono">{`V${i}`}</text>
    </g>
  {/each}
  <!-- Route the reuse connection along the outside; the label has its own band. -->
  <path d="M 791 290 H 810 V 523 H 787" class="edge storage" marker-end="url(#arrow-yoco)"/>
  <text x="780" y="355" text-anchor="end" class="small">{labels.reuse}</text>
  <path d="M 28 374 H 780" stroke="var(--line)"/>

  <text x="28" y="408" class="label">{labels.suffix}</text>
  {#each tokens as i}
    <g class={`node ${i>=5?'gpu':'closed'}`} opacity={i>=5?1:.4}>
      <rect x={layout.left+i*layout.step} y="391" width="58" height="40" rx="6"/>
      <text x={layout.left+i*layout.step+29} y="417" text-anchor="middle" class="mono">{`t${i}`}</text>
    </g>
  {/each}
  <path d="M 574 440 V 450 H 778 V 440" class="edge gpu"/>
  <text x="677" y="473" text-anchor="middle" class="small">{labels.replayLength}: {replay.window}</text>
  <Box x={230} y={496} w={250} h={54} label={labels.replay}/>
  <path d="M 570 443 H 355 V 489 M 486 523 H 554" class="edge gpu" marker-end="url(#arrow-yoco)"/>
  <Box x={562} y={496} w={218} h={54} label={labels.decoder}/>
  <text x="420" y="582" text-anchor="middle" class="small">{labels.reuse} + {labels.replay}</text>
</Frame>
