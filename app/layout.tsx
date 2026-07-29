import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { CustomCursor } from "@/components/ui/CustomCursor";

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
  metadataBase: new URL("https://centraengenharia.com.br"),
  title: {
    default: "Centra Engenharia",
    template: "%s | Centra Engenharia",
  },
  description:
    "Soluções completas de engenharia e construção: civil, terraplanagem, estruturas metálicas e pré-moldados. Mais de 550 mil m² construídos no Sul do Brasil.",
  keywords: [
    "construtora",
    "engenharia civil",
    "estruturas metálicas",
    "obras industriais",
    "agroindustrial",
    "terraplanagem",
    "pré-moldados",
    "Paraná",
  ],
  authors: [{ name: "Centra Engenharia e Empreendimentos" }],
  openGraph: {
    title:
      "Centra Engenharia | Construção & Empreendimentos de Alto Desempenho",
    description:
      "Mais de 550 mil m² construídos. Engenharia e construção com excelência técnica para os setores industrial, agroindustrial e comercial.",
    type: "website",
    locale: "pt_BR",
    siteName: "Centra Engenharia",
  },
};

export const viewport: Viewport = {
  themeColor: "#050b14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>
        <ScrollProgress />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
