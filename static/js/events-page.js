import { bindImageFallbacks } from "./images.js";

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function badgeClass(status) {
  if (status === "Current") return "ev-badge--current";
  if (status === "Upcoming") return "ev-badge--upcoming";
  return "ev-badge--past";
}

function formatDateRange(start, end) {
  const fmt = (s) => {
    const d = new Date(`${s}T12:00:00`);
    if (Number.isNaN(d.getTime())) return s;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };
  return `${fmt(start)} — ${fmt(end)}`;
}

function setModalRsvp(modal, status) {
  const isPast = status === "Past";
  modal.querySelector(".rsvp-form-wrap")?.toggleAttribute("hidden", isPast);
  modal.querySelector(".rsvp-success")?.setAttribute("hidden", "");
  modal.querySelector("#rsvp-form")?.reset();
  const notice = modal.querySelector("#ex-past-notice");
  if (notice) notice.toggleAttribute("hidden", !isPast);
}

export async function initEventsPage() {
  const list = document.getElementById("events-list") || document.getElementById("exhibition-list");
  if (!list) return;

  const res = await fetch("/api/exhibitions");
  const items = await res.json();

  if (!items.length) {
    list.innerHTML = '<p class="ev-empty">No events scheduled.</p>';
    return;
  }

  list.innerHTML = items
    .map(
      (e) => `
    <article class="ev-card" data-id="${e.id}">
      <div class="ev-card__media">
        <img src="${e.cover_image_url || ""}" alt="" loading="lazy" data-fallback />
        <span class="ev-badge ${badgeClass(e.status)}">${escapeHtml(e.status)}</span>
      </div>
      <div class="ev-card__content">
        <p class="ev-card__dates">
          <i class="fa-regular fa-calendar-days" aria-hidden="true"></i>
          ${formatDateRange(e.start_date, e.end_date)}
        </p>
        <h2 class="ev-card__title">${escapeHtml(e.title)}</h2>
        <p class="ev-card__text">${escapeHtml((e.description || "").slice(0, 240))}${(e.description || "").length > 240 ? "…" : ""}</p>
        <button type="button" class="ev-card__btn" data-view="${e.id}">
          View Event Details <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </button>
      </div>
    </article>`
    )
    .join("");

  bindImageFallbacks(list);

  const modal = document.getElementById("event-modal");
  const close = () => {
    modal?.classList.remove("is-open");
    modal?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modal?.querySelector(".rsvp-form-wrap")?.removeAttribute("hidden");
    modal?.querySelector(".rsvp-success")?.setAttribute("hidden", "");
    modal?.querySelector("#ex-past-notice")?.setAttribute("hidden", "");
    modal?.querySelector("#rsvp-form")?.reset();
  };

  modal?.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", close));

  list.querySelectorAll("[data-view]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const res = await fetch(`/api/exhibitions/${btn.dataset.view}`);
      const ex = await res.json();
      const badge = modal.querySelector("#ex-badge");
      badge.textContent = ex.status;
      badge.className = `ev-badge ${badgeClass(ex.status)}`;
      modal.querySelector("#ex-title").textContent = ex.title;
      modal.querySelector("#ex-desc").textContent = ex.description || "";
      modal.querySelector("#ex-dates").textContent = formatDateRange(ex.start_date, ex.end_date);
      setModalRsvp(modal, ex.status);
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  modal?.querySelector("#rsvp-form")?.addEventListener("submit", (ev) => {
    ev.preventDefault();
    modal.querySelector(".rsvp-form-wrap").setAttribute("hidden", "");
    modal.querySelector(".rsvp-success").removeAttribute("hidden");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("is-open")) close();
  });

  window.__closeExhibitionModal = close;
}
