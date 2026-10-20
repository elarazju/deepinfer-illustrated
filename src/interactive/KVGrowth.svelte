<script lang="ts">
  import {database,dictionaries,type Locale} from '../lib/data';
  import {kvSize} from '../lib/models';
  import FactBadge from '../lib/FactBadge.svelte';
  let {locale}:{locale:Locale}=$props();
  const defaults=database.demo_defaults.basics;
  let length=$state(defaults.length), layers=$state(defaults.layers), dimension=$state(defaults.dimension);
  let t=$derived(dictionaries[locale].basics);
  let size=$derived(kvSize(length,layers,defaults.heads,dimension,defaults.bytes));
  const format=(bytes:number)=>(bytes/1024/1024).toLocaleString(undefined,{maximumFractionDigits:2})+' MiB';
</script>
<section class="demo" id="kv-growth">
  <h3>{t.kvTitle}</h3><p class="illustrative">{t.kvScope}</p>
  <p>{t.kvParameters} <FactBadge id="bg.kv_cache" {locale}/><FactBadge id="bg.representation" {locale}/></p>
  <div class="basics-controls">
    <label>{t.length}: <output>{length}</output><input aria-label={t.length} type="range" min="0" max={defaults.maxLength} step="128" bind:value={length}/></label>
    <label>{t.layers}: <output>{layers}</output><input aria-label={t.layers} type="range" min="1" max={defaults.maxLayers} bind:value={layers}/></label>
    <label>{t.dimension}: <output>{dimension}</output><input aria-label={t.dimension} type="range" min="16" max={defaults.maxDimension} step="16" bind:value={dimension}/></label>
  </div>
  <p>{t.heads}: {defaults.heads} · {t.bytes}: {defaults.bytes}</p>
  <div class="metric-grid" aria-live="polite"><p>{t.size}<strong>{format(size.bytes)}</strong></p><p>{t.read}<strong>{format(size.readBytes)}</strong></p></div>
  <p class="formula">{t.formula} <FactBadge id="bg.kv_cache" {locale}/></p>
</section>
