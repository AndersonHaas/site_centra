# i18n Routing Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `next-intl`-based locale routing (`/pt/*`, `/es/*`) to the Centra site with zero visible change to the Portuguese version — this is Phase 1 of a multi-phase i18n rollout; string extraction, per-market content, localized contact API, and SEO metadata are separate follow-up plans.

**Architecture:** All existing routes move under an `app/[locale]/` segment. A `proxy.ts` (Next.js 16's renamed `middleware.ts`) built on `next-intl/middleware` redirects `/` to the detected locale and enforces `localePrefix: "always"`. No component or content file changes in this phase — every page renders exactly what it renders today, just reachable at `/pt/...` instead of `/...`. `/es/...` temporarily renders the same Portuguese content (real Spanish copy is a later phase) — this is expected, not a defect.

**Tech Stack:** Next.js 16 (App Router, Turbopack), next-intl (new dependency), pnpm.

## Global Constraints

- Next.js 16 renamed `middleware.ts` → `proxy.ts` (exported function must be named `proxy`, not `middleware`). Confirmed against `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` in this repo.
- Locale config: `locales: ["pt", "es"]`, `defaultLocale: "pt"`, `localePrefix: "always"` (every URL carries a locale prefix, no unprefixed root route).
- Zero visible/behavioral change to the Portuguese site in this phase. `/pt/*` must render byte-identical output to what `/*` renders today. Do not touch copy, styling, or component logic.
- `/es/*` rendering the same Portuguese text as `/pt/*` in this phase is correct, expected behavior — not a bug to fix. Real Spanish content is a separate follow-up plan (see `/Users/andersonhaas/.claude/plans/qual-a-melhor-elegant-zephyr.md`).
- Out of scope for this plan — do not modify: `components/sections/*`, `lib/content.ts`, `lib/portfolio-data.ts`, `app/api/contato/route.ts`, `scripts/sync-portfolio.py`. These are deferred to later phases of the approved architecture plan.
- `app/api/contato/route.ts` stays outside the `[locale]` segment (API routes are not locale-prefixed) and must keep working unchanged.
- The `next-intl` version installed may differ from the API surface shown in this plan (the package isn't installed yet). If `pnpm add next-intl` pulls a version whose exports differ (check `node_modules/next-intl/package.json` version and its `.d.ts`/README after install), adapt import paths/function names to match — the intent (locale-prefixed routing via `defineRouting`/`createMiddleware`/`getRequestConfig`/`createNextIntlPlugin`) stays the same regardless of minor API drift.

---

### Task 1: next-intl routing skeleton — move all routes under `[locale]`

**Files:**
- Modify: `package.json` (adds `next-intl` dependency via `pnpm add`)
- Modify: `next.config.ts`
- Create: `i18n/routing.ts`
- Create: `i18n/request.ts`
- Create: `proxy.ts`
- Create: `messages/pt.json`
- Create: `messages/es.json`
- Move + modify: `app/layout.tsx` → `app/[locale]/layout.tsx`
- Move (unchanged): `app/page.tsx` → `app/[locale]/page.tsx`
- Move (unchanged): `app/sobre/page.tsx` → `app/[locale]/sobre/page.tsx`
- Move (unchanged): `app/solucoes/page.tsx` → `app/[locale]/solucoes/page.tsx`
- Move (unchanged): `app/obras/page.tsx` → `app/[locale]/obras/page.tsx`
- Move (unchanged): `app/equipe/page.tsx` → `app/[locale]/equipe/page.tsx`

**Interfaces:**
- Produces: `routing` (from `i18n/routing.ts`, exports `locales: ["pt", "es"]`, `defaultLocale: "pt"`) — later phases import this for `useLocale`/`Link`/metadata helpers.
- Produces: `messages/pt.json` and `messages/es.json` as the next-intl message files later phases will populate (both start as `{}` — empty object, valid JSON, no keys yet since no component consumes translations in this phase).
- No other task in this repo currently depends on these interfaces; this is the first i18n task.

- [ ] **Step 1: Install next-intl**

Run: `pnpm add next-intl`

Confirm it lands in `package.json` `dependencies` (not `devDependencies`).

- [ ] **Step 2: Create `i18n/routing.ts`**

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "es"],
  defaultLocale: "pt",
  localePrefix: "always",
});
```

- [ ] **Step 3: Create `i18n/request.ts`**

```ts
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 4: Create `proxy.ts`** (project root, next to `next.config.ts` — NOT `middleware.ts`, that convention is deprecated in Next.js 16)

```ts
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

- [ ] **Step 5: Create empty message files**

`messages/pt.json`:
```json
{}
```

`messages/es.json`:
```json
{}
```

- [ ] **Step 6: Wire next-intl into `next.config.ts`**

Replace the full file content with:

```ts
import type { NextConfig } from "next";
import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
```

- [ ] **Step 7: Move and rewrite the root layout**

```bash
mkdir -p "app/[locale]"
git mv app/layout.tsx "app/[locale]/layout.tsx"
```

Replace the full content of `app/[locale]/layout.tsx` with:

```tsx
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { routing } from "@/i18n/routing";
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
      lang={locale === "es" ? "es-419" : "pt-BR"}
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
```

Note the import path changed from `"./globals.css"` to `"../globals.css"` — the file moved one directory deeper.

- [ ] **Step 8: Move the 5 route pages (content unchanged — pure relocation)**

```bash
git mv app/page.tsx "app/[locale]/page.tsx"
git mv app/sobre "app/[locale]/sobre"
git mv app/solucoes "app/[locale]/solucoes"
git mv app/obras "app/[locale]/obras"
git mv app/equipe "app/[locale]/equipe"
```

Do not edit the content of any of these 5 files — they import `Navbar`/`Footer`/section components with relative `@/...` aliases that are unaffected by the directory move, and none of them reference `lib/content.ts` directly. Confirm after the move that each file's imports still read `@/components/sections/...` (unchanged) — if any file fails to compile because of this move, stop and report rather than improvising an import fix not covered by this plan.

- [ ] **Step 9: Verify types and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint next.config.ts proxy.ts i18n/routing.ts i18n/request.ts "app/[locale]/layout.tsx"`
Expected: no errors.

- [ ] **Step 10: Verify production build**

Run: `pnpm build`
Expected: build succeeds. The route list should show `/[locale]`, `/[locale]/sobre`, `/[locale]/solucoes`, `/[locale]/obras`, `/[locale]/equipe` (or their static-generated `/pt/...` and `/es/...` equivalents) instead of the old unprefixed routes, and `/api/contato` unchanged.

- [ ] **Step 11: Live browser verification**

Start the dev server (`pnpm dev` or the project's preview tooling) and check:
- Navigating to `/` redirects to `/pt`.
- `/pt`, `/pt/sobre`, `/pt/solucoes`, `/pt/obras`, `/pt/equipe` each render — compare against the current production site (`https://site-centra-ultimo.vercel.app`) section by section to confirm no visual or text difference.
- `/es` also renders (same Portuguese content as `/pt` — expected in this phase, not a defect).
- The contact form on `/pt` still submits successfully to `/api/contato` (unaffected route, outside `[locale]`).
- No console errors in the browser.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Add next-intl routing skeleton (locale-prefixed URLs)

Phase 1 of the i18n rollout: all routes now live under app/[locale]/,
reachable at /pt/* and /es/*. No content or component changes yet —
/es/* temporarily renders the same Portuguese copy as /pt/*; string
extraction and real Spanish content are separate follow-up plans.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
