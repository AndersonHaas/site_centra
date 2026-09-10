"use client";

import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealStagger, RevealItem } from "@/components/ui/Reveal";

const PILLARS = [
  { key: "missao" },
  { key: "visao" },
  { key: "valores" },
] as const;

export function About() {
  const t = useTranslations("about");

  return (
    <section id="sobre" className="relative bg-paper py-16 md:py-24">
      <div className="container-x grid gap-14 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            as="h1"
            index="01"
            eyebrow={t("eyebrow")}
            title={t.rich("title", {
              accent: (chunks) => (
                <span className="text-brand-600">{chunks}</span>
              ),
              br: () => <br />,
            })}
            description={t("description")}
          />
        </div>

        <RevealStagger className="flex flex-col gap-4" gap={0.1}>
          {PILLARS.map((p, i) => {
            return (
              <RevealItem key={p.key}>
                <article className="grid gap-4 border-t border-hair py-7 first:border-t-0 md:grid-cols-[4rem_1fr] md:gap-7 md:py-9">
                  <span className="font-mono text-xs text-brand-600">0{i + 1}</span>
                  <div>
                  <h3 className="text-xl font-semibold tracking-tight text-ink">
                    {t(`pillars.${p.key}.title`)}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
                    {t(`pillars.${p.key}.body`)}
                  </p>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
