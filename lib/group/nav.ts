import type { Market } from "./market";
import { isSingleUnitMarket, unitRoutes } from "./routes";

/* `labelKey` é a chave completa no catálogo de tradução (messages/*.json) —
   quem renderiza chama t(labelKey). Manter a chave aqui, em vez do texto,
   é o que permite um único conjunto de links servir os dois mercados. */
export type NavLink = { href: string; labelKey: string };

/* Rotas que existem em todos os mercados. É o menu do topo, igual no Brasil e
   no Paraguai: com as quatro unidades brasileiras somadas, a barra passava de
   sete itens e quebrava em duas linhas. As unidades continuam a um clique,
   pelos cards do hub /br (para onde o logo aponta) e pelo rodapé. */
export function getNavLinks(): NavLink[] {
  return [
    { href: "/obras", labelKey: "nav.obras" },
    { href: "/sobre", labelKey: "nav.sobre" },
    { href: "/equipe", labelKey: "nav.equipe" },
  ];
}

/* Vazio num mercado de unidade única, onde a unidade não tem rota própria. */
export function getUnitLinks(market: Market): NavLink[] {
  return unitRoutes(market).map((unit) => ({
    href: `/${unit}`,
    labelKey: `units.${unit}.label`,
  }));
}

/* O rodapé tem espaço e é o que mantém um link rastreável para cada página de
   unidade em todas as páginas do site — não só nos cards do hub. */
export function getFooterLinks(market: Market): NavLink[] {
  return [...getUnitLinks(market), ...getNavLinks()];
}

/* Onde vive o formulário de contato em cada mercado. Num mercado de unidade
   única a página da unidade É a raiz, então a âncora é local. */
export function getContactHref(market: Market): string {
  return isSingleUnitMarket(market) ? "/#contato" : "/construcao#contato";
}
