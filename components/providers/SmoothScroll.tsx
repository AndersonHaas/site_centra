"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useDesktopMotion } from "@/lib/use-desktop-motion";

/**
 * Scroll suave com momentum (estilo studio).
 * - Respeita prefers-reduced-motion (não ativa).
 * - Intercepta âncoras (#secao) para rolar suavemente com offset do header.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const desktopMotion = useDesktopMotion();
  useEffect(() => {
    if (!desktopMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const syncLock = () => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    };
    const observer = new MutationObserver(syncLock);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    syncLock();

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -72, duration: 1.3 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, [desktopMotion]);

  return <>{children}</>;
}
