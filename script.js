/* ==========================================================================
   Configuracao central da landing
   ========================================================================== */
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

/* ==========================================================================
   Helpers de DOM
   ========================================================================== */
function each(selector, callback) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;
  elements.forEach(callback);
}

function setText(selector, value) {
  each(selector, (node) => {
    node.textContent = value;
  });
}

function setAttribute(selector, attribute, value) {
  each(selector, (node) => {
    node.setAttribute(attribute, value);
  });
}

/* ==========================================================================
   Dados de contato e marca
   ========================================================================== */
function normalizePhoneDigits(value) {
  return String(value || "").replace(/\D+/g, "");
}

function buildWhatsAppLink(number, message) {
  const phoneDigits = normalizePhoneDigits(number);
  if (!phoneDigits) {
    console.warn("WhatsApp number is empty or invalid");
    return "#";
  }
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
}

function wireWhatsAppLinks() {
  const { whatsappNumber, whatsappMessage } = SITE_CONFIG.contact;
  const href = buildWhatsAppLink(whatsappNumber, whatsappMessage);
  setAttribute("[data-whatsapp]", "href", href);
}

function wireContactInfo() {
  const { phoneDisplay, phoneE164, email } = SITE_CONFIG.contact;

  each("[data-phone-link]", (link) => {
    link.setAttribute("href", `tel:${phoneE164}`);
    link.textContent = phoneDisplay;
  });

  each("[data-email-link]", (link) => {
    link.setAttribute("href", `mailto:${email}`);
    link.textContent = email;
  });
}

function wireBrandText() {
  const { companyName, brandTitle, initials } = SITE_CONFIG.business;
  setText("[data-company-name]", companyName);
  setText("[data-brand-title]", brandTitle);
  setText("[data-company-initials]", initials);
}

function wireInstagramLinks() {
  const { instagramUrl } = SITE_CONFIG.business;
  setAttribute("[data-instagram-link]", "href", instagramUrl);
}

function wireBrandLogos() {
  const { logoPath, logoAlt } = SITE_CONFIG.business;
  const hasLogoPath = Boolean(logoPath && logoPath.trim());

  each("[data-logo-slot]", (slot) => {
    const image = slot.querySelector("[data-logo-image]");
    if (!image) return;

    // Estado base: mostra fallback textual.
    slot.classList.remove("has-logo");
    image.hidden = true;
    image.removeAttribute("src");

    if (!hasLogoPath) return;

    // Mostra logo apenas quando carregar com sucesso.
    const showLogo = () => {
      image.hidden = false;
      slot.classList.add("has-logo");
    };

    // Em erro de arquivo/caminho, volta para o fallback.
    const hideLogo = () => {
      image.hidden = true;
      slot.classList.remove("has-logo");
    };

    image.onload = showLogo;
    image.onerror = hideLogo;
    image.alt = logoAlt;
    image.src = logoPath;

    // Verifica se a imagem ja carregou (cached)
    if (image.complete && image.naturalWidth > 0) {
      showLogo();
    }
  });
}

function wireCurrentYear() {
  const year = String(new Date().getFullYear());
  setText("[data-current-year]", year);
}

/* ==========================================================================
   Comportamentos de interface
   ========================================================================== */
function setupNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;

  const setMenuState = (isOpen) => {
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  };

  const closeMenu = () => {
    nav.classList.remove("is-open");
    setMenuState(false);
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    setMenuState(isOpen);
  });

  // Fecha menu ao clicar em um link interno
  each("#nav a", (link) => {
    link.addEventListener("click", closeMenu);
  });

  // Fecha menu ao clicar em qualquer parte fora dele (melhor UX)
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });
}

function elevateTopbarOnScroll() {
  const topbar = document.getElementById("topbar");
  if (!topbar) return;

  const updateTopbarElevation = () => {
    topbar.classList.toggle("is-scrolled", window.scrollY > 6);
  };

  updateTopbarElevation();
  window.addEventListener("scroll", updateTopbarElevation, { passive: true });
}

function setupReveals() {
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fallback: sem animacao para acessibilidade ou navegadores sem suporte.
  if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window) ||
    reveals.length === 0
  ) {
    const showAll = () => {
      reveals.forEach((element) => element.classList.add("visible"));
    };

    if (prefersReducedMotion) {
      showAll();
    } else {
      setTimeout(showAll, 80);
    }
    return;
  }

  // Pequeno atraso em cascata para entrada mais natural dos blocos.
  reveals.forEach((element, index) => {
    element.style.transitionDelay = `${(index % 6) * 60}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
  );

  reveals.forEach((element) => observer.observe(element));
}

/* ==========================================================================
   Bootstrap
   ========================================================================== */
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

// Aguarda DOMContentLoaded antes de executar
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  // Documento já carregou (script foi async ou defer)
  init();
}
