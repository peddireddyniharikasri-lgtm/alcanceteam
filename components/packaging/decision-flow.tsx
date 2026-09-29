import { ChevronRight, FlaskConical, Package, ScanSearch, Target } from 'lucide-react'
import { STORAGE_OPTIONS } from '@/lib/packaging-data'
import type { Recommendation } from '@/lib/recommend'
import { SectionHeading } from './shared'

export function DecisionFlow({ rec }: { rec: Recommendation }) {
  const { food, storage } = rec.input
  const req = rec.requirements
  const storageLabel = STORAGE_OPTIONS.find((s) => s.id === storage)!.label

  const stages = [
    {
      icon: ScanSearch,
      title: 'Food characteristics',
      lines: [
        food.respiring && req.otrMode === 'min' ? 'Fresh produce that breathes' : `Air sensitivity: ${req.oxygenLabel.toLowerCase()}`,
        `Moisture sensitivity: ${req.moistureLabel.toLowerCase()}`,
        food.fatty ? 'Contains fats / oils' : 'Low fat content',
      ],
    },
    {
      icon: Target,
      title: 'Packaging needs',
      lines: [
        req.otrMode === 'min' ? 'Must let air in and out' : 'Must keep air out',
        food.moistureRisk === 'gain' ? 'Keep humidity out' : 'Keep moisture in',
        storageLabel,
      ],
    },
    {
      icon: FlaskConical,
      title: 'Technical analysis',
      lines: [req.barrierClass, `${rec.ranked.length} materials compared`, `${rec.excluded.length} ruled out`],
    },
    {
      icon: Package,
      title: 'Recommendation',
      lines: [rec.best.material.name, `${rec.best.suitability}% match`],
    },
  ]

  return (
    <section aria-labelledby="flow-heading">
      <SectionHeading
        step={2}
        id="flow-heading"
        title="How the system decided"
        description="The technical work is done for you in the background."
      />
      <ol className="grid gap-3 md:grid-cols-4">
        {stages.map(({ icon: Icon, title, lines }, index) => (
          <li key={title} className="relative flex flex-col gap-2 rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="font-bold leading-tight">{title}</h3>
            </div>
            <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
              {lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            {index < stages.length - 1 ? (
              <ChevronRight
                className="absolute top-1/2 -right-3 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-background text-primary md:block"
                aria-hidden
              />
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  )
}
