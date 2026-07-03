"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { cn } from "@/lib/utils";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

const COPIES = 4;

type VelocityMarqueeProps = {
  children: React.ReactNode;
  /* Velocidade base em % do track por segundo. */
  baseVelocity?: number;
  className?: string;
  /* Classe de cada cópia do conteúdo (espaçamento entre itens). */
  copyClassName?: string;
};

/* Marquee que acelera com a velocidade do scroll e inverte o sentido
   quando a rolagem inverte. Em touch (velocidade errática) e reduced
   motion, cai para o marquee CSS puro (animate-marquee). */
export function VelocityMarquee({
  children,
  baseVelocity = 2.4,
  className,
  copyClassName = "flex items-center gap-14 pr-14",
}: VelocityMarqueeProps) {
  const reduce = useReducedMotion();
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    setStaticMode(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1500, 0, 1500], [-5, 0, 5], {
    clamp: true,
  });
  const dirRef = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce || staticMode) return;
    const vf = factor.get();
    if (vf < -0.1) dirRef.current = -1;
    else if (vf > 0.1) dirRef.current = 1;
    let moveBy = dirRef.current * baseVelocity * (delta / 1000);
    moveBy += moveBy * Math.abs(vf);
    baseX.set(baseX.get() - moveBy);
  });

  if (reduce || staticMode) {
    return (
      <div className={cn("overflow-hidden", className)}>
        <div className="animate-marquee flex w-max items-center">
          <div className={copyClassName}>{children}</div>
          <div className={copyClassName} aria-hidden="true">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        style={{ x }}
        className="flex w-max items-center will-change-transform"
      >
        {Array.from({ length: COPIES }, (_, i) => (
          <div
            key={i}
            className={cn("shrink-0", copyClassName)}
            aria-hidden={i > 0 || undefined}
          >
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
