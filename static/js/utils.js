export function debounce(fn, ms = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function showToast(message, duration = 4000) {
  let el = document.getElementById("global-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "global-toast";
    el.className = "toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("is-visible");
  setTimeout(() => el.classList.remove("is-visible"), duration);
}

export function bindEscape(closeFns) {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeFns.forEach((fn) => fn());
  });
}

export function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

const CATALOG_PARAM_KEYS = ["artist", "medium", "status", "year_from", "year_to", "q"];

export function setQueryParams(params, keysToReplace = CATALOG_PARAM_KEYS) {
  const url = new URL(window.location.href);
  keysToReplace.forEach((key) => url.searchParams.delete(key));
  params.forEach((value, key) => {
    if (value) url.searchParams.set(key, value);
  });
  history.replaceState(null, "", url);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  return EMAIL_RE.test(email);
}
