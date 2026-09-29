import { Check, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = ['Choose food', 'Basic details', 'Recommendation']

export function AppHeader({
  currentStep,
  onHome,
}: {
  currentStep: number | null
  onHome: () => void
}) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={onHome}
          className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="size-5" aria-hidden />
          </span>
          <span className="text-left leading-tight">
            <span className="block font-bold">PackSmart AI</span>
            <span className="block text-xs text-muted-foreground">SIH Prototype</span>
          </span>
        </button>

        {currentStep !== null ? (
          <nav aria-label="Progress">
            <ol className="flex items-center gap-1.5 md:gap-3">
              {STEPS.map((label, index) => {
                const done = index < currentStep
                const active = index === currentStep
                return (
                  <li key={label} className="flex items-center gap-1.5 md:gap-3">
                    <span
                      aria-current={active ? 'step' : undefined}
                      className={cn(
                        'flex items-center gap-2 text-sm font-medium',
                        active ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      <span
                        className={cn(
                          'flex size-7 items-center justify-center rounded-full border text-xs font-bold',
                          done && 'border-primary bg-primary text-primary-foreground',
                          active && 'border-primary text-primary',
                        )}
                      >
                        {done ? <Check className="size-3.5" aria-hidden /> : index + 1}
                      </span>
                      <span className="sr-only md:not-sr-only">{label}</span>
                    </span>
                    {index < STEPS.length - 1 ? (
                      <span className="h-px w-4 bg-border md:w-8" aria-hidden />
                    ) : null}
                  </li>
                )
              })}
            </ol>
          </nav>
        ) : null}
      </div>
    </header>
  )
}
