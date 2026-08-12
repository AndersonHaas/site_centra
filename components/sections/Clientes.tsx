"use client";

import { type StaticImageData } from "next/image";
import { Quote, Landmark } from "lucide-react";
import { useTranslations } from "next-intl";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { ScrubText } from "@/components/ui/ScrubText";
import { CLIENTS } from "@/lib/content";

import copacolImg from "@/media/works/copacol-unidade.jpg";
import cvaleImg from "@/media/works/cvale-fachada.jpg";

const CLIENT_IMG: Record<string, StaticImageData | undefined> = {
  Copacol: copacolImg,
  "C.Vale": cvaleImg,
};

export function Clientes() {
  const t = useTranslations("clientes");

  return (
    <section id="clientes" className="relative bg-surface py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          index="03"
          eyebrow={t("eyebrow")}
          split
          title={t.rich("title", {
            accent: (chunks) => <span className="text-brand-600">{chunks}</span>,
          })}
          description={t("description")}
        />

        <Reveal delay={0.05}>
          <p className="mt-10 text-sm text-ink-soft uppercase tracking-widest">
            {t("listLabel")}
          </p>
        </Reveal>

        <RevealStagger className="mt-4 grid gap-4 md:grid-cols-3" gap={0.1}>
          {CLIENTS.map((c, i) => {
            const img = CLIENT_IMG[c.name];
            return (
              <RevealItem key={c.name}>
                <article className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-hair bg-ink-900">
                  {img ? (
                    <>
                      <ParallaxImage
                        src={img}
                        alt={t("imageAlt", { client: c.name })}
                        clipReveal
                        speed={4 + (i % 3) * 3}
                        placeholder="blur"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0">
                      <div className="grid-lines absolute inset-0 opacity-40" />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(70% 60% at 50% 30%, rgba(var(--color-brand-500-rgb), 0.22), transparent 70%)",
                        }}
                      />
                      <Landmark className="absolute left-7 top-7 h-9 w-9 text-brand-300/70" />
                    </div>
                  )}

                  <div className="relative p-7">
                    <span className="text-2xl font-semibold tracking-tight text-white">
                      {c.name}
                    </span>
                    <p className="mt-1.5 text-sm font-medium text-white/65">
                      {t(`notes.${c.key}`)}
                    </p>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealStagger>

        {/* Declaração de impacto */}
        <Reveal delay={0.1} className="mt-6">
          <div className="grain relative overflow-hidden rounded-3xl bg-ink-950 p-10 md:p-14">
            <div className="grid-lines absolute inset-0 opacity-40" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(70% 60% at 80% 20%, rgba(var(--color-brand-500-rgb), 0.18), transparent 70%)",
              }}
            />
            <Quote className="relative h-9 w-9 text-brand-400" />
            <ScrubText
              text={t("quote")}
              className="display relative mt-6 max-w-3xl text-2xl leading-snug text-white md:text-3xl"
            />
            <p className="relative mt-6 hud text-white/55">
              {t("quoteAuthor")}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
