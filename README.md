# Heparin IV Dose Calculator

A web-based clinical calculator for intravenous unfractionated heparin dosing. Supports multiple indications with weight-based, aPTT-guided dosing based on Dager 2018 (ASHP Anticoagulation Therapy).

**Live app:** https://theodore-ng.github.io/heparin-web-app/

---

## Features

- **Multi-indication support** — VTE (DVT/PE), Acute STEMI (full-dose and combination rt-PA), NSTEMI/UA, and PCI (with/without GP IIb/IIIa inhibitor)
- **Flexible regimen** — enter any heparin bag (IU) and diluent volume (mL); concentration is computed automatically
- **Two calculation modes** — "Calc Initial Dose" for new orders, "Adjust Dose" for patients already on a heparin infusion
- **Initial dose** — calculates bolus (IU + mL) and infusion rate (IU/hr + mL/hr) from patient weight
- **aPTT adjustment** — adjusts infusion rate based on latest aPTT per protocol-specific bands
- **Guideline panel** — sticky reference sidebar with protocol overview, color-coded aPTT adjustment table, safety notes, and clinical references
- **Copy button** — one-click copy of formatted order text including actual regimen concentration
- **Mobile friendly** — responsive two-column layout (desktop) / single column (mobile)
- **Offline capable** — fully client-side, no backend required

---

## Supported Protocols

| Indication | Bolus | Infusion | Target aPTT | Monitoring |
|---|---|---|---|---|
| VTE (DVT/PE) | 80 IU/kg | 18 IU/kg/hr | 60–100 sec | aPTT |
| STEMI + full-dose rt-PA | 60 IU/kg (max 4,000) | 12 IU/kg/hr (max 1,000/hr) | 50–70 sec | aPTT |
| STEMI + combination rt-PA | 60 IU/kg (max 3,000) | 7 IU/kg/hr (max 800/hr) | 50–70 sec | aPTT |
| NSTEMI / Unstable Angina | 60 IU/kg (max 4,000) | 12 IU/kg/hr (max 1,000/hr) | 50–70 sec | aPTT |
| PCI + GP IIb/IIIa inhibitor | 50–70 IU/kg | — | — | ACT |
| PCI only | 70–100 IU/kg | — | — | ACT |

*Source: Dager WE. Table 3-5. ASHP Anticoagulation Therapy, 2018.*

---

## Tech Stack

- React 19 + TypeScript 6
- Vite 8
- Tailwind CSS v4

---

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

---

## Deployment

Deployed automatically to GitHub Pages on every push to `main` via GitHub Actions (`.github/workflows/deploy.yml`).

---

## Disclaimer

This tool is for clinical guidance only. Physicians must verify all dosing before administration. Institutional protocol takes precedence over this calculator.
