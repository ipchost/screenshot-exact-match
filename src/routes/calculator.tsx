import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { DEFAULT_CONFIG, LABELS, compatibilityWarnings, type HouseConfig, type PackageId } from "@/lib/config";
import { calculate, rub, num } from "@/lib/estimate";

export const Route = createFileRoute("/calculator")({
  component: CalculatorPage,
});
function CalculatorPage() {
  const [config, setConfig] = useState<HouseConfig>(DEFAULT_CONFIG);
  const [pkg, setPkg] = useState<PackageId>(DEFAULT_CONFIG.package);
  const [loadedSavedConfig, setLoadedSavedConfig] = useState(false);
  const [lengthInput, setLengthInput] = useState(String(DEFAULT_CONFIG.length));
  const [widthInput, setWidthInput] = useState(String(DEFAULT_CONFIG.width));
  const parseInput = (value: string) => Number(value.replace(",", "."));

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("karcason-house-config");
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<HouseConfig>;
        const next = { ...DEFAULT_CONFIG, ...parsed };
        setConfig(next);
        setLengthInput(String(next.length));
        setWidthInput(String(next.width));
        setPkg(next.package);
        sessionStorage.removeItem("karcason-house-config");
      }
    } catch {
      // Если сохранённые настройки повреждены, используем стандартные.
    }
    setLoadedSavedConfig(true);
  }, []);

  const estimate = useMemo(() => calculate(config, pkg), [config, pkg]);
  const warnings = compatibilityWarnings({ ...config, package: pkg });
  const update = (patch: Partial<HouseConfig>) =>
    setConfig((current) => ({ ...current, ...patch }));

  return (
    <SiteLayout>
      <section className="container-x py-12">
        <p className="eyebrow">Предварительная смета</p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">Калькулятор стоимости</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Меняйте основные параметры и сравнивайте комплектации. Расчёт использует демонстрационный каталог цен и не является коммерческим предложением.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div className="card-x space-y-6 p-6">
            <h2 className="text-2xl font-bold">Параметры дома</h2>

            <label className="block text-sm font-medium">
              Длина, м
              <input className="field mt-2" type="text" inputMode="decimal" value={lengthInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setLengthInput(value);
                  const n = parseInput(value);
                  if (value.trim() !== "" && Number.isFinite(n)) {
                    update({ length: n, area: n * config.width * config.floors });
                  }
                }}
                onBlur={() => {
                  const n = parseInput(lengthInput);
                  const value = String(Math.min(20, Math.max(4, Number.isFinite(n) && lengthInput.trim() !== "" ? n : config.length)));
                  setLengthInput(value);
                  update({ length: Number(value), area: Number(value) * config.width * config.floors });
                }} />
            </label>

            <label className="block text-sm font-medium">
              Ширина, м
              <input className="field mt-2" type="text" inputMode="decimal" value={widthInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setWidthInput(value);
                  const n = parseInput(value);
                  if (value.trim() !== "" && Number.isFinite(n)) {
                    update({ width: n, area: config.length * n * config.floors });
                  }
                }}
                onBlur={() => {
                  const n = parseInput(widthInput);
                  const value = String(Math.min(15, Math.max(4, Number.isFinite(n) && widthInput.trim() !== "" ? n : config.width)));
                  setWidthInput(value);
                  update({ width: Number(value), area: config.length * Number(value) * config.floors });
                }} />
            </label>

            <label className="block text-sm font-medium">
              Этажность
              <select className="field mt-2" value={config.floors}
                onChange={(e) => {
                  const floors = Number(e.target.value) as 1 | 2;
                  update({ floors, area: config.length * config.width * floors });
                }}>
                <option value={1}>1 этаж</option>
                <option value={2}>2 этажа</option>
              </select>
            </label>

            <label className="block text-sm font-medium">
              Утепление
              <select className="field mt-2" value={config.insulation}
                onChange={(e) => update({ insulation: Number(e.target.value) as HouseConfig["insulation"] })}>
                {[100, 150, 200, 250].map((v) => <option key={v} value={v}>{v} мм</option>)}
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
              Комплектация
              <select className="field mt-2" value={pkg} onChange={(e) => setPkg(e.target.value as PackageId)}>
                {Object.entries(LABELS.package).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </label>
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl bg-green-950 p-7 text-white">
              <p className="text-sm text-green-100">Предварительная стоимость</p>
              <p className="mt-3 text-4xl font-bold">{rub(estimate.totals.total)}</p>
              <p className="mt-3 text-sm text-green-100">
                Ориентировочный диапазон: {rub(estimate.totals.min)} – {rub(estimate.totals.max)}
              </p>
              <div className="mt-5 border-t border-white/20 pt-4 text-sm">
                Площадь по размерам: {num(estimate.geometry.floorArea)} м²
                <br />
                Примерно {rub(estimate.totals.perM2)} за м²
              </div>
            </div>

            <div className="card-x p-6">
              <h2 className="text-xl font-bold">Структура сметы</h2>
              {[
                ["Материалы", estimate.totals.materials],
                ["Работы", estimate.totals.works],
                ["Инженерия", estimate.totals.engineering],
                ["Доставка", estimate.totals.delivery],
                ["Организация", estimate.totals.organization],
                ["Резерв", estimate.totals.reserve],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between gap-3 border-b py-3 text-sm last:border-0">
                  <span className="text-slate-600">{label}</span>
                  <strong>{rub(Number(value))}</strong>
                </div>
              ))}
              {estimate.totals.unpriced > 0 && (
                <p className="mt-3 text-sm text-amber-800">
                  Позиций без цены: {estimate.totals.unpriced}. Итог может быть неполным.
                </p>
              )}
            </div>

            {warnings.length > 0 && (
              <div className="rounded-2xl bg-amber-50 p-5 text-sm text-amber-950">
                <h3 className="font-bold">Проверьте конфигурацию</h3>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  {warnings.map((warning) => <li key={warning}>{warning}</li>)}
                </ul>
              </div>
            )}

            <Link to="/customer" className="inline-flex rounded-full bg-green-800 px-6 py-3 font-semibold text-white">
              Обсудить проект
            </Link>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
