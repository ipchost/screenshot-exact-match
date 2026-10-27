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
    try {
      const response = await fetch("https://sterling-repository-introduction-wondering.trycloudflare.com/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "customer",
          name: String(form.get("name") || ""),
          phone: String(form.get("phone") || ""),
          location: String(form.get("location") || ""),
          area: String(form.get("area") || ""),
          time: String(form.get("time") || ""),
          details: String(form.get("details") || ""),
          consent: checked,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Не удалось отправить заявку");
      }
      setStatus("success");
      formElement.reset();
      setChecked(false);
    } catch (error) {
      setStatus(error instanceof Error
        ? error.message
        : "Не удалось отправить заявку. Попробуйте позже.");
    }
  }

  return (
    <SiteLayout>
      <section className="container-x py-12">
        <p className="eyebrow">Для заказчиков</p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          Расскажи, какой дом тебе нужен
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Подготовь исходные данные о доме и участке. После подключения сервера
          анкету можно будет передавать строительным бригадам.
        </p>

        <form onSubmit={submit} className="card-x mt-8 max-w-3xl space-y-5 p-6 md:p-8">
          <label className="block text-sm font-medium">
            Как к тебе обращаться *
            <input className="field mt-2" name="name" required maxLength={100} placeholder="Имя" />
          </label>

          <label className="block text-sm font-medium">
            Телефон *
            <input className="field mt-2" name="phone" type="tel" required maxLength={30} placeholder="+7 ..." />
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
            Когда планируешь строительство?
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
