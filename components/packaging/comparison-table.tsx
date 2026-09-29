import { Award } from 'lucide-react'
import { costLabel, toRating, type ScoredMaterial } from '@/lib/recommend'
import { cn } from '@/lib/utils'
import { RatingDots, SectionHeading } from './shared'

export function ComparisonTable({ items }: { items: ScoredMaterial[] }) {
  const rows: { label: string; render: (item: ScoredMaterial) => React.ReactNode }[] = [
    {
      label: 'Protection',
      render: (item) => <RatingDots value={toRating(item.protection)} label="Protection" />,
    },
    {
      label: 'Shelf-life suitability',
      render: (item) => <RatingDots value={toRating(item.shelfFit)} label="Shelf-life suitability" />,
    },
    {
      label: 'Sustainability',
      render: (item) => <RatingDots value={item.material.sustainability} label="Sustainability" />,
    },
    {
      label: 'Cost level',
      render: (item) => <span className="font-medium">{costLabel(item.material.cost)}</span>,
    },
    {
      label: 'Overall suitability',
      render: (item) => <span className="text-lg font-bold">{item.suitability}%</span>,
    },
  ]

  return (
    <section aria-labelledby="comparison-heading">
      <SectionHeading step={4} id="comparison-heading" title="Quick comparison" description="More dots means better." />
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">Comparison of recommended material and alternatives</caption>
          <thead>
            <tr>
              <th scope="col" className="w-44 p-4 text-sm font-semibold text-muted-foreground">
                Feature
              </th>
              {items.map((item, i) => (
                <th
                  key={item.material.id}
                  scope="col"
                  className={cn('p-4 align-bottom text-sm font-bold leading-snug', i === 0 && 'bg-secondary')}
                >
                  {i === 0 ? (
                    <span className="mb-1.5 flex w-fit items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                      <Award className="size-3" aria-hidden />
                      Recommended
                    </span>
                  ) : null}
                  {item.material.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t">
                <th scope="row" className="p-4 text-sm font-semibold">
                  {row.label}
                </th>
                {items.map((item, i) => (
                  <td key={item.material.id} className={cn('p-4', i === 0 && 'bg-secondary')}>
                    {row.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
