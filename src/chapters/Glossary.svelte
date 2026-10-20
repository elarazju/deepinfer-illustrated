<script lang="ts">
  import {tick} from 'svelte';
  import {pageOrder,sectionTitle} from '../lib/routes';
  import { glossary, dictionaries, chapters, type Locale } from '../lib/data';
  import FactBadge from '../lib/FactBadge.svelte';
  let {locale}:{locale:Locale}=$props();
  let query=$state('');
  let t=$derived(dictionaries[locale]);
  let filtered=$derived(glossary.filter(entry=>`${entry.id} ${entry.zh.term} ${entry.en.term} ${entry[locale].short}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>a[locale].term.localeCompare(b[locale].term,locale==='zh'?'zh-Hans-CN-u-co-pinyin':'en')));
  function appearances(id:string){
    return pageOrder.filter(section=>{
      if(section==='basics')return JSON.stringify(t.basics).includes(`[[${id}`);
      if(section==='decode-lab')return JSON.stringify(t.decodeLab).includes(`[[${id}`)||['speculative-decoding','acceptance'].includes(id);
      const chapter=chapters.find(c=>c.id===section);
      return chapter&&(chapter.prereqs.some(term=>term===id)||JSON.stringify(t.reading[chapter.copyIndex]).includes(`[[${id}`));
    }).map(section=>({id:section,label:sectionTitle(section,locale)}));
  }
  async function revealHash(){
    if(location.hash.startsWith('#term-')&&query){query='';await tick();document.getElementById(location.hash.slice(1))?.scrollIntoView();}
  }
</script>
<svelte:window onhashchange={revealHash}/>
<section id="glossary" class="chapter glossary">
  <h2>{t.glossaryUi.title}</h2><p>{t.glossaryUi.intro}</p>
  <label class="glossary-search">{t.glossaryUi.filter}<input type="search" bind:value={query}/></label>
  <p aria-live="polite">{filtered.length} {t.glossaryUi.results}</p>
  {#each filtered as entry}
    <article id={`term-${entry.id}`} class="glossary-entry">
      <h3>{entry[locale].term}</h3><p><strong>{entry[locale].short}</strong> {entry[locale].long}</p>
      <div>{#each entry.refs as id}<FactBadge {id} {locale}/>{/each}</div>
      <p class="term-occurrences">{t.glossaryUi.appears}
        {#each appearances(entry.id) as chapter}<a href={`#${chapter.id}`}>{chapter.label}</a>{/each}
      </p>
      {#if entry.related.length}<p>{t.glossaryUi.related} {#each entry.related as id}<a href={`#term-${id}`} onclick={()=>query=''}>{glossary.find(e=>e.id===id)![locale].term}</a>{' '}{/each}</p>{/if}
    </article>
  {/each}
</section>
