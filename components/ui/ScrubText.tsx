"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

/* Palavra em subcomponente: um useTransform por palavra sem violar as
   regras de hooks (a lista de palavras é estável entre renders). */
function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

type ScrubTextProps = {
  text: string;
  as?: "p" | "h2" | "h3" | "blockquote";
  className?: string;
};

/* Parágrafo cujas palavras "acendem" uma a uma, amarradas 1:1 à posição
   do scroll (scrub) — sem timers. */
export function ScrubText({ text, as: Tag = "p", className }: ScrubTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = text.split(/\s+/).filter(Boolean);
  const n = words.length;

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag ref={ref as never} aria-label={text} className={className}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <Word progress={scrollYProgress} range={[i / n, (i + 1) / n]}>
            {w}
          </Word>
          {i < n - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
