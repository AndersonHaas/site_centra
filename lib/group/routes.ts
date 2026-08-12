import type { Market } from "./market";
import type { BusinessUnitId } from "./types";
import { MARKETS } from "./markets";
import { BUSINESS_UNITS } from "./units";

/* Mercado de unidade única: quando o grupo opera uma só unidade num
   mercado, essa unidade NÃO ganha sub-rota própria — ela é o conteúdo da
   raiz do mercado. É o caso do Paraguai, onde só a construção civil opera:
   /py já é a página da construtora, sem um hub intermediário de um card só.
   No Brasil, com quatro unidades, /br continua sendo o hub do grupo. */
export function isSingleUnitMarket(market: Market): boolean {
  return MARKETS[market].activeUnits.length === 1;
}

/* Unidades que têm rota /<mercado>/<unidade> própria — subconjunto de
   activeUnits, vazio num mercado de unidade única.

   Fonte única de verdade para o menu, o sitemap, o hreflang e o
   generateStaticParams de cada página de unidade. É isso que garante que
   nenhum link ou alternate aponte para uma URL que 404a ou redireciona, e
   que a URL de uma unidade inativa simplesmente não exista naquele
   mercado. */
export function unitRoutes(market: Market): readonly BusinessUnitId[] {
  return isSingleUnitMarket(market) ? [] : MARKETS[market].activeUnits;
}

/* Rotas que existem em todos os mercados, independentes de unidade de
   negócio. "" é a raiz do mercado (/br, /py). */
export const SHARED_PATHS = [
  "",
  "/sobre",
  "/equipe",
  "/obras",
  "/aviso-legal",
] as const;

const ALL_MARKETS: readonly Market[] = ["br", "py"];

/* Em quais mercados esta rota realmente resolve.

   Só recebe rotas conhecidas: SHARED_PATHS ou "/<unidade>". */
export function marketsForPath(path: string): Market[] {
  const unit = path.slice(1) as BusinessUnitId;
  if (path.startsWith("/") && unit in BUSINESS_UNITS) {
    return ALL_MARKETS.filter((m) => unitRoutes(m).includes(unit));
  }
  return [...ALL_MARKETS];
}

/* Todas as rotas que resolvem num dado mercado — usada pelo sitemap. */
export function pathsForMarket(market: Market): string[] {
  return [...SHARED_PATHS, ...unitRoutes(market).map((unit) => `/${unit}`)];
}
