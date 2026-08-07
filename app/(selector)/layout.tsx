import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { SITE_URL } from "@/lib/seo";

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
  metadataBase: new URL(SITE_URL),
  title: "Centra — Brasil e Paraguai",
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/br",
      "es-PY": "/py",
      "x-default": "/",
    },
  },
  description:
    "Grupo Centra: construção civil, pré-moldados, estruturas metálicas e locação de guindastes no Brasil, com a expansão da construtora para o Paraguai.",
  openGraph: {
    title: "Centra — Brasil e Paraguai",
    description:
      "Grupo Centra: construção civil, pré-moldados, estruturas metálicas e locação de guindastes no Brasil, com a expansão da construtora para o Paraguai.",
    type: "website",
    siteName: "Centra",
  },
};

export const viewport: Viewport = {
  themeColor: "#050b14",
  width: "device-width",
  initialScale: 1,
};

export default function SelectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt"
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
