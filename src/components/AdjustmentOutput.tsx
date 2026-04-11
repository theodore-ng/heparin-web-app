import type { AdjustmentResult } from '../logic/heparin'
import { useState } from 'react'

interface AdjustmentOutputProps {
  result: AdjustmentResult
  weightKg: number
  prevRateIuPerHr: number
}

export default function AdjustmentOutput({ result, weightKg, prevRateIuPerHr }: AdjustmentOutputProps) {
  const [copied, setCopied] = useState(false)

  const lines: string[] = [
    `HEPARIN ADJUSTMENT — Weight: ${weightKg} kg | aPTT: ${result.aptt} sec`,
    `Previous rate: ${prevRateIuPerHr} IU/hr`,
    ``,
  ]

  if (result.noChange) {
    lines.push(`aPTT in target range. No dose change required.`)
  } else {
    if (result.bolusSurcharge) {
      lines.push(`BOLUS: ${result.bolusSurcharge.iu} IU (${result.bolusSurcharge.mL} mL) IV push`)
    }
    if (result.holdOneHour) {
      lines.push(`HOLD INFUSION FOR 1 HOUR, then resume at new rate.`)
    }
    lines.push(`NEW INFUSION RATE: ${result.newRateIuPerHr} IU/hr (${result.newRateMlPerHr} mL/hr)`)
  }

  lines.push(``, `Recheck aPTT in 6 hours.`, `VERIFY DOSE CLINICALLY BEFORE ADMINISTRATION.`)

  const orderText = lines.join('\n')

  const handleCopy = () => {
    navigator.clipboard.writeText(orderText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Adjustment Result</h2>
        <button
          onClick={handleCopy}
          className="text-sm px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy Orders'}
        </button>
      </div>

      {result.holdOneHour && (
        <div className="bg-red-50 border border-red-300 rounded-lg px-4 py-3 text-red-800 font-semibold text-sm">
          🛑 HOLD infusion for 1 hour, then resume at new rate below.
        </div>
      )}

      {result.noChange ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-500 mb-1">
            aPTT In Therapeutic Range
          </p>
          <p className="text-xl font-bold text-green-800">No change required</p>
          <p className="text-sm text-green-600 mt-1">
            Current rate: {prevRateIuPerHr.toLocaleString()} IU/hr
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {result.bolusSurcharge && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-1">
                Additional Bolus
              </p>
              <p className="text-2xl font-bold text-blue-800">
                {result.bolusSurcharge.iu.toLocaleString()} IU
              </p>
              <p className="text-sm text-blue-600 mt-0.5">{result.bolusSurcharge.mL} mL IV push</p>
            </div>
          )}

          <div className={`bg-indigo-50 border border-indigo-100 rounded-xl p-4 ${!result.bolusSurcharge ? 'sm:col-span-2' : ''}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500 mb-1">
              New Infusion Rate
            </p>
            <p className="text-2xl font-bold text-indigo-800">
              {result.newRateIuPerHr.toLocaleString()} IU/hr
            </p>
            <p className="text-sm text-indigo-600 mt-0.5">{result.newRateMlPerHr} mL/hr</p>
            {result.newRateIuPerHr === 0 && (
              <p className="text-xs text-red-600 font-medium mt-1">Rate clamped to minimum (0)</p>
            )}
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 font-medium">
        ⚠ Verify dose clinically before administration. Recheck aPTT in 6 hours.
      </div>
    </section>
  )
}
