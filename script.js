// ================================
// SUPABASE RESOURCE LOADER
// ================================

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
    // Avoid duplicate resources if the function runs again
    const existingIds = new Set(resources.map(r => String(r.id)));

    const newResources = data.filter(
      r => !existingIds.has(String(r.id))
    );

    resources = [...newResources, ...resources];
  }

  renderResources();
}


// ================================
// LOCAL STORAGE
// ================================

let saved = JSON.parse(
  localStorage.getItem("10hub_saved") || "[]"
);

let completed = JSON.parse(
  localStorage.getItem("10hub_completed") || "[]"
);


// ================================
// CURRENT STATE
// ================================

let activeFilter = "All";
let selectedSubject = "all";
let selectedChapter = "All";


// ================================
// SHORT SELECTOR
// ================================

const $ = (s) => document.querySelector(s);


// ================================
// RENDER SUBJECTS
// ================================

function renderSubjects() {

  const el = $("#subjectGrid");

  if (!el) return;

  el.innerHTML = subjects.map(s => `
    <button
      class="subject-card"
      onclick="openSubject('${s.id}')"
    >

      <div class="subject-icon">
        ${s.icon}
      </div>

      <div class="subject-copy">

        <h3>${s.name}</h3>

        <p>${s.description}</p>

      </div>

      <span class="arrow">
        →
      </span>

    </button>
  `).join("");
}


// ================================
// OPEN SUBJECT
// ================================

function openSubject(id) {

  selectedSubject = id;
  selectedChapter = "All";
  activeFilter = "All";

  document
    .querySelectorAll(".filter")
    .forEach(b => b.classList.remove("active"));

  document
    .querySelector('.filter[data-filter="All"]')
    ?.classList.add("active");

  const s = subjects.find(x => x.id === id);

  const panel = $("#chapterPanel");
  const title = $("#chapterTitle");
  const chaptersEl = $("#chapters");

  if (!panel || !title || !chaptersEl) return;

  title.textContent =
    (s ? s.name : "Subject") + " Chapters";

  const list = getChapterList(id);

  chaptersEl.innerHTML = list.map(ch => `
    <button
      class="chapter-pill"
      onclick="openChapter(
        ${JSON.stringify(id)},
        ${JSON.stringify(ch)}
      )"
    >
      ${ch}

      <span>
        →
      </span>

    </button>
  `).join("");

  panel.classList.remove("hidden");

  if ($("#resourcesTitle")) {
    $("#resourcesTitle").textContent =
      (s ? s.name : "Subject") + " Resources";
  }

  renderResources();

  panel.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


// ================================
// OPEN CHAPTER
// ================================

function openChapter(subject, chapter) {

  selectedSubject = subject;
  selectedChapter = chapter;

  if ($("#resourcesTitle")) {
    $("#resourcesTitle").textContent =
      chapter + " Resources";
  }

  renderResources();

  $("#resources")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


// ================================
// RENDER RESOURCES
// ================================

function renderResources() {

  const q =
    ($("#searchInput")?.value || "")
      .toLowerCase()
      .trim();

  const list = resources.filter(r => {

    const subjectMatch =
      selectedSubject === "all" ||
      r.subject === "all" ||
      r.subject === selectedSubject;

    const chapterMatch =
      selectedChapter === "All" ||
      r.chapter === "All" ||
      r.chapter === selectedChapter;

    const filterMatch =
      activeFilter === "All" ||
      r.type === activeFilter;

    const searchMatch =
      !q ||
      (
        (r.title || "") + " " +
        (r.description || "") + " " +
        (r.chapter || "")
      )
        .toLowerCase()
        .includes(q);

    return (
      subjectMatch &&
      chapterMatch &&
      filterMatch &&
      searchMatch
    );
  });


  const el = $("#resourceGrid");

  if (!el) return;


  el.innerHTML = list.length

    ? list.map(r => {

        const resourceId =
          String(r.id);

        const isSaved =
          saved.includes(resourceId) ||
          saved.includes(r.id);

        // Supabase uses "access"
        // Older local resources may use "free"
        const access =
          r.access ??
          (r.free ? "Free" : "Paid");

        return `

          <article class="resource-card">

            <div class="resource-top">

              <span class="tag">
                ${r.type}
              </span>

              <button
                class="save ${isSaved ? "saved" : ""}"
                onclick="toggleSave('${resourceId}')"
              >
                ${isSaved ? "★" : "☆"}
              </button>

            </div>


            <h3>
              ${r.title}
            </h3>


            <p>
              ${r.description || ""}
            </p>


            <div class="resource-meta">

              <span>
                ${r.chapter}
              </span>

              <span>
                ${access}
              </span>

            </div>


            <a
              class="resource-link"
              href="${r.url}"
              target="_blank"
              rel="noopener"
            >
              Open resource ↗
            </a>

          </article>

        `;

      }).join("")

    : `

        <div class="empty">

          No resources yet for this chapter.

          <br>

          Add resources from the
          <b>Admin</b> page.

        </div>

      `;


  if ($("#resourceCount")) {

    $("#resourceCount").textContent =
      `${list.length} resource${list.length === 1 ? "" : "s"}`;

  }

  updateStats();
}


// ================================
// SAVE / UNSAVE RESOURCE
// ================================

function toggleSave(id) {

  id = String(id);

  saved = saved.map(String);

  saved = saved.includes(id)

    ? saved.filter(x => x !== id)

    : [...saved, id];


  localStorage.setItem(
    "10hub_saved",
    JSON.stringify(saved)
  );


  renderResources();
}


// ================================
// UPDATE STATS
// ================================

function updateStats() {

  if ($("#bookmarkCount")) {

    $("#bookmarkCount").textContent =
      saved.length;

  }

  if ($("#progressCount")) {

    $("#progressCount").textContent =
      completed.length;

  }
}


// ================================
// SHOW ALL RESOURCES
// ================================

function goAll() {

  selectedSubject = "all";
  selectedChapter = "All";

  $("#chapterPanel")
    ?.classList.add("hidden");

  if ($("#resourcesTitle")) {

    $("#resourcesTitle").textContent =
      "Featured resources";

  }

  renderResources();
}


// ================================
// PAGE STARTUP
// ================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    // Render built-in subjects/resources
    renderSubjects();
    renderResources();
    updateStats();


    // Search
    $("#searchInput")
      ?.addEventListener(
        "input",
        renderResources
      );


    // Resource filters
    document
      .querySelectorAll(".filter")
      .forEach(btn => {

        btn.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(".filter")
              .forEach(b =>
                b.classList.remove("active")
              );

            btn.classList.add("active");

            activeFilter =
              btn.dataset.filter;

            renderResources();

          }
        );

      });


    // Quick links
    document
      .querySelectorAll(".quick-links button")
      .forEach(btn => {

        btn.addEventListener(
          "click",
          () => {

            const filter =
              btn.dataset.filter;

            const matching =
              document.querySelector(
                `.filter[data-filter="${filter}"]`
              );

            matching?.click();

            $("#resources")
              ?.scrollIntoView({
                behavior: "smooth"
              });

          }
        );

      });


    // Profile modal
    $("#profileBtn")
      ?.addEventListener(
        "click",
        () =>
          $("#profileModal")
            ?.classList.remove("hidden")
      );


    $("#closeModal")
      ?.addEventListener(
        "click",
        () =>
          $("#profileModal")
            ?.classList.add("hidden")
      );


    // Save name
    $("#saveName")
      ?.addEventListener(
        "click",
        () => {

          const name =
            $("#nameInput")
              ?.value
              .trim() || "";

          localStorage.setItem(
            "10hub_name",
            name
          );

          $("#profileModal")
            ?.classList.add("hidden");

        }
      );


    // Load saved name
    const name =
      localStorage.getItem("10hub_name");

    if (
      name &&
      $("#nameInput")
    ) {

      $("#nameInput").value = name;

    }


    // Ctrl + K search shortcut
    document.addEventListener(
      "keydown",
      e => {

        if (
          (e.ctrlKey || e.metaKey) &&
          e.key.toLowerCase() === "k"
        ) {

          e.preventDefault();

          $("#searchInput")?.focus();

        }

      }
    );

  }
);


// ================================
// LOAD SUPABASE RESOURCES
// ================================

loadSupabaseResources();
  
