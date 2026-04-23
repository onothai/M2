function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function setupNav() {
  const btn = qs(".nav-toggle");
  const menu = qs("#navMenu");
  if (!btn || !menu) return;

  function setOpen(open) {
    btn.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }

  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  // close when clicking a link (mobile)
  qsa("a", menu).forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });

  // close on outside click
  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("is-open")) return;
    const target = e.target;
    if (!(target instanceof Node)) return;
    if (menu.contains(target) || btn.contains(target)) return;
    setOpen(false);
  });

  // close on escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

function setupPathTabs() {
  const pills = qsa(".pill");
  const panels = qsa(".path-panel");
  if (!pills.length || !panels.length) return;

  const byName = new Map(panels.map((p) => [p.dataset.panel, p]));

  function activate(name) {
    pills.forEach((p) => p.classList.toggle("is-active", p.dataset.path === name));
    panels.forEach((p) => p.classList.add("is-hidden"));
    const panel = byName.get(name);
    if (panel) panel.classList.remove("is-hidden");
  }

  pills.forEach((p) => {
    p.addEventListener("click", () => activate(p.dataset.path));
  });
}

setupNav();
setupPathTabs();

