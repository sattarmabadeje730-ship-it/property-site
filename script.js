/* Haven Lagos – listings, filters, property details and page behaviour.
   All listing data below is sample content for the demo concept. */

const homes = [
  { id: "a", title: "Garden Court Residence", place: "Lekki Phase 1", area: "lekki", type: "detached", deal: "buy", n: 420000000, price: "₦420,000,000", beds: 5, baths: 5, size: "420 sqm", img: "image/garden-residence.jpg", desc: "A private, light-filled home with a generous garden and room to host." },
  { id: "b", title: "The Maple Terrace", place: "Old Ikoyi", area: "ikoyi", type: "terrace", deal: "buy", n: 680000000, price: "₦680,000,000", beds: 4, baths: 4, size: "350 sqm", img: "image/terrace-home.jpg", desc: "A thoughtfully finished terrace with warm materials and quiet corners." },
  { id: "c", title: "Lagoon View Apartment", place: "Victoria Island", area: "victoria island", type: "apartment", deal: "rent", n: 95000000, price: "₦95,000,000 / year", beds: 3, baths: 3, size: "210 sqm", img: "image/modern-apartment.jpg", desc: "An airy contemporary apartment near Victoria Island restaurants and offices." },
  { id: "d", title: "Olive House", place: "GRA Ikeja", area: "ikeja", type: "detached", deal: "buy", n: 315000000, price: "₦315,000,000", beds: 4, baths: 4, size: "500 sqm", img: "image/hero-villa.jpg", desc: "A relaxed detached home in leafy Ikeja with indoor-outdoor living." },
  { id: "e", title: "The Palm Loft", place: "Lekki Phase 1", area: "lekki", type: "apartment", deal: "rent", n: 42000000, price: "₦42,000,000 / year", beds: 2, baths: 2, size: "145 sqm", img: "image/living-room.jpg", desc: "A refined apartment with open-plan living and soft natural light." },
  { id: "f", title: "Cedar Grove Home", place: "Ikoyi", area: "ikoyi", type: "terrace", deal: "buy", n: 560000000, price: "₦560,000,000", beds: 4, baths: 4, size: "310 sqm", img: "image/terrace-home.jpg", desc: "A modern family home with generous bedrooms and a peaceful setting." },
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let deal = "buy";
let saved = new Set();
try {
  saved = new Set(JSON.parse(localStorage.getItem("haven-saved") || "[]"));
} catch {
  /* storage unavailable (private mode) – favourites just won't persist */
}

function persistSaved() {
  try {
    localStorage.setItem("haven-saved", JSON.stringify([...saved]));
  } catch {
    /* ignore */
  }
}

const cards = $("#cards");
const loc = $("#loc");
const type = $("#type");
const budget = $("#budget");
const count = $("#count");
const empty = $("#empty");
const dialog = $("#dialog");
const detail = $("#detail");

function card(h) {
  const yes = saved.has(h.id);
  return `<article class="card">
    <div class="pic">
      <img src="${h.img}" alt="${h.title}" loading="lazy">
      <span class="badge">CURATED HOME</span>
      <button type="button" class="heart ${yes ? "saved" : ""}" data-save="${h.id}" aria-pressed="${yes}" aria-label="Save ${h.title} to favourites">${yes ? "♥" : "♡"}</button>
    </div>
    <div class="body">
      <span class="loc">${h.place} · Lagos</span>
      <h3>${h.title}</h3>
      <div class="spec">${h.beds} beds · ${h.baths} baths · ${h.size}</div>
      <div class="bottom">
        <span class="price">${h.price}</span>
        <button type="button" class="detailbtn" data-detail="${h.id}">Details ↗</button>
      </div>
    </div>
  </article>`;
}

function filterHomes() {
  const max = budget.value === "any" ? Infinity : Number(budget.value);
  const list = homes.filter(
    (h) =>
      h.deal === deal &&
      (loc.value === "all" || loc.value === h.area) &&
      (type.value === "all" || type.value === h.type) &&
      h.n <= max
  );
  cards.innerHTML = list.map(card).join("");
  count.textContent = list.length
    ? `${list.length} thoughtfully selected ${list.length === 1 ? "home" : "homes"}`
    : "";
  empty.hidden = list.length > 0;
}

function showDetails(h) {
  detail.innerHTML = `<img class="dimg" src="${h.img}" alt="${h.title}">
    <div class="dbody">
      <span class="loc">${h.place} · Lagos</span>
      <h2>${h.title}</h2>
      <strong>${h.price}</strong>
      <p>${h.beds} bedrooms · ${h.baths} bathrooms · ${h.size}</p>
      <p>${h.desc}</p>
      <a class="btn dark" href="contact.html?property=${encodeURIComponent(h.title)}">Ask about this home ↗</a>
    </div>`;
  dialog.showModal();
}

function scrollToHomes() {
  const target = $("#homes");
  if (target) target.scrollIntoView({ behavior: "smooth" });
}

if (cards && loc && type && budget && count && empty) {
  /* Buy / Rent tabs */
  $$("[data-deal]").forEach((button) => {
    button.addEventListener("click", () => {
      deal = button.dataset.deal;
      $$("[data-deal]").forEach((b) => b.classList.toggle("active", b === button));
      filterHomes();
    });
  });

  [loc, type, budget].forEach((select) => select.addEventListener("change", filterHomes));

  $("#search").addEventListener("submit", (e) => {
    e.preventDefault();
    filterHomes();
    scrollToHomes();
  });

  $("#clear").addEventListener("click", () => {
    loc.value = "all";
    type.value = "all";
    budget.value = "any";
    filterHomes();
  });

  /* Favourites and details (event delegation) */
  cards.addEventListener("click", (e) => {
    const fav = e.target.closest("[data-save]");
    if (fav) {
      const id = fav.dataset.save;
      if (saved.has(id)) saved.delete(id);
      else saved.add(id);
      persistSaved();
      const yes = saved.has(id);
      fav.classList.toggle("saved", yes);
      fav.textContent = yes ? "♥" : "♡";
      fav.setAttribute("aria-pressed", String(yes));
      return;
    }
    const more = e.target.closest("[data-detail]");
    if (!more) return;
    const home = homes.find((x) => x.id === more.dataset.detail);
    if (home) showDetails(home);
  });

  /* Neighbourhood shortcuts */
  $$("[data-area]").forEach((button) => {
    button.addEventListener("click", () => {
      loc.value = button.dataset.area.toLowerCase();
      deal = "buy";
      $$("[data-deal]").forEach((b) => b.classList.toggle("active", b.dataset.deal === "buy"));
      filterHomes();
      scrollToHomes();
    });
  });

  filterHomes();
}

/* Details dialog */
if (dialog) {
  const closeButton = $(".close");
  if (closeButton) closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
}

/* Mobile navigation */
const menu = $(".menu");
const nav = $("nav");
if (menu && nav) {
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
  });
  $$("a", nav).forEach((a) =>
    a.addEventListener("click", () => {
      menu.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    })
  );
}

/* Footer year */
const year = $("#year");
if (year) year.textContent = new Date().getFullYear();

/* Scroll-reveal animation */
$$("main section").forEach((el) => el.classList.add("reveal"));
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => observer.observe(el));
} else {
  $$(".reveal").forEach((el) => el.classList.add("in-view"));
}
