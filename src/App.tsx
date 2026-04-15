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

export default function App() {
  const [selectedProtocolId, setSelectedProtocolId] = useState(DEFAULT_PROTOCOL_ID)
  const [weight, setWeight] = useState('')
  const [initialDose, setInitialDose] = useState<InitialDose | null>(null)
  const [aptt, setAptt] = useState('')
  const [adjustment, setAdjustment] = useState<AdjustmentResult | null>(null)
  const [currentRateStr, setCurrentRateStr] = useState('')

  const selectedProtocol = getProtocol(selectedProtocolId)
  const weightKg = parseFloat(weight)
  const isExtremeWeight = !isNaN(weightKg) && weightKg > 200

  const handleProtocolChange = (id: string) => {
    setSelectedProtocolId(id)
    setInitialDose(null)
    setAdjustment(null)
    setCurrentRateStr('')
    setAptt('')
  }

  const handleWeightChange = (v: string) => {
    setWeight(v)
    setInitialDose(null)
    setAdjustment(null)
  }

  const handleCalculateInitial = () => {
    const kg = parseFloat(weight)
    if (isNaN(kg) || kg <= 0 || !selectedProtocol.calculable) return
    const dose = calcInitialDose(kg, selectedProtocol)
    setInitialDose(dose)
    setAptt('')
    setAdjustment(null)
    setCurrentRateStr(String(dose.infusion.mLPerHr))
  }

  const handleAdjust = () => {
    const apttVal = parseFloat(aptt)
    const kg = parseFloat(weight)
    const rateIuPerHr = parseFloat(currentRateStr) * 250
    if (
      isNaN(apttVal) || isNaN(kg) || apttVal <= 0 ||
      isNaN(rateIuPerHr) || initialDose === null ||
      !selectedProtocol.apttBands
    ) return
    const result = calcAPTTAdjustment(apttVal, kg, rateIuPerHr, selectedProtocol.apttBands)
    setAdjustment(result)
    if (!result.noChange) {
      setCurrentRateStr(String(result.newRateMlPerHr))
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Heparin IV Calc.</h1>
          <p className="text-blue-200 text-sm mt-0.5">
            Weight-based · CR Hospital · 12,500 IU/50 mL · aPTT-guided adjustment
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

            {/* Protocol Selector */}
            <ProtocolSelector
              selected={selectedProtocolId}
              onChange={handleProtocolChange}
            />

            {/* Section 1 — Patient Input */}
            <PatientInput
              weight={weight}
              onChange={handleWeightChange}
              onCalculate={handleCalculateInitial}
              isExtremeWeight={isExtremeWeight}
              showButton={selectedProtocol.calculable}
            />

            {/* Non-calculable protocols (PCI / ACT-monitored) */}
            {!selectedProtocol.calculable && (
              <InfoPanel
                protocol={selectedProtocol}
                weightKg={isNaN(weightKg) ? null : weightKg}
              />
            )}

            {/* Section 2 — Initial Dose Output */}
            {selectedProtocol.calculable && initialDose && (
              <InitialDoseOutput
                dose={initialDose}
                weightKg={weightKg}
                protocol={selectedProtocol}
              />
            )}

            {/* Section 3 — aPTT Adjustment */}
            {selectedProtocol.calculable && initialDose && (
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

            {/* Section 4 — Adjustment Output */}
            {selectedProtocol.calculable && adjustment && initialDose && (
              <AdjustmentOutput
                result={adjustment}
                weightKg={weightKg}
                prevRateIuPerHr={initialDose.infusion.iuPerHr}
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
