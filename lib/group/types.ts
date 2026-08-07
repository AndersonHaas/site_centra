import type { Market } from "./market";

export type BusinessUnitId =
  | "construcao"
  | "pre-moldados"
  | "metalurgica"
  | "guindastes";

export type ProjectCountry = "BR" | "PY";
export type ProjectExecutingEntity = "centra-br" | "centra-py";

/**
 * Dados registrais da entidade legal de cada mercado.
 *
 * Todo campo ainda não confirmado é `null` — nunca um placeholder em forma de
 * string. Uma string aqui é lida como fato estabelecido pelo leitor da página
 * de aviso legal; `null` obriga a UI a renderizar "a confirmar".
 * `taxIdLabel` é a exceção: é uma constante real e conhecida por mercado.
 */
export interface LegalEntity {
  name: string | null;
  taxIdLabel: "CNPJ" | "RUC";
  taxId: string | null;
  address: string | null;
  phone: string | null;
}

export interface MarketConfig {
  market: Market;
  legalEntity: LegalEntity;
  activeUnits: readonly BusinessUnitId[];
  contact: { phone: string; email: string };
}
