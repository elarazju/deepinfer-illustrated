<script lang="ts">
  import type { Locale } from '../lib/data';
  import Overview from './Overview.svelte';
  import System from './System.svelte';
  import Timeline from './Timeline.svelte';
  import Experts from './Experts.svelte';
  import Yoco from './Yoco.svelte';
  import Storage from './Storage.svelte';
  import Routing from './Routing.svelte';
  import Recipe from './Recipe.svelte';
  import Model from './Model.svelte';
  let { kind, locale, exportMode = false }: { kind: string; locale: Locale; exportMode?: boolean } = $props();
  import BasicsAutoregressive from './BasicsAutoregressive.svelte';
  import BasicsPrefillDecode from './BasicsPrefillDecode.svelte';
  import BasicsMoe from './BasicsMoe.svelte';
  import BasicsParallel from './BasicsParallel.svelte';
  const diagrams = {'basics-autoregressive': BasicsAutoregressive,'basics-prefill-decode': BasicsPrefillDecode,'basics-moe': BasicsMoe,'basics-parallel': BasicsParallel,overview: Overview, system: System, timeline: Timeline, experts: Experts, yoco: Yoco, storage: Storage, routing: Routing, recipe: Recipe, model: Model};
  let Component = $derived(diagrams[kind as keyof typeof diagrams]);
</script>
{#if Component}<Component {locale} {exportMode}/>{/if}
