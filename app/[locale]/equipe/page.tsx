import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Equipe } from "@/components/sections/Equipe";
import { Footer } from "@/components/sections/Footer";
import type { Market } from "@/lib/group/market";

export const metadata: Metadata = {
  title: "Equipe",
  description:
    "Conheça os engenheiros e profissionais da Centra Engenharia que entregam obras de alto desempenho no Sul do Brasil.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

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
