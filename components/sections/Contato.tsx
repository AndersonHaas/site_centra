"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const FIELDS = [
  { name: "nome", label: "Nome", type: "text", autoComplete: "name", required: true },
  {
    name: "empresa",
    label: "Empresa",
    type: "text",
    autoComplete: "organization",
    required: false,
  },
  {
    name: "email",
    label: "E-mail",
    type: "email",
    autoComplete: "email",
    required: true,
  },
  {
    name: "telefone",
    label: "Telefone",
    type: "tel",
    autoComplete: "tel",
    required: false,
  },
] as const;

const CONTACTS = [
  { icon: Mail, label: "E-mail", value: "contato@centraengenharia.com.br" },
  { icon: Phone, label: "Telefone", value: "+55 (45) 0000-0000" },
  { icon: MapPin, label: "Base", value: "Paraná · Brasil" },
];

export function Contato() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section
      id="contato"
      className="relative overflow-hidden bg-ink-950 py-24 md:py-32"
    >
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 20% 10%, rgba(36,132,214,0.18), transparent 65%)",
        }}
      />
      <div className="container-x relative grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <div>
          <Reveal>
            <span className="eyebrow text-brand-300">07 — Vamos construir</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="display mt-5 max-w-[14ch] text-4xl text-white sm:text-5xl md:text-6xl">
              Seu próximo empreendimento começa aqui.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
              Conte para a nossa equipe sobre o seu projeto. Retornamos com uma
              proposta técnica feita para o seu desafio.
            </p>
          </Reveal>

          <Reveal delay={0.18} className="mt-10">
            <ul className="space-y-4">
              {CONTACTS.map((c) => (
                <li key={c.label} className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-brand-300 ring-1 ring-white/10">
                    <c.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/40">
                      {c.label}
                    </span>
                    <span className="text-sm font-medium text-white/85">
                      {c.value}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Form */}
        <Reveal delay={0.1}>
          <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm md:p-9">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-[26rem] flex-col items-center justify-center text-center"
                >
                  <CheckCircle2 className="h-14 w-14 text-brand-400" />
                  <h3 className="mt-5 text-2xl font-semibold text-white">
                    Mensagem recebida!
                  </h3>
                  <p className="mt-3 max-w-xs text-sm text-white/60">
                    Obrigado pelo contato. Nossa equipe técnica retornará em
                    breve.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    {FIELDS.map((f) => (
                      <div key={f.name} className="flex flex-col gap-2">
                        <label
                          htmlFor={f.name}
                          className="text-sm font-medium text-white/70"
                        >
                          {f.label}
                          {f.required && (
                            <span className="ml-1 text-brand-400">*</span>
                          )}
                        </label>
                        <input
                          id={f.name}
                          name={f.name}
                          type={f.type}
                          required={f.required}
                          autoComplete={f.autoComplete}
                          className="h-12 rounded-lg border border-white/12 bg-ink-900/60 px-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="mensagem"
                      className="text-sm font-medium text-white/70"
                    >
                      Sobre o projeto
                    </label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      rows={4}
                      placeholder="Tipo de obra, localização, prazo estimado…"
                      className="resize-none rounded-lg border border-white/12 bg-ink-900/60 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center">
                    Enviar mensagem
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <p className="text-center text-xs text-white/35">
                    Resposta em até 1 dia útil.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
