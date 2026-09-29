import Image from 'next/image'
import { ArrowRight, Leaf, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const HIGHLIGHTS = [
  { icon: Sparkles, title: 'No expertise needed', text: 'Answer three simple questions.' },
  { icon: ShieldCheck, title: 'Keeps food fresh', text: 'Matches protection to your food.' },
  { icon: Leaf, title: 'Greener choices', text: 'See eco-friendly alternatives.' },
]

export function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-10 md:grid-cols-2 md:px-6 md:py-16">
      <div className="flex flex-col gap-6">
        <span className="w-fit rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
          Smart India Hackathon · Prototype
        </span>
        <h1 className="text-3xl font-extrabold leading-tight text-balance md:text-5xl">
          AI-Based Intelligent Food Packaging Material Recommendation System
        </h1>
        <p className="text-lg text-muted-foreground text-pretty md:text-xl">
          Choose a food, tell us how it is stored, and get the best packaging material explained in simple words.
        </p>
        <div>
          <Button onClick={onStart} className="h-14 gap-2 rounded-xl px-7 text-lg font-semibold">
            Get Packaging Recommendation
            <ArrowRight className="size-5" aria-hidden />
          </Button>
        </div>
        <ul className="grid gap-3 pt-2 sm:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex flex-col gap-1 rounded-xl border bg-card p-4">
              <Icon className="size-5 text-primary" aria-hidden />
              <span className="font-semibold">{title}</span>
              <span className="text-sm text-muted-foreground">{text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative aspect-square overflow-hidden rounded-3xl border bg-muted md:aspect-[4/5]">
        <Image
          src="/images/hero-packaging.png"
          alt="Different food packaging materials including paper pouches, films, glass jars and cartons"
          fill
          priority
          sizes="(min-width: 768px) 480px, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  )
}
