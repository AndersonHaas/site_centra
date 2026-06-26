"use client";

import { useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { WORKS, STATES } from "@/lib/content";

import cvaleComplexo from "@/media/works/cvale-complexo.jpg";
import cvaleFachada from "@/media/works/cvale-fachada.jpg";
import copacolUnidade from "@/media/works/copacol-unidade.jpg";
import silosGolden from "@/media/works/silos-goldenhour.jpg";

const IMAGES: Record<string, StaticImageData> = {
  "cvale-complexo": cvaleComplexo,
  "cvale-fachada": cvaleFachada,
  "copacol-unidade": copacolUnidade,
  "silos-goldenhour": silosGolden,
};

export function Obras() {
  return (
    <section id="obras" className="grain relative overflow-hidden bg-ink-950 py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          index="04"
          eyebrow="Obras realizadas"
          dark
          title={
            <>
              O que construímos para{" "}
              <span className="text-gradient-brand">grandes operações</span>.
            </>
          }
          description="Cada empreendimento entregue carrega excelência técnica, prazo cumprido e segurança — para cooperativas, indústrias e o setor público do Sul do Brasil."
        />
      </div>

      <div className="mt-14 flex flex-col gap-5 md:mt-20 md:gap-7">
        {WORKS.map((w, i) => (
          <WorkPanel key={w.slug} work={w} index={i} total={WORKS.length} />
        ))}
      </div>

      {/* Faixa de atuação — presença nos estados */}
      <div className="container-x mt-16 md:mt-20">
        <Reveal>
          <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:flex-row md:items-center md:justify-between md:p-9">
            <div className="flex items-center gap-4">
              <span className="hud text-brand-300">Atuação</span>
              <span className="text-lg font-medium text-white">
                Presença em 4 estados
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {STATES.map((s) => (
                <span
                  key={s.uf}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-ink-900 px-3.5 py-2"
                >
                  <span className="font-mono text-xs font-medium text-brand-300">
                    {s.uf}
                  </span>
                  <span className="text-sm text-white/70">{s.name}</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WorkPanel({
  work,
  index,
  total,
}: {
  work: (typeof WORKS)[number];
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <article
      ref={ref}
      className="relative h-[78vh] min-h-[520px] w-full overflow-hidden"
    >
      {/* Imagem com parallax */}
      <motion.div
        style={{ y: reduce ? 0 : y }}
        className="absolute inset-0 scale-[1.12]"
      >
        <Image
          src={IMAGES[work.slug]}
          alt={`${work.client} — ${work.title}`}
          fill
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Gradientes */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/15 to-ink-950/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-transparent to-transparent" />

      {/* HUD topo */}
      <div className="container-x absolute inset-x-0 top-7 z-10">
        <div className="flex items-center justify-between">
          <span className="hud text-white/70">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="hud rounded-full border border-white/15 bg-ink-950/40 px-3 py-1.5 text-white/70 backdrop-blur-sm">
            {work.sector}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container-x absolute inset-x-0 bottom-8 z-10 md:bottom-10">
        <Reveal>
          <p className="hud text-brand-300">{work.client}</p>
          <h3 className="display mt-3 max-w-2xl text-3xl text-white sm:text-4xl md:text-5xl">
            {work.title}
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            {work.summary}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <Chip>{work.scope}</Chip>
            <Chip>{work.location}</Chip>
          </div>
        </Reveal>
      </div>
    </article>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-white/60">
      <ArrowUpRight className="h-3.5 w-3.5 text-brand-300" />
      <span className="text-xs font-medium uppercase tracking-wider">
        {children}
      </span>
    </span>
  );
}
