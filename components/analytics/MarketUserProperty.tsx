"use client";

import { useEffect } from "react";
import type { Market } from "@/lib/group/market";

type GtagWindow = Window & {
  gtag?: (command: string, ...args: unknown[]) => void;
};

/* Define o mercado (br/py) como user property do GA4.

   Segmentar Brasil × Paraguai por user property é mais robusto do que
   depender de regex de path do lado do GA4: o dado viaja junto do evento,
   sobrevive a mudanças de URL e funciona em relatórios que não expõem o
   caminho da página. Só existe dentro da árvore [locale] — em "/" (o
   seletor de país) o visitante ainda não escolheu mercado nenhum. */
export function MarketUserProperty({ market }: { market: Market }) {
  useEffect(() => {
    const w = window as GtagWindow;
    w.gtag?.("set", "user_properties", { market });
  }, [market]);

  return null;
}
