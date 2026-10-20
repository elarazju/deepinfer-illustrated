<script lang="ts">
  import {onMount} from 'svelte';
  import {database,dictionaries,type Locale} from '../lib/data';
  import {generationFrame} from '../lib/models';
  import {safeMedia} from '../lib/browser';
  import FactBadge from '../lib/FactBadge.svelte';
  let {locale}:{locale:Locale}=$props();
  const d=database.demo_defaults.basics;
  let t=$derived(dictionaries[locale].basics);
  let step=$state(0), playing=$state(false);
  let frame=$derived(generationFrame(step,d.promptTokens,d.outputTokens));
  function next(){if(frame.done){playing=false;return;}step+=1;}
  onMount(()=>{
    const mq=safeMedia('(prefers-reduced-motion: reduce)');
    const stop=()=>{if(mq.matches)playing=false;};
    mq.addEventListener('change',stop);
    const timer=setInterval(()=>{if(playing)next();},d.intervalMs);
    return()=>{clearInterval(timer);mq.removeEventListener('change',stop);};
  });
</script>
<section class="demo" id="autoregressive-player">
  <h3>{t.playTitle}</h3><p class="illustrative">{t.scope}</p>
  <div class="segmented">
    <button onclick={()=>{if(frame.done)step=0;playing=!playing;}} aria-pressed={playing}>{playing?t.pause:t.play}</button>
    <button onclick={()=>{playing=false;next();}} disabled={frame.done}>{t.step}</button>
    <button onclick={()=>{playing=false;step=0;}}>{t.reset}</button>
  </div>
  <p aria-live="polite">{t.stage}: {t.stages[frame.done?3:step===0?0:step===1?1:2]}</p>
  <div class="generation-tokens">{#each t.tokens.slice(0,frame.visible) as token,i}
    <span class:cached={i<frame.cached} class:pending={step>0&&i===frame.visible-1}>{token}<small>{i<frame.cached?'K · V':step>0&&i===frame.visible-1?t.pending:t.prompt}</small></span>
  {/each}</div>
  <p>{t.processed}: {frame.cached} <FactBadge id="bg.autoregressive" {locale}/><FactBadge id="bg.kv_cache" {locale}/></p>
</section>
