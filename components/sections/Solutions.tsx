"use client";

import {
  Building2,
  Mountain,
  Frame,
  Boxes,
  Construction,
  ClipboardCheck,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { SOLUTIONS } from "@/lib/content";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Building2,
  Mountain,
  Frame,
  Boxes,
  Construction,
  ClipboardCheck,
};

export function Solutions() {
  return (
    <section
      id="solucoes"
      className="relative overflow-hidden bg-ink-950 py-24 md:py-32"
    >
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 50% at 50% -10%, rgba(var(--color-brand-500-rgb), 0.16), transparent 70%)",
        }}
      />
      <div className="container-x relative">
        <SectionHeader
          as="h1"
          dark
          split
          index="01"
          eyebrow="O que entregamos"
          title={
            <>
              Estrutura completa,{" "}
              <span className="text-gradient-brand">do início ao fim</span>.
            </>
          }
          description="Soluções integradas em construção civil, terraplanagem, estruturas metálicas e pré-moldados — sustentadas por uma frota moderna de guindastes e equipamentos de movimentação de cargas."
        />

        <RevealStagger
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          gap={0.07}
        >
          {SOLUTIONS.map((s, i) => {
            const Icon = ICONS[s.icon];
            const featured = i === 0;
            return (
              <RevealItem
                key={s.title}
                className={cn(featured && "sm:col-span-2 lg:col-span-1")}
              >
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-300 hover:border-brand-400/40 hover:bg-white/[0.06]">
                  <div
                    className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(74,160,230,0.25), transparent 70%)",
                    }}
                  />
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-300 ring-1 ring-brand-400/20 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                      {Icon && <Icon className="h-5 w-5" strokeWidth={1.75} />}
                    </div>
                    <span className="font-mono text-xs text-white/55">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-7 text-lg font-semibold tracking-tight text-white">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-[0.92rem] leading-relaxed text-white/55">
                    {s.desc}
                  </p>
                  <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-brand-300 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Saiba mais
                    <ArrowUpRight className="h-4 w-4" />
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
