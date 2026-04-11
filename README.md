# Heparin IV Dose Calculator

A web-based clinical calculator for intravenous unfractionated heparin dosing using a standard weight-based, aPTT-guided protocol.

**Live app:** https://theodore-ng.github.io/heparin-web-app/

---

## Features

- **Initial dosing** — calculates bolus (IU + mL) and infusion rate (IU/hr + mL/hr) from patient weight
- **aPTT adjustment** — adjusts infusion rate based on latest aPTT result per standard protocol
- **Editable current rate** — manually override the current infusion rate before calculating an adjustment
- **Guideline panel** — always-visible reference sidebar with protocol overview, color-coded aPTT adjustment table, and 11 clinical references
- **Copy button** — one-click copy of formatted order text
- **Mobile friendly** — responsive two-column layout (desktop) / single column (mobile)
- **Offline capable** — fully client-side, no backend required

---

## Clinical Protocol

| Parameter | Value |
|---|---|
| Bag concentration | 12,500 IU in 50 mL (250 IU/mL) |
| Initial bolus | 80 IU/kg IV |
| Initial infusion | 18 IU/kg/hr |
| Target aPTT | 60–100 seconds |
| Recheck aPTT | 6 hours after start or dose change |

### aPTT Adjustment Table

| aPTT (sec) | Bolus | Rate change |
|---|---|---|
| < 40 | 80 IU/kg | +4 IU/kg/hr |
| 40–59 | 40 IU/kg | +2 IU/kg/hr |
| 60–100 | None | No change |
| 101–120 | None | −2 IU/kg/hr |
| > 120 | None | Hold 1 hr, −4 IU/kg/hr |

---

## Tech Stack

- React 18 + TypeScript
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
