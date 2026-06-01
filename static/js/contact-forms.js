import { showToast, validateEmail } from "./utils.js";

export function bindContactForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = form.querySelector(".form-error, .ag-form-error");
    if (err) err.textContent = "";
    const name = form.visitor_name.value.trim();
    const email = form.visitor_email.value.trim();
    const message = form.message.value.trim();
    if (!name || !message) {
      if (err) err.textContent = "Fill required fields.";
      return;
    }
    if (!validateEmail(email)) {
      if (err) err.textContent = "Invalid email.";
      return;
    }
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitor_name: name, visitor_email: email, message }),
    });
    if (!res.ok) {
      if (err) err.textContent = "Send failed.";
      return;
    }
    form.reset();
    showToast("Message sent — staff will see it in Inquiries.");
  });
}
