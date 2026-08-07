import type { BusinessUnitId } from "./types";

export const BUSINESS_UNITS: Record<BusinessUnitId, { icon: string }> = {
  construcao: { icon: "Building2" },
  "pre-moldados": { icon: "Boxes" },
  metalurgica: { icon: "Frame" },
  guindastes: { icon: "Construction" },
};
