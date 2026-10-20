<script lang="ts">
  import { facts, sourceUrl, type Locale, dictionaries } from './data';
  let { id, locale = 'zh' }: { id: string; locale?: Locale } = $props();
  let fact = $derived(facts[id]);
  let t = $derived(dictionaries[locale]);
</script>

{#if fact && fact.status !== 'unverified'}
  <a class:inferred={fact.status === 'inferred'} class="fact-badge"
    href={sourceUrl(fact)} target="_blank" rel="noreferrer"
    title={`${fact.ref} · ${fact.status} · ${id}`}
    aria-label={`${t.source}: ${fact.ref} (${fact.status})`}>
    <span aria-hidden="true">↗</span>
    {fact.status === 'inferred' ? t.inferred : fact.source === 'qa_pdf' ? t.qa : t.code}
  </a>
{/if}
