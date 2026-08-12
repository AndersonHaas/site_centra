import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/sections/Navbar";
import { Portfolio } from "@/components/sections/Portfolio";
import { Footer } from "@/components/sections/Footer";
import type { Market } from "@/lib/group/market";
import { buildAlternates } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Market }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.obras" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(locale, "/obras"),
  };
}

export default async function ObrasPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar market={locale} />
      <main className="pt-[70px]">
        {/* Todo o portfólio publicado é de obras no Brasil. No Paraguai isso
            precisa estar dito na página, não subentendido. */}
        <Portfolio showAttributionNote={locale === "py"} />
      </main>
      <Footer market={locale} />
    </>
  );
}
