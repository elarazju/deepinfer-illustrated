<script lang="ts">
  import { glossary, dictionaries, chapters, type Locale } from '../lib/data';
  import FactBadge from '../lib/FactBadge.svelte';
  let {locale}:{locale:Locale}=$props();
  let query=$state('');
  let t=$derived(dictionaries[locale]);
  let filtered=$derived(glossary.filter(entry=>`${entry.id} ${entry.zh.term} ${entry.en.term} ${entry[locale].short}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>a[locale].term.localeCompare(b[locale].term,locale==='zh'?'zh-Hans-CN-u-co-pinyin':'en')));
  function appearances(id:string){
    return chapters.flatMap((chapter,index)=>JSON.stringify(t.reading[(chapter as any).copyIndex??index]).includes(`[[${id}`)?[{id:chapter.id,label:t.chapters[(chapter as any).copyIndex??index].short}]:[]);
  }
</script>
<section id="glossary" class="chapter glossary">
  <h2>{t.glossaryUi.title}</h2><p>{t.glossaryUi.intro}</p>
  <label class="glossary-search">{t.glossaryUi.filter}<input type="search" bind:value={query}/></label>
  <p aria-live="polite">{filtered.length} {t.glossaryUi.results}</p>
  {#each filtered as entry}
    <article id={`term-${entry.id}`} class="glossary-entry">
      <h3>{entry[locale].term}</h3><p><strong>{entry[locale].short}</strong> {entry[locale].long}</p>
      <div>{#each entry.refs as id}<FactBadge {id} {locale}/>{/each}</div>
      <p class="term-occurrences">{t.glossaryUi.appears}
        <a href={`#${entry.first_chapter}`}>{entry.first_chapter==='basics'?t.glossaryUi.basics:entry.first_chapter}</a>
        {#each appearances(entry.id) as chapter}<a href={`#${chapter.id}`}>{chapter.label}</a>{/each}
      </p>
      {#if entry.related.length}<p>{t.glossaryUi.related} {#each entry.related as id}<a href={`#term-${id}`} onclick={()=>query=''}>{glossary.find(e=>e.id===id)![locale].term}</a>{' '}{/each}</p>{/if}
    </article>
  {/each}
</section>
