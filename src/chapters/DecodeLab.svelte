<script lang="ts">
  import { dictionaries, type Locale } from '../lib/data';
  import RichText from '../lib/RichText.svelte';
  import DSpark from '../interactive/DSpark.svelte';
  import FactBadge from '../lib/FactBadge.svelte';
  let { locale }: { locale: Locale } = $props();
  let copy = $derived(dictionaries[locale].decodeLab);
</script>

<section id="decode-lab" class="decode-lab">
  <header class="chapter-heading">
    <div class="chapter-index">↳</div>
    <div><p class="eyebrow">DECODE LAB</p><h2>{copy.title}</h2></div>
  </header>
  <div class="prose">
    <p><RichText text={copy.intro} {locale}/> <FactBadge id="dspark.method" {locale}/></p>
    <p class="try-prompt"><RichText text={copy.lead} {locale}/> <FactBadge id="dspark.cumulative" {locale}/></p>
  </div>
  <DSpark {locale}/>
  <p class="lab-scope"><RichText text={copy.scope} {locale}/> <FactBadge id="dspark.zos" {locale}/></p>
</section>
