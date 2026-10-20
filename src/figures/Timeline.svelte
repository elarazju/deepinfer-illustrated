<script lang="ts">
  import { dictionaries, type Locale } from '../lib/data';
  import Frame from './Frame.svelte';
  let { locale }: { locale: Locale } = $props();
  let labels = $derived(dictionaries[locale].figures.timeline);
  // A shared teaching clock, not production durations. All lanes use this scale.
  const clock = { left: 112, step: 82, count: 8, bar: 44 };
  const x = (unit: number) => clock.left + unit * clock.step;
  const ticks = Array.from({length: clock.count + 1}, (_, i) => i);
  let serial = $derived([
    {lane:'cpu', start:0, span:1.4, text:labels.schedule},
    {lane:'gpu', start:1.4, span:3.8, text:labels.forward},
    {lane:'gpu', start:5.2, span:1.1, text:labels.sample},
    {lane:'cpu', start:6.3, span:1.7, text:labels.post},
  ]);
  let parallel = $derived([
    {start:0, span:1.4, text:labels.schedule, batch:'N+1'},
    {start:1.4, span:1.7, text:labels.post, batch:'N−1'},
  ]);
  let gpu = $derived([
    {start:0,span:3.8,text:labels.forward,batch:'N'},
    {start:3.8,span:1.1,text:labels.sample,batch:'N'},
    {start:4.9,span:3.1,text:labels.forward,batch:'N+1'},
  ]);
</script>

<Frame kind="timeline" label={labels.caption} height={610}>
  {#each [{top:30,title:labels.sync,hint:labels.serialHint}, {top:315,title:labels.async,hint:labels.asyncHint}] as panel,index}
    <text x="28" y={panel.top} class="label">{panel.title}</text>
    <text x="28" y={panel.top+25} class="small">{panel.hint}</text>
    {#each ticks as tick}
      <path d={`M${x(tick)} ${panel.top+49} V${panel.top+207}`} stroke="var(--line)" stroke-dasharray="3 5"/>
      <text x={x(tick)} y={panel.top+226} text-anchor="middle" class="small">{`t${tick}`}</text>
    {/each}
    <text x="28" y={panel.top+91} class="mono">CPU</text>
    <text x="28" y={panel.top+170} class="mono">GPU</text>
    <text x="770" y={panel.top+250} text-anchor="end" class="small">{labels.time}</text>
    {#if index===0}
      {#each [{start:0,span:1.4},{start:6.3,span:1.7}] as idle}
        <rect x={x(idle.start)} y={panel.top+142} width={idle.span*clock.step-4} height={clock.bar} rx="5" class="idle-block"/>
        <text x={x(idle.start+idle.span/2)} y={panel.top+170} text-anchor="middle" class="small">{labels.idle}</text>
      {/each}
      {#each serial as task}
        {@const y=panel.top+(task.lane==='cpu'?64:142)}
        <g class={`node ${task.lane}`}>
          <rect x={x(task.start)} {y} width={task.span*clock.step-4} height={clock.bar} rx="5"/>
          <text x={x(task.start+task.span/2)-2} y={y+28} text-anchor="middle">{task.text}</text>
        </g>
      {/each}
      <path d={`M${x(1.4)-5} ${panel.top+110} V${panel.top+134} M${x(6.3)+10} ${panel.top+140} V${panel.top+115}`} class="edge network" marker-end="url(#arrow-timeline)"/>
    {:else}
      {#each parallel as task}
        <g class="node cpu">
          <rect x={x(task.start)} y={panel.top+64} width={task.span*clock.step-4} height={clock.bar+9} rx="5"/>
          <text x={x(task.start+task.span/2)-2} y={panel.top+85} text-anchor="middle" style="font-size:13px">{task.text}</text>
          <text x={x(task.start+task.span/2)-2} y={panel.top+105} text-anchor="middle" class="mono">{task.batch}</text>
        </g>
      {/each}
      {#each [{at:1.4,label:labels.launchForward}, {at:3.1,label:labels.launchSample}] as launch}
        <circle cx={x(launch.at)} cy={panel.top+118} r="3" fill="var(--cpu)"/>
        <text x={x(launch.at)} y={panel.top+136} text-anchor="middle" style="font-size:11px" fill="var(--cpu)">{launch.label} (N+1)</text>
      {/each}
      {#each gpu as task}
        <g class="node gpu">
          <rect x={x(task.start)} y={panel.top+151} width={clock.step*task.span-4} height={clock.bar} rx="5"/>
          <text x={x(task.start+task.span/2)-2} y={panel.top+179} text-anchor="middle" style={`font-size:${task.span<2?12:16}px`}>{task.text} ({task.batch})</text>
        </g>
      {/each}
      <path d={`M${x(8)-7} ${panel.top+158} l8 15 -8 15`} fill="none" stroke="var(--gpu)" stroke-width="2"/>
    {/if}
  {/each}
</Frame>
