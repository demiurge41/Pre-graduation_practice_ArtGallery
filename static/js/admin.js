import { showToast, bindEscape } from "./utils.js";

const content = document.getElementById("admin-content");
const titleEl = document.getElementById("view-title");
let deleteId = null;
let deleteResource = null;
let currentView = "dashboard";

const api = (path, opts = {}) => fetch(path, { credentials: "include", ...opts });

const viewTitles = {
  dashboard: "Dashboard",
  artworks: "Artworks",
  artists: "Artists",
  exhibitions: "Exhibitions",
  inquiries: "Inquiries",
};

async function ensureAuth() {
  const res = await api("/api/auth/me");
  if (!res.ok) {
    window.location.href = "/gallery.admin/login";
    return null;
  }
  const user = await res.json();
  document.getElementById("user-email").textContent = user.email;
  return user;
}

document.getElementById("logout-btn")?.addEventListener("click", async () => {
  await api("/api/auth/logout", { method: "POST" });
  window.location.href = "/gallery.admin/login";
});

document.querySelectorAll(".admin-sidebar [data-view]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".admin-sidebar__nav a").forEach((a) => a.classList.remove("is-active"));
    link.classList.add("is-active");
    loadView(link.dataset.view);
  });
});

function openModal(id) {
  document.getElementById(id)?.classList.add("is-open");
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove("is-open");
}

async function loadView(view) {
  currentView = view;
  titleEl.textContent = viewTitles[view] || view;
  if (view === "dashboard") return renderDashboard();
  if (view === "artworks") return renderArtworksTable();
  if (view === "artists") return renderArtistsTable();
  if (view === "exhibitions") return renderExhibitionsTable();
  if (view === "inquiries") return renderInquiries();
}

async function renderDashboard() {
  const [artworks, artists, exhibitions, inquiriesRes] = await Promise.all([
    api("/api/artworks").then((r) => r.json()),
    api("/api/artists").then((r) => r.json()),
    api("/api/exhibitions").then((r) => r.json()),
    api("/api/inquiries").then((r) => (r.ok ? r.json() : [])),
  ]);

  const newInquiries = inquiriesRes.filter((q) => q.status === "New").length;
  const currentExhibitions = exhibitions.filter((e) => e.status === "Current").length;

  content.innerHTML = `
    <div class="admin-stats">
      <div class="admin-stat-card">
        <div class="admin-stat-card__label">Artworks</div>
        <div class="admin-stat-card__value">${artworks.length}</div>
        <div class="admin-stat-card__hint">In public catalog</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-card__label">Artists</div>
        <div class="admin-stat-card__value">${artists.length}</div>
        <div class="admin-stat-card__hint">Profiles on site</div>
      </div>
      <div class="admin-stat-card admin-stat-card--accent">
        <div class="admin-stat-card__label">Events</div>
        <div class="admin-stat-card__value">${exhibitions.length}</div>
        <div class="admin-stat-card__hint">${currentExhibitions} currently active</div>
      </div>
      <div class="admin-stat-card ${newInquiries ? "admin-stat-card--alert" : ""}">
        <div class="admin-stat-card__label">New inquiries</div>
        <div class="admin-stat-card__value">${newInquiries}</div>
        <div class="admin-stat-card__hint">Awaiting response</div>
      </div>
    </div>
    <div class="admin-panel-grid">
      <section class="admin-panel">
        <h2>Quick actions</h2>
        <div class="admin-quick-links">
          <button type="button" data-goto="artworks" data-action="add-artwork"><i class="fa-solid fa-plus"></i> Add artwork</button>
          <button type="button" data-goto="artists" data-action="add-artist"><i class="fa-solid fa-plus"></i> Add artist</button>
          <button type="button" data-goto="exhibitions" data-action="add-exhibition"><i class="fa-solid fa-plus"></i> Add event</button>
          <a href="/" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> View public site</a>
        </div>
      </section>
      <section class="admin-panel">
        <h2>Recent inquiries</h2>
        ${
          inquiriesRes.length
            ? `<ul style="list-style:none;margin:0;padding:0">${inquiriesRes
                .slice(0, 5)
                .map(
                  (q) => `<li style="padding:10px 0;border-bottom:1px solid #f0f0f0">
                <strong>${esc(q.visitor_name)}</strong>
                ${q.status === "New" ? '<span class="admin-badge admin-badge--new">New</span>' : ""}
                <br><small style="color:#888">${new Date(q.created_at).toLocaleString()}</small>
              </li>`
                )
                .join("")}</ul>
            <button type="button" class="admin-btn admin-btn--ghost" style="margin-top:16px" data-goto="inquiries">All inquiries</button>`
            : '<p style="color:#666;margin:0">No messages yet.</p>'
        }
      </section>
    </div>`;

  content.querySelectorAll("[data-goto]").forEach((el) => {
    el.addEventListener("click", () => {
      const view = el.dataset.goto;
      const action = el.dataset.action;
      document.querySelector(`.admin-sidebar [data-view="${view}"]`)?.click();
      if (action === "add-artwork") setTimeout(() => openArtworkForm(), 100);
      if (action === "add-artist") setTimeout(() => openArtistForm(), 100);
      if (action === "add-exhibition") setTimeout(() => openExhibitionForm(), 100);
    });
  });
}

function toolbarHtml(label, id) {
  return `<div class="admin-toolbar"><button type="button" class="admin-btn admin-btn--primary" id="${id}"><i class="fa-solid fa-plus"></i> ${label}</button></div>`;
}

function actionsHtml(resource, id, canEdit = true) {
  return `<div class="admin-table__actions">
    ${canEdit ? `<button class="admin-icon-btn" data-edit="${resource}" data-id="${id}" aria-label="Edit"><i class="fa-solid fa-pen"></i></button>` : ""}
    <button class="admin-icon-btn admin-icon-btn--danger" data-del="${resource}" data-id="${id}" aria-label="Delete"><i class="fa-solid fa-trash"></i></button>
  </div>`;
}

async function renderArtworksTable() {
  const rows = await (await api("/api/artworks")).json();
  if (!rows.length) {
    content.innerHTML =
      toolbarHtml("Add artwork", "add-artwork") +
      '<p class="admin-empty">No artworks yet. Add your first piece or create an artist first.</p>';
    document.getElementById("add-artwork")?.addEventListener("click", () => openArtworkForm());
    return;
  }
  content.innerHTML =
    toolbarHtml("Add artwork", "add-artwork") +
    `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Image</th><th>Title</th><th>Artist</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>${rows
      .map(
        (r) => `<tr>
      <td><img src="${esc(r.image_url || "")}" alt="" /></td>
      <td><strong>${esc(r.title)}</strong></td><td>${esc(r.artist_name)}</td><td>${esc(r.status)}</td>
      <td>${actionsHtml("artworks", r.id)}</td></tr>`
      )
      .join("")}</tbody></table></div>`;
  bindTableActions();
  document.getElementById("add-artwork")?.addEventListener("click", () => openArtworkForm());
}

async function renderArtistsTable() {
  const rows = await (await api("/api/artists")).json();
  if (!rows.length) {
    content.innerHTML =
      toolbarHtml("Add artist", "add-artist") +
      '<p class="admin-empty">No artists. Add at least one before creating artworks.</p>';
    document.getElementById("add-artist")?.addEventListener("click", () => openArtistForm());
    return;
  }
  const full = await Promise.all(rows.map((r) => api(`/api/artists/${r.id}`).then((res) => res.json())));
  content.innerHTML =
    toolbarHtml("Add artist", "add-artist") +
    `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Name</th><th>Born</th><th>Actions</th></tr></thead>
    <tbody>${full
      .map(
        (r) => `<tr>
      <td><strong>${esc(r.full_name)}</strong></td>
      <td>${r.birth_year ?? "—"}${r.death_year ? ` – ${r.death_year}` : ""}</td>
      <td>${actionsHtml("artists", r.id)}</td></tr>`
      )
      .join("")}</tbody></table></div>`;
  bindTableActions();
  document.getElementById("add-artist")?.addEventListener("click", () => openArtistForm());
}

async function renderExhibitionsTable() {
  const rows = await (await api("/api/exhibitions")).json();
  if (!rows.length) {
    content.innerHTML =
      toolbarHtml("Add event", "add-exhibition") +
      '<p class="admin-empty">No events yet. Create an exhibition for the Events page.</p>';
    document.getElementById("add-exhibition")?.addEventListener("click", () => openExhibitionForm());
    return;
  }
  content.innerHTML =
    toolbarHtml("Add event", "add-exhibition") +
    `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Title</th><th>Status</th><th>Dates</th><th>Actions</th></tr></thead>
    <tbody>${rows
      .map(
        (r) => `<tr>
      <td><strong>${esc(r.title)}</strong></td>
      <td>${esc(r.status)}</td>
      <td>${r.start_date} — ${r.end_date}</td>
      <td>${actionsHtml("exhibitions", r.id)}</td></tr>`
      )
      .join("")}</tbody></table></div>`;
  bindTableActions();
  document.getElementById("add-exhibition")?.addEventListener("click", () => openExhibitionForm());
}

async function renderInquiries() {
  const rows = await (await api("/api/inquiries")).json();
  content.innerHTML = rows.length
    ? rows
        .map(
          (q) => `
    <details class="admin-inquiry">
      <summary>
        <strong>${esc(q.visitor_name)}</strong> — <a href="mailto:${esc(q.visitor_email)}">${esc(q.visitor_email)}</a>
        ${q.status === "New" ? '<span class="admin-badge admin-badge--new">New</span>' : q.status === "Responded" ? '<span class="admin-badge admin-badge--ok">Responded</span>' : ""}
        <small style="margin-left:8px;color:#888">${new Date(q.created_at).toLocaleString()}</small>
      </summary>
      <div class="admin-inquiry__body">
        <p>${esc(q.message)}</p>
        ${q.status !== "Responded" ? `<button type="button" class="admin-btn admin-btn--primary" data-respond="${q.id}">Mark as responded</button>` : ""}
      </div>
    </details>`
        )
        .join("")
    : '<p class="admin-empty">No inquiries yet.</p>';

  content.querySelectorAll("[data-respond]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await api(`/api/inquiries/${btn.dataset.respond}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Responded" }),
      });
      showToast("Marked as responded");
      renderInquiries();
    });
  });
}

function bindTableActions() {
  content.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const { edit: resource, id } = btn.dataset;
      if (resource === "artworks") openArtworkForm(id);
      if (resource === "artists") openArtistForm(id);
      if (resource === "exhibitions") openExhibitionForm(id);
    });
  });
  content.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteId = btn.dataset.id;
      deleteResource = btn.dataset.del;
      openModal("confirm-modal");
    });
  });
}

document.getElementById("confirm-delete")?.addEventListener("click", async () => {
  if (!deleteId || !deleteResource) return;
  const res = await api(`/api/${deleteResource}/${deleteId}`, { method: "DELETE" });
  closeModal("confirm-modal");
  if (!res.ok) {
    showToast("Delete failed — item may be in use");
    return;
  }
  showToast("Record removed");
  loadView(currentView);
});

async function uploadImage(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await api("/api/uploads", { method: "POST", body: fd });
  if (!res.ok) throw new Error("upload failed");
  return (await res.json()).url;
}

function bindUploadZone(zone, urlInput, preview) {
  const pick = zone.querySelector('input[type="file"]');
  const show = (url) => {
    urlInput.value = url;
    if (preview) {
      preview.src = url;
      preview.hidden = !url;
    }
  };
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("is-dragover");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("is-dragover"));
  zone.addEventListener("drop", async (e) => {
    e.preventDefault();
    zone.classList.remove("is-dragover");
    const file = e.dataTransfer?.files?.[0];
    if (file) show(await uploadImage(file));
  });
  pick?.addEventListener("change", async () => {
    const file = pick.files?.[0];
    if (file) show(await uploadImage(file));
  });
}

function uploadFieldHtml(inputName, previewId) {
  return `
    <div class="form-field upload-zone" data-upload-zone>
      <p>Drag image or <label style="cursor:pointer;color:#c9a86c"><input type="file" accept="image/*" hidden /> browse</label></p>
      <img id="${previewId}" hidden alt="" />
    </div>
    <div class="form-field"><label>Image URL</label><input name="${inputName}" /></div>`;
}

async function openArtistForm(id = null) {
  let data = {
    full_name: "",
    biography: "",
    birth_year: "",
    death_year: "",
    profile_image_url: "",
    video_interview_url: "",
  };
  if (id) data = await (await api(`/api/artists/${id}`)).json();

  const modal = document.getElementById("entity-modal");
  document.getElementById("entity-modal-title").textContent = id ? "Edit artist" : "Add artist";
  const form = document.getElementById("entity-form");
  form.className = "admin-form";
  form.innerHTML = `
    <div class="form-field"><label>Full name</label><input name="full_name" required value="${esc(data.full_name)}" /></div>
    <div class="form-field"><label>Birth year</label><input name="birth_year" type="number" min="1000" max="2100" value="${data.birth_year ?? ""}" /></div>
    <div class="form-field"><label>Death year</label><input name="death_year" type="number" min="1000" max="2100" value="${data.death_year ?? ""}" /></div>
    ${uploadFieldHtml("profile_image_url", "artist-preview")}
    <div class="form-field"><label>Video URL (YouTube embed)</label><input name="video_interview_url" value="${esc(data.video_interview_url || "")}" placeholder="https://www.youtube.com/embed/..." /></div>
    <div class="form-field"><label>Biography</label><textarea name="biography">${esc(data.biography || "")}</textarea></div>
    <button type="submit" class="admin-btn admin-btn--primary">Save artist</button>`;

  form.profile_image_url.value = data.profile_image_url || "";
  const preview = form.querySelector("#artist-preview");
  if (data.profile_image_url) {
    preview.src = data.profile_image_url;
    preview.hidden = false;
  }
  bindUploadZone(form.querySelector("[data-upload-zone]"), form.profile_image_url, preview);

  form.onsubmit = async (e) => {
    e.preventDefault();
    const body = {
      full_name: form.full_name.value.trim(),
      biography: form.biography.value.trim() || null,
      birth_year: form.birth_year.value ? Number(form.birth_year.value) : null,
      death_year: form.death_year.value ? Number(form.death_year.value) : null,
      profile_image_url: form.profile_image_url.value.trim() || null,
      video_interview_url: form.video_interview_url.value.trim() || null,
    };
    const url = id ? `/api/artists/${id}` : "/api/artists";
    const res = await api(url, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      showToast("Save failed");
      return;
    }
    closeModal("entity-modal");
    showToast(id ? "Artist updated" : "Artist created");
    loadView("artists");
  };
  openModal("entity-modal");
}

async function openExhibitionForm(id = null) {
  let data = {
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    cover_image_url: "",
    status: "Upcoming",
  };
  if (id) data = await (await api(`/api/exhibitions/${id}`)).json();

  const modal = document.getElementById("entity-modal");
  document.getElementById("entity-modal-title").textContent = id ? "Edit event" : "Add event";
  const form = document.getElementById("entity-form");
  form.className = "admin-form";
  form.innerHTML = `
    <div class="form-field"><label>Title</label><input name="title" required value="${esc(data.title)}" /></div>
    <div class="form-field"><label>Status</label>
      <select name="status">
        <option value="Upcoming">Upcoming</option>
        <option value="Current">Current</option>
        <option value="Past">Past</option>
      </select>
    </div>
    <div class="form-field"><label>Start date</label><input name="start_date" type="date" required value="${data.start_date || ""}" /></div>
    <div class="form-field"><label>End date</label><input name="end_date" type="date" required value="${data.end_date || ""}" /></div>
    ${uploadFieldHtml("cover_image_url", "exhibition-preview")}
    <div class="form-field"><label>Description</label><textarea name="description">${esc(data.description || "")}</textarea></div>
    <button type="submit" class="admin-btn admin-btn--primary">Save event</button>`;

  form.status.value = data.status || "Upcoming";
  form.cover_image_url.value = data.cover_image_url || "";
  const preview = form.querySelector("#exhibition-preview");
  if (data.cover_image_url) {
    preview.src = data.cover_image_url;
    preview.hidden = false;
  }
  bindUploadZone(form.querySelector("[data-upload-zone]"), form.cover_image_url, preview);

  form.onsubmit = async (e) => {
    e.preventDefault();
    const body = {
      title: form.title.value.trim(),
      description: form.description.value.trim() || null,
      start_date: form.start_date.value,
      end_date: form.end_date.value,
      cover_image_url: form.cover_image_url.value.trim() || null,
      status: form.status.value,
    };
    const url = id ? `/api/exhibitions/${id}` : "/api/exhibitions";
    const res = await api(url, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      showToast("Save failed");
      return;
    }
    closeModal("entity-modal");
    showToast(id ? "Event updated" : "Event created");
    loadView("exhibitions");
  };
  openModal("entity-modal");
}

async function openArtworkForm(id = null) {
  const artists = await (await api("/api/artists")).json();
  if (!artists.length) {
    showToast("Create an artist first");
    loadView("artists");
    setTimeout(() => openArtistForm(), 200);
    return;
  }

  let data = {
    title: "",
    artist_id: artists[0].id,
    year: "",
    medium: "",
    dimensions: "",
    description: "",
    creation_story: "",
    status: "In Gallery",
    image_url: "",
  };
  if (id) data = await (await api(`/api/artworks/${id}`)).json();

  const modal = document.getElementById("entity-modal");
  document.getElementById("entity-modal-title").textContent = id ? "Edit artwork" : "Add artwork";
  const form = document.getElementById("entity-form");
  form.className = "admin-form";
  form.innerHTML = `
    <div class="form-field"><label>Title</label><input name="title" required value="${esc(data.title)}" /></div>
    <div class="form-field"><label>Artist</label><select name="artist_id">${artists
      .map((a) => `<option value="${a.id}" ${a.id === data.artist_id ? "selected" : ""}>${esc(a.full_name)}</option>`)
      .join("")}</select></div>
    <div class="form-field"><label>Year</label><input name="year" type="number" value="${data.year ?? ""}" /></div>
    <div class="form-field"><label>Medium</label><input name="medium" list="medium-list" value="${esc(data.medium || "")}" />
      <datalist id="medium-list"><option>Oil on Canvas</option><option>Sculpture</option><option>Digital</option><option>Photography</option></datalist></div>
    <div class="form-field"><label>Dimensions</label><input name="dimensions" value="${esc(data.dimensions || "")}" /></div>
    ${uploadFieldHtml("image_url", "artwork-preview")}
    <div class="form-field"><label>Description</label><textarea name="description">${esc(data.description || "")}</textarea></div>
    <div class="form-field"><label>Creation story</label><textarea name="creation_story">${esc(data.creation_story || "")}</textarea></div>
    <div class="form-field"><label>Status</label><select name="status">
      <option>In Gallery</option><option>On Exhibition</option><option>In Storage</option>
    </select></div>
    <button type="submit" class="admin-btn admin-btn--primary">Save artwork</button>`;

  form.querySelector('[name="status"]').value = data.status || "In Gallery";
  form.image_url.value = data.image_url || "";
  const preview = form.querySelector("#artwork-preview");
  if (data.image_url) {
    preview.src = data.image_url;
    preview.hidden = false;
  }
  bindUploadZone(form.querySelector("[data-upload-zone]"), form.image_url, preview);

  form.onsubmit = async (e) => {
    e.preventDefault();
    const body = {
      title: form.title.value,
      artist_id: form.artist_id.value,
      year: form.year.value ? Number(form.year.value) : null,
      medium: form.medium.value || null,
      dimensions: form.dimensions.value || null,
      description: form.description.value || null,
      creation_story: form.creation_story.value || null,
      image_url: form.image_url.value || null,
      status: form.status.value,
    };
    const url = id ? `/api/artworks/${id}` : "/api/artworks";
    const res = await api(url, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      showToast("Save failed");
      return;
    }
    closeModal("entity-modal");
    showToast("Saved");
    loadView("artworks");
  };
  openModal("entity-modal");
}

document.querySelectorAll("#entity-modal [data-close], #confirm-modal [data-close]").forEach((b) => {
  b.addEventListener("click", () => closeModal(b.closest(".admin-modal")?.id || "entity-modal"));
});

bindEscape([
  () => closeModal("entity-modal"),
  () => closeModal("confirm-modal"),
]);

function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

ensureAuth().then((u) => u && loadView("dashboard"));
