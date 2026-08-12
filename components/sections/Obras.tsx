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
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { StickyStack, useStickyPanel } from "@/components/ui/StickyStack";
import { Flag } from "@/components/ui/Flag";
import { WORKS, PRESENCE } from "@/lib/content";
import type { Market } from "@/lib/group/market";
import { cn } from "@/lib/utils";

import cvaleComplexo from "@/media/works/cvale-complexo.jpg";
import cvaleFachada from "@/media/works/cvale-fachada.jpg";
import copacolUnidade from "@/media/works/copacol-unidade.jpg";
import silosBaseCivil from "@/media/works/silos-base-civil.jpg";

const EASE = [0.16, 1, 0.3, 1] as const;

const IMAGES: Record<string, StaticImageData> = {
  "cvale-complexo": cvaleComplexo,
  "cvale-fachada": cvaleFachada,
  "copacol-unidade": copacolUnidade,
  "silos-base-civil": silosBaseCivil,
};

export function Obras() {
  const t = useTranslations("obras");

  return (
    <section id="obras" className="grain relative overflow-clip bg-ink-950 py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          index="01"
          eyebrow={t("eyebrow")}
          dark
          split
          title={t.rich("title", {
            accent: (chunks) => (
              <span className="text-gradient-brand">{chunks}</span>
            ),
          })}
          description={t("description")}
        />
      </div>

      {/* Deck pinado: cada obra desliza por cima da anterior */}
      <div className="mt-14 md:mt-20">
        <StickyStack overlay={(p) => <DeckHud progress={p} total={WORKS.length} />}>
          {WORKS.map((slug, i) => (
            <WorkPanel key={slug} slug={slug} index={i} total={WORKS.length} />
          ))}
        </StickyStack>
      </div>

      {/* CTA — portfólio completo (logo após a seção da última obra) */}
      <div className="container-x mt-14 md:mt-16">
        <Reveal>
          <div className="flex justify-center">
            <Link href="/portfolio" className="btn-ghost">
              {t("cta")}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Faixa de atuação — um bloco por país.

          Antes era uma lista corrida de cinco siglas, em que "PY" chegava
          depois de quatro estados brasileiros e sumia no meio. Com a bandeira
          e o nome de cada país em destaque, e os estados subordinados ao
          Brasil, a operação binacional se lê de relance — que é a única
          leitura que o visitante do site faz desta faixa. */}
      <div className="container-x mt-16 md:mt-20">
        <Reveal>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-9">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="hud text-brand-300">{t("presenceLabel")}</span>
              <span className="text-lg font-medium text-white">
                {t("presenceTitle")}
              </span>
            </div>

            {/* items-start: sem isso a grade estica o card do Paraguai até a
                altura do card do Brasil, que tem quatro estados listados, e o
                espaço vazio resultante parece defeito de layout. */}
            <div className="mt-7 grid items-start gap-4 sm:grid-cols-2">
              {PRESENCE.map((place) => (
                <div
                  key={place.code}
                  className="rounded-2xl border border-white/10 bg-ink-900 p-5"
                >
                  <div className="flex items-center gap-3">
                    <Flag
                      market={place.code.toLowerCase() as Market}
                      className="h-4 w-6 shrink-0 rounded-[3px] ring-1 ring-white/15"
                    />
                    <span className="text-base font-semibold text-white">
                      {t(`countries.${place.code}`)}
                    </span>
                  </div>
                  {place.states.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {place.states.map((state) => (
                        <span
                          key={state}
                          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5"
                        >
                          <span className="font-mono text-xs font-medium text-brand-300">
                            {state}
                          </span>
                          <span className="text-xs text-white/60">
                            {t(`states.${state}`)}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
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
  slug,
  index,
  total,
}: {
  slug: string;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const panel = useStickyPanel();
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const t = useTranslations(`works.${slug}`);

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
            src={IMAGES[slug]}
            alt={`${t("client")} — ${t("title")}`}
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
            {t("sector")}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container-x absolute inset-x-0 bottom-8 z-10 md:bottom-10">
        <Reveal>
          <p className="hud text-brand-300">{t("client")}</p>
        </Reveal>
        <SplitText
          as="h3"
          per="word"
          delay={0.1}
          className="display mt-3 max-w-2xl text-3xl text-white sm:text-4xl md:text-5xl"
        >
          {t("title")}
        </SplitText>
        <Reveal delay={0.18}>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            {t("summary")}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <Chip>{t("scope")}</Chip>
            <Chip>{t("location")}</Chip>
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
