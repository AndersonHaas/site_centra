"use client";

import { Target, Eye, Gem } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { PILLARS } from "@/lib/content";

const ICONS = { missao: Target, visao: Eye, valores: Gem } as const;

export function About() {
  return (
    <section id="sobre" className="relative bg-paper py-24 md:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            index="01"
            eyebrow="Quem é a Centra"
            title={
              <>
                A força da Centra
                <br />
                está nas <span className="text-brand-600">pessoas</span>.
              </>
            }
            description="Uma equipe técnica especializada — engenheiros, gestores e profissionais experientes — que atua de forma integrada em todas as etapas, transformando projetos em empreendimentos de alto desempenho."
          />

          <Reveal delay={0.18} className="mt-10">
            <div className="flex items-center gap-6 border-t border-hair pt-6">
              <div>
                <div className="display text-3xl text-ink">+550 mil m²</div>
                <p className="mt-1 text-sm text-ink-soft">
                  construídos e entregues
                </p>
              </div>
              <div className="h-12 w-px bg-hair" />
              <div>
                <div className="display text-3xl text-ink">4 estados</div>
                <p className="mt-1 text-sm text-ink-soft">
                  de presença consolidada
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <RevealStagger className="flex flex-col gap-4" gap={0.1}>
          {PILLARS.map((p, i) => {
            const Icon = ICONS[p.key as keyof typeof ICONS];
            return (
              <RevealItem key={p.key}>
                <article className="group relative overflow-hidden rounded-2xl border border-hair bg-surface p-7 transition-all duration-300 hover:border-brand-200 hover:shadow-[0_24px_60px_-30px_rgba(21,104,184,0.35)] md:p-9">
                  <span className="absolute right-7 top-7 font-mono text-xs text-ink-faint">
                    0{i + 1}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
                    {p.body}
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
