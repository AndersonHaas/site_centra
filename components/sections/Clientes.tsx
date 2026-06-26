"use client";

import Image, { type StaticImageData } from "next/image";
import { Quote, Landmark } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { CLIENTS } from "@/lib/content";

import copacolImg from "@/media/works/copacol-unidade.jpg";
import copacolAerea from "@/media/works/copacol-aerea.jpg";
import cvaleImg from "@/media/works/cvale-fachada.jpg";

const CLIENT_IMG: Record<string, StaticImageData | undefined> = {
  Copacol: copacolImg,
  "C.Vale": cvaleImg,
};

export function Clientes() {
  return (
    <section id="clientes" className="relative bg-surface py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          index="06"
          eyebrow="Quem confia na Centra"
          title={
            <>
              Parcerias que sustentam{" "}
              <span className="text-brand-600">grandes operações</span>.
            </>
          }
          description="Cooperativas agroindustriais, indústrias e o setor público confiam à Centra obras de alta complexidade e impacto regional."
        />

        {/* Destaque Copacol — foto aérea em destaque */}
        <Reveal>
          <article className="group relative mt-14 grid overflow-hidden rounded-3xl border border-hair bg-ink-900 md:grid-cols-[1.4fr_1fr]">
            <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
              <Image
                src={copacolAerea}
                alt="Vista aérea de complexo agroindustrial construído pela Centra para a Copacol"
                fill
                placeholder="blur"
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-950/55 via-ink-950/10 to-transparent" />
              <div className="absolute left-5 top-5 flex items-center gap-2">
                <span className="hud text-white/65">Cliente destaque</span>
                <span className="hud text-brand-300">—</span>
                <span className="hud text-white">Copacol</span>
              </div>
            </div>

            <div className="relative flex flex-col justify-between gap-6 p-7 md:p-10">
              <div>
                <span className="hud text-brand-400">Parceria de longo prazo</span>
                <h3 className="display mt-4 text-2xl text-white md:text-3xl">
                  Da estrutura metálica à entrega final, com a{" "}
                  <span className="text-gradient-brand">Copacol</span>.
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70 md:text-base">
                  Mais de uma década construindo unidades industriais, silos e
                  ampliações para uma das maiores cooperativas agroindustriais
                  do Paraná.
                </p>
              </div>

              <dl className="grid grid-cols-3 gap-4 border-t border-white/10 pt-5">
                <div>
                  <dt className="hud text-white/40">Escopo</dt>
                  <dd className="mt-1 text-sm font-medium text-white md:text-base">
                    Civil · Metálica
                  </dd>
                </div>
                <div>
                  <dt className="hud text-white/40">Atuação</dt>
                  <dd className="mt-1 text-sm font-medium text-white md:text-base">
                    Oeste do PR
                  </dd>
                </div>
                <div>
                  <dt className="hud text-white/40">Relação</dt>
                  <dd className="mt-1 text-sm font-medium text-white md:text-base">
                    Parceria contínua
                  </dd>
                </div>
              </dl>
            </div>
          </article>
        </Reveal>

        <RevealStagger className="mt-10 grid gap-4 md:grid-cols-3" gap={0.1}>
          {CLIENTS.map((c) => {
            const img = CLIENT_IMG[c.name];
            return (
              <RevealItem key={c.name}>
                <article className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-hair bg-ink-900">
                  {img ? (
                    <>
                      <Image
                        src={img}
                        alt={`Obra realizada para ${c.name}`}
                        fill
                        placeholder="blur"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
                            "radial-gradient(70% 60% at 50% 30%, rgba(36,132,214,0.22), transparent 70%)",
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
                      {c.note}
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
                  "radial-gradient(70% 60% at 80% 20%, rgba(36,132,214,0.18), transparent 70%)",
              }}
            />
            <Quote className="relative h-9 w-9 text-brand-400" />
            <p className="display relative mt-6 max-w-3xl text-2xl leading-snug text-white md:text-3xl">
              “Cada obra representa nosso compromisso com a excelência, a
              inovação e a entrega de resultados consistentes.”
            </p>
            <p className="relative mt-6 hud text-white/45">
              Centra Engenharia e Empreendimentos
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
