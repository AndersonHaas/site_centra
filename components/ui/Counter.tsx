"use client";

import { useEffect, useRef, useState } from "react";
import {
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

export function Counter({
  to,
  duration = 1.8,
  progress,
}: {
  to: number;
  duration?: number;
  /* Quando presente, o valor é scrubado pelo scroll (0→1 => 0→to)
     em vez de animar por tempo. */
  progress?: MotionValue<number>;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  /* Fonte estável para o hook quando não há progress externo. */
  const fallback = useMotionValue(0);
  useMotionValueEvent(progress ?? fallback, "change", (v) => {
    if (!progress) return;
    if (reduce) {
      setValue(to);
      return;
    }
    const p = Math.min(Math.max(v, 0), 1);
    setValue(Math.round(p * to));
  });

  useEffect(() => {
    if (progress || !inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 4); // outQuart
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      setValue(Math.round(ease(p) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce, progress]);

  /* Com progress + reduced motion, garante o valor final mesmo sem eventos. */
  useEffect(() => {
    if (progress && reduce) setValue(to);
  }, [progress, reduce, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}
