export type CategoryVisual = {
  gradient: string;
  tagline: string;
  letter: string;
};

const DEFAULT_VISUAL: CategoryVisual = {
  gradient: "from-zinc-800 via-zinc-700 to-zinc-900",
  tagline: "Curated vendor listings",
  letter: "•",
};

export const CATEGORY_VISUALS: Record<string, CategoryVisual> = {
  Watches: {
    gradient: "from-zinc-900 via-stone-800 to-zinc-950",
    tagline: "Precision timepieces",
    letter: "W",
  },
  "Watch Straps": {
    gradient: "from-neutral-800 via-zinc-700 to-neutral-900",
    tagline: "Premium straps & bands",
    letter: "S",
  },
  Perfumes: {
    gradient: "from-rose-950 via-red-900 to-zinc-950",
    tagline: "Signature fragrances",
    letter: "P",
  },
  Eyewear: {
    gradient: "from-sky-950 via-blue-900 to-zinc-950",
    tagline: "Frames & optics",
    letter: "E",
  },
  "Rings & Accessories": {
    gradient: "from-amber-950 via-yellow-900 to-zinc-950",
    tagline: "Jewelry & essentials",
    letter: "A",
  },
  "Mobile Gadgets": {
    gradient: "from-orange-950 via-amber-900 to-zinc-950",
    tagline: "Smart lifestyle tech",
    letter: "G",
  },
  Fashion: {
    gradient: "from-fuchsia-950 via-purple-900 to-zinc-950",
    tagline: "Style from trusted sellers",
    letter: "F",
  },
};

export function getCategoryVisual(name: string): CategoryVisual {
  return CATEGORY_VISUALS[name] ?? { ...DEFAULT_VISUAL, letter: name.charAt(0).toUpperCase() };
}
