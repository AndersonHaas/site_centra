"use client";

import { BadgeCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { FOUNDERS } from "@/lib/content";

function initials(name: string) {
  return name
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/* Quem assina as obras — e, desde que a página /equipe foi removida, o único
   lugar onde a equipe técnica aparece. Não havia o que perder na remoção: a
   página mostrava exatamente estes mesmos FOUNDERS, só que maiores. */
export function Credenciais() {
  const t = useTranslations("credenciais");

  return (
    <section id="equipe" className="relative bg-paper py-24 md:py-32">
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

        <RevealStagger className="grid gap-4 self-start sm:grid-cols-2" gap={0.1}>
          {FOUNDERS.map((f) => (
            <RevealItem key={f.name}>
              <article className="flex h-full flex-col gap-4 rounded-2xl border border-hair bg-surface p-6 transition-colors duration-300 hover:border-brand-200 hover:bg-brand-50/40">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-base font-semibold text-white">
                  {initials(f.name)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-semibold tracking-tight text-ink">
                      {f.name}
                    </h3>
                    <BadgeCheck className="h-4 w-4 shrink-0 text-brand-500" />
                  </div>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    {t("founderRole")}
                  </p>
                  <p className="mt-1 font-mono text-xs text-ink-soft">
                    {f.crea}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
