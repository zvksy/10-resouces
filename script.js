let activeFilter = "All";
let searchTerm = "";
const saved = JSON.parse(localStorage.getItem("10hub_saved") || "[]");
const completed = JSON.parse(localStorage.getItem("10hub_completed") || "[]");

const subjectGrid = document.getElementById("subjectGrid");
const resourceGrid = document.getElementById("resourceGrid");
const resourceCount = document.getElementById("resourceCount");

function renderSubjects(){
  subjectGrid.innerHTML = subjects.map(s => `
    <article class="subject-card" onclick="filterSubject('${s.id}')">
      <div class="subject-icon">${s.icon}</div>
      <h3>${s.name}</h3>
      <p>${s.description}</p>
    </article>`).join("");
}

function visibleResources(){
  return resources.filter(r => {
    const typeOK = activeFilter === "All" || r.type === activeFilter;
    const text = `${r.title} ${r.chapter} ${r.description}`.toLowerCase();
    const searchOK = !searchTerm || text.includes(searchTerm);
    return typeOK && searchOK;
  });
}

function renderResources(){
  const list = visibleResources();
  resourceCount.textContent = `${list.length} resource${list.length !== 1 ? "s" : ""}`;
  if(!list.length){
    resourceGrid.innerHTML = `<div class="muted" style="grid-column:1/-1;padding:30px 0">No resources found. Try another search or filter.</div>`;
    return;
  }
  resourceGrid.innerHTML = list.map(r => `
    <article class="resource-card">
      <div class="resource-top">
        <span class="tag">${r.type}</span>
        <button class="save ${saved.includes(r.id) ? "saved" : ""}" onclick="toggleSave('${r.id}')" title="Save">★</button>
      </div>
      <h3>${r.title}</h3>
      <p>${r.description}</p>
      <div class="resource-meta">
        <span class="badge">${r.free ? "FREE" : "PAID"}</span>
        <a class="open" href="${r.url}" target="_blank" rel="noopener">Open resource →</a>
      </div>
    </article>`).join("");
  updateStats();
}

function filterSubject(id){
  activeFilter = "All";
  searchTerm = "";
  document.getElementById("searchInput").value = "";
  const subject = subjects.find(s => s.id === id);
  const list = resources.filter(r => r.subject === id || r.subject === "all");
  resourceGrid.innerHTML = list.length ? list.map(r => `
    <article class="resource-card">
      <div class="resource-top"><span class="tag">${r.type}</span><button class="save ${saved.includes(r.id) ? "saved" : ""}" onclick="toggleSave('${r.id}')">★</button></div>
      <h3>${r.title}</h3><p>${r.description}</p>
      <div class="resource-meta"><span class="badge">${r.free ? "FREE" : "PAID"}</span><a class="open" href="${r.url}" target="_blank" rel="noopener">Open resource →</a></div>
    </article>`).join("") : `<div class="muted">Resources for ${subject.name} will appear here.</div>`;
  resourceCount.textContent = `${subject.name} resources`;
  document.getElementById("resources").scrollIntoView({behavior:"smooth"});
}

function toggleSave(id){
  const i = saved.indexOf(id);
  if(i >= 0) saved.splice(i,1); else saved.push(id);
  localStorage.setItem("10hub_saved", JSON.stringify(saved));
  renderResources();
}

function updateStats(){
  document.getElementById("bookmarkCount").textContent = saved.length;
  document.getElementById("progressCount").textContent = completed.length;
}

document.getElementById("searchInput").addEventListener("input", e => {
  searchTerm = e.target.value.trim().toLowerCase();
  renderResources();
});

document.querySelectorAll(".filter,.quick-links button").forEach(btn => {
  btn.addEventListener("click", () => {
    activeFilter = btn.dataset.filter;
    document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b.dataset.filter === activeFilter));
    document.getElementById("resources").scrollIntoView({behavior:"smooth"});
    renderResources();
  });
});

document.addEventListener("keydown", e => {
  if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"){
    e.preventDefault(); document.getElementById("searchInput").focus();
  }
});

const modal = document.getElementById("profileModal");
document.getElementById("profileBtn").onclick = () => {
  document.getElementById("nameInput").value = localStorage.getItem("10hub_name") || "";
  modal.classList.remove("hidden");
};
document.getElementById("closeModal").onclick = () => modal.classList.add("hidden");
document.getElementById("saveName").onclick = () => {
  localStorage.setItem("10hub_name", document.getElementById("nameInput").value.trim());
  modal.classList.add("hidden");
};

renderSubjects();
renderResources();
updateStats();
