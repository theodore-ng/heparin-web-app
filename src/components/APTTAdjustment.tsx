import type { Protocol } from '../logic/protocols'
import { formatBandRange } from '../logic/protocols'

interface APTTAdjustmentProps {
  currentRateStr: string
  onRateChange: (value: string) => void
  aptt: string
  onApttChange: (value: string) => void
  onAdjust: () => void
  protocol: Protocol
}

export default function APTTAdjustment({
  currentRateStr,
  onRateChange,
  aptt,
  onApttChange,
  onAdjust,
  protocol,
}: APTTAdjustmentProps) {
  const rateValid = currentRateStr !== '' && !isNaN(parseFloat(currentRateStr)) && parseFloat(currentRateStr) >= 0
  const isValid = aptt !== '' && !isNaN(parseFloat(aptt)) && parseFloat(aptt) > 0 && rateValid

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) onAdjust()
  }

  const target = protocol.targetAPTT!

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">aPTT Adjustment</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="currentRate" className="block text-sm font-medium text-slate-600 mb-1">
            Current Infusion Rate
          </label>
          <div className="relative">
            <input
              id="currentRate"
              type="number"
              min="0"
              step="0.1"
              value={currentRateStr}
              onChange={(e) => onRateChange(e.target.value)}
              onKeyDown={handleKey}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 pr-16 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
              mL/hr
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="aptt" className="block text-sm font-medium text-slate-600 mb-1">
            Latest aPTT Result
          </label>
          <div className="relative">
            <input
              id="aptt"
              type="number"
              min="0"
              step="1"
              value={aptt}
              onChange={(e) => onApttChange(e.target.value)}
              onKeyDown={handleKey}
              placeholder="e.g. 75"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 pr-16 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
              sec
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic aPTT target summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
        <p className="font-semibold text-slate-600 mb-1.5">
          aPTT Target: {target.low}–{target.high} sec
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
          {protocol.apttBands!.map((band, i) => {
            const action = band.noChange
              ? 'No change'
              : band.holdOneHour
                ? 'Hold 1 hr + ↓ rate'
                : band.ratePerKg > 0
                  ? `${band.bolusPerKg > 0 ? 'Bolus + ' : ''}↑ rate`
                  : '↓ rate'
            return (
              <span key={i}>
                {formatBandRange(band)} sec → {action}
              </span>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onAdjust}
        disabled={!isValid}
        className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
      >
        Adjust Dose
      </button>
    </section>
  )
}
