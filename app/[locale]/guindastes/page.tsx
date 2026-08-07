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
      "Locação de guindastes do Grupo Centra: frota e equipamentos para movimentação de cargas em obras de grande porte.",
    catalogNote:
      "Tabela de alcance e carga por equipamento, e páginas por base regional — em atualização. Fale com nosso time comercial para orçamento.",
    contactCta: "Solicitar orçamento",
  },
  py: {
    eyebrow: "Unidad de negocio",
    description: "Locación de grúas del Grupo Centra.",
    catalogNote: "Contenido en actualización.",
    contactCta: "Solicitar presupuesto",
  },
};

type Props = {
  params: Promise<{ locale: string }>;
};

const META: Record<Market, { title: string; description: string }> = {
  br: {
    title: "Locação de guindastes",
    description:
      "Frota de guindastes e equipamentos para movimentação de cargas em obras de grande porte.",
  },
  py: {
    title: "Locación de grúas",
    description:
      "Flota de grúas y equipos para movimiento de cargas en obras de gran porte.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const market = locale as Market;
  return {
    title: META[market].title,
    description: META[market].description,
    alternates: buildAlternates(market, "/guindastes"),
  };
}

export default async function GuindastesPage({ params }: Props) {
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
            {BUSINESS_UNITS.guindastes.label[market]}
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
