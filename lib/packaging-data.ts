// Prototype / demo dataset for the SIH demonstration.
// Barrier values are indicative literature ranges, normalised to per m² per day
// (OTR at 23 °C, 0% RH; WVTR at 38 °C, 90% RH) — not certified test results.

export type Level = 1 | 2 | 3 | 4 | 5
export type FoodForm = 'solid' | 'liquid' | 'powder' | 'paste'
export type CategoryId =
  | 'fruits'
  | 'vegetables'
  | 'grains'
  | 'dairy'
  | 'bakery'
  | 'snacks'
  | 'meat'
  | 'beverages'
  | 'other'
export type StorageId = 'ambient' | 'humid' | 'refrigerated' | 'frozen'
export type ShelfLifeId = 'short' | 'medium' | 'long' | 'extended'
export type PriorityId = 'balanced' | 'eco' | 'cost' | 'protection'

export interface Food {
  id: string
  name: string
  category: CategoryId
  form: FoodForm
  /** For fresh produce this is the respiration rate; otherwise oxygen sensitivity. */
  oxygen: Level
  moisture: Level
  moistureRisk: 'gain' | 'loss'
  respiring: boolean
  fatty: boolean
  lightSensitive: boolean
  defaultStorage: StorageId
  defaultShelfLife: ShelfLifeId
  waterActivity: number
  keywords?: string[]
}

export interface Material {
  id: string
  name: string
  type: string
  otr: number
  wvtr: number
  thickness: string
  tempMin: number
  tempMax: number
  forms: FoodForm[]
  cost: Level
  sustainability: Level
  /** 1 = short, 2 = medium, 3 = long, 4 = extended shelf-life */
  maxShelf: 1 | 2 | 3 | 4
  bestFor: CategoryId[]
  opaque: boolean
  greaseResistant: boolean
  advantage: string
  limitation: string
  useCase: string
  endOfLife: string
}

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'fruits', label: 'Fruits' },
  { id: 'vegetables', label: 'Vegetables' },
  { id: 'grains', label: 'Grains & Pulses' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'bakery', label: 'Bakery' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'meat', label: 'Meat & Fish' },
  { id: 'beverages', label: 'Beverages' },
  { id: 'other', label: 'Other' },
]

export const STORAGE_OPTIONS: {
  id: StorageId
  label: string
  hint: string
  tempC: number
  rh: number
}[] = [
  { id: 'ambient', label: 'Room temperature', hint: 'Kept on a shelf or in a store', tempC: 25, rh: 60 },
  { id: 'humid', label: 'Hot & humid', hint: 'Warm, damp places or monsoon season', tempC: 32, rh: 85 },
  { id: 'refrigerated', label: 'Refrigerated', hint: 'Kept in a fridge (0–8 °C)', tempC: 4, rh: 85 },
  { id: 'frozen', label: 'Frozen', hint: 'Kept in a freezer (−18 °C)', tempC: -18, rh: 90 },
]

export const SHELF_LIFE_OPTIONS: {
  id: ShelfLifeId
  label: string
  hint: string
  index: 1 | 2 | 3 | 4
}[] = [
  { id: 'short', label: 'A few days', hint: 'Up to 1 week', index: 1 },
  { id: 'medium', label: 'A few weeks', hint: '1 – 4 weeks', index: 2 },
  { id: 'long', label: 'A few months', hint: '1 – 6 months', index: 3 },
  { id: 'extended', label: 'Long term', hint: 'More than 6 months', index: 4 },
]

export const PRIORITY_OPTIONS: { id: PriorityId; label: string; hint: string }[] = [
  { id: 'balanced', label: 'Balanced', hint: 'Best all-round choice' },
  { id: 'eco', label: 'Eco-friendly', hint: 'Prefer greener materials' },
  { id: 'cost', label: 'Low cost', hint: 'Keep packaging affordable' },
  { id: 'protection', label: 'Maximum protection', hint: 'Longest possible freshness' },
]

type FoodInput = Omit<Food, 'id'>

const f = (id: string, data: FoodInput): Food => ({ id, ...data })

export const FOODS: Food[] = [
  // Fruits
  f('apple', { name: 'Apple', category: 'fruits', form: 'solid', oxygen: 2, moisture: 2, moistureRisk: 'loss', respiring: true, fatty: false, lightSensitive: false, defaultStorage: 'refrigerated', defaultShelfLife: 'medium', waterActivity: 0.98 }),
  f('banana', { name: 'Banana', category: 'fruits', form: 'solid', oxygen: 4, moisture: 2, moistureRisk: 'loss', respiring: true, fatty: false, lightSensitive: false, defaultStorage: 'ambient', defaultShelfLife: 'short', waterActivity: 0.97, keywords: ['kela'] }),
  f('mango', { name: 'Mango', category: 'fruits', form: 'solid', oxygen: 4, moisture: 2, moistureRisk: 'loss', respiring: true, fatty: false, lightSensitive: false, defaultStorage: 'ambient', defaultShelfLife: 'short', waterActivity: 0.98, keywords: ['aam'] }),
  f('grapes', { name: 'Grapes', category: 'fruits', form: 'solid', oxygen: 2, moisture: 3, moistureRisk: 'loss', respiring: true, fatty: false, lightSensitive: false, defaultStorage: 'refrigerated', defaultShelfLife: 'medium', waterActivity: 0.98 }),
  f('strawberry', { name: 'Strawberry', category: 'fruits', form: 'solid', oxygen: 5, moisture: 3, moistureRisk: 'loss', respiring: true, fatty: false, lightSensitive: false, defaultStorage: 'refrigerated', defaultShelfLife: 'short', waterActivity: 0.99 }),
  f('orange', { name: 'Orange', category: 'fruits', form: 'solid', oxygen: 2, moisture: 2, moistureRisk: 'loss', respiring: true, fatty: false, lightSensitive: false, defaultStorage: 'ambient', defaultShelfLife: 'medium', waterActivity: 0.98, keywords: ['santra', 'citrus'] }),

  // Vegetables
  f('tomato', { name: 'Tomato', category: 'vegetables', form: 'solid', oxygen: 3, moisture: 2, moistureRisk: 'loss', respiring: true, fatty: false, lightSensitive: false, defaultStorage: 'ambient', defaultShelfLife: 'short', waterActivity: 0.99, keywords: ['tamatar'] }),
  f('potato', { name: 'Potato', category: 'vegetables', form: 'solid', oxygen: 1, moisture: 2, moistureRisk: 'loss', respiring: true, fatty: false, lightSensitive: true, defaultStorage: 'ambient', defaultShelfLife: 'medium', waterActivity: 0.98, keywords: ['aloo'] }),
  f('onion', { name: 'Onion', category: 'vegetables', form: 'solid', oxygen: 1, moisture: 1, moistureRisk: 'loss', respiring: true, fatty: false, lightSensitive: false, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.97, keywords: ['pyaz'] }),
  f('spinach', { name: 'Spinach & Leafy Greens', category: 'vegetables', form: 'solid', oxygen: 5, moisture: 4, moistureRisk: 'loss', respiring: true, fatty: false, lightSensitive: false, defaultStorage: 'refrigerated', defaultShelfLife: 'short', waterActivity: 0.99, keywords: ['palak', 'lettuce', 'coriander'] }),
  f('carrot', { name: 'Carrot', category: 'vegetables', form: 'solid', oxygen: 2, moisture: 3, moistureRisk: 'loss', respiring: true, fatty: false, lightSensitive: false, defaultStorage: 'refrigerated', defaultShelfLife: 'medium', waterActivity: 0.98, keywords: ['gajar'] }),
  f('capsicum', { name: 'Capsicum', category: 'vegetables', form: 'solid', oxygen: 3, moisture: 3, moistureRisk: 'loss', respiring: true, fatty: false, lightSensitive: false, defaultStorage: 'refrigerated', defaultShelfLife: 'short', waterActivity: 0.98, keywords: ['bell pepper', 'shimla mirch'] }),
  f('mushroom', { name: 'Mushroom', category: 'vegetables', form: 'solid', oxygen: 5, moisture: 4, moistureRisk: 'loss', respiring: true, fatty: false, lightSensitive: false, defaultStorage: 'refrigerated', defaultShelfLife: 'short', waterActivity: 0.99 }),
  f('frozen-peas', { name: 'Frozen Green Peas', category: 'vegetables', form: 'solid', oxygen: 2, moisture: 3, moistureRisk: 'loss', respiring: false, fatty: false, lightSensitive: false, defaultStorage: 'frozen', defaultShelfLife: 'long', waterActivity: 0.98, keywords: ['matar'] }),

  // Grains & pulses
  f('rice', { name: 'Rice', category: 'grains', form: 'solid', oxygen: 1, moisture: 3, moistureRisk: 'gain', respiring: false, fatty: false, lightSensitive: false, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.6, keywords: ['chawal', 'basmati'] }),
  f('wheat-flour', { name: 'Wheat Flour (Atta)', category: 'grains', form: 'powder', oxygen: 2, moisture: 4, moistureRisk: 'gain', respiring: false, fatty: false, lightSensitive: false, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.6, keywords: ['atta', 'maida'] }),
  f('lentils', { name: 'Lentils (Dal)', category: 'grains', form: 'solid', oxygen: 1, moisture: 3, moistureRisk: 'gain', respiring: false, fatty: false, lightSensitive: false, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.6, keywords: ['dal', 'pulses'] }),
  f('oats', { name: 'Oats', category: 'grains', form: 'solid', oxygen: 3, moisture: 3, moistureRisk: 'gain', respiring: false, fatty: true, lightSensitive: false, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.5 }),
  f('cereal', { name: 'Breakfast Cereal', category: 'grains', form: 'solid', oxygen: 2, moisture: 5, moistureRisk: 'gain', respiring: false, fatty: false, lightSensitive: false, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.3, keywords: ['cornflakes'] }),

  // Dairy
  f('milk', { name: 'Milk', category: 'dairy', form: 'liquid', oxygen: 3, moisture: 1, moistureRisk: 'loss', respiring: false, fatty: false, lightSensitive: true, defaultStorage: 'refrigerated', defaultShelfLife: 'short', waterActivity: 0.99, keywords: ['doodh'] }),
  f('paneer', { name: 'Paneer', category: 'dairy', form: 'solid', oxygen: 4, moisture: 3, moistureRisk: 'loss', respiring: false, fatty: true, lightSensitive: false, defaultStorage: 'refrigerated', defaultShelfLife: 'short', waterActivity: 0.97, keywords: ['cottage cheese'] }),
  f('cheese', { name: 'Cheese', category: 'dairy', form: 'solid', oxygen: 4, moisture: 3, moistureRisk: 'loss', respiring: false, fatty: true, lightSensitive: true, defaultStorage: 'refrigerated', defaultShelfLife: 'medium', waterActivity: 0.95 }),
  f('curd', { name: 'Curd / Yogurt', category: 'dairy', form: 'paste', oxygen: 3, moisture: 2, moistureRisk: 'loss', respiring: false, fatty: false, lightSensitive: false, defaultStorage: 'refrigerated', defaultShelfLife: 'short', waterActivity: 0.99, keywords: ['dahi', 'yoghurt'] }),
  f('butter', { name: 'Butter', category: 'dairy', form: 'paste', oxygen: 4, moisture: 2, moistureRisk: 'loss', respiring: false, fatty: true, lightSensitive: true, defaultStorage: 'refrigerated', defaultShelfLife: 'medium', waterActivity: 0.93, keywords: ['makhan'] }),
  f('ghee', { name: 'Ghee', category: 'dairy', form: 'paste', oxygen: 4, moisture: 2, moistureRisk: 'gain', respiring: false, fatty: true, lightSensitive: true, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.3 }),
  f('milk-powder', { name: 'Milk Powder', category: 'dairy', form: 'powder', oxygen: 5, moisture: 5, moistureRisk: 'gain', respiring: false, fatty: true, lightSensitive: true, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.2 }),

  // Bakery
  f('bread', { name: 'Bread', category: 'bakery', form: 'solid', oxygen: 2, moisture: 3, moistureRisk: 'loss', respiring: false, fatty: false, lightSensitive: false, defaultStorage: 'ambient', defaultShelfLife: 'short', waterActivity: 0.94, keywords: ['pav', 'bun'] }),
  f('biscuits', { name: 'Biscuits & Cookies', category: 'bakery', form: 'solid', oxygen: 3, moisture: 5, moistureRisk: 'gain', respiring: false, fatty: true, lightSensitive: false, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.3 }),
  f('cake', { name: 'Cake', category: 'bakery', form: 'solid', oxygen: 3, moisture: 3, moistureRisk: 'loss', respiring: false, fatty: true, lightSensitive: false, defaultStorage: 'ambient', defaultShelfLife: 'short', waterActivity: 0.85, keywords: ['muffin', 'pastry'] }),
  f('rusk', { name: 'Rusk / Toast', category: 'bakery', form: 'solid', oxygen: 3, moisture: 5, moistureRisk: 'gain', respiring: false, fatty: true, lightSensitive: false, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.25 }),

  // Snacks
  f('chips', { name: 'Potato Chips', category: 'snacks', form: 'solid', oxygen: 5, moisture: 5, moistureRisk: 'gain', respiring: false, fatty: true, lightSensitive: true, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.2, keywords: ['wafers', 'crisps'] }),
  f('namkeen', { name: 'Namkeen / Mixture', category: 'snacks', form: 'solid', oxygen: 4, moisture: 5, moistureRisk: 'gain', respiring: false, fatty: true, lightSensitive: true, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.25, keywords: ['bhujia', 'farsan'] }),
  f('nuts', { name: 'Roasted Nuts', category: 'snacks', form: 'solid', oxygen: 5, moisture: 4, moistureRisk: 'gain', respiring: false, fatty: true, lightSensitive: true, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.3, keywords: ['peanuts', 'cashew', 'almonds', 'dry fruits'] }),
  f('chocolate', { name: 'Chocolate', category: 'snacks', form: 'solid', oxygen: 2, moisture: 3, moistureRisk: 'gain', respiring: false, fatty: true, lightSensitive: true, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.4 }),

  // Meat & fish
  f('chicken', { name: 'Fresh Chicken', category: 'meat', form: 'solid', oxygen: 4, moisture: 3, moistureRisk: 'loss', respiring: false, fatty: true, lightSensitive: false, defaultStorage: 'refrigerated', defaultShelfLife: 'short', waterActivity: 0.99, keywords: ['poultry'] }),
  f('fish', { name: 'Fresh Fish', category: 'meat', form: 'solid', oxygen: 5, moisture: 3, moistureRisk: 'loss', respiring: false, fatty: true, lightSensitive: false, defaultStorage: 'refrigerated', defaultShelfLife: 'short', waterActivity: 0.99, keywords: ['seafood'] }),
  f('sausages', { name: 'Processed Meat (Sausages)', category: 'meat', form: 'solid', oxygen: 4, moisture: 3, moistureRisk: 'loss', respiring: false, fatty: true, lightSensitive: true, defaultStorage: 'refrigerated', defaultShelfLife: 'medium', waterActivity: 0.95, keywords: ['salami', 'ham'] }),
  f('frozen-prawns', { name: 'Frozen Prawns', category: 'meat', form: 'solid', oxygen: 4, moisture: 4, moistureRisk: 'loss', respiring: false, fatty: true, lightSensitive: false, defaultStorage: 'frozen', defaultShelfLife: 'long', waterActivity: 0.98, keywords: ['shrimp', 'seafood'] }),

  // Beverages
  f('juice', { name: 'Fruit Juice', category: 'beverages', form: 'liquid', oxygen: 4, moisture: 1, moistureRisk: 'loss', respiring: false, fatty: false, lightSensitive: true, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.99 }),
  f('coffee', { name: 'Ground Coffee', category: 'beverages', form: 'powder', oxygen: 5, moisture: 5, moistureRisk: 'gain', respiring: false, fatty: true, lightSensitive: true, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.2 }),
  f('tea', { name: 'Tea Leaves', category: 'beverages', form: 'solid', oxygen: 3, moisture: 4, moistureRisk: 'gain', respiring: false, fatty: false, lightSensitive: true, defaultStorage: 'ambient', defaultShelfLife: 'extended', waterActivity: 0.3, keywords: ['chai'] }),

  // Other
  f('edible-oil', { name: 'Edible Oil', category: 'other', form: 'liquid', oxygen: 4, moisture: 1, moistureRisk: 'gain', respiring: false, fatty: true, lightSensitive: true, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.1, keywords: ['sunflower', 'mustard', 'cooking oil'] }),
  f('spices', { name: 'Spice Powder', category: 'other', form: 'powder', oxygen: 3, moisture: 4, moistureRisk: 'gain', respiring: false, fatty: false, lightSensitive: true, defaultStorage: 'ambient', defaultShelfLife: 'extended', waterActivity: 0.4, keywords: ['masala', 'turmeric', 'haldi', 'chilli'] }),
  f('pickle', { name: 'Pickle (Achar)', category: 'other', form: 'paste', oxygen: 2, moisture: 1, moistureRisk: 'gain', respiring: false, fatty: true, lightSensitive: false, defaultStorage: 'ambient', defaultShelfLife: 'extended', waterActivity: 0.8, keywords: ['achar'] }),
  f('jam', { name: 'Jam / Sauce', category: 'other', form: 'paste', oxygen: 2, moisture: 1, moistureRisk: 'gain', respiring: false, fatty: false, lightSensitive: false, defaultStorage: 'ambient', defaultShelfLife: 'long', waterActivity: 0.8, keywords: ['ketchup'] }),
  f('honey', { name: 'Honey', category: 'other', form: 'liquid', oxygen: 1, moisture: 2, moistureRisk: 'gain', respiring: false, fatty: false, lightSensitive: false, defaultStorage: 'ambient', defaultShelfLife: 'extended', waterActivity: 0.6, keywords: ['shahad'] }),
  f('rte-meal', { name: 'Ready-to-Eat Meal', category: 'other', form: 'paste', oxygen: 5, moisture: 3, moistureRisk: 'loss', respiring: false, fatty: true, lightSensitive: true, defaultStorage: 'ambient', defaultShelfLife: 'extended', waterActivity: 0.97, keywords: ['curry', 'retort', 'instant'] }),
]

export const MATERIALS: Material[] = [
  {
    id: 'perforated-ldpe',
    name: 'Micro-perforated LDPE Film',
    type: 'Breathable film (Modified Atmosphere Packaging)',
    otr: 15000, wvtr: 12, thickness: '30 µm',
    tempMin: -5, tempMax: 45, forms: ['solid'],
    cost: 1, sustainability: 2, maxShelf: 2,
    bestFor: ['fruits', 'vegetables'], opaque: false, greaseResistant: true,
    advantage: 'Lets fresh produce breathe while keeping it hydrated',
    limitation: 'Offers little protection against oxygen for non-fresh foods',
    useCase: 'Fresh fruits and vegetables in retail and supply chains',
    endOfLife: 'Recyclable where soft-plastic collection exists',
  },
  {
    id: 'pla-perforated',
    name: 'Compostable PLA Film',
    type: 'Bio-based breathable film',
    otr: 8000, wvtr: 120, thickness: '30 µm',
    tempMin: 0, tempMax: 45, forms: ['solid'],
    cost: 3, sustainability: 5, maxShelf: 1,
    bestFor: ['fruits', 'vegetables', 'bakery'], opaque: false, greaseResistant: true,
    advantage: 'Made from plants and compostable in industrial facilities',
    limitation: 'Weak moisture barrier and softens in heat',
    useCase: 'Short shelf-life fresh produce and bakery items',
    endOfLife: 'Industrially compostable',
  },
  {
    id: 'ldpe',
    name: 'LDPE Film (Polyethylene)',
    type: 'Flexible plastic film',
    otr: 3500, wvtr: 8, thickness: '50 µm',
    tempMin: -40, tempMax: 60, forms: ['solid', 'powder', 'liquid'],
    cost: 1, sustainability: 2, maxShelf: 2,
    bestFor: ['vegetables', 'bakery', 'grains', 'dairy'], opaque: false, greaseResistant: true,
    advantage: 'Very cheap, flexible and works from freezer to room temperature',
    limitation: 'Lets oxygen through, so not for oxygen-sensitive foods',
    useCase: 'Bread bags, milk pouches, frozen food bags',
    endOfLife: 'Recyclable where soft-plastic collection exists',
  },
  {
    id: 'bopp',
    name: 'BOPP Film',
    type: 'Clear oriented polypropylene film',
    otr: 1500, wvtr: 4, thickness: '25 µm',
    tempMin: -10, tempMax: 100, forms: ['solid', 'powder'],
    cost: 2, sustainability: 2, maxShelf: 3,
    bestFor: ['bakery', 'snacks', 'grains'], opaque: false, greaseResistant: true,
    advantage: 'Clear, strong and a good moisture barrier at low cost',
    limitation: 'Moderate oxygen barrier only',
    useCase: 'Biscuits, rusks, confectionery and dry grains',
    endOfLife: 'Recyclable (polypropylene stream)',
  },
  {
    id: 'kraft-coated',
    name: 'Kraft Paper with Bio-coating',
    type: 'Paper-based packaging',
    otr: 800, wvtr: 40, thickness: '80 gsm',
    tempMin: 0, tempMax: 50, forms: ['solid', 'powder'],
    cost: 3, sustainability: 5, maxShelf: 2,
    bestFor: ['bakery', 'grains'], opaque: true, greaseResistant: false,
    advantage: 'Renewable, recyclable and customer-friendly look',
    limitation: 'Not grease-proof and weak against humidity',
    useCase: 'Bakery bags, flour and dry goods',
    endOfLife: 'Recyclable with paper; biodegradable',
  },
  {
    id: 'hdpe',
    name: 'HDPE Bottle / Container',
    type: 'Rigid plastic',
    otr: 1800, wvtr: 2, thickness: '0.6 mm wall',
    tempMin: -40, tempMax: 80, forms: ['liquid', 'solid', 'powder', 'paste'],
    cost: 2, sustainability: 3, maxShelf: 2,
    bestFor: ['dairy', 'beverages'], opaque: true, greaseResistant: true,
    advantage: 'Tough, light, blocks light and widely recycled',
    limitation: 'Moderate oxygen barrier limits long shelf-life',
    useCase: 'Fresh milk, curd tubs, bulk dry goods',
    endOfLife: 'Widely recycled (HDPE #2)',
  },
  {
    id: 'pet-bottle',
    name: 'PET Bottle / Jar',
    type: 'Rigid clear plastic',
    otr: 30, wvtr: 3, thickness: '0.3 mm wall',
    tempMin: -20, tempMax: 60, forms: ['liquid', 'paste'],
    cost: 2, sustainability: 4, maxShelf: 3,
    bestFor: ['beverages', 'other'], opaque: false, greaseResistant: true,
    advantage: 'Clear, light, shatter-proof and highly recyclable',
    limitation: 'Not suitable for hot filling or very long oxygen protection',
    useCase: 'Juices, edible oils, sauces and spreads',
    endOfLife: 'Highly recyclable (PET #1)',
  },
  {
    id: 'pet-pe',
    name: 'PET/PE Laminate Pouch',
    type: 'Multilayer flexible pouch',
    otr: 60, wvtr: 4, thickness: '12/60 µm',
    tempMin: -30, tempMax: 90, forms: ['solid', 'powder', 'liquid', 'paste'],
    cost: 2, sustainability: 2, maxShelf: 3,
    bestFor: ['grains', 'snacks', 'other'], opaque: false, greaseResistant: true,
    advantage: 'Good oxygen and moisture protection at a low price',
    limitation: 'Multilayer structure is harder to recycle',
    useCase: 'Pulses, spices, namkeen and sauces',
    endOfLife: 'Limited recyclability (mixed layers)',
  },
  {
    id: 'evoh',
    name: 'EVOH Multilayer Barrier Film',
    type: 'High-barrier film (vacuum / MAP)',
    otr: 2, wvtr: 3, thickness: 'PE/EVOH/PE 80 µm',
    tempMin: -30, tempMax: 90, forms: ['solid', 'paste'],
    cost: 3, sustainability: 2, maxShelf: 3,
    bestFor: ['meat', 'dairy'], opaque: false, greaseResistant: true,
    advantage: 'Excellent oxygen barrier while staying clear and flexible',
    limitation: 'Costs more than simple films; needs vacuum/MAP equipment',
    useCase: 'Vacuum-packed meat, fish, cheese and paneer',
    endOfLife: 'Limited recyclability (mixed layers)',
  },
  {
    id: 'pp-tray',
    name: 'PP Tray with Barrier Lidding',
    type: 'Rigid tray + sealed lid film',
    otr: 5, wvtr: 1, thickness: '0.5 mm tray',
    tempMin: -40, tempMax: 120, forms: ['solid', 'paste'],
    cost: 3, sustainability: 2, maxShelf: 3,
    bestFor: ['meat', 'dairy', 'other'], opaque: false, greaseResistant: true,
    advantage: 'Protects shape, strong barrier and microwave-safe',
    limitation: 'Bulky and uses more plastic than a pouch',
    useCase: 'Chilled meat, ready meals and cut fruit',
    endOfLife: 'Recyclable tray (PP #5), lid film limited',
  },
  {
    id: 'met-pet',
    name: 'Metallised PET/PE Laminate',
    type: 'Metallised flexible pouch',
    otr: 1, wvtr: 0.8, thickness: '12/50 µm',
    tempMin: -20, tempMax: 90, forms: ['solid', 'powder'],
    cost: 3, sustainability: 1, maxShelf: 3,
    bestFor: ['snacks', 'bakery', 'beverages', 'grains'], opaque: true, greaseResistant: true,
    advantage: 'Very high barrier to air, moisture and light at moderate cost',
    limitation: 'Difficult to recycle',
    useCase: 'Chips, namkeen, biscuits and tea',
    endOfLife: 'Difficult to recycle',
  },
  {
    id: 'alu-laminate',
    name: 'PET/Aluminium Foil/PE Laminate',
    type: 'Foil-based pouch',
    otr: 0.05, wvtr: 0.05, thickness: '12/9/75 µm',
    tempMin: -40, tempMax: 121, forms: ['solid', 'powder', 'liquid', 'paste'],
    cost: 4, sustainability: 1, maxShelf: 4,
    bestFor: ['other', 'beverages', 'dairy', 'snacks'], opaque: true, greaseResistant: true,
    advantage: 'Near-total barrier; can be heat-sterilised (retort)',
    limitation: 'Higher cost and not recyclable in most places',
    useCase: 'Coffee, milk powder and ready-to-eat retort meals',
    endOfLife: 'Not recyclable in most regions',
  },
  {
    id: 'aseptic',
    name: 'Aseptic Carton (Paper/PE/Aluminium)',
    type: 'Multilayer carton',
    otr: 0.3, wvtr: 0.5, thickness: '6 layers',
    tempMin: 0, tempMax: 40, forms: ['liquid'],
    cost: 3, sustainability: 3, maxShelf: 4,
    bestFor: ['dairy', 'beverages'], opaque: true, greaseResistant: true,
    advantage: 'Keeps liquids safe for months without a fridge',
    limitation: 'Needs special aseptic filling lines',
    useCase: 'UHT milk, juices and liquid dairy',
    endOfLife: 'Recyclable at specialised carton facilities',
  },
  {
    id: 'glass',
    name: 'Glass Jar / Bottle',
    type: 'Rigid glass',
    otr: 0, wvtr: 0, thickness: '2–3 mm wall',
    tempMin: -5, tempMax: 121, forms: ['liquid', 'paste', 'powder'],
    cost: 4, sustainability: 4, maxShelf: 4,
    bestFor: ['other', 'beverages', 'dairy'], opaque: false, greaseResistant: true,
    advantage: 'Perfect barrier, reusable and does not affect taste',
    limitation: 'Heavy and breakable, which raises transport cost',
    useCase: 'Pickles, jams, honey, ghee and premium beverages',
    endOfLife: 'Endlessly recyclable and reusable',
  },
  {
    id: 'tinplate',
    name: 'Tinplate / Metal Can',
    type: 'Rigid metal',
    otr: 0, wvtr: 0, thickness: '0.2 mm',
    tempMin: -40, tempMax: 130, forms: ['liquid', 'paste', 'powder'],
    cost: 4, sustainability: 4, maxShelf: 4,
    bestFor: ['other', 'meat', 'beverages', 'dairy'], opaque: true, greaseResistant: true,
    advantage: 'Complete protection from air, light and damage',
    limitation: 'Heavier and more costly than flexible packs',
    useCase: 'Canned foods, ghee, oil tins and milk powder',
    endOfLife: 'Highly recyclable (steel)',
  },
]
