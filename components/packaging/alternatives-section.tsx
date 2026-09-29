import { CircleCheck, Lightbulb, TriangleAlert } from 'lucide-react'
import type { ScoredMaterial } from '@/lib/recommend'
import { SectionHeading } from './shared'

export function AlternativesSection({ alternatives }: { alternatives: ScoredMaterial[] }) {
  return (
    <section aria-labelledby="alternatives-heading">
      <SectionHeading
        step={3}
        id="alternatives-heading"
        title="Other good options"
        description="Also suitable, with different strengths."
      />
      <ul className="grid gap-4 md:grid-cols-3">
        {alternatives.map(({ material, suitability }, i) => (
          <li key={material.id} className="flex flex-col gap-4 rounded-2xl border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Option {i + 2}</p>
                <h3 className="mt-1 text-lg font-bold leading-snug">{material.name}</h3>
              </div>
              <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-sm font-bold text-secondary-foreground">
                {suitability}%
              </span>
            </div>
            <dl className="flex flex-col gap-3 text-sm">
              <Row icon={<CircleCheck className="size-4 text-primary" aria-hidden />} term="Main advantage" detail={material.advantage} />
              <Row icon={<TriangleAlert className="size-4 text-accent-foreground" aria-hidden />} term="Limitation" detail={material.limitation} />
              <Row icon={<Lightbulb className="size-4 text-chart-3" aria-hidden />} term="Best used for" detail={material.useCase} />
            </dl>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Row({ icon, term, detail }: { icon: React.ReactNode; term: string; detail: string }) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5">{icon}</span>
      <div>
        <dt className="font-semibold">{term}</dt>
        <dd className="text-muted-foreground">{detail}</dd>
      </div>
    </div>
  )
}
