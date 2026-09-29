'use client'

import { useEffect, useEffectEvent, useState } from 'react'
import { Check, Loader } from 'lucide-react'
import type { Food } from '@/lib/packaging-data'
import { cn } from '@/lib/utils'

const TASKS = [
  'Reading food characteristics',
  'Checking oxygen & moisture sensitivity',
  'Working out required OTR & WVTR',
  'Matching suitable packaging materials',
]

const STEP_MS = 650

export function AnalysisStep({ food, onDone }: { food: Food; onDone: () => void }) {
  const [completed, setCompleted] = useState(0)
  const finish = useEffectEvent(onDone)

  useEffect(() => {
    const timers = TASKS.map((_, i) => setTimeout(() => setCompleted(i + 1), STEP_MS * (i + 1)))
    const done = setTimeout(() => finish(), STEP_MS * TASKS.length + 400)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(done)
    }
  }, [])

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-8 px-4 py-12 text-center">
      <div className="relative flex size-24 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/15 motion-reduce:animate-none" aria-hidden />
        <span className="relative flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Loader className="size-9 animate-spin motion-reduce:animate-none" aria-hidden />
        </span>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-balance md:text-3xl">
          {'Analysing food characteristics and packaging requirements…'}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Looking at <span className="font-semibold text-foreground">{food.name}</span> using the prototype dataset.
        </p>
      </div>
      <ol className="flex w-full flex-col gap-2 text-left" aria-live="polite">
        {TASKS.map((task, i) => {
          const done = i < completed
          const active = i === completed
          return (
            <li
              key={task}
              className={cn(
                'flex items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-opacity',
                !done && !active && 'opacity-50',
              )}
            >
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full border',
                  done && 'border-primary bg-primary text-primary-foreground',
                )}
              >
                {done ? (
                  <Check className="size-4" aria-hidden />
                ) : active ? (
                  <Loader className="size-4 animate-spin text-primary motion-reduce:animate-none" aria-hidden />
                ) : null}
              </span>
              <span className={cn('font-medium', done && 'text-foreground')}>{task}</span>
              <span className="sr-only">{done ? 'done' : active ? 'in progress' : 'waiting'}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
