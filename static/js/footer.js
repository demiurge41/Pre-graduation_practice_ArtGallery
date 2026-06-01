import { t } from "./i18n.js";

export const SITE = {
  phone: "+7 (495) 123-45-67",
  phoneHref: "tel:+74951234567",
  email: "info@ateliernova.art",
  address: { ru: "Москва, ул. Арт-Стрит, 12", en: "Moscow, Art Street, 12" },
};

export function mountSiteFooter() {
  const root = document.getElementById("site-footer-mount");
  if (!root) return;
  const lang = localStorage.getItem("gallery-lang") || "ru";
  const addr = SITE.address[lang] || SITE.address.ru;

  root.innerHTML = `
  <footer class="site-footer" role="contentinfo">
    <div class="container footer-grid">
      <div>
        <strong>Atelier Nova</strong>
        <p>${addr}</p>
        <p><a href="${SITE.phoneHref}">${SITE.phone}</a> · <a href="mailto:${SITE.email}">${SITE.email}</a></p>
      </div>
      <div>
        <p><a href="/">${t("nav.gallery")}</a></p>
        <p><a href="/contacts">${t("nav.contacts")}</a></p>
        <p><a href="/exhibitions">${t("nav.exhibitions")}</a></p>
      </div>
      <div>
        <p><a href="#">${t("footer.policy")}</a></p>
        <p><a href="#">${t("footer.terms")}</a></p>
      </div>
    </div>
    <div class="container footer-bottom">${t("footer.rights")}</div>
  </footer>`;
}

export function applySiteContacts() {
  const lang = localStorage.getItem("gallery-lang") || "ru";
  document.querySelectorAll("[data-site=address]").forEach((el) => {
    el.textContent = SITE.address[lang] || SITE.address.ru;
  });
  document.querySelectorAll("[data-site=phone]").forEach((el) => {
    el.textContent = SITE.phone;
    if (el.tagName === "A") el.href = SITE.phoneHref;
  });
  document.querySelectorAll("[data-site=email]").forEach((el) => {
    el.textContent = SITE.email;
    if (el.tagName === "A") el.href = `mailto:${SITE.email}`;
  });
}
