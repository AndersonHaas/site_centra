import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { BUSINESS_UNITS } from "@/lib/group/units";
import type { Market } from "@/lib/group/market";

const COPY: Record<Market, { eyebrow: string; description: string; catalogNote: string; contactCta: string }> = {
  br: {
    eyebrow: "Unidade de negócio",
    description:
      "Metalúrgica do Grupo Centra: fabricação e montagem de estruturas metálicas de alto desempenho.",
    catalogNote:
      "Catálogo de linha de produto e capacidade fabril — em atualização. Fale com nosso time comercial para especificações e prazos.",
    contactCta: "Falar com o time comercial",
  },
  py: {
    eyebrow: "Unidad de negocio",
    description: "Metalúrgica del Grupo Centra.",
    catalogNote: "Contenido en actualización.",
    contactCta: "Hablar con el equipo comercial",
  },
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function MetalurgicaPage({ params }: Props) {
  const { locale } = await params;
  const market = locale as Market;
  const copy = COPY[market];

  return (
    <>
      <Navbar market={market} />
      <main className="pt-[70px]">
        <section className="container-x py-24 md:py-32">
          <p className="hud text-brand-600">{copy.eyebrow}</p>
          <h1 className="display mt-4 text-3xl md:text-5xl">
            {BUSINESS_UNITS.metalurgica.label[market]}
          </h1>
          <p className="mt-6 max-w-2xl text-ink-soft">{copy.description}</p>
          <div className="mt-10 rounded-2xl border border-hair bg-surface p-6">
            <p className="text-sm text-ink-soft">{copy.catalogNote}</p>
            <a href="#contato" className="btn-primary mt-6 inline-flex">
              {copy.contactCta}
            </a>
          </div>
        </section>
      </main>
      <Footer market={market} />
    </>
  );
}
