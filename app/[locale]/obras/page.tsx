import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Portfolio } from "@/components/sections/Portfolio";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Obras",
  description:
    "Portfólio completo de obras da Centra Engenharia — projetos entregues para cooperativas agroindustriais no Sul do Brasil.",
};

export default function ObrasPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[70px]">
        <Portfolio />
      </main>
      <Footer />
    </>
  );
}
