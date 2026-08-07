import type { Market } from "./market";
import type { BusinessUnitId } from "./types";
import { MARKETS } from "./markets";
import { BUSINESS_UNITS } from "./units";

/* Rotas que existem em todos os mercados, independentes de unidade de
   negócio. "" é a landing do grupo (/br, /py). */
export const SHARED_PATHS = [
  "",
  "/sobre",
  "/equipe",
  "/obras",
  "/aviso-legal",
] as const;

const ALL_MARKETS: readonly Market[] = ["br", "py"];

/* Em quais mercados esta rota realmente resolve. Fonte única de verdade:
   MARKETS[m].activeUnits — exatamente o mesmo array que o guard de
   roteamento (assertUnitActive) usa para 404ar unidade inativa. É isso que
   garante que nenhum hreflang aponte para uma URL que retorna 404.

   Só recebe rotas conhecidas: SHARED_PATHS ou "/<unidade>". */
export function marketsForPath(path: string): Market[] {
  const unit = path.slice(1) as BusinessUnitId;
  if (path.startsWith("/") && unit in BUSINESS_UNITS) {
    return ALL_MARKETS.filter((m) => MARKETS[m].activeUnits.includes(unit));
  }
  return [...ALL_MARKETS];
}

/* Todas as rotas que resolvem num dado mercado — usada pelo sitemap. */
export function pathsForMarket(market: Market): string[] {
  return [
    ...SHARED_PATHS,
    ...MARKETS[market].activeUnits.map((unit) => `/${unit}`),
  ];
}
