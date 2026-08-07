/* Conteúdo institucional da Centra — extraído do briefing oficial */

import { PROJECTS } from "./portfolio-data";

export { PROJECTS };

export const STATS = [
  { value: 550, suffix: "mil m²", label: "Área construída" },
  { value: 4, suffix: "estados", label: "Presença no Sul + MS" },
  { value: 8, suffix: "+", label: "Engenheiros na equipe técnica" },
  { value: 100, suffix: "%", label: "Compromisso com prazo e segurança" },
];

export const PILLARS = [
  {
    key: "missao",
    title: "Missão",
    body: "Entregar soluções de engenharia e construção com excelência técnica, inovação e eficiência operacional, transformando projetos em empreendimentos de alto desempenho — com compromisso, segurança e responsabilidade, gerando valor sustentável para clientes, parceiros e comunidades.",
  },
  {
    key: "visao",
    title: "Visão",
    body: "Ser reconhecida como uma das principais referências em engenharia e construção da região Sul do Brasil, destacando-se pela qualidade das entregas, solidez das relações, capacidade técnica e contribuição para o desenvolvimento dos setores industrial, agroindustrial e comercial.",
  },
  {
    key: "valores",
    title: "Valores",
    body: "Atuamos com ética, transparência e comprometimento em todas as relações e projetos. Valorizamos a excelência técnica, a segurança, a inovação e o desenvolvimento contínuo, buscando soluções de alta qualidade que gerem resultados duradouros.",
  },
];

export const SOLUTIONS = [
  {
    title: "Construção civil",
    desc: "Execução completa de obras industriais, agroindustriais e comerciais, do projeto à entrega final.",
    icon: "Building2",
  },
  {
    title: "Terraplanagem",
    desc: "Preparação e movimentação de terra com frota própria, garantindo base sólida para cada empreendimento.",
    icon: "Mountain",
  },
  {
    title: "Estruturas metálicas",
    desc: "Fabricação e montagem de estruturas metálicas de alto desempenho, com precisão e segurança.",
    icon: "Frame",
  },
  {
    title: "Pré-moldados & pré-fabricados",
    desc: "Produção de elementos pré-moldados e pré-fabricados que aceleram prazos sem abrir mão da qualidade.",
    icon: "Boxes",
  },
  {
    title: "Frota de guindastes",
    desc: "Moderna frota de guindastes e equipamentos para movimentação de cargas em obras de grande porte.",
    icon: "Construction",
  },
  {
    title: "Gestão de projetos",
    desc: "Equipe técnica integrada que atua em todas as etapas, do planejamento à entrega de resultados consistentes.",
    icon: "ClipboardCheck",
  },
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
