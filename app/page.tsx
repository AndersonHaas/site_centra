import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Stats } from "@/components/sections/Stats";
import { About } from "@/components/sections/About";
import { Solutions } from "@/components/sections/Solutions";
import { Estrutura } from "@/components/sections/Estrutura";
import { Obras } from "@/components/sections/Obras";
import { Equipe } from "@/components/sections/Equipe";
import { Clientes } from "@/components/sections/Clientes";
import { Contato } from "@/components/sections/Contato";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Stats />
        <About />
        <Solutions />
        <Estrutura />
        <Obras />
        <Equipe />
        <Clientes />
        <Contato />
      </main>
      <Footer />
    </>
  );
}
