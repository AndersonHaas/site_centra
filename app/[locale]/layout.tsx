import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { HTML_LANG } from "@/lib/group/market";
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// generateStaticParams above enumerates the only two real locales (br, py).
// Without this, Next.js still renders the page component for ANY other
// single-segment value (favicon.ico, x.y, robots.txt, ...) with a garbage
// `locale`, which either crashes pages that index Market-keyed records or
// falls through to notFound() too late for global-not-found to catch
// cleanly. Setting this to false makes Next.js 404 (via the proper
// not-found mechanism) for any [locale] value outside the static list,
// before any page/layout body code runs.
export const dynamicParams = false;

export const metadata: Metadata = {
  metadataBase: new URL("https://site-centra-ultimo.vercel.app"),
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

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={HTML_LANG[locale]}
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <ScrollProgress />
          <CustomCursor />
          <SmoothScroll>{children}</SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
