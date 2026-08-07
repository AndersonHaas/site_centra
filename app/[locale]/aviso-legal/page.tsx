import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { MARKETS } from "@/lib/group/markets";
import type { Market } from "@/lib/group/market";
import { buildAlternates } from "@/lib/seo";

const COPY: Record<
  Market,
  {
    eyebrow: string;
    title: string;
    entityLabel: string;
    pendingLabel: string;
    pendingNote: string;
    addressLabel: string;
    phoneLabel: string;
  }
> = {
  br: {
    eyebrow: "Informações legais",
    title: "Aviso legal",
    entityLabel: "Razão social",
    pendingLabel: "a confirmar",
    pendingNote: "Dados registrais em processo de confirmação.",
    addressLabel: "Endereço",
    phoneLabel: "Telefone",
  },
  py: {
    eyebrow: "Información legal",
    title: "Aviso legal",
    entityLabel: "Razón social",
    pendingLabel: "a confirmar",
    pendingNote: "Datos registrales en proceso de confirmación.",
    addressLabel: "Dirección",
    phoneLabel: "Teléfono",
  },
};

type Props = {
  params: Promise<{ locale: string }>;
};

const META: Record<Market, { title: string; description: string }> = {
  br: {
    title: "Aviso legal",
    description:
      "Informações legais da entidade brasileira do Grupo Centra: razão social, CNPJ, endereço e telefone.",
  },
  py: {
    title: "Aviso legal",
    description:
      "Información legal de la entidad paraguaya del Grupo Centra: razón social, RUC, dirección y teléfono.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const market = locale as Market;
  return {
    title: META[market].title,
    description: META[market].description,
    alternates: buildAlternates(market, "/aviso-legal"),
  };
}

export default async function AvisoLegalPage({ params }: Props) {
  const { locale } = await params;
  const market = locale as Market;
  const copy = COPY[market];
  const entity = MARKETS[market].legalEntity;
  const hasPendingData =
    entity.name === null ||
    entity.taxId === null ||
    entity.address === null ||
    entity.phone === null;

  return (
    <>
      <Navbar market={market} />
      <main className="pt-[70px]">
        <section className="container-x py-24 md:py-32">
          <p className="hud text-brand-600">{copy.eyebrow}</p>
          <h1 className="display mt-4 text-3xl md:text-5xl">{copy.title}</h1>

          <dl className="mt-10 max-w-xl divide-y divide-hair rounded-2xl border border-hair bg-surface">
            <div className="flex flex-col gap-1 p-6">
              <dt className="text-xs uppercase tracking-wide text-ink-soft">
                {copy.entityLabel}
              </dt>
              <dd className="text-ink">{entity.name ?? copy.pendingLabel}</dd>
            </div>
            <div className="flex flex-col gap-1 p-6">
              <dt className="text-xs uppercase tracking-wide text-ink-soft">
                {entity.taxIdLabel}
              </dt>
              <dd className="text-ink">{entity.taxId ?? copy.pendingLabel}</dd>
            </div>
            <div className="flex flex-col gap-1 p-6">
              <dt className="text-xs uppercase tracking-wide text-ink-soft">
                {copy.addressLabel}
              </dt>
              <dd className="text-ink">{entity.address ?? copy.pendingLabel}</dd>
            </div>
            <div className="flex flex-col gap-1 p-6">
              <dt className="text-xs uppercase tracking-wide text-ink-soft">
                {copy.phoneLabel}
              </dt>
              <dd className="text-ink">{entity.phone ?? copy.pendingLabel}</dd>
            </div>
          </dl>

          {hasPendingData ? (
            <p className="mt-4 text-sm text-ink-soft">{copy.pendingNote}</p>
          ) : null}
        </section>
      </main>
      <Footer market={market} />
    </>
  );
}
