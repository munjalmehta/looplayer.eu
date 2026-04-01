/* ═══════════════════════════════════════════════════
   LoopLayer · Main JavaScript
   Module loader · Language toggle · Animations
   ═══════════════════════════════════════════════════ */

/* ── LANGUAGE TOGGLE ── */
let currentLang = 'de'; // Default German for Bavarian audience

function setLang(lang) {
  currentLang = lang;
  document.documentElement.setAttribute('data-lang', lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  localStorage.setItem('ll-lang', lang);
}

function initLang() {
  const saved = localStorage.getItem('ll-lang');
  setLang(saved || 'de');
}

/* ── MODULE LOADER ── */
async function loadModule(id, src) {
  try {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`${res.status}`);
    const html = await res.text();
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = html;
      el.querySelectorAll('script').forEach(s => {
        const ns = document.createElement('script');
        ns.textContent = s.textContent;
        document.body.appendChild(ns);
      });
    }
  } catch(e) {
    console.warn(`Module ${src} failed:`, e);
  }
}

async function loadAllModules() {
  const modules = [
    ['mod-nav',             'modules/nav.html'],
    ['mod-reg-strip',       'modules/reg-strip.html'],
    ['mod-hero',            'modules/hero.html'],
    ['mod-problem',         'modules/problem.html'],
    ['mod-layers',          'modules/layers.html'],
    ['mod-compliance',      'modules/compliance.html'],
    ['mod-marketplace',     'modules/marketplace.html'],
    ['mod-material',        'modules/material.html'],
    ['mod-network',         'modules/network.html'],
    ['mod-dpp',             'modules/dpp.html'],
    ['mod-competitive',     'modules/competitive.html'],
    ['mod-gtm',             'modules/gtm.html'],
    ['mod-cta',             'modules/cta.html'],
    ['mod-footer',          'modules/footer.html'],
  ];
  // Load in order, sequentially for nav/hero, parallel for rest
  await Promise.all(modules.map(([id, src]) => loadModule(id, src)));
  initLang();
  initScrollAnimations();
  initNav();
}

/* ── SCROLL ANIMATIONS ── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ── STICKY NAV ── */
function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastY = y;
  }, { passive: true });

  // Mobile menu
  const toggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      toggle.classList.toggle('open');
    });
  }
}

/* ── CONTACT FORM ── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const original = btn.textContent;
    btn.textContent = currentLang === 'de' ? 'Gesendet ✓' : 'Sent ✓';
    btn.disabled = true;
    btn.style.background = 'var(--green)';
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const duration = 1800;
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const decimals = el.dataset.decimals || 0;
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = target * ease;
    el.textContent = prefix + val.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = true;
        animateCounter(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  loadAllModules().then(() => {
    initCounters();
    initContactForm();
  });
});

// Expose for inline use
window.setLang = setLang;
