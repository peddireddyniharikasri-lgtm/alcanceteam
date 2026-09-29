import {
  Apple,
  Carrot,
  Cookie,
  Croissant,
  CupSoda,
  Drumstick,
  Milk,
  Soup,
  Wheat,
  type LucideIcon,
} from 'lucide-react'
import type { CategoryId } from '@/lib/packaging-data'
import { cn } from '@/lib/utils'

export const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  fruits: Apple,
  vegetables: Carrot,
  grains: Wheat,
  dairy: Milk,
  bakery: Croissant,
  snacks: Cookie,
  meat: Drumstick,
  beverages: CupSoda,
  other: Soup,
}

export function RatingDots({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${label}: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn('size-2.5 rounded-full', i <= value ? 'bg-primary' : 'bg-border')}
        />
      ))}
    </div>
  )
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-accent/60 bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent-foreground',
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-accent-foreground/70" aria-hidden />
      Prototype demo data
    </span>
  )
}

export function SectionHeading({
  step,
  title,
  description,
  id,
}: {
  step: number
  title: string
  description?: string
  id: string
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
        {step}
      </span>
      <div>
        <h2 id={id} className="text-xl font-bold text-balance md:text-2xl">
          {title}
        </h2>
        {description ? <p className="mt-1 text-muted-foreground text-pretty">{description}</p> : null}
      </div>
    </div>
  )
}
