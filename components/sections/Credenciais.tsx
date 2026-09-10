"use client";

import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { FOUNDERS } from "@/lib/content";

/* Quem assina as obras — e, desde que a página /equipe foi removida, o único
   lugar onde a equipe técnica aparece. Não havia o que perder na remoção: a
   página mostrava exatamente estes mesmos FOUNDERS, só que maiores. */
export function Credenciais() {
  const t = useTranslations("credenciais");

  return (
    <section id="equipe" className="relative bg-paper py-16 md:py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
        <div>
          <SectionHeader
            index="02"
            eyebrow={t("eyebrow")}
            split
            title={t.rich("title", {
              accent: (chunks) => (
                <span className="text-brand-600">{chunks}</span>
              ),
            })}
            description={t("description")}
          />
        </div>

        <RevealStagger className="self-start divide-y divide-hair border-y border-hair" gap={0.06}>
          {FOUNDERS.map((f, index) => (
            <RevealItem key={f.name}>
              <article className="grid gap-2 py-6 sm:grid-cols-[3rem_1fr_auto] sm:items-baseline sm:gap-5">
                <span className="hud text-brand-600">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-ink">{f.name}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{t("founderRole")}</p>
                </div>
                <p className="font-mono text-xs text-ink-soft">{f.crea}</p>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
