import type { Metadata } from "next";
import type { Market } from "./group/market";
import { HREFLANG } from "./group/market";
import { marketsForPath } from "./group/routes";

/* URL base do site: alimenta canonical, hreflang e sitemap. Ainda é o
   domínio da Vercel — a troca para o .com definitivo é a Fase 8 (cutover de
   domínio), e está numa constante só justamente para ser uma linha.

   Precisa ser um domínio que RESPONDA. O valor anterior
   (site-centra-ultimo.vercel.app) era o nome do repositório, não um domínio
   do projeto, e retornava 404 — ou seja, todo canonical e todo hreflang
   apontavam para uma URL morta, que é o bastante para o buscador descartar
   o par BR × PY inteiro. */
export const SITE_URL = "https://centraengenharia.vercel.app";

/* Canonical + hreflang de uma rota.

   Regras:
   - canonical é sempre auto-referencial: /{mercado}{path};
   - hreflang só é emitido quando a rota existe em mais de um mercado —
     nunca apontar para URL que 404a (ex.: /py/pre-moldados) nem para URL
     que redireciona (ex.: /py/construcao, hoje servida na raiz /py);
   - x-default aponta para "/", que detecta o mercado do visitante e
     redireciona — exatamente o caso de uso que o x-default descreve. */
export function buildAlternates(
  market: Market,
  path: string,
): Metadata["alternates"] {
  const markets = marketsForPath(path);

  if (markets.length < 2) {
    return { canonical: `/${market}${path}` };
  }

  const languages: Record<string, string> = {};
  for (const m of markets) {
    languages[HREFLANG[m]] = `/${m}${path}`;
  }
  languages["x-default"] = "/";

  return { canonical: `/${market}${path}`, languages };
}
