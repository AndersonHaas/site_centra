"use client";

import { useTranslations } from "next-intl";
import { CLIENTS } from "@/lib/content";

/* `clients` vem dos clientes das obras publicadas no portfólio (ver
   app/[locale]/page.tsx). Se a busca falhar e vier vazio, cai na lista fixa
   de lib/content.ts para a faixa nunca aparecer sem nomes. */
export function TrustBar({ clients: portfolioClients = [] }: { clients?: string[] }) {
  const t = useTranslations("trustBar");

  const clients = portfolioClients.length > 0 ? portfolioClients : CLIENTS.map((c) => c.name);

  return (
    <div className="relative border-y border-white/10 bg-ink-950 py-7 md:py-8">
      <div className="container-x grid gap-4 md:grid-cols-[minmax(11rem,0.55fr)_1fr] md:items-center">
        <div>
          <p className="eyebrow text-white/55">{t("title")}</p>
          <p className="mt-2 text-sm text-white/55">{t("clientsNote")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-2 text-lg font-semibold tracking-tight text-white/65">
          {clients.map((client) => (
            <span key={client}>{client}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
