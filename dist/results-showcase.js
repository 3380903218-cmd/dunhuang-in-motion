/* QGIS and Gephi are principal results; controls supplement their visible figures. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id),qgis=$('qgisResult'),interactive=$('exhibition');
  const tabs=[...document.querySelectorAll('[data-map-result]')];let mapMode='qgis';
  function showMap(mode){
    if(!['qgis','interactive'].includes(mode))return;
    if(mode==='qgis'&&window.DUNHUANG_EXHIBITION.getState().playing)$('play').click();
    mapMode=mode;mapNote();qgis.hidden=mode!=='qgis';interactive.hidden=mode!=='interactive';
    tabs.forEach(b=>{const on=b.dataset.mapResult===mode;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});
    if(mode==='interactive')requestAnimationFrame(()=>{window.DUNHUANG_READING_LAYOUT.refresh();window.dispatchEvent(new Event('resize'));window.DUNHUANG_EXHIBITION.fitVisible();});
  }
  tabs.forEach((b,i)=>{b.addEventListener('click',()=>showMap(b.dataset.mapResult));b.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?1:1-i;showMap(tabs[next].dataset.mapResult);tabs[next].focus();}});});
  $('returnFullNetwork').addEventListener('click',()=>{window.DUNHUANG_NETWORK_GUIDE.show('all');window.DUNHUANG_READING_LAYOUT.refresh();});
  $('networkTools').addEventListener('toggle',()=>{window.DUNHUANG_READING_LAYOUT.refresh();requestAnimationFrame(()=>window.DUNHUANG_NETWORK_VIEW.fitVisible());});
  function mapNote(){
    const zh=window.DUNHUANG_EXHIBITION.getState().lang==='zh';
    document.querySelector('.map-note').textContent=mapMode==='qgis'?(zh?'原图保留了QGIS导出时的图例与出处。连线示意文献流转和通信的地域联系，不复原实际行程。':'The QGIS export retains its original legend and sources. Lines show geographical links in manuscript circulation and communication, rather than reconstructed itineraries.'):(zh?'网页动画根据项目路线资料绘制；点击地点或线段，可查看日期、所涉材料与出处。连线为示意连接。':'The animated web view uses the project’s route records. Select a place or line for dates, materials and sources; connections are schematic.');
  }
  function language(){
    const lang=window.DUNHUANG_EXHIBITION.getState().lang;mapNote();
    document.querySelectorAll('[data-result-alt-en]').forEach(e=>e.alt=e.dataset[lang==='zh'?'resultAltZh':'resultAltEn']);
    document.querySelector('.result-view-tabs').setAttribute('aria-label',lang==='zh'?'地图成果':'Map results');
    $('networkExplorer').setAttribute('aria-label',lang==='zh'?'Gephi网络成果':'Gephi network result');
  }
  function reveal(hash){
    let target;try{target=document.getElementById(decodeURIComponent(hash.slice(1)));}catch{return;}
    if(target&&(target===interactive||interactive.contains(target)))showMap('interactive');
    if(target?.tagName==='DETAILS')target.open=true;
  }
  document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a)reveal(a.hash);},true);
  window.addEventListener('hashchange',()=>reveal(location.hash));
  window.addEventListener('dunhuang:language',language);
  window.DUNHUANG_SHOWCASE={showMap,getState:()=>({mapMode})};
  showMap('qgis');language();reveal(location.hash);requestAnimationFrame(()=>window.DUNHUANG_NETWORK_VIEW.fitVisible());
})();
