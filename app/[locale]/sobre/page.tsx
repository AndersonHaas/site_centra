import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { About } from "@/components/sections/About";
import { Footer } from "@/components/sections/Footer";
import type { Market } from "@/lib/group/market";
import { buildAlternates } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

const META: Record<Market, { title: string; description: string }> = {
  br: {
    title: "A Centra",
    description:
      "Conheça a Centra — missão, visão, valores e a equipe que transforma projetos em empreendimentos de alto desempenho. Atuação no Brasil e, na construção civil, também no Paraguai.",
  },
  py: {
    title: "Nosotros",
    description:
      "Conozca al Grupo Centra — misión, visión, valores y el equipo que transforma proyectos en emprendimientos de alto desempeño. Operamos en Brasil y en Paraguay.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const market = locale as Market;
  return {
    title: META[market].title,
    description: META[market].description,
    alternates: buildAlternates(market, "/sobre"),
  };
}

export default async function SobrePage({ params }: Props) {
  const { locale } = await params;
  const market = locale as Market;

  return (
    <>
      <Navbar market={market} />
      <main className="pt-[70px]">
        <About market={market} />
      </main>
      <Footer market={market} />
    </>
  );
}
