<script lang="ts">
  import { scaleLinear } from 'd3';
  import { dictionaries, database, facts, type Locale } from '../lib/data';
  import { cacheReplay } from '../lib/models';
  import FactBadge from '../lib/FactBadge.svelte';
  let { locale }: { locale: Locale } = $props();
  let t = $derived(dictionaries[locale]);
  const defaults = database.demo_defaults.swa;
  const { block, margin, window } = facts['yoco.replay'].values!;
  let length = $state(defaults.length);
  let requestedHit = $state(defaults.hit);
  let cached = $state(defaults.cached);
  let position = $state(defaults.hit-1);
  let replayState = $derived(cacheReplay(length, requestedHit, cached, block, margin));
  let query = $derived(Math.max(replayState.start, Math.min(Math.max(replayState.start, replayState.hit-1),position)));
  let left = $derived(Math.max(replayState.start, query-window+1));
  let x = $derived(scaleLinear().domain([0,length]).range([35,615]));
  let ticks = $derived(Array.from({length:Math.floor(length/block)+1},(_,i)=>i*block));
  let blocks = $derived(Array.from({length:Math.ceil(length/block)},(_,i)=>({
    start:i*block, end:Math.min(length,(i+1)*block)
  })));
  let cells = $derived(Array.from({length:replayState.replay},(_,i)=>replayState.start+i));
  const cellLayout = { columns: 16, step: 35, left: 35, top: 34 };
  $effect(()=>{ if (requestedHit !== replayState.hit) requestedHit = replayState.hit; });
</script>
<section class="demo" id="swa">
  <div class="demo-heading"><span class="eyebrow">LAB / SWA</span><span class="illustrative">{t.illustration}</span></div>
  <h3>{t.swa.title}</h3><p>{t.swa.intro}</p>
  <p class="try-prompt">{t.swa.try}</p>
  <div class="range-fields">
    <label>{t.swa.length} <output>{length}</output><input type="range" min={defaults.min} max={defaults.max} step={block} bind:value={length}/></label>
    <label>{t.swa.blockHit} <output>{replayState.hit}</output><input type="range" min="0" max={replayState.maxHit} step={block} bind:value={requestedHit}/></label>
  </div>
  <div class="segmented"><button class:active={cached} aria-pressed={cached} onclick={()=>cached=true}>{t.swa.cached}</button><button class:active={!cached} aria-pressed={!cached} onclick={()=>cached=false}>{t.swa.missing}</button></div>
  <svg class="interactive-chart" viewBox="0 0 650 255" role="img" aria-label={`${t.swa.start}: ${replayState.start}`}>
    <title>{t.swa.limit}: {replayState.cap}; L1: {replayState.hit}; s: {replayState.start}</title>
    <text x="35" y="53" class="small">{t.swa.blocks}</text>
    {#each blocks as cell}
      <rect x={x(cell.start)} y="65" width={Math.max(1,x(cell.end)-x(cell.start)-2)} height="35" rx="3"
        fill={cell.end<=replayState.hit?'var(--storage-soft)':'var(--surface-alt)'}
        stroke={cell.end<=replayState.hit?'var(--storage)':'var(--line)'}/>
    {/each}
    <text x="35" y="149" class="small">{t.swa.restoreState}</text>
    <rect x="35" y="163" width="580" height="28" rx="4" fill="var(--surface-alt)"/>
    <rect x={x(replayState.start)} y="163" width={x(replayState.hit)-x(replayState.start)} height="28" fill="var(--gpu-soft)" stroke="var(--gpu)" stroke-dasharray="4 3"/>
    <path d={`M${x(replayState.hit)} 103 V196`} stroke="var(--storage)" stroke-dasharray="3 4"/>
    <path d={`M${x(replayState.start)} 155 V202`} stroke="var(--gpu)"/>
    {#each ticks as tick}
      <path d={`M${x(tick)} 110 V119`} stroke="var(--muted)"/>
      {#if ticks.length <= 10 || tick % (block*4) === 0}
        <text x={x(tick)} y="128" text-anchor="middle" class="small">{tick}</text>
      {/if}
    {/each}
    <path d={`M${x(replayState.cap)} 30 V110`} stroke="var(--highlight)" stroke-dasharray="5 4"/>
    <text x={Math.min(590, Math.max(100, x(replayState.cap)))} y="23" text-anchor="middle" class="small">L−{margin} = {replayState.cap}</text>
    <text x="325" y="224" text-anchor="middle" class="small">L1 = {replayState.hit} · s = {replayState.start}</text>
    <text x="325" y="247" text-anchor="middle" class="small">{t.swa.replay}: {replayState.replay}</text>
  </svg>
  <div class="chart-key"><span class="storage-key">{t.swa.reuse}</span><span class="gpu-key">{t.swa.replay}</span><span>{t.swa.new}</span></div>
  <div class="metrics" aria-live="polite"><div><strong>{replayState.start}</strong><span>{t.swa.start}</span></div><div><strong>{replayState.replay}</strong><span>{t.swa.replay}</span></div></div>
  {#if replayState.replay > 0}
    <h4>{t.swa.window}</h4>
    <label class="query-range">{t.swa.position} <output>{query}</output><input type="range" min={replayState.start} max={replayState.hit-1} step="1" value={query} oninput={e=>position=+e.currentTarget.value}/></label>
    <p>{t.swa.attentionTitle}</p>
    <svg class="interactive-chart token-window" viewBox={`0 0 650 ${Math.ceil(cells.length/cellLayout.columns)*cellLayout.step+72}`}
      role="img" aria-label={`${t.swa.visible}: ${left}–${query}`}>
      <title>{t.swa.attentionTitle}</title>
      {#each cells as token,i}
        {@const col=i%cellLayout.columns}
        {@const row=Math.floor(i/cellLayout.columns)}
        {@const visible=token>=left&&token<=query}
        <rect x={cellLayout.left+col*cellLayout.step} y={cellLayout.top+row*cellLayout.step} width="28" height="27" rx="4"
          fill={visible?'var(--gpu-soft)':'var(--surface-alt)'}
          stroke={token===query?'var(--highlight)':visible?'var(--gpu)':'var(--line)'}
          stroke-width={token===query?3:1}/>
        {#if col===0}<text x="28" y={cellLayout.top+row*cellLayout.step+18} text-anchor="end" style="font-size:10px" fill="var(--muted)">{token}</text>{/if}
        {#if token===query}<text x={cellLayout.left+col*cellLayout.step+14} y={cellLayout.top+row*cellLayout.step+18} text-anchor="middle" class="small">i</text>{/if}
      {/each}
      <text x="35" y="20" class="small">s = {replayState.start}</text>
      <text x="590" y="20" text-anchor="end" class="small">{t.swa.queryToken} = {query}</text>
    </svg>
    <p class="mono">{t.swa.visible}: [max(s, i−{window-1}), i] = [{left}, {query}]</p>
  {:else if replayState.hit === 0}
    <p>{t.swa.zero}</p>
  {/if}
  <p>{t.swa.note}</p><FactBadge id="swa.hit" {locale}/>
</section>
