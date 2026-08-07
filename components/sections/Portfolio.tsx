"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { Lightbox } from "@/components/ui/Lightbox";
import { PROJECTS, type ProjectClient } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Market } from "@/lib/group/market";

// Widened with `| "PY"`: today every real obra in lib/portfolio-data.ts is
// "BR" (no Paraguay obra exists yet), so TS would otherwise infer this type
// as the single literal "BR" and reject the "PY" branches below. Once a real
// PY obra is added via scripts/portfolio-overrides.json, `(typeof
// PROJECTS)[number]["country"]` will include "PY" natively and this union
// becomes redundant (harmless to leave).
type ProjectCountry = (typeof PROJECTS)[number]["country"] | "PY";

const CLIENT_FILTERS: Array<{ label: string; value: ProjectClient | "Todas" }> = [
  { label: "Todas", value: "Todas" },
  { label: "C.Vale", value: "C.Vale" },
  { label: "Copacol", value: "Copacol" },
];

type CountryFilterOption = { label: string; value: ProjectCountry | "Todos" };

const COPY: Record<
  Market,
  {
    eyebrow: string;
    title: React.ReactNode;
    description: string;
    countryFilters: CountryFilterOption[];
    attributionNote: string;
    countryBadge: Record<ProjectCountry, string>;
  }
> = {
  br: {
    eyebrow: "Portfólio",
    title: (
      <>
        Obras que mostram{" "}
        <span className="text-brand-600">nossa escala</span>.
      </>
    ),
    description:
      "Projetos entregues pelo Grupo Centra no Brasil e no Paraguai — cada um com seu registro fotográfico.",
    countryFilters: [
      { label: "Todos os países", value: "Todos" },
      { label: "Brasil", value: "BR" },
      { label: "Paraguai", value: "PY" },
    ],
    attributionNote: "Obras executadas pelo Grupo Centra no Brasil.",
    countryBadge: { BR: "Executado no Brasil", PY: "Executado no Paraguai" },
  },
  py: {
    eyebrow: "Portafolio",
    title: (
      <>
        Obras que muestran{" "}
        <span className="text-brand-600">nuestra escala</span>.
      </>
    ),
    description:
      "Proyectos entregados por el Grupo Centra en Brasil y Paraguay — cada uno con su registro fotográfico.",
    countryFilters: [
      { label: "Todos los países", value: "Todos" },
      { label: "Brasil", value: "BR" },
      { label: "Paraguay", value: "PY" },
    ],
    attributionNote: "Obras ejecutadas por el Grupo Centra en Brasil.",
    countryBadge: { BR: "Ejecutado en Brasil", PY: "Ejecutado en Paraguay" },
  },
};

type PortfolioProps = {
  market: Market;
  showAttributionNote?: boolean;
};

export function Portfolio({ market, showAttributionNote = false }: PortfolioProps) {
  const copy = COPY[market];
  const [clientFilter, setClientFilter] = useState<ProjectClient | "Todas">("Todas");
  const [countryFilter, setCountryFilter] = useState<ProjectCountry | "Todos">("Todos");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const projects = PROJECTS.filter(
    (p) =>
      (clientFilter === "Todas" || p.client === clientFilter) &&
      (countryFilter === "Todos" || p.country === countryFilter),
  );

  const activeProject = PROJECTS.find((p) => p.slug === activeSlug) ?? null;

  return (
    <section className="relative bg-paper py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          as="h1"
          index="01"
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
        />

        {showAttributionNote && (
          <Reveal className="mt-6">
            <p className="rounded-xl border border-hair bg-paper-2 px-4 py-3 text-sm text-ink-soft">
              {copy.attributionNote}
            </p>
          </Reveal>
        )}

        {/* Sticky wrapper must NOT be nested inside the Reveal motion.div:
            framer-motion leaves an inline transform on its element after
            animating (even translateY(0)), which creates a new containing
            block and silently breaks `position: sticky` on descendants. */}
        <div className="sticky top-[70px] z-20 -mx-6 mt-10 flex flex-col gap-2 overflow-x-auto bg-paper px-6 pb-1 md:mx-0 md:px-0">
          <Reveal className="flex gap-2">
            {CLIENT_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setClientFilter(f.value)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  clientFilter === f.value
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-hair bg-surface text-ink-soft hover:border-brand-200 hover:text-ink",
                )}
              >
                {f.label}
              </button>
            ))}
          </Reveal>
          <Reveal className="flex gap-2">
            {copy.countryFilters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setCountryFilter(f.value)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  countryFilter === f.value
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-hair bg-surface text-ink-soft hover:border-brand-200 hover:text-ink",
                )}
              >
                {f.label}
              </button>
            ))}
          </Reveal>
        </div>

        <RevealStagger
          key={`${clientFilter}-${countryFilter}`}
          className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          gap={0.05}
        >
          {projects.map((project, index) => (
            <RevealItem key={project.slug}>
              <button
                type="button"
                onClick={(e) => {
                  triggerRef.current = e.currentTarget;
                  setActiveSlug(project.slug);
                  setActiveIndex(0);
                }}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-hair bg-paper-2 text-left"
              >
                {/* Sem placeholder="blur": imagens vêm de public/ por caminho de string (não import estático) — ver docs/superpowers/specs/2026-07-28-portfolio-obras-design.md */}
                <Image
                  src={project.images[0]}
                  alt={`${project.client} — ${project.title}`}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  priority={index === 0}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="hud rounded-full border border-white/15 bg-ink-950/40 px-3 py-1.5 text-white/80 backdrop-blur-sm">
                    {project.client}
                  </span>
                  <span className="hud rounded-full border border-white/15 bg-ink-950/40 px-3 py-1.5 text-white/80 backdrop-blur-sm">
                    {copy.countryBadge[project.country]}
                  </span>
                </div>
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2">
                  <h3 className="text-lg font-semibold leading-tight text-white">
                    {project.title}
                  </h3>
                  {project.images.length > 1 && (
                    <span className="hud flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-ink-950/40 px-2.5 py-1.5 text-white/80 backdrop-blur-sm">
                      <ImageIcon className="h-3 w-3" />
                      {project.images.length}
                    </span>
                  )}
                </div>
              </button>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>

      {activeProject && (
        <Lightbox
          images={activeProject.images}
          title={`${activeProject.client} — ${activeProject.title}`}
          index={activeIndex}
          onClose={() => {
            setActiveSlug(null);
            triggerRef.current?.focus();
          }}
          onIndexChange={setActiveIndex}
        />
      )}
    </section>
  );
}
