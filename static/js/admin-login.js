import { validateEmail } from "./utils.js";

document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const err = form.querySelector(".form-error");
  err.textContent = "";
  const email = form.email.value.trim();
  const password = form.password.value;
  if (!validateEmail(email)) {
    err.textContent = "Enter a valid email.";
    return;
  }
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    err.textContent = "Invalid email or password.";
    return;
  }
  window.location.href = "/gallery.admin";
});
