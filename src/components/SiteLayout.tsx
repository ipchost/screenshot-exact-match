import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Главная" },
  { to: "/projects", label: "Проекты" },
  { to: "/constructor", label: "Конструктор" },
  { to: "/calculator", label: "Калькулятор" },
  { to: "/customer", label: "Заказчику" },
  { to: "/brigade", label: "Бригаде" },
] as const;

export function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="container-x flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-green-800">
            Каркас<span className="text-lime-600">ON</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
            {links.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-slate-700 transition hover:text-green-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 bg-slate-950 py-8 text-white">
        <div className="container-x flex flex-wrap justify-between gap-4 text-sm">
          <div>
            <div className="text-lg font-bold">
              Каркас<span className="text-lime-400">ON</span>
            </div>
            <p className="mt-2 max-w-md text-slate-300">
              Платформа для выбора проектов каркасных домов и поиска строительных бригад.
            </p>
          </div>
          <p className="text-slate-400">
            Предварительные расчёты не являются публичной офертой.
          </p>
        </div>
      </footer>
    </div>
  );
}
