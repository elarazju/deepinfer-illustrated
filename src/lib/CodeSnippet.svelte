<script lang="ts">
  import {facts,dictionaries,sourceUrl,type Locale} from './data';
  let {id,locale}:{id:string;locale:Locale}=$props();
  let fact=$derived(facts[id]);
  let snippet=$derived(fact.snippet!);
  let t=$derived(dictionaries[locale].chapterUi);
</script>
<figure class="code-snippet" data-snippet={id}>
  <figcaption><strong>{fact[locale]}</strong><a href={sourceUrl(fact)} target="_blank" rel="noreferrer">{fact.ref} ↗</a></figcaption>
  <p>{t.codeScope}</p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex (the code viewport is keyboard scrollable) -->
  <pre tabindex="0" aria-label={fact[locale]}><code>{#each snippet.text.split('\n') as line,i}<span class="code-line"><span class="line-number" aria-hidden="true">{snippet.start+i}</span>{line}{'\n'}</span>{/each}</code></pre>
  <ul class="code-notes">{#each snippet.notes as note}<li><a href={`${sourceUrl(fact).split('#')[0]}#L${note.line}`} target="_blank" rel="noreferrer">L{note.line}</a> — {note[locale]}</li>{/each}</ul>
</figure>
