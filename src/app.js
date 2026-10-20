(function(){
// Squarespace can run a code block's script more than once; only set up each block once.
const root=document.querySelector('.mm[data-majors]:not([data-mm-ready])'); if(!root) return;
root.setAttribute('data-mm-ready','1');
const $=s=>root.querySelector(s);
const SB_URL="https://axmzxphxcgwrsbkixmbg.supabase.co";
const SB_KEY="sb_publishable_bcqkFGvCkSS5-sY8f6xLyQ_Am-8ngTZ";

// Saved copy of the data, used if the live database can't be reached.
const SNAPSHOT=/*SNAPSHOT*/null;

// ---- Helpers ----
const DAY=864e5, D=s=>new Date(s+"T00:00:00Z");
const n=new Date(), TODAY_S=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`, TODAY=D(TODAY_S);
const MONTHS=19, startD=new Date(Date.UTC(n.getFullYear(),n.getMonth()-4,1)), endD=new Date(Date.UTC(startD.getUTCFullYear(),startD.getUTCMonth()+MONTHS,1));
const fmt=(s,o={day:"numeric",month:"short"})=>D(s).toLocaleDateString("en-GB",{...o,timeZone:"UTC"});
const fmtY=s=>fmt(s,{day:"numeric",month:"short",year:"numeric"});
const days=(a,b)=>Math.round((D(b)-D(a))/DAY);
const pct=s=>(D(s)-startD)/(endD-startD);
const clamp=x=>Math.max(0,Math.min(1,x));
const status=ev=>{const end=ev.e||ev.s; if(D(end)<TODAY) return "closed"; if(D(ev.s)>TODAY) return "upcoming"; return "open";};
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const badge=(r,size=44)=>r.badge?`<span class="mm-badge img" style="--s:${size}px"><img src="${esc(r.badge)}" alt=""></span>`
  :`<span class="mm-badge" style="--c:var(--mm-${r.id});--s:${size}px" aria-hidden="true"><span>${esc(r.code)}</span></span>`;

function shape(races,events,meta){
  return {checked:(meta.find(m=>m.key==="checked_on")||{}).value,
    races:races.sort((a,b)=>a.sort-b.sort).map(r=>({id:r.id,code:r.code,name:r.name,full:r.full_name,city:r.city,race:r.race_date,raceEnd:r.race_end,raceEst:r.race_tbc,
      fee:r.fee,entry:r.entry_routes,url:r.official_url,note:r.note,badge:r.badge_url,
      events:events.filter(e=>e.race_id===r.id).sort((a,b)=>a.starts_on<b.starts_on?-1:1).map(e=>({t:e.kind,k:e.label,s:e.starts_on,e:e.ends_on,est:e.estimated}))}))};
}
async function load(){
  const h={apikey:SB_KEY,Authorization:"Bearer "+SB_KEY};
  const get=p=>fetch(`${SB_URL}/rest/v1/${p}`,{headers:h}).then(r=>{if(!r.ok) throw new Error(r.status); return r.json();});
  const [r,e,m]=await Promise.all([get("majors_races?select=*"),get("majors_events?select=*"),get("majors_meta?select=*")]);
  if(!r.length) throw new Error("empty"); return shape(r,e,m);
}

let RACES=[], CHECKED="", LIVE=false;
let store={}; try{store=JSON.parse(localStorage.getItem("mmFilters")||"{}")}catch(e){}
const state={races:null,statuses:new Set(store.statuses||["open","upcoming","closed","est"]),sel:store.sel||null};
const save=()=>{try{localStorage.setItem("mmFilters",JSON.stringify({races:[...state.races],statuses:[...state.statuses],sel:state.sel}))}catch(e){}};
const visible=ev=>state.statuses.has(status(ev))&&(!ev.est||state.statuses.has("est"));

function renderStamp(){$("#mm-stamp").textContent=(LIVE?"Dates checked ":"Saved dates from ")+(CHECKED?fmtY(CHECKED):"—");}

function renderCards(){
  const items=[];
  RACES.forEach(r=>r.events.forEach(ev=>{ if(ev.t!=="window") return; const st=status(ev); if(st==="closed") return;
    items.push({r,ev,st,sort:st==="open"?D(ev.e):D(ev.s)}); }));
  items.sort((a,b)=>(a.st==="open"?0:1)-(b.st==="open"?0:1)||a.sort-b.sort);
  $("#mm-cards").innerHTML=items.slice(0,4).map(({r,ev,st})=>{
    const k=st==="open"?days(TODAY_S,ev.e):days(TODAY_S,ev.s);
    const line=st==="open"?(k===0?`Closes today · ${fmt(ev.e)}`:`Closes in ${k} day${k===1?"":"s"} · ${fmt(ev.e)}`):`${ev.est?"Expected ":"Opens "}${fmtY(ev.s)}`;
    return `<button class="mm-card" data-race="${r.id}">${badge(r,46)}<span style="min-width:0">
      <span class="mm-pill ${ev.est?"est":st}">${ev.est?"Expected":st==="open"?"Open now":"Upcoming"}</span>
      <span class="t" style="display:block">${esc(r.name)} · ${esc(ev.k)}</span>
      <span class="big" style="display:block">${line}</span></span></button>`;}).join("")||`<p class="mm-note">No upcoming windows.</p>`;
}

function renderChips(){
  $("#mm-race-chips").innerHTML=`<button class="mm-chip plain" data-all="1" aria-pressed="${state.races.size===RACES.length}">All races</button>`+
    RACES.map(r=>`<button class="mm-chip" data-chip="${r.id}" style="--c:var(--mm-${r.id})" aria-pressed="${state.races.has(r.id)}"><span class="dot"></span>${esc(r.name)}</button>`).join("");
  $("#mm-status-chips").innerHTML=[["open","Open now"],["upcoming","Upcoming"],["closed","Closed"],["est","Expected dates"]]
    .map(([k,l])=>`<button class="mm-chip plain" data-status="${k}" aria-pressed="${state.statuses.has(k)}">${l}</button>`).join("");
}

function renderTimeline(){
  const tl=$("#mm-tl"); tl.style.setProperty("--months",MONTHS);
  let months="";
  for(let i=0;i<MONTHS;i++){const d=new Date(Date.UTC(startD.getUTCFullYear(),startD.getUTCMonth()+i,1)), jan=d.getUTCMonth()===0;
    months+=`<div class="mm-month${jan?" jan":""}"><b>${d.toLocaleDateString("en-GB",{month:"short",timeZone:"UTC"})}</b>${jan||i===0?d.getUTCFullYear():"&nbsp;"}</div>`;}
  const slot=100/(MONTHS*30.4);
  const rows=RACES.filter(r=>state.races.has(r.id)).map(r=>{
    let marks="";
    r.events.forEach((ev,i)=>{ if(!visible(ev)) return; const cls=`${status(ev)}${ev.est?" est":""}`;
      if(ev.t==="window"){ const a=pct(ev.s), b=pct(ev.e); if(b<0||a>1) return;
        const l=clamp(a)*100, w=(clamp(b)-clamp(a))*100+slot;
        marks+=`<button class="mm-bar ${cls}" style="left:${l}%;width:${w}%" data-r="${r.id}" data-i="${i}" aria-label="${esc(r.name)} ${esc(ev.k)}, ${fmt(ev.s)} to ${fmt(ev.e)}"></button>`;}
      else { const p=pct(ev.s); if(p<0||p>1) return;
        marks+=`<button class="mm-mk ${ev.t} ${cls}" style="left:${p*100}%" data-r="${r.id}" data-i="${i}" aria-label="${esc(r.name)} ${esc(ev.k)}, ${fmt(ev.s)}"></button>`;}
    });
    const rp=pct(r.race);
    if(rp>=0&&rp<=1) marks+=`<button class="mm-mk race" style="left:${rp*100}%;color:var(--mm-${r.id})" data-r="${r.id}" data-i="race" aria-label="${esc(r.name)} race day, ${fmt(r.race)}"><svg viewBox="0 0 18 18"><path d="M4 2v15" stroke="currentColor" stroke-width="2"/><path d="M5 2h10l-3 4 3 4H5z" fill="currentColor" ${r.raceEst?'fill-opacity=".35" stroke="currentColor" stroke-dasharray="2 1.5"':''}/></svg></button>`;
    return `<div class="mm-row${state.sel===r.id?" sel":""}" style="--c:var(--mm-${r.id})">
      <button class="mm-rlabel" data-race="${r.id}">${badge(r,34)}<span class="nm">${esc(r.name)}<small>${fmt(r.race,{month:"short",year:"2-digit"})}</small></span></button>
      <div class="mm-lane"><div class="grid"></div>${marks}</div></div>`;}).join("");
  tl.innerHTML=`<div class="mm-thead"><div class="mm-corner">Race</div><div class="mm-months">${months}</div></div>
    <div style="position:relative">${rows||'<div class="mm-row"><div class="mm-empty">No races selected.</div></div>'}
    ${rows?`<div style="position:absolute;top:0;bottom:0;left:var(--label);right:0;pointer-events:none"><div class="mm-today" style="left:${pct(TODAY_S)*100}%"><span>Today</span></div></div>`:""}</div>`;
}

function renderDetail(){
  const r=RACES.find(x=>x.id===state.sel)||RACES.find(x=>x.events.some(ev=>ev.t==="window"&&status(ev)==="open"))||RACES[0]; if(!r) return;
  const rows=r.events.map(ev=>{const st=status(ev);
    return `<tr><td>${esc(ev.k)}</td><td class="dt">${ev.e?`${fmt(ev.s)} – ${fmtY(ev.e)}`:fmtY(ev.s)}</td><td><span class="mm-pill ${ev.est?"est":st}">${ev.est?"Expected":st==="open"?"Open":st}</span></td></tr>`;}).join("");
  $("#mm-detail").innerHTML=`
    <div style="display:flex;flex-direction:column;align-items:center">${badge(r,112)}${r.badge?"":'<p class="mm-draw">Placeholder · hand-drawn badge goes here</p>'}</div>
    <div class="body">
      <div><h2>${esc(r.full)}</h2><p class="meta">${esc(r.city)}</p></div>
      <dl class="mm-facts">
        <div><dt>Race day</dt><dd>${r.raceEnd?`${fmt(r.race)} – ${fmtY(r.raceEnd)}`:fmtY(r.race)}${r.raceEst?" (TBC)":""}</dd></div>
        <div><dt>Ways in</dt><dd>${esc(r.entry)}</dd></div>
        <div><dt>Entry fee</dt><dd>${esc(r.fee)}</dd></div>
      </dl>
      <div class="mm-tw"><table><thead><tr><th>Window</th><th>Dates</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>
      ${r.note?`<p class="mm-note">${esc(r.note)}</p>`:""}
      ${r.url?`<p><a class="mm-link" href="${esc(r.url)}" target="_blank" rel="noopener">Official entry page ↗</a></p>`:""}
    </div>`;
}

// ---- Calendar subscription ----
const FEED_HOST="axmzxphxcgwrsbkixmbg.supabase.co/functions/v1/majors-calendar";
let scope="all";
function feedPath(){
  const sel=[...state.races];
  return (scope==="sel"&&sel.length&&sel.length<RACES.length) ? `${FEED_HOST}?races=${sel.join(",")}` : FEED_HOST;
}
function renderSub(){
  const p=feedPath(), https="https://"+p, webcal="webcal://"+p;
  const partial=state.races.size<RACES.length;
  $("#mm-scope-sel").textContent=partial?`Races I've selected (${state.races.size})`:"Races I've selected";
  $("#mm-scope-sel").disabled=!partial; if(!partial&&scope==="sel") scope="all";
  root.querySelectorAll("[data-scope]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.scope===scope));
  const names=scope==="sel"?RACES.filter(r=>state.races.has(r.id)).map(r=>r.name).join(", "):"All nine Majors";
  $("#mm-sub-links").innerHTML=[
    ["Apple Calendar","iPhone, iPad and Mac",webcal],
    ["Google Calendar","Opens Google Calendar to add it",`https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`],
    ["Outlook","Outlook.com and Microsoft 365",`https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(https)}&name=${encodeURIComponent("Marathon Majors")}`],
  ].map(([t,s,h])=>`<a class="mm-sub-link" href="${esc(h)}" target="_blank" rel="noopener"><b>${t} ↗</b><span>${s}</span></a>`).join("")+
  `<p class="mm-note" style="grid-column:1/-1">Includes: ${esc(names)}. Opening and closing days of each window, results days, payment deadlines and race days.</p>`;
  $("#mm-feed-url").value=https;
}
const subBtn=$("#mm-sub-btn"), subPanel=$("#mm-sub");
function toggleSub(open){ subPanel.hidden=!open; subBtn.setAttribute("aria-expanded",open); if(open) renderSub(); }
subBtn.addEventListener("click",()=>toggleSub(subPanel.hidden));
$("#mm-sub-close").addEventListener("click",()=>{toggleSub(false); subBtn.focus();});
subPanel.addEventListener("click",e=>{const b=e.target.closest("[data-scope]"); if(b&&!b.disabled){scope=b.dataset.scope; renderSub();}});
$("#mm-copy").addEventListener("click",()=>{
  const inp=$("#mm-feed-url"), btn=$("#mm-copy"), done=()=>{btn.textContent="Copied"; setTimeout(()=>btn.textContent="Copy",1800);};
  const fallback=()=>{inp.focus(); inp.select(); btn.textContent="Press ⌘C / Ctrl+C";};
  try{ navigator.clipboard.writeText(inp.value).then(done,fallback); }catch(e){ fallback(); }
});
$("#mm-feed-url").addEventListener("focus",e=>e.target.select());

function renderAll(){renderStamp();renderCards();renderChips();renderTimeline();renderDetail(); if(!subPanel.hidden) renderSub();}

// ---- Events ----
root.addEventListener("click",e=>{
  const all=e.target.closest("[data-all]"), chip=e.target.closest("[data-chip]"), st=e.target.closest("[data-status]");
  if(all){ state.races=state.races.size===RACES.length?new Set():new Set(RACES.map(r=>r.id)); save(); return renderAll(); }
  if(chip){ const id=chip.dataset.chip;
    if(state.races.size===RACES.length) state.races=new Set([id]); else state.races.has(id)?state.races.delete(id):state.races.add(id);
    if(!state.races.size) state.races=new Set(RACES.map(r=>r.id)); save(); return renderAll(); }
  if(st){ const k=st.dataset.status; state.statuses.has(k)?state.statuses.delete(k):state.statuses.add(k); save(); return renderAll(); }
  const pick=e.target.closest("[data-race],[data-r]");
  if(pick){ state.sel=pick.dataset.race||pick.dataset.r; save(); renderTimeline(); renderDetail();
    if(pick.closest("#mm-cards")) $("#mm-detail").scrollIntoView({behavior:"smooth",block:"nearest"}); }
});
const tip=document.createElement("div"); tip.className="mm mm-tip"; tip.hidden=true; document.body.appendChild(tip);
function info(r,i){ if(i==="race") return [`${r.full}: race day`, r.raceEnd?`${fmtY(r.race)} – ${fmt(r.raceEnd)}`:fmtY(r.race)+(r.raceEst?" (TBC)":"")];
  const ev=r.events[i]; return [`${r.name} · ${ev.k}`,(ev.e?`${fmtY(ev.s)} – ${fmtY(ev.e)}`:fmtY(ev.s))+` · ${ev.est?"expected":status(ev)}`];}
root.addEventListener("pointerover",e=>{const b=e.target.closest("[data-r]"); if(!b){tip.hidden=true;return}
  const r=RACES.find(x=>x.id===b.dataset.r), [t,d]=info(r,b.dataset.i==="race"?"race":+b.dataset.i);
  tip.innerHTML=`<b>${esc(t)}</b>${esc(d)}`; tip.hidden=false;
  const rc=b.getBoundingClientRect(); tip.style.left=Math.min(window.innerWidth-270,Math.max(8,rc.left))+"px"; tip.style.top=(rc.bottom+8)+"px";});
root.addEventListener("pointerout",e=>{const t=e.relatedTarget; if(!t||!t.closest||!t.closest("[data-r]")) tip.hidden=true;});
$("#mm-scroll").addEventListener("scroll",()=>tip.hidden=true,{passive:true});
window.addEventListener("scroll",()=>tip.hidden=true,{passive:true});

function scrollToToday(){const sc=$("#mm-scroll"), tl=$("#mm-tl"), lab=parseFloat(getComputedStyle(tl).getPropertyValue("--label"))||150;
  sc.scrollLeft=Math.max(0,(tl.scrollWidth-lab)*pct(TODAY_S)-sc.clientWidth*0.3);}

function use(data,live){ RACES=data.races; CHECKED=data.checked; LIVE=live;
  const ids=RACES.map(r=>r.id), saved=(store.races||[]).filter(id=>ids.includes(id));
  state.races=new Set(saved.length?saved:ids); renderAll(); requestAnimationFrame(scrollToToday); }

if(SNAPSHOT) use(shape(SNAPSHOT.races,SNAPSHOT.events,SNAPSHOT.meta),false);
load().then(d=>use(d,true)).catch(()=>{ if(!SNAPSHOT) $("#mm-cards").innerHTML='<p class="mm-note">Race dates could not be loaded. Refresh the page to try again.</p>'; });
})();
