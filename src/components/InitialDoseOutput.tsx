import type { InitialDose } from '../logic/heparin'
import type { Protocol } from '../logic/protocols'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'

interface InitialDoseOutputProps {
  dose: InitialDose
  weightKg: number
  protocol: Protocol
  regimenIu: number
  regimenMl: number
  concentration: number
}

export default function InitialDoseOutput({ dose, weightKg, protocol, regimenIu, regimenMl, concentration }: InitialDoseOutputProps) {
  const orderText = [
    `HEPARIN IV ORDER — ${protocol.shortName} | Weight: ${weightKg} kg`,
    `Concentration: ${regimenIu.toLocaleString()} IU in ${regimenMl} mL (${concentration.toFixed(1)} IU/mL)`,
    ``,
    `INITIAL BOLUS: ${dose.bolus.iu.toLocaleString()} IU (${dose.bolus.mL} mL) IV push${dose.bolusCapped ? ` [capped at ${protocol.bolusMaxIu?.toLocaleString()} IU]` : ''}`,
    `INITIAL INFUSION: ${dose.infusion.iuPerHr.toLocaleString()} IU/hr (${dose.infusion.mLPerHr} mL/hr)${dose.infusionCapped ? ` [capped at ${protocol.infusionMaxIuPerHr?.toLocaleString()} IU/hr]` : ''}`,
    ``,
    `aPTT target: ${protocol.targetAPTT?.low}–${protocol.targetAPTT?.high} sec`,
    `Recheck aPTT in 6 hours.`,
    `VERIFY DOSE CLINICALLY BEFORE ADMINISTRATION.`,
  ].join('\n')

  const [copied, copy] = useCopyToClipboard()

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Initial Dose</h2>
        <button
          type="button"
          onClick={() => copy(orderText)}
          className="text-sm px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy Orders'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-1">
            Initial Bolus
          </p>
          <p className="text-2xl font-bold text-blue-800">
            {dose.bolus.iu.toLocaleString()} IU
          </p>
          <p className="text-sm text-blue-600 mt-0.5">{dose.bolus.mL} mL IV push</p>
          {dose.bolusCapped && (
            <p className="text-xs text-amber-600 font-medium mt-1">
              Max cap: {protocol.bolusMaxIu?.toLocaleString()} IU
            </p>
          )}
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500 mb-1">
            Initial Infusion
          </p>
          <p className="text-2xl font-bold text-indigo-800">
            {dose.infusion.iuPerHr.toLocaleString()} IU/hr
          </p>
          <p className="text-sm text-indigo-600 mt-0.5">{dose.infusion.mLPerHr} mL/hr</p>
          {dose.infusionCapped && (
            <p className="text-xs text-amber-600 font-medium mt-1">
              Max cap: {protocol.infusionMaxIuPerHr?.toLocaleString()} IU/hr
            </p>
          )}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 font-medium">
        ⚠ Verify dose clinically before administration. Recheck aPTT in 6 hours.
      </div>
    </section>
  )
}
