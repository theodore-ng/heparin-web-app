interface PatientInputProps {
  weight: string
  onChange: (value: string) => void
  isExtremeWeight?: boolean
}

export default function PatientInput({ weight, onChange, isExtremeWeight }: PatientInputProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Patient Information</h2>
      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-slate-600 mb-1">
          Patient Weight
        </label>
        <div className="relative max-w-xs">
          <input
            id="weight"
            type="number"
            min="0"
            step="0.1"
            value={weight}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. 70"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 pr-12 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
            kg
          </span>
        </div>
      </div>
      {isExtremeWeight && (
        <div className="mt-3 bg-amber-50 border border-amber-300 rounded-lg px-4 py-2.5 text-xs text-amber-800 font-medium">
          ⚠ Weight exceeds 200 kg. Please double-check the entered weight — doses may be unusually high.
        </div>
      )}
    </section>
  )
}
