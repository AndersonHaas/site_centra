import { useTranslations } from "next-intl";
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

/* Diferenciais que antes eram "unidades" no antigo array de soluções e hoje
   são destaques dentro da unidade de construção. */
const DIFERENCIAIS = ["terraplanagem", "gestao"] as const;

/* Página completa da unidade de construção civil.

   Vive num componente próprio porque é servida em duas URLs diferentes: em
   /br/construcao, como uma das quatro unidades do grupo, e em /py, onde a
   construção é a única unidade e por isso ocupa a raiz do mercado (ver
   isSingleUnitMarket em lib/group/routes.ts). */
export function ConstrucaoContent({ market }: { market: Market }) {
  const t = useTranslations("diferenciais");

  return (
    <>
      <Navbar market={market} />
      <main>
        <Hero />
        <TrustBar />
        <Obras />
        <Credenciais />
        <section className="relative bg-surface py-20 md:py-28">
          <div className="container-x">
            <p className="hud text-brand-600">{t("eyebrow")}</p>
            <h2 className="display mt-4 max-w-xl text-2xl sm:text-3xl">
              {t("title")}
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {DIFERENCIAIS.map((key) => (
                <div
                  key={key}
                  className="rounded-2xl border border-hair bg-paper p-6"
                >
                  <h3 className="text-base font-semibold text-ink">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {t(`${key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Fundacao />
        <Stats />
        <Clientes />
        <Contato market={market} />
      </main>
      <Footer market={market} />
    </>
  );
}
