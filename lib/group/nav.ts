import type { Market } from "./market";
import { unitRoutes } from "./routes";

/* `labelKey` é a chave completa no catálogo de tradução (messages/*.json) —
   quem renderiza chama t(labelKey). Manter a chave aqui, em vez do texto,
   é o que permite um único conjunto de links servir os dois mercados. */
export type NavLink = { href: string; labelKey: string };

/* Rotas que existem em todos os mercados. É o menu do topo, igual no Brasil e
   no Paraguai: com as quatro unidades brasileiras somadas, a barra passava de
   sete itens e quebrava em duas linhas. As unidades continuam a um clique,
   pela seção Unidades da raiz e pelo rodapé.

   O "Início" é explícito e não apenas implícito no logo: de dentro do
   portfólio ou de uma unidade, voltar para a home é a ação mais provável, e
   depender de o visitante saber que o logo é clicável custa gente no caminho. */
export function getNavLinks(): NavLink[] {
  return [
    { href: "/", labelKey: "nav.inicio" },
    { href: "/portfolio", labelKey: "nav.portfolio" },
    { href: "/sobre", labelKey: "nav.sobre" },
  ];
}

/* Só as unidades secundárias: a construção é a própria raiz do mercado e já
   está no logo da navbar. Vazio no Paraguai. */
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

/* O formulário de contato vive na página da construção, que é a raiz de todo
   mercado — daí a âncora ser a mesma em qualquer página e não depender mais do
   mercado. O <Link> do next-intl prefixa o mercado corrente, então de
   /br/metalurgica isto resolve para /br#contato. */
export function getContactHref(): string {
  return "/#contato";
}
