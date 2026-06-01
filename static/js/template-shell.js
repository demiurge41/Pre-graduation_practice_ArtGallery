const NAV = [

  { key: "home", href: "/", label: "Home" },

  { key: "gallery", href: "/gallery", label: "Gallery" },

  { key: "exhibitions", href: "/exhibitions", label: "Events" },

  { key: "contacts", href: "/contacts", label: "Contacts" },
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

          <span>Follow Us</span>

          <a href="https://www.facebook.com/thenationalgallery" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>

          <a href="https://x.com/nationalgallery" target="_blank" rel="noopener noreferrer" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>

          <a href="https://www.instagram.com/nationalgallery/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>

          <a href="https://www.youtube.com/user/nationalgalleryuk" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>

        </div>

        <a href="/" class="ag-logo-box">

          <div class="ag-logo-box__name">artgallery</div>

          <div class="ag-logo-box__tag">CREATIVE FUTURE</div>

        </a>

        <a href="tel:+18001234567" class="ag-phone"><i class="fa-solid fa-phone"></i> 1-800-1234-567</a>

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

            <div class="ag-logo-box__tag">CREATIVE FUTURE</div>

          </div>

          <p>Showcasing the best works of modern art since 2018.</p>

        </div>

        <div>

          <h3>Gallery</h3>

          <ul>

            <li><a href="/gallery">All Works</a></li>

            <li><a href="/exhibitions">Events</a></li>

            <li><a href="/#about">About</a></li>

          </ul>

        </div>

        <div>

          <h3>Visit</h3>

          <ul>

            <li>123 Art Street</li>

            <li>Mon–Sun 9:00–20:00</li>

            <li><a href="tel:+18001234567">1-800-1234-567</a></li>

          </ul>

        </div>

        <div>

          <h3>Contact</h3>

          <ul>

            <li><a href="/contacts">Contact Form</a></li>

            <li><a href="mailto:info@artgallery.com">info@artgallery.com</a></li>

          </ul>

        </div>

      </div>

      <p class="ag-footer__copy">© Art Gallery Creative Future. All rights reserved.</p>

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

