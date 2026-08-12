import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Navbar } from "@/components/sections/Navbar";
import { TrustBar } from "@/components/sections/TrustBar";
import { Stats } from "@/components/sections/Stats";
import { Footer } from "@/components/sections/Footer";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { BUSINESS_UNITS } from "@/lib/group/units";
import { getContactHref } from "@/lib/group/nav";
import { unitRoutes } from "@/lib/group/routes";
import type { Market } from "@/lib/group/market";
import heroImg from "@/media/works/cvale-complexo.jpg";

/* Tailwind exige classes literais (não interpoladas) para funcionar no build,
   então o número de colunas é escolhido a partir de um mapa estático em vez
   de montar a string dinamicamente. */
const GRID_COLS: Record<number, string> = {
  1: "sm:grid-cols-1 max-w-md",
  2: "sm:grid-cols-2 max-w-2xl",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/* Raiz de um mercado com mais de uma unidade de negócio: apresenta o grupo e
   distribui para as unidades. Num mercado de unidade única a raiz é a própria
   página da unidade — ver isSingleUnitMarket em lib/group/routes.ts. */
export function GroupHub({ market }: { market: Market }) {
  const t = useTranslations("home");
  const tUnits = useTranslations("units");
  const units = unitRoutes(market);

  return (
    <>
      <Navbar market={market} />
      <main>
        <section className="grain relative flex min-h-[78svh] items-center overflow-hidden bg-ink-950 pt-[70px]">
          <div className="absolute inset-0">
            <Image
              src={heroImg}
              alt={t("imageAlt")}
              fill
              priority
              placeholder="blur"
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-ink-950/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/60" />

          <div className="container-x relative z-10 py-20 md:py-28">
            <Reveal>
              <p className="hud text-brand-300">{t("eyebrow")}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="display mt-5 max-w-[18ch] text-4xl text-white sm:text-5xl md:text-6xl">
                {t.rich("title", {
                  accent: (chunks) => (
                    <span className="text-gradient-brand">{chunks}</span>
                  ),
                })}
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                {t("description")}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <Link
                href={getContactHref(market)}
                className="btn-primary mt-9 inline-flex"
              >
                {t("contactCta")}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </section>

        <TrustBar />

        <section className="bg-paper py-24 md:py-32">
          <div className="container-x">
            <Reveal>
              <p className="hud text-brand-600">{t("unitsEyebrow")}</p>
              <h2 className="display mt-4 max-w-2xl text-3xl sm:text-4xl md:text-[2.7rem]">
                {t("unitsTitle")}
              </h2>
            </Reveal>

            <RevealStagger
              className={`mt-12 grid gap-4 ${GRID_COLS[units.length] ?? GRID_COLS[4]}`}
              gap={0.08}
            >
              {units.map((unit) => {
                const Icon = BUSINESS_UNITS[unit].icon;
                return (
                  <RevealItem key={unit}>
                    <Link
                      href={`/${unit}`}
                      className="group flex h-full flex-col rounded-2xl border border-hair bg-surface p-6 transition-colors duration-300 hover:border-brand-200 hover:bg-brand-50/40"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </div>
                      <h3 className="mt-6 text-lg font-semibold tracking-tight text-ink">
                        {tUnits(`${unit}.label`)}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                        {tUnits(`${unit}.short`)}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-600">
                        {t("cta")}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </RevealItem>
                );
              })}
            </RevealStagger>
          </div>
        </section>

        <Stats />
      </main>
      <Footer market={market} />
    </>
  );
}
