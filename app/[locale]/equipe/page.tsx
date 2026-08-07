import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Equipe } from "@/components/sections/Equipe";
import { Footer } from "@/components/sections/Footer";
import type { Market } from "@/lib/group/market";
import { buildAlternates } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

const META: Record<Market, { title: string; description: string }> = {
  br: {
    title: "Equipe",
    description:
      "Conheça os engenheiros e profissionais da Centra que entregam obras de alto desempenho no Sul do Brasil.",
  },
  py: {
    title: "Equipo",
    description:
      "Conozca a los ingenieros y profesionales del Grupo Centra. El mismo equipo fundador, con sede en Brasil, conduce la expansión en Paraguay.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const market = locale as Market;
  return {
    title: META[market].title,
    description: META[market].description,
    alternates: buildAlternates(market, "/equipe"),
  };
}

export default async function EquipePage({ params }: Props) {
  const { locale } = await params;
  const market = locale as Market;

  return (
    <>
      <Navbar market={market} />
      <main className="pt-[70px]">
        <Equipe market={market} />
      </main>
      <Footer market={market} />
    </>
  );
}
