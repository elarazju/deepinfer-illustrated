<script lang="ts">
  import { terms, type Locale } from './data';
  import { parseTerms } from './rich-text';
  import Term from './Term.svelte';
  let {text,locale}: {text:string;locale:Locale}=$props();
  let parts=$derived(parseTerms(text));
  $effect(()=>{
    if(import.meta.env.DEV && parts.some(part=>part.term ? !terms[part.term] : part.text.includes('[[')))
      console.warn('Unsupported or unknown term markup:',text);
  });
</script>
{#each parts as part}
  {#if part.term && terms[part.term]}<Term id={part.term} label={part.text} {locale}/>
  {:else}{part.term ? `[[${part.term}${part.text?'|'+part.text:''}]]` : part.text}{/if}
{/each}
