"use client";

import {
  Children,
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

type PanelMotion = {
  /* 0→1 enquanto o painel está em cena (da entrada até ser coberto) —
     fonte para scrubs internos (ex.: pan de imagem). */
  local: MotionValue<number>;
  /* 0→1 enquanto o próximo painel desliza por cima. */
  exit: MotionValue<number>;
  /* Primeiro painel do deck (já visível quando a seção entra). */
  first: boolean;
};

const PanelCtx = createContext<PanelMotion | null>(null);

/* Painéis consultam o contexto: null = modo fluxo (mobile/reduced motion). */
export function useStickyPanel() {
  return useContext(PanelCtx);
}

function PanelShell({
  index,
  count,
  progress,
  children,
}: {
  index: number;
  count: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
}) {
  const n = Math.max(count - 1, 1);
  /* Entrada: desliza de baixo por cima do painel anterior. */
  const y = useTransform(
    progress,
    [(index - 1) / n, index / n],
    ["100%", "0%"],
  );
  /* Saída: encolhe e escurece sob o próximo painel. */
  const exit = useTransform(progress, [index / n, (index + 1) / n], [0, 1]);
  const scale = useTransform(exit, [0, 1], [1, 0.94]);
  const dim = useTransform(exit, [0, 1], [0, 0.35]);
  const local = useTransform(
    progress,
    [Math.max(index - 1, 0) / n, Math.min(index + 1, n) / n],
    [0, 1],
  );

  return (
    <PanelCtx.Provider value={{ local, exit, first: index === 0 }}>
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 will-change-transform"
      >
        {children}
        <motion.div
          style={{ opacity: dim }}
          className="pointer-events-none absolute inset-0 z-20 bg-ink-950"
        />
      </motion.div>
    </PanelCtx.Provider>
  );
}

type StickyStackProps = {
  children: React.ReactNode;
  /* Overlay fixo do deck (HUD, contador, barra de progresso). */
  overlay?: (progress: MotionValue<number>) => React.ReactNode;
  className?: string;
  /* Classe de cada item no modo fluxo (mobile/reduced motion). */
  flowClassName?: string;
};

/* Deck em componente próprio: remonta na troca fluxo↔deck para que o
   useScroll re-vincule a ref do wrapper (ele não observa trocas de ref). */
function DeckView({
  panels,
  overlay,
  className,
}: {
  panels: React.ReactNode[];
  overlay?: StickyStackProps["overlay"];
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const count = panels.length;

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ height: `${count * 100}vh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {panels.map((p, i) => (
          <PanelShell key={i} index={i} count={count} progress={scrollYProgress}>
            {p}
          </PanelShell>
        ))}
        {overlay?.(scrollYProgress)}
      </div>
    </div>
  );
}

/* Deck pinado: wrapper de n*100vh com viewport sticky; cada painel
   desliza por cima do anterior conforme o scroll (estilo Terminal).
   IMPORTANTE: não coloque este componente dentro de ancestral com
   transform (quebra o position: sticky). */
export function StickyStack({
  children,
  overlay,
  className,
  flowClassName,
}: StickyStackProps) {
  const reduce = useReducedMotion();
  const [flow, setFlow] = useState(false);

  /* useLayoutEffect: troca deck→fluxo antes do primeiro paint no mobile,
     sem mismatch de hydration (SSR sempre renderiza o deck). */
  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setFlow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const panels = Children.toArray(children);

  if (flow || reduce) {
    return (
      <div className={cn("flex flex-col gap-5 md:gap-7", className)}>
        {panels.map((p, i) => (
          <div key={i} className={flowClassName}>
            {p}
          </div>
        ))}
      </div>
    );
  }

  return <DeckView panels={panels} overlay={overlay} className={className} />;
}
