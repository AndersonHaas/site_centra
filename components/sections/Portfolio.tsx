"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
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

/* Filtros discretos e numa linha só, para as fotos aparecerem logo: categoria
   em abas de texto (sublinhado no ativo; no mobile rola na horizontal em vez
   de quebrar em várias linhas) e cliente/país em selects compactos à direita.
   Altura mínima de 44px no mobile mantém a área de toque. */
function CategoryTabs({
  ariaLabel,
  options,
  value,
  onChange,
}: {
  ariaLabel: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="-mx-2 flex min-w-0 overflow-x-auto [scrollbar-width:none]">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cn(
            "min-h-11 shrink-0 whitespace-nowrap px-2 text-sm underline-offset-[6px] transition-colors lg:min-h-9",
            value === option.value
              ? "font-medium text-ink underline decoration-brand-500 decoration-2"
              : "text-ink-soft hover:text-ink",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function FilterSelect<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <label className="relative flex min-h-11 items-center gap-2 lg:min-h-9">
      <span className="hud text-ink-soft">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="cursor-pointer appearance-none rounded-sm bg-transparent py-1 pr-5 text-sm font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-0 h-3.5 w-3.5 text-ink-soft" />
    </label>
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

  const projects = allProjects.filter(
    (p) =>
      (categoryFilter === "Todas" || categoriaKey(p) === categoryFilter) &&
      (clientFilter === "Todas" || p.client === clientFilter) &&
      (countryFilter === "Todos" || p.country === countryFilter),
  );

  const groups = groupByCategoria(projects, t("otherCategory"));

  const activeProject = allProjects.find((p) => p.slug === activeSlug) ?? null;

  return (
    <section className="relative bg-paper pb-16 pt-10 md:pb-24 md:pt-14">
      {/* Sem link de "voltar" aqui: a volta para a home é o item "Início" do
          menu do topo (lib/group/nav.ts), que serve todas as páginas em vez de
          só esta. */}
      <div className="container-x">
        {/* Cabeçalho enxuto (título e texto lado a lado no desktop) para a
            primeira fileira de fotos já aparecer sem rolar. */}
        <Reveal>
          <div className="grid gap-3 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-end lg:gap-12">
            <div>
              <p className="eyebrow text-ink-soft">{t("eyebrow")}</p>
              <h1 className="display mt-3 text-balance text-3xl text-ink sm:text-4xl">
                {t.rich("title", {
                  accent: (chunks) => <span className="text-brand-600">{chunks}</span>,
                })}
              </h1>
            </div>
            <p className="text-sm leading-relaxed text-ink-soft sm:text-base">{t("description")}</p>
          </div>
        </Reveal>

        {showAttributionNote && projects.some((p) => p.country === "BR") && (
          <Reveal className="mt-5">
            <p className="rounded-xl border border-hair bg-paper-2 px-4 py-3 text-sm text-ink-soft">
              {t("attributionNote")}
            </p>
          </Reveal>
        )}

        {/* Sticky wrapper must NOT be nested inside the Reveal motion.div:
            framer-motion leaves an inline transform on its element after
            animating (even translateY(0)), which creates a new containing
            block and silently breaks `position: sticky` on descendants. */}
        <div data-portfolio-filters className="mt-6 flex flex-col gap-1 border-b border-hair bg-paper py-2 lg:sticky lg:top-[70px] lg:z-20 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <CategoryTabs
            ariaLabel={t("categoryFilterLabel")}
            options={[{ value: "Todas", label: t("allCategories") }, ...categoryOptions]}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
          <div className="flex shrink-0 items-center gap-5">
            <FilterSelect
              label={t("clientLabel")}
              options={clientValues.map((value) => ({ value, label: value === "Todas" ? t("allClients") : value }))}
              value={clientFilter}
              onChange={setClientFilter}
            />
            <FilterSelect
              label={t("countryLabel")}
              options={COUNTRY_VALUES.map((value) => ({ value, label: countryLabel[value] }))}
              value={countryFilter}
              onChange={setCountryFilter}
            />
          </div>
        </div>

        {projects.length === 0 && <p role="status" className="mt-8 rounded-xl border border-hair p-5 text-ink-soft">{t("empty")}</p>}

        {groups.map((group, groupIndex) => (
          <section key={`${group.key}-${categoryFilter}-${clientFilter}-${countryFilter}`} aria-labelledby={`categoria-${group.key}`} className={groupIndex === 0 ? "mt-6" : "mt-12 md:mt-16"}>
            {/* Separação sutil: rótulo HUD + fio + contagem, sem cartão nem
                cor — a foto continua sendo o que chama atenção. */}
            <div className="mb-4 flex items-center gap-4">
              <h2 id={`categoria-${group.key}`} className="hud text-ink-soft">{group.name}</h2>
              <span aria-hidden className="h-px flex-1 bg-hair" />
              <span aria-hidden className="hud text-ink-soft">{String(group.items.length).padStart(2, "0")}</span>
            </div>
            <RevealStagger
              className="grid grid-cols-1 gap-x-5 gap-y-7 md:grid-cols-2 lg:grid-cols-3"
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
                    {/* Foto em primeiro plano: cliente e título vão sobre a imagem
                        (com degradê para leitura), e embaixo fica só o detalhe.
                        Sem placeholder="blur": as fotos vêm por URL do Supabase. */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-paper-2">
                      <Image
                        src={project.images[0]}
                        alt={`${project.client} — ${project.title}`}
                        fill
                        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        preload={groupIndex === 0 && index === 0}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 via-45% to-transparent" />
                      {project.status === "em_andamento" && (
                        <span className="hud absolute left-3 top-3 rounded-full border border-white/15 bg-ink-950/40 px-3 py-1.5 text-white/85 backdrop-blur-sm">
                          {t("statusEmAndamento")}
                        </span>
                      )}
                      {project.images.length > 1 && (
                        <span className="hud absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ink-950/40 px-2.5 py-1.5 text-white/85 backdrop-blur-sm">
                          <ImageIcon className="h-3 w-3" />
                          {project.images.length}
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                        <p className="hud text-white/70">{project.client}</p>
                        <h3 className="mt-1.5 text-balance text-lg font-semibold leading-tight text-white">{project.title}</h3>
                      </div>
                    </div>
                    {/* `detalhes` do cadastro no DashboardCentra (ex.: "Área: 16.000,00m²").
                        Pode ter várias linhas — pre-line respeita as quebras digitadas lá. */}
                    {project.detalhes?.trim() && (
                      <p className="mt-2.5 whitespace-pre-line text-sm leading-snug text-ink-soft">{project.detalhes.trim()}</p>
                    )}
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
