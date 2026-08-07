import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Portfolio } from "@/components/sections/Portfolio";
import { Footer } from "@/components/sections/Footer";
import type { Market } from "@/lib/group/market";

export const metadata: Metadata = {
  title: "Obras",
  description:
    "Portfólio completo de obras da Centra Engenharia — projetos entregues para cooperativas agroindustriais no Sul do Brasil.",
};

type Props = {
  params: Promise<{ locale: Market }>;
};

export default async function ObrasPage({ params }: Props) {
  const { locale } = await params;
  const market = locale;

  return (
    <>
      <Navbar />
      <main className="pt-[70px]">
        <Portfolio market={market} showAttributionNote={market === "py"} />
      </main>
      <Footer />
    </>
  );
}
