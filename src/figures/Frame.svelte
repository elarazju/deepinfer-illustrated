<script lang="ts">
  import type { Snippet } from 'svelte';
  let { kind, label, height = 410, children }: {
    kind: string; label: string; height?: number; children: Snippet;
  } = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" class="diagram" data-figure={kind}
  viewBox={`0 0 840 ${height}`} role="img" aria-label={label}>
  <title>{label}</title>
  <defs>
    <marker id={`arrow-${kind}`} viewBox="0 0 10 10" refX="9" refY="5"
      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke"/>
    </marker>
    <pattern id={`dots-${kind}`} width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r=".7" fill="var(--line)"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="var(--surface)"/>
  <rect width="100%" height="100%" fill={`url(#dots-${kind})`} opacity=".65"/>
  {@render children()}
</svg>
