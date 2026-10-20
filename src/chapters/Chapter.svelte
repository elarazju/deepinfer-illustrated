<script lang="ts">
  import { chapters, dictionaries, facts, type Locale } from '../lib/data';
  import Figure from '../figures/Figure.svelte';
  import FactBadge from '../lib/FactBadge.svelte';
  import CodeRef from '../lib/CodeRef.svelte';
  import NotOpenSource from '../lib/NotOpenSource.svelte';
  import SWA from '../interactive/SWA.svelte';
  import Timeline from '../interactive/Timeline.svelte';
  let { index, locale, theme }: { index: number; locale: Locale; theme: string } = $props();
  let chapter = $derived(chapters[index]);
  let t = $derived(dictionaries[locale]);
  let copy = $derived(t.chapters[index]);
  let reading = $derived(t.reading[index]);
</script>

{#snippet paragraph(text: string, refs: string[])}
  <p class:inference={refs.some(id=>facts[id].status==='inferred')}>
    {#if refs.some(id=>facts[id].status==='inferred')}<strong class="inference-label">{t.inferred} — </strong>{/if}
    {text} {#each refs as id}<FactBadge {id} {locale}/>{/each}
  </p>
{/snippet}

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
  {#if reading}
    <div class="prose tutorial-opening">
      {#each reading.blocks.slice(0,2) as block}
        {@render paragraph(block.text, block.refs)}
      {/each}
    </div>
  {/if}
  <Figure kind={chapter.figure ?? chapter.id} {locale} number={String(index+1).padStart(2,'0')} source={chapter.facts[0]} {theme}/>
  {#if reading}
    <div class="prose tutorial-body">
      {#each reading.blocks.slice(2) as block}
        <h3>{block.title}</h3>
        {@render paragraph(block.text, block.refs)}
      {/each}
    </div>
  {:else}
    <div class="prose">
      {#each chapter.facts as id}
        {@render paragraph(facts[id][locale], [id])}
      {/each}
    </div>
  {/if}
  {#if chapter.id === 'scheduling'}<Timeline {locale}/>{/if}
  {#if chapter.id === 'yoco'}<SWA {locale}/>{/if}
  <details class="chapter-evidence">
    <summary>{t.evidenceTitle}</summary>
    {#if reading}
      <p>{reading.scope}</p>
      {#each chapter.facts as id}
        {@render paragraph(facts[id][locale], [id])}
      {/each}
    {/if}
    {#if chapter.code}<CodeRef path={chapter.code} line={chapter.line!}/>{/if}
  </details>
  <a href="#journey" class="back-link">{t.back} ↑</a>
</section>
