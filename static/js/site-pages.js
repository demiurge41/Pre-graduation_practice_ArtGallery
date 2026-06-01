import { mountTemplateFooter, mountTemplateHeader, initMobileMenu } from "./template-shell.js?v=5";
import { initCatalog } from "./catalog.js?v=3";
import { initEventsPage } from "./events-page.js";
import { initInquiry } from "./inquiry.js";
import { initArtworkPage } from "./artwork-page.js";
import { bindContactForm } from "./contact-forms.js";

const page = document.body.dataset.page || "";

mountTemplateHeader(page);
mountTemplateFooter();
initMobileMenu();

if (page === "gallery") {
  await initCatalog();
  const res = await fetch("/api/artworks");
  await initInquiry(await res.json());
}
if (page === "exhibitions" || page === "events") {
  await initEventsPage();
  const res = await fetch("/api/artworks");
  await initInquiry(await res.json());
}
if (page === "contacts") {
  bindContactForm("contacts-form");
}
if (page === "artwork") {
  await initArtworkPage();
}
