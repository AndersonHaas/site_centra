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
import { SplitText } from "@/components/ui/SplitText";
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

  const headlineLines = [
    { text: t("headline.line1"), accent: false },
    { text: t("headline.line2"), accent: true },
    { text: t("headline.line3"), accent: false },
  ];

  return (
    <section
      id="top"
      ref={ref}
      className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-ink-950"
    >
      {/* Fundo: foto real com Ken Burns + parallax */}
      <motion.div
        style={{ y: reduce ? 0 : yBg, scale: reduce ? 1 : scaleBg }}
        className="absolute inset-0 -z-0"
      >
        <div className="absolute inset-0 animate-kenburns">
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
      <div className="absolute inset-0 -z-0 bg-gradient-to-r from-ink-950 via-ink-950/60 to-ink-950/20" />
      <div className="absolute inset-0 -z-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-ink-950/65" />

      {/* Molduras de canto (HUD de câmera) */}
      <CornerTicks />

      {/* Conteúdo */}
      <motion.div
        style={{ y: reduce ? 0 : yContent, opacity: reduce ? 1 : opacity }}
        className="container-x relative z-10 w-full pt-28 pb-28"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
          </span>
          <span className="eyebrow text-white/70">{t("eyebrow")}</span>
        </motion.div>

        <h1 className="display mt-6 max-w-[20ch] text-[1.4rem] text-white sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem]">
          {headlineLines.map((line, i) => (
            <SplitText
              key={i}
              as="span"
              mode="mount"
              delay={0.25 + i * 0.14}
              stagger={0.05}
              className="block"
            >
              {line.accent ? (
                <span className="text-gradient-brand">{line.text}</span>
              ) : (
                line.text
              )}
            </SplitText>
          ))}
        </h1>

        {/* Posicionamento em uma frase. É o que diz ao visitante do Paraguai
            o que a Centra faz NO PAÍS DELE — sem ela, o hero é só uma
            manchete e uma foto de obra brasileira. */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
          className="mt-7 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base"
        >
          {t("lead")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 1 }}
          className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6"
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
        transition={{ delay: 1.2, duration: 1 }}
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

function CornerTicks() {
  const base = "pointer-events-none absolute h-9 w-9 border-white/20 z-10";
  return (
    <>
      <span className={`${base} left-5 top-24 border-l border-t`} />
      <span className={`${base} right-5 top-24 border-r border-t`} />
      <span className={`${base} bottom-20 left-5 border-b border-l`} />
      <span className={`${base} bottom-20 right-5 border-b border-r`} />
    </>
  );
}
