'use client'

import {
  Droplets,
  Leaf,
  Refrigerator,
  Scale,
  ShieldCheck,
  Snowflake,
  Sun,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import {
  PRIORITY_OPTIONS,
  SHELF_LIFE_OPTIONS,
  STORAGE_OPTIONS,
  type Food,
  type PriorityId,
  type ShelfLifeId,
  type StorageId,
} from '@/lib/packaging-data'
import { cn } from '@/lib/utils'
import { StepFooter } from './food-step'
import { CATEGORY_ICONS } from './shared'

const STORAGE_ICONS: Record<StorageId, LucideIcon> = {
  ambient: Sun,
  humid: Droplets,
  refrigerated: Refrigerator,
  frozen: Snowflake,
}

const PRIORITY_ICONS: Record<PriorityId, LucideIcon> = {
  balanced: Scale,
  eco: Leaf,
  cost: Wallet,
  protection: ShieldCheck,
}

export function DetailsStep({
  food,
  storage,
  shelfLife,
  priority,
  onStorage,
  onShelfLife,
  onPriority,
  onBack,
  onNext,
}: {
  food: Food
  storage: StorageId
  shelfLife: ShelfLifeId
  priority: PriorityId
  onStorage: (v: StorageId) => void
  onShelfLife: (v: ShelfLifeId) => void
  onPriority: (v: PriorityId) => void
  onBack: () => void
  onNext: () => void
}) {
  const FoodIcon = CATEGORY_ICONS[food.category]

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center gap-4 rounded-2xl border bg-card p-4">
        <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
          <FoodIcon className="size-6" aria-hidden />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">Selected food</p>
          <p className="text-xl font-bold">{food.name}</p>
        </div>
      </div>

      <OptionGroup
        title="How will it be stored?"
        name="storage"
        value={storage}
        onChange={onStorage}
        suggested={food.defaultStorage}
        options={STORAGE_OPTIONS.map((o) => ({ ...o, icon: STORAGE_ICONS[o.id] }))}
        columns="sm:grid-cols-2"
      />

      <OptionGroup
        title="How long should it stay fresh?"
        name="shelf-life"
        value={shelfLife}
        onChange={onShelfLife}
        suggested={food.defaultShelfLife}
        options={SHELF_LIFE_OPTIONS}
        columns="grid-cols-2 lg:grid-cols-4"
      />

      <OptionGroup
        title="What matters most to you?"
        subtitle="Optional — we pick a balanced option by default."
        name="priority"
        value={priority}
        onChange={onPriority}
        options={PRIORITY_OPTIONS.map((o) => ({ ...o, icon: PRIORITY_ICONS[o.id] }))}
        columns="sm:grid-cols-2"
      />

      <StepFooter onBack={onBack} onNext={onNext} nextLabel="Get Recommendation" />
    </div>
  )
}

function OptionGroup<T extends string>({
  title,
  subtitle,
  name,
  value,
  onChange,
  options,
  suggested,
  columns,
}: {
  title: string
  subtitle?: string
  name: string
  value: T
  onChange: (v: T) => void
  options: { id: T; label: string; hint: string; icon?: LucideIcon }[]
  suggested?: T
  columns: string
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3">
        <span className="block text-xl font-bold md:text-2xl">{title}</span>
        {subtitle ? <span className="mt-1 block text-muted-foreground">{subtitle}</span> : null}
      </legend>
      <div className={cn('grid gap-3', columns)}>
        {options.map((option) => {
          const checked = option.id === value
          const Icon = option.icon
          return (
            <label
              key={option.id}
              className={cn(
                'relative flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/50 has-focus-visible:ring-3 has-focus-visible:ring-ring/40',
                checked && 'border-primary bg-secondary ring-2 ring-primary/25',
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={checked}
                onChange={() => onChange(option.id)}
                className="sr-only"
              />
              {Icon ? (
                <span
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary',
                    checked && 'bg-primary text-primary-foreground',
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
              ) : null}
              <span className="min-w-0">
                <span className="block font-semibold">{option.label}</span>
                <span className="block text-sm text-muted-foreground">{option.hint}</span>
                {suggested === option.id ? (
                  <span className="mt-2 inline-block rounded-full bg-accent/30 px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                    Typical for this food
                  </span>
                ) : null}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
