import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Portfolio } from "@/components/sections/Portfolio";
import { Footer } from "@/components/sections/Footer";
import type { Market } from "@/lib/group/market";
import { buildAlternates } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Market }>;
};

const META: Record<Market, { title: string; description: string }> = {
  br: {
    title: "Obras",
    description:
      "Portfólio de obras do Grupo Centra — projetos entregues para cooperativas agroindustriais e clientes industriais no Sul do Brasil.",
  },
  py: {
    title: "Obras",
    description:
      "Portafolio de obras del Grupo Centra. Las obras ejecutadas en Brasil están identificadas como tales, con el país de ejecución en cada proyecto.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: META[locale].title,
    description: META[locale].description,
    alternates: buildAlternates(locale, "/obras"),
  };
}

export default async function ObrasPage({ params }: Props) {
  const { locale } = await params;
  const market = locale;

  return (
    <>
      <Navbar market={market} />
      <main className="pt-[70px]">
        <Portfolio market={market} showAttributionNote={market === "py"} />
      </main>
      <Footer market={market} />
    </>
  );
}
