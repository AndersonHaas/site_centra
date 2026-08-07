# PY Market Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the remaining gaps for the 6 "rotas PY" pages required by the Grupo Centra architecture plan (`~/.claude/plans/qual-a-melhor-elegant-zephyr.md`, Fase 5). Of the 6, 4 already exist and need no new work: home (`/py`, group landing from Fase 4), serviços (`/py/construcao`, Fase 4), obras (`/py/obras`, Fase 3, already market-aware with country attribution), contato (`/py/construcao#contato`, part of the construção page). The 2 that remain: `/py/sobre` and `/py/equipe` currently render the `About`/`Equipe` components hardcoded in Portuguese regardless of market — this plan makes them market-aware in Spanish. The 6th item, "aviso legal", does not exist yet as a page anywhere and is genuinely new — this plan adds it, consuming the `MARKETS[market].legalEntity` data that has existed since Fase 1 but has never been rendered anywhere.

**Architecture:** Two independent, non-overlapping tasks. Task 1 follows the same market-aware-component pattern already established for `Navbar`/`Footer`/`Portfolio` in earlier phases: each component gains a required `market: Market` prop and a local `Record<Market, {...}>` copy object, no `next-intl` messages layer involved. Task 2 adds one new locale-scoped route (`app/[locale]/aviso-legal/page.tsx`) — not a business unit, so no `assertUnitActive` guard, just a plain page that reads `MARKETS[market].legalEntity` and renders it, plus a footer link to it.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind v4. No new dependency.

## Global Constraints

- Reuse the exact Portuguese and Spanish copy given in this plan's task steps verbatim — do not rephrase, "improve", or re-translate it. Every Spanish string below was translated once, deliberately, as part of planning this phase; treat it as final content, not a draft.
- Do not fabricate any new claim about the Paraguay operation (no invented project counts, staff numbers, addresses, or a confirmed legal entity name) — only state facts already established elsewhere in this project: the construction unit operates in both Brazil and Paraguay (`MARKETS.py.activeUnits = ["construcao"]`), the founding team is based in Brazil and also leads the Paraguay expansion, and the Paraguay legal entity's exact registry data is still an unconfirmed placeholder (`taxId: null`).
- Task 1's scope is exactly `About.tsx` and `Equipe.tsx`. Do not touch `Credenciais.tsx` (also renders `FOUNDERS`, also hardcoded Portuguese, also rendered on `/py/construcao`) — that gap was already identified and explicitly deferred in the Fase 4 final review as future i18n-content work, not part of this plan.
- The new `aviso-legal` route is a group-level legal page, not a business unit — it must NOT call `assertUnitActive` and must exist identically under both `/br/aviso-legal` and `/py/aviso-legal` with no guard.
- `MARKETS[market].legalEntity.taxId` is `null` for both markets today (real CNPJ/RUC not yet confirmed) — render an explicit "a confirmar" placeholder wherever it's shown, never the literal string `"null"`, never an empty cell.
- Never render one market's `legalEntity` data on the other market's route — since this page only ever reads `MARKETS[market]` for its own locale, this is structurally guaranteed as long as no cross-market rendering is introduced; do not add one.
- No test framework exists in this repo. Verification is `pnpm exec tsc --noEmit`, `pnpm exec eslint <changed files>`, and a **production** build check (`pnpm build && pnpm start`) — this project has a documented history of bugs that only reproduced in production, not `pnpm dev`.
- Work directly on `main`, commit locally, do NOT push to origin.

---

### Task 1: Market-aware `About` and `Equipe`

**Files:**
- Modify: `components/sections/About.tsx`
- Modify: `components/sections/Equipe.tsx`
- Modify: `app/[locale]/sobre/page.tsx`
- Modify: `app/[locale]/equipe/page.tsx`
- Modify: `lib/content.ts` (remove now-dead `PILLARS` export once inlined into `About.tsx`)

**Interfaces:**
- Consumes: `Market` from `@/lib/group/market` (existing).
- Produces: `About({ market: Market })` and `Equipe({ market: Market })` — both now require the prop, no default. No other file calls these components today besides the two pages listed above.

- [ ] **Step 1: Rewrite `components/sections/About.tsx`**

Replace the full file content with:

```tsx
"use client";

import { Target, Eye, Gem } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import type { Market } from "@/lib/group/market";

const ICONS = { missao: Target, visao: Eye, valores: Gem } as const;

const PILLARS: Record<
  Market,
  Array<{ key: "missao" | "visao" | "valores"; title: string; body: string }>
> = {
  br: [
    {
      key: "missao",
      title: "Missão",
      body: "Entregar soluções de engenharia e construção com excelência técnica, inovação e eficiência operacional, transformando projetos em empreendimentos de alto desempenho — com compromisso, segurança e responsabilidade, gerando valor sustentável para clientes, parceiros e comunidades.",
    },
    {
      key: "visao",
      title: "Visão",
      body: "Ser reconhecida como uma das principais referências em engenharia e construção da região Sul do Brasil, destacando-se pela qualidade das entregas, solidez das relações, capacidade técnica e contribuição para o desenvolvimento dos setores industrial, agroindustrial e comercial.",
    },
    {
      key: "valores",
      title: "Valores",
      body: "Atuamos com ética, transparência e comprometimento em todas as relações e projetos. Valorizamos a excelência técnica, a segurança, a inovação e o desenvolvimento contínuo, buscando soluções de alta qualidade que gerem resultados duradouros.",
    },
  ],
  py: [
    {
      key: "missao",
      title: "Misión",
      body: "Entregar soluciones de ingeniería y construcción con excelencia técnica, innovación y eficiencia operacional, transformando proyectos en emprendimientos de alto desempeño — con compromiso, seguridad y responsabilidad, generando valor sostenible para clientes, socios y comunidades.",
    },
    {
      key: "visao",
      title: "Visión",
      body: "Ser reconocida como una de las principales referencias en ingeniería y construcción de la región Sur de Brasil, destacándose por la calidad de las entregas, la solidez de las relaciones, la capacidad técnica y la contribución al desarrollo de los sectores industrial, agroindustrial y comercial.",
    },
    {
      key: "valores",
      title: "Valores",
      body: "Actuamos con ética, transparencia y compromiso en todas las relaciones y proyectos. Valoramos la excelencia técnica, la seguridad, la innovación y el desarrollo continuo, buscando soluciones de alta calidad que generen resultados duraderos.",
    },
  ],
};

const SECTION_COPY: Record<Market, { eyebrow: string; description: string }> = {
  br: {
    eyebrow: "Quem é a Centra",
    description:
      "Uma equipe técnica especializada — engenheiros, gestores e profissionais experientes — que atua de forma integrada em todas as etapas, transformando projetos em empreendimentos de alto desempenho. Atuamos no Brasil, com a unidade de construção civil presente também no Paraguai.",
  },
  py: {
    eyebrow: "Quiénes somos",
    description:
      "Un equipo técnico especializado — ingenieros, gestores y profesionales experimentados — que actúa de forma integrada en todas las etapas, transformando proyectos en emprendimientos de alto desempeño. El Grupo Centra opera en Brasil, y su unidad de construcción civil también opera en Paraguay.",
  },
};

const STATS_COPY: Record<
  Market,
  { area: string; areaLabel: string; states: string; statesLabel: string }
> = {
  br: {
    area: "+550 mil m²",
    areaLabel: "construídos e entregues",
    states: "4 estados",
    statesLabel: "de presença consolidada",
  },
  py: {
    area: "+550 mil m²",
    areaLabel: "construidos y entregados en Brasil",
    states: "4 estados",
    statesLabel: "de presencia consolidada en Brasil",
  },
};

const TITLE: Record<Market, { line1: string; line2: string; highlight: string }> = {
  br: { line1: "A força da Centra", line2: "está nas", highlight: "pessoas" },
  py: { line1: "La fuerza de Centra", line2: "está en las", highlight: "personas" },
};

export function About({ market }: { market: Market }) {
  const pillars = PILLARS[market];
  const copy = SECTION_COPY[market];
  const stats = STATS_COPY[market];
  const title = TITLE[market];

  return (
    <section id="sobre" className="relative bg-paper py-24 md:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            as="h1"
            index="01"
            eyebrow={copy.eyebrow}
            title={
              <>
                {title.line1}
                <br />
                {title.line2} <span className="text-brand-600">{title.highlight}</span>.
              </>
            }
            description={copy.description}
          />

          <Reveal delay={0.18} className="mt-10">
            <div className="flex items-center gap-6 border-t border-hair pt-6">
              <div>
                <div className="display text-3xl text-ink">{stats.area}</div>
                <p className="mt-1 text-sm text-ink-soft">{stats.areaLabel}</p>
              </div>
              <div className="h-12 w-px bg-hair" />
              <div>
                <div className="display text-3xl text-ink">{stats.states}</div>
                <p className="mt-1 text-sm text-ink-soft">{stats.statesLabel}</p>
              </div>
            </div>
          </Reveal>
        </div>

        <RevealStagger className="flex flex-col gap-4" gap={0.1}>
          {pillars.map((p, i) => {
            const Icon = ICONS[p.key];
            return (
              <RevealItem key={p.key}>
                <article className="group relative overflow-hidden rounded-2xl border border-hair bg-surface p-7 transition-colors duration-300 hover:border-brand-200 hover:bg-brand-50/40 md:p-9">
                  <span className="absolute right-7 top-7 font-mono text-xs text-ink-soft">
                    0{i + 1}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
                    {p.body}
                  </p>
                </article>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Rewrite `components/sections/Equipe.tsx`**

Replace the full file content with:

```tsx
"use client";

import { BadgeCheck } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { FOUNDERS } from "@/lib/content";
import type { Market } from "@/lib/group/market";

function initials(name: string) {
  return name
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const ROLE_LABEL: Record<Market, string> = {
  br: "Sócio-fundador · Engenheiro Civil",
  py: "Socio fundador · Ingeniero Civil",
};

const SECTION_COPY: Record<Market, { eyebrow: string; description: string }> = {
  br: {
    eyebrow: "Equipe técnica",
    description:
      "Profissionais experientes, integrados em todas as etapas dos projetos — do planejamento à entrega final.",
  },
  py: {
    eyebrow: "Equipo técnico",
    description:
      "Profesionales experimentados, integrados en todas las etapas de los proyectos — desde la planificación hasta la entrega final. El mismo equipo fundador, con sede en Brasil, conduce también la expansión del Grupo Centra en Paraguay.",
  },
};

const TITLE: Record<Market, { pre: string; highlight: string }> = {
  br: { pre: "Engenheiros e gestores que", highlight: "assinam cada obra" },
  py: { pre: "Ingenieros y gestores que", highlight: "firman cada obra" },
};

export function Equipe({ market }: { market: Market }) {
  const copy = SECTION_COPY[market];
  const roleLabel = ROLE_LABEL[market];
  const title = TITLE[market];

  return (
    <section id="equipe" className="relative bg-paper py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          as="h1"
          index="01"
          eyebrow={copy.eyebrow}
          title={
            <>
              {title.pre}{" "}
              <span className="text-brand-600">{title.highlight}</span>.
            </>
          }
          description={copy.description}
        />

        <RevealStagger className="mt-14 grid gap-4 md:grid-cols-2" gap={0.1}>
          {FOUNDERS.map((f) => (
            <RevealItem key={f.name}>
              <article className="group flex items-center gap-5 rounded-2xl border border-hair bg-surface p-6 transition-colors duration-300 hover:border-brand-200 hover:bg-brand-50/40 md:p-7">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-lg font-semibold text-white">
                  {initials(f.name)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-lg font-semibold tracking-tight text-ink">
                      {f.name}
                    </h3>
                    <BadgeCheck className="h-4 w-4 shrink-0 text-brand-500" />
                  </div>
                  <p className="mt-0.5 text-sm text-ink-soft">{roleLabel}</p>
                  <p className="mt-1 font-mono text-xs text-ink-soft">
                    {f.crea}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update `app/[locale]/sobre/page.tsx` to pass `market`**

The file already computes `market` (used for `Navbar`/`Footer`). Change only the `<About />` line to `<About market={market} />`.

- [ ] **Step 4: Update `app/[locale]/equipe/page.tsx` to pass `market`**

Same change: `<Equipe />` → `<Equipe market={market} />`.

- [ ] **Step 5: Remove the now-dead `PILLARS` export from `lib/content.ts`**

Run `grep -rn "PILLARS" --include="*.ts" --include="*.tsx" .` (excluding `node_modules`) first to confirm `About.tsx` (now self-contained, per Step 1) was its only consumer. Then delete the `export const PILLARS = [...]` block (lines 14–30 in the current file) from `lib/content.ts`.

- [ ] **Step 6: Verify types and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint components/sections/About.tsx components/sections/Equipe.tsx "app/[locale]/sobre/page.tsx" "app/[locale]/equipe/page.tsx" lib/content.ts`
Expected: no errors.

- [ ] **Step 7: Verify production build and live behavior**

Run: `pnpm build && pnpm start` (use a free port if 3000 is occupied by an existing dev server).

Check in browser or via curl:
- `/br/sobre` — Portuguese copy unchanged in meaning from before this task (mission/vision/values, stats, binational sentence added to the description).
- `/py/sobre` — Spanish copy renders, stats say "en Brasil" (not implying Paraguay has that scale), description states the group operates in both countries.
- `/br/equipe` and `/py/equipe` — founder cards render with the correct-language role label; Spanish version's description mentions the Paraguay expansion.
- No console errors on either route in either market.

- [ ] **Step 8: Commit**

```bash
git add components/sections/About.tsx components/sections/Equipe.tsx "app/[locale]/sobre/page.tsx" "app/[locale]/equipe/page.tsx" lib/content.ts
git commit -m "$(cat <<'EOF'
Make About and Equipe market-aware (Spanish for /py)

Fase 5: /py/sobre and /py/equipe previously rendered hardcoded
Portuguese regardless of market. Both components now take a required
market prop with a local Record<Market, ...> copy object, matching
the pattern already used by Navbar/Footer/Portfolio. Both markets'
copy now explicitly states the group operates in Brazil and Paraguay,
per the site owner's requirement. Removed the now-dead PILLARS export
from lib/content.ts (inlined into About.tsx, its only consumer).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: New "Aviso legal" page

**Files:**
- Create: `app/[locale]/aviso-legal/page.tsx`
- Modify: `components/sections/Footer.tsx`

**Interfaces:**
- Consumes: `MARKETS` from `@/lib/group/markets` (existing, `legalEntity` field unused until now), `Market` from `@/lib/group/market`.
- No new exports other tasks depend on — this is a leaf page.

- [ ] **Step 1: Create `app/[locale]/aviso-legal/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { MARKETS } from "@/lib/group/markets";
import type { Market } from "@/lib/group/market";

const COPY: Record<
  Market,
  {
    eyebrow: string;
    title: string;
    entityLabel: string;
    taxIdPlaceholder: string;
    addressLabel: string;
    phoneLabel: string;
  }
> = {
  br: {
    eyebrow: "Informações legais",
    title: "Aviso legal",
    entityLabel: "Razão social",
    taxIdPlaceholder: "a confirmar",
    addressLabel: "Endereço",
    phoneLabel: "Telefone",
  },
  py: {
    eyebrow: "Información legal",
    title: "Aviso legal",
    entityLabel: "Razón social",
    taxIdPlaceholder: "a confirmar",
    addressLabel: "Dirección",
    phoneLabel: "Teléfono",
  },
};

export const metadata: Metadata = {
  title: "Aviso legal",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AvisoLegalPage({ params }: Props) {
  const { locale } = await params;
  const market = locale as Market;
  const copy = COPY[market];
  const entity = MARKETS[market].legalEntity;

  return (
    <>
      <Navbar market={market} />
      <main className="pt-[70px]">
        <section className="container-x py-24 md:py-32">
          <p className="hud text-brand-600">{copy.eyebrow}</p>
          <h1 className="display mt-4 text-3xl md:text-5xl">{copy.title}</h1>

          <dl className="mt-10 max-w-xl divide-y divide-hair rounded-2xl border border-hair bg-surface">
            <div className="flex flex-col gap-1 p-6">
              <dt className="text-xs uppercase tracking-wide text-ink-soft">
                {copy.entityLabel}
              </dt>
              <dd className="text-ink">{entity.name}</dd>
            </div>
            <div className="flex flex-col gap-1 p-6">
              <dt className="text-xs uppercase tracking-wide text-ink-soft">
                {entity.taxIdLabel}
              </dt>
              <dd className="text-ink">{entity.taxId ?? copy.taxIdPlaceholder}</dd>
            </div>
            <div className="flex flex-col gap-1 p-6">
              <dt className="text-xs uppercase tracking-wide text-ink-soft">
                {copy.addressLabel}
              </dt>
              <dd className="text-ink">{entity.address}</dd>
            </div>
            <div className="flex flex-col gap-1 p-6">
              <dt className="text-xs uppercase tracking-wide text-ink-soft">
                {copy.phoneLabel}
              </dt>
              <dd className="text-ink">{entity.phone}</dd>
            </div>
          </dl>
        </section>
      </main>
      <Footer market={market} />
    </>
  );
}
```

This route is intentionally NOT a business unit: no `layout.tsx`, no `assertUnitActive` call, no folder-level guard. It must render on both `/br/aviso-legal` and `/py/aviso-legal` unconditionally, each showing only its own market's `legalEntity` (never both on the same page — there is no code path here that could mix them, since `entity` is looked up once from `MARKETS[market]`).

- [ ] **Step 2: Add a footer link to the new page**

In `components/sections/Footer.tsx`, find this block (the copyright row near the end of the component):

```tsx
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
          <p className="text-xs text-white/55">
            © {year} Grupo Centra. {copy.rightsReserved}
          </p>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            {copy.tagline}
          </p>
        </div>
```

Replace it with:

```tsx
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p className="text-xs text-white/55">
              © {year} Grupo Centra. {copy.rightsReserved}
            </p>
            <Link
              href="/aviso-legal"
              className="text-xs text-white/55 underline-offset-2 transition-colors hover:text-white hover:underline"
            >
              Aviso legal
            </Link>
          </div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            {copy.tagline}
          </p>
        </div>
```

("Aviso legal" is valid, natural phrasing in both Portuguese and Spanish — no per-market copy needed for this one label. `Link` is already imported in this file from `@/i18n/navigation`, so it will correctly get the `/br` or `/py` prefix depending on which market's footer is rendering.)

- [ ] **Step 3: Verify types and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint "app/[locale]/aviso-legal/page.tsx" components/sections/Footer.tsx`
Expected: no errors.

- [ ] **Step 4: Verify production build and live behavior**

Run: `pnpm build && pnpm start` (reuse or restart the server from Task 1's verification; use a free port if 3000 is occupied).

Check:
- `/br/aviso-legal` renders: entity name "Centra Engenharia e Empreendimentos Ltda.", "CNPJ" label with "a confirmar" (not the literal word "null"), the placeholder address, the placeholder phone.
- `/py/aviso-legal` renders: entity name "Centra Paraguay S.A.", "RUC" label with "a confirmar", the placeholder address, the placeholder phone.
- Footer on any page (e.g. `/br/construcao`, `/py/construcao`) now shows a working "Aviso legal" link that navigates to the correctly-prefixed `/br/aviso-legal` or `/py/aviso-legal`.
- No console errors on either route in either market.

- [ ] **Step 5: Commit**

```bash
git add "app/[locale]/aviso-legal/page.tsx" components/sections/Footer.tsx
git commit -m "$(cat <<'EOF'
Add aviso-legal page, consuming MARKETS[market].legalEntity

Fase 5: the 6th and last new PY-market page. Not a business unit —
no assertUnitActive guard, exists identically under /br and /py,
each rendering only its own market's legal entity data (CNPJ for
BR, RUC for PY, per the project's rule against ever mixing the two).
taxId is still an unconfirmed placeholder for both markets, rendered
as "a confirmar" rather than a raw null. Footer now links to it.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
