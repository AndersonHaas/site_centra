"use client";

import { BadgeCheck } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { FOUNDERS, TEAM } from "@/lib/content";

function initials(name: string) {
  return name
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Equipe() {
  return (
    <section id="equipe" className="relative bg-paper py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          as="h1"
          index="01"
          eyebrow="Equipe técnica"
          title={
            <>
              Engenheiros e gestores que{" "}
              <span className="text-brand-600">assinam cada obra</span>.
            </>
          }
          description="Profissionais experientes, integrados em todas as etapas dos projetos — do planejamento à entrega final."
        />

        {/* Sócios fundadores */}
        <RevealStagger
          className="mt-14 grid gap-4 md:grid-cols-2"
          gap={0.1}
        >
          {FOUNDERS.map((f) => (
            <RevealItem key={f.name}>
              <article className="group flex items-center gap-5 rounded-2xl border border-hair bg-surface p-6 transition-colors duration-300 hover:border-brand-200 hover:bg-brand-50/40 md:p-7">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-lg font-semibold text-white">
                  {initials(f.name)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-lg font-semibold tracking-tight text-ink">
                      {f.name}
                    </h3>
                    <BadgeCheck className="h-4 w-4 shrink-0 text-brand-500" />
                  </div>
                  <p className="mt-0.5 text-sm text-ink-soft">{f.role}</p>
                  <p className="mt-1 font-mono text-xs text-ink-soft">
                    {f.crea}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>

        {/* Time */}
        <Reveal className="mt-12">
          <p className="eyebrow text-ink-soft">Time de engenharia</p>
        </Reveal>
        <RevealStagger
          className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
          gap={0.06}
        >
          {TEAM.map((m) => (
            <RevealItem key={m.name}>
              <div className="group flex h-full flex-col items-center rounded-xl border border-hair bg-surface p-5 text-center transition-all duration-300 hover:border-brand-200 hover:bg-brand-50/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-2 font-mono text-sm font-medium text-brand-700 ring-1 ring-hair transition-colors group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500">
                  {initials(m.name)}
                </div>
                <h4 className="mt-3 text-sm font-semibold leading-tight text-ink">
                  {m.name}
                </h4>
                <p className="mt-1 text-xs text-ink-soft">{m.role}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
