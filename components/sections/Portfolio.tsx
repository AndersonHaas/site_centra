"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { Lightbox } from "@/components/ui/Lightbox";
import { PROJECTS, type ProjectClient } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { ProjectCountry } from "@/lib/group/types";

/* Nomes de cliente são nomes próprios — não passam pelo catálogo. */
const CLIENT_VALUES: Array<ProjectClient | "Todas"> = ["Todas", "C.Vale", "Copacol"];
const COUNTRY_VALUES: Array<ProjectCountry | "Todos"> = ["Todos", "BR", "PY"];

type PortfolioProps = {
  showAttributionNote?: boolean;
};

export function Portfolio({ showAttributionNote = false }: PortfolioProps) {
  const t = useTranslations("portfolio");
  const [clientFilter, setClientFilter] = useState<ProjectClient | "Todas">("Todas");
  const [countryFilter, setCountryFilter] = useState<ProjectCountry | "Todos">("Todos");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const countryLabel: Record<ProjectCountry | "Todos", string> = {
    Todos: t("allCountries"),
    BR: t("brazil"),
    PY: t("paraguay"),
  };
  const countryBadge: Record<ProjectCountry, string> = {
    BR: t("badgeBR"),
    PY: t("badgePY"),
  };

  const projects = PROJECTS.filter(
    (p) =>
      (clientFilter === "Todas" || p.client === clientFilter) &&
      (countryFilter === "Todos" || p.country === countryFilter),
  );

  const activeProject = PROJECTS.find((p) => p.slug === activeSlug) ?? null;

  return (
    <section className="relative bg-paper py-16 md:py-24">
      {/* Sem link de "voltar" aqui: a volta para a home é o item "Início" do
          menu do topo (lib/group/nav.ts), que serve todas as páginas em vez de
          só esta. */}
      <div className="container-x">
        <SectionHeader
          as="h1"
          index="01"
          eyebrow={t("eyebrow")}
          title={t.rich("title", {
            accent: (chunks) => <span className="text-brand-600">{chunks}</span>,
          })}
          description={t("description")}
        />

        {showAttributionNote && projects.some((p) => p.country === "BR") && (
          <Reveal className="mt-6">
            <p className="rounded-xl border border-hair bg-paper-2 px-4 py-3 text-sm text-ink-soft">
              {t("attributionNote")}
            </p>
          </Reveal>
        )}

        {/* Sticky wrapper must NOT be nested inside the Reveal motion.div:
            framer-motion leaves an inline transform on its element after
            animating (even translateY(0)), which creates a new containing
            block and silently breaks `position: sticky` on descendants. */}
        <div className="sticky top-[70px] z-20 -mx-6 mt-10 flex flex-col gap-2 overflow-x-auto bg-paper px-6 pb-1 md:mx-0 md:px-0">
          <Reveal className="flex gap-2">
            {CLIENT_VALUES.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setClientFilter(value)}
                className={cn(
                  "shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                  clientFilter === value
                    ? "market-filter-active border-brand-500 bg-brand-500 text-white"
                    : "border-hair bg-surface text-ink-soft hover:border-brand-200 hover:text-ink",
                )}
              >
                {value === "Todas" ? t("allClients") : value}
              </button>
            ))}
          </Reveal>
          <Reveal className="flex gap-2">
            {COUNTRY_VALUES.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setCountryFilter(value)}
                className={cn(
                  "shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                  countryFilter === value
                    ? "market-filter-active border-brand-500 bg-brand-500 text-white"
                    : "border-hair bg-surface text-ink-soft hover:border-brand-200 hover:text-ink",
                )}
              >
                {countryLabel[value]}
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
                className="group block w-full text-left"
              >
                {/* Sem placeholder="blur": imagens vêm de public/ por caminho de string (não import estático) — ver docs/superpowers/specs/2026-07-28-portfolio-obras-design.md */}
                <Image
                  src={project.images[0]}
                  alt={`${project.client} — ${project.title}`}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  priority={index === 0}
                  className="hidden object-cover"
                />
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-hair bg-paper-2">
                  <Image
                    src={project.images[0]}
                    alt={`${project.client} — ${project.title}`}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    priority={index === 0}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex items-start justify-between gap-3 pt-3">
                  <div>
                    <p className="hud text-brand-600">{project.client} · {countryBadge[project.country]}</p>
                    <h3 className="mt-2 text-lg font-semibold leading-tight text-ink">{project.title}</h3>
                  </div>
                  {project.images.length > 1 && <span className="hud mt-1 flex shrink-0 items-center gap-1 text-ink-soft"><ImageIcon className="h-3 w-3" />{project.images.length}</span>}
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
