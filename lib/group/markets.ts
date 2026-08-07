import type { MarketConfig } from "./types";

export const MARKETS: Record<"br" | "py", MarketConfig> = {
  br: {
    market: "br",
    legalEntity: {
      name: "Centra Engenharia e Empreendimentos Ltda.",
      taxIdLabel: "CNPJ",
      taxId: "00.000.000/0001-00", // placeholder — CNPJ real ainda não informado
      address: "Endereço a confirmar — Paraná, Brasil", // placeholder
      phone: "+55 (45) 0000-0000", // placeholder, mesmo valor já usado em Contato.tsx
    },
    activeUnits: ["construcao", "pre-moldados", "metalurgica", "guindastes"],
    contact: {
      phone: "+55 (45) 0000-0000",
      email: "contato@centraengenharia.com.br",
    },
  },
  py: {
    market: "py",
    legalEntity: {
      name: "Centra Paraguay S.A.", // placeholder — razão social real ainda não informada
      taxIdLabel: "RUC",
      taxId: "00000000-0", // placeholder — RUC real ainda não informado
      address: "Dirección a confirmar — Paraguay", // placeholder
      phone: "+595 (00) 000-0000", // placeholder
    },
    activeUnits: ["construcao"],
    contact: {
      phone: "+595 (00) 000-0000",
      email: "contacto@centra.com", // placeholder — domínio final ainda não decidido
    },
  },
};
