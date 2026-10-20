<script lang="ts">
  import { dictionaries, type Locale } from '../lib/data';
  import CodeSnippet from '../lib/CodeSnippet.svelte';
  import { decodeMetadata } from '../lib/chapters';
  import Term from '../lib/Term.svelte';
  import RichText from '../lib/RichText.svelte';
  import DSpark from '../interactive/DSpark.svelte';
  import FactBadge from '../lib/FactBadge.svelte';
  let { locale }: { locale: Locale } = $props();
  let copy = $derived(dictionaries[locale].decodeLab);
</script>

<section id="decode-lab" class="decode-lab">
  <header class="chapter-heading">
    <div class="chapter-index">{decodeMetadata.number}</div>
    <div><p class="eyebrow">DECODE LAB</p><h2>{copy.title}</h2></div>
  </header>
  <p class="chapter-meta">{dictionaries[locale].chapterUi.advanced} · {decodeMetadata.minutes} {dictionaries[locale].chapterUi.minutes}</p>
  <div class="prereqs"><span>{dictionaries[locale].chapterUi.prereqs}:</span><Term id="speculative-decoding" {locale}/><Term id="acceptance" {locale}/></div>
  <div class="prose"><h3>{copy.background.title}</h3><p><RichText text={copy.background.text} {locale}/> {#each copy.background.refs as id}<FactBadge {id} {locale}/>{/each}</p>
    <p><RichText text={copy.intro} {locale}/> <FactBadge id="dspark.method" {locale}/></p>
    <p class="try-prompt"><RichText text={copy.lead} {locale}/> <FactBadge id="dspark.cumulative" {locale}/></p>
  </div>
  <DSpark {locale}/>
  <CodeSnippet id="snippet.decode" {locale}/>
  <div class="takeaways"><h3>{dictionaries[locale].chapterUi.takeaways}</h3><ul>{#each copy.takeaways as item}<li>{item}</li>{/each}</ul></div>
  <p class="lab-scope"><RichText text={copy.scope} {locale}/> <FactBadge id="dspark.zos" {locale}/></p>
</section>
