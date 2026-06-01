import { showToast, validateEmail } from "./utils.js";

export async function initInquiry(artworks = []) {
  const fab = document.getElementById("inquire-fab");
  const drawer = document.getElementById("inquire-drawer");
  const select = document.getElementById("inquiry-artwork");
  if (!fab || !drawer) return;

  if (select && artworks.length) {
    select.innerHTML =
      '<option value="">— Optional —</option>' +
      artworks.map((a) => `<option value="${a.id}">${a.title}</option>`).join("");
  }

  const open = () => {
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
  };
  const close = () => {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
  };

  fab.addEventListener("click", open);
  drawer.querySelector("[data-close]")?.addEventListener("click", close);
  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) close();
  });
  window.__closeInquireDrawer = close;

  const form = document.getElementById("inquiry-form");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.visitor_name.value.trim();
    const email = form.visitor_email.value.trim();
    const message = form.message.value.trim();
    const err = form.querySelector(".form-error");
    err.textContent = "";
    if (!name || !message) {
      err.textContent = "Please fill in all required fields.";
      return;
    }
    if (!validateEmail(email)) {
      err.textContent = "Please enter a valid email address.";
      return;
    }
    const body = {
      visitor_name: name,
      visitor_email: email,
      message,
      artwork_reference_id: form.artwork_reference_id.value || null,
    };
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      err.textContent = "Could not send message. Try again later.";
      return;
    }
    form.reset();
    close();
    showToast("Message successfully transmitted");
  });
}
