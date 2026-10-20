<script lang="ts">
  import Diagram from './Diagram.svelte';
  import FactBadge from '../lib/FactBadge.svelte';
  import { dictionaries, type Locale } from '../lib/data';
  let { kind, locale, number, source, theme }: { kind: string; locale: Locale; number: string; source: string; theme: string } = $props();
  let t = $derived(dictionaries[locale]);
</script>
<figure>
  <div class="figure-top"><span class="mono">{t.figure} {number}</span><FactBadge id={source} {locale}/></div>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex (keyboard users must be able to scroll the diagram region) -->
  <div class:wide-figure={kind !== 'overview'} class="figure-viewport" tabindex={kind !== 'overview' ? 0 : undefined} role="region" aria-label={t.download}>
    <Diagram {kind} {locale}/>
  </div>
  {#if kind !== 'overview'}<p class="figure-scroll-hint">{t.scrollFigure} ↔</p>{/if}
  <figcaption>
    <span>{kind === 'overview' ? t.overviewSub : t.figures[kind as keyof typeof t.figures]?.caption}</span>
    <span class="downloads">{t.download}
      <a download href={`${import.meta.env.BASE_URL}figures/${kind}-${locale}-${theme}.svg`}>SVG ↘</a>
      <a download href={`${import.meta.env.BASE_URL}figures/${kind}-${locale}-${theme}.png`}>PNG ↘</a>
    </span>
  </figcaption>
</figure>
