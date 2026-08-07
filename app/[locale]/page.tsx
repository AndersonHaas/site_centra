import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { MARKETS } from "@/lib/group/markets";
import { BUSINESS_UNITS } from "@/lib/group/units";
import type { Market } from "@/lib/group/market";
import { buildAlternates } from "@/lib/seo";

/* Tailwind exige classes literais (não interpoladas) para funcionar no build,
   então o número de colunas é escolhido a partir de um mapa estático em vez
   de montar a string dinamicamente. */
const GRID_COLS: Record<number, string> = {
  1: "sm:grid-cols-1 max-w-md mx-auto",
  2: "sm:grid-cols-2 max-w-2xl mx-auto",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

const COPY: Record<Market, { eyebrow: string; title: string; description: string; cta: string }> = {
  br: {
    eyebrow: "Grupo Centra",
    title: "Engenharia e indústria de alto desempenho.",
    description:
      "Construção civil, pré-moldados e artefatos de cimento, estruturas metálicas e locação de guindastes — conheça as unidades do grupo.",
    cta: "Conhecer",
  },
  py: {
    eyebrow: "Grupo Centra",
    title: "Ingeniería y construcción de alto desempeño.",
    description:
      "Construcción civil del Grupo Centra en Paraguay, con el respaldo de la experiencia del grupo en Brasil.",
    cta: "Conocer",
  },
};

type Props = {
  params: Promise<{ locale: string }>;
};

const META: Record<Market, { title: string; description: string }> = {
  br: {
    title: "Grupo Centra — engenharia e indústria",
    description:
      "Construção civil, pré-moldados e artefatos de cimento, estruturas metálicas e locação de guindastes. Conheça as unidades de negócio do Grupo Centra.",
  },
  py: {
    title: "Grupo Centra — ingeniería y construcción",
    description:
      "Construcción civil del Grupo Centra en Paraguay, con el respaldo de la experiencia del grupo en Brasil.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const market = locale as Market;
  return {
    title: META[market].title,
    description: META[market].description,
    alternates: buildAlternates(market, ""),
  };
}

export default async function GroupLandingPage({ params }: Props) {
  const { locale } = await params;
  const market = locale as Market;
  const copy = COPY[market];
  const units = MARKETS[market].activeUnits;

  return (
    <>
      <Navbar market={market} />
      <main className="pt-[70px]">
        <section className="bg-ink-950 px-6 py-24 text-center text-white md:py-32">
          <p className="hud text-brand-300">{copy.eyebrow}</p>
          <h1 className="display mt-4 text-4xl md:text-6xl">{copy.title}</h1>
          <p className="mx-auto mt-6 max-w-xl text-white/70">{copy.description}</p>
        </section>
        <section
          className={`container-x grid gap-4 py-16 ${
            GRID_COLS[units.length] ?? GRID_COLS[4]
          }`}
        >
          {units.map((unit) => (
            <Link
              key={unit}
              href={`/${unit}`}
              className="group flex flex-col justify-between rounded-2xl border border-hair bg-surface p-6 transition-colors hover:border-brand-200"
            >
              <span className="text-lg font-semibold text-ink">
                {BUSINESS_UNITS[unit].label[market]}
              </span>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-600">
                {copy.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </section>
      </main>
      <Footer market={market} />
    </>
  );
}
