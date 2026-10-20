<script lang="ts">
  import {dictionaries,type Locale} from './data';
  import {neighbors,sectionTitle,type ReadingPath} from './routes';
  let {id,locale,path=''}:{id:string;locale:Locale;path?:ReadingPath}=$props();
  let t=$derived(dictionaries[locale].paths);
  let adjacent=$derived(neighbors(id,path));
</script>
<nav class="chapter-navigation" aria-label={`${sectionTitle(id,locale)} · ${t.navigation}`}>
  {#if adjacent.previous}<a rel="prev" href={`#${adjacent.previous}`}>← {t.previous}<strong>{sectionTitle(adjacent.previous,locale)}</strong></a>{/if}
  {#if adjacent.next}<a rel="next" href={`#${adjacent.next}`}>{t.next} →<strong>{sectionTitle(adjacent.next,locale)}</strong></a>{:else}<a href="#glossary">{t.finished} →</a>{/if}
</nav>
