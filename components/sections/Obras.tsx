"use client";

import { useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { StickyStack, useStickyPanel } from "@/components/ui/StickyStack";
import { WORKS, STATES } from "@/lib/content";
import { cn } from "@/lib/utils";

import cvaleComplexo from "@/media/works/cvale-complexo.jpg";
import cvaleFachada from "@/media/works/cvale-fachada.jpg";
import copacolUnidade from "@/media/works/copacol-unidade.jpg";
import silosGolden from "@/media/works/silos-goldenhour.jpg";

const EASE = [0.16, 1, 0.3, 1] as const;

const IMAGES: Record<string, StaticImageData> = {
  "cvale-complexo": cvaleComplexo,
  "cvale-fachada": cvaleFachada,
  "copacol-unidade": copacolUnidade,
  "silos-goldenhour": silosGolden,
};

export function Obras() {
  return (
    <section id="obras" className="grain relative overflow-clip bg-ink-950 py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          index="01"
          eyebrow="Obras realizadas"
          dark
          split
          title={
            <>
              O que construímos para{" "}
              <span className="text-gradient-brand">grandes operações</span>.
            </>
          }
          description="Cada empreendimento entregue carrega excelência técnica, prazo cumprido e segurança — para cooperativas, indústrias e o setor público do Sul do Brasil."
        />
      </div>

      {/* Deck pinado: cada obra desliza por cima da anterior */}
      <div className="mt-14 md:mt-20">
        <StickyStack overlay={(p) => <DeckHud progress={p} total={WORKS.length} />}>
          {WORKS.map((w, i) => (
            <WorkPanel key={w.slug} work={w} index={i} total={WORKS.length} />
          ))}
        </StickyStack>
      </div>

      {/* CTA — portfólio completo (logo após a seção da última obra) */}
      <div className="container-x mt-14 md:mt-16">
        <Reveal>
          <div className="flex justify-center">
            <Link href="/obras" className="btn-ghost">
              Ver mais obras
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
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

/* HUD fixo do deck: contador da obra atual + barra de progresso scrubada */
function DeckHud({
  progress,
  total,
}: {
  progress: MotionValue<number>;
  total: number;
}) {
  const current = useTransform(progress, (v) =>
    String(
      Math.min(total, Math.max(1, Math.round(v * (total - 1)) + 1)),
    ).padStart(2, "0"),
  );
  return (
    <div className="pointer-events-none absolute inset-x-0 top-24 z-30">
      <div className="container-x flex items-center justify-between">
        <span className="hud flex items-center gap-3 text-white/70">
          <motion.span>{current}</motion.span>
          <span>/ {String(total).padStart(2, "0")}</span>
        </span>
        <span className="relative h-px w-24 overflow-hidden bg-white/15 md:w-36">
          <motion.span
            style={{ scaleX: progress }}
            className="absolute inset-0 origin-left bg-brand-300"
          />
        </span>
      </div>
    </div>
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
  const panel = useStickyPanel();
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });

  /* Fluxo (mobile/reduced motion): pan pela posição do próprio painel.
     Deck: pan pelo progresso local distribuído pelo StickyStack. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    panel ? panel.local : scrollYProgress,
    [0, 1],
    ["-8%", "8%"],
  );

  const doClip = !reduce && (!panel || panel.first);

  return (
    <article
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden",
        panel ? "h-full" : "h-[78vh] min-h-[520px]",
      )}
    >
      {/* Imagem: wipe de içamento na entrada + pan amarrado ao scroll.
          No deck, só o 1º painel usa o wipe — nos demais o slide por
          cima já é a entrada. O in-view é observado no <article> (não
          clipado): clip-path inset(100%) zera a interseção do próprio
          elemento no Chromium e nunca dispararia. */}
      <motion.div
        initial={doClip ? { clipPath: "inset(100% 0 0 0)" } : undefined}
        animate={doClip && inView ? { clipPath: "inset(0% 0 0 0)" } : undefined}
        transition={{ duration: 1.1, ease: EASE }}
        className="absolute inset-0"
      >
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
      </motion.div>

      {/* Gradientes */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/15 to-ink-950/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-transparent to-transparent" />

      {/* HUD topo: contador só no modo fluxo (no deck fica no DeckHud);
          no deck, tudo desce para não ficar atrás da navbar fixa */}
      <div
        className={cn(
          "container-x absolute inset-x-0 z-10",
          panel ? "top-24" : "top-7",
        )}
      >
        <div className="flex items-center justify-between">
          <span className={cn("hud text-white/70", panel && "invisible")}>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span
            className={cn(
              "hud rounded-full border border-white/15 bg-ink-950/40 px-3 py-1.5 text-white/70 backdrop-blur-sm",
              panel && "mt-10",
            )}
          >
            {work.sector}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container-x absolute inset-x-0 bottom-8 z-10 md:bottom-10">
        <Reveal>
          <p className="hud text-brand-300">{work.client}</p>
        </Reveal>
        <SplitText
          as="h3"
          per="word"
          delay={0.1}
          className="display mt-3 max-w-2xl text-3xl text-white sm:text-4xl md:text-5xl"
        >
          {work.title}
        </SplitText>
        <Reveal delay={0.18}>
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
