import { t } from "./i18n.js";
import { SITE } from "./footer.js";

export function mountSiteHeader({ active = "home", showSearch = false } = {}) {
  const root = document.getElementById("site-header-mount");
  if (!root) return;

  const link = (key, href, label) =>
    active === key
      ? `<a class="header-nav__link is-active" href="${href}" aria-current="page">${label}</a>`
      : `<a class="header-nav__link" href="${href}">${label}</a>`;

  const searchRow = showSearch
    ? `<div class="header-search">
        <div class="container-wide header-search__inner">
          <label for="search-input" class="sr-only">Поиск</label>
          <input id="search-input" class="search-input" type="search" placeholder="${t("search.placeholder")}" autocomplete="off" />
          <ul id="search-dropdown" class="search-dropdown" role="listbox"></ul>
        </div>
      </div>`
    : "";

  root.outerHTML = `
  <header class="site-header site-header--modern" role="banner">
    <div class="header-top">
      <div class="container-wide header-top__inner">
        <span class="header-top__promo" data-i18n="header.promo">Вт–Вс 11:00–20:00 · Бесплатный вход на выставки</span>
        <div class="header-top__utils">
          <a href="${SITE.phoneHref}" class="header-top__link"><i class="fa-solid fa-phone" aria-hidden="true"></i> ${SITE.phone}</a>
          <a href="mailto:${SITE.email}" class="header-top__link"><i class="fa-solid fa-envelope" aria-hidden="true"></i> ${SITE.email}</a>
        </div>
      </div>
    </div>
    <div class="header-main">
      <div class="container-wide header-main__inner">
        <a href="/" class="logo">Atelier Nova</a>
        <nav class="header-nav" aria-label="Основное меню">
          ${link("home", "/#about", t("nav.about"))}
          ${link("gallery", "/gallery", t("nav.gallery"))}
          ${link("exhibitions", "/exhibitions", t("nav.exhibitions"))}
          ${link("contacts", "/contacts", t("nav.contacts"))}
        </nav>
        <div class="header-end">
          <button type="button" id="menu-toggle" class="menu-toggle" aria-label="Меню"><i class="fa-solid fa-bars"></i></button>
        </div>
      </div>
    </div>
    ${searchRow}
  </header>
  <div id="mobile-drawer" class="mobile-drawer" aria-hidden="true">
    <div class="mobile-drawer__panel">
      <a href="/#about">${t("nav.about")}</a>
      <a href="/gallery">${t("nav.gallery")}</a>
      <a href="/exhibitions">${t("nav.exhibitions")}</a>
      <a href="/contacts">${t("nav.contacts")}</a>
      <a href="${SITE.phoneHref}">${SITE.phone}</a>
      <button type="button" class="btn btn--primary" data-close-drawer>Закрыть</button>
    </div>
  </div>`;
}
