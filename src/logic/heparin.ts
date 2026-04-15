import type { APTTBand, Protocol } from './protocols'

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
  bolusCapped: boolean
  infusionCapped: boolean
}

export interface AdjustmentResult {
  aptt: number
  bolusSurcharge: BolusDose | null
  holdOneHour: boolean
  newRateIuPerHr: number
  newRateMlPerHr: number
  noChange: boolean
}

/**
 * Calculates initial bolus and infusion rate for a given protocol.
 * Applies max caps where defined (e.g. STEMI protocols).
 */
export function calcInitialDose(weightKg: number, protocol: Protocol): InitialDose {
  const rawBolusIu = weightKg * protocol.bolusPerKg!
  const bolusIu = protocol.bolusMaxIu !== null
    ? Math.min(rawBolusIu, protocol.bolusMaxIu)
    : rawBolusIu
  const bolusCapped = protocol.bolusMaxIu !== null && rawBolusIu > protocol.bolusMaxIu

  const rawInfusionIuPerHr = weightKg * protocol.infusionPerKgHr!
  const infusionIuPerHr = protocol.infusionMaxIuPerHr !== null
    ? Math.min(rawInfusionIuPerHr, protocol.infusionMaxIuPerHr)
    : rawInfusionIuPerHr
  const infusionCapped = protocol.infusionMaxIuPerHr !== null && rawInfusionIuPerHr > protocol.infusionMaxIuPerHr

  return {
    bolus: { iu: bolusIu, mL: round1(bolusIu / CONCENTRATION_IU_PER_ML) },
    infusion: { iuPerHr: infusionIuPerHr, mLPerHr: round1(infusionIuPerHr / CONCENTRATION_IU_PER_ML) },
    bolusCapped,
    infusionCapped,
  }
}

/**
 * Calculates the aPTT-guided dose adjustment using protocol-specific bands.
 * Rate is clamped to a minimum of 0 IU/hr.
 */
export function calcAPTTAdjustment(
  aptt: number,
  weightKg: number,
  currentRateIuPerHr: number,
  bands: APTTBand[],
): AdjustmentResult {
  const band = bands.find(b => aptt >= b.from && aptt < b.to)
  if (!band) throw new Error(`No aPTT band matched for value ${aptt}`)

  let bolusIu: number | null = null
  if (band.bolusPerKg > 0) {
    bolusIu = weightKg * band.bolusPerKg
    if (band.bolusMaxIu !== null) bolusIu = Math.min(bolusIu, band.bolusMaxIu)
  }

  const rateChangeDelta = weightKg * band.ratePerKg
  const newRateIuPerHr = Math.max(0, currentRateIuPerHr + rateChangeDelta)
  const newRateMlPerHr = round1(newRateIuPerHr / CONCENTRATION_IU_PER_ML)

  const bolusSurcharge: BolusDose | null = bolusIu !== null
    ? { iu: bolusIu, mL: round1(bolusIu / CONCENTRATION_IU_PER_ML) }
    : null

  return {
    aptt,
    bolusSurcharge,
    holdOneHour: band.holdOneHour,
    newRateIuPerHr,
    newRateMlPerHr,
    noChange: band.noChange,
  }
}
