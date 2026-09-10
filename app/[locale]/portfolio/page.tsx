import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/sections/Navbar";
import { Portfolio } from "@/components/sections/Portfolio";
import { Footer } from "@/components/sections/Footer";
import type { Market } from "@/lib/group/market";
import { buildAlternates } from "@/lib/seo";
import { getPortfolio } from "@/lib/portfolio";

type Props = {
  params: Promise<{ locale: Market }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.portfolio" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(locale, "/portfolio"),
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Obras vêm do DashboardCentra (Supabase) — só as publicadas de lá, ver
  // lib/portfolio.ts. Busca no servidor porque Portfolio.tsx é Client
  // Component (filtros/lightbox são interativos).
  const projects = await getPortfolio();

  return (
    <>
      <Navbar market={locale} />
      <main className="pt-[70px]">
        {/* Todo o portfólio publicado é de obras no Brasil. No Paraguai isso
            precisa estar dito na página, não subentendido. */}
        <Portfolio projects={projects} showAttributionNote={locale === "py"} />
      </main>
      <Footer market={locale} />
    </>
  );
}
