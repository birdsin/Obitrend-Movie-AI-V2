/* UI-only helpers. Existing Movie AI generation logic remains in index.html. */
(()=>{"use strict";
function closeDrawer(){const d=document.getElementById("phase3Drawer"),s=document.getElementById("phase3Shade"),m=document.getElementById("phase3MenuBtn");if(d)d.classList.remove("open");if(s)s.classList.remove("open");if(m)m.setAttribute("aria-expanded","false");document.body.classList.remove("drawer-open");}
window.closeDrawer=window.closeDrawer||closeDrawer;
document.addEventListener("click",e=>{if(e.target.closest("#phase3Close,#phase3Shade")){closeDrawer();return;}const nav=e.target.closest("#phase3Drawer button,#phase3Drawer a");if(nav)closeDrawer();const x=e.target.closest(".ob-thumb-remove");if(x){const fig=x.closest(".ob-reference-thumb");if(fig)fig.remove();}});
const prompt=document.getElementById("p3QuickPrompt"),counter=document.getElementById("obPromptCount");
function count(){if(prompt&&counter)counter.textContent=prompt.value.length+"/1000";}
if(prompt){prompt.maxLength=1000;prompt.addEventListener("input",count);count();}
window.addEventListener("pageshow",()=>{const d=document.getElementById("phase3Drawer");if(d&&!d.classList.contains("open"))closeDrawer();});

const menuGroups=[
 {title:"MAIN NAVIGATION",items:[["Home","home"],["My Production","history"],["My Credits","obitrend-credits"],["Explore","explore"],["Compare","compare"]]},
 {title:"GENERATE VISUALS",items:[["Video Generator","video-generator"],["Image Generator","image-generator"],["3D Generator","3d-generator"]]},
 {title:"GENERATE AUDIO",items:[["Text to Speech","text-to-speech"],["Voice Cloning","voice-cloning"],["Music Generator","music"]]},
 {title:"CREATOR STUDIO",items:[["Stop Motion Studio","stop-motion"],["Long Video Generator","long-video"],["Story Creator","story"],["Montage Studio","montage"],["Manga Creator","manga"],["Motion Control","motion"],["Motion Poster","poster"],["Motion Type Studio","motion-type"],["Thumbnail Generator","thumbnail"],["Social Media Posts","social"]]},
 {title:"EDIT & ENHANCE",items:[["Video Tools","video-tools"],["Image Tools","image-tools"],["Lip Sync Video","lip-sync-video"],["Auto Captions","auto-captions"]]},
 {title:"BRAND & SELLING",items:[["Logo Generation","logo-generation"],["AI Headshots","ai-headshots"],["AI Avatar","ai-avatar"],["Product Mockup","product-mockup"],["Virtual Try-On","virtual-try-on"],["Book Cover","book-cover"],["Meme Generator","meme-generator"],["QR Code Art","qr-code-art"],["Landing Page","landing-page"],["Background Generator","background-generator"],["Pattern Generator","pattern-generator"]]}
];
const iconByKey={"home":"⌂","history":"▣","obitrend-credits":"▤","explore":"⌕","compare":"⚖","video-generator":"▣","image-generator":"▧","3d-generator":"⬡","text-to-speech":"♬","voice-cloning":"〰","music":"♫","stop-motion":"🎞","long-video":"▣","story":"▤","montage":"▦","manga":"▤","motion":"✧","poster":"▣","motion-type":"T","thumbnail":"▣","social":"⌯","video-tools":"▦","image-tools":"✂","lip-sync-video":"〰","auto-captions":"▤","logo-generation":"⬡","ai-headshots":"♙","ai-avatar":"◉","product-mockup":"▣","virtual-try-on":"♧","book-cover":"▤","meme-generator":"☺","qr-code-art":"▦","landing-page":"◎","background-generator":"▧","pattern-generator":"▦"};
function findButton(nav,key){
 if(key==="history")return nav.querySelector('[data-ob-menu-key="history"]');
 if(key==="obitrend-credits")return nav.querySelector('[data-p3="credits"]');
 return nav.querySelector('[data-ob-menu-key="'+key+'"],[data-studio-tool="'+key+'"]');
}
function wireMenu(){
 const nav=document.querySelector("#phase3Drawer .p3nav"),home=document.getElementById("obitrendHomeDashboard"),main=document.getElementById("main");
 if(!nav||!home||!main)return false;
 if(!document.getElementById("obitrendMasterHeader")){
  const header=document.createElement("header");header.id="obitrendMasterHeader";
  header.innerHTML='<div class="ob-master-brand"><span class="ob-master-crown" aria-hidden="true">♛</span><div><strong>OBITREND</strong><b>Movie AI V2 <i>CREATOR STUDIO</i></b></div></div><div class="ob-master-center"><span>♛</span><strong>35 AI TOOLS</strong><small>Complete Structure Plan</small></div><div class="ob-master-premium">PREMIUM<br>GOLD<br>INTERFACE</div>';
  main.parentNode.insertBefore(header,main);
 }
 const oldProduction=nav.querySelector('[data-ob-menu-key="history"]');if(oldProduction&&!oldProduction.dataset.masterLabel){oldProduction.dataset.masterLabel="1";oldProduction.innerHTML=iconByKey.history+' My Production';}
 let credits=nav.querySelector('[data-ob-menu-key="obitrend-credits"]');
 if(!credits){const original=nav.querySelector('[data-p3="credits"]');if(original){credits=original.cloneNode(true);credits.dataset.obMenuKey="obitrend-credits";credits.innerHTML="▤ My Credits";const mainGroup=nav.querySelector(".p3-group");const explore=mainGroup?.querySelector('[data-ob-menu-key="explore"]');if(explore)explore.insertAdjacentElement("afterend",credits);}}
 const originalBrand=nav.querySelector(".p3brand");if(originalBrand&&!originalBrand.dataset.masterBrand){originalBrand.dataset.masterBrand="1";originalBrand.innerHTML='<span aria-hidden="true">♛</span> OBITREND<small>Movie AI V2</small>';}
 let rail=document.getElementById("obitrendMasterRail");
 if(!rail){rail=document.createElement("aside");rail.id="obitrendMasterRail";rail.setAttribute("aria-label","35 AI tools menu index");main.parentNode.insertBefore(rail,main.nextSibling);}
 if(!rail.dataset.built){
  rail.dataset.built="1";
  rail.innerHTML='<h2>35 MENU SIDEBARS</h2><div class="ob-master-rail-groups"></div><section class="ob-master-features"><h3>PREMIUM FEATURES</h3><ul><li>Modern gold UI/UX</li><li>Attractive tool icons</li><li>Category grouping</li><li>Clear tool descriptions</li><li>Search & quick access</li><li>Mobile optimized</li><li>User-friendly navigation</li><li>Complete 35 tools</li><li>Pipeline ready</li><li>Remove old structure</li></ul></section>';
  const groups=rail.querySelector(".ob-master-rail-groups");let number=0;
  menuGroups.forEach(group=>{
   const section=document.createElement("section");section.className="ob-master-rail-group";
   const title=document.createElement("h3");title.textContent=group.title;section.appendChild(title);
   const list=document.createElement("div");list.className="ob-master-rail-list";
   group.items.forEach(([label,key])=>{
    const btn=findButton(nav,key);if(!btn)return;
    number++;
    const item=document.createElement("button");item.type="button";item.className="ob-master-rail-item";item.innerHTML='<span class="ob-master-number">'+number+'</span><span class="ob-master-rail-icon">'+(iconByKey[key]||"✦")+'</span><span class="ob-master-rail-label"></span>';
    item.querySelector(".ob-master-rail-label").textContent=label;
    item.dataset.key=key;item.addEventListener("click",()=>{if(window.matchMedia("(max-width: 900px)").matches){closeDrawer();}if(key==="home"){window.obitrendNavigate?.("home");return;}if(key==="history"){btn.click();return;}if(key==="obitrend-credits"){btn.click();return;}closeDrawer();btn.click();});
    list.appendChild(item);
   });
   section.appendChild(list);groups.appendChild(section);
  });
 }
 const updateActive=()=>{const active=nav.querySelector("button.active,[aria-current='page']");const key=active?.dataset.obMenuKey||active?.dataset.studioTool||"";rail.querySelectorAll(".ob-master-rail-item").forEach(b=>b.classList.toggle("active",b.dataset.key===key));};
 updateActive();
 nav.addEventListener("click",()=>setTimeout(updateActive,0),{passive:true});
 const search=home.querySelector(".ob-toolhome-search");if(search&&!search.dataset.masterPlaceholder){search.dataset.masterPlaceholder="1";search.placeholder="⌕ Search for tools, templates, styles…";}
 return true;
}
function start(){let tries=0;const tick=()=>{if(wireMenu())return;if(++tries<80)setTimeout(tick,150);};tick();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
const observer=new MutationObserver(()=>{if(document.getElementById("obitrendHomeDashboard")&&document.querySelector("#phase3Drawer .p3nav"))wireMenu();});
observer.observe(document.documentElement,{childList:true,subtree:true});
})();