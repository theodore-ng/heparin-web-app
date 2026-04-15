import { PROTOCOLS } from '../logic/protocols'

interface ProtocolSelectorProps {
  selected: string
  onChange: (id: string) => void
}

export default function ProtocolSelector({ selected, onChange }: ProtocolSelectorProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
      <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
        Select Indication
      </h2>

      <div className="flex flex-wrap gap-2">
        {PROTOCOLS.map((p) => {
          const isSelected = p.id === selected
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.id)}
              title={p.name}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : p.calculable
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200',
              ].join(' ')}
            >
              {p.shortName}
              {!p.calculable && (
                <span className={`ml-1 text-[10px] ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                  ACT
                </span>
              )}
            </button>
          )
        })}
      </div>

      <p className="text-[11px] text-slate-400">
        Protocols with <span className="font-semibold text-slate-500">ACT</span> label use ACT monitoring — dosing reference only, no aPTT adjustment.
      </p>
    </section>
  )
}
