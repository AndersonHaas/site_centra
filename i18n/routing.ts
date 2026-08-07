import { defineRouting } from "next-intl/routing";
import type { Market } from "@/lib/group/market";

export const routing = defineRouting({
  locales: ["br", "py"] satisfies readonly Market[],
  defaultLocale: "br",
  localePrefix: "always",
});
