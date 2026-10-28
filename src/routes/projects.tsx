import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import compactImage from "@/assets/house-compact.jpg";
import terraceImage from "@/assets/house-terrace.jpg";
import twoStoreyImage from "@/assets/house-two-storey.jpg";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

const projects = [
  {
    id: "compact",
    name: "Компактный",
    area: "Около 55 м²",
    floors: "1 этаж",
    rooms: "Для небольшой семьи или дачи",
    image: compactImage,
    description: "Практичная планировка без лишней площади.",
  },
  {
    id: "terrace",
    name: "Дом с террасой",
    area: "Около 73 м²",
    floors: "1 этаж",
    rooms: "Для отдыха и постоянного проживания",
    image: terraceImage,
    description: "Общая зона и место для отдыха на свежем воздухе.",
  },
  {
    id: "two-storey",
    name: "Двухэтажный",
    area: "Около 100 м²",
    floors: "2 этажа",
    rooms: "Больше пространства на небольшом участке",
    image: twoStoreyImage,
    description: "Разделение общей зоны и приватных комнат.",
  },
];

function ProjectsPage() {
  return (
    <SiteLayout>
      <section className="container-x py-12 md:py-16">
        <p className="eyebrow">Каталог проектов</p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          Выбери дом под свою задачу
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-600">
          Сравни варианты по площади и планировке. Характеристики и стоимость
          уточняются при настройке комплектации.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.name} className="card-x overflow-hidden">
              <img
                src={project.image}
                alt={`Каркасный дом: ${project.name}`}
                className="h-56 w-full object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="chip">{project.area}</span>
                  <span className="chip">{project.floors}</span>
                </div>
                <h2 className="mt-4 text-2xl font-bold">{project.name}</h2>
                <p className="mt-2 text-slate-600">{project.description}</p>
                <p className="mt-3 text-sm text-slate-500">{project.rooms}</p>
                <Link
                  to="/constructor"
                  search={{ project: project.id }}
                  className="mt-6 inline-flex rounded-full bg-green-800 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  Настроить проект
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-amber-50 p-5 text-sm text-amber-950">
          Площади ориентировочные, карточки демонстрационные. Это не готовые
          рабочие проекты и не подтверждённые цены строительства.
        </div>
      </section>
    </SiteLayout>
  );
}
