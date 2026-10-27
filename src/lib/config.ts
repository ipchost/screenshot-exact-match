// Конфигурация дома, которую собирает пользователь в конструкторе.
export type Purpose = "seasonal" | "permanent" | "guest" | "other";
export type Foundation = "screw" | "rc_piles" | "slab" | "strip" | "consult";
export type RoofShape = "gable" | "hip" | "shed";
export type Roofing = "metal_tile" | "profiled" | "soft";
export type Facade = "imitation" | "planken" | "siding" | "panels" | "metal";
export type WindowType = "pvc" | "pvc_energy";
export type Finish = "none" | "basic" | "extended" | "custom";
export type Heating = "none" | "electric_boiler" | "warm_floor";
export type PackageId = "shell" | "finish" | "living";

export interface HouseConfig {
  area: number;
  length: number;
  width: number;
  floors: 1 | 2;
  ceiling: number;
  bedrooms: number;
  bathrooms: number;
  kitchenLiving: boolean;
  techRoom: boolean;
  wardrobe: boolean;
  terrace: boolean;
  terraceArea: number;
  balcony: boolean;
  purpose: Purpose;
  foundation: Foundation;
  insulation: 100 | 150 | 200 | 250;
  roof: RoofShape;
  roofing: Roofing;
  facade: Facade;
  windows: number;
  windowType: WindowType;
  warmEntryDoor: boolean;
  interiorDoors: number;
  finish: Finish;
  electric: boolean;
  water: boolean;
  sewer: boolean;
  septic: boolean;
  heating: Heating;
  ventilation: boolean;
  existingUtilities: boolean;
  porch: boolean;
  canopy: boolean;
  sitePrep: boolean;
  wasteRemoval: boolean;
  distanceKm: number;
  locality: string;
  package: PackageId;
}

export const DEFAULT_CONFIG: HouseConfig = {
  area: 73,
  length: 9,
  width: 8.1,
  floors: 1,
  ceiling: 2.7,
  bedrooms: 2,
  bathrooms: 1,
  kitchenLiving: true,
  techRoom: true,
  wardrobe: false,
  terrace: true,
  terraceArea: 14,
  balcony: false,
  purpose: "permanent",
  foundation: "screw",
  insulation: 200,
  roof: "gable",
  roofing: "metal_tile",
  facade: "imitation",
  windows: 9,
  windowType: "pvc_energy",
  warmEntryDoor: true,
  interiorDoors: 4,
  finish: "basic",
  electric: true,
  water: true,
  sewer: true,
  septic: true,
  heating: "electric_boiler",
  ventilation: false,
  existingUtilities: false,
  porch: true,
  canopy: false,
  sitePrep: true,
  wasteRemoval: true,
  distanceKm: 60,
  locality: "",
  package: "living",
};

export const LABELS = {
  purpose: { seasonal: "Сезонное проживание (дача)", permanent: "Круглогодичное проживание", guest: "Гостевой дом", other: "Другое" },
  foundation: { screw: "Свайно-винтовой", rc_piles: "Железобетонные сваи", slab: "Утеплённая плита", strip: "Ленточный", consult: "Требуется консультация" },
  roof: { gable: "Двускатная", hip: "Вальмовая", shed: "Односкатная" },
  roofing: { metal_tile: "Металлочерепица", profiled: "Профнастил", soft: "Гибкая черепица" },
  facade: { imitation: "Имитация бруса", planken: "Планкен", siding: "Сайдинг", panels: "Фасадные панели", metal: "Металлический фасад" },
  windowType: { pvc: "ПВХ, двухкамерный стеклопакет", pvc_energy: "ПВХ, энергосберегающий стеклопакет" },
  finish: { none: "Без внутренней отделки", basic: "Базовая", extended: "Расширенная", custom: "Индивидуальная" },
  heating: { none: "Без отопления", electric_boiler: "Электрокотёл + радиаторы", warm_floor: "Электрический тёплый пол" },
  package: { shell: "Тёплый контур", finish: "Дом с отделкой", living: "Дом для проживания" },
} as const;

/** Проверка согласованности площади и размеров. Возвращает расхождение в долях. */
export function areaMismatch(c: Pick<HouseConfig, "area" | "length" | "width" | "floors">): number {
  const computed = c.length * c.width * c.floors;
  if (!c.area) return 1;
  return Math.abs(computed - c.area) / c.area;
}

export function compatibilityWarnings(c: HouseConfig): string[] {
  const w: string[] = [];
  if (areaMismatch(c) > 0.1)
    w.push(`Площадь ${c.area} м² не согласуется с размерами: ${c.length} × ${c.width} м × ${c.floors} эт. = ${(c.length * c.width * c.floors).toFixed(1)} м². В расчёте используются размеры.`);
  if (c.purpose === "permanent" && c.insulation < 150)
    w.push("Для круглогодичного проживания в Ленинградской области утепление 100 мм обычно недостаточно. Рекомендуем от 150–200 мм.");
  if (c.purpose === "permanent" && c.heating === "none")
    w.push("Для постоянного проживания не выбрано отопление.");
  if (c.package === "living" && (!c.electric || !c.water || !c.sewer || c.heating === "none"))
    w.push("Для комплектации «Дом для проживания» нужны электрика, водоснабжение, канализация и отопление. Сейчас что-то из этого не выбрано — дом нельзя считать готовым для проживания.");
  if (c.foundation === "slab" && c.purpose === "seasonal")
    w.push("Утеплённая плита для сезонного дома без постоянного отопления требует отдельной оценки: при промерзании возможны деформации.");
  if (c.water && !c.sewer) w.push("Выбрано водоснабжение без канализации — проверьте конфигурацию.");
  if (c.sewer && !c.septic && !c.existingUtilities)
    w.push("Канализация выбрана, но не указан септик или подключение к существующим сетям.");
  if (c.roof === "shed" && c.roofing === "soft")
    w.push("Гибкая черепица на пологой односкатной кровле требует проверки минимального уклона по инструкции производителя.");
  if (c.floors === 2 && c.length * c.width < 30)
    w.push("Двухэтажный дом с пятном застройки менее 30 м² — проверьте размещение лестницы.");
  return w;
}
