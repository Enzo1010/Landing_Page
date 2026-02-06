const SITE_CONFIG = {
  business: {
    companyName: "RM Guindastes",
    brandTitle: "Guindastes",
    initials: "RM",
    instagramUrl: "https://instagram.com/rmguindastes",
    logoPath: "", // Exemplo: "images/logo.png"
    logoAlt: "Logotipo da RM Guindastes",
  },
  contact: {
    whatsappNumber: "5547992499111", // DDI + DDD + numero
    whatsappMessage: "Ola! Preciso de um orcamento rapido para guindaste/munck.",
    phoneDisplay: "(47) 99249-9111",
    phoneE164: "+5547992499111",
    email: "rmguindastess@gmail.com",
  },
};

function normalizePhoneDigits(value) {
  return String(value || "").replace(/\D+/g, "");
}

function buildWhatsAppLink(number, message) {
  return `https://wa.me/${normalizePhoneDigits(number)}?text=${encodeURIComponent(message)}`;
}

function wireWhatsAppLinks() {
  const { whatsappNumber, whatsappMessage } = SITE_CONFIG.contact;
  const href = buildWhatsAppLink(whatsappNumber, whatsappMessage);
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.setAttribute("href", href);
  });
}

function wireContactInfo() {
  const { phoneDisplay, phoneE164, email } = SITE_CONFIG.contact;
  document.querySelectorAll("[data-phone-link]").forEach((link) => {
    link.setAttribute("href", `tel:${phoneE164}`);
    link.textContent = phoneDisplay;
  });
  document.querySelectorAll("[data-email-link]").forEach((link) => {
    link.setAttribute("href", `mailto:${email}`);
    link.textContent = email;
  });
}

function wireBrandText() {
  const { companyName, brandTitle, initials } = SITE_CONFIG.business;
  document.querySelectorAll("[data-company-name]").forEach((node) => {
    node.textContent = companyName;
  });
  document.querySelectorAll("[data-brand-title]").forEach((node) => {
    node.textContent = brandTitle;
  });
  document.querySelectorAll("[data-company-initials]").forEach((node) => {
    node.textContent = initials;
  });
}

function wireInstagramLinks() {
  const { instagramUrl } = SITE_CONFIG.business;
  document.querySelectorAll("[data-instagram-link]").forEach((link) => {
    link.setAttribute("href", instagramUrl);
  });
}

function wireBrandLogos() {
  const { logoPath, logoAlt } = SITE_CONFIG.business;
  const hasLogo = Boolean(logoPath && logoPath.trim());
  document.querySelectorAll("[data-logo-slot]").forEach((slot) => {
    const image = slot.querySelector("[data-logo-image]");
    if (!image) return;

    slot.classList.remove("has-logo");
    image.hidden = true;
    image.removeAttribute("src");

    if (!hasLogo) return;

    const showLogo = () => {
      image.hidden = false;
      slot.classList.add("has-logo");
    };

    const hideLogo = () => {
      image.hidden = true;
      slot.classList.remove("has-logo");
    };

    image.onload = showLogo;
    image.onerror = hideLogo;
    image.alt = logoAlt;
    image.src = logoPath;

    if (image.complete && image.naturalWidth > 0) {
      showLogo();
    }
  });
}

function wireCurrentYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = year;
  });
}

function setupNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;

  const setState = (isOpen) => {
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    setState(isOpen);
  });

  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      setState(false);
    })
  );
}

function elevateTopbarOnScroll() {
  const topbar = document.getElementById("topbar");
  if (!topbar) return;

  const handler = () => {
    topbar.classList.toggle("is-scrolled", window.scrollY > 6);
  };

  handler();
  window.addEventListener("scroll", handler, { passive: true });
}

function setupReveals() {
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window) ||
    reveals.length === 0
  ) {
    const showAll = () => reveals.forEach((el) => el.classList.add("visible"));
    if (prefersReducedMotion) {
      showAll();
    } else {
      setTimeout(showAll, 80);
    }
    return;
  }

  reveals.forEach((el, idx) => {
    el.style.transitionDelay = `${(idx % 6) * 60}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
  );

  reveals.forEach((el) => observer.observe(el));
}

function init() {
  wireBrandText();
  wireBrandLogos();
  wireInstagramLinks();
  wireContactInfo();
  wireWhatsAppLinks();
  wireCurrentYear();
  setupNavToggle();
  elevateTopbarOnScroll();
  setupReveals();
}

document.addEventListener("DOMContentLoaded", init);
