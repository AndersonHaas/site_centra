import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { ConstrucaoContent } from "@/components/pages/ConstrucaoContent";
import { GroupHub } from "@/components/pages/GroupHub";
import { isSingleUnitMarket } from "@/lib/group/routes";
import type { Market } from "@/lib/group/market";
import { buildAlternates } from "@/lib/seo";

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

/* Raiz do mercado. O que ela mostra depende de quantas unidades operam ali:

   - Brasil (4 unidades) → hub do grupo, que apresenta e distribui.
   - Paraguai (só construção civil) → a própria página da construtora. Antes
     havia aqui um hub com um único card, o que custava um clique e não
     entregava nada; /py/construcao virou redirect para cá. */
export default async function MarketHomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return isSingleUnitMarket(locale) ? (
    <ConstrucaoContent market={locale} />
  ) : (
    <GroupHub market={locale} />
  );
}
