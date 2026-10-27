import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/brigade")({
  component: BrigadePage,
});

function BrigadePage() {
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    setStatus("Отправляем анкету...");
    try {
      const response = await fetch("https://sterling-repository-introduction-wondering.trycloudflare.com/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "brigade",
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      region: String(form.get("region") || ""),
      specialty: String(form.get("specialty") || ""),
      experience: String(form.get("experience") || ""), 
          consent: checked,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Не удалось отправить анкету");
      }
      setStatus(`Заявка отправлена! Номер: ${result.requestId}`);
      e.currentTarget.reset();
      setChecked(false);
    } catch (error) {
      setStatus(error instanceof Error
        ? error.message
        : "Ошибка отправки. Попробуйте позже.");
    }
  }

  return (
    <SiteLayout>
      <section className="container-x py-12">
        <p className="eyebrow">Для строительных бригад</p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          Расскажи о своей бригаде
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Укажи специализацию, географию работы и опыт. Платформа предназначена
          для знакомства заказчиков и исполнителей, а не выступает подрядчиком.
        </p>

        <form onSubmit={submit} className="card-x mt-8 max-w-3xl space-y-5 p-6 md:p-8">
          <label className="block text-sm font-medium">
            Название бригады или имя представителя *
            <input className="field mt-2" name="name" required maxLength={120} />
          </label>

          <label className="block text-sm font-medium">
            Контактный телефон *
            <input className="field mt-2" name="phone" type="tel" required maxLength={30} placeholder="+7 ..." />
          </label>

          <label className="block text-sm font-medium">
            Где работаете?
            <input className="field mt-2" name="region" maxLength={150}
              placeholder="Город, районы, Ленинградская область" />
          </label>

          <label className="block text-sm font-medium">
            Основная специализация
            <select className="field mt-2" name="specialty" defaultValue="turnkey">
              <option value="frame">Каркас и силовая конструкция</option>
              <option value="shell">Тёплый контур</option>
              <option value="finish">Внутренняя отделка</option>
              <option value="engineering">Инженерные системы</option>
              <option value="turnkey">Дома под ключ</option>
              <option value="foundation">Фундаменты</option>
            </select>
          </label>

          <label className="block text-sm font-medium">
            Опыт и примеры работ
            <textarea className="field mt-2" name="experience" rows={4} maxLength={2000}
              placeholder="Опыт, состав бригады, ссылки на портфолио" />
          </label>

          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1" required checked={checked}
              onChange={(e) => setChecked(e.target.checked)} />
            <span>
              Я согласен на обработку персональных данных после ознакомления
              с политикой обработки данных. *
            </span>
          </label>

          <p className="text-sm text-amber-800">
            Демонстрационная форма. Политика обработки данных и сервер ещё не
            подключены. Не вводи реальные персональные данные.
          </p>

          <button type="submit" className="rounded-full bg-green-800 px-6 py-3 font-semibold text-white">
            Отправить заявку
          </button>

          {status && <p role="status" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-950">{status}</p>}
        </form>
      </section>
    </SiteLayout>
  );
}
