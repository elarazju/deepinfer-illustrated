<script lang="ts">
  import { line, scaleLinear } from 'd3';
  import { dictionaries, database, facts, type Locale } from '../lib/data';
  import { evaluateDrafts } from '../lib/models';
  import FactBadge from '../lib/FactBadge.svelte';
  let { locale }: { locale: Locale } = $props();
  let t = $derived(dictionaries[locale]);
  const defaults = database.demo_defaults.dspark;
  let confidence = $state([...defaults.confidence]);
  let dynamic = $state(defaults.mode === 'dynamic');
  let model = $derived(evaluateDrafts(confidence, defaults.stepTime));
  let selected = $derived(dynamic ? model.best : model.candidates.at(-1)!);
  let x = $derived(scaleLinear().domain([0, confidence.length]).range([45, 605]));
  let y = $derived(scaleLinear().domain([0, Math.max(...model.candidates.map(c=>c.throughput), ...defaults.stepTime)*1.15]).range([190,25]));
  let ratePath = $derived(line<(typeof model.candidates)[number]>().x(d=>x(d.k)).y(d=>y(d.throughput))(model.candidates));
  let timePath = $derived(line<(typeof model.candidates)[number]>().x(d=>x(d.k)).y(d=>y(d.time))(model.candidates));
</script>

<section class="demo" id="dspark">
  <div class="demo-heading"><span class="eyebrow">LAB / DSPARK</span><span class="illustrative">{t.illustration}</span></div>
  <h3>{t.dspark.title}</h3><p>{t.dspark.intro}</p>
  <div class="segmented" aria-label={t.dspark.selected}>
    <button class:active={dynamic} aria-pressed={dynamic} onclick={()=>dynamic=true}>{t.dspark.dynamic}</button>
    <button class:active={!dynamic} aria-pressed={!dynamic} onclick={()=>dynamic=false}>{t.dspark.fixed} {confidence.length}</button>
  </div>
  <div class="token-controls">
    {#each confidence as p, i}
      <label class:chosen={i < selected.k}>
        <span class="mono">T{i+1}</span>
        <div class="bar-shell"><span style={`height:${p*100}%`}></span></div>
        <strong>{p.toFixed(2)}</strong>
        <input type="range" min="0" max="1" step=".01" bind:value={confidence[i]} aria-label={`${t.dspark.confidence} T${i+1}`}/>
        <small>{t.dspark.cumulative}<br/><b>{model.rates[i].toFixed(3)}</b></small>
      </label>
    {/each}
  </div>
  <div class="chart-key"><span class="gpu-key">{t.dspark.rate}</span><span class="cpu-key">{t.dspark.time}</span></div>
  <svg class="interactive-chart" viewBox="0 0 650 240" role="img" aria-label={t.dspark.axis}>
    <title>{t.dspark.axis}: {selected.k}; {t.dspark.throughput}: {selected.throughput.toFixed(2)}</title>
    {#each y.ticks(4) as tick}
      <path d={`M45 ${y(tick)} H605`} stroke="var(--line)" />
      <text x="32" y={y(tick)+5} text-anchor="end" class="small">{tick}</text>
    {/each}
    <path d={timePath ?? ''} fill="none" stroke="var(--cpu)" stroke-dasharray="6 5" stroke-width="2"/>
    <path d={ratePath ?? ''} fill="none" stroke="var(--gpu)" stroke-width="3"/>
    {#each model.candidates as candidate}
      <circle cx={x(candidate.k)} cy={y(candidate.throughput)} r={candidate.k === selected.k ? 8 : 4} fill="var(--gpu)" stroke="var(--surface)" stroke-width="2"/>
      <text x={x(candidate.k)} y="214" text-anchor="middle" class="small">{candidate.k}</text>
    {/each}
    <text x="325" y="238" text-anchor="middle" class="small">{t.dspark.axis}</text>
  </svg>
  <div class="metrics" aria-live="polite">
    <div><strong>{selected.k}<small> / {confidence.length}</small></strong><span>{t.dspark.selected}</span></div>
    <div><strong>{selected.expected.toFixed(2)}</strong><span>{t.dspark.expected}</span></div>
    <div><strong>{selected.throughput.toFixed(2)}</strong><span>{t.dspark.throughput}</span></div>
  </div>
  <button class="text-button" onclick={()=>{confidence=[...defaults.confidence];dynamic=true}}>{t.dspark.reset} ↺</button>
  <p class="fact-copy">{facts['dspark.cumulative'][locale]} <FactBadge id="dspark.cumulative" {locale}/></p>
  <aside class="reported"><h4>{t.dspark.reported}</h4><p>{facts['dspark.results'][locale]} <FactBadge id="dspark.results" {locale}/></p></aside>
  <details><summary>{t.dspark.coupling}</summary><p>{facts['dspark.zos'][locale]} <FactBadge id="dspark.zos" {locale}/></p></details>
</section>
