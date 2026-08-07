import type { Market } from "./market";
import { MARKETS } from "./markets";
import { BUSINESS_UNITS } from "./units";

export function getNavLinks(market: Market): Array<{ label: string; href: string }> {
  const unitLinks = MARKETS[market].activeUnits.map((unit) => ({
    label: BUSINESS_UNITS[unit].label[market],
    href: `/${unit}`,
  }));

  return [
    ...unitLinks,
    { label: market === "py" ? "Nosotros" : "A Centra", href: "/sobre" },
    { label: market === "py" ? "Equipo" : "Equipe", href: "/equipe" },
  ];
}
