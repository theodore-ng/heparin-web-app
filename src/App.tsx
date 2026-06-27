import { useState } from 'react'
import PatientInput from './components/PatientInput'
import InitialDoseOutput from './components/InitialDoseOutput'
import APTTAdjustment from './components/APTTAdjustment'
import AdjustmentOutput from './components/AdjustmentOutput'
import GuidelinePanel from './components/GuidelinePanel'
import ProtocolSelector from './components/ProtocolSelector'
import InfoPanel from './components/InfoPanel'
import {
  calcInitialDose,
  calcAPTTAdjustment,
  type InitialDose,
  type AdjustmentResult,
} from './logic/heparin'
import { getProtocol, DEFAULT_PROTOCOL_ID } from './logic/protocols'

const HOW_TO_USE_CALCULABLE = [
  'Select the clinical indication.',
  'Enter the patient\'s weight in kg.',
  'Choose "Calc Initial Dose" for a new order, or "Adjust Dose" to update an existing infusion.',
  'Enter the heparin regimen: total IU in the bag and the diluent volume in mL.',
  'For initial dose: administer bolus and start infusion. Recheck aPTT in 6 hours.',
  'For dose adjustment: enter the current infusion rate and latest aPTT, then click "Adjust Dose". Repeat each time a new aPTT is drawn.',
]

const HOW_TO_USE_ACT = [
  'Select the PCI indication.',
  'Enter the patient\'s weight in kg to see the bolus dose range.',
  'Administer bolus IV push and verify ACT response per institutional protocol.',
  'Additional bolus doses may be given to maintain target ACT.',
  'aPTT monitoring is not applicable for this indication.',
]

export default function App() {
  const [selectedProtocolId, setSelectedProtocolId] = useState(DEFAULT_PROTOCOL_ID)
  const [weight, setWeight] = useState('')
  const [mode, setMode] = useState<'initial' | 'adjustment' | null>(null)
  const [regimenIu, setRegimenIu] = useState('')
  const [regimenMl, setRegimenMl] = useState('')
  const [initialDose, setInitialDose] = useState<InitialDose | null>(null)
  const [aptt, setAptt] = useState('')
  const [adjustment, setAdjustment] = useState<AdjustmentResult | null>(null)
  const [currentRateStr, setCurrentRateStr] = useState('')
  const [prevRateIuPerHr, setPrevRateIuPerHr] = useState<number | null>(null)

  const selectedProtocol = getProtocol(selectedProtocolId)
  const weightKg = parseFloat(weight)
  const weightValid = !isNaN(weightKg) && weightKg > 0
  const isExtremeWeight = weightValid && weightKg > 200

  const regimenIuVal = parseFloat(regimenIu)
  const regimenMlVal = parseFloat(regimenMl)
  const regimenValid = !isNaN(regimenIuVal) && regimenIuVal > 0 && !isNaN(regimenMlVal) && regimenMlVal > 0
  const concentration = regimenValid ? regimenIuVal / regimenMlVal : 250

  const handleProtocolChange = (id: string) => {
    setSelectedProtocolId(id)
    setMode(null)
    setInitialDose(null)
    setAdjustment(null)
    setCurrentRateStr('')
    setAptt('')
    setPrevRateIuPerHr(null)
  }

  const handleWeightChange = (v: string) => {
    setWeight(v)
    setInitialDose(null)
    setAdjustment(null)
    setPrevRateIuPerHr(null)
  }

  const handleModeSelect = (newMode: 'initial' | 'adjustment') => {
    setMode(newMode)
    setInitialDose(null)
    setAdjustment(null)
    setCurrentRateStr('')
    setAptt('')
    setPrevRateIuPerHr(null)
  }

  const handleRegimenChange = () => {
    setInitialDose(null)
    setAdjustment(null)
    setPrevRateIuPerHr(null)
  }

  const handleCalculateInitial = () => {
    if (!weightValid || !selectedProtocol.calculable || !regimenValid) return
    const dose = calcInitialDose(weightKg, selectedProtocol, concentration)
    setInitialDose(dose)
    setAptt('')
    setAdjustment(null)
    setCurrentRateStr(String(dose.infusion.mLPerHr))
    setPrevRateIuPerHr(null)
  }

  const handleAdjust = () => {
    const apttVal = parseFloat(aptt)
    const rateIuPerHr = parseFloat(currentRateStr) * concentration
    if (
      isNaN(apttVal) || !weightValid || apttVal <= 0 ||
      isNaN(rateIuPerHr) ||
      !selectedProtocol.apttBands
    ) return
    setPrevRateIuPerHr(rateIuPerHr)
    const result = calcAPTTAdjustment(apttVal, weightKg, rateIuPerHr, selectedProtocol.apttBands, concentration)
    setAdjustment(result)
    if (!result.noChange) {
      setCurrentRateStr(String(result.newRateMlPerHr))
    }
  }

  const showModeButtons = weightValid && selectedProtocol.calculable
  const showRegimenInput = mode !== null && selectedProtocol.calculable
  const showInitialOutput = mode === 'initial' && regimenValid && initialDose !== null
  const showAdjustSection = regimenValid && selectedProtocol.calculable && (
    (mode === 'initial' && initialDose !== null) || mode === 'adjustment'
  )

  const howToUseSteps = selectedProtocol.calculable ? HOW_TO_USE_CALCULABLE : HOW_TO_USE_ACT

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Heparin IV Calc.</h1>
          <p className="text-blue-200 text-sm mt-0.5">
            Weight-based · aPTT-guided adjustment
          </p>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-6 lg:items-start">

          {/* Left — Calculator */}
          <main className="space-y-4">
            {/* Disclaimer */}
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-700">
              <strong>Clinical Guidance Only.</strong> Physician must verify all dosing before administration.
              Institutional protocol takes precedence over this calculator.
            </div>

            {/* How to Use — above Select Indication */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-3">
                How to Use
              </h2>
              <ol className="space-y-2 text-sm text-slate-600 list-none">
                {howToUseSteps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Protocol Selector */}
            <ProtocolSelector
              selected={selectedProtocolId}
              onChange={handleProtocolChange}
            />

            {/* Patient Weight */}
            <PatientInput
              weight={weight}
              onChange={handleWeightChange}
              isExtremeWeight={isExtremeWeight}
            />

            {/* Mode buttons — appear once weight is valid */}
            {showModeButtons && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleModeSelect('initial')}
                  className={`flex-1 px-4 py-3 font-semibold rounded-xl border-2 transition-colors ${
                    mode === 'initial'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-blue-700 border-blue-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  Calc Initial Dose
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSelect('adjustment')}
                  className={`flex-1 px-4 py-3 font-semibold rounded-xl border-2 transition-colors ${
                    mode === 'adjustment'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-indigo-700 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50'
                  }`}
                >
                  Adjust Dose
                </button>
              </div>
            )}

            {/* Non-calculable protocols (PCI / ACT-monitored) */}
            {!selectedProtocol.calculable && (
              <InfoPanel
                protocol={selectedProtocol}
                weightKg={isNaN(weightKg) ? null : weightKg}
              />
            )}

            {/* Regimen input — appears after mode selection */}
            {showRegimenInput && (
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-slate-800">Heparin Regimen</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Heparin Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={regimenIu}
                        onChange={(e) => { setRegimenIu(e.target.value); handleRegimenChange() }}
                        placeholder="e.g. 25000"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 pr-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">IU</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Dilution Volume
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={regimenMl}
                        onChange={(e) => { setRegimenMl(e.target.value); handleRegimenChange() }}
                        placeholder="e.g. 50"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 pr-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">mL</span>
                    </div>
                  </div>
                </div>

                {regimenValid && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-600">
                    Concentration:{' '}
                    <span className="font-semibold text-slate-800">{concentration.toFixed(1)} IU/mL</span>
                    {' '}({Number(regimenIu).toLocaleString()} IU in {regimenMl} mL)
                  </div>
                )}

                {mode === 'initial' && (
                  <button
                    type="button"
                    onClick={handleCalculateInitial}
                    disabled={!regimenValid}
                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Calculate Initial Dose
                  </button>
                )}
              </section>
            )}

            {/* Initial Dose Output */}
            {showInitialOutput && (
              <InitialDoseOutput
                dose={initialDose!}
                weightKg={weightKg}
                protocol={selectedProtocol}
                regimenIu={regimenIuVal}
                regimenMl={regimenMlVal}
                concentration={concentration}
              />
            )}

            {/* aPTT Adjustment */}
            {showAdjustSection && (
              <APTTAdjustment
                currentRateStr={currentRateStr}
                onRateChange={(v) => {
                  setCurrentRateStr(v)
                  setAdjustment(null)
                }}
                aptt={aptt}
                onApttChange={(v) => {
                  setAptt(v)
                  setAdjustment(null)
                }}
                onAdjust={handleAdjust}
                protocol={selectedProtocol}
              />
            )}

            {/* Adjustment Output */}
            {adjustment !== null && prevRateIuPerHr !== null && (
              <AdjustmentOutput
                result={adjustment}
                weightKg={weightKg}
                prevRateIuPerHr={prevRateIuPerHr}
              />
            )}
          </main>

          {/* Right — Guideline Panel (sticky on desktop) */}
          <div className="mt-4 lg:mt-0 lg:sticky lg:top-6">
            <GuidelinePanel protocol={selectedProtocol} />
          </div>

        </div>
      </div>
    </div>
  )
}
