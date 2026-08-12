import type { Market } from "@/lib/group/market";

/**
 * Bandeiras simplificadas de Brasil e Paraguai para o seletor de mercado.
 *
 * São desenhos reduzidos de propósito: no tamanho em que aparecem na navbar
 * (~18px de largura) a esfera celeste brasileira e o brasão paraguaio viram
 * ruído ilegível. Ficam só os elementos que dão leitura imediata — losango +
 * disco no Brasil, tricolor + estrela no Paraguai.
 *
 * Decorativas: o nome do país já vai no `sr-only` do MarketSwitcher, então o
 * SVG fica com aria-hidden para não duplicar leitura no screen reader.
 */
export function Flag({
  market,
  className = "h-3 w-[1.125rem]",
}: {
  market: Market;
  className?: string;
}) {
  const shared = {
    viewBox: "0 0 24 16",
    className,
    "aria-hidden": true as const,
    focusable: "false" as const,
  };

  if (market === "br") {
    return (
      <svg {...shared}>
        <rect width="24" height="16" rx="1.5" fill="#009B3A" />
        <path d="M12 2.6 21.4 8 12 13.4 2.6 8Z" fill="#FEDF00" />
        <circle cx="12" cy="8" r="3.1" fill="#002776" />
      </svg>
    );
  }

  return (
    <svg {...shared}>
      <rect width="24" height="16" rx="1.5" fill="#FFF" />
      <path d="M1.5 0h21A1.5 1.5 0 0 1 24 1.5V5.33H0V1.5A1.5 1.5 0 0 1 1.5 0Z" fill="#D52B1E" />
      <path d="M0 10.67h24V14.5a1.5 1.5 0 0 1-1.5 1.5h-21A1.5 1.5 0 0 1 0 14.5Z" fill="#0038A8" />
      <path
        d="m12 6.15.72 1.46 1.61.23-1.17 1.14.28 1.6L12 9.83l-1.44.75.28-1.6L9.67 7.84l1.61-.23Z"
        fill="#009B3A"
      />
    </svg>
  );
}
