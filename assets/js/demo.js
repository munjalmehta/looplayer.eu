/* ═══════════════════════════════════════════════════════
   demo.js — Live Demo Widget
   Edit CO2_FACTORS and EPR_SCHEMES here only.
   All UI is in modules/demo.html
═══════════════════════════════════════════════════════ */
'use strict';

const EPR_SCHEMES = {
  DE: 'Stiftung EAR / Naber',
  FR: 'REFASHION',
  NL: 'Renewi EPR',
  AT: 'ARA EPR',
  BE: 'Fost Plus EPR',
  IT: 'CONAI EPR',
};

/* IPCC AR6 WG3 2022 factors — tCO₂ saved per tonne recycled vs incineration */
const CO2_FACTORS = {
  'Cotton offcuts':  1.8,
  'Polyester blend': 3.1,
  'Wool waste':      2.3,
  'Mixed textile':   2.0,
  'Denim scrap':     1.9,
};

function txId() {
  return 'LL-' + Date.now().toString(36).toUpperCase()
       + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
}

function validate() {
  const fields = [
    { id: 'f-co',  err: 'e-co',  ok: v => v.trim().length > 0 },
    { id: 'f-mat', err: 'e-mat', ok: v => v !== '' },
    { id: 'f-kg',  err: 'e-kg',  ok: v => parseFloat(v) > 0 },
    { id: 'f-rec', err: 'e-rec', ok: v => v.trim().length > 0 },
    { id: 'f-cty', err: 'e-cty', ok: v => v !== '' },
  ];
  let valid = true;
  fields.forEach(({ id, err, ok }) => {
    const el = document.getElementById(id);
    const er = document.getElementById(err);
    if (!el) return;
    if (!ok(el.value)) {
      el.classList.add('err'); if (er) er.style.display = 'block'; valid = false;
    } else {
      el.classList.remove('err'); if (er) er.style.display = 'none';
    }
  });
  return valid;
}

function sv(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = val;
  el.classList.add('pop');
}

function activateDoc(id, label) {
  const st   = document.getElementById('st-' + id);
  const card = document.getElementById('doc-' + id);
  if (st)   { st.textContent = label; st.className = 'odoc-badge b-ready'; }
  if (card) card.classList.add('on');
}

window.generateDocs = function() {
  if (!validate()) return;

  const lang     = window.LL_LANG || 'de';
  const company  = document.getElementById('f-co').value.trim();
  const matKey   = document.getElementById('f-mat').value;
  const matLabel = document.querySelector('#f-mat option:checked')?.textContent || matKey;
  const kg       = parseFloat(document.getElementById('f-kg').value);
  const rec      = document.getElementById('f-rec').value.trim();
  const cty      = document.getElementById('f-cty').value;

  const scheme      = EPR_SCHEMES[cty] || cty + ' EPR';
  const co2         = ((CO2_FACTORS[matKey] || 2.0) * kg / 1000).toFixed(2);
  const recycledPct = (82 + Math.floor(Math.random() * 12)) + '%';
  const tx          = txId();

  const co2sfx  = lang === 'de' ? ' tCO₂ vermieden' : ' tCO₂ avoided';
  const rsfx    = lang === 'de' ? ' rezirkuliert'    : ' recirculated';
  const rdyLbl  = lang === 'de' ? 'Bereit'           : 'Ready';

  const btn = document.getElementById('genbtn');
  const lbl = document.getElementById('genlabel');
  if (btn) btn.disabled = true;
  if (lbl) lbl.textContent = lang === 'de' ? 'Wird erstellt…' : 'Generating…';

  setTimeout(() => {
    sv('o-co', company); sv('o-mat-epr', matLabel);
    sv('o-kg', kg.toLocaleString('de-DE') + ' kg'); sv('o-scheme', scheme);
    const t = document.getElementById('tx-epr'); if (t) t.textContent = 'TX ID: ' + tx;
    activateDoc('epr', rdyLbl);
  }, 400);

  setTimeout(() => {
    sv('o-wtype', matLabel); sv('o-rrate', recycledPct);
    sv('o-co2', co2 + co2sfx); sv('o-meth', 'IPCC AR6 WG3 2022');
    const t = document.getElementById('tx-csrd'); if (t) t.textContent = 'TX ID: ' + tx;
    activateDoc('csrd', rdyLbl);
  }, 900);

  setTimeout(() => {
    sv('o-mat-dpp', matLabel); sv('o-rpct', recycledPct + rsfx);
    sv('o-rec-dpp', rec); sv('o-schema', 'CIRPASS-2');
    const t = document.getElementById('tx-dpp'); if (t) t.textContent = 'TX ID: ' + tx;
    activateDoc('dpp', rdyLbl);
    if (lbl) lbl.textContent = lang === 'de' ? '✓ Erstellt — andere Werte ausprobieren' : '✓ Generated — try different values';
    if (btn) btn.disabled = false;
  }, 1400);
};

function bindClearErrors() {
  document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('err');
      const er = document.getElementById('e-' + el.id.replace('f-', ''));
      if (er) er.style.display = 'none';
    });
  });
}

document.addEventListener('looplayer:ready', bindClearErrors);
document.addEventListener('looplayer:lang',  bindClearErrors);
