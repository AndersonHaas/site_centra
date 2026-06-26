"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { STATS } from "@/lib/content";
import { Counter } from "@/components/ui/Counter";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import silosBg from "@/media/works/silos-goldenhour.jpg";

export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={ref}
      className="grain relative overflow-hidden bg-ink-950 py-24 md:py-32"
    >
      {/* Fundo: foto atmosférica com parallax */}
      <motion.div
        style={{ y: reduce ? 0 : y }}
        className="absolute inset-0 scale-110"
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
            "radial-gradient(80% 60% at 70% 20%, rgba(36,132,214,0.22), transparent 70%)",
        }}
      />

      <div className="container-x relative">
        <Reveal>
          <p className="hud text-brand-300">Em números</p>
          <h2 className="display mt-4 max-w-2xl text-3xl text-white sm:text-4xl md:text-[2.7rem]">
            A escala de quem entrega{" "}
            <span className="text-gradient-brand">alto desempenho</span>.
          </h2>
        </Reveal>

        <RevealStagger className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08] lg:grid-cols-4">
          {STATS.map((s) => (
            <RevealItem
              key={s.label}
              className="bg-ink-950/70 p-7 backdrop-blur-sm md:p-9"
            >
              <div className="display flex items-baseline whitespace-nowrap text-5xl text-white md:text-6xl">
                <Counter to={s.value} />
                <span
                  className={cn(
                    "text-gradient-brand text-xl font-semibold md:text-2xl",
                    /^[+%]/.test(s.suffix) ? "ml-0.5" : "ml-2",
                  )}
                >
                  {s.suffix}
                </span>
              </div>
              <p className="mt-4 text-sm leading-snug text-white/60 md:text-base">
                {s.label}
              </p>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
