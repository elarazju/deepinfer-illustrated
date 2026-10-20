<script lang="ts">
  import {database,dictionaries,type Locale} from '../lib/data';
  import Frame from './Frame.svelte';
  let {locale}:{locale:Locale}=$props();
  let t=$derived(dictionaries[locale].figures['swa-window']);
  const kind='swa-window';
  const count=database.demo_defaults.swaWindow.length;
  const windowSize=database.demo_defaults.swaWindow.window;
</script>
<Frame {kind} label={t.caption} height={330}>
  <text x="35" y="35" class="label">{t.full}</text>
  <text x="35" y="175" class="label">{t.local}</text>
  {#each [0,1] as row}
    {#each Array.from({length:count}) as _,i}
      {@const visible=row===0||i>=count-windowSize}
      <rect x={35+i*750/count} y={65+row*140} width={750/count-1} height="38" rx="1"
        fill={i===count-1?'var(--highlight)':visible?'var(--gpu-soft)':'var(--surface-alt)'}
        stroke={visible?'var(--gpu)':'var(--line)'}/>
    {/each}
    <text x="785" y={130+row*140} text-anchor="end" class="mono">i</text>
  {/each}
  <path d={`M ${35+(count-windowSize)*750/count} 195 V 248`} stroke="var(--network)" stroke-width="2"/>
  <text x={35+(count-windowSize)*750/count} y="272" class="mono">i−{windowSize-1}</text>
  <text x="420" y="310" text-anchor="middle" class="small">{t.window} {windowSize} · {t.toy}</text>
</Frame>
