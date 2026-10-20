<script lang="ts">
  import { database } from './data';
  let { path, line }: { path: string; line: number } = $props();
</script>
<a class="code-ref" href={`${database.repository}/blob/${database.commit}/${path}#L${line}`} target="_blank" rel="noreferrer">
  <span aria-hidden="true">⌘</span> {path.split('/').at(-1)}:L{line} ↗
</a>
