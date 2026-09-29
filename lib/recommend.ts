import {
  MATERIALS,
  SHELF_LIFE_OPTIONS,
  STORAGE_OPTIONS,
  type Food,
  type Level,
  type Material,
  type PriorityId,
  type ShelfLifeId,
  type StorageId,
} from './packaging-data'

export interface RecommendationInput {
  food: Food
  storage: StorageId
  shelfLife: ShelfLifeId
  priority: PriorityId
}

export interface Requirements {
  /** Max OTR allowed (non-respiring) or min OTR needed (respiring produce). */
  otr: number
  otrMode: 'max' | 'min'
  wvtr: number
  barrierClass: string
  oxygenLabel: string
  moistureLabel: string
  storageTempC: number
  storageRh: number
  shelfLifeIndex: 1 | 2 | 3 | 4
}

export interface ScoredMaterial {
  material: Material
  oxygenFit: number
  moistureFit: number
  protection: number
  shelfFit: number
  score: number
  suitability: number
}

export interface Recommendation {
  input: RecommendationInput
  requirements: Requirements
  best: ScoredMaterial
  alternatives: ScoredMaterial[]
  ranked: ScoredMaterial[]
  excluded: { material: Material; reason: string }[]
}

const OTR_BY_LEVEL: Record<Level, number> = { 1: 5000, 2: 1000, 3: 100, 4: 10, 5: 1 }
const WVTR_BY_LEVEL: Record<Level, number> = { 1: 50, 2: 20, 3: 8, 4: 3, 5: 2 }
const MIN_OTR_RESPIRING: Record<Level, number> = { 1: 1000, 2: 2000, 3: 3000, 4: 5000, 5: 8000 }

const SHELF_FACTOR: Record<ShelfLifeId, number> = { short: 4, medium: 1, long: 0.25, extended: 0.1 }
const STORAGE_OTR_FACTOR: Record<StorageId, number> = { ambient: 1, humid: 0.7, refrigerated: 3, frozen: 20 }
const STORAGE_WVTR_FACTOR: Record<StorageId, number> = { ambient: 1, humid: 0.5, refrigerated: 2, frozen: 4 }

const WEIGHTS: Record<PriorityId, { protection: number; shelf: number; eco: number; cost: number }> = {
  balanced: { protection: 0.6, shelf: 0.15, eco: 0.1, cost: 0.15 },
  eco: { protection: 0.45, shelf: 0.1, eco: 0.35, cost: 0.1 },
  cost: { protection: 0.45, shelf: 0.1, eco: 0.1, cost: 0.35 },
  protection: { protection: 0.7, shelf: 0.15, eco: 0.075, cost: 0.075 },
}

const SENSITIVITY_LABEL: Record<Level, string> = {
  1: 'Very low',
  2: 'Low',
  3: 'Moderate',
  4: 'High',
  5: 'Very high',
}

function round(value: number) {
  if (value >= 100) return Math.round(value)
  if (value >= 10) return Math.round(value * 10) / 10
  return Math.round(value * 100) / 100
}

export function barrierClassFor(otr: number, mode: 'max' | 'min') {
  if (mode === 'min') return 'Breathable (controlled gas exchange)'
  if (otr < 1) return 'Very high barrier'
  if (otr < 10) return 'High barrier'
  if (otr < 100) return 'Medium-high barrier'
  if (otr < 1000) return 'Medium barrier'
  return 'Low barrier'
}

export function computeRequirements(input: RecommendationInput): Requirements {
  const { food, storage, shelfLife } = input
  const storageInfo = STORAGE_OPTIONS.find((s) => s.id === storage)!
  const shelf = SHELF_LIFE_OPTIONS.find((s) => s.id === shelfLife)!

  let otr: number
  let otrMode: 'max' | 'min'
  if (food.respiring && storage !== 'frozen') {
    otrMode = 'min'
    const coldFactor = storage === 'refrigerated' ? 0.5 : storage === 'humid' ? 1.3 : 1
    otr = MIN_OTR_RESPIRING[food.oxygen] * coldFactor
  } else {
    otrMode = 'max'
    otr = OTR_BY_LEVEL[food.oxygen] * SHELF_FACTOR[shelfLife] * STORAGE_OTR_FACTOR[storage]
  }

  const wvtr = WVTR_BY_LEVEL[food.moisture] * SHELF_FACTOR[shelfLife] * STORAGE_WVTR_FACTOR[storage]

  return {
    otr: round(otr),
    otrMode,
    wvtr: round(wvtr),
    barrierClass: barrierClassFor(otr, otrMode),
    oxygenLabel: SENSITIVITY_LABEL[food.oxygen],
    moistureLabel: SENSITIVITY_LABEL[food.moisture],
    storageTempC: storageInfo.tempC,
    storageRh: storageInfo.rh,
    shelfLifeIndex: shelf.index,
  }
}

/** 1 when actual <= limit; drops to 0 once actual is 100× over the limit. */
function maxFit(actual: number, limit: number) {
  if (actual <= limit) return 1
  return Math.max(0, 1 - Math.log10(actual / limit) / 2)
}

/** 1 when actual >= min; drops to 0 once actual is 100× under the minimum. */
function minFit(actual: number, min: number) {
  if (actual >= min) return 1
  return Math.max(0, 1 - Math.log10(min / Math.max(actual, 0.01)) / 2)
}

function overBarrierPenalty(actual: number, limit: number) {
  const overshoot = Math.log10(limit / Math.max(actual, 0.01))
  return overshoot > 2.5 ? Math.min(0.15, 0.05 * (overshoot - 2.5)) : 0
}

function excludeReason(material: Material, input: RecommendationInput): string | null {
  const storageInfo = STORAGE_OPTIONS.find((s) => s.id === input.storage)!
  if (!material.forms.includes(input.food.form)) {
    return `Not designed for ${input.food.form} foods`
  }
  if (storageInfo.tempC < material.tempMin || storageInfo.tempC > material.tempMax) {
    return `Not suitable at ${storageInfo.tempC} °C storage`
  }
  return null
}

function scoreMaterial(material: Material, input: RecommendationInput, req: Requirements): ScoredMaterial {
  const { food, priority } = input
  const weights = WEIGHTS[priority]

  let oxygenFit: number
  let moistureFit: number
  let penalty = 0

  if (req.otrMode === 'min') {
    oxygenFit = minFit(material.otr, req.otr)
    moistureFit = maxFit(material.wvtr, req.wvtr)
    // Very tight moisture barriers trap condensation around fresh produce.
    if (material.wvtr < 1) moistureFit = Math.min(moistureFit, 0.3)
  } else {
    oxygenFit = maxFit(material.otr, req.otr)
    moistureFit = maxFit(material.wvtr, req.wvtr)
    penalty += overBarrierPenalty(material.otr, req.otr) + overBarrierPenalty(material.wvtr, req.wvtr) / 2
  }

  const protection = (food.oxygen * oxygenFit + food.moisture * moistureFit) / (food.oxygen + food.moisture)
  const shelfGap = req.shelfLifeIndex - material.maxShelf
  const shelfFit = shelfGap <= 0 ? 1 : Math.pow(0.5, shelfGap)
  const ecoScore = material.sustainability / 5
  const costScore = (6 - material.cost) / 5

  let score =
    weights.protection * protection +
    weights.shelf * shelfFit +
    weights.eco * ecoScore +
    weights.cost * costScore

  if (material.bestFor.includes(food.category)) score += 0.1
  if (food.lightSensitive && material.opaque) score += 0.05
  if (food.fatty && !material.greaseResistant) score -= 0.15
  if (protection < 0.5) score *= 0.6
  score -= penalty

  return {
    material,
    oxygenFit,
    moistureFit,
    protection,
    shelfFit,
    score,
    suitability: Math.max(5, Math.min(98, Math.round((score / 1.1) * 100))),
  }
}

export function recommend(input: RecommendationInput): Recommendation {
  const requirements = computeRequirements(input)
  const excluded: Recommendation['excluded'] = []
  const scored: ScoredMaterial[] = []

  for (const material of MATERIALS) {
    const reason = excludeReason(material, input)
    if (reason) excluded.push({ material, reason })
    else scored.push(scoreMaterial(material, input, requirements))
  }

  const ranked = scored.sort((a, b) => b.score - a.score)
  return {
    input,
    requirements,
    best: ranked[0],
    alternatives: ranked.slice(1, 4),
    ranked,
    excluded,
  }
}

export function toRating(value: number): 1 | 2 | 3 | 4 | 5 {
  return Math.max(1, Math.min(5, Math.round(value * 5))) as 1 | 2 | 3 | 4 | 5
}

export function costLabel(cost: Level) {
  return cost <= 1 ? 'Very low' : cost === 2 ? 'Low' : cost === 3 ? 'Medium' : 'High'
}

export function buildExplanation(rec: Recommendation): string[] {
  const { food, storage, shelfLife } = rec.input
  const { material, oxygenFit, moistureFit } = rec.best
  const storageLabel = STORAGE_OPTIONS.find((s) => s.id === storage)!.label.toLowerCase()
  const shelfLabel = SHELF_LIFE_OPTIONS.find((s) => s.id === shelfLife)!
  const name = food.name.toLowerCase()
  const points: string[] = []

  if (rec.requirements.otrMode === 'min') {
    points.push(
      `${food.name} keeps "breathing" after harvest. This material lets just enough air pass through to stop it from rotting or developing bad smells.`,
    )
  } else if (food.oxygen >= 4) {
    points.push(
      oxygenFit >= 0.9
        ? `${food.name} spoils quickly when it meets air${food.fatty ? ' (fats turn rancid)' : ''}. This material blocks oxygen very effectively.`
        : `${food.name} is sensitive to air. This material slows oxygen down enough for your chosen shelf-life.`,
    )
  } else {
    points.push(`${food.name} needs only moderate protection from air, and this material provides it without over-packaging.`)
  }

  if (food.moistureRisk === 'gain' && food.moisture >= 3) {
    points.push(
      moistureFit >= 0.9
        ? `It keeps humidity out, so the ${name} stays dry and crisp instead of turning soft or lumpy.`
        : `It reduces humidity getting in, helping the ${name} stay dry.`,
    )
  } else if (food.moistureRisk === 'loss') {
    points.push(`It holds moisture in, so the ${name} does not dry out, shrink or lose weight.`)
  } else {
    points.push(`It gives enough moisture protection for ${name}.`)
  }

  points.push(
    `Works well for ${storageLabel} storage and supports a shelf-life of ${shelfLabel.label.toLowerCase()} (${shelfLabel.hint.toLowerCase()}).`,
  )

  if (food.lightSensitive && material.opaque) {
    points.push(`It blocks light, which protects colour, vitamins and flavour.`)
  }

  points.push(`${costLabel(material.cost)} cost · ${material.endOfLife}.`)
  return points
}
