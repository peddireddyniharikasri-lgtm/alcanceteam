import { ArrowLeft, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SHELF_LIFE_OPTIONS, STORAGE_OPTIONS } from '@/lib/packaging-data'
import type { Recommendation } from '@/lib/recommend'
import { AlternativesSection } from './alternatives-section'
import { ComparisonTable } from './comparison-table'
import { DecisionFlow } from './decision-flow'
import { RecommendationHero } from './recommendation-hero'
import { TechnicalDetails } from './technical-details'

export function ResultsView({
  rec,
  onBack,
  onRestart,
}: {
  rec: Recommendation
  onBack: () => void
  onRestart: () => void
}) {
  const { food, storage, shelfLife } = rec.input
  const summary = [
    food.name,
    STORAGE_OPTIONS.find((s) => s.id === storage)!.label,
    SHELF_LIFE_OPTIONS.find((s) => s.id === shelfLife)!.label,
  ]

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-muted-foreground">Your recommendation for</p>
          <ul className="mt-2 flex flex-wrap gap-2" aria-label="Your choices">
            {summary.map((item) => (
              <li key={item} className="rounded-full border bg-card px-3 py-1 text-sm font-semibold">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <ResultActions onBack={onBack} onRestart={onRestart} />
      </div>

      <RecommendationHero rec={rec} />
      <DecisionFlow rec={rec} />
      <AlternativesSection alternatives={rec.alternatives} />
      <ComparisonTable items={[rec.best, ...rec.alternatives]} />
      <TechnicalDetails rec={rec} />

      <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-6 text-center">
        <p className="text-lg font-semibold">Want to try another food or storage condition?</p>
        <ResultActions onBack={onBack} onRestart={onRestart} />
      </div>
    </div>
  )
}

function ResultActions({ onBack, onRestart }: { onBack: () => void; onRestart: () => void }) {
  return (
    <div className="flex gap-3">
      <Button variant="outline" onClick={onBack} className="h-12 gap-2 rounded-xl px-5 text-base">
        <ArrowLeft className="size-5" aria-hidden />
        Change details
      </Button>
      <Button onClick={onRestart} className="h-12 gap-2 rounded-xl px-5 text-base font-semibold">
        <RotateCcw className="size-5" aria-hidden />
        Start Again
      </Button>
    </div>
  )
}
