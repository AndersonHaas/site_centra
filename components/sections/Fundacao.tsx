"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { SplitText } from "@/components/ui/SplitText";
import { VideoScrub } from "@/components/ui/VideoScrub";
import { cn } from "@/lib/utils";

const SiloFoundation = dynamic(
  () => import("@/components/three/SiloFoundation"),
  { ssr: false },
);

const STAGES = [
  {
    title: "Estacas profundas",
    spec: "Transferência de carga ao solo firme · blocos de coroamento",
    range: [0.04, 0.34] as const,
  },
  {
    title: "Anel de fundação",
    spec: "Bloco circular armado · armadura contínua · chumbadores",
    range: [0.36, 0.64] as const,
  },
  {
    title: "Costado do silo",
    spec: "Chapas onduladas · montantes de aço galvanizado",
    range: [0.66, 0.96] as const,
  },
];

/* Seção pinada: exploração da fundação do silo dirigida pelo scroll.
   variant="3d"    → cena Three.js procedural (wireframe)
   variant="video" → vídeo scroll-scrub (gerado por IA; ver
                     docs/video-prompts-fundacao.md) */
export function Fundacao({ variant = "3d" }: { variant?: "3d" | "video" }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const depth = useTransform(scrollYProgress, (v) => {
    const m = -12 + Math.min(Math.max(v, 0), 1) * 44;
    return `${m >= 0 ? "+" : "−"}${Math.abs(m).toFixed(1).replace(".", ",")} m`;
  });
  const stage = useTransform(scrollYProgress, (v) =>
    String(Math.min(3, Math.floor(Math.max(v, 0) * 3) + 1)).padStart(2, "0"),
  );

  return (
    <section id="fundacao" className="relative bg-ink-950">
      <div
        ref={wrapRef}
        style={reduce ? undefined : { height: "260vh" }}
      >
        <div
          className={cn(
            "grain h-svh overflow-hidden",
            reduce ? "relative" : "sticky top-0",
          )}
        >
          <div className="grid-lines absolute inset-0 opacity-30" />

          {variant === "3d" ? (
            <SiloFoundation progress={scrollYProgress} />
          ) : (
            <VideoScrub
              src="/videos/fundacao.mp4"
              progress={scrollYProgress}
            />
          )}

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 55% at 70% 40%, rgba(var(--color-brand-500-rgb), 0.13), transparent 70%)",
            }}
          />

          {/* Cabeçalho */}
          <div className="container-x pointer-events-none absolute inset-x-0 top-24 z-10">
            <div className="flex items-center gap-3">
              <span className="eyebrow text-brand-300">Engenharia</span>
              <span className="h-px w-8 bg-white/20" />
              <span className="eyebrow text-white/55">Como construímos</span>
            </div>
            <SplitText
              as="h2"
              delay={0.05}
              className="display mt-5 max-w-2xl text-3xl text-white sm:text-4xl md:text-[2.9rem]"
            >
              Da <span className="text-gradient-brand">fundação</span> ao topo
              do silo.
            </SplitText>
          </div>

          {/* Legendas por etapa + leituras HUD */}
          <div className="container-x absolute inset-x-0 bottom-10 z-10 md:bottom-14">
            <div className="flex items-end justify-between gap-6">
              {reduce ? (
                <div className="flex flex-col gap-5">
                  {STAGES.map((s, i) => (
                    <div key={s.title}>
                      <p className="hud text-brand-300">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="display mt-1 text-xl text-white">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-sm text-white/65">{s.spec}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative h-28 w-full max-w-md">
                  {STAGES.map((s, i) => (
                    <Caption
                      key={s.title}
                      progress={scrollYProgress}
                      range={s.range}
                      index={i}
                      title={s.title}
                      spec={s.spec}
                    />
                  ))}
                </div>
              )}

              {!reduce && (
                <div className="hidden shrink-0 flex-col items-end gap-2 sm:flex">
                  <span className="hud text-brand-300">
                    Cota&ensp;<motion.span>{depth}</motion.span>
                  </span>
                  <span className="hud text-white/55">
                    Etapa&ensp;<motion.span>{stage}</motion.span>&ensp;/ 03
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Caption({
  progress,
  range,
  index,
  title,
  spec,
}: {
  progress: MotionValue<number>;
  range: readonly [number, number];
  index: number;
  title: string;
  spec: string;
}) {
  const [a, b] = range;
  const opacity = useTransform(
    progress,
    [a, a + 0.05, b - 0.05, b],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [a, a + 0.06], [14, 0]);

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-0">
      <p className="hud text-brand-300">{String(index + 1).padStart(2, "0")}</p>
      <h3 className="display mt-2 text-2xl text-white md:text-3xl">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-white/65">
        {spec}
      </p>
    </motion.div>
  );
}
