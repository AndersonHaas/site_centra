"use client";

import { Target, Eye, Gem } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";

const PILLARS = [
  { key: "missao", icon: Target },
  { key: "visao", icon: Eye },
  { key: "valores", icon: Gem },
] as const;

export function About() {
  const t = useTranslations("about");

  return (
    <section id="sobre" className="relative bg-paper py-24 md:py-32">
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

          <Reveal delay={0.18} className="mt-10">
            <div className="flex items-center gap-6 border-t border-hair pt-6">
              <div>
                <div className="display text-3xl text-ink">
                  {t("statesValue")}
                </div>
                <p className="mt-1 text-sm text-ink-soft">{t("statesLabel")}</p>
              </div>
            </div>
          </Reveal>
        </div>

        <RevealStagger className="flex flex-col gap-4" gap={0.1}>
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <RevealItem key={p.key}>
                <article className="group relative overflow-hidden rounded-2xl border border-hair bg-surface p-7 transition-colors duration-300 hover:border-brand-200 hover:bg-brand-50/40 md:p-9">
                  <span className="absolute right-7 top-7 font-mono text-xs text-ink-soft">
                    0{i + 1}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">
                    {t(`pillars.${p.key}.title`)}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
                    {t(`pillars.${p.key}.body`)}
                  </p>
                </article>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
