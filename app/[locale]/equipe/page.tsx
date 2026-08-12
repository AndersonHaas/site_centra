import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/sections/Navbar";
import { Equipe } from "@/components/sections/Equipe";
import { Footer } from "@/components/sections/Footer";
import type { Market } from "@/lib/group/market";
import { buildAlternates } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Market }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.equipe" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(locale, "/equipe"),
  };
}

export default async function EquipePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar market={locale} />
      <main className="pt-[70px]">
        <Equipe />
      </main>
      <Footer market={locale} />
    </>
  );
}
