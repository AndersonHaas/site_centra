import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["br", "py"],
  defaultLocale: "br",
  localePrefix: "always",
});
