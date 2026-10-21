<script lang="ts">
  import ChapterNav from '../lib/ChapterNav.svelte';
  import type { ReadingPath } from '../lib/routes';
  import {dictionaries,type Locale} from '../lib/data';
  import RichText from '../lib/RichText.svelte';
  import FactBadge from '../lib/FactBadge.svelte';
  import Figure from '../figures/Figure.svelte';
  import KVGrowth from '../interactive/KVGrowth.svelte';
  import Autoregressive from '../interactive/Autoregressive.svelte';
  let {locale,theme,path=''}:{locale:Locale;theme:string;path?:ReadingPath}=$props();
  let t=$derived(dictionaries[locale].basics);
</script>
<section id="basics" class="chapter basics">
  <header class="chapter-heading"><div class="chapter-index">{String(0).padStart(2,'0')}</div><div><h2>{t.title}</h2><p>{t.intro}</p></div></header>
  {#each t.sections as section,i}
    <section id={`basics-${section.id}`} class="basics-section">
      <h3>{section.title}</h3>
      <div class="prose">{#each section.text.split('\n\n') as paragraph}<p><RichText text={paragraph} {locale}/></p>{/each}</div>
      <p>{#each section.refs as id}<FactBadge {id} {locale}/>{/each}</p>
      {#if section.figure}<Figure kind={section.figure} {locale} {theme} number={`00${String.fromCharCode(97+i)}`} source={section.refs[0]}/>{/if}
      {#if section.id==='generation'}<Autoregressive {locale}/>{/if}
      {#if section.id==='cache'}<KVGrowth {locale}/>{/if}
    </section>
  {/each}
  <h3>{t.selfTest}</h3>
  {#each t.questions as item}<details class="self-test"><summary>{item.q}</summary><p><RichText text={item.a} {locale}/></p></details>{/each}
<ChapterNav id="basics" {locale} {path}/>
</section>
