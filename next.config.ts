import type { NextConfig } from "next";
import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    // This app has two independent root layouts (app/(selector)/layout.tsx
    // and app/[locale]/layout.tsx — no shared app/layout.tsx), so there is
    // no single layout tree Next.js can compose a 404 from for URLs that
    // don't match any route at all. Without this flag, such URLs (e.g. a
    // business-unit route not yet built) fall through to Next's built-in
    // default 404 instead of app/global-not-found.tsx. See
    // node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md.
    globalNotFound: true,
  },
  /* Os prefixos de locale deixaram de ser idioma (pt/es) e passaram a ser
     mercado (br/py). Sem estes redirects, toda URL antiga já compartilhada
     do site termina em 404: o proxy do next-intl prefixa /pt com o locale
     padrão, gerando /br/pt, que não existe. 308 (o equivalente permanente
     no Next, que preserva o método) para que buscadores transfiram o sinal
     em vez de apenas seguirem o desvio. */
  async redirects() {
    return [
      { source: "/pt", destination: "/br", permanent: true },
      { source: "/pt/:path*", destination: "/br/:path*", permanent: true },
      { source: "/es", destination: "/py", permanent: true },
      { source: "/es/:path*", destination: "/py/:path*", permanent: true },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
