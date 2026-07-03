import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Equipe } from "@/components/sections/Equipe";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Equipe",
  description:
    "Conheça os engenheiros e profissionais da Centra Engenharia que entregam obras de alto desempenho no Sul do Brasil.",
};

export default function EquipePage() {
  return (
    <>
      <Navbar />
      <main className="pt-[70px]">
        <Equipe />
      </main>
      <Footer />
    </>
  );
}
