import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { UnitPage } from "@/components/pages/UnitPage";
import type { Market } from "@/lib/group/market";
import { buildAlternates } from "@/lib/seo";
import { marketsForPath } from "@/lib/group/routes";

/* A unidade só existe como rota nos mercados em que opera. Restringir os
   params aqui (com dynamicParams desligado) faz /py/guindastes ser uma URL que não
   casa com rota nenhuma — e portanto cair no 404 do app/global-not-found.tsx,
   com layout e estilo. Um notFound() em rota existente devolveria o shell de
   erro cru do Next, porque não há app/layout.tsx para compor a página. */
export function generateStaticParams() {
  return marketsForPath("/guindastes").map((locale) => ({ locale }));
}

export const dynamicParams = false;

type Props = {
  params: Promise<{ locale: Market }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.guindastes" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(locale, "/guindastes"),
  };
}

export default async function GuindastesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <UnitPage market={locale} unit="guindastes" />;
}
