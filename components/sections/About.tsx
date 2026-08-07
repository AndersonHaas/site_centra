"use client";

import { Target, Eye, Gem } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import type { Market } from "@/lib/group/market";

const ICONS = { missao: Target, visao: Eye, valores: Gem } as const;

const PILLARS: Record<
  Market,
  Array<{ key: "missao" | "visao" | "valores"; title: string; body: string }>
> = {
  br: [
    {
      key: "missao",
      title: "Missão",
      body: "Entregar soluções de engenharia e construção com excelência técnica, inovação e eficiência operacional, transformando projetos em empreendimentos de alto desempenho — com compromisso, segurança e responsabilidade, gerando valor sustentável para clientes, parceiros e comunidades.",
    },
    {
      key: "visao",
      title: "Visão",
      body: "Ser reconhecida como uma das principais referências em engenharia e construção da região Sul do Brasil, destacando-se pela qualidade das entregas, solidez das relações, capacidade técnica e contribuição para o desenvolvimento dos setores industrial, agroindustrial e comercial.",
    },
    {
      key: "valores",
      title: "Valores",
      body: "Atuamos com ética, transparência e comprometimento em todas as relações e projetos. Valorizamos a excelência técnica, a segurança, a inovação e o desenvolvimento contínuo, buscando soluções de alta qualidade que gerem resultados duradouros.",
    },
  ],
  py: [
    {
      key: "missao",
      title: "Misión",
      body: "Entregar soluciones de ingeniería y construcción con excelencia técnica, innovación y eficiencia operacional, transformando proyectos en emprendimientos de alto desempeño — con compromiso, seguridad y responsabilidad, generando valor sostenible para clientes, socios y comunidades.",
    },
    {
      key: "visao",
      title: "Visión",
      body: "Ser reconocida como una de las principales referencias en ingeniería y construcción de la región Sur de Brasil, destacándose por la calidad de las entregas, la solidez de las relaciones, la capacidad técnica y la contribución al desarrollo de los sectores industrial, agroindustrial y comercial.",
    },
    {
      key: "valores",
      title: "Valores",
      body: "Actuamos con ética, transparencia y compromiso en todas las relaciones y proyectos. Valoramos la excelencia técnica, la seguridad, la innovación y el desarrollo continuo, buscando soluciones de alta calidad que generen resultados duraderos.",
    },
  ],
};

const SECTION_COPY: Record<Market, { eyebrow: string; description: string }> = {
  br: {
    eyebrow: "Quem é a Centra",
    description:
      "Uma equipe técnica especializada — engenheiros, gestores e profissionais experientes — que atua de forma integrada em todas as etapas, transformando projetos em empreendimentos de alto desempenho. Atuamos no Brasil, com a unidade de construção civil presente também no Paraguai.",
  },
  py: {
    eyebrow: "Quiénes somos",
    description:
      "Un equipo técnico especializado — ingenieros, gestores y profesionales experimentados — que actúa de forma integrada en todas las etapas, transformando proyectos en emprendimientos de alto desempeño. El Grupo Centra opera en Brasil, y su unidad de construcción civil también opera en Paraguay.",
  },
};

const STATS_COPY: Record<
  Market,
  { area: string; areaLabel: string; states: string; statesLabel: string }
> = {
  br: {
    area: "+550 mil m²",
    areaLabel: "construídos e entregues",
    states: "4 estados",
    statesLabel: "de presença consolidada",
  },
  py: {
    area: "+550 mil m²",
    areaLabel: "construidos y entregados en Brasil",
    states: "4 estados",
    statesLabel: "de presencia consolidada en Brasil",
  },
};

const TITLE: Record<Market, { line1: string; line2: string; highlight: string }> = {
  br: { line1: "A força da Centra", line2: "está nas", highlight: "pessoas" },
  py: { line1: "La fuerza de Centra", line2: "está en las", highlight: "personas" },
};

export function About({ market }: { market: Market }) {
  const pillars = PILLARS[market];
  const copy = SECTION_COPY[market];
  const stats = STATS_COPY[market];
  const title = TITLE[market];

  return (
    <section id="sobre" className="relative bg-paper py-24 md:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            as="h1"
            index="01"
            eyebrow={copy.eyebrow}
            title={
              <>
                {title.line1}
                <br />
                {title.line2} <span className="text-brand-600">{title.highlight}</span>.
              </>
            }
            description={copy.description}
          />

          <Reveal delay={0.18} className="mt-10">
            <div className="flex items-center gap-6 border-t border-hair pt-6">
              <div>
                <div className="display text-3xl text-ink">{stats.area}</div>
                <p className="mt-1 text-sm text-ink-soft">{stats.areaLabel}</p>
              </div>
              <div className="h-12 w-px bg-hair" />
              <div>
                <div className="display text-3xl text-ink">{stats.states}</div>
                <p className="mt-1 text-sm text-ink-soft">{stats.statesLabel}</p>
              </div>
            </div>
          </Reveal>
        </div>

        <RevealStagger className="flex flex-col gap-4" gap={0.1}>
          {pillars.map((p, i) => {
            const Icon = ICONS[p.key];
            return (
              <RevealItem key={p.key}>
                <article className="group relative overflow-hidden rounded-2xl border border-hair bg-surface p-7 transition-colors duration-300 hover:border-brand-200 hover:bg-brand-50/40 md:p-9">
                  <span className="absolute right-7 top-7 font-mono text-xs text-ink-soft">
                    0{i + 1}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
                    {p.body}
                  </p>
                </article>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
