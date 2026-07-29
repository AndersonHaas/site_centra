import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Solutions } from "@/components/sections/Solutions";
import { Estrutura } from "@/components/sections/Estrutura";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Soluções",
  description:
    "Construção civil, terraplanagem, estruturas metálicas e pré-moldados. Soluções completas de engenharia da Centra para os setores industrial e agroindustrial.",
};

export default function SolucoesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[70px]">
        <Solutions />
        <Estrutura />
      </main>
      <Footer />
    </>
  );
}
