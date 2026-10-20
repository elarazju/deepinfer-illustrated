<script lang="ts">
  import { facts, sourceUrl, type Locale, dictionaries } from './data';
  let { id, locale = 'zh' }: { id: string; locale?: Locale } = $props();
  let fact = $derived(facts[id]);
  let t = $derived(dictionaries[locale]);
</script>

{#if fact && fact.status !== 'unverified'}
  <a class:inferred={fact.status === 'inferred'} class:background={fact.source === 'background'} class="fact-badge"
    href={sourceUrl(fact)} target="_blank" rel="noreferrer"
    title={`${fact.source === 'qa_pdf' ? (locale === 'zh' ? '第 ' : 'Page ') + (fact.ref.match(/\d+(?:[–−-]\d+)?/)?.[0] ?? '') + (locale === 'zh' ? ' 页 · ' : ' · ') : ''}${fact.ref} · ${fact.status} · ${id}`}
    aria-label={`${t.source}: ${fact.ref} (${fact.status})`}>
    <span aria-hidden="true">↗</span>
    {fact.status === 'inferred' ? t.inferred : fact.source === 'background' ? t.background : fact.source === 'qa_pdf' ? t.qa : t.code}
    {#if fact.source === 'qa_pdf'}<span class="source-page">{fact.ref.match(/^pp?\.\d+(?:[–−-]\d+)?/)?.[0]}</span>{/if}
  </a>
{/if}
