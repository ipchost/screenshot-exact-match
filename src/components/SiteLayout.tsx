import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Главная" },
  { to: "/projects", label: "Проекты" },
  { to: "/constructor", label: "Конструктор" },
  { to: "/calculator", label: "Калькулятор" },
  { to: "/customer", label: "Заказчикам" },
  { to: "/brigade", label: "Бригадам" },
] as const;

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f8f3]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#174d3a] text-white shadow-lg shadow-green-950/10">
        <div className="container-x mx-auto flex min-h-[76px] flex-wrap items-center justify-between gap-x-5 gap-y-3 py-3">
          <Link
            to="/"
            className="shrink-0 text-2xl font-extrabold tracking-tight text-white transition hover:opacity-90"
          >
            Каркас<span className="text-lime-300">ON</span>
            <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-green-100/75">
              Дома для жизни
            </span>
          </Link>

          <nav
            aria-label="Основная навигация"
            className="order-3 grid w-full grid-cols-3 gap-2 text-center text-xs font-semibold sm:flex sm:w-auto sm:flex-1 sm:flex-wrap sm:justify-end sm:gap-x-4 sm:text-sm"
          >
            {links.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-lg px-2 py-2 text-green-50 transition hover:bg-white/10 hover:text-lime-200 sm:px-1"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/constructor"
            className="ml-auto inline-flex shrink-0 items-center justify-center rounded-full bg-lime-300 px-4 py-2.5 text-sm font-bold text-green-950 shadow-sm transition hover:bg-lime-200 sm:ml-0"
          >
            Подобрать дом <span className="ml-1" aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 bg-[#102c23] py-9 text-white">
        <div className="container-x mx-auto flex flex-wrap justify-between gap-5 text-sm">
          <div>
            <Link to="/" className="text-xl font-extrabold tracking-tight">
              Каркас<span className="text-lime-300">ON</span>
            </Link>
            <p className="mt-2 max-w-md leading-relaxed text-green-100/75">
              Платформа для выбора проектов каркасных домов и поиска строительных бригад.
            </p>
          </div>
          <p className="max-w-sm self-end leading-relaxed text-green-100/60">
            Предварительные расчёты не являются публичной офертой.
          </p>
        </div>
      </footer>
    </div>
  );
}
