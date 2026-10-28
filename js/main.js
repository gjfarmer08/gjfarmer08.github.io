// Graham Farmer — Executive Portfolio
document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileNav();
  initActiveNav();
  initReveal();
  initLightbox();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

/* Header shadow on scroll */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* Mobile menu */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;
  const setOpen = (open) => {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setOpen(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
}

/* Highlight the nav link for the section in view */
function initActiveNav() {
  const links = [...document.querySelectorAll(".nav-links a[href^='#']")];
  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const sections = [...map.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if (!("IntersectionObserver" in window) || !sections.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.remove("active"));
      const link = map.get(entry.target.id);
      if (link) link.classList.add("active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => io.observe(s));
}

/* Gentle fade-in; content stays visible if JS or IntersectionObserver is unavailable */
function initReveal() {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const els = document.querySelectorAll(".stat, .role, .doc-card, .gallery figure, .education-card, .innovation-grid, .profile-grid");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach((el) => {
    // Don't hide anything already on screen at load
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.classList.add("reveal");
    io.observe(el);
  });
}

/* Gallery category filters */
function initGalleryFilters() {
  const chips = document.querySelectorAll(".gallery-filters .chip");
  const figs = document.querySelectorAll(".gallery figure");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => {
        const on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", String(on));
      });
      figs.forEach((fig) => { fig.hidden = f !== "all" && fig.dataset.group !== f; });
    });
  });
}

/* Accessible gallery lightbox with previous/next */
function initLightbox() {
  initGalleryFilters();
  const box = document.getElementById("lightbox");
  if (!box) return;
  const img = box.querySelector("img");
  const caption = box.querySelector(".lightbox-caption");
  const closeBtn = box.querySelector(".lightbox-close");
  const prevBtn = box.querySelector(".lightbox-prev");
  const nextBtn = box.querySelector(".lightbox-next");
  let lastFocus = null;
  let list = [];
  let idx = 0;

  const visibleButtons = () =>
    [...document.querySelectorAll(".gallery figure:not([hidden]) .gallery-btn")];

  const show = (i) => {
    idx = (i + list.length) % list.length;
    const btn = list[idx];
    const thumb = btn.querySelector("img");
    const cap = btn.closest("figure").querySelector("figcaption strong");
    img.src = btn.dataset.full || thumb.src;
    img.alt = thumb.alt;
    caption.textContent = cap ? cap.textContent : "";
    const multi = list.length > 1;
    prevBtn.hidden = !multi;
    nextBtn.hidden = !multi;
  };
  const open = (btn) => {
    lastFocus = document.activeElement;
    list = visibleButtons();
    show(list.indexOf(btn));
    box.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };
  const close = () => {
    box.hidden = true;
    img.removeAttribute("src");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };

  document.querySelectorAll(".gallery-btn").forEach((btn) => btn.addEventListener("click", () => open(btn)));
  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(idx - 1));
  nextBtn.addEventListener("click", () => show(idx + 1));
  box.addEventListener("click", (e) => { if (e.target === box) close(); });
  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });

  // Swipe on touch screens
  let x0 = null;
  box.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}
