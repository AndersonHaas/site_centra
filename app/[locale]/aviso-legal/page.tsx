import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { MARKETS } from "@/lib/group/markets";
import type { Market } from "@/lib/group/market";

const COPY: Record<
  Market,
  {
    eyebrow: string;
    title: string;
    entityLabel: string;
    taxIdPlaceholder: string;
    addressLabel: string;
    phoneLabel: string;
  }
> = {
  br: {
    eyebrow: "Informações legais",
    title: "Aviso legal",
    entityLabel: "Razão social",
    taxIdPlaceholder: "a confirmar",
    addressLabel: "Endereço",
    phoneLabel: "Telefone",
  },
  py: {
    eyebrow: "Información legal",
    title: "Aviso legal",
    entityLabel: "Razón social",
    taxIdPlaceholder: "a confirmar",
    addressLabel: "Dirección",
    phoneLabel: "Teléfono",
  },
};

export const metadata: Metadata = {
  title: "Aviso legal",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AvisoLegalPage({ params }: Props) {
  const { locale } = await params;
  const market = locale as Market;
  const copy = COPY[market];
  const entity = MARKETS[market].legalEntity;

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
              <dd className="text-ink">{entity.name}</dd>
            </div>
            <div className="flex flex-col gap-1 p-6">
              <dt className="text-xs uppercase tracking-wide text-ink-soft">
                {entity.taxIdLabel}
              </dt>
              <dd className="text-ink">{entity.taxId ?? copy.taxIdPlaceholder}</dd>
            </div>
            <div className="flex flex-col gap-1 p-6">
              <dt className="text-xs uppercase tracking-wide text-ink-soft">
                {copy.addressLabel}
              </dt>
              <dd className="text-ink">{entity.address}</dd>
            </div>
            <div className="flex flex-col gap-1 p-6">
              <dt className="text-xs uppercase tracking-wide text-ink-soft">
                {copy.phoneLabel}
              </dt>
              <dd className="text-ink">{entity.phone}</dd>
            </div>
          </dl>
        </section>
      </main>
      <Footer market={market} />
    </>
  );
}
