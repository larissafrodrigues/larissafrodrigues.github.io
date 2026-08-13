
(()=>{
  const T=window.SITE_TRANSLATIONS||{};
  const qs=new URLSearchParams(location.search);
  const initial=qs.get('lang')==='pt'||qs.get('lang')==='pt-BR'?'pt-BR':(qs.get('lang')==='en'?'en':(localStorage.getItem('larissa-lang')||'en'));
  let current=initial;
  const value=(key,lang=current)=>{const v=T[key];return v?(lang==='pt-BR'?v[1]:v[0]):''};
  const themeButton=document.querySelector('.theme-toggle');
  const themeMeta=document.querySelector('meta[name="theme-color"]');
  const themeLabel=(theme,lang=current)=>{
    if(theme==='dark') return lang==='pt-BR'?'Usar modo claro':'Use light mode';
    return lang==='pt-BR'?'Usar modo escuro':'Use dark mode';
  };
  function currentTheme(){return document.documentElement.dataset.theme==='dark'?'dark':'light'}
  function applyTheme(theme,persist=true){
    document.documentElement.dataset.theme=theme;
    if(persist) localStorage.setItem('larissa-theme',theme);
    if(themeMeta) themeMeta.setAttribute('content',theme==='dark'?'#151113':'#fbf9f8');
    if(themeButton){const label=themeLabel(theme);themeButton.setAttribute('aria-label',label);themeButton.setAttribute('title',label);}
  }
  function applyLanguage(lang){
    current=lang; document.documentElement.lang=lang; localStorage.setItem('larissa-lang',lang);
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=value(el.dataset.i18n,lang)});
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{el.placeholder=value(el.dataset.i18nPlaceholder,lang)});
    document.querySelectorAll('[data-en][data-pt]').forEach(el=>{el.textContent=lang==='pt-BR'?el.dataset.pt:el.dataset.en});
    document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
    if(themeButton){const label=themeLabel(currentTheme(),lang);themeButton.setAttribute('aria-label',label);themeButton.setAttribute('title',label);}
    const titles={
      'index.html':['Larissa F. Rodrigues Moreira, PhD','Larissa F. Rodrigues Moreira, Dra.'],
      'about.html':['About — Larissa F. Rodrigues Moreira','Sobre — Larissa F. Rodrigues Moreira'],
      'research.html':['Research — Larissa F. Rodrigues Moreira','Pesquisa — Larissa F. Rodrigues Moreira'],
      'students.html':['Students — Larissa F. Rodrigues Moreira','Orientações — Larissa F. Rodrigues Moreira'],
      'teaching.html':['Teaching — Larissa F. Rodrigues Moreira','Ensino — Larissa F. Rodrigues Moreira'],
      'publications.html':['Publications — Larissa F. Rodrigues Moreira','Publicações — Larissa F. Rodrigues Moreira'],
      'contact.html':['Contact — Larissa F. Rodrigues Moreira','Contato — Larissa F. Rodrigues Moreira']
    };
    const page=document.body.dataset.page||'index.html'; if(titles[page]) document.title=lang==='pt-BR'?titles[page][1]:titles[page][0];
    updatePubCount();
  }
  document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>applyLanguage(b.dataset.lang)));
  themeButton?.addEventListener('click',()=>applyTheme(currentTheme()==='dark'?'light':'dark'));
  const toggle=document.querySelector('.menu-toggle'), nav=document.querySelector('.site-nav');
  if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});}
  document.getElementById('year')?.append(new Date().getFullYear());
  const cards=[...document.querySelectorAll('.publication-card')], search=document.getElementById('pub-search'), year=document.getElementById('pub-year'), buttons=[...document.querySelectorAll('.filter-btn')];
  let activeType='all';
  function filterPubs(){if(!cards.length)return;const q=(search?.value||'').trim().toLowerCase();const y=year?.value||'all';let n=0;cards.forEach(c=>{const okType=activeType==='all'||c.dataset.type===activeType;const okYear=y==='all'||c.dataset.year===y;const okSearch=!q||(c.dataset.search||'').includes(q);const show=okType&&okYear&&okSearch;c.hidden=!show;if(show)n++});updatePubCount(n);document.getElementById('pub-empty')?.classList.toggle('show',n===0)}
  function updatePubCount(n){const el=document.getElementById('pub-count');if(!el)return;if(typeof n!=='number')n=cards.filter(c=>!c.hidden).length;el.textContent=value('pubs.showing').replace('{n}',n)}
  buttons.forEach(b=>b.addEventListener('click',()=>{activeType=b.dataset.type;buttons.forEach(x=>x.classList.toggle('active',x===b));filterPubs()})); search?.addEventListener('input',filterPubs);year?.addEventListener('change',filterPubs);
  applyTheme(currentTheme(),false);applyLanguage(initial);filterPubs();
})();
