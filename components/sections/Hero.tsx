"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { SECTORS } from "@/lib/content";
import { Flag } from "@/components/ui/Flag";
import heroImg from "@/media/works/sede-totem.png";

export function Hero() {
  const t = useTranslations("hero");
  const tSectors = useTranslations("sectors");

  return (
    <section id="top" className="hero relative isolate bg-ink-950 pt-[70px]">
      <div className="hero-content container-x relative z-10 py-10 sm:py-12 lg:py-16">
        <div className="hero-copy max-w-[36rem] lg:w-[38%] lg:max-w-[30rem]">
          <p className="eyebrow flex items-start gap-3 leading-relaxed text-white/80">
            <span className="market-indicator mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-400" />
            {t("eyebrow")}
          </p>
          <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-3 py-2">
            <Flag market="br" className="h-3 w-[1.125rem] shrink-0 rounded-[2px]" />
            <Flag market="py" className="h-3 w-[1.125rem] shrink-0 rounded-[2px]" />
            <span className="hud text-white/85">{t("binational")}</span>
          </div>
          <h1 className="hero-title display mt-6 leading-[1.08] text-white">
            <span>{t("headline.line1")} </span>
            <span className="text-gradient-brand">{t("headline.line2")} </span>
            <span>{t("headline.line3")}</span>
          </h1>
          <p className="hero-lead mt-6 text-base leading-relaxed text-white/85 sm:text-lg">{t("lead")}</p>
          <div className="hero-sectors mt-7 border-t border-white/20 pt-5">
            <p className="eyebrow text-white/75">{t("sectorsLabel")}</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {SECTORS.map(sector => (
                <span key={sector} className="text-sm font-medium text-white/85">{tSectors(sector)}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <figure className="hero-photo lg:absolute lg:inset-0 lg:-z-10">
        <Image src={heroImg} alt="" aria-hidden="true" sizes="100vw"
          className="hero-atmosphere hidden" />
        <Image src={heroImg} alt={t("imageAlt")} preload placeholder="blur" sizes="100vw"
          className="hero-totem block h-auto w-full lg:h-full lg:object-cover lg:object-bottom" />
        <div aria-hidden="true" className="hero-shade pointer-events-none absolute inset-0 hidden lg:block" />
        <figcaption className="container-x py-4 text-right lg:absolute lg:inset-x-0 lg:bottom-0 lg:py-6">
          <span className="hud inline-block rounded bg-ink-950/85 px-3 py-2 leading-relaxed text-white/85">
            {t("workIndex")} · {t("workLabel")}
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
