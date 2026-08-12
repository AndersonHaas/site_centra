import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import type { Market } from "@/lib/group/market";

export const MARKET_COOKIE = "NEXT_LOCALE";

/* Um ano: a escolha de mercado é uma preferência estável, não uma sessão. */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/* A detecção nativa do next-intl casa o Accept-Language contra os próprios
   códigos de locale. Aqui os prefixos são MERCADO (br/py), não idioma, então
   ela nunca casaria "es-PY" com "py" nem "pt-BR" com "br" — daí
   localeDetection: false e a detecção própria abaixo. */
const handleI18nRouting = createMiddleware({
  ...routing,
  localeDetection: false,
});

const MARKET_BY_COUNTRY: Record<string, Market> = { BR: "br", PY: "py" };

/* Primeiro idioma reconhecido da lista, respeitando os pesos q. Espanhol em
   qualquer variante cai no Paraguai (é o único mercado hispanofalante);
   português, no Brasil. */
function marketFromAcceptLanguage(header: string): Market | null {
  const tags = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.split(";");
      const qParam = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of tags) {
    if (tag.startsWith("es")) return "py";
    if (tag.startsWith("pt")) return "br";
  }
  return null;
}

function detectMarket(request: NextRequest): Market {
  /* 1) Escolha explícita anterior (switcher da navbar) vence sempre. */
  const fromCookie = request.cookies.get(MARKET_COOKIE)?.value;
  if (fromCookie === "br" || fromCookie === "py") return fromCookie;

  /* 2) País do visitante, quando a plataforma informa (Vercel). Mais
     confiável que o idioma do navegador: um paraguaio com Windows em
     português continua sendo um lead do Paraguai. */
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();
  if (country && country in MARKET_BY_COUNTRY) return MARKET_BY_COUNTRY[country];

  /* 3) Idioma do navegador. 4) Mercado padrão. */
  return (
    marketFromAcceptLanguage(request.headers.get("accept-language") ?? "") ??
    routing.defaultLocale
  );
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const market = detectMarket(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${market}`;

    /* 307 e não 308: o destino depende de cookie e cabeçalhos, então não
       pode ser memorizado como permanente pelo navegador nem consolidado
       por um buscador. É também o que mantém "/" válido como x-default. */
    const response = NextResponse.redirect(url, 307);
    response.cookies.set(MARKET_COOKIE, market, {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    return response;
  }

  /* Sem Set-Cookie nas respostas de página: um Set-Cookie as tornaria
     privadas para a CDN e o site é estático. Quem grava a preferência é o
     próprio switcher, no cliente (components/ui/MarketSwitcher.tsx). */
  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
