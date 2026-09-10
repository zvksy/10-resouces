let saved = JSON.parse(localStorage.getItem("10hub_saved") || "[]");
let completed = JSON.parse(localStorage.getItem("10hub_completed") || "[]");
let activeFilter = "All";
let selectedSubject = "all";
let selectedChapter = "All";

const $ = (s) => document.querySelector(s);

function renderSubjects(){
  const el = $("#subjects");
  if(!el) return;
  el.innerHTML = subjects.map(s => `
    <button class="subject-card" onclick="openSubject('${s.id}')">
      <div class="subject-icon">${s.icon}</div>
      <div><h3>${s.name}</h3><p>${s.description}</p></div>
      <span class="arrow">→</span>
    </button>`).join("");
}

function openSubject(id){
  selectedSubject=id; selectedChapter="All"; activeFilter="All";
  const s=subjects.find(x=>x.id===id);
  $("#chapterTitle").textContent=s ? s.name+" Chapters" : "Chapters";
  $("#chapters").innerHTML=getChapterList(id).map(ch=>`
    <button class="chapter-pill" onclick="openChapter(${JSON.stringify(id)},${JSON.stringify(ch)})">${ch}</button>
  `).join("");
  $("#chapterPanel").classList.remove("hidden");
  $("#resourcesTitle").textContent=(s?s.name:"")+" Resources";
  renderResources();
  $("#chapterPanel").scrollIntoView({behavior:"smooth",block:"start"});
}

function openChapter(subject, chapter){
  selectedSubject=subject; selectedChapter=chapter;
  $("#resourcesTitle").textContent=chapter+" Resources";
  renderResources();
  $("#resources").scrollIntoView({behavior:"smooth",block:"start"});
}

function renderResources(){
  const q=($("#search")?.value||"").toLowerCase().trim();
  const list=resources.filter(r =>
    (selectedSubject==="all" || r.subject==="all" || r.subject===selectedSubject) &&
    (selectedChapter==="All" || r.chapter==="All" || r.chapter===selectedChapter) &&
    (activeFilter==="All" || r.type===activeFilter) &&
    (!q || (r.title+" "+r.description+" "+r.chapter).toLowerCase().includes(q))
  );
  const el=$("#resourceGrid");
  if(!el) return;
  el.innerHTML=list.length ? list.map(r=>`
    <article class="resource-card">
      <div class="resource-top"><span class="tag">${r.type}</span><button class="save ${saved.includes(r.id)?"saved":""}" onclick="toggleSave('${r.id}')">${saved.includes(r.id)?"★":"☆"}</button></div>
      <h3>${r.title}</h3><p>${r.description}</p>
      <div class="resource-meta"><span>${r.chapter}</span><span>${r.free?"Free":"Paid"}</span></div>
      <a class="resource-link" href="${r.url}" target="_blank" rel="noopener">Open resource ↗</a>
    </article>`).join("") : `<div class="empty">No resources yet for this chapter. Add one to <b>data/resources.js</b>.</div>`;
  updateStats();
}

function toggleSave(id){
  saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];
  localStorage.setItem("10hub_saved",JSON.stringify(saved));
  renderResources();
}

function updateStats(){
  if($("#savedCount")) $("#savedCount").textContent=saved.length;
  if($("#completedCount")) $("#completedCount").textContent=completed.length;
}

function goAll(){
  selectedSubject="all"; selectedChapter="All";
  $("#chapterPanel")?.classList.add("hidden");
  $("#resourcesTitle").textContent="All Resources";
  renderResources();
}

document.addEventListener("DOMContentLoaded",()=>{
  renderSubjects(); renderResources(); updateStats();
  $("#search")?.addEventListener("input",renderResources);
  document.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active"); activeFilter=btn.dataset.filter; renderResources();
    });
  });
  $("#allResources")?.addEventListener("click",goAll);
  $("#profileBtn")?.addEventListener("click",()=>$("#profileModal")?.classList.remove("hidden"));
  $("#closeModal")?.addEventListener("click",()=>$("#profileModal")?.classList.add("hidden"));
  $("#saveProfile")?.addEventListener("click",()=>{
    localStorage.setItem("10hub_name",$("#profileName").value.trim());
    $("#profileModal")?.classList.add("hidden");
  });
  const name=localStorage.getItem("10hub_name");
  if(name && $("#profileName")) $("#profileName").value=name;
  document.addEventListener("keydown",e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#search")?.focus();}
  });
});
