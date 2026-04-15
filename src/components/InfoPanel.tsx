import type { Protocol } from '../logic/protocols'

interface InfoPanelProps {
  protocol: Protocol
  weightKg: number | null
}

export default function InfoPanel({ protocol, weightKg }: InfoPanelProps) {
  const hasWeight = weightKg !== null && weightKg > 0

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
          ACT-monitored
        </span>
        <h2 className="text-lg font-semibold text-slate-800">{protocol.name}</h2>
      </div>

      {/* Bolus range */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">Bolus Dose</p>

        {hasWeight ? (
          <div>
            <p className="text-2xl font-bold text-blue-800">
              {protocol.id === 'pci_with_gp'
                ? `${(50 * weightKg!).toLocaleString()}–${(70 * weightKg!).toLocaleString()} IU`
                : `${(70 * weightKg!).toLocaleString()}–${(100 * weightKg!).toLocaleString()} IU`}
            </p>
            <p className="text-sm text-blue-600 mt-0.5">{protocol.bolusRangeLabel}</p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-semibold text-blue-700">{protocol.bolusRangeLabel}</p>
            <p className="text-xs text-blue-400 mt-1">Enter patient weight above for the computed dose range</p>
          </div>
        )}

        <div className="border-t border-blue-100 pt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-blue-400">Monitoring</span>
            <span className="font-semibold text-amber-700">ACT (not aPTT)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-blue-400">ACT Target</span>
            <span className="font-medium text-blue-800">{protocol.actTargetLabel}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-blue-400">Concentration</span>
            <span className="font-medium text-blue-800">250 IU/mL</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <p className="text-xs font-semibold text-amber-700 mb-1">Clinical Notes</p>
        <p className="text-sm text-amber-800">{protocol.notes}</p>
      </div>

      <p className="text-xs text-slate-400 italic">{protocol.citation}</p>
    </section>
  )
}
