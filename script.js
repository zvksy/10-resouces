async function loadSupabaseResources() {
  const { data, error } = await db
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  if (data && data.length > 0) {
    resources = [...data, ...resources];
  }

  renderResources();
}
let saved = JSON.parse(localStorage.getItem("10hub_saved") || "[]");
let completed = JSON.parse(localStorage.getItem("10hub_completed") || "[]");
let activeFilter = "All";
let selectedSubject = "all";
let selectedChapter = "All";

const $ = (s) => document.querySelector(s);

function renderSubjects(){
  const el = $("#subjectGrid");
  if(!el) return;
  el.innerHTML = subjects.map(s => `
    <button class="subject-card" onclick="openSubject('${s.id}')">
      <div class="subject-icon">${s.icon}</div>
      <div class="subject-copy">
        <h3>${s.name}</h3>
        <p>${s.description}</p>
      </div>
      <span class="arrow">→</span>
    </button>
  `).join("");
}

function openSubject(id){
  selectedSubject = id;
  selectedChapter = "All";
  activeFilter = "All";

  document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
  document.querySelector('.filter[data-filter="All"]')?.classList.add("active");

  const s = subjects.find(x => x.id === id);
  const panel = $("#chapterPanel");
  const title = $("#chapterTitle");
  const chaptersEl = $("#chapters");

  if(!panel || !title || !chaptersEl) return;

  title.textContent = (s ? s.name : "Subject") + " Chapters";
  const list = getChapterList(id);

  chaptersEl.innerHTML = list.map(ch => `
    <button class="chapter-pill" onclick="openChapter(${JSON.stringify(id)}, ${JSON.stringify(ch)})">
      ${ch}
      <span>→</span>
    </button>
  `).join("");

  panel.classList.remove("hidden");
  $("#resourcesTitle").textContent = (s ? s.name : "Subject") + " Resources";
  renderResources();

  panel.scrollIntoView({behavior:"smooth", block:"start"});
}

function openChapter(subject, chapter){
  selectedSubject = subject;
  selectedChapter = chapter;
  const s = subjects.find(x => x.id === subject);
  $("#resourcesTitle").textContent = chapter + " Resources";
  renderResources();
  $("#resources").scrollIntoView({behavior:"smooth", block:"start"});
}

function renderResources(){
  const q = ($("#searchInput")?.value || "").toLowerCase().trim();

  const list = resources.filter(r =>
    (selectedSubject === "all" || r.subject === "all" || r.subject === selectedSubject) &&
    (selectedChapter === "All" || r.chapter === "All" || r.chapter === selectedChapter) &&
    (activeFilter === "All" || r.type === activeFilter) &&
    (!q || (r.title + " " + r.description + " " + r.chapter).toLowerCase().includes(q))
  );

  const el = $("#resourceGrid");
  if(!el) return;

  el.innerHTML = list.length ? list.map(r => `
    <article class="resource-card">
      <div class="resource-top">
        <span class="tag">${r.type}</span>
        <button class="save ${saved.includes(r.id) ? "saved" : ""}" onclick="toggleSave('${r.id}')">
          ${saved.includes(r.id) ? "★" : "☆"}
        </button>
      </div>
      <h3>${r.title}</h3>
      <p>${r.description}</p>
      <div class="resource-meta">
        <span>${r.chapter}</span>
        <span>${r.free ? "Free" : "Paid"}</span>
      </div>
      <a class="resource-link" href="${r.url}" target="_blank" rel="noopener">Open resource ↗</a>
    </article>
  `).join("") : `
    <div class="empty">
      No resources yet for this chapter.<br>
      Add resources in <b>data/resources.js</b>.
    </div>
  `;

  $("#resourceCount").textContent = `${list.length} resource${list.length === 1 ? "" : "s"}`;
  updateStats();
}

function toggleSave(id){
  saved = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id];
  localStorage.setItem("10hub_saved", JSON.stringify(saved));
  renderResources();
}

function updateStats(){
  if($("#bookmarkCount")) $("#bookmarkCount").textContent = saved.length;
  if($("#progressCount")) $("#progressCount").textContent = completed.length;
}

function goAll(){
  selectedSubject = "all";
  selectedChapter = "All";
  $("#chapterPanel")?.classList.add("hidden");
  $("#resourcesTitle").textContent = "Featured resources";
  renderResources();
}

document.addEventListener("DOMContentLoaded", () => {
  renderSubjects();
  renderResources();
  updateStats();

  $("#searchInput")?.addEventListener("input", renderResources);

  document.querySelectorAll(".filter").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      renderResources();
    });
  });

  document.querySelectorAll(".quick-links button").forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      const matching = document.querySelector(`.filter[data-filter="${filter}"]`);
      matching?.click();
      $("#resources")?.scrollIntoView({behavior:"smooth"});
    });
  });

  $("#profileBtn")?.addEventListener("click", () => $("#profileModal")?.classList.remove("hidden"));
  $("#closeModal")?.addEventListener("click", () => $("#profileModal")?.classList.add("hidden"));

  $("#saveName")?.addEventListener("click", () => {
    localStorage.setItem("10hub_name", $("#nameInput")?.value.trim() || "");
    $("#profileModal")?.classList.add("hidden");
  });

  const name = localStorage.getItem("10hub_name");
  if(name && $("#nameInput")) $("#nameInput").value = name;

  document.addEventListener("keydown", e => {
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"){
      e.preventDefault();
      $("#searchInput")?.focus();
    }
  });
});
loadSupabaseResources();
