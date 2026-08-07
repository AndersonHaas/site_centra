# Unified Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the portfolio data model with `country`/`executingEntity` (and optional `location`/`year`/`description`), and make `Portfolio.tsx` market-aware so the same component correctly shows a country badge, a country filter, and — critically — a legal attribution note whenever a Brazilian-executed obra is shown on the Paraguay-market route. This is "Fase 3" of `~/.claude/plans/qual-a-melhor-elegant-zephyr.md`.

**Architecture:** `scripts/sync-portfolio.py` gains a manually-maintained `scripts/portfolio-overrides.json` it merges by slug (editorial/legal fields aren't inferable from photo folder names), defaulting every un-overridden obra to `{country: "BR", executingEntity: "centra-br"}` — safe today since all 17 real obras are Brazilian. `Portfolio.tsx` takes `market`/`showAttributionNote` props instead of being locale-blind; `app/[locale]/obras/page.tsx` (which already serves both `/br/obras` and `/py/obras` today) passes `market={locale as Market}` and `showAttributionNote={market === "py"}` — meaning this phase closes a real, already-live legal-accuracy gap: `/py/obras` currently shows the same 17 Brazilian obras with zero attribution, which is exactly the misrepresentation risk the site owner flagged.

**Tech Stack:** Next.js 16, TypeScript, Python 3 (existing sync script), no new dependency.

## Global Constraints

- `country` is `"BR" | "PY"`, `executingEntity` is `"centra-br" | "centra-py"` — exact string values, used as TypeScript literal types via the existing `as const` pattern on `PROJECTS`.
- Every existing obra defaults to `{country: "BR", executingEntity: "centra-br"}` when it has no entry in `portfolio-overrides.json` — do not require every obra to have an override, and do not change any of the 17 current obras' `slug`/`client`/`title`/`images` values.
- No next-intl `useTranslations`/`messages/*.json` in this component. The project's i18n model doesn't need same-page bilingual rendering right now (`/py` is Spanish-only, `/br` is Portuguese-only, no route serves both languages at once) — market-specific copy lives directly in a small `COPY: Record<Market, ...>` object inside the component, the same pattern already used for e.g. `HTML_LANG`/`MARKET_LANGUAGE` in `lib/group/market.ts`. Do not introduce `useTranslations` here.
- Portuguese and Spanish copy in this task must describe only facts already established in this project (the group operates in Brazil and Paraguay, obras shown may come from either) — no invented client names, obra counts, or claims.
- Do not touch `lib/content.ts`'s other exports, `components/sections/Obras.tsx` (the home-page teaser deck, a separate data source `WORKS` — out of scope), or any file under `components/ui/`.
- No test framework exists. Verification is `pnpm exec tsc --noEmit`, `pnpm exec eslint <changed files>`, `pnpm build`, running `pnpm run fotos` to confirm the sync script still works and produces a byte-identical image set, and live browser checks.
- Work directly on `main`, commit locally, do NOT push to origin.

---

### Task 1: Extend portfolio schema and make `Portfolio.tsx` market-aware

**Files:**
- Create: `scripts/portfolio-overrides.json`
- Modify: `scripts/sync-portfolio.py`
- Modify: `components/sections/Portfolio.tsx`
- Modify: `app/[locale]/obras/page.tsx`
- Regenerate: `lib/portfolio-data.ts` (via running the script — not hand-edited)

**Interfaces:**
- Consumes: `Market` from `@/lib/group/market` (existing).
- Produces: `(typeof PROJECTS)[number]["country"]` and `(typeof PROJECTS)[number]["executingEntity"]` literal types, derived the same way the existing `ProjectClient` type already is in `lib/content.ts` — no new type file needed.
- Produces: `Portfolio` component now requires `market: Market` and accepts optional `showAttributionNote?: boolean` — any future consumer (Fase 5's `/py/construcao/obras`) must pass `market`.

- [ ] **Step 1: Create `scripts/portfolio-overrides.json`**

```json
{}
```

Empty — no existing obra needs an override yet (all 17 are correctly BR by default). This file is where a human manually records `country`/`executingEntity`/`location`/`year`/`description` per slug when that information is known; the sync script never writes to it.

- [ ] **Step 2: Modify `scripts/sync-portfolio.py`**

Add near the other path constants (after `OUTPUT_TS = SITE_DIR / "lib" / "portfolio-data.ts"`):

```python
OVERRIDES_PATH = SITE_DIR / "scripts" / "portfolio-overrides.json"
```

In `main()`, right after `DEST_DIR.mkdir(parents=True, exist_ok=True)`, add:

```python
    overrides = {}
    if OVERRIDES_PATH.is_file():
        overrides = json.loads(OVERRIDES_PATH.read_text(encoding="utf-8"))
```

Replace this line (inside the `for folder in sorted(SRC_ROOT.iterdir()):` loop, right after the existing print of `cover_flag`):
```python
        obras.append({"slug": slug, "client": client, "title": title, "images": images})
```
with:
```python
        override = overrides.get(slug, {})
        country = override.get("country", "BR")
        executing_entity = override.get("executingEntity", "centra-br")
        location = override.get("location")
        year = override.get("year")
        description = override.get("description")

        missing = [f for f, v in (("year", year), ("description", description)) if v is None]
        if missing:
            print(f"    aviso: {slug} sem {', '.join(missing)} (adicione em scripts/portfolio-overrides.json)")

        obras.append({
            "slug": slug, "client": client, "title": title, "images": images,
            "country": country, "executingEntity": executing_entity,
            "location": location, "year": year, "description": description,
        })
```

Replace the TS-generation loop body — currently:
```python
    for obra in obras:
        lines.append("  {")
        lines.append(f"    slug: {json.dumps(obra['slug'], ensure_ascii=False)},")
        lines.append(f"    client: {json.dumps(obra['client'], ensure_ascii=False)},")
        lines.append(f"    title: {json.dumps(obra['title'], ensure_ascii=False)},")
        if len(obra["images"]) == 1:
            img = json.dumps(obra["images"][0], ensure_ascii=False)
            lines.append(f"    images: [{img}],")
        else:
            lines.append("    images: [")
            for img in obra["images"]:
                lines.append(f"      {json.dumps(img, ensure_ascii=False)},")
            lines.append("    ],")
        lines.append("  },")
```
with:
```python
    for obra in obras:
        lines.append("  {")
        lines.append(f"    slug: {json.dumps(obra['slug'], ensure_ascii=False)},")
        lines.append(f"    client: {json.dumps(obra['client'], ensure_ascii=False)},")
        lines.append(f"    title: {json.dumps(obra['title'], ensure_ascii=False)},")
        if len(obra["images"]) == 1:
            img = json.dumps(obra["images"][0], ensure_ascii=False)
            lines.append(f"    images: [{img}],")
        else:
            lines.append("    images: [")
            for img in obra["images"]:
                lines.append(f"      {json.dumps(img, ensure_ascii=False)},")
            lines.append("    ],")
        lines.append(f"    country: {json.dumps(obra['country'], ensure_ascii=False)},")
        lines.append(f"    executingEntity: {json.dumps(obra['executingEntity'], ensure_ascii=False)},")
        if obra["location"] is not None:
            lines.append(f"    location: {json.dumps(obra['location'], ensure_ascii=False)},")
        if obra["year"] is not None:
            lines.append(f"    year: {obra['year']},")
        if obra["description"] is not None:
            lines.append(f"    description: {json.dumps(obra['description'], ensure_ascii=False)},")
        lines.append("  },")
```

Also update the header comment block (the `/* ARQUIVO GERADO AUTOMATICAMENTE ... */` lines written into `lines` near the top of `main()`) — add one line mentioning the overrides file:
```python
    lines = [
        "/* ARQUIVO GERADO AUTOMATICAMENTE por scripts/sync-portfolio.py — não edite à mão.",
        "   Para atualizar: organize as fotos em \"Fotos Marketing/<Cliente> - <Obra>\"",
        "   e rode `pnpm run fotos`. Para escolher a capa, inclua \"capa\" no nome do arquivo.",
        "   Campos editoriais (country/executingEntity/location/year/description) vêm de",
        "   scripts/portfolio-overrides.json — edite lá, nunca aqui. */",
        "",
        "export const PROJECTS = [",
    ]
```

- [ ] **Step 3: Run the sync script and verify no image drift**

Run: `pnpm run fotos`
Expected: all 17 obras processed, no errors. The console should print `aviso: <slug> sem year, description` for every obra (since `portfolio-overrides.json` is empty) — that's expected, not a failure.

Run: `git status --porcelain public/images/portfolio`
Expected: empty output — zero image changes, confirming the override layer didn't alter photo selection.

Read the regenerated `lib/portfolio-data.ts` and confirm every obra object now has `country: "BR"` and `executingEntity: "centra-br"` added, with no `location`/`year`/`description` fields present (since none are in the empty overrides file).

- [ ] **Step 4: Modify `components/sections/Portfolio.tsx`**

Replace the full file content:

```tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { Lightbox } from "@/components/ui/Lightbox";
import { PROJECTS, type ProjectClient } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Market } from "@/lib/group/market";

type ProjectCountry = (typeof PROJECTS)[number]["country"];

const CLIENT_FILTERS: Array<{ label: string; value: ProjectClient | "Todas" }> = [
  { label: "Todas", value: "Todas" },
  { label: "C.Vale", value: "C.Vale" },
  { label: "Copacol", value: "Copacol" },
];

type CountryFilterOption = { label: string; value: ProjectCountry | "Todos" };

const COPY: Record<
  Market,
  {
    eyebrow: string;
    title: React.ReactNode;
    description: string;
    countryFilters: CountryFilterOption[];
    attributionNote: string;
    countryBadge: Record<ProjectCountry, string>;
  }
> = {
  br: {
    eyebrow: "Portfólio",
    title: (
      <>
        Obras que mostram{" "}
        <span className="text-brand-600">nossa escala</span>.
      </>
    ),
    description:
      "Projetos entregues pelo Grupo Centra no Brasil e no Paraguai — cada um com seu registro fotográfico.",
    countryFilters: [
      { label: "Todos os países", value: "Todos" },
      { label: "Brasil", value: "BR" },
      { label: "Paraguai", value: "PY" },
    ],
    attributionNote: "Obras executadas pelo Grupo Centra no Brasil.",
    countryBadge: { BR: "Executado no Brasil", PY: "Executado no Paraguai" },
  },
  py: {
    eyebrow: "Portafolio",
    title: (
      <>
        Obras que muestran{" "}
        <span className="text-brand-600">nuestra escala</span>.
      </>
    ),
    description:
      "Proyectos entregados por el Grupo Centra en Brasil y Paraguay — cada uno con su registro fotográfico.",
    countryFilters: [
      { label: "Todos los países", value: "Todos" },
      { label: "Brasil", value: "BR" },
      { label: "Paraguay", value: "PY" },
    ],
    attributionNote: "Obras ejecutadas por el Grupo Centra en Brasil.",
    countryBadge: { BR: "Ejecutado en Brasil", PY: "Ejecutado en Paraguay" },
  },
};

type PortfolioProps = {
  market: Market;
  showAttributionNote?: boolean;
};

export function Portfolio({ market, showAttributionNote = false }: PortfolioProps) {
  const copy = COPY[market];
  const [clientFilter, setClientFilter] = useState<ProjectClient | "Todas">("Todas");
  const [countryFilter, setCountryFilter] = useState<ProjectCountry | "Todos">("Todos");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const projects = PROJECTS.filter(
    (p) =>
      (clientFilter === "Todas" || p.client === clientFilter) &&
      (countryFilter === "Todos" || p.country === countryFilter),
  );

  const activeProject = PROJECTS.find((p) => p.slug === activeSlug) ?? null;

  return (
    <section className="relative bg-paper py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          as="h1"
          index="01"
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
        />

        {showAttributionNote && (
          <Reveal className="mt-6">
            <p className="rounded-xl border border-hair bg-paper-2 px-4 py-3 text-sm text-ink-soft">
              {copy.attributionNote}
            </p>
          </Reveal>
        )}

        {/* Sticky wrapper must NOT be nested inside the Reveal motion.div:
            framer-motion leaves an inline transform on its element after
            animating (even translateY(0)), which creates a new containing
            block and silently breaks `position: sticky` on descendants. */}
        <div className="sticky top-[70px] z-20 -mx-6 mt-10 flex flex-col gap-2 overflow-x-auto bg-paper px-6 pb-1 md:mx-0 md:px-0">
          <Reveal className="flex gap-2">
            {CLIENT_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setClientFilter(f.value)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  clientFilter === f.value
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-hair bg-surface text-ink-soft hover:border-brand-200 hover:text-ink",
                )}
              >
                {f.label}
              </button>
            ))}
          </Reveal>
          <Reveal className="flex gap-2">
            {copy.countryFilters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setCountryFilter(f.value)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  countryFilter === f.value
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-hair bg-surface text-ink-soft hover:border-brand-200 hover:text-ink",
                )}
              >
                {f.label}
              </button>
            ))}
          </Reveal>
        </div>

        <RevealStagger
          key={`${clientFilter}-${countryFilter}`}
          className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          gap={0.05}
        >
          {projects.map((project, index) => (
            <RevealItem key={project.slug}>
              <button
                type="button"
                onClick={(e) => {
                  triggerRef.current = e.currentTarget;
                  setActiveSlug(project.slug);
                  setActiveIndex(0);
                }}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-hair bg-paper-2 text-left"
              >
                {/* Sem placeholder="blur": imagens vêm de public/ por caminho de string (não import estático) — ver docs/superpowers/specs/2026-07-28-portfolio-obras-design.md */}
                <Image
                  src={project.images[0]}
                  alt={`${project.client} — ${project.title}`}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  priority={index === 0}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="hud rounded-full border border-white/15 bg-ink-950/40 px-3 py-1.5 text-white/80 backdrop-blur-sm">
                    {project.client}
                  </span>
                  <span className="hud rounded-full border border-white/15 bg-ink-950/40 px-3 py-1.5 text-white/80 backdrop-blur-sm">
                    {copy.countryBadge[project.country]}
                  </span>
                </div>
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2">
                  <h3 className="text-lg font-semibold leading-tight text-white">
                    {project.title}
                  </h3>
                  {project.images.length > 1 && (
                    <span className="hud flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-ink-950/40 px-2.5 py-1.5 text-white/80 backdrop-blur-sm">
                      <ImageIcon className="h-3 w-3" />
                      {project.images.length}
                    </span>
                  )}
                </div>
              </button>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>

      {activeProject && (
        <Lightbox
          images={activeProject.images}
          title={`${activeProject.client} — ${activeProject.title}`}
          index={activeIndex}
          onClose={() => {
            setActiveSlug(null);
            triggerRef.current?.focus();
          }}
          onIndexChange={setActiveIndex}
        />
      )}
    </section>
  );
}
```

Note the two card badges (client + country) are now grouped in one `flex flex-wrap` container at top-left instead of two separately-positioned absolute elements — this avoids the country badge's longer text ("Executado no Paraguai") colliding with the client badge on narrow cards; they wrap onto a second line if needed instead of overlapping.

- [ ] **Step 5: Modify `app/[locale]/obras/page.tsx`**

Replace the full file content:

```tsx
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Portfolio } from "@/components/sections/Portfolio";
import { Footer } from "@/components/sections/Footer";
import type { Market } from "@/lib/group/market";

export const metadata: Metadata = {
  title: "Obras",
  description:
    "Portfólio completo de obras da Centra Engenharia — projetos entregues para cooperativas agroindustriais no Sul do Brasil.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ObrasPage({ params }: Props) {
  const { locale } = await params;
  const market = locale as Market;

  return (
    <>
      <Navbar />
      <main className="pt-[70px]">
        <Portfolio market={market} showAttributionNote={market === "py"} />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 6: Verify types and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint scripts/sync-portfolio.py 2>/dev/null; pnpm exec eslint components/sections/Portfolio.tsx "app/[locale]/obras/page.tsx"`
(The Python file has no ESLint config — that command is expected to no-op or error harmlessly on it; only the two `.tsx` files need to actually pass.)
Expected: the two `.tsx` files lint clean.

- [ ] **Step 7: Verify production build**

Run: `pnpm build`
Expected: build succeeds.

- [ ] **Step 8: Live browser verification**

On `/br/obras`:
- All 17 obras render, each card shows a client badge AND a "Executado no Brasil" badge (both readable, not overlapping, even on mobile width).
- Client filter pills and the new country filter pills ("Todos os países" / "Brasil" / "Paraguai") both work, independently and combined.
- No attribution note block appears (only shown when `showAttributionNote` is true, which it isn't for `/br`).
- Lightbox still opens/closes correctly.

On `/py/obras`:
- Same 17 obras render (expected — no PY obras exist yet), each card shows "Ejecutado en Brasil" badge (Spanish).
- The attribution note IS visible near the top: "Obras ejecutadas por el Grupo Centra en Brasil."
- Country/client filters render in Spanish ("Todos los países", etc.) and work correctly.

No console errors on either route.

- [ ] **Step 9: Commit**

```bash
git add scripts/portfolio-overrides.json scripts/sync-portfolio.py lib/portfolio-data.ts components/sections/Portfolio.tsx "app/[locale]/obras/page.tsx"
git commit -m "$(cat <<'EOF'
Make portfolio market-aware: country badges, filter, PY attribution note

Fase 3 of the Grupo Centra architecture. Extends the generated portfolio
schema with country/executingEntity (scripts/portfolio-overrides.json,
merged by slug, defaulting existing obras to BR/centra-br). Portfolio.tsx
now takes market/showAttributionNote props; /py/obras — which already
serves the same 17 Brazilian obras today — now shows a clear attribution
note instead of implying the Paraguay entity executed them.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
