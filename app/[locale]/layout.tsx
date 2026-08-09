import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { HTML_LANG, OG_LOCALE, type Market } from "@/lib/group/market";
import { SITE_URL } from "@/lib/seo";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA_ID } from "@/lib/analytics";
import { MarketUserProperty } from "@/components/analytics/MarketUserProperty";

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

const SITE_COPY: Record<
  Market,
  {
    titleDefault: string;
    titleTemplate: string;
    description: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    siteName: string;
  }
> = {
  br: {
    titleDefault: "Centra Engenharia",
    titleTemplate: "%s | Centra Engenharia",
    description:
      "Soluções de engenharia e construção: construção civil, terraplanagem, pré-moldados e artefatos de cimento, estruturas metálicas e locação de guindastes. Mais de 550 mil m² construídos no Sul do Brasil, com atuação também no Paraguai.",
    keywords: [
      "construtora",
      "engenharia civil",
      "estruturas metálicas",
      "obras industriais",
      "agroindustrial",
      "terraplanagem",
      "pré-moldados",
      "guindastes",
      "Paraná",
    ],
    ogTitle:
      "Centra Engenharia | Construção & Empreendimentos de Alto Desempenho",
    ogDescription:
      "Mais de 550 mil m² construídos. Engenharia e construção com excelência técnica para os setores industrial, agroindustrial e comercial, no Brasil e no Paraguai.",
    siteName: "Centra Engenharia",
  },
  py: {
    titleDefault: "Grupo Centra",
    titleTemplate: "%s | Grupo Centra",
    description:
      "Construcción civil del Grupo Centra en Paraguay, con el respaldo de la experiencia del grupo en Brasil: más de 550 mil m² construidos en Brasil para los sectores industrial, agroindustrial y comercial.",
    keywords: [
      "constructora",
      "ingeniería civil",
      "obras industriales",
      "agroindustrial",
      "construcción",
      "Paraguay",
    ],
    ogTitle: "Grupo Centra | Ingeniería y Construcción de Alto Desempeño",
    ogDescription:
      "Construcción civil en Paraguay, con el respaldo de la experiencia del Grupo Centra en Brasil.",
    siteName: "Grupo Centra",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const market = locale as Market;
  const copy = SITE_COPY[market];

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: copy.titleDefault, template: copy.titleTemplate },
    description: copy.description,
    keywords: copy.keywords,
    authors: [{ name: "Grupo Centra" }],
    openGraph: {
      title: copy.ogTitle,
      description: copy.ogDescription,
      type: "website",
      locale: OG_LOCALE[market],
      siteName: copy.siteName,
    },
  };
}

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
        {GA_ID && (
          <>
            <MarketUserProperty market={locale} />
            <GoogleAnalytics gaId={GA_ID} />
          </>
        )}
      </body>
    </html>
  );
}
