<script lang="ts">
  import { onMount } from 'svelte';
  import { chapters, database, dictionaries, type Locale } from './lib/data';
  import Chapter from './chapters/Chapter.svelte';
  import DecodeLab from './chapters/DecodeLab.svelte';
  import Figure from './figures/Figure.svelte';
  import Diagram from './figures/Diagram.svelte';
  import FactBadge from './lib/FactBadge.svelte';
  const params = new URLSearchParams(location.search);
  const storedTheme = localStorage.getItem('di-theme');
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  let explicitTheme = $state(params.has('theme') || storedTheme !== null);
  let locale = $state<Locale>(params.get('lang') === 'en' || (!params.has('lang') && localStorage.getItem('di-language') === 'en') ? 'en' : 'zh');
  let theme = $state(params.get('theme') ?? storedTheme ?? (systemTheme.matches ? 'dark' : 'light'));
  let active = $state('journey');
  let t = $derived(dictionaries[locale]);
  const exportKind = params.get('figure');
  const exportMode = !!exportKind;
  onMount(()=>{
    const requested = params.get('lang') ?? localStorage.getItem('di-language');
    locale = requested === 'en' ? 'en' : 'zh';
    const followSystem = () => { if (!explicitTheme) theme = systemTheme.matches ? 'dark' : 'light'; };
    systemTheme.addEventListener('change', followSystem);
    const observer = new IntersectionObserver(entries=>{
      for(const entry of entries) if(entry.isIntersecting) active=entry.target.id;
    },{rootMargin:'-10% 0px -65% 0px'});
    document.querySelectorAll('main > section').forEach(node=>observer.observe(node));
    return ()=>{ observer.disconnect(); systemTheme.removeEventListener('change', followSystem); };
  });
  $effect(()=>{
    document.documentElement.lang=locale==='zh'?'zh-CN':'en';
    document.documentElement.dataset.theme=theme;
    document.title=locale==='zh'?'图解 DeepInfer · 跟着一个请求走':'DeepInfer Illustrated · Follow a request';
    if(!exportMode){
      localStorage.setItem('di-language',locale);
      const url=new URL(location.href);url.searchParams.set('lang',locale);history.replaceState(null,'',url);
    }
  });
</script>

{#if exportKind}
  <div class="export-canvas"><Diagram kind={exportKind} {locale} exportMode/></div>
{:else}
  <a href="#main" class="skip-link">{t.skip}</a>
  <header class="site-header">
    <a href="#top" class="brand"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>DeepInfer <em>Illustrated</em></span></a>
    <div class="header-actions">
      <span class="edition mono">FIELDNOTES / 001</span>
      <button class="locale-toggle" onclick={()=>locale=locale==='zh'?'en':'zh'} aria-label={locale==='zh'?'Switch to English':'切换至中文'}>{locale==='zh'?'EN':'中文'}</button>
      <button class="theme-toggle" onclick={()=>{theme=theme==='light'?'dark':'light';explicitTheme=true;localStorage.setItem('di-theme',theme);}} aria-label={theme==='light'?t.dark:t.light}>{theme==='light'?'◐':'◑'}</button>
      <a href="https://github.com/elarazju/deepinfer-illustrated" target="_blank" rel="noreferrer" class="repo-link">{t.sourceRepo} ↗</a>
    </div>
  </header>
  <div id="top" class="page-layout">
    <aside class="sidebar">
      <p class="eyebrow">{t.contents}</p>
      <nav aria-label={t.contents}>
        <a href="#journey" class:current={active==='journey'}><span class="mono">00</span>{t.overview}</a>
        {#each chapters as chapter,i}
          <a href={`#${chapter.id}`} class:current={active===chapter.id}><span class="mono">{String(i+1).padStart(2,'0')}</span>{t.chapters[i].short}</a>
          {#if chapter.id === 'scheduling'}<a class="lab-nav" class:current={active==='decode-lab'} href="#decode-lab"><span>↳</span> DSpark · Decode Lab</a>{/if}
        {/each}
      </nav>
      <a href="#dspark" class="sidebar-lab"><span class="lab-dot"></span> DSpark Lab <span>↗</span></a>
      <div class="sidebar-foot"><p>{t.version}</p><a class="mono" href={`${database.repository}/tree/${database.commit}`} target="_blank" rel="noreferrer">{database.commit.slice(0,7)} ↗</a><small>{t.about}</small></div>
    </aside>
    <main id="main">
      <section class="hero" aria-labelledby="hero-title">
        <p class="eyebrow"><span class="live-dot"></span>{t.eyebrow}</p>
        <h1 id="hero-title">{t.heroTitle}</h1>
        <p class="hero-description">{t.heroText}</p>
        <div class="hero-actions"><a class="primary-button" href="#journey">{t.start}<span>↓</span></a><a class="secondary-link" href="#dspark">{t.try} ↗</a></div>
        <div class="hero-meta"><span class="mono">DEEPINFER / {database.commit.slice(0,7)}</span><FactBadge id="release.scope" {locale}/><span>{locale==='zh'?'中文 / EN':'EN / 中文'}</span></div>
      </section>
      <section id="journey" class="journey">
        <div class="section-title"><div><p class="eyebrow">THE BIG PICTURE</p><h2>{t.overview}</h2></div><span class="section-arrow" aria-hidden="true">↘</span></div>
        <Figure kind="overview" {locale} number="00" source="system.disaggregation" {theme}/>
        <div class="legend">
          {#each t.legend as label,i}<span><i class={['cpu','gpu','storage','network','closed'][i]}></i>{label}</span>{/each}
        </div>
      </section>
      {#each chapters as chapter,index}
        <Chapter {index} {locale} {theme}/>
        {#if chapter.id === 'scheduling'}<DecodeLab {locale}/>{/if}
      {/each}
      <footer>
        <p class="eyebrow">DEEPINFER ILLUSTRATED</p><h2>{t.about}</h2><p>{t.aboutText}</p>
        <p class="mono">{t.version}: <a href={`${database.repository}/tree/${database.commit}`}>{database.commit}</a></p>
        <p>{t.license}</p>
        <a href="#top">{t.back} ↑</a>
      </footer>
    </main>
  </div>
{/if}
