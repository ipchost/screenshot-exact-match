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
    setStatus("Отправляем заявку...");

    const payload = {
      type: "brigade",
      name: String(form.get("name") || ""),
      region: String(form.get("region") || ""),
      specialty: String(form.get("specialty") || ""),
      experience: String(form.get("experience") || ""),
      phone: "+7" + String(form.get("phone") || ""),
      consent: checked,
      submitted_at: new Date().toISOString(),
      page_url: window.location.href,
      referrer: document.referrer || "Прямой переход или источник скрыт",
      user_agent: navigator.userAgent,
      language: navigator.language || "Не определён",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Не определён",
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      platform: navigator.platform || "Не определена",
      website: "",
    };

    try {
      const response = await fetch("https://sterling-repository-introduction-wondering.trycloudflare.com/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Не удалось отправить заявку.");
      }
      setStatus("success");
      formElement.reset();
      setChecked(false);
    } catch (error) {
      console.error("Ошибка отправки заявки:", error);
      setStatus("Не удалось отправить заявку. Проверьте подключение и попробуйте позже.");
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
            <div className="mt-2 flex">
              <span className="flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 px-4 font-semibold text-slate-700">+7</span>
              <input
                className="field mt-0 min-w-0 rounded-l-none"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                required
                maxLength={10}
                pattern="9[0-9]{9}"
                title="Введите 10 цифр российского номера, начиная с 9"
                placeholder="9123456789"
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").replace(/^7/, "").replace(/^8/, "").slice(0, 10);
                  e.target.value = digits;
                }}
              />
            </div>
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
            Нажимая кнопку, ты отправляешь заявку оператору платформы для связи по указанному телефону.
          </p>

          <button
            type="submit"
            disabled={status === "success" || status === "Отправляем заявку..."}
            className="rounded-full bg-green-800 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "success" ? "Заявка отправлена ✓" : status === "Отправляем заявку..." ? "Отправляем..." : "Отправить заявку"}
          </button>

          {status === "success" ? (
            <p role="status" className="rounded-xl bg-green-50 p-4 text-sm text-green-900">
              Спасибо за заявку! Мы рассмотрим её в ближайшее время и свяжемся с вами по указанному телефону.
            </p>
          ) : status ? (
            <p role="status" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-950">{status}</p>
          ) : null}
        </form>
      </section>
    </SiteLayout>
  );
}
