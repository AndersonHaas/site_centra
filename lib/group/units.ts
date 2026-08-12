import { Building2, Boxes, Frame, Construction, type LucideIcon } from "lucide-react";
import type { BusinessUnitId } from "./types";

/* Rótulos e descrições das unidades vivem nos catálogos de tradução
   (messages/*.json, namespace `units`) — aqui fica só o que não é texto. */
export const BUSINESS_UNITS: Record<BusinessUnitId, { icon: LucideIcon }> = {
  construcao: { icon: Building2 },
  "pre-moldados": { icon: Boxes },
  metalurgica: { icon: Frame },
  guindastes: { icon: Construction },
};
