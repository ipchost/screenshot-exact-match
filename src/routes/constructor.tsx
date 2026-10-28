import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { DEFAULT_CONFIG, LABELS, type HouseConfig } from "@/lib/config";

type ProjectId = "compact" | "terrace" | "two-storey";

export const Route = createFileRoute("/constructor")({
  validateSearch: (search: Record<string, unknown>): { project?: ProjectId } => ({
    project:
      search.project === "compact" ||
      search.project === "terrace" ||
      search.project === "two-storey"
        ? search.project
        : undefined,
  }),
  component: ConstructorPage,
});

function ConstructorPage() {
  const { project } = Route.useSearch();

  const projectConfig: HouseConfig =
    project === "compact"
      ? {
          ...DEFAULT_CONFIG,
          length: 7.5,
          width: 7.5,
          area: 56.25,
          floors: 1,
          terrace: false,
          terraceArea: 0,
          balcony: false,
        }
      : project === "terrace"
        ? {
            ...DEFAULT_CONFIG,
            length: 9,
            width: 8.1,
            area: 72.9,
            floors: 1,
            terrace: true,
            terraceArea: 14,
            balcony: false,
          }
        : project === "two-storey"
          ? {
              ...DEFAULT_CONFIG,
              length: 8,
              width: 6.25,
              area: 100,
              floors: 2,
              terrace: false,
              terraceArea: 0,
              balcony: true,
            }
          : DEFAULT_CONFIG;

  const [config, setConfig] = useState<HouseConfig>(() => projectConfig);
  const [lengthInput, setLengthInput] = useState(String(projectConfig.length));
  const [widthInput, setWidthInput] = useState(String(projectConfig.width));
  const [terraceInput, setTerraceInput] = useState(String(projectConfig.terraceArea));
  const parseInput = (value: string) => Number(value.replace(",", "."));
  const update = (patch: Partial<HouseConfig>) =>
    setConfig((current) => ({ ...current, ...patch }));

  return (
    <SiteLayout>
      <section className="container-x py-12">
        <p className="eyebrow">Конструктор дома</p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">Соберите свою комплектацию</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Настройте основные характеристики дома. Результат можно передать в калькулятор для предварительного расчёта.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="card-x space-y-5 p-6">
            <label className="block text-sm font-medium">
              Назначение дома
              <select className="field mt-2" value={config.purpose}
                onChange={(e) => update({ purpose: e.target.value as HouseConfig["purpose"] })}>
                {Object.entries(LABELS.purpose).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Длина, м
                <input className="field mt-2" type="text" inputMode="decimal" value={lengthInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLengthInput(value);
                    const n = parseInput(value);
                    if (value.trim() !== "" && Number.isFinite(n)) update({ length: n });
                  }}
                  onBlur={() => {
                    const n = parseInput(lengthInput);
                    const value = String(Math.min(20, Math.max(4, Number.isFinite(n) && lengthInput.trim() !== "" ? n : config.length)));
                    setLengthInput(value);
                    update({ length: Number(value) });
                  }} />
              </label>
              <label className="block text-sm font-medium">
                Ширина, м
                <input className="field mt-2" type="text" inputMode="decimal" value={widthInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setWidthInput(value);
                    const n = parseInput(value);
                    if (value.trim() !== "" && Number.isFinite(n)) update({ width: n });
                  }}
                  onBlur={() => {
                    const n = parseInput(widthInput);
                    const value = String(Math.min(15, Math.max(4, Number.isFinite(n) && widthInput.trim() !== "" ? n : config.width)));
                    setWidthInput(value);
                    update({ width: Number(value) });
                  }} />
              </label>
            </div>

            <label className="block text-sm font-medium">
              Этажность
              <select className="field mt-2" value={config.floors}
                onChange={(e) => update({ floors: Number(e.target.value) as 1 | 2 })}>
                <option value={1}>Один этаж</option>
                <option value={2}>Два этажа</option>
              </select>
            </label>

            <label className="block text-sm font-medium">
              Фундамент
              <select className="field mt-2" value={config.foundation}
                onChange={(e) => update({ foundation: e.target.value as HouseConfig["foundation"] })}>
                {Object.entries(LABELS.foundation).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </label>

            <label className="block text-sm font-medium">
              Толщина утепления
              <select className="field mt-2" value={config.insulation}
                onChange={(e) => update({ insulation: Number(e.target.value) as HouseConfig["insulation"] })}>
                {[100, 150, 200, 250].map((v) => <option key={v} value={v}>{v} мм</option>)}
              </select>
            </label>

            <label className="block text-sm font-medium">
              Форма крыши
              <select className="field mt-2" value={config.roof}
                onChange={(e) => update({ roof: e.target.value as HouseConfig["roof"] })}>
                {Object.entries(LABELS.roof).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </label>

            <label className="block text-sm font-medium">
              Кровля
              <select className="field mt-2" value={config.roofing}
                onChange={(e) => update({ roofing: e.target.value as HouseConfig["roofing"] })}>
                {Object.entries(LABELS.roofing).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </label>

            <label className="block text-sm font-medium">
              Фасад
              <select className="field mt-2" value={config.facade}
                onChange={(e) => update({ facade: e.target.value as HouseConfig["facade"] })}>
                {Object.entries(LABELS.facade).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </label>

            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={config.terrace} onChange={(e) => update({ terrace: e.target.checked })} />
              Добавить террасу
            </label>

            {config.terrace && (
              <label className="block text-sm font-medium">
                Площадь террасы, м²
                <input className="field mt-2" type="text" inputMode="decimal" value={terraceInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTerraceInput(value);
                    const n = parseInput(value);
                    if (value.trim() !== "" && Number.isFinite(n)) update({ terraceArea: n });
                  }}
                  onBlur={() => {
                    const n = parseInput(terraceInput);
                    const value = String(Math.min(100, Math.max(0, Number.isFinite(n) && terraceInput.trim() !== "" ? n : config.terraceArea)));
                    setTerraceInput(value);
                    update({ terraceArea: Number(value) });
                  }} />
              </label>
            )}
          </div>

          <aside className="card-x h-fit p-6">
            <p className="eyebrow">Ваша конфигурация</p>
            <h2 className="mt-3 text-2xl font-bold">
              {config.length} × {config.width} м
            </h2>
            <p className="mt-2 text-slate-600">
              Площадь по размерам: {(config.length * config.width * config.floors).toLocaleString("ru-RU")} м²
            </p>
            <div className="mt-5 space-y-3 text-sm">
              <p><strong>Назначение:</strong> {LABELS.purpose[config.purpose]}</p>
              <p><strong>Этажи:</strong> {config.floors}</p>
              <p><strong>Фундамент:</strong> {LABELS.foundation[config.foundation]}</p>
              <p><strong>Утепление:</strong> {config.insulation} мм</p>
              <p><strong>Крыша:</strong> {LABELS.roof[config.roof]}</p>
              <p><strong>Кровля:</strong> {LABELS.roofing[config.roofing]}</p>
              <p><strong>Фасад:</strong> {LABELS.facade[config.facade]}</p>
              <p><strong>Терраса:</strong> {config.terrace ? `${config.terraceArea} м²` : "Нет"}</p>
            </div>
            <Link to="/calculator" onClick={() => sessionStorage.setItem("karcason-house-config", JSON.stringify(config))} className="mt-7 inline-flex rounded-full bg-green-800 px-6 py-3 font-semibold text-white">
              Перейти к калькулятору
            </Link>
            <p className="mt-4 text-xs text-slate-500">
              Настройки дома будут переданы в калькулятор для предварительного расчёта.
            </p>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
