/** Fixed concentration: 12,500 IU in 50 mL = 250 IU/mL */
const CONCENTRATION_IU_PER_ML = 250

/* ── Clinical Protocol Constants ───────────────────────────── */
const BOLUS_FACTOR_IU_PER_KG = 80           // Initial bolus: 80 IU/kg
const INFUSION_FACTOR_IU_PER_KG_HR = 18     // Initial infusion: 18 IU/kg/hr

/** aPTT thresholds (seconds) */
const APTT_CRITICAL_LOW = 40
const APTT_LOW = 60
const APTT_HIGH = 100
const APTT_CRITICAL_HIGH = 120

/** aPTT adjustment factors */
const ADJ_BOLUS_HIGH = 80                   // IU/kg for aPTT < 40
const ADJ_BOLUS_LOW = 40                    // IU/kg for aPTT 40–59
const ADJ_RATE_INCREASE_HIGH = 4            // IU/kg/hr for aPTT < 40
const ADJ_RATE_INCREASE_LOW = 2             // IU/kg/hr for aPTT 40–59
const ADJ_RATE_DECREASE_LOW = 2             // IU/kg/hr for aPTT 101–120
const ADJ_RATE_DECREASE_HIGH = 4            // IU/kg/hr for aPTT > 120
/* ───────────────────────────────────────────────────────────── */

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

export interface BolusDose {
  iu: number
  mL: number
}

export interface InitialInfusion {
  iuPerHr: number
  mLPerHr: number
}

export interface InitialDose {
  bolus: BolusDose
  infusion: InitialInfusion
}

export interface AdjustmentResult {
  aptt: number
  bolusSurcharge: BolusDose | null
  holdOneHour: boolean
  newRateIuPerHr: number
  newRateMlPerHr: number
  noChange: boolean
}

export function calcBolus(weightKg: number): BolusDose {
  const iu = weightKg * BOLUS_FACTOR_IU_PER_KG
  return { iu, mL: round1(iu / CONCENTRATION_IU_PER_ML) }
}

export function calcInitialInfusion(weightKg: number): InitialInfusion {
  const iuPerHr = weightKg * INFUSION_FACTOR_IU_PER_KG_HR
  return { iuPerHr, mLPerHr: round1(iuPerHr / CONCENTRATION_IU_PER_ML) }
}

export function calcInitialDose(weightKg: number): InitialDose {
  return {
    bolus: calcBolus(weightKg),
    infusion: calcInitialInfusion(weightKg),
  }
}

export function calcAPTTAdjustment(
  aptt: number,
  weightKg: number,
  currentRateIuPerHr: number,
): AdjustmentResult {
  let bolusIu: number | null = null
  let rateChangeDelta = 0
  let holdOneHour = false
  let noChange = false

  if (aptt < APTT_CRITICAL_LOW) {
    bolusIu = weightKg * ADJ_BOLUS_HIGH
    rateChangeDelta = weightKg * ADJ_RATE_INCREASE_HIGH
  } else if (aptt < APTT_LOW) {
    bolusIu = weightKg * ADJ_BOLUS_LOW
    rateChangeDelta = weightKg * ADJ_RATE_INCREASE_LOW
  } else if (aptt <= APTT_HIGH) {
    noChange = true
  } else if (aptt <= APTT_CRITICAL_HIGH) {
    rateChangeDelta = -(weightKg * ADJ_RATE_DECREASE_LOW)
  } else {
    holdOneHour = true
    rateChangeDelta = -(weightKg * ADJ_RATE_DECREASE_HIGH)
  }

  const newRateIuPerHr = Math.max(0, currentRateIuPerHr + rateChangeDelta)
  const newRateMlPerHr = round1(newRateIuPerHr / CONCENTRATION_IU_PER_ML)

  const bolusSurcharge: BolusDose | null =
    bolusIu !== null
      ? { iu: bolusIu, mL: round1(bolusIu / CONCENTRATION_IU_PER_ML) }
      : null

  return { aptt, bolusSurcharge, holdOneHour, newRateIuPerHr, newRateMlPerHr, noChange }
}
