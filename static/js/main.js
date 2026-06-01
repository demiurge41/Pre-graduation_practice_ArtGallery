import { bindEscape } from "./utils.js";
import { initCatalog } from "./catalog.js";
import { initEventsPage } from "./events-page.js";
import { initInquiry } from "./inquiry.js";
import { mountSiteHeader } from "./header.js";
import { mountSiteFooter, applySiteContacts } from "./footer.js";
import { bindImageFallbacks } from "./images.js";
import { initLangSwitch, applyI18n } from "./i18n.js";
import { initArtworkPage } from "./artwork-page.js";
import { bindContactForm } from "./contact-forms.js";

function initShell() {
  const toggle = document.getElementById("menu-toggle");
  const drawer = document.getElementById("mobile-drawer");
  toggle?.addEventListener("click", () => {
    drawer?.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", drawer?.classList.contains("is-open"));
  });
  drawer?.querySelector("[data-close-drawer]")?.addEventListener("click", () => {
    drawer?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  });

  const filterFab = document.getElementById("filter-fab");
  const filterModal = document.getElementById("filter-modal");
  filterFab?.addEventListener("click", () => filterModal?.classList.add("is-open"));
  filterModal?.querySelector("[data-close-filters]")?.addEventListener("click", () =>
    filterModal.classList.remove("is-open")
  );

  bindEscape([
    () => document.getElementById("mobile-drawer")?.classList.remove("is-open"),
    () => document.getElementById("filter-modal")?.classList.remove("is-open"),
    () => window.__closeInquireDrawer?.(),
    () => window.__closeExhibitionModal?.(),
  ]);
}

function detectPage() {
  if (document.body.classList.contains("page-template")) return "template";
  if (document.getElementById("artwork-root")) return "artwork";
  if (document.getElementById("artwork-grid")) return "gallery";
  if (document.getElementById("events-list") || document.getElementById("exhibition-list")) return "exhibitions";
  if (document.getElementById("home-contact-form")) return "home";
  if (document.getElementById("contacts-form")) return "contacts";
  return "other";
}

document.addEventListener("DOMContentLoaded", async () => {
  const page = detectPage();
  if (page === "template") return;
  const headerActive =
    page === "gallery" ? "gallery" : page === "exhibitions" ? "exhibitions" : page === "contacts" ? "contacts" : "home";

  mountSiteHeader({ active: headerActive, showSearch: page === "gallery" });
  mountSiteFooter();
  initLangSwitch();
  applySiteContacts();
  initShell();
  bindImageFallbacks(document);

  if (page === "home") {
    bindContactForm("home-contact-form");
    return;
  }
  if (page === "contacts") {
    bindContactForm("contacts-form");
    return;
  }
  if (page === "artwork") {
    await initArtworkPage();
    return;
  }
  if (page === "gallery") {
    await initCatalog();
    const res = await fetch("/api/artworks");
    await initInquiry(await res.json());
    return;
  }
  if (page === "exhibitions") {
    await initEventsPage();
    const res = await fetch("/api/artworks");
    await initInquiry(await res.json());
  }
});
