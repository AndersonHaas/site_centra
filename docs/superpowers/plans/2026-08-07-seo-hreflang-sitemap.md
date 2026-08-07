# SEO: hreflang, canonical, sitemap e robots — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fase 6 of `~/.claude/plans/qual-a-melhor-elegant-zephyr.md` — give every route correct, market-aware metadata: self-referential canonical, hreflang between (and only between) pages that genuinely exist in both markets, `x-default` pointing at the country selector, plus `sitemap.ts` and `robots.ts`. This also closes two gaps parked by earlier phases' reviews: the 4 business-unit pages and the group landing page export no per-page metadata at all, and `/py/sobre`, `/py/equipe`, `/py/obras`, `/py/aviso-legal` currently emit Portuguese titles and descriptions (the whole `[locale]` root layout's metadata is Portuguese-only, and applies to `/py` too).

**Architecture:** One small shared layer (`lib/group/routes.ts` for "which markets does this path resolve in", `lib/seo.ts` for building the alternates object and holding the single site-URL constant), then a mechanical pass applying it: `generateMetadata` on the root locale layout and on each of the 9 locale pages, and finally `app/sitemap.ts` / `app/robots.ts` built from the same route inventory. The single source of truth for unit availability stays `MARKETS[market].activeUnits` — the same array the routing guard uses — so hreflang can never point at a URL the guard 404s.

**Tech Stack:** Next.js 16 (App Router) Metadata API, TypeScript. No new dependency.

## Global Constraints

- **Never emit an hreflang alternate for a URL that 404s.** `/br/pre-moldados`, `/br/metalurgica` and `/br/guindastes` have no Paraguay equivalent (`MARKETS.py.activeUnits` is `["construcao"]` and the unit guard 404s the rest), so those pages must emit canonical only, with `alternates.languages` omitted entirely.
- `x-default` points at `/` (the country selector), never at `/br`.
- Canonical is always self-referential: `/{market}{path}`.
- Do not invent facts. Every description below reuses claims already published on the corresponding page. On Paraguay routes, any Brazil figure must stay explicitly qualified as Brazilian ("en Brasil") — this project has already had to fix that exact defect class twice.
- The final `.com` domain is NOT yet decided (that's Fase 8, domain cutover). Keep using the current `https://site-centra-ultimo.vercel.app` value, but define it ONCE as `SITE_URL` in `lib/seo.ts` and import it everywhere, so the cutover is a one-line change instead of a four-file hunt.
- Do not change any page's rendered body content in this phase — this is metadata only. The only visible-output change allowed is `/sitemap.xml` and `/robots.txt` becoming available.
- `app/[locale]/solucoes/page.tsx` is a redirect to `/construcao`, not a real page: it gets no metadata and must NOT appear in the sitemap.
- No test framework exists in this repo. Verification is `pnpm exec tsc --noEmit`, `pnpm exec eslint <changed files>`, and a **production** build check (`pnpm build && pnpm start`) — this project has a documented history of bugs that only reproduce in production.
- **Port 3000 holds a long-running dev server that is not yours — never kill it.** Start your own production server on a free port (e.g. 3131) and shut down only your own.
- Work directly on `main`, commit locally, do NOT push to origin.

---

### Task 1: Route inventory, alternates builder, and market-aware root metadata

**Files:**
- Modify: `lib/group/market.ts`
- Create: `lib/group/routes.ts`
- Create: `lib/seo.ts`
- Modify: `app/[locale]/layout.tsx`
- Modify: `app/(selector)/layout.tsx`

**Interfaces:**
- Produces: `HREFLANG: Record<Market, string>` (`lib/group/market.ts`).
- Produces: `SHARED_PATHS`, `marketsForPath(path): Market[]`, `pathsForMarket(market): string[]` (`lib/group/routes.ts`) — Tasks 2 and 3 both consume these.
- Produces: `SITE_URL: string`, `buildAlternates(market, path): Metadata["alternates"]` (`lib/seo.ts`) — Task 2 calls `buildAlternates` on every page; Task 3 uses `SITE_URL`.
- Consumes: `Market`, `OG_LOCALE` from `@/lib/group/market`; `MARKETS` from `@/lib/group/markets`; `BUSINESS_UNITS` from `@/lib/group/units`; `BusinessUnitId` from `@/lib/group/types`.

- [ ] **Step 1: Add `HREFLANG` to `lib/group/market.ts`**

Append to the end of the file:

```ts
/* Código hreflang por mercado. Deliberadamente diferente de HTML_LANG:
   `lang` descreve a variante de idioma efetivamente servida na página
   (es-419 = espanhol da América Latina), enquanto hreflang serve para o
   buscador direcionar o resultado ao país certo — e segmentar o Paraguai
   é justamente o objetivo de toda a estrutura /py. */
export const HREFLANG: Record<Market, string> = {
  br: "pt-BR",
  py: "es-PY",
};
```

- [ ] **Step 2: Create `lib/group/routes.ts`**

```ts
import type { Market } from "./market";
import type { BusinessUnitId } from "./types";
import { MARKETS } from "./markets";
import { BUSINESS_UNITS } from "./units";

/* Rotas que existem em todos os mercados, independentes de unidade de
   negócio. "" é a landing do grupo (/br, /py). */
export const SHARED_PATHS = [
  "",
  "/sobre",
  "/equipe",
  "/obras",
  "/aviso-legal",
] as const;

const ALL_MARKETS: readonly Market[] = ["br", "py"];

/* Em quais mercados esta rota realmente resolve. Fonte única de verdade:
   MARKETS[m].activeUnits — exatamente o mesmo array que o guard de
   roteamento (assertUnitActive) usa para 404ar unidade inativa. É isso que
   garante que nenhum hreflang aponte para uma URL que retorna 404.

   Só recebe rotas conhecidas: SHARED_PATHS ou "/<unidade>". */
export function marketsForPath(path: string): Market[] {
  const unit = path.slice(1) as BusinessUnitId;
  if (path.startsWith("/") && unit in BUSINESS_UNITS) {
    return ALL_MARKETS.filter((m) => MARKETS[m].activeUnits.includes(unit));
  }
  return [...ALL_MARKETS];
}

/* Todas as rotas que resolvem num dado mercado — usada pelo sitemap. */
export function pathsForMarket(market: Market): string[] {
  return [
    ...SHARED_PATHS,
    ...MARKETS[market].activeUnits.map((unit) => `/${unit}`),
  ];
}
```

- [ ] **Step 3: Create `lib/seo.ts`**

```ts
import type { Metadata } from "next";
import type { Market } from "./group/market";
import { HREFLANG } from "./group/market";
import { marketsForPath } from "./group/routes";

/* URL base do site. Ainda é o domínio de preview da Vercel — a troca para o
   .com definitivo é a Fase 8 (cutover de domínio). Definido uma única vez
   aqui justamente para que essa troca seja uma linha só. */
export const SITE_URL = "https://site-centra-ultimo.vercel.app";

/* Canonical + hreflang de uma rota.

   Regras:
   - canonical é sempre auto-referencial: /{mercado}{path};
   - hreflang só é emitido quando a rota existe em mais de um mercado —
     nunca apontar para URL que 404a (ex.: /py/pre-moldados);
   - x-default aponta para "/", o seletor de país, que é o caso de uso
     canônico de x-default. */
export function buildAlternates(
  market: Market,
  path: string,
): Metadata["alternates"] {
  const markets = marketsForPath(path);

  if (markets.length < 2) {
    return { canonical: `/${market}${path}` };
  }

  const languages: Record<string, string> = {};
  for (const m of markets) {
    languages[HREFLANG[m]] = `/${m}${path}`;
  }
  languages["x-default"] = "/";

  return { canonical: `/${market}${path}`, languages };
}
```

- [ ] **Step 4: Make the root locale layout's metadata market-aware**

In `app/[locale]/layout.tsx`, replace the whole `export const metadata: Metadata = { ... }` block with the copy table and `generateMetadata` below. Keep every other export in that file exactly as it is (`generateStaticParams`, `dynamicParams`, `viewport`, the default component).

Add `SITE_URL` to the file's imports (`import { SITE_URL } from "@/lib/seo";`) and make sure `Market` and `OG_LOCALE` are imported from `@/lib/group/market` (the file already imports `HTML_LANG` from there — extend that import rather than adding a second one).

```tsx
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
```

Deliberately, this layout sets **no** `alternates` — each page sets its own in Task 2. A layout-level `alternates` would be inherited by every child page that doesn't override it, producing a wrong canonical on those pages.

- [ ] **Step 5: Use `SITE_URL` and add alternates in `app/(selector)/layout.tsx`**

In that file's existing `export const metadata` object: replace the hardcoded `new URL("https://site-centra-ultimo.vercel.app")` with `new URL(SITE_URL)` (adding `import { SITE_URL } from "@/lib/seo";`), and add this `alternates` key to the same object:

```ts
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/br",
      "es-PY": "/py",
      "x-default": "/",
    },
  },
```

(`/` is the x-default target, so it points at itself here — that is correct and expected.)

- [ ] **Step 6: Verify types and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint lib/group/market.ts lib/group/routes.ts lib/seo.ts "app/[locale]/layout.tsx" "app/(selector)/layout.tsx"`
Expected: no errors.

- [ ] **Step 7: Verify production build and rendered head**

Run: `pnpm build && pnpm start -p 3131`

Check the rendered HTML `<head>` (e.g. `curl -s http://localhost:3131/py | grep -i -E 'og:locale|<title>|description'`):
- `/br` — Portuguese title/description, `og:locale` `pt_BR`.
- `/py` — **Spanish** title/description (this is the fix: it was Portuguese before), `og:locale` `es_419`.
- `/` — still renders the selector with its own metadata, now also carrying `rel="canonical"` and the three `hreflang` links.
- No page shows a canonical it shouldn't: pages other than `/` should NOT yet have a canonical at this point (they get theirs in Task 2) — confirm the layout didn't leak one.

Shut down your server (leave the one on port 3000 alone).

- [ ] **Step 8: Commit**

```bash
git add lib/group/market.ts lib/group/routes.ts lib/seo.ts "app/[locale]/layout.tsx" "app/(selector)/layout.tsx"
git commit -m "$(cat <<'EOF'
Add SEO foundation: route inventory, alternates builder, market-aware root metadata

Fase 6: lib/group/routes.ts answers "in which markets does this path
resolve" from MARKETS[m].activeUnits — the same source of truth the
routing guard uses — so hreflang can never point at a URL that 404s.
lib/seo.ts builds canonical + hreflang from it and holds SITE_URL in
one place (Fase 8's domain cutover becomes a one-line change). The
[locale] root layout's metadata was Portuguese-only and applied to /py
too; it is now per-market.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Per-page market-aware metadata with canonical and hreflang

**Files:**
- Modify: `app/[locale]/page.tsx`
- Modify: `app/[locale]/construcao/page.tsx`
- Modify: `app/[locale]/pre-moldados/page.tsx`
- Modify: `app/[locale]/metalurgica/page.tsx`
- Modify: `app/[locale]/guindastes/page.tsx`
- Modify: `app/[locale]/sobre/page.tsx`
- Modify: `app/[locale]/equipe/page.tsx`
- Modify: `app/[locale]/obras/page.tsx`
- Modify: `app/[locale]/aviso-legal/page.tsx`

**Interfaces:**
- Consumes: `buildAlternates` from `@/lib/seo`, `Market` from `@/lib/group/market` (Task 1).
- Produces: nothing other files consume.

**The uniform pattern.** Every one of the 9 pages gets the same shape. Four of them (`sobre`, `equipe`, `obras`, `aviso-legal`) currently have a static `export const metadata: Metadata = {...}` — **delete that** and replace it with the `generateMetadata` below. The other five have no metadata at all — just add it. Each page already computes `market` in its default export; leave that untouched.

```tsx
const META: Record<Market, { title: string; description: string }> = {
  br: { title: "…", description: "…" },
  py: { title: "…", description: "…" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const market = locale as Market;
  return {
    title: META[market].title,
    description: META[market].description,
    alternates: buildAlternates(market, "<PATH>"),
  };
}
```

Each page already declares its own `type Props = { params: Promise<{ locale: string }> }` (in `obras/page.tsx` it's `Promise<{ locale: Market }>`) — reuse the file's existing `Props` type, do not add a second one. Add `import type { Metadata } from "next";` and `import { buildAlternates } from "@/lib/seo";` where missing; `Market` is already imported in every one of these files.

- [ ] **Step 1: `app/[locale]/page.tsx` — path `""`**

```tsx
const META: Record<Market, { title: string; description: string }> = {
  br: {
    title: "Grupo Centra — engenharia e indústria",
    description:
      "Construção civil, pré-moldados e artefatos de cimento, estruturas metálicas e locação de guindastes. Conheça as unidades de negócio do Grupo Centra.",
  },
  py: {
    title: "Grupo Centra — ingeniería y construcción",
    description:
      "Construcción civil del Grupo Centra en Paraguay, con el respaldo de la experiencia del grupo en Brasil.",
  },
};
```
with `buildAlternates(market, "")`.

- [ ] **Step 2: `app/[locale]/construcao/page.tsx` — path `"/construcao"`**

```tsx
const META: Record<Market, { title: string; description: string }> = {
  br: {
    title: "Construção civil",
    description:
      "Execução completa de obras industriais, agroindustriais e comerciais — do projeto à entrega final, com terraplanagem e gestão de projetos integradas.",
  },
  py: {
    title: "Construcción civil",
    description:
      "Ejecución completa de obras industriales, agroindustriales y comerciales — del proyecto a la entrega final.",
  },
};
```
with `buildAlternates(market, "/construcao")`. This is the one unit route active in both markets, so it is the only unit page that will emit hreflang.

- [ ] **Step 3: `app/[locale]/pre-moldados/page.tsx` — path `"/pre-moldados"`**

```tsx
const META: Record<Market, { title: string; description: string }> = {
  br: {
    title: "Pré-moldados e artefatos de cimento",
    description:
      "Indústria de pré-moldados e artefatos de cimento do Grupo Centra: elementos que aceleram prazos de obra sem abrir mão da qualidade.",
  },
  py: {
    title: "Prefabricados y artefactos de cemento",
    description:
      "Industria de prefabricados y artefactos de cemento del Grupo Centra.",
  },
};
```
with `buildAlternates(market, "/pre-moldados")`. The `py` branch exists only so the record is total — `/py/pre-moldados` 404s via the unit guard, and `buildAlternates` will correctly emit canonical-only (no hreflang) for this path.

- [ ] **Step 4: `app/[locale]/metalurgica/page.tsx` — path `"/metalurgica"`**

```tsx
const META: Record<Market, { title: string; description: string }> = {
  br: {
    title: "Metalúrgica",
    description:
      "Fabricação e montagem de estruturas metálicas de alto desempenho, com precisão e segurança.",
  },
  py: {
    title: "Metalúrgica",
    description:
      "Fabricación y montaje de estructuras metálicas de alto desempeño.",
  },
};
```
with `buildAlternates(market, "/metalurgica")`.

- [ ] **Step 5: `app/[locale]/guindastes/page.tsx` — path `"/guindastes"`**

```tsx
const META: Record<Market, { title: string; description: string }> = {
  br: {
    title: "Locação de guindastes",
    description:
      "Frota de guindastes e equipamentos para movimentação de cargas em obras de grande porte.",
  },
  py: {
    title: "Locación de grúas",
    description:
      "Flota de grúas y equipos para movimiento de cargas en obras de gran porte.",
  },
};
```
with `buildAlternates(market, "/guindastes")`.

- [ ] **Step 6: `app/[locale]/sobre/page.tsx` — path `"/sobre"`**

Delete the existing static `export const metadata` block first.

```tsx
const META: Record<Market, { title: string; description: string }> = {
  br: {
    title: "A Centra",
    description:
      "Conheça a Centra — missão, visão, valores e a equipe que transforma projetos em empreendimentos de alto desempenho. Atuação no Brasil e, na construção civil, também no Paraguai.",
  },
  py: {
    title: "Nosotros",
    description:
      "Conozca al Grupo Centra — misión, visión, valores y el equipo que transforma proyectos en emprendimientos de alto desempeño. Operamos en Brasil y en Paraguay.",
  },
};
```
with `buildAlternates(market, "/sobre")`.

- [ ] **Step 7: `app/[locale]/equipe/page.tsx` — path `"/equipe"`**

Delete the existing static `export const metadata` block first.

```tsx
const META: Record<Market, { title: string; description: string }> = {
  br: {
    title: "Equipe",
    description:
      "Conheça os engenheiros e profissionais da Centra que entregam obras de alto desempenho no Sul do Brasil.",
  },
  py: {
    title: "Equipo",
    description:
      "Conozca a los ingenieros y profesionales del Grupo Centra. El mismo equipo fundador, con sede en Brasil, conduce la expansión en Paraguay.",
  },
};
```
with `buildAlternates(market, "/equipe")`.

- [ ] **Step 8: `app/[locale]/obras/page.tsx` — path `"/obras"`**

Delete the existing static `export const metadata` block first. Note this file's `Props` types `locale` as `Market` already — reuse it, and in `generateMetadata` you can use `locale` directly without the `as Market` cast.

```tsx
const META: Record<Market, { title: string; description: string }> = {
  br: {
    title: "Obras",
    description:
      "Portfólio de obras do Grupo Centra — projetos entregues para cooperativas agroindustriais e clientes industriais no Sul do Brasil.",
  },
  py: {
    title: "Obras",
    description:
      "Portafolio de obras del Grupo Centra. Las obras ejecutadas en Brasil están identificadas como tales, con el país de ejecución en cada proyecto.",
  },
};
```
with `buildAlternates(market, "/obras")`. The `py` description deliberately restates the attribution rule that the page itself already enforces — never let a search result imply the Paraguayan entity executed Brazilian works.

- [ ] **Step 9: `app/[locale]/aviso-legal/page.tsx` — path `"/aviso-legal"`**

Delete the existing static `export const metadata` block first.

```tsx
const META: Record<Market, { title: string; description: string }> = {
  br: {
    title: "Aviso legal",
    description:
      "Informações legais da entidade brasileira do Grupo Centra: razão social, CNPJ, endereço e telefone.",
  },
  py: {
    title: "Aviso legal",
    description:
      "Información legal de la entidad paraguaya del Grupo Centra: razón social, RUC, dirección y teléfono.",
  },
};
```
with `buildAlternates(market, "/aviso-legal")`.

- [ ] **Step 10: Verify types and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run `pnpm exec eslint` over all 9 modified page files.
Expected: no errors.

- [ ] **Step 11: Verify production build and the hreflang rules**

Run: `pnpm build && pnpm start -p 3131`

For each URL below, inspect the rendered `<head>` (e.g. `curl -s <url> | grep -i -E 'canonical|hreflang|<title>'`):

| URL | Expected canonical | Expected hreflang |
|---|---|---|
| `/br` | `/br` | `pt-BR` → `/br`, `es-PY` → `/py`, `x-default` → `/` |
| `/py` | `/py` | same three |
| `/br/construcao` | `/br/construcao` | `pt-BR` → `/br/construcao`, `es-PY` → `/py/construcao`, `x-default` → `/` |
| `/br/pre-moldados` | `/br/pre-moldados` | **none at all** (no PY equivalent) |
| `/br/metalurgica` | `/br/metalurgica` | **none at all** |
| `/br/guindastes` | `/br/guindastes` | **none at all** |
| `/py/sobre` | `/py/sobre` | both markets + x-default |
| `/py/obras` | `/py/obras` | both markets + x-default |
| `/py/aviso-legal` | `/py/aviso-legal` | both markets + x-default |

Also confirm every `/py/*` page's `<title>` and `description` are now Spanish (they were Portuguese before this phase), and that no emitted hreflang URL 404s — curl each hreflang target and confirm HTTP 200.

Shut down your server (leave the one on port 3000 alone).

- [ ] **Step 12: Commit**

```bash
git add "app/[locale]/page.tsx" "app/[locale]/construcao/page.tsx" "app/[locale]/pre-moldados/page.tsx" "app/[locale]/metalurgica/page.tsx" "app/[locale]/guindastes/page.tsx" "app/[locale]/sobre/page.tsx" "app/[locale]/equipe/page.tsx" "app/[locale]/obras/page.tsx" "app/[locale]/aviso-legal/page.tsx"
git commit -m "$(cat <<'EOF'
Add per-page market-aware metadata with canonical and hreflang

Fase 6: all 9 locale pages now emit their own title/description per
market and a self-referential canonical. hreflang is emitted only
between pages that exist in both markets — the three BR-only unit
pages emit canonical alone, never an alternate pointing at a URL the
unit guard 404s. Also closes two gaps parked by earlier reviews: the
unit pages and the group landing had no per-page metadata at all, and
every /py page was serving Portuguese titles and descriptions.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: `sitemap.ts` and `robots.ts`

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

**Interfaces:**
- Consumes: `SITE_URL` from `@/lib/seo`; `marketsForPath`, `pathsForMarket` from `@/lib/group/routes`; `HREFLANG`, `Market` from `@/lib/group/market`; `routing` from `@/i18n/routing`.
- Produces: the `/sitemap.xml` and `/robots.txt` routes.

- [ ] **Step 1: Create `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { HREFLANG } from "@/lib/group/market";
import { marketsForPath, pathsForMarket } from "@/lib/group/routes";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  /* A raiz é o seletor de país — é ela que o x-default aponta. */
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "yearly", priority: 1 },
  ];

  for (const market of routing.locales) {
    for (const path of pathsForMarket(market)) {
      const markets = marketsForPath(path);
      const url = `${SITE_URL}/${market}${path}`;

      if (markets.length < 2) {
        entries.push({ url, changeFrequency: "monthly", priority: 0.7 });
        continue;
      }

      const languages: Record<string, string> = {};
      for (const m of markets) {
        languages[HREFLANG[m]] = `${SITE_URL}/${m}${path}`;
      }
      languages["x-default"] = `${SITE_URL}/`;

      entries.push({
        url,
        changeFrequency: "monthly",
        priority: path === "" ? 0.9 : 0.7,
        alternates: { languages },
      });
    }
  }

  return entries;
}
```

`routing.locales` is declared in `i18n/routing.ts` as `["br", "py"] satisfies readonly Market[]`, so `market` is already typed `Market` here. **If TypeScript widens it to `string` and this fails to compile, stop and report it — do not paper over it with an `as Market` cast.** A widened type there would mean the `satisfies` guarantee added in an earlier phase has been lost, which is a real regression worth surfacing rather than hiding.

Note there is deliberately no `/solucoes` entry (it is a redirect, not a page) and no entry for any inactive unit route — `pathsForMarket` returns only paths that actually resolve for that market.

- [ ] **Step 2: Create `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Verify types and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint app/sitemap.ts app/robots.ts`
Expected: no errors.

- [ ] **Step 4: Verify production build and the generated files**

Run: `pnpm build && pnpm start -p 3131`

- `curl -s http://localhost:3131/robots.txt` — contains `Allow: /` and a `Sitemap:` line pointing at `/sitemap.xml`.
- `curl -s http://localhost:3131/sitemap.xml` — check all of the following:
  - contains `/`, `/br`, `/py`, and every shared path under both prefixes (`/br/sobre`, `/py/sobre`, `/br/equipe`, `/py/equipe`, `/br/obras`, `/py/obras`, `/br/aviso-legal`, `/py/aviso-legal`), plus `/br/construcao` and `/py/construcao`;
  - contains `/br/pre-moldados`, `/br/metalurgica`, `/br/guindastes`;
  - **does NOT contain** `/py/pre-moldados`, `/py/metalurgica`, `/py/guindastes` (inactive units) or any `/solucoes` URL;
  - `xhtml:link` alternates appear on the both-market entries and are absent on the three BR-only unit entries.
- Sanity-check that every URL listed in the sitemap returns HTTP 200 (loop over them with curl) — a sitemap listing a 404 is worse than no sitemap.

Shut down your server (leave the one on port 3000 alone).

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "$(cat <<'EOF'
Add sitemap.ts and robots.ts

Fase 6: both are generated from the same route inventory that drives
hreflang (MARKETS[m].activeUnits), so the sitemap lists only URLs that
actually resolve — no inactive unit routes, no /solucoes redirect —
and carries xhtml:link alternates exactly where a second market exists.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
