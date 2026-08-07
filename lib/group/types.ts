import type { Market } from "./market";

export type BusinessUnitId =
  | "construcao"
  | "pre-moldados"
  | "metalurgica"
  | "guindastes";

export interface LegalEntity {
  name: string;
  taxIdLabel: "CNPJ" | "RUC";
  taxId: string | null;
  address: string;
  phone: string;
}

export interface MarketConfig {
  market: Market;
  legalEntity: LegalEntity;
  activeUnits: readonly BusinessUnitId[];
  contact: { phone: string; email: string };
}
