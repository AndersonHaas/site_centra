import type { Market } from "./market";
import type { BusinessUnitId } from "./types";
import { MARKETS } from "./markets";
import { BUSINESS_UNITS } from "./units";

/* A construção civil é o carro-chefe comercial do grupo: as outras unidades
   vendem pouco perto dela. Por isso ela NÃO tem sub-rota própria em mercado
   nenhum — é o conteúdo da raiz do mercado (/br, /py), sem um hub
   intermediário cobrando um clique antes do que o visitante veio ver. As
   demais unidades continuam em páginas próprias, apresentadas na raiz pela
   seção Unidades. */
export const ROOT_UNIT: BusinessUnitId = "construcao";

/* Unidades que têm rota /<mercado>/<unidade> própria — activeUnits menos a
   unidade-raiz. Vazio no Paraguai, onde só a construção opera.

   Fonte única de verdade para o menu, o sitemap, o hreflang e o
   generateStaticParams de cada página de unidade. É isso que garante que
   nenhum link ou alternate aponte para uma URL que 404a ou redireciona, e
   que a URL de uma unidade inativa simplesmente não exista naquele
   mercado. */
export function unitRoutes(market: Market): readonly BusinessUnitId[] {
  return MARKETS[market].activeUnits.filter((unit) => unit !== ROOT_UNIT);
}

/* Rotas que existem em todos os mercados, independentes de unidade de
   negócio. "" é a raiz do mercado (/br, /py). */
export const SHARED_PATHS = [
  "",
  "/sobre",
  "/portfolio",
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
