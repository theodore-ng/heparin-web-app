/** Fixed concentration: 12,500 IU in 50 mL = 250 IU/mL */
const CONCENTRATION_IU_PER_ML = 250

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
  const iu = weightKg * 80
  return { iu, mL: round1(iu / CONCENTRATION_IU_PER_ML) }
}

export function calcInitialInfusion(weightKg: number): InitialInfusion {
  const iuPerHr = weightKg * 18
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

  if (aptt < 40) {
    bolusIu = weightKg * 80
    rateChangeDelta = weightKg * 4
  } else if (aptt <= 59) {
    bolusIu = weightKg * 40
    rateChangeDelta = weightKg * 2
  } else if (aptt <= 100) {
    noChange = true
  } else if (aptt <= 120) {
    rateChangeDelta = -(weightKg * 2)
  } else {
    holdOneHour = true
    rateChangeDelta = -(weightKg * 4)
  }

  const newRateIuPerHr = Math.max(0, currentRateIuPerHr + rateChangeDelta)
  const newRateMlPerHr = round1(newRateIuPerHr / CONCENTRATION_IU_PER_ML)

  const bolusSurcharge: BolusDose | null =
    bolusIu !== null
      ? { iu: bolusIu, mL: round1(bolusIu / CONCENTRATION_IU_PER_ML) }
      : null

  return { aptt, bolusSurcharge, holdOneHour, newRateIuPerHr, newRateMlPerHr, noChange }
}
