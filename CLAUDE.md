# CLAUDE.md

## Project
Heparin IV Infusion Dose Calculator (Weight-Based, aPTT Adjustment)

This document defines requirements for building a web-based clinical calculator for intravenous unfractionated heparin dosing using:

- Standard weight-based regimen
- aPTT monitoring only
- Fixed dilution: **12,500 IU in 50 mL**
- Concentration: **250 IU/mL**

The application provides physician guidance for:
- Initial bolus dose
- Initial infusion rate
- aPTT-based adjustment
- Bolus adjustment dosing
- Updated infusion rate (mL/hour)

---

# Clinical Protocol

## Standard Therapeutic Heparin Regimen

Initial Bolus:
80 IU/kg IV

Initial Infusion:
18 IU/kg/hour

Monitoring:
aPTT at 6 hours after start or dose change

Target aPTT:
1.5 – 2.5 × control (typically ~60–100 sec depending lab)

---

# Fixed Dilution

Heparin Bag:
12,500 IU in 50 mL

Concentration:
250 IU/mL

All calculations must convert to:
- IU
- mL bolus
- mL/hour infusion

---

# User Inputs

Required:
- Patient weight (kg)

Optional (Adjustment Mode):
- Latest aPTT value (seconds)

Optional:
- Control aPTT (seconds) OR
- Use default therapeutic range (60–100 sec)

---

# Calculator Logic

## Step 1 — Initial Bolus

bolus_IU = weight_kg × 80

bolus_mL = bolus_IU / 250

---

## Step 2 — Initial Infusion

infusion_IU_per_hr = weight_kg × 18

infusion_mL_per_hr = infusion_IU_per_hr / 250

---

## Step 3 — aPTT Adjustment Algorithm

Target Range:
60–100 seconds

Adjustment Table:

IF aPTT < 40
    bolus = 80 IU/kg
    rate_change = +4 IU/kg/hr

IF aPTT 40–59
    bolus = 40 IU/kg
    rate_change = +2 IU/kg/hr

IF aPTT 60–100
    no change

IF aPTT 101–120
    reduce rate = −2 IU/kg/hr

IF aPTT > 120
    hold infusion 1 hour
    reduce rate = −4 IU/kg/hr

---

## Step 4 — Convert Adjustment to mL/hr

new_rate_IU_hr = current_rate_IU_hr + rate_change

new_rate_mL_hr = new_rate_IU_hr / 250

---

# UI Layout

## Overall Layout

Two-column layout on desktop (lg breakpoint and above):
- Left column: calculator (Sections 1–4, scrollable)
- Right column: Guideline Panel (sticky, always visible)

On mobile: single column, guideline panel stacked below the calculator.

## Guideline Panel (Right Column)

Always-visible reference sidebar containing:
- Protocol Overview (bolus, infusion, concentration, target aPTT, recheck schedule)
- aPTT Adjustment Table with color-coded rows (red = critical, orange = subtherapeutic/supratherapeutic, green = therapeutic)
- How to Use (numbered step-by-step workflow)
- Safety Notes

---

## Section 1 — Patient Input

Weight (kg)
[ numeric input ]

Button:
Calculate Initial Dose

---

## Section 2 — Initial Dose Output

Display:

Initial Bolus
- IU
- mL

Initial Infusion
- IU/hour
- mL/hour

Example Output:

Bolus: 4000 IU (16 mL)
Infusion: 900 IU/hr (3.6 mL/hr)

---

## Section 3 — aPTT Adjustment

Inputs:

Current infusion rate (auto filled, displayed in mL/hr)
Latest aPTT (seconds)

Button:
Adjust Dose

---

## Section 4 — Adjustment Output

Display:

Recommended bolus (IU + mL)
New infusion rate (IU/hr)
New infusion rate (mL/hr)
Infusion hold warning (if needed)
Recheck aPTT in 6 hours notice

---

# Safety Rules

Always round:
- Bolus to 0.1 mL
- Infusion to 0.1 mL/hr

Minimum infusion rate = 0

If rate becomes negative:
Set to 0

Display warning:
"Verify dose clinically before administration"

---

# Example Calculation (50 kg)

Bolus:
50 × 80 = 4000 IU

4000 / 250 = 16 mL

Infusion:
50 × 18 = 900 IU/hr

900 / 250 = 3.6 mL/hr

---

# Example Adjustment

aPTT = 45 sec

Bolus:
40 IU/kg = 2000 IU
= 8 mL

Rate increase:
+2 IU/kg/hr

= 100 IU/hr

New rate:
900 + 100 = 1000 IU/hr

= 4.0 mL/hr

---

# Technology Requirements

Framework:
- React OR Vue

Language:
- TypeScript preferred

No backend required
Client-side only calculator

---

# Functional Requirements

The app must:

- Work offline
- Be mobile friendly
- Allow decimal weight input
- Auto update calculations
- Show units clearly
- Provide copy button for orders

---

# Optional Features

Add later:

- Multi dilution support
- Pediatric mode
- Low intensity protocol
- Print order sheet
- Save presets
- Dark mode

---

# Disclaimer

This tool is clinical guidance only.
Physician must verify dosing before use.
Institutional protocol overrides calculator.

---

# End of CLAUDE.md
