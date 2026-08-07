/* Conteúdo institucional da Centra — extraído do briefing oficial */

import { PROJECTS } from "./portfolio-data";

export { PROJECTS };

export const STATS = [
  { value: 550, suffix: "mil m²", label: "Área construída" },
  { value: 4, suffix: "estados", label: "Presença no Sul + MS" },
  { value: 8, suffix: "+", label: "Engenheiros na equipe técnica" },
  { value: 100, suffix: "%", label: "Compromisso com prazo e segurança" },
];

export const PRESENCE = [
  { uf: "PR", name: "Paraná" },
  { uf: "SC", name: "Santa Catarina" },
  { uf: "RS", name: "Rio Grande do Sul" },
  { uf: "MS", name: "Mato Grosso do Sul" },
  { uf: "PY", name: "Paraguai" },
];

export const FOUNDERS = [
  {
    name: "José Ricardo Pasetti",
    role: "Sócio-fundador · Engenheiro Civil",
    crea: "CREA PR-133.881",
  },
  {
    name: "Yves Hide Saloio",
    role: "Sócio-fundador · Engenheiro Civil",
    crea: "CREA PR-90.334/D",
  },
];

export const CLIENTS = [
  { name: "Copacol", note: "Cooperativa Agroindustrial" },
  { name: "C.Vale", note: "Cooperativa Agroindustrial" },
];

/* Obras realizadas — fotos reais em media/works.
   NOTA: textos descritivos em nível de categoria (setor/escopo) são
   verdadeiros; confirme títulos/locais específicos de cada obra antes de
   publicar. */
export const WORKS = [
  {
    slug: "cvale-complexo",
    client: "C.Vale",
    title: "Complexo agroindustrial",
    summary:
      "Unidade industrial de grande porte integrando silos, armazéns e edificações administrativas.",
    scope: "Obra civil · Estrutura metálica",
    sector: "Agroindustrial",
    location: "Paraná · BR",
  },
  {
    slug: "cvale-fachada",
    client: "C.Vale",
    title: "Edifício corporativo",
    summary:
      "Edificação comercial com fachada em pele de vidro e acabamento de alto padrão.",
    scope: "Obra civil · Acabamento",
    sector: "Comercial",
    location: "Paraná · BR",
  },
  {
    slug: "copacol-unidade",
    client: "Copacol",
    title: "Unidade industrial",
    summary:
      "Galpão industrial de grande vão com cobertura metálica e identidade visual aplicada à fachada.",
    scope: "Estrutura metálica · Cobertura",
    sector: "Industrial",
    location: "Paraná · BR",
  },
  {
    slug: "silos-goldenhour",
    client: "Armazenagem",
    title: "Conjunto de silos",
    summary:
      "Estruturas de armazenagem de grãos com passarelas e sistemas de transporte de carga.",
    scope: "Estrutura metálica · Montagem",
    sector: "Agroindustrial",
    location: "Sul do Brasil",
  },
] as const;

export type ProjectClient = (typeof PROJECTS)[number]["client"];

export const SECTORS = ["Industrial", "Agroindustrial", "Comercial"];
