import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/customer")({
  component: CustomerPage,
});

function CustomerPage() {
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    setStatus("Отправляем заявку...");

    const payload = new FormData();
    payload.append("name", String(form.get("name") || ""));
    payload.append("phone", "+7" + String(form.get("phone") || ""));
    payload.append("location", String(form.get("location") || ""));
    payload.append("area", String(form.get("area") || ""));
    payload.append("time", String(form.get("time") || ""));
    payload.append("details", String(form.get("details") || ""));
    payload.append("consent", checked ? "Да" : "Нет");
    payload.append("submitted_at", new Date().toISOString());
    payload.append("page_url", window.location.href);
    payload.append("referrer", document.referrer || "Прямой переход или источник скрыт");
    payload.append("user_agent", navigator.userAgent);
    payload.append("language", navigator.language || "Не определён");
    payload.append("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone || "Не определён");
    payload.append("screen_resolution", `${window.screen.width}x${window.screen.height}`);
    payload.append("viewport", `${window.innerWidth}x${window.innerHeight}`);
    payload.append("platform", navigator.platform || "Не определена");
    payload.append("_subject", "Новая заявка заказчика | Каркасон");

    try {
      const response = await fetch("https://formspree.io/f/xrppkgpk", {
        method: "POST",
        body: payload,
        headers: { "Accept": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.errors?.map((item: { message: string }) => item.message).join(", ")
          || "Не удалось отправить заявку. Проверьте настройки Formspree."
        );
      }

      setStatus("success");
      formElement.reset();
      setChecked(false);
    } catch {
      setStatus("Не удалось отправить заявку. Проверьте подключение к интернету и попробуйте позже.");
    }
  }
  return (
    <SiteLayout>
      <section className="container-x py-12">
        <p className="eyebrow">Для заказчиков</p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          Расскажите, какой дом Вам нужен
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Укажите основные параметры дома и участка. Отправленная заявка поступит оператору платформы для дальнейшей связи с Вами.
        </p>

        <form onSubmit={submit} className="card-x mt-8 max-w-3xl space-y-5 p-6 md:p-8">
          <label className="block text-sm font-medium">
            Как к Вам обращаться *
            <input className="field mt-2" name="name" required maxLength={100} placeholder="Имя" />
          </label>

          <label className="block text-sm font-medium">
            Телефон *
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
            Где планируется строительство?
            <input className="field mt-2" name="location" maxLength={150} placeholder="Населённый пункт, район" />
          </label>

          <label className="block text-sm font-medium">
            Примерная площадь дома
            <select className="field mt-2" name="area" defaultValue="60-90">
              <option value="до-60">До 60 м²</option>
              <option value="60-90">60–90 м²</option>
              <option value="90-120">90–120 м²</option>
              <option value="120+">Более 120 м²</option>
              <option value="unknown">Пока не знаю</option>
            </select>
          </label>

          <label className="block text-sm font-medium">
            Когда Вы планируете строительство?
            <select className="field mt-2" name="time" defaultValue="3-6">
              <option value="urgent">Как можно скорее</option>
              <option value="1-3">В течение 1–3 месяцев</option>
              <option value="3-6">В течение 3–6 месяцев</option>
              <option value="later">Позже, изучаю варианты</option>
            </select>
          </label>

          <label className="block text-sm font-medium">
            Дополнительные пожелания
            <textarea className="field mt-2" name="details" rows={4} maxLength={2000}
              placeholder="Комплектация, участок, бюджет и другие требования" />
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
            Нажимая кнопку, Вы отправляете заявку оператору платформы для связи по указанному телефону.
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
