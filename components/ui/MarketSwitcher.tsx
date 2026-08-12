"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { HREFLANG, type Market } from "@/lib/group/market";
import { marketsForPath } from "@/lib/group/routes";
import { cn } from "@/lib/utils";

/* Mesmo nome de cookie que o proxy lê para decidir o destino de "/". Gravar
   aqui, no clique, e não a cada resposta de página, é o que mantém as
   páginas cacheáveis pela CDN — um Set-Cookie as tornaria privadas. */
const MARKET_COOKIE = "NEXT_LOCALE";
const ONE_YEAR = 60 * 60 * 24 * 365;

function rememberMarket(market: Market) {
  document.cookie = `${MARKET_COOKIE}=${market};path=/;max-age=${ONE_YEAR};samesite=lax`;
}

export function MarketSwitcher({
  market,
  className,
}: {
  market: Market;
  className?: string;
}) {
  const t = useTranslations("nav.market");
  const pathname = usePathname();

  /* usePathname do next-intl devolve a rota já sem o prefixo de mercado, e
     "/" na raiz — que em marketsForPath é "". */
  const path = pathname === "/" ? "" : pathname;
  const availableMarkets = marketsForPath(path);

  return (
    <div
      role="group"
      aria-label={t("switchLabel")}
      className={cn(
        "flex items-center gap-0.5 rounded-lg border border-white/15 p-0.5",
        className,
      )}
    >
      {routing.locales.map((target) => {
        const active = target === market;
        /* Rota que não existe no outro mercado (ex.: /guindastes no
           Paraguai) cai na raiz dele em vez de levar a um 404. */
        const href = availableMarkets.includes(target) ? path || "/" : "/";

        return (
          <Link
            key={target}
            href={href}
            locale={target}
            hrefLang={HREFLANG[target]}
            aria-current={active ? "true" : undefined}
            onClick={() => rememberMarket(target)}
            className={cn(
              "rounded-md px-2.5 py-1 font-mono text-xs font-medium uppercase transition-colors",
              active
                ? "bg-white/15 text-white"
                : "text-white/55 hover:bg-white/5 hover:text-white",
            )}
          >
            {target}
            <span className="sr-only"> — {t(target)}</span>
          </Link>
        );
      })}
    </div>
  );
}
