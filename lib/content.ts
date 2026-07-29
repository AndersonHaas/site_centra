/* Conteúdo institucional da Centra — extraído do briefing oficial */

export const NAV_LINKS = [
  { label: "Obras", href: "/#obras" },
  { label: "Clientes", href: "/#clientes" },
  { label: "Soluções", href: "/solucoes" },
  { label: "A Centra", href: "/sobre" },
  { label: "Equipe", href: "/equipe" },
];

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

export const STATES = [
  { uf: "PR", name: "Paraná" },
  { uf: "SC", name: "Santa Catarina" },
  { uf: "RS", name: "Rio Grande do Sul" },
  { uf: "MS", name: "Mato Grosso do Sul" },
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

export const TEAM = [
  { name: "Willian Reynaldi", role: "Engenheiro Civil" },
  { name: "Vagner Effting", role: "Engenheiro Civil" },
  { name: "Raffael Debazi", role: "Engenheiro Civil" },
  { name: "Karen Quel", role: "Engenheira Civil" },
  { name: "Mateus Kuniyosi", role: "Engenheiro Civil" },
  { name: "Bruno José", role: "Gestão de obras" },
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

/* Portfólio completo — página /obras. Fotos otimizadas em
   public/images/portfolio/, geradas por scripts/process-portfolio-photos.sh
   a partir de Fotos Marketing/ (fora do repo). Sem descrição textual por
   obra nesta fase — ver
   docs/superpowers/specs/2026-07-28-portfolio-obras-design.md. */
export const PROJECTS = [
  {
    slug: "cvale-bairro-catarinense",
    client: "C.Vale",
    title: "Bairro Catarinense",
    images: ["/images/portfolio/cvale-bairro-catarinense-1.jpg"],
  },
  {
    slug: "cvale-obra-285-cd",
    client: "C.Vale",
    title: "CD",
    images: [
      "/images/portfolio/cvale-obra-285-cd-1.jpg",
      "/images/portfolio/cvale-obra-285-cd-2.jpg",
      "/images/portfolio/cvale-obra-285-cd-3.jpg",
    ],
  },
  {
    slug: "cvale-encantado",
    client: "C.Vale",
    title: "Encantado",
    images: [
      "/images/portfolio/cvale-encantado-1.jpg",
      "/images/portfolio/cvale-encantado-2.jpg",
    ],
  },
  {
    slug: "cvale-insumos-alto-piquiri",
    client: "C.Vale",
    title: "Insumos Alto Piquiri",
    images: [
      "/images/portfolio/cvale-insumos-alto-piquiri-1.jpg",
      "/images/portfolio/cvale-insumos-alto-piquiri-2.jpg",
      "/images/portfolio/cvale-insumos-alto-piquiri-3.jpg",
    ],
  },
  {
    slug: "cvale-sao-francisco",
    client: "C.Vale",
    title: "São Francisco",
    images: ["/images/portfolio/cvale-sao-francisco-1.jpg"],
  },
  {
    slug: "cvale-sede-administrativa",
    client: "C.Vale",
    title: "Sede Administrativa",
    images: [
      "/images/portfolio/cvale-sede-administrativa-1.jpg",
      "/images/portfolio/cvale-sede-administrativa-2.jpg",
      "/images/portfolio/cvale-sede-administrativa-3.jpg",
    ],
  },
  {
    slug: "cvale-supermercado-maripa",
    client: "C.Vale",
    title: "Supermercado Maripá",
    images: [
      "/images/portfolio/cvale-supermercado-maripa-1.jpg",
      "/images/portfolio/cvale-supermercado-maripa-2.jpg",
      "/images/portfolio/cvale-supermercado-maripa-3.jpg",
    ],
  },
  {
    slug: "cvale-universidade",
    client: "C.Vale",
    title: "Universidade",
    images: [
      "/images/portfolio/cvale-universidade-1.jpg",
      "/images/portfolio/cvale-universidade-2.jpg",
    ],
  },
  {
    slug: "cvale-upd",
    client: "C.Vale",
    title: "UPD",
    images: [
      "/images/portfolio/cvale-upd-1.jpg",
      "/images/portfolio/cvale-upd-2.jpg",
      "/images/portfolio/cvale-upd-3.jpg",
    ],
  },
  {
    slug: "copacol-obra-271-amidonaria",
    client: "Copacol",
    title: "Amidonaria",
    images: [
      "/images/portfolio/copacol-obra-271-amidonaria-1.jpg",
      "/images/portfolio/copacol-obra-271-amidonaria-2.jpg",
      "/images/portfolio/copacol-obra-271-amidonaria-3.jpg",
    ],
  },
  {
    slug: "copacol-cpa",
    client: "Copacol",
    title: "CPA",
    images: [
      "/images/portfolio/copacol-cpa-1.jpg",
      "/images/portfolio/copacol-cpa-2.jpg",
      "/images/portfolio/copacol-cpa-3.jpg",
    ],
  },
  {
    slug: "copacol-matrizeiros",
    client: "Copacol",
    title: "Matrizeiros",
    images: [
      "/images/portfolio/copacol-matrizeiros-1.jpg",
      "/images/portfolio/copacol-matrizeiros-2.jpg",
      "/images/portfolio/copacol-matrizeiros-3.jpg",
    ],
  },
  {
    slug: "copacol-silo-jesuitas",
    client: "Copacol",
    title: "Silo Jesuítas",
    images: [
      "/images/portfolio/copacol-silo-jesuitas-1.jpg",
      "/images/portfolio/copacol-silo-jesuitas-2.jpg",
      "/images/portfolio/copacol-silo-jesuitas-3.jpg",
    ],
  },
  {
    slug: "copacol-obra-225-unidade-nova-aurora",
    client: "Copacol",
    title: "Unidade Nova Aurora",
    images: [
      "/images/portfolio/copacol-obra-225-unidade-nova-aurora-1.jpg",
      "/images/portfolio/copacol-obra-225-unidade-nova-aurora-2.jpg",
      "/images/portfolio/copacol-obra-225-unidade-nova-aurora-3.jpg",
    ],
  },
  {
    slug: "copacol-obra-229-unidade-penha",
    client: "Copacol",
    title: "Unidade Penha",
    images: [
      "/images/portfolio/copacol-obra-229-unidade-penha-1.jpg",
      "/images/portfolio/copacol-obra-229-unidade-penha-2.jpg",
      "/images/portfolio/copacol-obra-229-unidade-penha-3.jpg",
    ],
  },
  {
    slug: "copacol-upd",
    client: "Copacol",
    title: "UPD",
    images: [
      "/images/portfolio/copacol-upd-1.jpg",
      "/images/portfolio/copacol-upd-2.jpg",
      "/images/portfolio/copacol-upd-3.jpg",
    ],
  },
  {
    slug: "copacol-obra-307-urs",
    client: "Copacol",
    title: "URS",
    images: [
      "/images/portfolio/copacol-obra-307-urs-1.jpg",
      "/images/portfolio/copacol-obra-307-urs-2.jpg",
      "/images/portfolio/copacol-obra-307-urs-3.jpg",
    ],
  },
] as const;

export type ProjectClient = (typeof PROJECTS)[number]["client"];

export const SECTORS = ["Industrial", "Agroindustrial", "Comercial"];
