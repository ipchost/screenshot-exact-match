import type { HouseConfig, PackageId } from "@/lib/config";
import { CATALOG_META, DEMO_CATALOG, type Basis, type PriceItem, type Stage } from "@/data/pricing";

export interface Geometry {
  footprint: number;
  floorArea: number;
  perimeter: number;
  wallArea: number;
  roofArea: number;
  windowArea: number;
  facadeArea: number;
}

const ROOF_FACTOR = { gable: 1.3, hip: 1.38, shed: 1.18 } as const;
const WINDOW_M2 = 1.6;

export function geometry(c: HouseConfig): Geometry {
  const footprint = c.length * c.width;
  const floorArea = footprint * c.floors;
  const perimeter = 2 * (c.length + c.width);
  const gable = c.roof === "gable" ? (c.width * c.width * 0.29) : 0; // два фронтона ≈ ширина²·tg30°/2·2
  const wallArea = perimeter * c.ceiling * c.floors + gable;
  const roofArea = footprint * ROOF_FACTOR[c.roof];
  const windowArea = c.windows * WINDOW_M2;
  const facadeArea = Math.max(0, wallArea - windowArea - 2);
  return { footprint, floorArea, perimeter, wallArea, roofArea, windowArea, facadeArea };
}

function basisValue(b: Basis, c: HouseConfig, g: Geometry): number {
  const partitionArea = g.floorArea * 0.55;
  const envelope = g.wallArea + g.footprint * 2; // стены + пол + потолок
  switch (b) {
    case "fixed": return 1;
    case "footprint": return g.footprint;
    case "floorArea": return g.floorArea;
    case "decks": return g.footprint * (c.floors + 1);
    case "wallArea": return g.wallArea;
    case "envelope": return envelope;
    case "partitionArea": return partitionArea;
    case "interiorWallArea": return g.wallArea + partitionArea * 2 + g.floorArea;
    case "roofArea": return g.roofArea;
    case "eavesLength": return c.roof === "hip" ? g.perimeter : c.length * 2 + 8;
    case "windows": return c.windows;
    case "windowArea": return g.windowArea;
    case "facadeArea": return g.facadeArea;
    case "interiorDoors": return c.interiorDoors;
    case "bathrooms": return c.bathrooms;
    case "piles": return Math.ceil(g.footprint / 2.4) + 4;
    case "lumberWall": return g.wallArea * 0.048 + partitionArea * 0.015;
    case "lumberDeck": return g.footprint * (c.floors + 1) * 0.042;
    case "lumberRoof": return g.roofArea * 0.032;
    case "terraceArea": return c.terrace ? c.terraceArea : 0;
    case "slabVolume": return g.footprint * 1.05 * 0.3;
    case "stripLength": return g.perimeter + c.length;
    case "deliveryTrips": return Math.max(2, Math.ceil(g.floorArea / 30));
    case "deliveryKm": return Math.max(0, c.distanceKm - 50) * 2 * Math.max(2, Math.ceil(g.floorArea / 30));
    case "insulationM2x50": return envelope * (c.insulation / 50);
  }
}

export interface EstimateLine extends PriceItem {
  quantity: number;
  /** null — стоимость не определена, позиция требует уточнения. */
  cost: number | null;
}

export interface EstimateTotals {
  materials: number;
  works: number;
  engineering: number;
  delivery: number;
  organization: number;
  reserve: number;
  total: number;
  min: number;
  max: number;
  perM2: number;
  unpriced: number;
}

export interface Estimate {
  lines: EstimateLine[];
  totals: EstimateTotals;
  geometry: Geometry;
  package: PackageId;
}

const PACKAGE_STAGES: Record<PackageId, Stage[]> = {
  shell: ["shell", "extra", "logistics"],
  finish: ["shell", "finish", "extra", "logistics"],
  living: ["shell", "finish", "engineering", "extra", "logistics"],
};

export function includedStages(p: PackageId) { return PACKAGE_STAGES[p]; }

const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

export function calculate(
  c: HouseConfig,
  pkg: PackageId = c.package,
  catalog: PriceItem[] = DEMO_CATALOG,
  meta = CATALOG_META,
): Estimate {
  const g = geometry(c);
  const stages = PACKAGE_STAGES[pkg];
  const lines: EstimateLine[] = [];
  const seen = new Set<string>();
  for (const item of catalog) {
    if (seen.has(item.id)) continue; // защита от двойного учёта
    if (!stages.includes(item.stage)) continue;
    if (item.when && !item.when(c)) continue;
    const quantity = round(basisValue(item.basis, c, g) * item.rate);
    if (quantity <= 0) continue;
    seen.add(item.id);
    const cost = item.price == null ? null : Math.round(quantity * item.price);
    lines.push({ ...item, quantity, cost });
  }

  let materials = 0, works = 0, engineering = 0, delivery = 0, unpriced = 0;
  for (const l of lines) {
    if (l.cost == null) { unpriced++; continue; }
    if (l.stage === "logistics") delivery += l.cost;
    else if (l.stage === "engineering") engineering += l.cost;
    else if (l.kind === "material") materials += l.cost;
    else works += l.cost;
  }
  const subtotal = materials + works + engineering + delivery;
  const organization = Math.round(subtotal * meta.organizationRate);
  const reserve = Math.round((subtotal + organization) * meta.reserveRate);
  const total = subtotal + organization + reserve;
  return {
    lines,
    geometry: g,
    package: pkg,
    totals: {
      materials, works, engineering, delivery, organization, reserve, total, unpriced,
      min: Math.round(total * (1 - meta.uncertainty)),
      max: Math.round(total * (1 + meta.uncertainty)),
      perM2: g.floorArea ? Math.round(total / g.floorArea) : 0,
    },
  };
}

export const rub = (n: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);
export const num = (n: number, d = 1) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: d }).format(n);
