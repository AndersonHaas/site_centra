import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { BUSINESS_UNITS } from "@/lib/group/units";
import { MARKETS } from "@/lib/group/markets";
import type { Market } from "@/lib/group/market";
import { buildAlternates } from "@/lib/seo";

/* Reduz um telefone formatado (ex.: "+55 (45) 0000-0000") a um URI tel: válido,
   mantendo apenas dígitos e o "+" inicial. */
function toTelHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

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

const META: Record<Market, { title: string; description: string }> = {
  br: {
    title: "Metalúrgica",
    description:
      "Fabricação e montagem de estruturas metálicas de alto desempenho, com precisão e segurança.",
  },
  py: {
    title: "Metalúrgica",
    description:
      "Fabricación y montaje de estructuras metálicas de alto desempeño.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const market = locale as Market;
  return {
    title: META[market].title,
    description: META[market].description,
    alternates: buildAlternates(market, "/metalurgica"),
  };
}

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
            <a
              href={toTelHref(MARKETS[market].contact.phone)}
              className="btn-primary mt-6 inline-flex"
            >
              {copy.contactCta}
            </a>
          </div>
        </section>
      </main>
      <Footer market={market} />
    </>
  );
}
