<script lang="ts">
  import { onMount } from 'svelte';
  import { dictionaries, stationTargets, facts, type Locale } from '../lib/data';
  let { kind, locale, exportMode = false }: { kind: string; locale: Locale; exportMode?: boolean } = $props();
  let t = $derived(dictionaries[locale]);
  let narrow = $state(false);
  onMount(() => {
    const mq = matchMedia('(max-width: 600px)');
    const update = () => narrow = mq.matches && !exportMode;
    update(); mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  });
  let labels = $derived(t.figures[kind as keyof typeof t.figures] ?? []);
  let overviewWidth = $derived(narrow ? 400 : 840);
  let overviewHeight = $derived(narrow ? 650 : 380);
  const parallel = facts['system.parallelism'].values!;
  const minimum = facts['system.minimum'].values!;
  const pe = facts['eplb.prefill'].values!;
  const de = facts['eplb.decode'].values!;
  const ec = facts['storage.ec'].values!;
  const ttl = facts['storage.ttl'].values!;
  const replay = facts['yoco.replay'].values!;
  function pos(i: number) {
    if (narrow) return { x: i % 2 === 0 ? 22 : 218, y: 32 + Math.floor(i / 2) * 150 };
    return { x: 20 + (i < 4 ? i : 7 - i) * 208, y: i < 4 ? 35 : 215 };
  }
</script>

{#snippet box(x: number, y: number, w: number, h: number, label: string, color = 'gpu', closed = false)}
  <g class={`node ${color}`} class:closed>
    <rect {x} {y} width={w} height={h} rx="10" />
    {#if kind === 'timeline' && /\(N[+−]1\)/.test(label)}
      <text x={x+w/2} y={y+h/2-4} text-anchor="middle" style="font-size:13px">
        <tspan x={x+w/2}>{label.split(' (')[0]}</tspan>
        <tspan x={x+w/2} dy="18">({label.split(' (')[1]}</tspan>
      </text>
    {:else}
      <text x={x+w/2} y={y+h/2+6} text-anchor="middle">{label}</text>
    {/if}
  </g>
{/snippet}
{#snippet arrow(x1: number, y1: number, x2: number, y2: number, color = 'network')}
  <path d={`M ${x1} ${y1} L ${x2} ${y2}`} class={`edge ${color}`} marker-end={`url(#arrow-${kind})`} />
{/snippet}

<svg xmlns="http://www.w3.org/2000/svg" class="diagram" data-figure={kind}
  viewBox={kind === 'overview' ? `0 0 ${overviewWidth} ${overviewHeight}` : '0 0 840 410'}
  role={kind === 'overview' ? 'group' : 'img'} aria-label={kind === 'overview' ? t.overview : labels.join(' → ')}>
  <title>{kind === 'overview' ? t.overview : labels.join(' → ')}</title>
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

  {#if kind === 'overview'}
    {#each t.stations as station, i}
      {@const p = pos(i)}
      {@const w = narrow ? 160 : 176}
      {@const color = ['cpu','closed','closed','gpu','gpu','network','gpu','cpu'][i]}
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
      <a href={`#${stationTargets[i]}`} aria-label={`${station}: ${t.stationDetails[i]}`}>
        <g class={`node ${color} station`} class:closed={i === 1 || i === 2 || i === 5}>
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
          <text class="station-detail" x={p.x+15} y={p.y+(narrow && locale==='zh' && i===1?101:86)}>{t.stationDetails[i]}</text>
        </g>
      </a>
    {/each}
  {:else if kind === 'system'}
    {@render box(35, 55, 190, 80, labels[0])}
    {@render box(320, 55, 190, 80, labels[1])}
    {@render box(610, 55, 190, 80, labels[2])}
    {@render arrow(225,95,312,95)}
    {@render arrow(510,95,602,95)}
    <text class="small" x="260" y="68" text-anchor="middle">E → P</text>
    <text class="small" x="557" y="68" text-anchor="middle">P → D</text>
    <text class="mono" x="415" y="166" text-anchor="middle">EP {parallel.prefillMin}–{parallel.prefillMax}</text>
    <text class="mono" x="705" y="166" text-anchor="middle">EP {parallel.decodeMin}–{parallel.decodeMax}</text>
    <text class="small" x="230" y="224" text-anchor="middle">{t.figureNotes.efficient}: {minimum.prefill}P + {minimum.decode}D</text>
    {@render box(220,260,400,80,labels[3],'storage',true)}
    {@render arrow(415,255,415,180,'storage')}
    <path d="M 705 185 V 300 H 630" class="edge storage" marker-end={`url(#arrow-${kind})`} />
    <text class="small" x="420" y="380" text-anchor="middle">{labels[7]}</text>
  {:else if kind === 'timeline'}
    <text x="28" y="35" class="label">{labels[0]}</text>
    <text x="28" y="245" class="label">{labels[1]}</text>
    <text x="25" y="90" class="mono">CPU</text>
    <text x="25" y="160" class="mono">GPU</text>
    {@render box(100,60,130,46,labels[2],'cpu')}
    {@render box(590,60,190,46,labels[5],'cpu')}
    {@render box(240,130,240,46,labels[3])}
    {@render box(490,130,90,46,labels[4])}
    <rect x="100" y="130" width="130" height="46" rx="8" class="idle-block" />
    <rect x="590" y="130" width="190" height="46" rx="8" class="idle-block" />
    <text x="165" y="159" text-anchor="middle" class="small">{labels[10]}</text>
    <text x="685" y="159" text-anchor="middle" class="small">{labels[10]}</text>
    <text x="25" y="295" class="mono">CPU</text>
    <text x="25" y="365" class="mono">GPU</text>
    {#each [6,7,8,9] as idx, i}
      {@render box(100+i*175,265,165,46,`${labels[idx]} (${idx===8?'N−1':'N+1'})`,'cpu')}
    {/each}
    {@render box(100,335,500,46,`${labels[3]} (N)`)}
    {@render box(610,335,180,46,`${labels[4]} (N)`)}
  {:else if kind === 'experts'}
    <text x="420" y="35" text-anchor="middle" class="label">{labels[3]}</text>
    {#each [0,1,2,3] as row}
      <text x="35" y={84+row*51} class="small">{labels[0]} {String.fromCharCode(65+row)}</text>
      {#each [0,1,2,3,4,5] as col}
        {@const replica = col === 5}
        <g class={`node ${replica ? 'cpu' : 'gpu'}`}>
          <rect x={155+col*100} y={58+row*51} width="86" height="39" rx="6" class:replica />
          <text x={198+col*100} y={83+row*51} text-anchor="middle" class="mono">
            {replica ? 'E★' : `E${row*5+col}`}
          </text>
        </g>
      {/each}
    {/each}
    <text x="420" y="278" text-anchor="middle" class="small">E★ = {labels[2]} · {labels[4]}</text>
    <text x="420" y="310" text-anchor="middle" class="small">{t.figureNotes.eplbColumns}</text>
    <text x="420" y="339" text-anchor="middle" class="mono">Prefill: {pe.redundant} / {pe.window} / {pe.interval} · moe_lb {pe.moeEP4} / {pe.moeEP2}</text>
    <text x="420" y="368" text-anchor="middle" class="mono">Decode: {de.redundant} / {de.window} / {de.interval} · moe_lb {de.moe.toFixed(3)}</text>
    <text x="420" y="397" text-anchor="middle" class="small">{t.figureNotes.moeDefinition}</text>
  {:else if kind === 'yoco'}
    {@render box(25,45,190,65,labels[0],'cpu')}
    {@render arrow(215,78,275,78)}
    <rect x="295" y="55" width="230" height="65" rx="10" fill="var(--gpu-soft)" stroke="var(--gpu)"/>
    {@render box(285,45,230,65,labels[1])}
    {@render arrow(515,78,575,78)}
    {@render box(585,45,230,65,labels[2])}
    <path d="M 700 110 V 180 H 620" class="edge network" marker-end={`url(#arrow-${kind})`} />
    {@render box(330,145,280,70,labels[3],'storage')}
    <path d="M 470 215 V 305 H 560" class="edge storage" marker-end={`url(#arrow-${kind})`} />
    {@render box(25,270,280,70,`${labels[5]} · ${replay.window}`,'cpu')}
    {@render arrow(305,305,560,305)}
    <rect x="580" y="280" width="245" height="70" rx="10" fill="var(--gpu-soft)" stroke="var(--gpu)"/>
    {@render box(570,270,245,70,labels[4])}
    <text x="455" y="267" text-anchor="middle" class="small">{labels[6]}</text>
    <text x="420" y="390" text-anchor="middle" class="small">{labels[7]} / {labels[8]}</text>
  {:else if kind === 'storage'}
    <text x="28" y="45" class="label">{labels[0]}</text>
    {#each [1,2,3] as label, i}
      {@render box(25+i*277,70,245,65,labels[label],i === 2 ? 'gpu' : 'storage',i < 2)}
      {#if i<2}{@render arrow(270+i*277,102,295+i*277,102)}{/if}
    {/each}
    <text x="420" y="167" text-anchor="middle" class="small">{labels[8]} · GDR</text>
    <text x="420" y="193" text-anchor="middle" class="small">EC {ec.data}+{ec.parity} · {t.figureNotes.fanout}: {ec.request} → {ec.response}</text>
    <path d="M 25 205 H 815" stroke="var(--line)" />
    <text x="28" y="247" class="label">{labels[4]}</text>
    {#each [5,6,7] as label, i}
      {@render box(25+i*277,280,245,65,labels[label],'storage',true)}
      {#if i<2}{@render arrow(270+i*277,312,295+i*277,312)}{/if}
    {/each}
    <text x="420" y="390" text-anchor="middle" class="small">Block KV TTL: agent {ttl.agent} / chatbot {ttl.chatbot} {t.figureNotes.days}</text>
  {:else if kind === 'routing'}
    {@render box(25,160,165,70,labels[0],'cpu')}
    <path d="M 190 195 H 230 V 75 H 270 M 230 195 H 270 M 230 195 V 315 H 270" class="edge network" />
    {#each [1,4,6] as label, i}
      {@render box(280,40+i*120,300,70,labels[label],'closed',true)}
      {@render arrow(580,75+i*120,640,75+i*120)}
      {@render box(650,40+i*120,165,70,labels[[3,5,7][i]])}
    {/each}
    <text x="430" y="103" text-anchor="middle" class="small" style="font-size:12px">{t.figureNotes.tiers}</text>
    <text x="430" y="135" text-anchor="middle" class="small">{t.figureNotes.cost}</text>
  {:else if kind === 'recipe'}
    {#each [0,1,2] as label, i}
      {@render box(25+i*275,35,240,65,labels[label],i===2?'gpu':'cpu')}
      {#if i<2}{@render arrow(265+i*275,68,292+i*275,68)}{/if}
    {/each}
    <text x="285" y="130" text-anchor="middle" class="small">{t.figureNotes.encoding}</text>
    {@render box(25,170,240,65,labels[5],'cpu')}
    {@render box(300,170,240,65,labels[6],'cpu',true)}
    {@render box(575,170,240,65,labels[7],'gpu')}
    {@render arrow(265,202,292,202)}
    {@render arrow(540,202,567,202)}
    {@render arrow(695,165,695,108)}
    {@render box(575,300,240,65,labels[3],'cpu')}
    {@render box(300,300,240,65,labels[4],'cpu')}
    <path d="M 820 70 H 832 V 332 H 820" class="edge network" />
    {@render arrow(575,332,548,332)}
    <text x="420" y="398" text-anchor="middle" class="small">{t.figureNotes.stream}</text>
  {:else if kind === 'model'}
    {@render box(25,45,210,65,labels[0],'gpu')}
    {@render box(310,45,210,65,labels[1],'gpu')}
    {@render box(600,45,210,65,labels[4],'storage')}
    {@render arrow(235,78,302,78)}
    {@render arrow(600,78,528,78)}
    {@render box(310,170,210,65,labels[2],'gpu')}
    {@render arrow(415,110,415,162)}
    {@render box(310,295,210,65,labels[3],'gpu')}
    {@render arrow(415,235,415,287)}
    {@render box(25,170,210,65,labels[5],'storage')}
    {@render arrow(235,202,302,202)}
    {@render box(600,170,210,65,labels[6],'network')}
    {@render arrow(600,202,528,202)}
    <text x="130" y="280" text-anchor="middle" class="small">{labels[7]}</text>
    <text x="420" y="400" text-anchor="middle" class="small">{labels[8]}</text>
  {/if}
</svg>
