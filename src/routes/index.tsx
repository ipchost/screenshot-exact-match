import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Menu,
  X,
  Ruler,
  ShieldCheck,
  Hammer,
} from "lucide-react";
import hero from "../assets/hero.jpg";
import compact from "../assets/house-compact.jpg";
import terrace from "../assets/house-terrace.jpg";
import twoStorey from "../assets/house-two-storey.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const projects = [
  {
    number: "01",
    name: "Компактный",
    size: "от 60 м²",
    image: compact,
    text: "Продуманное пространство для загородной жизни",
  },
  {
    number: "02",
    name: "С террасой",
    size: "от 90 м²",
    image: terrace,
    text: "Больше света, воздуха и места для отдыха",
  },
  {
    number: "03",
    name: "Два этажа",
    size: "от 120 м²",
    image: twoStorey,
    text: "Просторный дом для большой семьи",
  },
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f7f6f0] text-[#182b22]">
      <section
        className="relative isolate flex min-h-[100svh] flex-col bg-[#182b22] text-white"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(10,25,18,.82) 0%, rgba(10,25,18,.54) 48%, rgba(10,25,18,.12) 100%), linear-gradient(0deg, rgba(10,25,18,.48) 0%, transparent 45%), url("${hero}")`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <header className="relative z-30 border-b border-white/20">
          <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:min-h-[88px] lg:px-12">
            <a
              href="#top"
              onClick={closeMenu}
              className="flex shrink-0 items-center gap-3"
              aria-label="КаркасON — главная"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#b9ef65] text-[#183322] sm:h-12 sm:w-12">
                <span className="text-2xl font-black">К</span>
              </span>
              <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
                Каркас<span className="text-[#b9ef65]">ON</span>
              </span>
            </a>

            <nav className="hidden items-center gap-7 text-sm font-semibold text-white/90 lg:flex xl:gap-9">
              <a className="transition hover:text-[#c7f58c]" href="#projects">Проекты</a>
              <a className="transition hover:text-[#c7f58c]" href="/screenshot-exact-match/constructor">Конструктор</a>
              <a className="transition hover:text-[#c7f58c]" href="/screenshot-exact-match/calculator">Калькулятор</a>
              <a className="transition hover:text-[#c7f58c]" href="/screenshot-exact-match/customer">Заказчику</a>
              <a className="transition hover:text-[#c7f58c]" href="/screenshot-exact-match/brigade">Бригадам</a>
            </nav>

            <a
              href="#projects"
              className="hidden rounded-full bg-[#b9ef65] px-5 py-3 text-sm font-extrabold text-[#183322] transition hover:bg-white lg:inline-flex"
            >
              Найти свой дом <ArrowRight className="ml-2" size={17} />
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white lg:hidden"
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>

          {menuOpen && (
            <nav className="absolute left-0 right-0 top-full z-40 grid gap-1 border-b border-white/15 bg-[#183322] p-4 shadow-2xl lg:hidden">
              {[
                ["Проекты", "#projects"],
                ["Конструктор", "/screenshot-exact-match/constructor"],
                ["Калькулятор", "/screenshot-exact-match/calculator"],
                ["Заказчику", "/screenshot-exact-match/customer"],
                ["Бригадам", "/screenshot-exact-match/brigade"],
                ["Преимущества", "#advantages"],
                ["Как это работает", "#how"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 font-semibold text-white hover:bg-white/10"
                >
                  {label}
                </a>
              ))}
              <a
                href="#projects"
                onClick={closeMenu}
                className="mt-2 rounded-xl bg-[#b9ef65] px-4 py-3 text-center font-extrabold text-[#183322]"
              >
                Подобрать дом
              </a>
            </nav>
          )}
        </header>

        <div id="top" className="mx-auto flex w-full max-w-[1440px] flex-1 items-center px-5 pb-14 pt-14 sm:px-8 sm:pb-16 sm:pt-20 lg:px-12 lg:pb-20">
          <div className="w-full max-w-4xl">
            <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/35 bg-black/20 px-4 py-2.5 text-xs font-semibold leading-5 text-white backdrop-blur-md sm:text-sm">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#b9ef65]" />
              Санкт-Петербург и Ленинградская область
            </div>

            <h1 className="max-w-4xl text-[clamp(2.7rem,8vw,6.8rem)] font-black leading-[.99] tracking-[-.055em]">
              Дом, который
              <br />
              <span className="text-[#c7f58c]">начинается</span>
              <br />
              с вашей идеи.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/90 sm:mt-8 sm:text-lg sm:leading-8 lg:text-xl">
              Выберите проект каркасного дома, соберите комплектацию и
              рассчитайте предварительную стоимость строительства.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row">
              <a
                href="#projects"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#b9ef65] px-7 py-4 text-base font-extrabold text-[#183322] shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-white sm:min-w-[220px]"
              >
                Выбрать проект <ArrowRight size={19} />
              </a>
              <a
                href="#how"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/65 bg-black/20 px-7 py-4 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                Как это работает
              </a>
            </div>

            <div className="mt-9 grid max-w-2xl grid-cols-1 gap-3 text-sm font-semibold text-white sm:grid-cols-3 sm:gap-4">
              {[
                "Понятная структура сметы",
                "Выбор комплектации",
                "Бригады вашего региона",
              ].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <Check className="shrink-0 text-[#c7f58c]" size={18} />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <a
          href="#projects"
          className="mx-auto mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-white/80 transition hover:text-[#c7f58c] sm:mb-7"
        >
          Исследовать проекты <ArrowDown size={15} />
        </a>
      </section>

      <section id="projects" className="scroll-mt-6 bg-[#f7f6f0] py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[.22em] text-[#397444] sm:text-sm">
                Пространство для вашей жизни
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-.04em] sm:text-4xl lg:text-5xl">
                Найдите дом под свой сценарий
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#4d5b51] sm:text-lg sm:leading-8">
                Несколько отправных идей. Площадь, планировку и комплектацию
                нужно будет уточнить при расчёте.
              </p>
            </div>
            <span className="w-fit rounded-full bg-[#dff5c8] px-4 py-2 text-sm font-bold text-[#244b30]">
              Примеры проектов
            </span>
          </div>

          <div className="mt-9 grid gap-5 sm:mt-12 sm:grid-cols-2 xl:grid-cols-3 xl:gap-7">
            {projects.map((project) => (
              <article
                key={project.number}
                className="group min-w-0 overflow-hidden rounded-2xl border border-[#dce2d7] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={`Пример каркасного дома: ${project.name}`}
                    loading="lazy"
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.04] sm:h-64"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-[#183322]/90 px-3 py-1.5 text-xs font-bold text-white">
                    ПРОЕКТ {project.number}
                  </span>
                  <span className="absolute bottom-4 right-4 rounded-full bg-[#c7f58c] px-3 py-2 text-sm font-extrabold text-[#183322]">
                    {project.size}
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-2xl font-extrabold tracking-tight">{project.name}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-[#526056] sm:text-base">
                    {project.text}
                  </p>
                  <a
                    href="#how"
                    className="mt-5 inline-flex items-center gap-2 font-extrabold text-[#28653a] transition hover:text-[#153d24]"
                  >
                    Обсудить проект <ArrowRight size={18} />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-xs leading-5 text-[#58635a]">
            Площади ориентировочные. Карточки демонстрируют варианты домов и
            не являются готовым архитектурным проектом или коммерческим предложением.
          </p>
        </div>
      </section>

      <section id="advantages" className="scroll-mt-6 bg-[#173c29] py-16 text-white sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[.22em] text-[#c7f58c] sm:text-sm">
              Всё по полочкам
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-.04em] sm:text-4xl lg:text-5xl">
              Сначала понимание. Потом строительство.
            </h2>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Ruler,
                number: "01",
                title: "Продумайте параметры",
                body: "Площадь, этажность, фундамент, утепление, фасад и инженерные системы.",
              },
              {
                icon: ShieldCheck,
                number: "02",
                title: "Разберите смету",
                body: "Материалы и работы отдельными позициями. Непроверенные цены отмечаются отдельно.",
              },
              {
                icon: Hammer,
                number: "03",
                title: "Подготовьте заявку",
                body: "Соберите требования к дому, бюджет и сроки для дальнейшего обсуждения с бригадой.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.number} className="rounded-2xl border border-white/15 bg-white/[.06] p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <Icon size={29} className="text-[#c7f58c]" />
                    <span className="text-sm font-bold text-white/50">{item.number}</span>
                  </div>
                  <h3 className="mt-7 text-xl font-extrabold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/80 sm:text-base">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-6 bg-[#e8f4df] py-16 sm:py-20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-7 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[.22em] text-[#397444] sm:text-sm">
              Следующий шаг
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-.04em] sm:text-4xl lg:text-5xl">
              Дом начинается не со стройки, а с хорошего плана.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#3f5144] sm:text-lg sm:leading-8">
              Конструктор и подробная предварительная смета станут основой для
              технического задания и разговора со строительной бригадой.
            </p>
          </div>
          <a
            href="#projects"
            className="inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-full bg-[#246638] px-7 py-4 font-extrabold text-white transition hover:bg-[#173c29]"
          >
            Вернуться к проектам <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section id="teams" className="scroll-mt-6 bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[.22em] text-[#397444] sm:text-sm">
              Для строительных бригад
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-.04em] sm:text-4xl">
              Покажите свои проекты будущим заказчикам
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4d5b51] sm:text-lg">
              Платформа предназначена для знакомства заказчиков и строительных
              бригад в Санкт-Петербурге и Ленинградской области.
            </p>
          </div>
          <a
            href="mailto:info@example.com"
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border-2 border-[#246638] px-6 py-4 font-extrabold text-[#246638] transition hover:bg-[#e8f4df]"
          >
            Связаться с платформой <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <footer className="bg-[#10291c] py-8 text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 text-sm text-white/75 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <a href="#top" className="text-lg font-black text-white">
            Каркас<span className="text-[#c7f58c]">ON</span>
          </a>
          <span>Площадка для выбора проектов и поиска строительных бригад</span>
          <span>Санкт-Петербург · Ленинградская область</span>
        </div>
      </footer>
    </main>
  );
}
