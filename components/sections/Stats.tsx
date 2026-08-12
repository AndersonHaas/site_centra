"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { STATS } from "@/lib/content";
import { Counter } from "@/components/ui/Counter";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
/* Chapa de atmosfera, não obra do portfólio: entra 85% escurecida e com zoom
   scrubado, só para dar textura atrás dos números. É a única consumidora deste
   arquivo desde que o painel de silos passou a usar silos-base-civil.jpg —
   não apague por parecer órfão. */
import silosBg from "@/media/works/silos-goldenhour.jpg";

/* Tailwind exige classes literais (não interpoladas) para funcionar no build,
   então a grade sai de um mapa estático em vez de uma string montada. Assim
   acrescentar ou remover uma métrica em STATS não deixa coluna vazia. */
const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const t = useTranslations("stats");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  /* Zoom scrubado: a foto "assenta" de 1.22 para 1.1 conforme a seção passa */
  const scale = useTransform(scrollYProgress, [0, 1], [1.22, 1.1]);
  /* Contadores scrubados: rolam junto com a entrada da seção */
  const countProgress = useTransform(scrollYProgress, [0.12, 0.42], [0, 1]);

  return (
    <section
      ref={ref}
      className="grain relative overflow-hidden bg-ink-950 py-24 md:py-32"
    >
      {/* Fundo: foto atmosférica com parallax + zoom scrubado */}
      <motion.div
        style={reduce ? undefined : { y, scale }}
        className={reduce ? "absolute inset-0 scale-110" : "absolute inset-0"}
      >
        <Image
          src={silosBg}
          alt=""
          fill
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-ink-950/85" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 70% 20%, rgba(var(--color-brand-500-rgb), 0.22), transparent 70%)",
        }}
      />

      <div className="container-x relative">
        <Reveal>
          <p className="hud text-brand-300">{t("eyebrow")}</p>
          <h2 className="display mt-4 max-w-2xl text-3xl text-white sm:text-4xl md:text-[2.7rem]">
            {t.rich("title", {
              accent: (chunks) => (
                <span className="text-gradient-brand">{chunks}</span>
              ),
            })}
          </h2>
        </Reveal>

        <RevealStagger
          className={cn(
            "mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08]",
            GRID_COLS[STATS.length] ?? GRID_COLS[4],
          )}
        >
          {STATS.map((s) => {
            const suffix = t(`items.${s.key}.suffix`);
            return (
              <RevealItem
                key={s.key}
                className="bg-ink-950/70 p-7 backdrop-blur-sm md:p-9"
              >
                <div className="display flex items-baseline whitespace-nowrap text-6xl text-white md:text-7xl xl:text-8xl">
                  <Counter to={s.value} progress={countProgress} />
                  <span
                    className={cn(
                      "text-2xl font-semibold text-brand-300 md:text-3xl",
                      /^[+%]/.test(suffix) ? "ml-0.5" : "ml-2",
                    )}
                  >
                    {suffix}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-snug text-white/60 md:text-base">
                  {t(`items.${s.key}.label`)}
                </p>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
