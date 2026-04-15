interface PatientInputProps {
  weight: string
  onChange: (value: string) => void
  onCalculate: () => void
  isExtremeWeight?: boolean
  showButton?: boolean
}

export default function PatientInput({
  weight,
  onChange,
  onCalculate,
  isExtremeWeight,
  showButton = true,
}: PatientInputProps) {
  const isValid = weight !== '' && !isNaN(parseFloat(weight)) && parseFloat(weight) > 0

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) onCalculate()
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Patient Information</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="weight" className="block text-sm font-medium text-slate-600 mb-1">
            Patient Weight
          </label>
          <div className="relative">
            <input
              id="weight"
              type="number"
              min="0"
              step="0.1"
              value={weight}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKey}
              placeholder="e.g. 70"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 pr-12 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
              kg
            </span>
          </div>
        </div>
        {showButton && (
          <button
            type="button"
            onClick={onCalculate}
            disabled={!isValid}
            className="self-end sm:self-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Calculate Initial Dose
          </button>
        )}
      </div>
      {isExtremeWeight && (
        <div className="mt-3 bg-amber-50 border border-amber-300 rounded-lg px-4 py-2.5 text-xs text-amber-800 font-medium">
          ⚠ Weight exceeds 200 kg. Please double-check the entered weight — doses may be unusually high.
        </div>
      )}
    </section>
  )
}
