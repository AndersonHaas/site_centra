import { ArrowLeft, ArrowUpRight, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Reveal } from "@/components/ui/Reveal";
import { BUSINESS_UNITS } from "@/lib/group/units";
import { getContactHref } from "@/lib/group/nav";
import { MARKETS } from "@/lib/group/markets";
import type { Market } from "@/lib/group/market";
import type { BusinessUnitId } from "@/lib/group/types";

/* Reduz um telefone formatado (ex.: "+55 (45) 0000-0000") a um URI tel: válido,
   mantendo apenas dígitos e o "+" inicial. */
function toTelHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/* Página de unidade de negócio ainda sem catálogo próprio (pré-moldados,
   metalúrgica, guindastes). O conteúdo é curto de propósito — o que ela
   precisa garantir é não ser um beco sem saída: leva ao formulário de
   contato, ao telefone e de volta ao hub do grupo. */
export function UnitPage({
  market,
  unit,
}: {
  market: Market;
  unit: BusinessUnitId;
}) {
  const t = useTranslations(`units.${unit}`);
  const tUnits = useTranslations("units");
  const Icon = BUSINESS_UNITS[unit].icon;
  const phone = MARKETS[market].contact.phone;

  return (
    <>
      <Navbar market={market} />
      <main className="pt-[70px]">
        <section className="container-x py-20 md:py-28">
          <Reveal>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              {tUnits("backLabel")}
            </Link>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="mt-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
              <Icon className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <p className="hud mt-6 text-brand-600">{t("eyebrow")}</p>
            <h1 className="display mt-4 text-3xl md:text-5xl">{t("label")}</h1>
            <p className="mt-6 max-w-2xl text-lg text-ink-soft">
              {t("description")}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-12 max-w-2xl rounded-2xl border border-hair bg-surface p-7">
              <p className="text-sm leading-relaxed text-ink-soft">
                {t("catalogNote")}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href={getContactHref(market)} className="btn-primary">
                  {t("contactCta")}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a
                  href={toTelHref(phone)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 transition-colors hover:text-brand-600"
                >
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer market={market} />
    </>
  );
}
