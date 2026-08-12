/* Dados institucionais da Centra — extraídos do briefing oficial.

   Só o que NÃO é texto de interface mora aqui: números, siglas, nomes
   próprios, slugs e parâmetros de animação. Todo rótulo e toda prosa vivem
   nos catálogos de tradução (messages/pt.json e messages/es.json), sob as
   chaves indicadas em cada bloco. Foi o que permitiu o Paraguai deixar de
   herdar texto em português. */

import { PROJECTS } from "./portfolio-data";

export { PROJECTS };

/* Presença agrupada por PAÍS, e não numa lista corrida de siglas.

   A forma da estrutura é a mensagem: numa lista única, "PY" virava a quinta
   sigla depois de quatro estados brasileiros e a atuação no Paraguai passava
   despercebida. Separada em dois países, a operação binacional fica dita já
   no layout (ver a faixa de atuação em components/sections/Obras.tsx).

   Nome do país em `obras.countries.<code>` e do estado em
   `obras.states.<code>`. */
export const PRESENCE = [
  { code: "BR", states: ["PR", "SC", "RS", "MS"] },
  { code: "PY", states: [] },
] as const;

/* Contado a partir da lista acima para o número da seção não descolar da
   faixa de atuação — as duas coisas aparecem na mesma página. */
const COUNTRY_COUNT = PRESENCE.length;

/* Rótulo e sufixo em `stats.items.<key>`. A grade da seção se adapta à
   quantidade de itens (ver GRID_COLS em Stats.tsx), então acrescentar ou
   remover uma métrica aqui não exige mexer no layout. */
export const STATS = [
  { key: "countries", value: COUNTRY_COUNT },
  { key: "commitment", value: 100 },
] as const;

/* Cargo em `credenciais.founderRole`. Nome e registro no CREA são fatos
   registrais — não se traduzem. */
export const FOUNDERS = [
  { name: "José Ricardo Pasetti", crea: "CREA PR-133.881" },
  { name: "Yves Hide Saloio", crea: "CREA PR-90.334/D" },
] as const;

/* Descrição em `clientes.notes.<key>`. A chave existe separada do nome
   porque o next-intl trata "." como separador de caminho no catálogo — e
   "C.Vale" viraria a chave "Vale" dentro de um objeto "C". */
export const CLIENTS = [
  { key: "copacol", name: "Copacol" },
  { key: "cvale", name: "C.Vale" },
] as const;

/* Cliente, título, resumo, escopo, setor e local em `works.<slug>` — fotos
   reais em media/works, importadas por slug em components/sections/Obras.tsx.
   NOTA: textos descritivos em nível de categoria (setor/escopo) são
   verdadeiros; confirme títulos/locais específicos de cada obra antes de
   publicar. */
export const WORKS = [
  "cvale-complexo",
  "cvale-fachada",
  "copacol-unidade",
  "silos-base-civil",
] as const;

export type ProjectClient = (typeof PROJECTS)[number]["client"];

/* Nome em `sectors.<key>` */
export const SECTORS = ["industrial", "agroindustrial", "comercial"] as const;

/* Título e especificação em `fundacao.stages.<key>`; `range` é a fatia do
   progresso de scroll em que a legenda daquela etapa fica visível. */
export const FOUNDATION_STAGES = [
  { key: "estacas", range: [0.04, 0.34] },
  { key: "anel", range: [0.36, 0.64] },
  /* Terceira etapa não é mais o costado do silo: aquilo é montagem do
     fabricante, não escopo da construtora. Fechar no silo em operação mantém
     a subida da câmera e diz o que a fundação sustenta. */
  { key: "operacao", range: [0.66, 0.96] },
] as const;
