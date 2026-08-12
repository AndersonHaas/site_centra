// O 404 de todo o site. Toda rota vive sob app/[locale], então não existe
// app/layout.tsx que o Next pudesse usar para compor um 404 — sem este
// arquivo e a flag `experimental.globalNotFound` do next.config.ts, uma URL
// desconhecida cairia no 404 padrão do Next em vez de numa página com a
// marca. Ele contorna a renderização normal, e por isso importa os próprios
// estilos e fontes e devolve o documento inteiro.
//
// É bilíngue porque atende URLs de que não se pode inferir mercado nenhum, e
// porque é ele que responde também às unidades inativas num mercado (ex.:
// /py/guindastes): elas não são rotas ali — cada página de unidade restringe
// seus params aos mercados em que a unidade opera (ver generateStaticParams
// em app/[locale]/<unidade>/page.tsx).
// Deliberadamente fora do analytics: este root layout não renderiza o GA4,
// então 404s sem mercado (ex.: /rota-inexistente) não viram pageview — só
// os 404s dentro de [locale] (ex.: /br/rota-inexistente) são contabilizados.
import "./globals.css";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Página não encontrada / Página no encontrada",
};

export default function GlobalNotFound() {
  return (
    <html
      lang="pt"
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950 px-6 text-center text-white">
          <p className="hud text-brand-300">404</p>
          <h1 className="display text-2xl md:text-3xl">
            Página não encontrada / Página no encontrada
          </h1>
          <Link href="/" className="btn-ghost">
            Voltar / Volver
          </Link>
        </main>
      </body>
    </html>
  );
}
