export type Market = "br" | "py";
export type Language = "pt" | "es";

export const MARKET_LANGUAGE: Record<Market, Language> = {
  br: "pt",
  py: "es",
};

export const HTML_LANG: Record<Market, string> = {
  br: "pt-BR",
  py: "es-419",
};

export const OG_LOCALE: Record<Market, string> = {
  br: "pt_BR",
  py: "es_419",
};

/* Código hreflang por mercado. Deliberadamente diferente de HTML_LANG:
   `lang` descreve a variante de idioma efetivamente servida na página
   (es-419 = espanhol da América Latina), enquanto hreflang serve para o
   buscador direcionar o resultado ao país certo — e segmentar o Paraguai
   é justamente o objetivo de toda a estrutura /py. */
export const HREFLANG: Record<Market, string> = {
  br: "pt-BR",
  py: "es-PY",
};
