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
  $effect(()=>{ if (requestedHit !== replayState.hit) requestedHit = replayState.hit; });
</script>
<section class="demo" id="swa">
  <div class="demo-heading"><span class="eyebrow">LAB / SWA</span><span class="illustrative">{t.illustration}</span></div>
  <h3>{t.swa.title}</h3><p>{t.swa.intro}</p>
  <div class="range-fields">
    <label>{t.swa.length} <output>{length}</output><input type="range" min={defaults.min} max={defaults.max} step={block} bind:value={length}/></label>
    <label>{t.swa.blockHit} <output>{replayState.hit}</output><input type="range" min="0" max={replayState.maxHit} step={block} bind:value={requestedHit}/></label>
  </div>
  <div class="segmented"><button class:active={cached} aria-pressed={cached} onclick={()=>cached=true}>{t.swa.cached}</button><button class:active={!cached} aria-pressed={!cached} onclick={()=>cached=false}>{t.swa.missing}</button></div>
  <svg class="interactive-chart" viewBox="0 0 650 170" role="img" aria-label={`${t.swa.start}: ${replayState.start}`}>
    <title>{t.swa.limit}: {replayState.cap}; L1: {replayState.hit}; s: {replayState.start}</title>
    <rect x="35" y="65" width="580" height="42" rx="5" fill="var(--surface-alt)"/>
    <rect x="35" y="65" width={x(replayState.hit)-35} height="42" rx="5" fill="var(--storage-soft)" stroke="var(--storage)"/>
    <rect x={x(replayState.start)} y="65" width={x(replayState.hit)-x(replayState.start)} height="42" fill="var(--cpu-soft)" stroke="var(--cpu)" stroke-dasharray="4 3"/>
    {#each ticks as tick}
      <path d={`M${x(tick)} 110 V119`} stroke="var(--muted)"/>
      {#if ticks.length <= 10 || tick % (block*4) === 0}
        <text x={x(tick)} y="139" text-anchor="middle" class="small">{tick}</text>
      {/if}
    {/each}
    <path d={`M${x(replayState.cap)} 30 V110`} stroke="var(--highlight)" stroke-dasharray="5 4"/>
    <text x={Math.min(590, Math.max(100, x(replayState.cap)))} y="23" text-anchor="middle" class="small">L−{margin} = {replayState.cap}</text>
    <text x="325" y="165" text-anchor="middle" class="small">L1 = {replayState.hit} · s = {replayState.start}</text>
  </svg>
  <div class="chart-key"><span class="storage-key">{t.swa.reuse}</span><span class="cpu-key">{t.swa.replay}</span><span>{t.swa.new}</span></div>
  <div class="metrics" aria-live="polite"><div><strong>{replayState.start}</strong><span>{t.swa.start}</span></div><div><strong>{replayState.replay}</strong><span>{t.swa.replay}</span></div></div>
  {#if replayState.replay > 0}
    <h4>{t.swa.window}</h4>
    <label class="query-range">{t.swa.position} <output>{query}</output><input type="range" min={replayState.start} max={replayState.hit-1} step="1" value={query} oninput={e=>position=+e.currentTarget.value}/></label>
    <div class="attention-window"><span>s = {replayState.start}</span><div style={`--window-end:${(query-replayState.start+1)/replayState.replay*100}%`}></div><span>i = {query}</span></div>
    <p class="mono">{t.swa.visible}: [max(s, i−{window-1}), i] = [{left}, {query}]</p>
  {:else if replayState.hit === 0}
    <p>{t.swa.zero}</p>
  {/if}
  <p>{t.swa.note}</p><FactBadge id="swa.hit" {locale}/>
</section>
