<script lang="ts">
  import { chapters, dictionaries, facts, type Locale } from '../lib/data';
  import Figure from '../figures/Figure.svelte';
  import FactBadge from '../lib/FactBadge.svelte';
  import CodeRef from '../lib/CodeRef.svelte';
  import NotOpenSource from '../lib/NotOpenSource.svelte';
  import DSpark from '../interactive/DSpark.svelte';
  import SWA from '../interactive/SWA.svelte';
  import Timeline from '../interactive/Timeline.svelte';
  let { index, locale, theme }: { index: number; locale: Locale; theme: string } = $props();
  let chapter = $derived(chapters[index]);
  let t = $derived(dictionaries[locale]);
  let copy = $derived(t.chapters[index]);
</script>

<section id={chapter.id} class="chapter">
  <header class="chapter-heading">
    <div class="chapter-index">{String(index+1).padStart(2,'0')}</div>
    <div><p class="eyebrow">{copy.short}</p><h2>{copy.title}</h2><p class="chapter-intro">{copy.intro}</p></div>
  </header>
  <p class="question"><span aria-hidden="true">↳</span> {copy.question}</p>
  {#if chapter.closed}<NotOpenSource {locale}/>{/if}
  {#if chapter.id === 'model'}
    <p class="model-notice">{t.modelNote} <a href="https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash" target="_blank" rel="noreferrer">{t.modelSource} ↗</a></p>
  {/if}
  <Figure kind={chapter.figure ?? chapter.id} {locale} number={String(index+1).padStart(2,'0')} source={chapter.facts[0]} {theme}/>
  <div class="prose">
    {#each chapter.facts as id}
      <p class:inference={facts[id].status === 'inferred'} data-fact={id}>
        {#if facts[id].status === 'inferred'}<strong class="inference-label">{t.inferred} — </strong>{/if}
        {facts[id][locale]} <FactBadge {id} {locale}/>
      </p>
    {/each}
    {#if t.reading[index]}
      <details class="chapter-reading">
        <summary>{t.readMore}</summary>
        {#each t.reading[index].text.split('\n\n') as paragraph}
          <p>{paragraph}</p>
        {/each}
        <div class="reading-evidence">{t.references}
          {#each t.reading[index].refs as id}<FactBadge {id} {locale}/>{/each}
        </div>
      </details>
    {/if}
  </div>
  {#if chapter.code}<CodeRef path={chapter.code} line={chapter.line!}/>{/if}
  {#if chapter.id === 'scheduling'}<Timeline {locale}/>{/if}
  {#if chapter.id === 'experts'}
    <div class="dspark-intro"><p>{facts['dspark.method'][locale]} <FactBadge id="dspark.method" {locale}/></p></div>
    <DSpark {locale}/>
  {/if}
  {#if chapter.id === 'yoco'}<SWA {locale}/>{/if}
  <a href="#journey" class="back-link">{t.back} ↑</a>
</section>
