// Единый демонстрационный каталог цен. Используется, только если
// сервер (GET /api/v1/pricing) недоступен. Все цены — демонстрационные.
import type { HouseConfig } from "@/lib/config";

export type PriceStatus = "demo" | "verified" | "needs_update" | "estimate";
export type ItemKind = "material" | "work";
export type Stage = "shell" | "finish" | "engineering" | "extra" | "logistics";

/** База количества: величина, вычисляемая из геометрии дома. */
export type Basis =
  | "fixed" | "footprint" | "floorArea" | "decks" | "wallArea" | "envelope" | "partitionArea"
  | "interiorWallArea" | "roofArea" | "eavesLength" | "windows" | "windowArea" | "facadeArea"
  | "interiorDoors" | "bathrooms" | "piles" | "lumberWall" | "lumberDeck" | "lumberRoof"
  | "terraceArea" | "slabVolume" | "stripLength" | "deliveryTrips" | "deliveryKm" | "insulationM2x50";

export interface PriceItem {
  id: string;
  name: string;
  category: string;
  kind: ItemKind;
  stage: Stage;
  unit: string;
  /** Цена за единицу, ₽. null — цена не определена. */
  price: number | null;
  basis: Basis;
  /** Норма расхода на единицу базы (включая запас). */
  rate: number;
  /** Условие включения позиции. */
  when?: (c: HouseConfig) => boolean;
  source: string;
  updated: string;
  status: PriceStatus;
  note?: string;
}

export const CATALOG_META = {
  version: "demo-2026.10",
  updated: "2026-10-27",
  region: "Санкт-Петербург и Ленинградская область",
  isDemo: true,
  /** Неопределённость демо-цен, ± доля. */
  uncertainty: 0.15,
  organizationRate: 0.04,
  reserveRate: 0.05,
};

const SRC = "Демо-ориентир по публичным прайсам (proektdomu.ru, lenwood.ru, utki.ru и др.), не проверено";
const D = CATALOG_META.updated;
const demo = { source: SRC, updated: D, status: "demo" as const };

type C = HouseConfig;
const f = (k: C["foundation"]) => (c: C) => c.foundation === k;

export const DEMO_CATALOG: PriceItem[] = [
  // Фундамент
  { id: "F-01", name: "Винтовая свая 108 мм, 2,5 м, с оголовком", category: "Фундамент", kind: "material", stage: "shell", unit: "шт", price: 6900, basis: "piles", rate: 1, when: f("screw"), ...demo },
  { id: "F-02", name: "Монтаж винтовых свай", category: "Фундамент", kind: "work", stage: "shell", unit: "шт", price: 3200, basis: "piles", rate: 1, when: f("screw"), ...demo },
  { id: "F-03", name: "Железобетонная свая 150×150, 3 м", category: "Фундамент", kind: "material", stage: "shell", unit: "шт", price: 9800, basis: "piles", rate: 1, when: f("rc_piles"), ...demo },
  { id: "F-04", name: "Забивка ЖБ свай и устройство ростверка", category: "Фундамент", kind: "work", stage: "shell", unit: "шт", price: 7500, basis: "piles", rate: 1, when: f("rc_piles"), ...demo },
  { id: "F-05", name: "Утеплённая плита: бетон, арматура, ЭППС, песок, щебень, геотекстиль", category: "Фундамент", kind: "material", stage: "shell", unit: "м³", price: 16500, basis: "slabVolume", rate: 1, when: f("slab"), ...demo },
  { id: "F-06", name: "Устройство утеплённой плиты", category: "Фундамент", kind: "work", stage: "shell", unit: "м²", price: 3800, basis: "footprint", rate: 1.05, when: f("slab"), ...demo },
  { id: "F-07", name: "Ленточный фундамент: бетон, арматура, опалубка, гидроизоляция", category: "Фундамент", kind: "material", stage: "shell", unit: "пог. м", price: 9500, basis: "stripLength", rate: 1, when: f("strip"), ...demo },
  { id: "F-08", name: "Земляные работы и устройство ленты", category: "Фундамент", kind: "work", stage: "shell", unit: "пог. м", price: 7000, basis: "stripLength", rate: 1, when: f("strip"), ...demo },
  { id: "F-09", name: "Фундамент по итогам изысканий", category: "Фундамент", kind: "work", stage: "shell", unit: "компл.", price: null, basis: "fixed", rate: 1, when: f("consult"), ...demo, status: "needs_update", note: "Требуется консультация и геология участка" },
  { id: "F-10", name: "Разметка участка", category: "Фундамент", kind: "work", stage: "shell", unit: "компл.", price: 15000, basis: "fixed", rate: 1, ...demo },

  // Каркас и пиломатериалы
  { id: "W-01", name: "Брус обвязки 150×150, камерной сушки", category: "Пиломатериалы", kind: "material", stage: "shell", unit: "м³", price: 29000, basis: "footprint", rate: 0.028, ...demo },
  { id: "W-02", name: "Монтаж нижней обвязки", category: "Каркас", kind: "work", stage: "shell", unit: "м²", price: 900, basis: "footprint", rate: 1, ...demo },
  { id: "W-03", name: "Доска сухая строганая 45×(150–200) для стоек", category: "Пиломатериалы", kind: "material", stage: "shell", unit: "м³", price: 31000, basis: "lumberWall", rate: 1, ...demo },
  { id: "W-04", name: "Сборка стенового каркаса", category: "Каркас", kind: "work", stage: "shell", unit: "м²", price: 2400, basis: "wallArea", rate: 1, ...demo },
  { id: "W-05", name: "Доска для балок перекрытий 50×200", category: "Перекрытия", kind: "material", stage: "shell", unit: "м³", price: 31000, basis: "lumberDeck", rate: 1, ...demo },
  { id: "W-06", name: "Монтаж перекрытий", category: "Перекрытия", kind: "work", stage: "shell", unit: "м²", price: 1500, basis: "decks", rate: 1, ...demo },
  { id: "W-07", name: "Каркас межкомнатных перегородок", category: "Каркас", kind: "material", stage: "shell", unit: "м²", price: 1100, basis: "partitionArea", rate: 1, ...demo },
  { id: "W-08", name: "Монтаж перегородок", category: "Каркас", kind: "work", stage: "shell", unit: "м²", price: 900, basis: "partitionArea", rate: 1, ...demo },
  { id: "W-09", name: "OSB-3 12 мм (стены, черновой пол)", category: "Обшивка", kind: "material", stage: "shell", unit: "м²", price: 640, basis: "envelope", rate: 0.62, ...demo },
  { id: "W-10", name: "Монтаж OSB-3", category: "Обшивка", kind: "work", stage: "shell", unit: "м²", price: 320, basis: "envelope", rate: 0.62, ...demo },
  { id: "W-11", name: "Крепёж, уголки, пластины, соединители", category: "Крепёж", kind: "material", stage: "shell", unit: "м²", price: 520, basis: "floorArea", rate: 1, ...demo },
  { id: "W-12", name: "Антисептическая обработка пиломатериалов", category: "Пиломатериалы", kind: "material", stage: "shell", unit: "м²", price: 140, basis: "floorArea", rate: 1, ...demo },
  { id: "W-13", name: "Устройство черновых полов", category: "Перекрытия", kind: "work", stage: "shell", unit: "м²", price: 650, basis: "floorArea", rate: 1, ...demo },

  // Утепление и мембраны
  { id: "I-01", name: "Минеральная (каменная) вата, слой 50 мм", category: "Утепление", kind: "material", stage: "shell", unit: "м²×50мм", price: 125, basis: "insulationM2x50", rate: 1.05, ...demo, note: "Толщина берётся из выбранной спецификации" },
  { id: "I-02", name: "Укладка утеплителя", category: "Утепление", kind: "work", stage: "shell", unit: "м²", price: 380, basis: "envelope", rate: 1, ...demo },
  { id: "I-03", name: "Пароизоляционная мембрана", category: "Мембраны", kind: "material", stage: "shell", unit: "м²", price: 55, basis: "envelope", rate: 1.15, ...demo },
  { id: "I-04", name: "Ветрогидрозащитная мембрана", category: "Мембраны", kind: "material", stage: "shell", unit: "м²", price: 75, basis: "envelope", rate: 1.15, ...demo },
  { id: "I-05", name: "Ленты, герметики, уплотнители", category: "Мембраны", kind: "material", stage: "shell", unit: "м²", price: 35, basis: "envelope", rate: 1, ...demo },
  { id: "I-06", name: "Монтаж пароизоляции и ветрозащиты", category: "Мембраны", kind: "work", stage: "shell", unit: "м²", price: 190, basis: "envelope", rate: 1, ...demo },

  // Кровля
  { id: "R-01", name: "Стропильная система, доска 50×200", category: "Кровля", kind: "material", stage: "shell", unit: "м³", price: 31000, basis: "lumberRoof", rate: 1, ...demo },
  { id: "R-02", name: "Монтаж стропильной системы", category: "Кровля", kind: "work", stage: "shell", unit: "м²", price: 950, basis: "roofArea", rate: 1, ...demo },
  { id: "R-03", name: "Подкровельная мембрана", category: "Кровля", kind: "material", stage: "shell", unit: "м²", price: 110, basis: "roofArea", rate: 1.12, ...demo },
  { id: "R-04", name: "Обрешётка и контробрешётка", category: "Кровля", kind: "material", stage: "shell", unit: "м²", price: 260, basis: "roofArea", rate: 1, ...demo },
  { id: "R-05", name: "Металлочерепица 0,5 мм", category: "Кровля", kind: "material", stage: "shell", unit: "м²", price: 780, basis: "roofArea", rate: 1.12, when: (c) => c.roofing === "metal_tile", ...demo },
  { id: "R-06", name: "Профнастил кровельный", category: "Кровля", kind: "material", stage: "shell", unit: "м²", price: 620, basis: "roofArea", rate: 1.1, when: (c) => c.roofing === "profiled", ...demo },
  { id: "R-07", name: "Гибкая черепица + подкладочный ковёр", category: "Кровля", kind: "material", stage: "shell", unit: "м²", price: 1150, basis: "roofArea", rate: 1.1, when: (c) => c.roofing === "soft", ...demo },
  { id: "R-08", name: "Сплошной настил OSB-3 под гибкую черепицу", category: "Кровля", kind: "material", stage: "shell", unit: "м²", price: 720, basis: "roofArea", rate: 1.05, when: (c) => c.roofing === "soft", ...demo },
  { id: "R-09", name: "Монтаж кровельного покрытия", category: "Кровля", kind: "work", stage: "shell", unit: "м²", price: 900, basis: "roofArea", rate: 1, ...demo },
  { id: "R-10", name: "Водостоки, снегозадержатели, доборные элементы", category: "Кровля", kind: "material", stage: "shell", unit: "пог. м", price: 1600, basis: "eavesLength", rate: 1, ...demo },

  // Окна и двери
  { id: "O-01", name: "Окно ПВХ, двухкамерный стеклопакет", category: "Окна", kind: "material", stage: "shell", unit: "м²", price: 13500, basis: "windowArea", rate: 1, when: (c) => c.windowType === "pvc", ...demo },
  { id: "O-02", name: "Окно ПВХ, энергосберегающий стеклопакет", category: "Окна", kind: "material", stage: "shell", unit: "м²", price: 17500, basis: "windowArea", rate: 1, when: (c) => c.windowType === "pvc_energy", ...demo },
  { id: "O-03", name: "Установка окна: пена, ленты, отлив", category: "Окна", kind: "work", stage: "shell", unit: "шт", price: 5200, basis: "windows", rate: 1, ...demo },
  { id: "O-04", name: "Входная металлическая дверь", category: "Двери", kind: "material", stage: "shell", unit: "шт", price: 38000, basis: "fixed", rate: 1, when: (c) => !c.warmEntryDoor, ...demo },
  { id: "O-05", name: "Входная дверь с терморазрывом", category: "Двери", kind: "material", stage: "shell", unit: "шт", price: 72000, basis: "fixed", rate: 1, when: (c) => c.warmEntryDoor, ...demo },
  { id: "O-06", name: "Установка входной двери", category: "Двери", kind: "work", stage: "shell", unit: "шт", price: 7000, basis: "fixed", rate: 1, ...demo },

  // Фасад
  { id: "S-01", name: "Обрешётка и вентзазор фасада", category: "Фасад", kind: "material", stage: "finish", unit: "м²", price: 230, basis: "facadeArea", rate: 1, ...demo },
  { id: "S-02", name: "Имитация бруса, хвоя, сорт АВ", category: "Фасад", kind: "material", stage: "finish", unit: "м²", price: 1150, basis: "facadeArea", rate: 1.1, when: (c) => c.facade === "imitation", ...demo },
  { id: "S-03", name: "Планкен лиственница", category: "Фасад", kind: "material", stage: "finish", unit: "м²", price: 2300, basis: "facadeArea", rate: 1.1, when: (c) => c.facade === "planken", ...demo },
  { id: "S-04", name: "Виниловый сайдинг с комплектующими", category: "Фасад", kind: "material", stage: "finish", unit: "м²", price: 620, basis: "facadeArea", rate: 1.1, when: (c) => c.facade === "siding", ...demo },
  { id: "S-05", name: "Фиброцементные фасадные панели", category: "Фасад", kind: "material", stage: "finish", unit: "м²", price: 2600, basis: "facadeArea", rate: 1.08, when: (c) => c.facade === "panels", ...demo },
  { id: "S-06", name: "Металлический фасад (профиль)", category: "Фасад", kind: "material", stage: "finish", unit: "м²", price: 900, basis: "facadeArea", rate: 1.1, when: (c) => c.facade === "metal", ...demo },
  { id: "S-07", name: "Грунтовка и краска фасадная", category: "Фасад", kind: "material", stage: "finish", unit: "м²", price: 190, basis: "facadeArea", rate: 1, when: (c) => c.facade === "imitation" || c.facade === "planken", ...demo },
  { id: "S-08", name: "Монтаж фасада", category: "Фасад", kind: "work", stage: "finish", unit: "м²", price: 1100, basis: "facadeArea", rate: 1, ...demo },
  { id: "S-09", name: "Окраска фасада", category: "Фасад", kind: "work", stage: "finish", unit: "м²", price: 380, basis: "facadeArea", rate: 1, when: (c) => c.facade === "imitation" || c.facade === "planken", ...demo },

  // Внутренняя отделка
  { id: "N-01", name: "Гипсокартон, профиль, крепёж (стены и потолки)", category: "Внутренняя отделка", kind: "material", stage: "finish", unit: "м²", price: 520, basis: "interiorWallArea", rate: 1.1, when: (c) => c.finish === "basic", ...demo },
  { id: "N-02", name: "Шпаклёвка, грунтовка, краска", category: "Внутренняя отделка", kind: "material", stage: "finish", unit: "м²", price: 260, basis: "interiorWallArea", rate: 1, when: (c) => c.finish === "basic", ...demo },
  { id: "N-03", name: "Монтаж ГКЛ и чистовая окраска", category: "Внутренняя отделка", kind: "work", stage: "finish", unit: "м²", price: 1250, basis: "interiorWallArea", rate: 1, when: (c) => c.finish === "basic", ...demo },
  { id: "N-04", name: "Ламинат 33 класса с подложкой", category: "Внутренняя отделка", kind: "material", stage: "finish", unit: "м²", price: 1150, basis: "floorArea", rate: 1.08, when: (c) => c.finish === "basic", ...demo },
  { id: "N-05", name: "Имитация бруса / вагонка экстра, покрытие", category: "Внутренняя отделка", kind: "material", stage: "finish", unit: "м²", price: 1250, basis: "interiorWallArea", rate: 1.1, when: (c) => c.finish === "extended", ...demo },
  { id: "N-06", name: "Монтаж вагонки и покрытие маслом", category: "Внутренняя отделка", kind: "work", stage: "finish", unit: "м²", price: 1450, basis: "interiorWallArea", rate: 1, when: (c) => c.finish === "extended", ...demo },
  { id: "N-07", name: "Инженерная доска", category: "Внутренняя отделка", kind: "material", stage: "finish", unit: "м²", price: 3900, basis: "floorArea", rate: 1.07, when: (c) => c.finish === "extended", ...demo },
  { id: "N-08", name: "Укладка напольного покрытия", category: "Внутренняя отделка", kind: "work", stage: "finish", unit: "м²", price: 650, basis: "floorArea", rate: 1, when: (c) => c.finish === "basic" || c.finish === "extended", ...demo },
  { id: "N-09", name: "Плитка и керамогранит в санузлах (≈ 22 м² на санузел)", category: "Внутренняя отделка", kind: "material", stage: "finish", unit: "м²", price: 2400, basis: "bathrooms", rate: 22, when: (c) => c.finish === "basic" || c.finish === "extended", ...demo },
  { id: "N-10", name: "Укладка плитки", category: "Внутренняя отделка", kind: "work", stage: "finish", unit: "м²", price: 2500, basis: "bathrooms", rate: 22, when: (c) => c.finish === "basic" || c.finish === "extended", ...demo },
  { id: "N-11", name: "Межкомнатная дверь с коробкой", category: "Двери", kind: "material", stage: "finish", unit: "шт", price: 16000, basis: "interiorDoors", rate: 1, when: (c) => c.finish !== "none", ...demo },
  { id: "N-12", name: "Установка межкомнатной двери", category: "Двери", kind: "work", stage: "finish", unit: "шт", price: 4500, basis: "interiorDoors", rate: 1, when: (c) => c.finish !== "none", ...demo },
  { id: "N-13", name: "Индивидуальная отделка по дизайн-проекту", category: "Внутренняя отделка", kind: "work", stage: "finish", unit: "компл.", price: null, basis: "fixed", rate: 1, when: (c) => c.finish === "custom", ...demo, status: "needs_update", note: "Рассчитывается по дизайн-проекту" },

  // Инженерные системы
  { id: "E-01", name: "Кабель, щит, автоматы, розетки и выключатели", category: "Электрика", kind: "material", stage: "engineering", unit: "м²", price: 950, basis: "floorArea", rate: 1, when: (c) => c.electric, ...demo },
  { id: "E-02", name: "Электромонтажные работы", category: "Электрика", kind: "work", stage: "engineering", unit: "м²", price: 1150, basis: "floorArea", rate: 1, when: (c) => c.electric, ...demo },
  { id: "E-03", name: "Трубы и фитинги водоснабжения, водонагреватель", category: "Водоснабжение", kind: "material", stage: "engineering", unit: "санузел", price: 62000, basis: "bathrooms", rate: 1, when: (c) => c.water, ...demo },
  { id: "E-04", name: "Монтаж водоснабжения", category: "Водоснабжение", kind: "work", stage: "engineering", unit: "санузел", price: 42000, basis: "bathrooms", rate: 1, when: (c) => c.water, ...demo },
  { id: "E-05", name: "Канализационные трубы и фитинги", category: "Канализация", kind: "material", stage: "engineering", unit: "санузел", price: 22000, basis: "bathrooms", rate: 1, when: (c) => c.sewer, ...demo },
  { id: "E-06", name: "Монтаж внутренней канализации", category: "Канализация", kind: "work", stage: "engineering", unit: "санузел", price: 24000, basis: "bathrooms", rate: 1, when: (c) => c.sewer, ...demo },
  { id: "E-07", name: "Септик / локальная очистная станция", category: "Канализация", kind: "material", stage: "engineering", unit: "компл.", price: 175000, basis: "fixed", rate: 1, when: (c) => c.sewer && c.septic, ...demo },
  { id: "E-08", name: "Монтаж септика с земляными работами", category: "Канализация", kind: "work", stage: "engineering", unit: "компл.", price: 75000, basis: "fixed", rate: 1, when: (c) => c.sewer && c.septic, ...demo },
  { id: "E-09", name: "Электрический котёл с обвязкой", category: "Отопление", kind: "material", stage: "engineering", unit: "компл.", price: 68000, basis: "fixed", rate: 1, when: (c) => c.heating === "electric_boiler", ...demo },
  { id: "E-10", name: "Радиаторы, трубы, фитинги (1 радиатор на 10 м²)", category: "Отопление", kind: "material", stage: "engineering", unit: "м²", price: 950, basis: "floorArea", rate: 1, when: (c) => c.heating === "electric_boiler", ...demo },
  { id: "E-11", name: "Монтаж системы отопления", category: "Отопление", kind: "work", stage: "engineering", unit: "м²", price: 950, basis: "floorArea", rate: 1, when: (c) => c.heating === "electric_boiler", ...demo },
  { id: "E-12", name: "Электрический тёплый пол (мат, терморегуляторы)", category: "Отопление", kind: "material", stage: "engineering", unit: "м²", price: 1900, basis: "floorArea", rate: 0.75, when: (c) => c.heating === "warm_floor", ...demo },
  { id: "E-13", name: "Монтаж тёплого пола", category: "Отопление", kind: "work", stage: "engineering", unit: "м²", price: 900, basis: "floorArea", rate: 0.75, when: (c) => c.heating === "warm_floor", ...demo },
  { id: "E-14", name: "Приточно-вытяжная вентиляция", category: "Вентиляция", kind: "material", stage: "engineering", unit: "м²", price: 750, basis: "floorArea", rate: 1, when: (c) => c.ventilation, ...demo },
  { id: "E-15", name: "Монтаж вентиляции", category: "Вентиляция", kind: "work", stage: "engineering", unit: "м²", price: 600, basis: "floorArea", rate: 1, when: (c) => c.ventilation, ...demo },
  { id: "E-16", name: "Подключение к существующим коммуникациям", category: "Инженерные системы", kind: "work", stage: "engineering", unit: "компл.", price: null, basis: "fixed", rate: 1, when: (c) => c.existingUtilities, ...demo, status: "needs_update", note: "Зависит от расстояния до сетей и техусловий" },

  // Дополнительные работы
  { id: "X-01", name: "Терраса: лаги, доска, опоры", category: "Терраса", kind: "material", stage: "extra", unit: "м²", price: 4600, basis: "terraceArea", rate: 1, when: (c) => c.terrace, ...demo },
  { id: "X-02", name: "Устройство террасы", category: "Терраса", kind: "work", stage: "extra", unit: "м²", price: 3400, basis: "terraceArea", rate: 1, when: (c) => c.terrace, ...demo },
  { id: "X-03", name: "Крыльцо со ступенями", category: "Дополнительные работы", kind: "material", stage: "extra", unit: "компл.", price: 48000, basis: "fixed", rate: 1, when: (c) => c.porch, ...demo },
  { id: "X-04", name: "Устройство крыльца", category: "Дополнительные работы", kind: "work", stage: "extra", unit: "компл.", price: 32000, basis: "fixed", rate: 1, when: (c) => c.porch, ...demo },
  { id: "X-05", name: "Навес", category: "Дополнительные работы", kind: "material", stage: "extra", unit: "компл.", price: 85000, basis: "fixed", rate: 1, when: (c) => c.canopy, ...demo },
  { id: "X-06", name: "Монтаж навеса", category: "Дополнительные работы", kind: "work", stage: "extra", unit: "компл.", price: 45000, basis: "fixed", rate: 1, when: (c) => c.canopy, ...demo },
  { id: "X-07", name: "Подготовка участка и организация стройплощадки", category: "Дополнительные работы", kind: "work", stage: "extra", unit: "компл.", price: 65000, basis: "fixed", rate: 1, when: (c) => c.sitePrep, ...demo },
  { id: "X-08", name: "Балкон", category: "Дополнительные работы", kind: "work", stage: "extra", unit: "компл.", price: null, basis: "fixed", rate: 1, when: (c) => c.balcony, ...demo, status: "needs_update", note: "Зависит от конструкции" },

  // Логистика
  { id: "L-01", name: "Доставка материалов (рейс до 50 км)", category: "Доставка", kind: "work", stage: "logistics", unit: "рейс", price: 18000, basis: "deliveryTrips", rate: 1, ...demo },
  { id: "L-02", name: "Доставка: километраж свыше 50 км", category: "Доставка", kind: "work", stage: "logistics", unit: "км", price: 110, basis: "deliveryKm", rate: 1, ...demo },
  { id: "L-03", name: "Разгрузка материалов", category: "Доставка", kind: "work", stage: "logistics", unit: "рейс", price: 6000, basis: "deliveryTrips", rate: 1, ...demo },
  { id: "L-04", name: "Вывоз строительного мусора", category: "Доставка", kind: "work", stage: "logistics", unit: "м²", price: 260, basis: "floorArea", rate: 1, when: (c) => c.wasteRemoval, ...demo },
];

export const STATUS_LABEL: Record<PriceStatus, string> = {
  demo: "Демонстрационная, не проверена",
  verified: "Проверена",
  needs_update: "Требует уточнения",
  estimate: "Ориентировочная",
};
