/* ═══════════════════════════════════════════════════════
   main.js — LoopLayer Core
   Module loader · Language · Theme · Ticker · Scroll
═══════════════════════════════════════════════════════ */
'use strict';

/* ── MODULE MAP ─────────────────────────────────────── */
const MODULES = [
  { id: 'mod-nav',              src: 'modules/nav.html'              },
  { id: 'mod-ticker',           src: 'modules/ticker.html'           },
  { id: 'mod-hero',             src: 'modules/hero.html'             },
  { id: 'mod-compliance-focus', src: 'modules/compliance-focus.html' },
  { id: 'mod-how-it-works',     src: 'modules/how-it-works.html'     },
  { id: 'mod-three-docs',       src: 'modules/three-docs.html'       },
  { id: 'mod-platform-layers',  src: 'modules/platform-layers.html'  },
  { id: 'mod-trust',            src: 'modules/trust.html'            },
  { id: 'mod-regulations',      src: 'modules/regulations.html'      },
  { id: 'mod-demo',             src: 'modules/demo.html'             },
  { id: 'mod-template-cta',     src: 'modules/template-cta.html'     },
  { id: 'mod-final-cta',        src: 'modules/final-cta.html'        },
  { id: 'mod-footer',           src: 'modules/footer.html'           },
];

async function loadModule({ id, src }) {
  try {
    const res  = await fetch(src);
    const html = await res.text();
    const el   = document.getElementById(id);
    if (el) el.innerHTML = html;
  } catch (e) {
    console.warn(`[LoopLayer] Module not loaded: ${src}`);
  }
}

async function init() {
  await Promise.all(MODULES.map(loadModule));
  bootTheme();
  bootLang();
  bootTicker();
  bootScroll();
  document.dispatchEvent(new Event('looplayer:ready'));
}

document.addEventListener('DOMContentLoaded', init);


/* ── THEME ───────────────────────────────────────────── */
window.LL_THEME = localStorage.getItem('ll-theme') || 'dark';

window.setTheme = function(t) {
  window.LL_THEME = t;
  localStorage.setItem('ll-theme', t);
  document.documentElement.setAttribute('data-theme', t);
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = t === 'dark' ? '☀' : '☾';
};

window.toggleTheme = function() {
  setTheme(window.LL_THEME === 'dark' ? 'light' : 'dark');
};

function bootTheme() {
  setTheme(window.LL_THEME);
}


/* ── LANGUAGE ────────────────────────────────────────── */
window.LL_LANG = 'de';

window.setLang = function(lang) {
  window.LL_LANG = lang;
  document.documentElement.lang = lang;

  const de = document.getElementById('btn-de');
  const en = document.getElementById('btn-en');
  if (de) de.classList.toggle('on', lang === 'de');
  if (en) en.classList.toggle('on', lang === 'en');

  document.querySelectorAll('[data-de]').forEach(el => {
    const v = el.getAttribute('data-' + lang);
    if (v !== null) el.innerHTML = v;
  });
  document.querySelectorAll('[data-ph-de]').forEach(el => {
    el.placeholder = el.getAttribute('data-ph-' + lang) || '';
  });
  document.querySelectorAll('select option[data-de]').forEach(opt => {
    const v = opt.getAttribute('data-' + lang);
    if (v) opt.textContent = v;
  });

  // Demo status badges
  ['epr','csrd','dpp'].forEach(id => {
    const el = document.getElementById('st-' + id);
    if (el && el.classList.contains('b-wait')) {
      el.textContent = lang === 'de' ? 'Ausstehend' : 'Waiting';
    }
  });

  buildTicker(lang);
  document.dispatchEvent(new CustomEvent('looplayer:lang', { detail: { lang } }));
};

function bootLang() { setLang('de'); }


/* ── TICKER ──────────────────────────────────────────── */
const TICKER_DATA = {
  de: [
    { dot: 'td-l3', text: 'EPR-Bußgelder werden verhängt' },
    { dot: 'td-l2', text: 'Textilzirkularität', strong: 'nicht nur Recycling' },
    { dot: 'td-l3', text: 'CSRD / ESRS E5', strong: 'ab GJ2025 Pflicht' },
    { dot: 'td-l3', text: 'Digitaler Produktpass', strong: 'ab 2027 Pflicht' },
    { dot: 'td-l1', text: '6 EU EPR-Systeme', strong: 'vollständig abgedeckt' },
    { dot: 'td-l2', text: 'Material Intelligence', strong: 'KI-Faserklassifikation' },
    { dot: 'td-l4', text: 'Circular Network', strong: 'verifizierte Partner' },
    { dot: 'td-l3', text: 'Freising, Bayern', strong: 'looplayer.eu' },
  ],
  en: [
    { dot: 'td-l3', text: 'EPR fines already being issued' },
    { dot: 'td-l2', text: 'Textile circularity', strong: 'not just recycling' },
    { dot: 'td-l3', text: 'CSRD / ESRS E5', strong: 'mandatory from FY2025' },
    { dot: 'td-l3', text: 'Digital Product Passport', strong: 'mandatory 2027' },
    { dot: 'td-l1', text: '6 EU EPR schemes', strong: 'fully covered' },
    { dot: 'td-l2', text: 'Material Intelligence', strong: 'AI fibre classification' },
    { dot: 'td-l4', text: 'Circular Network', strong: 'verified partners' },
    { dot: 'td-l3', text: 'Freising, Bavaria', strong: 'looplayer.eu' },
  ],
};

function buildTicker(lang) {
  const track = document.getElementById('ticker-track');
  if (!track) return;
  const items = [...(TICKER_DATA[lang] || TICKER_DATA.de), ...(TICKER_DATA[lang] || TICKER_DATA.de)];
  track.innerHTML = items.map(({ dot, text, strong }) =>
    `<span class="ticker-item">
      <span class="ticker-dot ${dot || 'td-l3'}"></span>
      ${text}${strong ? ` &nbsp;<strong>${strong}</strong>` : ''}
    </span>`
  ).join('');
}

function bootTicker() { buildTicker('de'); }


/* ── SCROLL FADE ─────────────────────────────────────── */
function bootScroll() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('.fi:not(.vis)').forEach(el => io.observe(el));
}
