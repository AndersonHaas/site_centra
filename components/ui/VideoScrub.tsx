"use client";

import { useEffect, useRef } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

/*
 * Vídeo com currentTime dirigido pelo scroll (scrub, estilo Apple).
 *
 * IMPORTANTE: para o scrub ficar suave o arquivo precisa ser re-encodado
 * com todos os frames como keyframe (senão o seek trava em GOPs longos):
 *   ffmpeg -i entrada.mp4 -an -g 1 -crf 23 -movflags +faststart saida.mp4
 *
 * Em touch (velocidade de scroll errática) e reduced motion, cai para
 * autoplay em loop mudo.
 */
export function VideoScrub({
  src,
  poster,
  progress,
  className,
}: {
  src: string;
  poster?: string;
  progress: MotionValue<number>;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const scrubRef = useRef(true);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    scrubRef.current = !coarse && !reduce;
    const v = ref.current;
    if (!v) return;
    if (scrubRef.current) {
      v.pause();
    } else {
      v.loop = true;
      v.play().catch(() => {
        /* autoplay bloqueado — mantém o poster */
      });
    }
  }, [reduce]);

  useMotionValueEvent(progress, "change", (p) => {
    const v = ref.current;
    if (!v || !scrubRef.current || !v.duration) return;
    const t = Math.min(Math.max(p, 0), 1) * Math.max(v.duration - 0.05, 0);
    if (Math.abs(v.currentTime - t) > 0.02) v.currentTime = t;
  });

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      playsInline
      preload="auto"
      className={cn(
        "absolute inset-0 h-full w-full object-cover",
        className,
      )}
    />
  );
}
