import { notFound } from "next/navigation";
import type { Market } from "./market";
import type { BusinessUnitId } from "./types";
import { MARKETS } from "./markets";

export function assertUnitActive(market: Market, unit: BusinessUnitId): void {
  if (!MARKETS[market].activeUnits.includes(unit)) {
    notFound();
  }
}
