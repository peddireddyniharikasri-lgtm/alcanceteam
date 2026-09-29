'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CATEGORIES, FOODS, type CategoryId } from '@/lib/packaging-data'
import { cn } from '@/lib/utils'
import { CATEGORY_ICONS } from './shared'

export function FoodStep({
  selectedId,
  onSelect,
  onBack,
  onNext,
}: {
  selectedId: string | null
  onSelect: (id: string) => void
  onBack: () => void
  onNext: () => void
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryId | 'all'>('all')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FOODS.filter((food) => {
      if (category !== 'all' && food.category !== category) return false
      if (!q) return true
      return (
        food.name.toLowerCase().includes(q) ||
        food.keywords?.some((k) => k.includes(q)) ||
        CATEGORIES.find((c) => c.id === food.category)!.label.toLowerCase().includes(q)
      )
    })
  }, [query, category])

  const selected = FOODS.find((f) => f.id === selectedId)

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:px-6 md:py-12">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Which food do you want to pack?</h1>
        <p className="mt-2 text-lg text-muted-foreground">Search or tap a food from the list.</p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <label htmlFor="food-search" className="sr-only">
          Search food
        </label>
        <input
          id="food-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search e.g. mango, paneer, atta, chips…"
          autoComplete="off"
          className="h-14 w-full rounded-xl border bg-card pr-4 pl-12 text-lg outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
        />
      </div>

      <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <div className="flex w-max gap-2 md:w-auto md:flex-wrap" role="group" aria-label="Filter by category">
          <CategoryChip active={category === 'all'} onClick={() => setCategory('all')} label="All foods" />
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c.id]
            return (
              <CategoryChip
                key={c.id}
                active={category === c.id}
                onClick={() => setCategory(c.id)}
                label={c.label}
                icon={<Icon className="size-4" aria-hidden />}
              />
            )
          })}
        </div>
      </div>

      {results.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
          {'No food found. Try a different word or choose "All foods".'}
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-label="Foods">
          {results.map((food) => {
            const Icon = CATEGORY_ICONS[food.category]
            const isSelected = food.id === selectedId
            return (
              <li key={food.id}>
                <button
                  type="button"
                  onClick={() => onSelect(food.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    'relative flex h-full w-full items-center gap-3 rounded-xl border bg-card p-3.5 text-left transition-colors outline-none hover:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/40',
                    isSelected && 'border-primary bg-secondary ring-2 ring-primary/30',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary',
                      isSelected && 'bg-primary text-primary-foreground',
                    )}
                  >
                    {isSelected ? <Check className="size-5" aria-hidden /> : <Icon className="size-5" aria-hidden />}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold leading-snug">{food.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {CATEGORIES.find((c) => c.id === food.category)!.label}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <StepFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!selected}
        nextLabel="Next"
        status={selected ? `Selected: ${selected.name}` : 'Please select a food to continue'}
      />
    </div>
  )
}

function CategoryChip({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean
  onClick: () => void
  label: string
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex h-10 items-center gap-1.5 rounded-full border bg-card px-4 text-sm font-medium whitespace-nowrap outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40',
        active && 'border-primary bg-primary text-primary-foreground hover:bg-primary',
      )}
    >
      {icon}
      {label}
    </button>
  )
}

export function StepFooter({
  onBack,
  onNext,
  nextDisabled,
  nextLabel,
  status,
}: {
  onBack: () => void
  onNext: () => void
  nextDisabled?: boolean
  nextLabel: string
  status?: string
}) {
  return (
    <div className="sticky bottom-0 -mx-4 mt-2 border-t bg-background/95 px-4 py-4 backdrop-blur md:static md:mx-0 md:rounded-xl md:border md:bg-card md:px-5">
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" onClick={onBack} className="h-12 gap-2 rounded-xl px-5 text-base">
          <ArrowLeft className="size-5" aria-hidden />
          Back
        </Button>
        {status ? (
          <p className="hidden text-sm text-muted-foreground sm:block" aria-live="polite">
            {status}
          </p>
        ) : null}
        <Button onClick={onNext} disabled={nextDisabled} className="h-12 gap-2 rounded-xl px-6 text-base font-semibold">
          {nextLabel}
          <ArrowRight className="size-5" aria-hidden />
        </Button>
      </div>
    </div>
  )
}
