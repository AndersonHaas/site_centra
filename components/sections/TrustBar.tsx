"use client";

import { useTranslations } from "next-intl";
import { VelocityMarquee } from "@/components/ui/VelocityMarquee";
import { CLIENTS } from "@/lib/content";

export function TrustBar() {
  const t = useTranslations("trustBar");

  const items = [
    ...CLIENTS.map((c) => c.name),
    t("industrial"),
    t("agroindustria"),
    t("cooperativas"),
  ];

  return (
    <div className="relative border-y border-white/10 bg-ink-950 py-7">
      <div className="container-x mb-5">
        <p className="eyebrow text-center text-white/55">{t("title")}</p>
      </div>
      <div className="mask-fade-x">
        <VelocityMarquee>
          {items.map((label) => (
            <span
              key={label}
              className="text-lg font-semibold tracking-tight text-white/45 transition-colors hover:text-white/80"
            >
              {label}
            </span>
          ))}
        </VelocityMarquee>
      </div>
    </div>
  );
}
