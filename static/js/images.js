export const IMG_PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="#E9ECEF" width="400" height="300"/><text x="200" y="155" text-anchor="middle" fill="#6c757d" font-family="system-ui,sans-serif" font-size="16">No image</text></svg>'
  );

export function imgOnError(el) {
  if (el.dataset.fallbackApplied) return;
  el.dataset.fallbackApplied = "1";
  el.src = IMG_PLACEHOLDER;
  el.alt = el.alt || "Image unavailable";
}

export function bindImageFallbacks(root = document) {
  root.querySelectorAll("img[data-fallback]").forEach((img) => {
    img.addEventListener("error", () => imgOnError(img));
    if (img.complete && img.naturalWidth === 0) imgOnError(img);
  });
}
