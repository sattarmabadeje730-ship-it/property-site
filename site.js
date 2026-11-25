/* Haven Lagos – shared behaviour for the inner pages and the contact form. */

/* ------------------------------------------------------------------
   CONTACT FORM SETTINGS
   Paste your form service link between the quotes, for example:
     Formspree:  "https://formspree.io/f/abcdwxyz"
     Web3Forms:  "https://api.web3forms.com/submit"  (also set FORM_ACCESS_KEY)
   Leave it empty ("") to use the built-in Node server (node server.js).
------------------------------------------------------------------- */
const FORM_ENDPOINT = "https://formspree.io/f/mrpqrwea";
const FORM_ACCESS_KEY = "";

/* Scroll-reveal animation */
document
  .querySelectorAll("main section,.page-hero,.contact-intro,.step")
  .forEach((el) => el.classList.add("reveal"));
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in-view"));
}

/* Mobile navigation */
const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");
if (menu && nav) {
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    })
  );
}

/* Footer year */
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

/* Contact form */
const form = document.querySelector("#contact-form");
if (form) {
  const property = new URLSearchParams(location.search).get("property");
  if (property) {
    form.elements.property.value = property;
    form.querySelector("[name=message]").value = "I would like to enquire about " + property + ".\n";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = form.querySelector(".form-status");
    const button = form.querySelector("button[type=submit]");
    status.textContent = "Sending your message…";
    status.classList.remove("error");
    button.disabled = true;

    try {
      const data = Object.fromEntries(new FormData(form));
      let url = "/api/inquiries";
      if (FORM_ENDPOINT) {
        url = FORM_ENDPOINT;
        data.subject = "New Haven Lagos enquiry" + (data.property ? " – " + data.property : "");
        if (FORM_ACCESS_KEY) data.access_key = FORM_ACCESS_KEY;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });

      let result = {};
      try {
        result = await response.json();
      } catch {
        /* empty or non-JSON reply */
      }

      const ok = FORM_ENDPOINT ? response.ok && result.success !== false : response.ok && result.ok;
      if (!ok) {
        const detail =
          result.error ||
          (Array.isArray(result.errors) && result.errors.map((x) => x.message).join(" ")) ||
          result.message;
        if (detail) throw new Error(detail);
        throw new Error(
          !FORM_ENDPOINT && location.port && location.port !== "8000" && response.status < 500
            ? "The enquiry server isn’t running on this page. Start it with “node server.js” and open http://127.0.0.1:8000, or set FORM_ENDPOINT in site.js."
            : "Message could not be sent. Please try again."
        );
      }

      form.reset();
      status.textContent = "Thank you — your enquiry was sent. We’ll be in touch soon.";
    } catch (err) {
      status.textContent =
        err instanceof TypeError
          ? "We couldn’t reach the server. Please check your connection and try again."
          : err.message;
      status.classList.add("error");
    } finally {
      button.disabled = false;
    }
  });
}
