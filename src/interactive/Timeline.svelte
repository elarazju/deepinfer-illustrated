<script lang="ts">
  import { onMount } from 'svelte';
  import { safeMedia } from '../lib/browser';
  import { database, dictionaries, type Locale } from '../lib/data';
  import { timelineModel } from '../lib/models';
  import FactBadge from '../lib/FactBadge.svelte';
  let { locale }: { locale: Locale } = $props();
  let t = $derived(dictionaries[locale]);
  const defaults = database.demo_defaults.timeline;
  let async = $state(defaults.async);
  let progress = $state(0);
  let playing = $state(false);
  let reduced = $state(false);
  let model = $derived(timelineModel(async, defaults));
  onMount(()=>{
    const mq = safeMedia('(prefers-reduced-motion: reduce)');
    const update=()=>{reduced=mq.matches;if(reduced)playing=false;};
    update();mq.addEventListener('change',update);
    let handle: number; let last=0;
    function tick(time:number) {
      if (playing && !reduced && last) progress=(progress+(time-last)/70)%100;
      last=time;handle=requestAnimationFrame(tick);
    }
    handle=requestAnimationFrame(tick);
    return ()=>{cancelAnimationFrame(handle);mq.removeEventListener('change',update);};
  });
  let gpuStart=$derived(async?0:defaults.cpuSchedule);
  const scale=560;
</script>
<section class="demo">
  <div class="demo-heading"><span class="eyebrow">LAB / ZOS</span><span class="illustrative">{t.illustration}</span></div>
  <h3>{t.timeline.title}</h3><p>{t.timeline.intro}</p>
  <div class="demo-actions"><div class="segmented"><button class:active={async} aria-pressed={async} onclick={()=>{async=true;progress=0}}>{t.timeline.on}</button><button class:active={!async} aria-pressed={!async} onclick={()=>{async=false;progress=0}}>{t.timeline.off}</button></div><button disabled={reduced} onclick={()=>playing=!playing}>{playing?t.timeline.pause:t.timeline.play} {playing?'Ⅱ':'▷'}</button></div>
  <svg class="interactive-chart" viewBox="0 0 650 190" role="img" aria-label={t.timeline.title}>
    <title>{t.timeline.idle}: {(model.idle*100).toFixed(1)}%</title>
    <text x="12" y="60" class="small">CPU</text><text x="12" y="140" class="small">GPU</text>
    <rect x="70" y="30" width="560" height="45" rx="6" fill="var(--surface-alt)"/>
    <rect x="70" y="110" width="560" height="45" rx="6" fill="var(--surface-alt)"/>
    <rect x="70" y="30" width={scale*defaults.cpuSchedule/model.total} height="45" rx="6" fill="var(--cpu-soft)" stroke="var(--cpu)"/>
    <text x="78" y="58" class="small">{t.figures.timeline.schedule} ({async?'N+1':'N'})</text>
    <rect x={70+scale*(async?defaults.cpuSchedule:defaults.cpuSchedule+model.gpu)/model.total} y="30" width={scale*defaults.post/model.total} height="45" rx="6" fill="var(--cpu-soft)" stroke="var(--cpu)"/>
    <text x={78+scale*(async?defaults.cpuSchedule:defaults.cpuSchedule+model.gpu)/model.total} y="58" class="small">{t.figures.timeline.post} ({async?'N−1':'N'})</text>
    {#if async}
      <path d={`M${70+scale*defaults.cpuSchedule/model.total} 24 V80`} stroke="var(--cpu)" stroke-dasharray="3 3"/>
      <text x={70+scale*defaults.cpuSchedule/model.total} y="19" text-anchor="middle" class="small">{t.figures.timeline.launchForward} (N+1)</text>
      <path d={`M${70+scale*model.cpu/model.total} 24 V80`} stroke="var(--cpu)" stroke-dasharray="3 3"/>
      <text x={70+scale*model.cpu/model.total} y="94" text-anchor="middle" class="small">{t.figures.timeline.launchSample} (N+1)</text>
    {/if}
    <rect x={70+scale*gpuStart/model.total} y="110" width={scale*defaults.forward/model.total} height="45" rx="6" fill="var(--gpu-soft)" stroke="var(--gpu)"/>
    <text x={78+scale*gpuStart/model.total} y="138" class="small">{t.figures.timeline.forward} (N)</text>
    <rect x={70+scale*(gpuStart+defaults.forward)/model.total} y="110" width={scale*defaults.sample/model.total} height="45" rx="6" fill="var(--gpu-soft)" stroke="var(--gpu)"/>
    <text x={78+scale*(gpuStart+defaults.forward)/model.total} y="138" class="small">{t.figures.timeline.sample} (N)</text>
    <path d={`M${70+scale*progress/100} 15 V170`} stroke="var(--highlight)" stroke-width="2"/>
  </svg>
  <input type="range" min="0" max="100" step="1" bind:value={progress} aria-label={t.timeline.scrub}/>
  <div class="timeline-result" aria-live="polite"><strong>{(model.idle*100).toFixed(1)}%</strong><span>{t.timeline.idle}</span></div>
  <p class="small-note">{t.timeline.note}</p>
  {#if reduced}<p>{t.timeline.reduced}</p>{/if}
  <FactBadge id="zos.overlap" {locale}/>
</section>
