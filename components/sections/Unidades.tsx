import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { unitRoutes } from "@/lib/group/routes";
import type { Market } from "@/lib/group/market";

/* Tailwind exige classes literais (não interpoladas) para funcionar no build,
   então o número de colunas é escolhido a partir de um mapa estático em vez
   de montar a string dinamicamente. */
const GRID_COLS: Record<number, string> = {
  1: "sm:grid-cols-1 max-w-md",
  2: "sm:grid-cols-2 max-w-2xl",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/* As demais unidades do grupo, dentro da página da construtora.
 *
 * Entra depois dos diferenciais e não antes das obras de propósito: aqui elas
 * pesam como prova de verticalização da própria obra ("os pré-moldados e os
 * guindastes são nossos") e não como um menu de produtos concorrendo com a
 * construção, que é o que efetivamente vende.
 *
 * Não renderiza nada onde não há unidade secundária — é o caso do Paraguai,
 * onde só a construção opera. */
export function Unidades({ market }: { market: Market }) {
  const t = useTranslations("home");
  const tUnits = useTranslations("units");
  const units = unitRoutes(market);

  if (units.length === 0) return null;

  return (
    <section id="unidades" className="bg-paper py-16 md:py-24">
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
          {units.map((unit, index) => (
              <RevealItem key={unit}>
                <Link
                  href={`/${unit}`}
                  className="group flex h-full flex-col border-t border-hair py-6 transition-colors duration-300 hover:text-brand-700"
                >
                  <span className="hud text-brand-600">0{index + 1}</span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">
                    {tUnits(`${unit}.label`)}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                    {tUnits(`${unit}.short`)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-600">
                    {t("cta")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
