import type { NextConfig } from "next";
import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    // Every route of this app lives under app/[locale] — there is no
    // app/layout.tsx at the root, so for a URL that matches no route at all
    // there is no layout tree Next.js could compose a 404 from. Without this
    // flag such URLs (e.g. a business-unit route not yet built) fall through
    // to Next's built-in default 404 instead of app/global-not-found.tsx. See
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
      /* A construção civil é a unidade-raiz (ver ROOT_UNIT em
         lib/group/routes.ts): deixou de ter sub-rota e passou a ser a própria
         raiz do mercado, eliminando um hub que cobrava um clique antes do
         conteúdo principal. Estes redirects preservam as URLs antigas, que já
         estiveram publicadas. */
      { source: "/br/construcao", destination: "/br", permanent: true },
      { source: "/py/construcao", destination: "/py", permanent: true },
      /* /solucoes é anterior à divisão em unidades de negócio. Cada mercado
         aponta direto para o destino final — encadear em /<mercado>/construcao
         custaria dois saltos, já que aquele redireciona de novo para a raiz. */
      { source: "/br/solucoes", destination: "/br", permanent: true },
      { source: "/py/solucoes", destination: "/py", permanent: true },
      /* A página passou a se chamar Portfólio no menu; a URL acompanhou para
         não ficar um nome no link e outro na barra de endereço. */
      { source: "/br/obras", destination: "/br/portfolio", permanent: true },
      { source: "/py/obras", destination: "/py/portfolio", permanent: true },
      /* A página /equipe repetia, maiores, os mesmos sócios-fundadores já
         listados na seção Credenciais da home — que por isso carrega o
         id="equipe" para onde estes redirects apontam. */
      { source: "/br/equipe", destination: "/br#equipe", permanent: true },
      { source: "/py/equipe", destination: "/py#equipe", permanent: true },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
