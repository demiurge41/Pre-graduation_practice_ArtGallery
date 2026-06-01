import { bindImageFallbacks, imgOnError } from "./images.js";

const LABELS = {
  medium: "Medium",
  year: "Year",
  status: "Status",
  dimensions: "Dimensions",
};

const STATUS_LABELS = {
  "In Gallery": "In gallery",
  "On Exhibition": "On exhibition",
  "In Storage": "In storage",
};

function artworkIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const i = parts.indexOf("gallery");
  return i >= 0 && parts[i + 1] ? parts[i + 1] : null;
}

function statusLabel(status) {
  return STATUS_LABELS[status] || status;
}

export async function initArtworkPage() {
  const id = artworkIdFromPath();
  if (!id) {
    window.location.href = "/gallery";
    return;
  }
  const res = await fetch(`/api/artworks/${id}`);
  if (!res.ok) {
    window.location.href = "/gallery";
    return;
  }
  const a = await res.json();
  document.title = `${a.title} — Atelier Nova`;
  const img = document.getElementById("artwork-image");
  img.src = a.image_url || "";
  img.alt = a.title;
  img.onerror = () => imgOnError(img);
  document.getElementById("artwork-title").textContent = a.title;
  const artistLink = document.getElementById("artwork-artist-link");
  artistLink.textContent = a.artist_name;
  artistLink.href = `/gallery?artist=${a.artist_id}`;
  document.getElementById("artwork-meta").innerHTML = [
    [LABELS.medium, a.medium || "—"],
    [LABELS.year, a.year ?? "—"],
    [LABELS.status, statusLabel(a.status)],
    [LABELS.dimensions, a.dimensions || "—"],
  ]
    .map(
      ([label, value]) =>
        `<div class="ag-artwork-detail__meta-item" role="listitem">
      <span class="ag-artwork-detail__meta-label">${label}</span>
      <span class="ag-artwork-detail__meta-value">${value}</span>
    </div>`
    )
    .join("");
  document.getElementById("artwork-description").textContent = a.description || "—";
  document.getElementById("artwork-story").textContent =
    a.creation_story || "Story coming soon.";
  const bioBlock = document.getElementById("artist-bio-block");
  if (a.artist_biography) {
    bioBlock.hidden = false;
    document.getElementById("artwork-artist-bio").textContent = a.artist_biography;
  } else {
    bioBlock.hidden = true;
  }
  bindImageFallbacks(document.getElementById("artwork-root"));
}
