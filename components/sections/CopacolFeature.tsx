"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import copacolAerea from "@/media/works/copacol-aerea.jpg";

const EASE = [0.16, 1, 0.3, 1] as const;

export function CopacolFeature() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["-8%", "10%"]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1.05, 1.14]);

  return (
    <section
      id="copacol-feature"
      ref={ref}
      className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-ink-950"
    >
      {/* Foto aérea com Ken Burns + parallax */}
      <motion.div
        style={{ y: reduce ? 0 : yBg, scale: reduce ? 1 : scaleBg }}
        className="absolute inset-0 -z-0"
      >
        <Image
          src={copacolAerea}
          alt="Vista aérea de complexo agroindustrial Copacol construído pela Centra"
          fill
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Sombreamento próprio: leitura mais suave à direita (espelhado do Hero) */}
      <div className="absolute inset-0 -z-0 bg-gradient-to-l from-ink-950 via-ink-950/55 to-ink-950/15" />
      <div className="absolute inset-0 -z-0 bg-gradient-to-b from-ink-950/70 via-transparent to-ink-950/85" />

      <CornerTicks />

      {/* Conteúdo alinhado à direita (espelha o Hero) */}
      <div className="container-x relative z-10 flex w-full justify-end pt-28 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="max-w-xl text-right"
        >
          <span className="eyebrow text-brand-300">Cliente destaque</span>

          <h2 className="display mt-5 text-3xl text-white sm:text-4xl md:text-5xl lg:text-[3.4rem]">
            <span className="block">Construindo a</span>
            <span className="block">
              <span className="text-gradient-brand">Copacol</span>{" "}
              <span>por inteiro.</span>
            </span>
          </h2>

          <p className="ml-auto mt-6 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
            Da terraplanagem às estruturas metálicas, somos a engenharia por
            trás de unidades agroindustriais que sustentam uma das maiores
            cooperativas do Paraná.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-end gap-x-6 gap-y-2 border-t border-white/10 pt-5">
            <span className="hud text-white/45">Copacol · Cooperativa</span>
            <span className="hud text-white/35">—</span>
            <span className="hud text-white/75">Oeste do Paraná · BR</span>
          </div>
        </motion.div>
      </div>

      {/* Faixa HUD inferior — espelha o Hero */}
      <div className="absolute inset-x-0 bottom-5 z-10">
        <div className="container-x flex items-end justify-between">
          <div className="hidden flex-col gap-1 sm:flex">
            <span className="hud text-white/40">Lat −24.42° · Lon −53.18°</span>
            <span className="hud text-white/55">Nova Aurora · Paraná · BR</span>
          </div>
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <span className="hud text-brand-300">Obra 02</span>
            <span className="hud text-white/55">Copacol · Complexo agroindustrial</span>
          </div>
        </div>
      </div>
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