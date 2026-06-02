import { validateEmail } from "./utils.js";

document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const err = form.querySelector(".form-error");
  err.textContent = "";
  const email = form.email.value.trim();
  const password = form.password.value;
  if (!validateEmail(email)) {
    err.textContent = "Введите корректный email.";
    return;
  }
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    err.textContent = "Неверный email или пароль.";
    return;
  }
  window.location.href = "/gallery.admin";
});
