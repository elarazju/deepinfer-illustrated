<script lang="ts">
  import { dictionaries, type Locale } from './data';
  let { locale }: { locale: Locale } = $props();
</script>
<p class="not-open"><span aria-hidden="true">▧</span> {dictionaries[locale].notOpen}</p>
