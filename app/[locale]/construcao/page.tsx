import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Obras } from "@/components/sections/Obras";
import { Credenciais } from "@/components/sections/Credenciais";
import { Fundacao } from "@/components/sections/Fundacao";
import { Stats } from "@/components/sections/Stats";
import { Clientes } from "@/components/sections/Clientes";
import { Contato } from "@/components/sections/Contato";
import { Footer } from "@/components/sections/Footer";
import type { Market } from "@/lib/group/market";

type Props = {
  params: Promise<{ locale: string }>;
};

/* Diferenciais que antes eram "unidades" no antigo array de soluções
   (removido de lib/content.ts, agora sem consumidores) e agora vivem como
   destaques dentro da unidade de construção. BR-only por enquanto — sem
   copy em espanhol ainda. */
const DIFERENCIAIS = [
  {
    title: "Terraplanagem",
    desc: "Preparação e movimentação de terra com frota própria, garantindo base sólida para cada empreendimento.",
  },
  {
    title: "Gestão de projetos",
    desc: "Equipe técnica integrada que atua em todas as etapas, do planejamento à entrega de resultados consistentes.",
  },
];

export default async function ConstrucaoPage({ params }: Props) {
  const { locale } = await params;
  const market = locale as Market;

  return (
    <>
      <Navbar market={market} />
      <main>
        <Hero />
        <TrustBar />
        <Obras />
        <Credenciais />
        {market === "br" && (
          <section className="relative bg-surface py-20 md:py-28">
            <div className="container-x">
              <p className="hud text-brand-600">Diferenciais</p>
              <h2 className="display mt-4 max-w-xl text-2xl sm:text-3xl">
                Mais do que construção civil.
              </h2>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {DIFERENCIAIS.map((d) => (
                  <div
                    key={d.title}
                    className="rounded-2xl border border-hair bg-paper p-6"
                  >
                    <h3 className="text-base font-semibold text-ink">
                      {d.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      {d.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        <Fundacao />
        <Stats />
        <Clientes />
        <Contato />
      </main>
      <Footer market={market} />
    </>
  );
}
