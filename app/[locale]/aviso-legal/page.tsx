import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { MARKETS } from "@/lib/group/markets";
import type { Market } from "@/lib/group/market";
import { buildAlternates } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Market }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.avisoLegal" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(locale, "/aviso-legal"),
  };
}

export default async function AvisoLegalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar market={locale} />
      <main className="pt-[70px]">
        <LegalEntityTable market={locale} />
      </main>
      <Footer market={locale} />
    </>
  );
}

function LegalEntityTable({ market }: { market: Market }) {
  const t = useTranslations("avisoLegal");
  const entity = MARKETS[market].legalEntity;
  const hasPendingData =
    entity.name === null ||
    entity.taxId === null ||
    entity.address === null ||
    entity.phone === null;

  const rows = [
    { label: t("entityLabel"), value: entity.name },
    { label: entity.taxIdLabel, value: entity.taxId },
    { label: t("addressLabel"), value: entity.address },
    { label: t("phoneLabel"), value: entity.phone },
  ];

  return (
    <section className="container-x py-24 md:py-32">
      <p className="hud text-brand-600">{t("eyebrow")}</p>
      <h1 className="display mt-4 text-3xl md:text-5xl">{t("title")}</h1>

      <dl className="mt-10 max-w-xl divide-y divide-hair rounded-2xl border border-hair bg-surface">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1 p-6">
            <dt className="text-xs uppercase tracking-wide text-ink-soft">
              {row.label}
            </dt>
            <dd className="text-ink">{row.value ?? t("pendingLabel")}</dd>
          </div>
        ))}
      </dl>

      {hasPendingData ? (
        <p className="mt-4 text-sm text-ink-soft">{t("pendingNote")}</p>
      ) : null}
    </section>
  );
}
