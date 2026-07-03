"use client";

import { useRef } from "react";
import Image, { type ImageProps } from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type ParallaxImageProps = Omit<ImageProps, "fill"> & {
  /* Amplitude do parallax vertical, em % da altura do container */
  speed?: number;
  /* Wipe de entrada de baixo para cima (anima uma única vez) */
  clipReveal?: boolean;
  containerClassName?: string;
};

/* Imagem de fundo com pan vertical amarrado ao scroll. O scale interno
   compensa a amplitude do pan para nunca expor as bordas. */
export function ParallaxImage({
  speed = 8,
  clipReveal = false,
  containerClassName,
  className,
  alt,
  ...img
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed}%`, `${speed}%`]);

  /* IMPORTANTE: o in-view é observado no container (não-clipado). No
     Chromium, clip-path: inset(100%) zera a interseção do próprio
     elemento e um whileInView nele mesmo nunca dispararia. */
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const doClip = clipReveal && !reduce;

  return (
    <div
      ref={ref}
      className={cn("absolute inset-0 overflow-hidden", containerClassName)}
    >
      <motion.div
        initial={doClip ? { clipPath: "inset(100% 0 0 0)" } : undefined}
        animate={doClip && inView ? { clipPath: "inset(0% 0 0 0)" } : undefined}
        transition={{ duration: 1.1, ease: EASE }}
        className="absolute inset-0"
      >
        <motion.div
          style={{ y: reduce ? 0 : y }}
          initial={{ scale: doClip ? 1.26 : 1.12 }}
          animate={inView ? { scale: 1.12 } : undefined}
          transition={{ duration: 1.3, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            alt={alt}
            fill
            {...img}
            className={cn("object-cover object-center", className)}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
