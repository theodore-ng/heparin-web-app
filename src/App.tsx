import { useState } from 'react'
import PatientInput from './components/PatientInput'
import InitialDoseOutput from './components/InitialDoseOutput'
import APTTAdjustment from './components/APTTAdjustment'
import AdjustmentOutput from './components/AdjustmentOutput'
import GuidelinePanel from './components/GuidelinePanel'
import {
  calcInitialDose,
  calcAPTTAdjustment,
  type InitialDose,
  type AdjustmentResult,
} from './logic/heparin'

export default function App() {
  const [weight, setWeight] = useState('')
  const [initialDose, setInitialDose] = useState<InitialDose | null>(null)
  const [aptt, setAptt] = useState('')
  const [adjustment, setAdjustment] = useState<AdjustmentResult | null>(null)
  const [currentRateStr, setCurrentRateStr] = useState('')

  const handleCalculateInitial = () => {
    const kg = parseFloat(weight)
    if (isNaN(kg) || kg <= 0) return
    const dose = calcInitialDose(kg)
    setInitialDose(dose)
    setAptt('')
    setAdjustment(null)
    setCurrentRateStr(String(dose.infusion.mLPerHr))
  }

  const handleAdjust = () => {
    const apttVal = parseFloat(aptt)
    const kg = parseFloat(weight)
    const rateIuPerHr = parseFloat(currentRateStr) * 250
    if (isNaN(apttVal) || isNaN(kg) || apttVal <= 0 || isNaN(rateIuPerHr) || initialDose === null) return
    const result = calcAPTTAdjustment(apttVal, kg, rateIuPerHr)
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
          <h1 className="text-xl font-bold">Heparin IV Dose Calculator</h1>
          <p className="text-blue-200 text-sm mt-0.5">
            Weight-based · 250 IU/mL · aPTT-guided adjustment
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

            {/* Section 1 — Patient Input */}
            <PatientInput
              weight={weight}
              onChange={(v) => {
                setWeight(v)
                setInitialDose(null)
                setAdjustment(null)
              }}
              onCalculate={handleCalculateInitial}
            />

            {/* Section 2 — Initial Dose Output */}
            {initialDose && (
              <InitialDoseOutput dose={initialDose} weightKg={parseFloat(weight)} />
            )}

            {/* Section 3 — aPTT Adjustment */}
            {initialDose && (
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
              />
            )}

            {/* Section 4 — Adjustment Output */}
            {adjustment && initialDose && (
              <AdjustmentOutput
                result={adjustment}
                weightKg={parseFloat(weight)}
                prevRateIuPerHr={initialDose.infusion.iuPerHr}
              />
            )}
          </main>

          {/* Right — Guideline Panel (sticky on desktop, stacked on mobile) */}
          <div className="mt-4 lg:mt-0 lg:sticky lg:top-6">
            <GuidelinePanel />
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-6 py-4 text-center text-xs text-slate-400">
        Developed by DongTrieu · v1.0.0
      </footer>
    </div>
  )
}
