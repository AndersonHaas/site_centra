"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursor custom: ponto sólido + anel que persegue com leve atraso.
 * mix-blend-difference garante leitura sobre fundos claros e escuros.
 * Ativa só em ponteiro fino; ignora prefers-reduced-motion p/ não “sumir”.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-none");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let hovering = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      const t = e.target as HTMLElement | null;
      hovering = !!t?.closest('a, button, input, textarea, [role="button"]');
    };

    const render = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      if (ring.current) {
        const s = hovering ? 1.9 : 1;
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${s})`;
        ring.current.style.opacity = hovering ? "0.9" : "0.5";
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onLeave = () => {
      if (dot.current) dot.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (dot.current) dot.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("cursor-none");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] hidden mix-blend-difference md:block"
      style={{ mixBlendMode: "difference" }}
    >
      <div
        ref={dot}
        className="fixed left-0 top-0 h-2 w-2 rounded-full bg-white"
        style={{ transform: "translate(-50%,-50%)" }}
      />
      <div
        ref={ring}
        className="fixed left-0 top-0 h-9 w-9 rounded-full border border-white"
        style={{ transform: "translate(-50%,-50%)", opacity: 0.5 }}
      />
    </div>
  );
}
