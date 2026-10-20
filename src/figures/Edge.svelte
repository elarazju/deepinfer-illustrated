<script lang="ts">
  let { kind, x1, y1, x2, y2, color = 'network' }: {
    kind: string; x1: number; y1: number; x2: number; y2: number; color?: string;
  } = $props();
</script>

<path d={`M ${x1} ${y1} L ${x2} ${y2}`} class={`edge ${color}`} marker-end={`url(#arrow-${kind})`}/>
