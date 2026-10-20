<script lang="ts">
  import { chapters, dictionaries, facts, terms, type Locale } from '../lib/data';
  import CodeSnippet from '../lib/CodeSnippet.svelte';
  import RichText from '../lib/RichText.svelte';
  import Figure from '../figures/Figure.svelte';
  import FactBadge from '../lib/FactBadge.svelte';
  import CodeRef from '../lib/CodeRef.svelte';
  import NotOpenSource from '../lib/NotOpenSource.svelte';
  import SWA from '../interactive/SWA.svelte';
  import Timeline from '../interactive/Timeline.svelte';
  let { index, locale, theme }: { index: number; locale: Locale; theme: string } = $props();
  let chapter = $derived(chapters[index]);
  let t = $derived(dictionaries[locale]);
  let copy = $derived(t.chapters[chapter.copyIndex]);
  let reading = $derived(t.reading[chapter.copyIndex]);
</script>

{#snippet paragraph(text: string, refs: string[])}
  <p class:inference={refs.some(id=>facts[id].status==='inferred')}>
    {#if refs.some(id=>facts[id].status==='inferred')}<strong class="inference-label">{t.inferred} — </strong>{/if}
    <RichText {text} {locale}/> {#each refs as id}<FactBadge {id} {locale}/>{/each}
  </p>
{/snippet}

<section id={chapter.id} class="chapter">
  <header class="chapter-heading">
    <div class="chapter-index">{chapter.number}</div>
    <div><p class="eyebrow">{copy.short}</p><h2>{copy.title}</h2><p class="chapter-intro"><RichText text={copy.intro} {locale}/></p></div>
  </header>
  <p class="chapter-meta"><strong>{t.chapterUi[chapter.level]}</strong> · {chapter.minutes} {t.chapterUi.minutes}</p>
  <div class="prereqs"><span>{t.chapterUi.prereqs}:</span>{#each chapter.prereqs as id}<a href={`#term-${id}`}>{terms[id][locale].term}</a>{/each}</div>
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
  <Figure kind={chapter.figure ?? chapter.id} {locale} number={chapter.number} source={chapter.facts[0]} {theme}/>
  {#if reading}
    <div class="prose tutorial-body">
      {#each reading.blocks.slice(2) as block}
        <h3>{block.title}</h3>
        {#if block.kind==='example'}<p class="illustrative">{t.chapterUi.example}</p>{/if}
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
  <CodeSnippet id={chapter.snippet} {locale}/>
  <div class="takeaways"><h3>{t.chapterUi.takeaways}</h3><ul>{#each reading.takeaways as item}<li><RichText text={item} {locale}/></li>{/each}</ul><p><strong>{t.chapterUi.next}:</strong> <RichText text={reading.next} {locale}/></p></div>
  <details class="chapter-evidence">
    <summary>{t.evidenceTitle}</summary>
    {#if reading}
      <p><RichText text={reading.scope} {locale}/></p>
      {#each chapter.facts as id}
        {@render paragraph(facts[id][locale], [id])}
      {/each}
    {/if}
    {#if chapter.code}<CodeRef path={chapter.code} line={chapter.line!}/>{/if}
  </details>
  <a href="#journey" class="back-link">{t.back} ↑</a>
</section>
