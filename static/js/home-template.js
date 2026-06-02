import { mountTemplateFooter, mountTemplateHeader, initMobileMenu } from "./template-shell.js?v=5";

mountTemplateHeader("home");
mountTemplateFooter();
initMobileMenu();

async function loadWorksGrid() {
  const grid = document.getElementById("home-works-grid");
  if (!grid) return;
  try {
    const res = await fetch("/api/artworks");
    const items = (await res.json()).slice(0, 6);
    const urls = items.map((a) => a.image_url).filter(Boolean);
    const fallback = [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80",
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80",
      "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80",
      "https://images.unsplash.com/photo-1515405296620-991d55bded21?w=600&q=80",
      "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    ];
    const imgs = urls.length >= 6 ? urls : fallback;
    const link = (i) => (items[i]?.id ? `/gallery/${items[i].id}` : "/gallery");
    grid.innerHTML = `
      <a href="${link(0)}" class="ag-work"><img src="${imgs[0]}" alt="" /></a>
      <a href="${link(1)}" class="ag-work"><img src="${imgs[1]}" alt="" /></a>
      <a href="${link(2)}" class="ag-work"><img src="${imgs[2]}" alt="" /></a>
      <a href="${link(3)}" class="ag-work"><img src="${imgs[3]}" alt="" /></a>
      <div class="ag-work--stack">
        <a href="${link(4)}" class="ag-work"><img src="${imgs[4]}" alt="" /></a>
        <a href="${link(5)}" class="ag-work"><img src="${imgs[5]}" alt="" /></a>
      </div>`;
  } catch {
    grid.innerHTML = "<p>Загрузка работ…</p>";
  }
}

loadWorksGrid();
