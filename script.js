const body = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#navMenu");
const backToTop = document.querySelector(".back-to-top");
const navLinks = [...document.querySelectorAll(".nav-menu a")];

const saveLead = (key, lead) => {
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify([...existing, lead]));
};

window.addEventListener("load", () => {
  body.classList.add("loaded");
});

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY > 24;
  header?.classList.toggle("scrolled", scrolled);
  backToTop?.classList.toggle("show", window.scrollY > 500);
});

menuToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { threshold: 0.46 }
);

document.querySelectorAll("section[id]").forEach((section) => observer.observe(section));

document.querySelector("#notifyForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.email.value.trim();
  saveLead("regflowNotifyLeads", { email, createdAt: new Date().toISOString() });
  document.querySelector("#notifyResult").textContent = "Thank you. We will notify you before launch.";
  form.reset();
});

document.querySelector("#contactForm")?.addEventListener("submit", (event) => {
  const form = event.currentTarget;
  const lead = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim(),
    createdAt: new Date().toISOString(),
  };

  saveLead("regflowContactMessages", lead);
  document.querySelector("#contactResult").textContent = "Sending your message...";
});
