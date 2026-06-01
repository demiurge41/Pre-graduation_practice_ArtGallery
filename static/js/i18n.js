const dict = {
  ru: {
    "page.home": "Atelier Nova — Галерея",
    "page.gallery": "Галерея — Atelier Nova",
    "page.contacts": "Контакты — Atelier Nova",
    "nav.gallery": "Галерея",
    "nav.contacts": "Контакты",
    "nav.about": "О нас",
    "nav.exhibitions": "Выставки",
    "hero.eyebrow": "Современная художественная галерея",
    "hero.title": "Atelier Nova",
    "hero.lead": "Живопись, скульптура и цифровое искусство в минималистичном пространстве света и тишины.",
    "hero.cta": "Смотреть галерею",
    "about.title": "О нас",
    "about.p1": "Atelier Nova открылась в 2018 году как независимое пространство для диалога между художником и зрителем.",
    "about.p2": "Каждый сезон — новая экспозиция, публичные лекции и открытые студии.",
    "location.title": "Местоположение",
    "location.hours": "Вт–Вс: 11:00–20:00",
    "location.map": "Карта (встраивание по запросу)",
    "form.quick": "Быстрая связь",
    "form.contact": "Форма связи",
    "form.name": "Имя",
    "form.email": "Email",
    "form.message": "Сообщение",
    "form.send": "Отправить",
    "form.cancel": "Отмена",
    "form.artwork": "Работа (необяз.)",
    "footer.policy": "Политика конфиденциальности",
    "footer.terms": "Условия использования",
    "footer.rights": "© Atelier Nova",
    "filters.title": "Фильтры",
    "filters.artist": "Художник",
    "filters.medium": "Техника",
    "filters.period": "Период",
    "filters.status": "Статус",
    "filters.from": "С",
    "filters.to": "По",
    "filters.any": "Любой",
    "filters.apply": "Применить",
    "status.gallery": "В галерее",
    "status.exhibition": "На выставке",
    "status.storage": "На хранении",
    "inquire": "Спросить",
    "inquire.title": "Написать нам",
    "artwork.back": "← Назад в галерею",
    "artwork.year": "Год",
    "artwork.dimensions": "Размеры",
    "artwork.description": "Описание",
    "artwork.story": "История создания",
    "artwork.artist": "Об авторе",
    "search.placeholder": "Поиск по названию или автору…",
    "header.promo": "Вт–Вс 11:00–20:00 · Бесплатный вход на выставки",
  },
  en: {
    "page.home": "Atelier Nova — Gallery",
    "page.gallery": "Gallery — Atelier Nova",
    "page.contacts": "Contacts — Atelier Nova",
    "nav.gallery": "Gallery",
    "nav.contacts": "Contacts",
    "nav.about": "About",
    "nav.exhibitions": "Exhibitions",
    "hero.eyebrow": "Contemporary art gallery",
    "hero.title": "Atelier Nova",
    "hero.lead": "Painting, sculpture and digital art in a calm, light-filled space.",
    "hero.cta": "View gallery",
    "about.title": "About us",
    "about.p1": "Atelier Nova opened in 2018 as an independent space for dialogue between artist and viewer.",
    "about.p2": "Each season brings a new exhibition, public talks and open studios.",
    "location.title": "Location",
    "location.hours": "Tue–Sun: 11:00–20:00",
    "location.map": "Map (embed on request)",
    "form.quick": "Quick message",
    "form.contact": "Contact form",
    "form.name": "Name",
    "form.email": "Email",
    "form.message": "Message",
    "form.send": "Send",
    "form.cancel": "Cancel",
    "form.artwork": "Artwork (optional)",
    "footer.policy": "Privacy policy",
    "footer.terms": "Terms of use",
    "footer.rights": "© Atelier Nova",
    "filters.title": "Filters",
    "filters.artist": "Artist",
    "filters.medium": "Medium",
    "filters.period": "Period",
    "filters.status": "Status",
    "filters.from": "From",
    "filters.to": "To",
    "filters.any": "Any",
    "filters.apply": "Apply",
    "status.gallery": "In gallery",
    "status.exhibition": "On exhibition",
    "status.storage": "In storage",
    "inquire": "Inquire",
    "inquire.title": "Contact us",
    "artwork.back": "← Back to gallery",
    "artwork.year": "Year",
    "artwork.dimensions": "Dimensions",
    "artwork.description": "Description",
    "artwork.story": "Creation story",
    "artwork.artist": "About the artist",
    "search.placeholder": "Search title or artist…",
    "header.promo": "Tue–Sun 11:00–20:00 · Free exhibition entry",
  },
};

let lang = localStorage.getItem("gallery-lang") || "ru";

export function getLang() {
  return lang;
}

export function setLang(next) {
  lang = next;
  localStorage.setItem("gallery-lang", next);
  document.documentElement.lang = next;
  applyI18n();
  import("./footer.js").then((m) => {
    m.mountSiteFooter();
    m.applySiteContacts();
  });
}

export function t(key) {
  return dict[lang]?.[key] ?? dict.ru[key] ?? key;
}

export function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const text = t(key);
    if (el.tagName === "INPUT" && el.type === "search") el.placeholder = text;
    else el.textContent = text;
  });
  document.title = document.querySelector("title[data-i18n]")?.textContent || document.title;
}

export function initLangSwitch() {
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
    btn.addEventListener("click", () => {
      setLang(btn.dataset.lang);
      document.querySelectorAll("[data-lang]").forEach((b) =>
        b.classList.toggle("is-active", b.dataset.lang === lang)
      );
    });
  });
  document.documentElement.lang = lang;
  applyI18n();
}
