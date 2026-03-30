# LoopLayer Website — v2

**EU Textile Circularity Platform** · looplayer.eu

---

## Quick deploy

1. Push this folder to a GitHub repository (main branch)
2. **Settings → Pages → Source → GitHub Actions**
3. Done — live in ~60 seconds at `https://<username>.github.io/<repo>/`

---

## File structure

```
├── index.html                        Shell — loads all modules
├── .github/workflows/deploy.yml      GitHub Pages auto-deploy
├── assets/
│   ├── css/styles.css                All styles (dark + light mode)
│   ├── js/main.js                    Module loader · language · theme · ticker
│   └── js/demo.js                    Demo widget logic
└── modules/
    ├── nav.html                      Navigation + DE/EN + dark/light toggle
    ├── ticker.html                   Urgency ticker
    ├── hero.html                     Hero — circularity headline
    ├── compliance-focus.html         ★ Compliance focus section (NEW)
    ├── how-it-works.html             4-step chain
    ├── three-docs.html               EPR / CSRD / DPP detail cards
    ├── platform-layers.html          All 4 layers (L1-L4 colour coded)
    ├── trust.html                    Auditor trust + quote + pillars
    ├── regulations.html              Regulation deadline cards
    ├── demo.html                     Live demo input + output
    ├── template-cta.html             Free EPR template strip
    ├── final-cta.html                Bottom conversion
    └── footer.html                   Footer with layer colour dots
```

---

## Layer colour system

| Layer | Name | Colour | CSS var |
|---|---|---|---|
| L1 | Marketplace | Blue | `--l1` `#2E8BC0` |
| L2 | Material Intelligence | Teal | `--l2` `#00A87A` |
| L3 | **Compliance** ★ | **Amber** | `--l3` `#D4900A` |
| L4 | Circular Network | Violet | `--l4` `#6B5CE7` |

Each layer's colour is applied consistently to: top stripe, number badge, label text, bullet dots, and highlight box.

---

## Common edits

| What | Where |
|---|---|
| Headline / body copy | The relevant `modules/*.html` file |
| Add/remove nav link | `modules/nav.html` |
| Change email address | `modules/template-cta.html` · `modules/final-cta.html` · `modules/footer.html` |
| Change demo CO₂ factors | `assets/js/demo.js` → `CO2_FACTORS` object |
| Change EPR schemes | `assets/js/demo.js` → `EPR_SCHEMES` object |
| Change ticker content | `assets/js/main.js` → `TICKER_DATA` object |
| Add a new module | 1. Create `modules/new-module.html` 2. Add to `MODULES` array in `main.js` 3. Add `<div id="mod-new-module"></div>` in `index.html` |

---

## Local development

Needs a local server (not `file://` — modules use `fetch()`):

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

---

## Language system

Default: **German (DE)**. Every visible text uses:
```html
data-de="Deutscher Text"
data-en="English text"
```
Toggle via `setLang('de')` or `setLang('en')` — defined in `main.js`.

## Theme system

Default: **Dark**. Toggle via the ☀/☾ button in the nav.
Preference saved to `localStorage`. All colours swap via CSS custom properties —
no class changes needed in module HTML files.
