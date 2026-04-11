export default function GuidelinePanel() {
  return (
    <aside className="space-y-4">
      {/* Protocol Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-3">
          Protocol Overview
        </h2>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex justify-between">
            <span className="text-slate-500">Initial Bolus</span>
            <span className="font-medium">80 IU/kg IV push</span>
          </li>
          <li className="flex justify-between">
            <span className="text-slate-500">Initial Infusion</span>
            <span className="font-medium">18 IU/kg/hr</span>
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
            <span className="font-medium text-blue-700">60–100 sec</span>
          </li>
          <li className="flex justify-between">
            <span className="text-slate-500">Recheck aPTT</span>
            <span className="font-medium">6 hr after change</span>
          </li>
        </ul>
      </div>

      {/* aPTT Adjustment Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-3">
          aPTT Adjustment Table
        </h2>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500">
              <th className="text-left py-2 px-2 border border-slate-200 font-semibold">aPTT (sec)</th>
              <th className="text-left py-2 px-2 border border-slate-200 font-semibold">Bolus</th>
              <th className="text-left py-2 px-2 border border-slate-200 font-semibold">Rate Δ</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-red-50">
              <td className="py-2 px-2 border border-slate-200 font-medium text-red-700">&lt; 40</td>
              <td className="py-2 px-2 border border-slate-200">80 IU/kg</td>
              <td className="py-2 px-2 border border-slate-200 text-green-700 font-medium">+4 IU/kg/hr</td>
            </tr>
            <tr className="bg-orange-50">
              <td className="py-2 px-2 border border-slate-200 font-medium text-orange-700">40–59</td>
              <td className="py-2 px-2 border border-slate-200">40 IU/kg</td>
              <td className="py-2 px-2 border border-slate-200 text-green-700 font-medium">+2 IU/kg/hr</td>
            </tr>
            <tr className="bg-green-50">
              <td className="py-2 px-2 border border-slate-200 font-medium text-green-700">60–100</td>
              <td className="py-2 px-2 border border-slate-200 text-slate-400">—</td>
              <td className="py-2 px-2 border border-slate-200 text-slate-500">No change</td>
            </tr>
            <tr className="bg-orange-50">
              <td className="py-2 px-2 border border-slate-200 font-medium text-orange-700">101–120</td>
              <td className="py-2 px-2 border border-slate-200 text-slate-400">—</td>
              <td className="py-2 px-2 border border-slate-200 text-red-700 font-medium">−2 IU/kg/hr</td>
            </tr>
            <tr className="bg-red-50">
              <td className="py-2 px-2 border border-slate-200 font-medium text-red-700">&gt; 120</td>
              <td className="py-2 px-2 border border-slate-200 text-slate-400">—</td>
              <td className="py-2 px-2 border border-slate-200 text-red-700 font-medium">Hold 1 hr,<br />−4 IU/kg/hr</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* How to Use */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-3">
          How to Use
        </h2>
        <ol className="space-y-2 text-sm text-slate-600 list-none">
          {[
            'Enter the patient\'s weight in kg.',
            'Click "Calculate Initial Dose" to get the bolus and starting infusion rate.',
            'Administer bolus and start infusion. Recheck aPTT in 6 hours.',
            'Enter the aPTT result and click "Adjust Dose" to get the updated rate.',
            'Repeat from step 4 each time a new aPTT is drawn.',
          ].map((step, i) => (
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
          <li>• For aPTT &gt;120 sec, hold infusion for exactly 1 hour before resuming at the new rate.</li>
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

const REFERENCES = [
  {
    n: 1,
    title: 'Evidence-based management of anticoagulant therapy: antithrombotic therapy and prevention of thrombosis, 9th ed: American College of Chest Physicians evidence-based clinical practice guidelines',
    source: 'Chest',
    year: 2012,
    url: 'https://pubmed.ncbi.nlm.nih.gov/22315259/',
  },
  {
    n: 2,
    title: 'Cancer-associated venous thromboembolic disease, version 2.2024, NCCN clinical practice guidelines in oncology',
    source: 'Journal of the National Comprehensive Cancer Network',
    year: 2024,
    url: 'https://pubmed.ncbi.nlm.nih.gov/39236759/',
  },
  {
    n: 3,
    title: 'Unfractionated Heparin Dosing and Monitoring Protocol for Therapeutic Anticoagulation',
    source: 'Praxis Medical Insights: Practical Summaries of Clinical Guidelines',
    year: 2025,
    url: 'https://droracle.ai/guidelines/118395cd-319a-4f9b-a33d-e920aa3dd61c',
  },
  {
    n: 4,
    title: 'Heparin Protocol for Therapeutic Anticoagulation',
    source: 'Praxis Medical Insights: Practical Summaries of Clinical Guidelines',
    year: 2025,
    url: 'https://droracle.ai/guidelines/8ef9170b-4910-4ed9-9503-4fc218f95443',
  },
  {
    n: 5,
    title: 'Official FDA Drug Label for Heparin (IV)',
    source: 'FDA / DailyMed',
    year: 2025,
    url: 'https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=239b4816-6a55-451b-bf40-e611be07d12f',
  },
  {
    n: 6,
    title: 'Comparison of 2 weight-based heparin dosing nomograms in neurology and vascular surgical patients',
    source: 'Therapeutic Drug Monitoring',
    year: 2015,
    url: 'https://pubmed.ncbi.nlm.nih.gov/24831654/',
  },
  {
    n: 7,
    title: 'ESC guidelines for the management of acute myocardial infarction in patients presenting with ST-segment elevation',
    source: 'European Heart Journal',
    year: 2012,
    url: 'https://pubmed.ncbi.nlm.nih.gov/22922416/',
  },
  {
    n: 8,
    title: 'Unfractionated heparin dosing for venous thromboembolism in morbidly obese patients: case report and review of the literature',
    source: 'Pharmacotherapy',
    year: 2010,
    url: 'https://pubmed.ncbi.nlm.nih.gov/20180615/',
  },
  {
    n: 9,
    title: 'Use of a modified dosing weight for heparin therapy in a morbidly obese patient',
    source: 'The Annals of Pharmacotherapy',
    year: 2005,
    url: 'https://pubmed.ncbi.nlm.nih.gov/15741422/',
  },
  {
    n: 10,
    title: 'Heparin kinetics in venous thrombosis and pulmonary embolism',
    source: 'Circulation',
    year: 1976,
    url: 'https://pubmed.ncbi.nlm.nih.gov/1253392/',
  },
  {
    n: 11,
    title: 'Part 9: Acute coronary syndromes: 2015 American Heart Association guidelines update for cardiopulmonary resuscitation and emergency cardiovascular care',
    source: 'Circulation',
    year: 2015,
    url: 'https://pubmed.ncbi.nlm.nih.gov/26472997/',
  },
]
