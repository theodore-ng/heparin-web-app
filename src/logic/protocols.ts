/** Represents one band of the aPTT adjustment table */
export interface APTTBand {
  from: number           // seconds, inclusive
  to: number             // seconds, exclusive (use Infinity for last band)
  bolusPerKg: number     // IU/kg bolus surcharge (0 = no bolus)
  bolusMaxIu: number | null
  ratePerKg: number      // IU/kg/hr rate change (+/-; 0 = no change)
  holdOneHour: boolean
  noChange: boolean
}

export interface Protocol {
  id: string
  name: string
  shortName: string
  calculable: boolean           // true = full IV calculator; false = info panel only
  monitoring: 'aPTT' | 'ACT'
  bolusPerKg: number | null
  bolusMaxIu: number | null
  infusionPerKgHr: number | null
  infusionMaxIuPerHr: number | null
  targetAPTT: { low: number; high: number } | null
  apttBands: APTTBand[] | null
  /** For PCI range-dose display only */
  bolusRangeLabel?: string
  actTargetLabel?: string
  notes: string
  citation: string
}

/* ── aPTT adjustment band sets ───────────────────────────────────────── */

/** VTE — target aPTT 60–100 sec */
const VTE_BANDS: APTTBand[] = [
  { from:   0, to:  40, bolusPerKg: 80, bolusMaxIu: null, ratePerKg:  4, holdOneHour: false, noChange: false },
  { from:  40, to:  60, bolusPerKg: 40, bolusMaxIu: null, ratePerKg:  2, holdOneHour: false, noChange: false },
  { from:  60, to: 101, bolusPerKg:  0, bolusMaxIu: null, ratePerKg:  0, holdOneHour: false, noChange: true  },
  { from: 101, to: 121, bolusPerKg:  0, bolusMaxIu: null, ratePerKg: -2, holdOneHour: false, noChange: false },
  { from: 121, to: Infinity, bolusPerKg: 0, bolusMaxIu: null, ratePerKg: -4, holdOneHour: true, noChange: false },
]

/**
 * Cardiac (STEMI/NSTEMI) — target aPTT 50–70 sec.
 * Bands adapted from standard protocol with shifted therapeutic window.
 * Adjustment boluses are smaller and capped to reflect higher bleeding risk.
 */
const CARDIAC_BANDS: APTTBand[] = [
  { from:  0, to:  40, bolusPerKg: 40, bolusMaxIu: 4000, ratePerKg:  4, holdOneHour: false, noChange: false },
  { from: 40, to:  50, bolusPerKg: 20, bolusMaxIu: 2000, ratePerKg:  2, holdOneHour: false, noChange: false },
  { from: 50, to:  71, bolusPerKg:  0, bolusMaxIu: null, ratePerKg:  0, holdOneHour: false, noChange: true  },
  { from: 71, to:  91, bolusPerKg:  0, bolusMaxIu: null, ratePerKg: -2, holdOneHour: false, noChange: false },
  { from: 91, to: Infinity, bolusPerKg: 0, bolusMaxIu: null, ratePerKg: -4, holdOneHour: true, noChange: false },
]

/* ── Protocol definitions ────────────────────────────────────────────── */

export const PROTOCOLS: Protocol[] = [
  /* ── aPTT-monitored IV ── */
  {
    id: 'vte',
    name: 'VTE Treatment (DVT/PE)',
    shortName: 'VTE (DVT/PE)',
    calculable: true,
    monitoring: 'aPTT',
    bolusPerKg: 80,
    bolusMaxIu: null,
    infusionPerKgHr: 18,
    infusionMaxIuPerHr: null,
    targetAPTT: { low: 60, high: 100 },
    apttBands: VTE_BANDS,
    notes: 'Standard weight-based heparin for VTE. Lower bolus doses (e.g. 2,000 IU) have been suggested as an option.',
    citation: 'Dager WE. Table 3-5. ASHP Anticoagulation Therapy, 2018.',
  },
  {
    id: 'stemi_rtpa',
    name: 'Acute STEMI (full-dose rt-PA)',
    shortName: 'STEMI + rt-PA',
    calculable: true,
    monitoring: 'aPTT',
    bolusPerKg: 60,
    bolusMaxIu: 4000,
    infusionPerKgHr: 12,
    infusionMaxIuPerHr: 1000,
    targetAPTT: { low: 50, high: 70 },
    apttBands: CARDIAC_BANDS,
    notes: 'For full-dose rt-PA. Continue ≥48 hr or until revascularization. aPTT target 50–70 sec. Max bolus 4,000 IU; max infusion 1,000 IU/hr.',
    citation: 'Dager WE. Table 3-5. ASHP Anticoagulation Therapy, 2018.',
  },
  {
    id: 'stemi_combo_rtpa',
    name: 'Acute STEMI (combination rt-PA)',
    shortName: 'STEMI combo rt-PA',
    calculable: true,
    monitoring: 'aPTT',
    bolusPerKg: 60,
    bolusMaxIu: 3000,
    infusionPerKgHr: 7,
    infusionMaxIuPerHr: 800,
    targetAPTT: { low: 50, high: 70 },
    apttBands: CARDIAC_BANDS,
    notes: 'Combination rt-PA regimen — lower caps apply. Max bolus 3,000 IU; max infusion 800 IU/hr. See Chapter 6.',
    citation: 'Dager WE. Table 3-5. ASHP Anticoagulation Therapy, 2018.',
  },
  {
    id: 'nstemi_ua',
    name: 'NSTEMI / Unstable Angina',
    shortName: 'NSTEMI / UA',
    calculable: true,
    monitoring: 'aPTT',
    bolusPerKg: 60,
    bolusMaxIu: 4000,
    infusionPerKgHr: 12,
    infusionMaxIuPerHr: 1000,
    targetAPTT: { low: 50, high: 70 },
    apttBands: CARDIAC_BANDS,
    notes: 'Continue 48 hr or until revascularization. Some institutions use a higher initial threshold to reach the target range faster.',
    citation: 'Dager WE. Table 3-5. ASHP Anticoagulation Therapy, 2018.',
  },
  /* ── ACT-monitored IV (info only) ── */
  {
    id: 'pci_with_gp',
    name: 'PCI (with GP IIb/IIIa inhibitor)',
    shortName: 'PCI + GP IIb/IIIa',
    calculable: false,
    monitoring: 'ACT',
    bolusPerKg: null,
    bolusMaxIu: null,
    infusionPerKgHr: null,
    infusionMaxIuPerHr: null,
    targetAPTT: null,
    apttBands: null,
    bolusRangeLabel: '50–70 IU/kg IV',
    actTargetLabel: '200–250 sec (low response ACT)',
    notes: 'Monitored by ACT — not aPTT. Additional bolus doses may be needed to maintain target ACT. aPTT-based adjustment is not applicable for this indication.',
    citation: 'Dager WE. Table 3-5. ASHP Anticoagulation Therapy, 2018.',
  },
  {
    id: 'pci_without_gp',
    name: 'PCI (without GP IIb/IIIa inhibitor)',
    shortName: 'PCI only',
    calculable: false,
    monitoring: 'ACT',
    bolusPerKg: null,
    bolusMaxIu: null,
    infusionPerKgHr: null,
    infusionMaxIuPerHr: null,
    targetAPTT: null,
    apttBands: null,
    bolusRangeLabel: '70–100 IU/kg IV',
    actTargetLabel: 'Varies by device/card range — see Table 3-9',
    notes: 'ACT target depends on the device and card range used. Different systems (Hemochron, MedTronic, HemoTec) give notably different values. aPTT-based adjustment is not applicable.',
    citation: 'Dager WE. Table 3-5. ASHP Anticoagulation Therapy, 2018.',
  },
]

export const DEFAULT_PROTOCOL_ID = 'vte'

export function getProtocol(id: string): Protocol {
  return PROTOCOLS.find(p => p.id === id) ?? PROTOCOLS[0]
}

/* ── Display helpers ─────────────────────────────────────────────────── */

/** Formats an aPTT band's range as a human-readable string, e.g. "60–100" */
export function formatBandRange(band: APTTBand): string {
  if (band.from === 0) return `< ${band.to}`
  if (band.to === Infinity) return `> ${band.from - 1}`
  return `${band.from}–${band.to - 1}`
}
