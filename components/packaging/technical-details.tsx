import { ChevronDown, FlaskConical } from 'lucide-react'
import type { Recommendation } from '@/lib/recommend'
import { cn } from '@/lib/utils'
import { DemoBadge } from './shared'

function formatBarrier(value: number) {
  if (value === 0) return '≈ 0'
  if (value < 0.1) return `< 0.1`
  return value.toLocaleString('en-IN')
}

export function TechnicalDetails({ rec }: { rec: Recommendation }) {
  const req = rec.requirements
  const { food } = rec.input
  const best = rec.best.material

  const params = [
    {
      label: req.otrMode === 'min' ? 'Minimum OTR needed (breathability)' : 'Maximum OTR allowed',
      value: `${req.otrMode === 'min' ? '≥' : '≤'} ${formatBarrier(req.otr)} cc/m²/day`,
    },
    { label: 'Maximum WVTR allowed', value: `≤ ${formatBarrier(req.wvtr)} g/m²/day` },
    { label: 'Barrier requirement', value: req.barrierClass },
    { label: `Recommended material OTR`, value: `${formatBarrier(best.otr)} cc/m²/day` },
    { label: `Recommended material WVTR`, value: `${formatBarrier(best.wvtr)} g/m²/day` },
    { label: 'Typical thickness / structure', value: best.thickness },
    { label: 'Oxygen sensitivity', value: food.respiring && req.otrMode === 'min' ? `Respiration rate: ${req.oxygenLabel}` : req.oxygenLabel },
    { label: 'Moisture sensitivity', value: `${req.moistureLabel} (${food.moistureRisk === 'gain' ? 'absorbs moisture' : 'loses moisture'})` },
    { label: 'Water activity (aw)', value: food.waterActivity.toFixed(2) },
    { label: 'Storage condition', value: `${req.storageTempC} °C, ${req.storageRh}% RH` },
    { label: 'Material temperature range', value: `${best.tempMin} °C to ${best.tempMax} °C` },
    { label: 'Light sensitive', value: food.lightSensitive ? `Yes — ${best.opaque ? 'material is opaque' : 'use printed/opaque outer pack'}` : 'No' },
  ]

  return (
    <section aria-labelledby="technical-heading">
      <details className="group rounded-2xl border bg-card">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/40 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-primary">
              <FlaskConical className="size-5" aria-hidden />
            </span>
            <span>
              <span id="technical-heading" className="block text-lg font-bold">
                Technical Details
              </span>
              <span className="block text-sm text-muted-foreground">OTR, WVTR and barrier data — for experts</span>
            </span>
          </span>
          <ChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
        </summary>

        <div className="flex flex-col gap-6 border-t p-5">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <DemoBadge />
            <span>OTR at 23 °C / 0% RH, WVTR at 38 °C / 90% RH. Indicative values, not certified test results.</span>
          </div>

          <dl className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
            {params.map((p) => (
              <div key={p.label} className="flex flex-col gap-0.5 bg-card p-3.5">
                <dt className="text-xs font-medium text-muted-foreground">{p.label}</dt>
                <dd className="font-semibold">{p.value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <h3 className="mb-3 font-bold">All materials evaluated</h3>
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th scope="col" className="p-3 font-semibold">Material</th>
                    <th scope="col" className="p-3 font-semibold">OTR</th>
                    <th scope="col" className="p-3 font-semibold">WVTR</th>
                    <th scope="col" className="p-3 font-semibold">Oxygen fit</th>
                    <th scope="col" className="p-3 font-semibold">Moisture fit</th>
                    <th scope="col" className="p-3 font-semibold">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {rec.ranked.map((item, i) => (
                    <tr key={item.material.id} className={cn('border-t', i === 0 && 'bg-secondary font-semibold')}>
                      <td className="p-3">{item.material.name}</td>
                      <td className="p-3 tabular-nums">{formatBarrier(item.material.otr)}</td>
                      <td className="p-3 tabular-nums">{formatBarrier(item.material.wvtr)}</td>
                      <td className="p-3 tabular-nums">{Math.round(item.oxygenFit * 100)}%</td>
                      <td className="p-3 tabular-nums">{Math.round(item.moistureFit * 100)}%</td>
                      <td className="p-3 tabular-nums">{item.suitability}%</td>
                    </tr>
                  ))}
                  {rec.excluded.map(({ material, reason }) => (
                    <tr key={material.id} className="border-t text-muted-foreground">
                      <td className="p-3">{material.name}</td>
                      <td className="p-3" colSpan={5}>
                        Ruled out: {reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </details>
    </section>
  )
}
