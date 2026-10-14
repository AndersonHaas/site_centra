import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { ConstrucaoContent } from "@/components/pages/ConstrucaoContent";
import type { Market } from "@/lib/group/market";
import { buildAlternates } from "@/lib/seo";
import { getPortfolio, portfolioClients } from "@/lib/portfolio";

type Props = {
  params: Promise<{ locale: Market }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(locale, ""),
  };
}

/* Raiz do mercado: a página da construção civil, em todos os mercados.

   A construção é o carro-chefe comercial — as outras unidades vendem pouco
   perto dela —, então ela ocupa a home em vez de ficar atrás de um hub que
   cobrava um clique antes do que o visitante veio ver. As demais unidades
   continuam em páginas próprias, apresentadas aqui pela seção Unidades; no
   Paraguai, onde só a construção opera, essa seção não renderiza nada.
   /br/construcao e /py/construcao redirecionam para cá (next.config.ts). */
export default async function MarketHomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // A faixa "A confiança de quem constrói…" lista os clientes cadastrados no
  // portfólio do DashboardCentra — mesma busca (e cache/tag) da página
  // /portfolio, então publicar uma obra de cliente novo atualiza as duas.
  const clients = portfolioClients(await getPortfolio(locale));

  return <ConstrucaoContent market={locale} clients={clients} />;
}
