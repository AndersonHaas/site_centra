import type { MarketConfig } from "./types";

export const MARKETS: Record<"br" | "py", MarketConfig> = {
  br: {
    market: "br",
    legalEntity: {
      name: "Centra Engenharia e Empreendimentos Ltda.", // razão social real, confirmada
      taxIdLabel: "CNPJ",
      taxId: null, // CNPJ real ainda não informado
      address: null, // endereço registral ainda não informado
      phone: null, // telefone registral ainda não informado (contact.phone abaixo é o comercial)
    },
    activeUnits: ["construcao", "pre-moldados", "metalurgica", "guindastes"],
    contact: {
      name: "José Ricado Pasetti",
      phone: "+55 (45) 99923-4050",
      email: "pasetti@centra.eng.br",
    },
  },
  py: {
    market: "py",
    legalEntity: {
      name: null, // razão social real ainda não informada — não presumir a existência/nome da entidade PY
      taxIdLabel: "RUC",
      taxId: null, // RUC real ainda não informado
      address: null, // endereço registral ainda não informado
      phone: null, // telefone registral ainda não informado (contact.phone abaixo é o comercial)
    },
    activeUnits: ["construcao"],
    contact: {
      name: "José Ricado Pasetti",
      phone: "+55 (45) 99923-4050",
      email: "pasetti@centra.eng.br",
    },
  },
};
