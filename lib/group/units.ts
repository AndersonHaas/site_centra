import type { BusinessUnitId } from "./types";
import type { Market } from "./market";

export const BUSINESS_UNITS: Record<
  BusinessUnitId,
  { icon: string; label: Record<Market, string> }
> = {
  construcao: {
    icon: "Building2",
    label: { br: "Construção", py: "Construcción" },
  },
  "pre-moldados": {
    icon: "Boxes",
    label: { br: "Pré-moldados", py: "Prefabricados" },
  },
  metalurgica: {
    icon: "Frame",
    label: { br: "Metalúrgica", py: "Metalúrgica" },
  },
  guindastes: {
    icon: "Construction",
    label: { br: "Guindastes", py: "Grúas" },
  },
};
