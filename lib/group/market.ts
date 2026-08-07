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
