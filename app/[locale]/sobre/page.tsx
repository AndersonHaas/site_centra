import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { About } from "@/components/sections/About";
import { Footer } from "@/components/sections/Footer";
import type { Market } from "@/lib/group/market";

export const metadata: Metadata = {
  title: "A Centra",
  description:
    "Conheça a Centra Engenharia — missão, visão, valores e a equipe que transforma projetos em empreendimentos de alto desempenho.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

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
