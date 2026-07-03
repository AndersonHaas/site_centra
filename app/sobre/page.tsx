import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { About } from "@/components/sections/About";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "A Centra",
  description:
    "Conheça a Centra Engenharia — missão, visão, valores e a equipe que transforma projetos em empreendimentos de alto desempenho.",
};

export default function SobrePage() {
  return (
    <>
      <Navbar />
      <main className="pt-[70px]">
        <About />
      </main>
      <Footer />
    </>
  );
}
