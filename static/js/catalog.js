import { bindImageFallbacks } from "./images.js";
import { debounce, getQueryParams, setQueryParams } from "./utils.js";

let allArtworks = [];
let allArtists = [];

const FILTER_ALL = "all";

const grid = () => document.getElementById("artwork-grid");

function getFiltersRoot() {
  return document.querySelector(".filters");
}

export async function initCatalog() {
  const [artworksRes, artistsRes] = await Promise.all([
    fetch("/api/artworks"),
    fetch("/api/artists"),
  ]);
  allArtworks = await artworksRes.json();
  allArtists = await artistsRes.json();

  buildFilterUI();
  syncUIFromUrl();
  renderGrid(filterArtworks(collectFilters()));
  setupSearch();
}

function collectFilters() {
  const root = getFiltersRoot();
  const p = new URLSearchParams();
  if (!root) return p;

  const artist = root.querySelector('input[name="artist"]:checked');
  const artistVal = artist?.value;
  if (artistVal && artistVal !== FILTER_ALL) p.set("artist", artistVal);

  const medium = root.querySelector('input[name="medium"]:checked');
  const mediumVal = medium?.value;
  if (mediumVal && mediumVal !== FILTER_ALL) p.set("medium", mediumVal);

  const status = root.querySelector('input[name="status"]:checked');
  const statusVal = status?.value;
  if (statusVal && statusVal !== FILTER_ALL) p.set("status", statusVal);

  const yf = root.querySelector("#filter-year-from")?.value?.trim();
  const yt = root.querySelector("#filter-year-to")?.value?.trim();
  if (yf) p.set("year_from", yf);
  if (yt) p.set("year_to", yt);

  const q = document.getElementById("search-input")?.value.trim();
  if (q) p.set("q", q);

  return p;
}

function filterArtworks(params) {
  const p = params || collectFilters();
  const q = (p.get("q") || "").toLowerCase();
  const artistId = p.get("artist");
  const medium = p.get("medium");
  const status = p.get("status");

  return allArtworks.filter((a) => {
    if (artistId && String(a.artist_id) !== String(artistId)) return false;
    if (medium && !(a.medium || "").toLowerCase().includes(medium.toLowerCase())) return false;
    if (status && a.status !== status) return false;
    if (p.get("year_from") && (a.year == null || a.year < Number(p.get("year_from")))) return false;
    if (p.get("year_to") && (a.year == null || a.year > Number(p.get("year_to")))) return false;
    if (q && !`${a.title} ${a.artist_name}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

function renderGrid(items) {
  const el = grid();
  if (!el) return;
  if (!items.length) {
    el.innerHTML = '<p class="empty-state">Нет работ по выбранным фильтрам.</p>';
    return;
  }
  el.innerHTML = items
    .map(
      (a) => `
    <a class="ag-art-card" href="/gallery/${a.id}" aria-label="Открыть: ${escapeHtml(a.title)}">
      <img src="${a.image_url || ""}" alt="${escapeHtml(a.title)}" loading="lazy" data-fallback />
      <div class="ag-art-card__body">
        <p class="ag-art-card__title">${escapeHtml(a.title)}</p>
        <p class="ag-art-card__artist">${escapeHtml(a.artist_name)} · ${a.year ?? "—"}</p>
      </div>
    </a>`
    )
    .join("");

  bindImageFallbacks(el);
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function buildFilterUI() {
  const artistRoots = document.querySelectorAll(".filter-artists-root");
  const mediumRoots = document.querySelectorAll(".filter-media-root");

  const artistHtml =
    `<label><input type="radio" name="artist" value="${FILTER_ALL}" checked /> Все художники</label>` +
    allArtists
      .map(
        (ar) =>
          `<label><input type="radio" name="artist" value="${ar.id}" /> ${escapeHtml(ar.full_name)}</label>`
      )
      .join("");

  artistRoots.forEach((box) => {
    box.innerHTML = artistHtml;
  });

  const media = [...new Set(allArtworks.map((a) => a.medium).filter(Boolean))];
  const mediumHtml =
    `<label><input type="radio" name="medium" value="${FILTER_ALL}" checked /> Любая техника</label>` +
    media
      .map(
        (m) =>
          `<label><input type="radio" name="medium" value="${escapeHtml(m)}" /> ${escapeHtml(m)}</label>`
      )
      .join("");

  mediumRoots.forEach((box) => {
    box.innerHTML = mediumHtml;
  });

  const root = getFiltersRoot();
  if (!root) return;

  root.addEventListener("change", (e) => {
    const t = e.target;
    if (
      t.matches('input[name="artist"], input[name="medium"], input[name="status"]') ||
      t.id === "filter-year-from" ||
      t.id === "filter-year-to"
    ) {
      applyFilters();
    }
  });
}

function applyFilters() {
  const p = collectFilters();
  setQueryParams(p);
  renderGrid(filterArtworks(p));
}

function syncUIFromUrl() {
  const p = getQueryParams();
  const root = getFiltersRoot();
  if (!root) return;

  const qInput = document.getElementById("search-input");
  if (qInput) qInput.value = p.get("q") || "";

  const artist = p.get("artist");
  const artistRadio = artist
    ? root.querySelector(`input[name="artist"][value="${CSS.escape(artist)}"]`)
    : root.querySelector(`input[name="artist"][value="${FILTER_ALL}"]`);
  if (artistRadio) artistRadio.checked = true;

  const medium = p.get("medium");
  const mediumRadio = medium
    ? root.querySelector(`input[name="medium"][value="${CSS.escape(medium)}"]`)
    : root.querySelector(`input[name="medium"][value="${FILTER_ALL}"]`);
  if (mediumRadio) mediumRadio.checked = true;

  const status = p.get("status");
  const statusRadio = status
    ? root.querySelector(`input[name="status"][value="${CSS.escape(status)}"]`)
    : root.querySelector('input[name="status"][value="all"]');
  if (statusRadio) statusRadio.checked = true;

  const yearFrom = root.querySelector("#filter-year-from");
  const yearTo = root.querySelector("#filter-year-to");
  if (yearFrom) yearFrom.value = p.get("year_from") || "";
  if (yearTo) yearTo.value = p.get("year_to") || "";
}

function setupSearch() {
  const input = document.getElementById("search-input");
  const dropdown = document.getElementById("search-dropdown");
  if (!input || !dropdown) return;

  const run = debounce(() => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      dropdown.classList.remove("is-open");
      dropdown.innerHTML = "";
      applyFilters();
      return;
    }
    const matches = allArtworks
      .filter((a) => `${a.title} ${a.artist_name}`.toLowerCase().includes(q))
      .slice(0, 8);
    dropdown.innerHTML = matches
      .map(
        (a) =>
          `<li><button type="button" data-id="${a.id}">${escapeHtml(a.title)} — <em>${escapeHtml(a.artist_name)}</em></button></li>`
      )
      .join("");
    dropdown.classList.toggle("is-open", matches.length > 0);
    dropdown.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.location.href = `/gallery/${btn.dataset.id}`;
        dropdown.classList.remove("is-open");
      });
    });
    applyFilters();
  }, 300);

  input.addEventListener("input", run);
}
