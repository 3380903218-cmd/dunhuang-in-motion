/* Measure the real header and controls instead of clipping a fixed-height workspace. */
(() => {
  'use strict';
  const root=document.documentElement,header=document.querySelector('.site-header'),exhibition=document.getElementById('exhibition');
  let pending=0,previous='';
  const height=selector=>document.querySelector(selector)?.getBoundingClientRect().height||0;
  function refresh(){
    const viewport=Math.floor(window.visualViewport?.height||innerHeight),head=Math.ceil(header.getBoundingClientRect().height);
    const mapControls=height('#exhibition .map-toolbar')+height('#exhibition .timeline');
    const networkControls=height('#networkShell .network-toolbar')+height('#networkShell .network-advanced')+height('.network-legend-row');
    const values=[viewport,head,Math.max(260,Math.min(600,Math.floor(viewport-head-mapControls-28))),Math.max(300,Math.min(600,Math.floor(viewport-head-networkControls-28)))];
    if(values.join('/')===previous)return;previous=values.join('/');
    ['--viewport-height','--header-height','--map-visual-height','--network-visual-height'].forEach((key,i)=>root.style.setProperty(key,values[i]+'px'));
    // The map and Gephi renderer already respond to this event without changing their data.
    window.dispatchEvent(new Event('resize'));
  }
  function schedule(){cancelAnimationFrame(pending);pending=requestAnimationFrame(refresh);}
  const observer=new ResizeObserver(schedule);
  [header,exhibition.querySelector('.map-toolbar'),exhibition.querySelector('.timeline'),document.querySelector('.network-toolbar'),document.querySelector('.network-advanced'),document.querySelector('.network-legend-row')].forEach(n=>{if(n)observer.observe(n);});
  window.addEventListener('resize',schedule);window.visualViewport?.addEventListener('resize',schedule);window.addEventListener('dunhuang:language',schedule);
  window.DUNHUANG_READING_LAYOUT={refresh};refresh();
  if(location.hash){requestAnimationFrame(()=>requestAnimationFrame(()=>{try{document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({block:'start',behavior:'instant'});}catch{}}));}
})();
