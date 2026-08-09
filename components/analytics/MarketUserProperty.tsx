import type { Market } from "@/lib/group/market";

/* Define o mercado (br/py) como user property do GA4.

   Segmentar Brasil × Paraguai por user property é mais robusto do que
   depender de regex de path do lado do GA4: o dado viaja junto do evento,
   sobrevive a mudanças de URL e funciona em relatórios que não expõem o
   caminho da página. Só existe dentro da árvore [locale] — em "/" (o
   seletor de país) o visitante ainda não escolheu mercado nenhum.

   Por que um <script> inline no servidor, e não um useEffect: o
   `gtag('config', ...)` do <GoogleAnalytics> roda de forma síncrona no
   script inline do @next/third-parties e é ele que dispara o PRIMEIRO
   page_view — o mesmo hit do qual o GA4 deriva session_start e
   first_visit. Um useEffect só roda depois da hidratação, ou seja, sempre
   DEPOIS desse page_view: quem entra e sai sem interagir era contado como
   market "(not set)", justamente nos relatórios de aquisição onde a
   segmentação BR × PY mais importa. O mercado já é conhecido no servidor
   (é o segmento da URL), então basta emiti-lo em tempo de render.

   Por isso este componente precisa ser renderizado ANTES de
   <GoogleAnalytics> no layout: o `set` fica enfileirado no dataLayer antes
   do `config`, e o primeiro page_view já sai com a user property. É seguro
   em relação ao código do vendor, que faz
   `window[dataLayerName] = window[dataLayerName] || []` e redeclara
   `gtag` — o array pré-semeado sobrevive e a fila é preservada. Como o
   push não depende de o <GoogleAnalytics> já ter renderizado, também
   desaparece a fragilidade de ordem silenciosa da versão anterior. */
export function MarketUserProperty({ market }: { market: Market }) {
  return (
    <script
      id="ga-market-user-property"
      dangerouslySetInnerHTML={{
        __html:
          `window.dataLayer=window.dataLayer||[];` +
          `function gtag(){window.dataLayer.push(arguments)}` +
          `gtag('set','user_properties',{market:${JSON.stringify(market)}});`,
      }}
    />
  );
}
