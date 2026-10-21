<script lang="ts">
  import {database,dictionaries,type Locale} from '../lib/data';
  import Frame from './Frame.svelte';
  let {locale}:{locale:Locale}=$props();
  let t=$derived(dictionaries[locale].figures['swa-window']);
  const kind='swa-window';
  const count=database.demo_defaults.swaWindow.length;
  const windowSize=database.demo_defaults.swaWindow.window;
  // The sequence is several windows long so the hidden history is visibly larger than the window.
  const cell=750/count;
  const windowStart=35+(count-windowSize)*cell;
</script>
<Frame {kind} label={t.caption} height={350}>
  <text x="35" y="35" class="label">{t.full}</text>
  <text x="35" y="185" class="label">{t.local}</text>
  {#each [0,1] as row}
    {#each Array.from({length:count-1}) as _,i}
      {@const visible=row===0||i>=count-windowSize}
      <rect x={35+i*cell} y={65+row*150} width={cell*.7} height="38"
        fill={visible?'var(--gpu)':'var(--line)'} opacity={visible?.55:.8}/>
    {/each}
    <!-- The current position is drawn wider than one cell so it stays visible. -->
    <rect x={35+(count-1)*cell-4} y={59+row*150} width="7" height="50" rx="2" fill="var(--highlight)"/>
    <text x="785" y={130+row*150} text-anchor="end" class="mono">i</text>
  {/each}
  <path d={`M ${windowStart} 208 V 262`} stroke="var(--network)" stroke-width="2"/>
  <text x={windowStart} y="284" text-anchor="middle" class="mono">i−{windowSize-1}</text>
  <path d={`M 35 266 H ${windowStart-8}`} fill="none" stroke="var(--muted)" stroke-dasharray="4 4"/>
  <text x={(35+windowStart)/2} y="284" text-anchor="middle" class="small">{t.hidden}</text>
  <text x="420" y="330" text-anchor="middle" class="small">{t.window} {windowSize} · {t.toy}</text>
</Frame>
