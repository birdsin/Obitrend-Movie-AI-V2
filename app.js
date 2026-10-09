/* UI-only helpers. Existing Movie AI generation logic remains in index.html. */
(()=>{"use strict";
function closeDrawer(){const d=document.getElementById("phase3Drawer"),s=document.getElementById("phase3Shade"),m=document.getElementById("phase3MenuBtn");if(d)d.classList.remove("open");if(s)s.classList.remove("open");if(m)m.setAttribute("aria-expanded","false");document.body.classList.remove("drawer-open");}
window.closeDrawer=window.closeDrawer||closeDrawer;
document.addEventListener("click",e=>{if(e.target.closest("#phase3Close,#phase3Shade")){closeDrawer();return;}const nav=e.target.closest("#phase3Drawer button,#phase3Drawer a");if(nav)closeDrawer();const x=e.target.closest(".ob-thumb-remove");if(x){const fig=x.closest(".ob-reference-thumb");if(fig)fig.remove();}});
const prompt=document.getElementById("p3QuickPrompt"),counter=document.getElementById("obPromptCount");
function count(){if(prompt&&counter)counter.textContent=prompt.value.length+"/1000";}
if(prompt){prompt.maxLength=1000;prompt.addEventListener("input",count);count();}
window.addEventListener("pageshow",()=>{const d=document.getElementById("phase3Drawer");if(d&&!d.classList.contains("open"))closeDrawer();});
})();