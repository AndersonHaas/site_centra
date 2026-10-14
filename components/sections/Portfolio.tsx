"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { Lightbox } from "@/components/ui/Lightbox";
import type { PortfolioCountry, PortfolioObra } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

const COUNTRY_VALUES: Array<PortfolioCountry | "Todos"> = ["Todos", "BR", "PY"];
const OTHER_CATEGORY = "__outras";

/* Agrupa por categoria (cadastrada no DashboardCentra), na ordem definida lá.
   Obras sem categoria — e a categoria "Geral", que não diz nada como título —
   vão para um grupo final "Outras obras". Dentro de cada grupo as obras em
   andamento vêm primeiro; o resto mantém a ordem do dashboard (sort é estável). */
function categoriaOf(p: PortfolioObra) {
  return p.categoria && p.categoria.slug !== "geral" ? p.categoria : null;
}

function categoriaKey(p: PortfolioObra) {
  return categoriaOf(p)?.slug ?? OTHER_CATEGORY;
}

function groupByCategoria(projects: PortfolioObra[], otherName: string) {
  const byKey = new Map<string, { key: string; name: string; ordem: number; items: PortfolioObra[] }>();
  for (const p of projects) {
    const cat = categoriaOf(p);
    const key = categoriaKey(p);
    if (!byKey.has(key)) {
      byKey.set(key, { key, name: cat?.nome ?? otherName, ordem: cat?.ordem ?? Infinity, items: [] });
    }
    byKey.get(key)!.items.push(p);
  }
  const statusRank = (p: PortfolioObra) => (p.status === "em_andamento" ? 0 : 1);
  return Array.from(byKey.values())
    .sort((a, b) => a.ordem - b.ordem)
    .map((g) => ({ ...g, items: g.items.sort((a, b) => statusRank(a) - statusRank(b)) }));
}

/* Filtros discretos: texto simples com sublinhado no ativo, sem caixa nem
   preenchimento — um rótulo HUD à esquerda diz o que a linha filtra. A altura
   mínima de 44px no mobile mantém a área de toque; no desktop encolhe para a
   barra fixa não roubar espaço das fotos. */
function FilterRow<T extends string>({
  label,
  ariaLabel,
  options,
  value,
  onChange,
}: {
  label: string;
  ariaLabel: string;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
      <span aria-hidden className="hud shrink-0 pt-2 text-ink-soft sm:w-24 sm:pt-0">{label}</span>
      <div className="-mx-2 flex flex-wrap">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={cn(
              "min-h-11 max-w-full px-2 text-left text-sm underline-offset-[6px] transition-colors lg:min-h-9",
              value === option.value
                ? "font-medium text-ink underline decoration-brand-500 decoration-2"
                : "text-ink-soft hover:text-ink",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

type PortfolioProps = {
  /* Obras publicadas, já buscadas no servidor (ver
     app/[locale]/portfolio/page.tsx) — o cadastro (cliente, fotos,
     publicar/despublicar) agora vive no DashboardCentra, não mais em
     lib/portfolio-data.ts. */
  projects: PortfolioObra[];
  showAttributionNote?: boolean;
};

export function Portfolio({ projects: allProjects, showAttributionNote = false }: PortfolioProps) {
  const t = useTranslations("portfolio");
  /* Clientes são dinâmicos agora (vêm do cadastro, não de um union fixo de
     2 valores) — nomes próprios, não passam pelo catálogo de tradução. */
  const clientValues = useMemo(
    () => ["Todas", ...Array.from(new Set(allProjects.map((p) => p.client)))],
    [allProjects],
  );
  /* Opções de categoria saem das próprias obras, já na ordem do dashboard. */
  const categoryOptions = useMemo(
    () => groupByCategoria(allProjects, t("otherCategory")).map((g) => ({ value: g.key, label: g.name })),
    [allProjects, t],
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("Todas");
  const [clientFilter, setClientFilter] = useState<string>("Todas");
  const [countryFilter, setCountryFilter] = useState<PortfolioCountry | "Todos">("Todos");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const countryLabel: Record<PortfolioCountry | "Todos", string> = {
    Todos: t("allCountries"),
    BR: t("brazil"),
    PY: t("paraguay"),
  };
  const countryBadge: Record<PortfolioCountry, string> = {
    BR: t("badgeBR"),
    PY: t("badgePY"),
  };

  const projects = allProjects.filter(
    (p) =>
      (categoryFilter === "Todas" || categoriaKey(p) === categoryFilter) &&
      (clientFilter === "Todas" || p.client === clientFilter) &&
      (countryFilter === "Todos" || p.country === countryFilter),
  );

  const groups = groupByCategoria(projects, t("otherCategory"));

  const activeProject = allProjects.find((p) => p.slug === activeSlug) ?? null;

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
        <div data-portfolio-filters className="mt-8 flex flex-col gap-1 border-b border-hair bg-paper py-3 lg:sticky lg:top-[70px] lg:z-20 lg:gap-0">
          <FilterRow
            label={t("categoryLabel")}
            ariaLabel={t("categoryFilterLabel")}
            options={[{ value: "Todas", label: t("allCategories") }, ...categoryOptions]}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
          <FilterRow
            label={t("clientLabel")}
            ariaLabel={t("clientFilterLabel")}
            options={clientValues.map((value) => ({ value, label: value === "Todas" ? t("allClients") : value }))}
            value={clientFilter}
            onChange={setClientFilter}
          />
          <FilterRow
            label={t("countryLabel")}
            ariaLabel={t("countryFilterLabel")}
            options={COUNTRY_VALUES.map((value) => ({ value, label: countryLabel[value] }))}
            value={countryFilter}
            onChange={setCountryFilter}
          />
        </div>

        {projects.length === 0 && <p role="status" className="mt-8 rounded-xl border border-hair p-5 text-ink-soft">{t("empty")}</p>}

        {groups.map((group, groupIndex) => (
          <section key={`${group.key}-${categoryFilter}-${clientFilter}-${countryFilter}`} aria-labelledby={`categoria-${group.key}`} className={groupIndex === 0 ? "mt-8" : "mt-14 md:mt-20"}>
            {/* Separação sutil: rótulo HUD + fio + contagem, sem cartão nem
                cor — a foto continua sendo o que chama atenção. */}
            <div className="mb-5 flex items-center gap-4">
              <h2 id={`categoria-${group.key}`} className="hud text-ink-soft">{group.name}</h2>
              <span aria-hidden className="h-px flex-1 bg-hair" />
              <span aria-hidden className="hud text-ink-soft">{String(group.items.length).padStart(2, "0")}</span>
            </div>
            <RevealStagger
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              gap={0.05}
            >
              {group.items.map((project, index) => (
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
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-hair bg-paper-2">
                      <Image
                        src={project.images[0]}
                        alt={`${project.client} — ${project.title}`}
                        fill
                        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        preload={groupIndex === 0 && index === 0}
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                      {project.status === "em_andamento" && (
                        <span className="hud absolute left-3 top-3 rounded-full border border-white/15 bg-ink-950/40 px-3 py-1.5 text-white/80 backdrop-blur-sm">
                          {t("statusEmAndamento")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-3 pt-3">
                      <div>
                        <p className="hud text-brand-600">{project.client} · {countryBadge[project.country]}</p>
                        <h3 className="mt-2 text-lg font-semibold leading-tight text-ink">{project.title}</h3>
                        {/* `detalhes` do cadastro no DashboardCentra (ex.: "Área: 16.000,00m²").
                            Pode ter várias linhas — pre-line respeita as quebras digitadas lá. */}
                        {project.detalhes?.trim() && (
                          <p className="mt-1.5 whitespace-pre-line text-sm leading-snug text-ink-soft">{project.detalhes.trim()}</p>
                        )}
                      </div>
                      {project.images.length > 1 && <span className="hud mt-1 flex shrink-0 items-center gap-1 text-ink-soft"><ImageIcon className="h-3 w-3" />{project.images.length}</span>}
                    </div>
                  </button>
                </RevealItem>
              ))}
            </RevealStagger>
          </section>
        ))}
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
