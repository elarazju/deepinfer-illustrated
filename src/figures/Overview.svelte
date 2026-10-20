<script lang="ts">
  import { onMount } from 'svelte';
  import { safeMedia } from '../lib/browser';
  import { chapters, terms, dictionaries, type Locale } from '../lib/data';
  let { locale, exportMode = false }: { locale: Locale; exportMode?: boolean } = $props();
  const kind = 'overview';
  let t = $derived(dictionaries[locale]);
  let narrow = $state(false);
  onMount(() => {
    const mq = safeMedia('(max-width: 600px)');
    const update = () => narrow = mq.matches && !exportMode;
    update(); mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  });
  let overviewWidth = $derived(narrow ? 400 : 840);
  let overviewHeight = $derived(narrow ? 650 : 380);
  const stages = [
    {id:'recipe', target:'recipe',color:'cpu',closed:false},
    {id:'entrypoint',target:'storage',color:'closed',closed:true},
    {id:'prefill',target:'routing',color:'closed',closed:true},
    {id:'vision',target:'system',color:'gpu',closed:false},
    {id:'yoco',target:'yoco',color:'gpu',closed:false},
    {id:'transfer',target:'storage',color:'network',closed:true},
    {id:'decode',target:'decode-lab',color:'gpu',closed:false},
    {id:'response',target:'recipe',color:'cpu',closed:false},
  ] as const;
  function pos(i: number) {
    if (narrow) return { x: i % 2 === 0 ? 22 : 218, y: 32 + Math.floor(i / 2) * 150 };
    return { x: 20 + (i < 4 ? i : 7 - i) * 208, y: i < 4 ? 35 : 215 };
  }
</script>
{#snippet arrow(x1: number, y1: number, x2: number, y2: number, color = 'network')}
  <path d={`M ${x1} ${y1} L ${x2} ${y2}`} class={`edge ${color}`} marker-end={`url(#arrow-${kind})`} />
{/snippet}

<svg xmlns="http://www.w3.org/2000/svg" class="diagram" data-figure={kind}
  viewBox={kind === 'overview' ? `0 0 ${overviewWidth} ${overviewHeight}` : '0 0 840 410'}
  role={kind === 'overview' ? 'group' : 'img'} >
  <title>{t.overview}</title>
  <defs>
    <marker id={`arrow-${kind}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--network)" />
    </marker>
    <pattern id={`dots-${kind}`} width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="0.7" fill="var(--line)" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="var(--surface)" />
  <rect width="100%" height="100%" fill={`url(#dots-${kind})`} opacity=".65" />


    {#each stages as stage, i}
      {@const station = t.stations[stage.id].label}
      {@const detail = t.stations[stage.id].detail}
      {@const p = pos(i)}
      {@const w = narrow ? 160 : 176}
      {@const color = stage.color}
      {#if i < 7}
        {@const next = pos(i+1)}
        {#if narrow}
          {#if i % 2 === 0}
            {@render arrow(p.x+w, p.y+59, next.x-6, next.y+59)}
          {:else}
            <path d={`M ${p.x+w/2} ${p.y+116} V ${p.y+132} H ${next.x+w/2} V ${next.y-6}`} class="edge network" marker-end={`url(#arrow-${kind})`} />
          {/if}
        {:else if i === 3}
          {@render arrow(p.x+w/2, p.y+116, next.x+w/2, next.y-8)}
        {:else}
          {@render arrow(i < 3 ? p.x+w : p.x, p.y+59, i < 3 ? next.x-7 : next.x+w+7, next.y+59)}
        {/if}
      {/if}
      <a href={`#${stage.target}`}>
        <title>{station} · {t.chapterUi.prereqs}: {(chapters.find(c=>c.id===stage.target)?.prereqs??['prefill-decode','speculative-decoding']).map(id=>terms[id][locale].term).join(', ')}</title>
        <g class={`node ${color} station`} class:closed={stage.closed}>
          <rect x={p.x} y={p.y} width={w} height="116" rx="12" />
          <text class="station-number" x={p.x+15} y={p.y+27}>{String(i+1).padStart(2,'0')}</text>
          {#if narrow && locale==='zh' && i===1}
            <text class="station-name" x={p.x+15} y={p.y+53}>
              <tspan x={p.x+15}>{station.split(' ')[0]}</tspan>
              <tspan x={p.x+15} dy="21">{station.split(' ')[1]}</tspan>
            </text>
          {:else}
            <text class="station-name" x={p.x+15} y={p.y+59}>{station}</text>
          {/if}
          <text class="station-detail" x={p.x+15} y={p.y+(narrow && locale==='zh' && i===1?101:86)}>{detail}</text>
        </g>
      </a>
    {/each}
</svg>
