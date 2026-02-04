const whatsappNumber = '5599999999999'; // inclua DDI (55) + DDD + número
const message = 'Olá! Preciso de um orçamento rápido para guindaste/munck.';

function buildWhatsAppLink(num, msg) {
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

function wireWhatsAppLinks() {
  const links = document.querySelectorAll('[data-whatsapp]');
  links.forEach((link) => {
    link.setAttribute('href', buildWhatsAppLink(whatsappNumber, message));
  });
}

function setupNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;
  const setState = (isOpen) => {
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  };
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    setState(isOpen);
  });
  nav.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      setState(false);
    })
  );
}

function elevateTopbarOnScroll() {
  const topbar = document.getElementById('topbar');
  if (!topbar) return;
  const handler = () => {
    topbar.classList.toggle('is-scrolled', window.scrollY > 6);
  };
  handler();
  window.addEventListener('scroll', handler, { passive: true });
}

function init() {
  wireWhatsAppLinks();
  setupNavToggle();
  elevateTopbarOnScroll();
  setupReveals();
}

document.addEventListener('DOMContentLoaded', init);

// Aparece ao rolar
function setupReveals() {
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window) || reveals.length === 0) {
    const showAll = () => reveals.forEach((el) => el.classList.add('visible'));
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
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
  );
  reveals.forEach((el) => obs.observe(el));
}
