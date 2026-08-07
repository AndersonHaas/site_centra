import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { HREFLANG } from "@/lib/group/market";
import { marketsForPath, pathsForMarket } from "@/lib/group/routes";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  /* A raiz é o seletor de país — é ela que o x-default aponta. */
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "yearly",
      priority: 1,
      alternates: {
        languages: {
          [HREFLANG.br]: `${SITE_URL}/br`,
          [HREFLANG.py]: `${SITE_URL}/py`,
          "x-default": `${SITE_URL}/`,
        },
      },
    },
  ];

  for (const market of routing.locales) {
    for (const path of pathsForMarket(market)) {
      const markets = marketsForPath(path);
      const url = `${SITE_URL}/${market}${path}`;

      if (markets.length < 2) {
        entries.push({ url, changeFrequency: "monthly", priority: 0.7 });
        continue;
      }

      const languages: Record<string, string> = {};
      for (const m of markets) {
        languages[HREFLANG[m]] = `${SITE_URL}/${m}${path}`;
      }
      languages["x-default"] = `${SITE_URL}/`;

      entries.push({
        url,
        changeFrequency: "monthly",
        priority: path === "" ? 0.9 : 0.7,
        alternates: { languages },
      });
    }
  }

  return entries;
}
