import { Award, CircleCheck, Leaf, ShieldCheck, Wallet } from 'lucide-react'
import { buildExplanation, costLabel, toRating, type Recommendation } from '@/lib/recommend'
import { DemoBadge, SectionHeading } from './shared'

export function RecommendationHero({ rec }: { rec: Recommendation }) {
  const { material, protection, suitability } = rec.best
  const explanation = buildExplanation(rec)

  const quickFacts = [
    { icon: ShieldCheck, label: 'Protection', value: `${toRating(protection)}/5` },
    { icon: Leaf, label: 'Eco rating', value: `${material.sustainability}/5` },
    { icon: Wallet, label: 'Cost', value: costLabel(material.cost) },
  ]

  return (
    <>
      <section aria-labelledby="recommended-heading" className="overflow-hidden rounded-3xl border-2 border-primary bg-card">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                <Award className="size-4" aria-hidden />
                Recommended Packaging Material
              </span>
              <DemoBadge />
            </div>
            <h2 id="recommended-heading" className="text-3xl font-extrabold text-balance md:text-4xl">
              {material.name}
            </h2>
            <p className="text-lg text-muted-foreground">{material.type}</p>
          </div>

          <div className="flex shrink-0 items-center gap-4 rounded-2xl bg-secondary p-5">
            <div
              className="relative flex size-20 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(var(--primary) ${suitability * 3.6}deg, var(--border) 0deg)`,
              }}
              role="img"
              aria-label={`${suitability}% overall suitability`}
            >
              <span className="flex size-15 items-center justify-center rounded-full bg-secondary text-xl font-extrabold text-secondary-foreground">
                {suitability}%
              </span>
            </div>
            <div className="leading-tight">
              <p className="font-bold text-secondary-foreground">Overall match</p>
              <p className="text-sm text-muted-foreground">for your food</p>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-3 border-t bg-muted/50">
          {quickFacts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1 border-r p-4 text-center last:border-r-0">
              <Icon className="size-5 text-primary" aria-hidden />
              <dt className="text-xs text-muted-foreground md:text-sm">{label}</dt>
              <dd className="font-bold md:text-lg">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="why-heading">
        <SectionHeading step={1} id="why-heading" title="Why this material?" />
        <ul className="grid gap-3">
          {explanation.map((point) => (
            <li key={point} className="flex gap-3 rounded-xl border bg-card p-4 text-base md:text-lg">
              <CircleCheck className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden />
              <span className="text-pretty">{point}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
