import type { Protocol, APTTBand } from '../logic/protocols'
import { formatBandRange } from '../logic/protocols'
import { REFERENCES } from '../data/references'

interface GuidelinePanelProps {
  protocol: Protocol
}

function bandBg(band: APTTBand): string {
  if (band.noChange) return 'bg-green-50'
  if (band.holdOneHour || band.from === 0) return 'bg-red-50'
  return 'bg-orange-50'
}

function bandTextColor(band: APTTBand): string {
  if (band.noChange) return 'text-green-700'
  if (band.holdOneHour || band.from === 0) return 'text-red-700'
  return 'text-orange-700'
}

export default function GuidelinePanel({ protocol }: GuidelinePanelProps) {
  const isCalculable = protocol.calculable
  const isACT = protocol.monitoring === 'ACT'

  return (
    <aside className="space-y-4">
      {/* Protocol Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
            Protocol Overview
          </h2>
          {isACT && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
              ACT
            </span>
          )}
        </div>

        {isCalculable ? (
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex justify-between">
              <span className="text-slate-500">Bolus</span>
              <span className="font-medium">
                {protocol.bolusPerKg} IU/kg
                {protocol.bolusMaxIu && (
                  <span className="text-xs text-slate-400 ml-1">(max {protocol.bolusMaxIu.toLocaleString()} IU)</span>
                )}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Infusion</span>
              <span className="font-medium">
                {protocol.infusionPerKgHr} IU/kg/hr
                {protocol.infusionMaxIuPerHr && (
                  <span className="text-xs text-slate-400 ml-1">(max {protocol.infusionMaxIuPerHr.toLocaleString()} IU/hr)</span>
                )}
              </span>
            </li>
            <li className="flex justify-between border-t border-slate-100 pt-2 mt-2">
              <span className="text-slate-500">Concentration</span>
              <span className="font-medium">250 IU/mL</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Bag</span>
              <span className="font-medium">12,500 IU in 50 mL</span>
            </li>
            <li className="flex justify-between border-t border-slate-100 pt-2 mt-2">
              <span className="text-slate-500">Target aPTT</span>
              <span className="font-medium text-blue-700">
                {protocol.targetAPTT!.low}–{protocol.targetAPTT!.high} sec
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Recheck aPTT</span>
              <span className="font-medium">6 hr after change</span>
            </li>
          </ul>
        ) : (
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex justify-between">
              <span className="text-slate-500">Bolus</span>
              <span className="font-medium">{protocol.bolusRangeLabel}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Monitoring</span>
              <span className="font-semibold text-amber-700">ACT (not aPTT)</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">ACT Target</span>
              <span className="font-medium">{protocol.actTargetLabel}</span>
            </li>
            <li className="flex justify-between border-t border-slate-100 pt-2 mt-2">
              <span className="text-slate-500">Concentration</span>
              <span className="font-medium">250 IU/mL</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Bag</span>
              <span className="font-medium">12,500 IU in 50 mL</span>
            </li>
          </ul>
        )}

        {protocol.notes && (
          <p className="mt-3 text-xs text-slate-400 border-t border-slate-100 pt-2">{protocol.notes}</p>
        )}
      </div>

      {/* aPTT Adjustment Table — only for aPTT-monitored protocols */}
      {isCalculable && protocol.apttBands && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-3">
            aPTT Adjustment Table
          </h2>
          <p className="text-xs text-slate-400 mb-2">
            Target: {protocol.targetAPTT!.low}–{protocol.targetAPTT!.high} sec
          </p>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="text-left py-2 px-2 border border-slate-200 font-semibold">aPTT (sec)</th>
                <th className="text-left py-2 px-2 border border-slate-200 font-semibold">Bolus</th>
                <th className="text-left py-2 px-2 border border-slate-200 font-semibold">Rate Δ</th>
              </tr>
            </thead>
            <tbody>
              {protocol.apttBands.map((band, i) => {
                const bolusLabel = band.bolusPerKg > 0
                  ? `${band.bolusPerKg} IU/kg${band.bolusMaxIu ? ` (max ${band.bolusMaxIu.toLocaleString()})` : ''}`
                  : '—'
                const rateLabel = band.noChange
                  ? 'No change'
                  : band.holdOneHour
                    ? `Hold 1 hr,\n−${Math.abs(band.ratePerKg)} IU/kg/hr`
                    : band.ratePerKg > 0
                      ? `+${band.ratePerKg} IU/kg/hr`
                      : `−${Math.abs(band.ratePerKg)} IU/kg/hr`
                return (
                  <tr key={i} className={bandBg(band)}>
                    <td className={`py-2 px-2 border border-slate-200 font-medium ${bandTextColor(band)}`}>
                      {formatBandRange(band)}
                    </td>
                    <td className="py-2 px-2 border border-slate-200 text-slate-500">{bolusLabel}</td>
                    <td className={`py-2 px-2 border border-slate-200 font-medium whitespace-pre-line ${band.noChange ? 'text-slate-500' : band.ratePerKg > 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {rateLabel}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ACT note for non-calculable */}
      {isACT && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-2">
            ACT Monitoring
          </h2>
          <ul className="space-y-1.5 text-xs text-amber-800">
            <li>• ACT is measured at the bedside during/after PCI.</li>
            <li>• Target and repeat bolus dose depends on the ACT device and card range used.</li>
            <li>• aPTT-guided adjustment does not apply to PCI indications.</li>
            <li>• Refer to Table 3-9 (Dager 2018) for device-specific ACT ranges.</li>
          </ul>
        </div>
      )}

      {/* How to Use */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-3">
          How to Use
        </h2>
        <ol className="space-y-2 text-sm text-slate-600 list-none">
          {(isCalculable
            ? [
                'Select the clinical indication above.',
                'Enter the patient\'s weight in kg.',
                'Click "Calculate Initial Dose" to get the bolus and starting infusion rate.',
                'Administer bolus and start infusion. Recheck aPTT in 6 hours.',
                'Enter the aPTT result and click "Adjust Dose" to get the updated rate.',
                'Repeat from step 5 each time a new aPTT is drawn.',
              ]
            : [
                'Select the PCI indication above.',
                'Enter the patient\'s weight in kg to see the bolus dose range.',
                'Administer bolus IV push and verify ACT response per institutional protocol.',
                'Additional bolus doses may be given to maintain target ACT.',
                'aPTT monitoring is not used for this indication.',
              ]
          ).map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Safety Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-2">
          Safety Notes
        </h2>
        <ul className="space-y-1.5 text-xs text-amber-800">
          <li>• Verify all doses clinically before administration.</li>
          <li>• Institutional protocol overrides this calculator.</li>
          <li>• Minimum infusion rate is 0 mL/hr — never run negative.</li>
          <li>• All mL values are rounded to 1 decimal place.</li>
          {isCalculable && (
            <li>• For aPTT &gt;{protocol.targetAPTT!.high} sec, hold infusion for 1 hour before resuming.</li>
          )}
        </ul>
      </div>

      {/* References */}
      <details className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 group">
        <summary className="text-sm font-semibold text-slate-800 uppercase tracking-wide cursor-pointer select-none list-none flex items-center justify-between">
          References
          <span className="text-slate-400 text-xs font-normal normal-case tracking-normal group-open:hidden">
            {REFERENCES.length} sources
          </span>
          <span className="text-slate-400 text-xs font-normal normal-case tracking-normal hidden group-open:inline">
            collapse
          </span>
        </summary>
        <ol className="mt-3 space-y-3 list-none">
          {REFERENCES.map((ref) => (
            <li key={ref.n} className="flex gap-2 text-xs text-slate-600">
              <span className="flex-shrink-0 font-semibold text-slate-400">{ref.n}.</span>
              <span>
                {ref.title}.{' '}
                <span className="italic text-slate-400">{ref.source}, {ref.year}.</span>{' '}
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {ref.url}
                </a>
              </span>
            </li>
          ))}
        </ol>
      </details>
    </aside>
  )
}
