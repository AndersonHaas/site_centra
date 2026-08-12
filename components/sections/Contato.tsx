"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { MARKETS } from "@/lib/group/markets";
import type { Market } from "@/lib/group/market";

const FIELDS = [
  { name: "nome", type: "text", autoComplete: "name", required: true, maxLength: 120 },
  { name: "empresa", type: "text", autoComplete: "organization", required: false, maxLength: 120 },
  { name: "email", type: "email", autoComplete: "email", required: true, maxLength: 160 },
  { name: "telefone", type: "tel", autoComplete: "tel", required: false, maxLength: 30 },
] as const;

type FieldName = (typeof FIELDS)[number]["name"] | "mensagem";

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* A validação do cliente devolve CÓDIGOS, não frases — os mesmos que a rota
   /api/contato devolve. É o que permite as duas origens de erro (cliente e
   servidor) caírem no mesmo catálogo de tradução em vez de o servidor
   mandar português para uma página em espanhol. */
function validateClient(values: Record<FieldName, string>) {
  const errors: Partial<Record<FieldName, string>> = {};
  if (!values.nome.trim()) errors.nome = "nome_required";
  if (!values.email.trim()) errors.email = "email_required";
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = "email_invalid";
  return errors;
}

export function Contato({ market }: { market: Market }) {
  const t = useTranslations("contato");
  const tf = useTranslations("contato.form");
  const tErrors = useTranslations("contato.errors");
  const [status, setStatus] = useState<Status>("idle");
  const [values, setValues] = useState<Record<FieldName, string>>({
    nome: "",
    empresa: "",
    email: "",
    telefone: "",
    mensagem: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);

  /* Fonte única dos dados comerciais por mercado — antes esta seção tinha um
     array fixo com o telefone +55 e o e-mail .com.br, servido também no
     Paraguai. */
  const contact = MARKETS[market].contact;
  const address = MARKETS[market].legalEntity.address;

  const contactRows = [
    { icon: Mail, label: t("emailLabel"), value: contact.email },
    { icon: Phone, label: t("phoneLabel"), value: contact.phone },
    { icon: MapPin, label: t("baseLabel"), value: t("baseValue") },
  ];

  /* Um endereço registral confirmado é mais específico que a base declarada
     na copy — quando existir, ele manda. */
  if (address) contactRows[2].value = address;

  /* Código desconhecido (versão do servidor à frente da do cliente) nunca
     deve renderizar a chave crua na tela. */
  function translateError(code: string) {
    return tErrors.has(code) ? tErrors(code) : tErrors("send_failed");
  }

  function update(name: FieldName, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const clientErrors = validateClient(values);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setFormError(null);
      return;
    }

    setStatus("submitting");
    setFieldErrors({});
    setFormError(null);

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        setStatus("success");
        return;
      }

      if (res.status === 400 && data?.fieldErrors) {
        setFieldErrors(data.fieldErrors);
        setStatus("idle");
        return;
      }

      setFormError(translateError(data?.error ?? "send_failed"));
      setStatus("error");
    } catch {
      setFormError(tErrors("network"));
      setStatus("error");
    }
  }

  const submitting = status === "submitting";

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
            "radial-gradient(70% 60% at 20% 10%, rgba(var(--color-brand-500-rgb), 0.18), transparent 65%)",
        }}
      />
      <div className="container-x relative grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <div>
          <Reveal>
            <span className="eyebrow text-brand-300">04 — {t("eyebrow")}</span>
          </Reveal>
          <SplitText
            as="h2"
            per="line"
            delay={0.06}
            className="display mt-5 max-w-[14ch] text-4xl text-white sm:text-5xl md:text-6xl"
          >
            {t("title")}
          </SplitText>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
              {t("description")}
            </p>
          </Reveal>

          <Reveal delay={0.18} className="mt-10">
            <ul className="space-y-4">
              {contactRows.map((c) => (
                <li key={c.label} className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-brand-300 ring-1 ring-white/10">
                    <c.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
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
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  role="status"
                  className="flex min-h-[26rem] flex-col items-center justify-center text-center"
                >
                  <CheckCircle2 className="h-14 w-14 text-brand-400" />
                  <h3 className="mt-5 text-2xl font-semibold text-white">
                    {t("success.title")}
                  </h3>
                  <p className="mt-3 max-w-xs text-sm text-white/60">
                    {t("success.body")}
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  <div role="status" aria-live="polite" className="sr-only">
                    {submitting ? tf("sendingStatus") : ""}
                  </div>

                  {formError && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    {FIELDS.map((f) => {
                      const errorCode = fieldErrors[f.name];
                      return (
                        <div key={f.name} className="flex flex-col gap-2">
                          <label
                            htmlFor={f.name}
                            className="text-sm font-medium text-white/70"
                          >
                            {tf(f.name)}
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
                            maxLength={f.maxLength}
                            placeholder={
                              f.name === "telefone"
                                ? tf("telefonePlaceholder")
                                : undefined
                            }
                            value={values[f.name]}
                            onChange={(e) => update(f.name, e.target.value)}
                            disabled={submitting}
                            aria-invalid={Boolean(errorCode)}
                            aria-describedby={
                              errorCode ? `${f.name}-error` : undefined
                            }
                            className={`h-12 rounded-lg border bg-ink-900/60 px-4 text-sm text-white outline-none transition-colors placeholder:text-white/50 focus:ring-2 disabled:opacity-50 ${
                              errorCode
                                ? "border-red-400/60 focus:border-red-400 focus:ring-red-500/30"
                                : "border-white/12 focus:border-brand-400 focus:ring-brand-500/30"
                            }`}
                          />
                          {errorCode && (
                            <span
                              id={`${f.name}-error`}
                              className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-red-300"
                            >
                              {translateError(errorCode)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="mensagem"
                      className="text-sm font-medium text-white/70"
                    >
                      {tf("mensagem")}
                    </label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      rows={4}
                      maxLength={2000}
                      placeholder={tf("mensagemPlaceholder")}
                      value={values.mensagem}
                      onChange={(e) => update("mensagem", e.target.value)}
                      disabled={submitting}
                      className="resize-none rounded-lg border border-white/12 bg-ink-900/60 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/50 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {tf("submitting")}
                      </>
                    ) : (
                      <>
                        {tf("submit")}
                        <ArrowUpRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-white/55">
                    {tf("replyNote")}
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
