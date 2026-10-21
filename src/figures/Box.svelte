<script lang="ts">
  let { x, y, w, h, label, color = 'gpu', closed = false }: {
    x: number; y: number; w: number; h: number; label: string; color?: string; closed?: boolean;
  } = $props();
</script>

<!-- class:closed would strip a "closed" colour class, so derive it from both props. -->
<g class={`node ${color}`} class:closed={closed || color === 'closed'}>
  <rect {x} {y} width={w} height={h} rx="10"/>
  <text x={x+w/2} y={y+h/2+6} text-anchor="middle">{label}</text>
</g>
