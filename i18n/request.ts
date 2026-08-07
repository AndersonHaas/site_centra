import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { MARKET_LANGUAGE } from "@/lib/group/market";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const language = MARKET_LANGUAGE[locale];

  return {
    locale,
    messages: (await import(`../messages/${language}.json`)).default,
  };
});
