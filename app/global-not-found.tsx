// Handles URLs that don't match any route at all (e.g. a business-unit
// route not yet built). Required because this app has two independent
// root layouts (app/(selector)/layout.tsx and app/[locale]/layout.tsx) —
// there's no single layout Next.js could otherwise compose a 404 from, so
// without this file + the `experimental.globalNotFound` flag in
// next.config.ts, unmatched URLs fell through to Next's built-in default
// 404 instead of a branded page. Bypasses normal rendering entirely, so it
// must import its own global styles/fonts and provide the full document.
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
