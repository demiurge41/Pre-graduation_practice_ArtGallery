const NAV = [
  { key: "home", href: "/", label: "Главная" },
  { key: "gallery", href: "/gallery", label: "Галерея" },
  { key: "exhibitions", href: "/exhibitions", label: "События" },
  { key: "contacts", href: "/contacts", label: "Контакты" },
];

export function mountTemplateHeader(active = "home") {
  const el = document.getElementById("ag-header-mount");
  if (!el) return;

  const links = NAV.map(
    (n) =>
      `<li><a href="${n.href}" class="${active === n.key ? "is-active" : ""}"${active === n.key ? ' aria-current="page"' : ""}>${n.label}</a></li>`
  ).join("");

  el.innerHTML = `
  <header class="ag-header">
    <div class="ag-topbar">
      <div class="ag-wrap ag-topbar__inner">
        <div class="ag-social">
          <span>Мы в соцсетях</span>
          <a href="https://www.facebook.com/thenationalgallery" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="https://x.com/nationalgallery" target="_blank" rel="noopener noreferrer" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="https://www.instagram.com/nationalgallery/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
          <a href="https://www.youtube.com/user/nationalgalleryuk" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
        </div>
        <a href="/" class="ag-logo-box">
          <div class="ag-logo-box__name">artgallery</div>
          <div class="ag-logo-box__tag">ТВОРЧЕСКОЕ БУДУЩЕЕ</div>
        </a>
        <a href="tel:+74951234567" class="ag-phone"><i class="fa-solid fa-phone"></i> +996 708-310-549</a>
      </div>
    </div>
    <nav class="ag-nav">
      <div class="ag-wrap">
        <ul class="ag-nav__list">${links}</ul>
      </div>
    </nav>
  </header>`;
}

export function mountTemplateFooter() {
  const el = document.getElementById("ag-footer-mount");
  if (!el) return;
  el.innerHTML = `
  <footer class="ag-footer">
    <div class="ag-wrap">
      <div class="ag-footer__grid">
        <div>
          <div class="ag-logo-box" style="display:inline-block;margin-bottom:12px">
            <div class="ag-logo-box__name">artgallery</div>
            <div class="ag-logo-box__tag">ТВОРЧЕСКОЕ БУДУЩЕЕ</div>
          </div>
          <p>Лучшие работы современного искусства с 2018 года.</p>
        </div>
        <div>
          <h3>Галерея</h3>
          <ul>
            <li><a href="/gallery">Все работы</a></li>
            <li><a href="/exhibitions">События</a></li>
            <li><a href="/#about">О нас</a></li>
          </ul>
        </div>
        <div>
          <h3>Посещение</h3>
          <ul>
            <li>Бишкек, ул. Ак-Ордо, 40</li>
            <li>Пн–Вс 9:00–20:00</li>
            <li><a href="tel:+996 708-310-549">+996 708-310-549</a></li>
          </ul>
        </div>
        <div>
          <h3>Контакты</h3>
          <ul>
            <li><a href="/contacts">Форма обратной связи</a></li>
            <li><a href="mailto:info@artgallery.com">info@artgallery.com</a></li>
          </ul>
        </div>
      </div>
      <p class="ag-footer__copy">© Художественная галерея «Творческое будущее». Все права защищены.</p>
    </div>
  </footer>`;
}

export function initMobileMenu() {
  const toggle = document.getElementById("ag-menu-toggle");
  const drawer = document.getElementById("ag-mobile-drawer");
  if (!toggle || !drawer) return;
  toggle.addEventListener("click", () => drawer.classList.toggle("is-open"));
  drawer.querySelector("[data-close-drawer]")?.addEventListener("click", () => drawer.classList.remove("is-open"));
}
