<script lang="ts">
  import { terms, dictionaries, type Locale } from './data';
  import FactBadge from './FactBadge.svelte';
  let {id,label='',locale}: {id:string;label?:string;locale:Locale}=$props();
  const uid=$props.id();
  let entry=$derived(terms[id]);
  let t=$derived(dictionaries[locale].glossaryUi);
  let open=$state(false), pinned=$state(false), dismissed=$state(false);
  let left=$state(12), top=$state(100);
  let wrapper:HTMLSpanElement, trigger:HTMLButtonElement;
  function show(){
    if(dismissed)return;
    const rect=trigger.getBoundingClientRect();
    const width=Math.min(360,innerWidth-24);
    left=Math.max(12,Math.min(rect.left,innerWidth-width-12));
    top=rect.bottom+8;
    if(top+230>innerHeight)top=Math.max(12,rect.top-Math.min(230,innerHeight*.45));
    open=true;
  }
  function close(restore=false){
    open=false;pinned=false;dismissed=true;
    if(restore)trigger.focus();
  }
  function outside(event:PointerEvent){if(open&&!wrapper.contains(event.target as Node))close();}
  function blur(event:FocusEvent){if(!wrapper.contains(event.relatedTarget as Node)){open=false;pinned=false;dismissed=false;}}
</script>
<svelte:window onpointerdown={outside} onkeydown={(event)=>{if(event.key==='Escape'&&open){event.preventDefault();close(true);}}} onscroll={()=>{if(open)show();}} onresize={()=>{if(open)show();}}/>
<span role="group" class="term-wrap" bind:this={wrapper} onfocusout={blur}
  onpointerenter={()=>{dismissed=false;show();}} onpointerleave={()=>{if(!pinned && !wrapper.contains(document.activeElement))open=false;}}>
  <button bind:this={trigger} type="button" class="term" data-term={id}
    aria-describedby={open?`${uid}-description`:undefined} aria-expanded={open} aria-controls={`${uid}-card`}
    onfocus={show} onclick={()=>{dismissed=false;pinned=!pinned;show();}}>{label||entry[locale].term}</button>
  {#if open}
    <span class="term-popover" id={`${uid}-card`} role="dialog" aria-label={entry[locale].term} style={`left:${left}px;top:${top}px`}>
      <strong>{entry[locale].term}</strong>
      <span id={`${uid}-description`}>{entry[locale].short}</span>
      <a tabindex="0" href={`#term-${id}`} onclick={()=>close()}>{t.view} →</a>
      <span class="term-sources">{#each entry.refs as ref}<FactBadge id={ref} {locale}/>{/each}</span>
      <button type="button" class="term-close" onclick={()=>close(true)} aria-label={t.close}>×</button>
    </span>
  {/if}
</span>
