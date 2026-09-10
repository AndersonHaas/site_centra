"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { SECTORS } from "@/lib/content";
import { Flag } from "@/components/ui/Flag";
import heroImg from "@/media/works/cvale-complexo.jpg";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const t = useTranslations("hero");
  const tSectors = useTranslations("sectors");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="grain relative flex min-h-[42rem] items-center overflow-hidden bg-ink-950 md:min-h-[100svh]"
    >
      {/* Fundo: foto real com Ken Burns + parallax */}
      <motion.div
        style={{ y: reduce ? 0 : yBg, scale: reduce ? 1 : scaleBg }}
        className="absolute inset-0 -z-0"
      >
        <div className="hero-image-motion absolute inset-0">
          <Image
            src={heroImg}
            alt={t("imageAlt")}
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </motion.div>

      {/* Gradientes de leitura */}
      <div className="absolute inset-0 -z-0 bg-gradient-to-r from-ink-950 via-ink-950/75 to-ink-950/10" />
      <div className="absolute inset-0 -z-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-ink-950/65" />

      {/* Molduras de canto (HUD de câmera) */}

      {/* Conteúdo */}
      <motion.div
        style={{ y: reduce ? 0 : yContent, opacity: reduce ? 1 : opacity }}
        className="container-x relative z-10 w-full pt-24 pb-20 md:pt-28 md:pb-28"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}
          className="flex flex-wrap items-center gap-x-3 gap-y-3"
        >
          {/* Ponto e eyebrow num grupo só: com o flex-wrap da linha, soltos,
              o ponto virava órfão numa linha própria no mobile. */}
          <span className="flex items-center gap-3">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="market-indicator absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
              <span className="market-indicator relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
            </span>
            <span className="eyebrow text-white/70">{t("eyebrow")}</span>
          </span>

          {/* Selo binacional — a atuação nos dois países dita na primeira tela,
              e não só na faixa de atuação lá embaixo. É o primeiro elemento do
              caminho de leitura, então quem abre o site já sai sabendo. Para
              remover, basta apagar deste divisor até o fim do bloco. */}
          <span aria-hidden className="hidden h-3.5 w-px bg-white/20 sm:block" />
          <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 backdrop-blur-sm">
            <Flag
              market="br"
              className="h-3 w-[1.125rem] shrink-0 rounded-[2px] ring-1 ring-white/20"
            />
            <Flag
              market="py"
              className="h-3 w-[1.125rem] shrink-0 rounded-[2px] ring-1 ring-white/20"
            />
            <span className="hud text-white/80">{t("binational")}</span>
          </span>
        </motion.div>

        <h1 className="display mt-6 max-w-[18ch] text-[clamp(2.125rem,9vw,2.5rem)] leading-[1.08] text-white md:max-w-[20ch] md:text-5xl md:leading-[0.98] lg:text-[3.5rem] xl:text-[4rem]">
          <span>{t("headline.line1")} </span>
          <span className="text-gradient-brand">{t("headline.line2")} </span>
          <span>{t("headline.line3")}</span>
        </h1>

        {/* Posicionamento em uma frase. É o que diz ao visitante do Paraguai
            o que a Centra faz NO PAÍS DELE — sem ela, o hero é só uma
            manchete e uma foto de obra brasileira. */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE, delay: 0.15 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
        >
          {t("lead")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: EASE, delay: 0.22 }}
          className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-5"
        >
          <span className="eyebrow text-white/55">{t("sectorsLabel")}</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {SECTORS.map((sector) => (
              <span key={sector} className="text-sm font-medium text-white/75">
                {tSectors(sector)}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Faixa HUD inferior */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="absolute inset-x-0 bottom-5 z-10"
      >
        <div className="container-x flex items-end justify-between">
          <div className="hidden flex-col gap-1 sm:flex">
            <span className="hud text-white/55">{t("hudLine1")}</span>
            <span className="hud text-white/55">{t("hudLine2")}</span>
          </div>

          <div className="hidden -translate-x-1/2 sm:absolute sm:left-1/2 sm:flex">
            <motion.div
              animate={reduce ? {} : { y: [0, 7, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 text-white/55"
            >
              <span className="hud">{t("scroll")}</span>
              <ArrowDown className="h-4 w-4" />
            </motion.div>
          </div>

          <div className="flex flex-col items-start gap-1 sm:items-end">
            <span className="hud text-brand-300">{t("workIndex")}</span>
            <span className="hud text-white/55">{t("workLabel")}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
