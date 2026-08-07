# Group Data Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce the `lib/group/` data layer — the typed model for "grupo com N unidades de negócio, cada uma presente em M mercados" — that every later phase of the Grupo Centra architecture plan (business-unit routes, country selector, unified portfolio, legal footer) reads from. This is "Fase 1" of `~/.claude/plans/qual-a-melhor-elegant-zephyr.md`.

**Architecture:** Four small, focused files: `types.ts` (shapes), `units.ts` (the 4 business unit IDs, market-agnostic), `markets.ts` (per-market config: legal entity, active units, contact — the single source of truth for "which unit exists in which market"), `guard.ts` (one function, `assertUnitActive`, that later route `layout.tsx` files call to 404 an inactive unit). No routes or components change in this phase — this is pure data/type scaffolding, unconsumed until Fase 2+.

**Tech Stack:** TypeScript (no new runtime dependency). Builds on `lib/group/market.ts` (`Market`/`Language` types) already created in the prior "Fase 0" phase (commit `ac16b79`).

## Global Constraints

- `Market` and `Language` types already exist at `lib/group/market.ts` (from Fase 0) — import them, do not redefine.
- Business unit IDs, exactly these 4 strings: `"construcao" | "pre-moldados" | "metalurgica" | "guindastes"`.
- `MARKETS.br.activeUnits` must include all 4 units; `MARKETS.py.activeUnits` must include only `"construcao"` — this is the single source of truth later phases (routing guards, nav) read from. No unit-existence logic anywhere else.
- Legal entity data (CNPJ for BR, RUC for PY) does not exist yet — both markets' `legalEntity` fields are explicit, clearly-marked placeholders (the site owner confirmed earlier this is expected and consistent with how other placeholder data — e.g. the contact phone number — already works in this project). Do not invent a real-looking CNPJ or RUC number; use an unambiguous placeholder string.
- Do not touch `lib/content.ts`, `lib/portfolio-data.ts`, `components/sections/*`, or any `app/` route — this phase is additive-only, nothing existing is wired to this new module yet.
- No test framework exists in this repo. Verification is `pnpm exec tsc --noEmit`, `pnpm exec eslint <changed files>`, `pnpm build` — no test files to write.
- Work directly on `main`, commit locally, do NOT push to origin.

---

### Task 1: `lib/group/` types, units, markets, and the active-unit guard

**Files:**
- Create: `lib/group/types.ts`
- Create: `lib/group/units.ts`
- Create: `lib/group/markets.ts`
- Create: `lib/group/guard.ts`

**Interfaces:**
- Produces: `BusinessUnitId` type, `LegalEntity` interface, `MarketConfig` interface (`lib/group/types.ts`) — every later phase that needs a business unit ID or market config type imports from here.
- Produces: `BUSINESS_UNITS: Record<BusinessUnitId, { icon: string }>` (`lib/group/units.ts`) — later phases (nav, unit landing cards) read the icon per unit.
- Produces: `MARKETS: Record<Market, MarketConfig>` (`lib/group/markets.ts`) — the single source of truth for active units, legal entity, and contact per market.
- Produces: `assertUnitActive(market: Market, unit: BusinessUnitId): void` (`lib/group/guard.ts`) — later phases' unit `layout.tsx` files call this once per subtree.
- Consumes: `Market`, `Language` from `@/lib/group/market` (already exists, Fase 0).

- [ ] **Step 1: Create `lib/group/types.ts`**

```ts
import type { Market } from "./market";

export type BusinessUnitId =
  | "construcao"
  | "pre-moldados"
  | "metalurgica"
  | "guindastes";

export interface LegalEntity {
  name: string;
  taxIdLabel: "CNPJ" | "RUC";
  taxId: string;
  address: string;
  phone: string;
}

export interface MarketConfig {
  market: Market;
  legalEntity: LegalEntity;
  activeUnits: readonly BusinessUnitId[];
  contact: { phone: string; email: string };
}
```

- [ ] **Step 2: Create `lib/group/units.ts`**

```ts
import type { BusinessUnitId } from "./types";

export const BUSINESS_UNITS: Record<BusinessUnitId, { icon: string }> = {
  construcao: { icon: "Building2" },
  "pre-moldados": { icon: "Boxes" },
  metalurgica: { icon: "Frame" },
  guindastes: { icon: "Construction" },
};
```

(Icon names match `lucide-react` icons already used for the same concepts in `lib/content.ts`'s `SOLUTIONS` — `Building2` for construção civil, `Boxes` for pré-moldados, `Frame` for estruturas metálicas, `Construction` for guindastes.)

- [ ] **Step 3: Create `lib/group/markets.ts`**

```ts
import type { MarketConfig } from "./types";

export const MARKETS: Record<"br" | "py", MarketConfig> = {
  br: {
    market: "br",
    legalEntity: {
      name: "Centra Engenharia e Empreendimentos Ltda.",
      taxIdLabel: "CNPJ",
      taxId: "00.000.000/0001-00", // placeholder — CNPJ real ainda não informado
      address: "Endereço a confirmar — Paraná, Brasil", // placeholder
      phone: "+55 (45) 0000-0000", // placeholder, mesmo valor já usado em Contato.tsx
    },
    activeUnits: ["construcao", "pre-moldados", "metalurgica", "guindastes"],
    contact: {
      phone: "+55 (45) 0000-0000",
      email: "contato@centraengenharia.com.br",
    },
  },
  py: {
    market: "py",
    legalEntity: {
      name: "Centra Paraguay S.A.", // placeholder — razão social real ainda não informada
      taxIdLabel: "RUC",
      taxId: "00000000-0", // placeholder — RUC real ainda não informado
      address: "Dirección a confirmar — Paraguay", // placeholder
      phone: "+595 (00) 000-0000", // placeholder
    },
    activeUnits: ["construcao"],
    contact: {
      phone: "+595 (00) 000-0000",
      email: "contacto@centra.com", // placeholder — domínio final ainda não decidido
    },
  },
};
```

- [ ] **Step 4: Create `lib/group/guard.ts`**

```ts
import { notFound } from "next/navigation";
import type { Market } from "./market";
import type { BusinessUnitId } from "./types";
import { MARKETS } from "./markets";

export function assertUnitActive(market: Market, unit: BusinessUnitId): void {
  if (!MARKETS[market].activeUnits.includes(unit)) {
    notFound();
  }
}
```

- [ ] **Step 5: Verify types and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint lib/group/types.ts lib/group/units.ts lib/group/markets.ts lib/group/guard.ts`
Expected: no errors.

- [ ] **Step 6: Verify nothing else changed behavior**

Run: `pnpm build`
Expected: build succeeds, route list identical to before this task (these are new, unimported files — nothing in the app consumes them yet, so there must be zero runtime/route difference). Confirm by comparing the build's route list output to the previous build.

- [ ] **Step 7: Commit**

```bash
git add lib/group/types.ts lib/group/units.ts lib/group/markets.ts lib/group/guard.ts
git commit -m "$(cat <<'EOF'
Add group data layer: business units, markets, active-unit guard

Fase 1 of the Grupo Centra architecture: lib/group/{types,units,markets,guard}.ts
model "N business units × M markets" with MARKETS.*.activeUnits as the
single source of truth for which unit exists in which market. Not yet
consumed by any route — that starts in the next phase.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
