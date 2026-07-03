"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

const SteelStructure = dynamic(
  () => import("@/components/three/SteelStructure"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 grid place-items-center">
        <span className="hud text-white/55">Carregando modelo…</span>
      </div>
    ),
  },
);

const SPECS = [
  ["Sistema", "Estruturas metálicas"],
  ["Complemento", "Pré-moldados & pré-fabricados"],
  ["Montagem", "Frota própria de guindastes"],
  ["Precisão", "Do projeto ao milímetro"],
] as const;

export function Estrutura() {
  return (
    <section
      id="estrutura"
      className="grain relative overflow-hidden bg-ink-950 py-24 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(70% 60% at 85% 30%, rgba(var(--color-brand-500-rgb), 0.16), transparent 70%)",
        }}
      />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeader
            index="02"
            eyebrow="Engenharia estrutural"
            dark
            title={
              <>
                Cada estrutura, calculada{" "}
                <span className="text-gradient-brand">ao milímetro</span>.
              </>
            }
            description="Projetamos, fabricamos e montamos estruturas metálicas e pré-moldados de alto desempenho. Explore o modelo estrutural — gire e observe a precisão de cada pórtico, terça e contraventamento."
          />

          <Reveal delay={0.14} className="mt-10">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
              {SPECS.map(([k, v]) => (
                <div key={k} className="bg-ink-950 p-5">
                  <dt className="hud text-brand-300">{k}</dt>
                  <dd className="mt-2 text-sm font-medium text-white/85">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.2} className="mt-8">
            <a
              href="#solucoes"
              className="group inline-flex items-center gap-2 text-sm font-medium text-brand-300 transition-colors hover:text-brand-200"
            >
              Conheça todas as soluções
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>

        {/* Painel do modelo 3D */}
        <Reveal delay={0.1}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-ink-900 sm:aspect-square lg:aspect-[5/6]">
            <div className="grid-lines absolute inset-0 opacity-30" />
            <SteelStructure />

            {/* HUD */}
            <div className="pointer-events-none absolute inset-0 p-5">
              <div className="flex items-start justify-between">
                <span className="hud text-white/55">Modelo estrutural</span>
                <span className="hud text-brand-300">Wireframe</span>
              </div>
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
                <span className="hud text-white/55">Galpão · pórtico metálico</span>
                <span className="hud text-white/55">Arraste o mouse</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
