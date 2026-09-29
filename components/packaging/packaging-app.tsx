'use client'

import { useMemo, useState } from 'react'
import { FOODS, type PriorityId, type ShelfLifeId, type StorageId } from '@/lib/packaging-data'
import { recommend } from '@/lib/recommend'
import { AnalysisStep } from './analysis-step'
import { AppHeader } from './app-header'
import { DetailsStep } from './details-step'
import { FoodStep } from './food-step'
import { HomeScreen } from './home-screen'
import { ResultsView } from './results-view'

type Screen = 'home' | 'food' | 'details' | 'analysis' | 'result'

const PROGRESS: Record<Screen, number | null> = {
  home: null,
  food: 0,
  details: 1,
  analysis: 2,
  result: 2,
}

export function PackagingApp() {
  const [screen, setScreen] = useState<Screen>('home')
  const [foodId, setFoodId] = useState<string | null>(null)
  const [storage, setStorage] = useState<StorageId>('ambient')
  const [shelfLife, setShelfLife] = useState<ShelfLifeId>('medium')
  const [priority, setPriority] = useState<PriorityId>('balanced')

  const food = FOODS.find((f) => f.id === foodId) ?? null

  const recommendation = useMemo(
    () => (food ? recommend({ food, storage, shelfLife, priority }) : null),
    [food, storage, shelfLife, priority],
  )

  const go = (next: Screen) => {
    setScreen(next)
    window.scrollTo({ top: 0 })
  }

  const selectFood = (id: string) => {
    const next = FOODS.find((f) => f.id === id)
    if (!next) return
    setFoodId(id)
    setStorage(next.defaultStorage)
    setShelfLife(next.defaultShelfLife)
  }

  const restart = () => {
    setFoodId(null)
    setPriority('balanced')
    go('home')
  }

  return (
    <div className="min-h-dvh">
      <AppHeader currentStep={PROGRESS[screen]} onHome={restart} />
      <main>
        {screen === 'home' ? <HomeScreen onStart={() => go('food')} /> : null}
        {screen === 'food' ? (
          <FoodStep selectedId={foodId} onSelect={selectFood} onBack={() => go('home')} onNext={() => go('details')} />
        ) : null}
        {screen === 'details' && food ? (
          <DetailsStep
            food={food}
            storage={storage}
            shelfLife={shelfLife}
            priority={priority}
            onStorage={setStorage}
            onShelfLife={setShelfLife}
            onPriority={setPriority}
            onBack={() => go('food')}
            onNext={() => go('analysis')}
          />
        ) : null}
        {screen === 'analysis' && food ? <AnalysisStep food={food} onDone={() => go('result')} /> : null}
        {screen === 'result' && recommendation ? (
          <ResultsView rec={recommendation} onBack={() => go('details')} onRestart={restart} />
        ) : null}
      </main>
    </div>
  )
}
