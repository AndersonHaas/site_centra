# GA4 Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fase 7 of `~/.claude/plans/qual-a-melhor-elegant-zephyr.md` — wire Google Analytics 4 into the site via `@next/third-parties`, and set a `market` user property (`br` / `py`) so GA4 can segment Brazil from Paraguay by a real dimension rather than by fragile URL-path regex.

**Architecture:** One env var (`NEXT_PUBLIC_GA_ID`) read in one place (`lib/analytics.ts`). Both root layouts render `<GoogleAnalytics>` only when that var is set. Inside the `[locale]` tree — the only place a market is known — a tiny client component additionally sets the `market` user property once gtag is available. The country selector at `/` gets the tag but no market property, because at that point the visitor has not chosen a market yet.

**Tech Stack:** Next.js 16 (App Router), `@next/third-parties` (new dependency).

## Global Constraints

- **There is no real GA4 Measurement ID yet.** The site owner has not provided one. Do NOT invent, guess, or hardcode an ID (not even a plausible-looking `G-XXXXXXXXXX`) — this project has repeatedly had to remove placeholder data that read as real. The code must ship inert: when `NEXT_PUBLIC_GA_ID` is unset, **no** analytics script may appear in the HTML at all.
- `NEXT_PUBLIC_*` env vars are inlined at build time, not read at runtime — so enabling analytics later requires setting the var in Vercel and redeploying. Say so in `.env.example` so nobody expects a runtime toggle.
- Do not add a consent banner, cookie manager, or any other analytics-adjacent feature. Not requested, not in scope.
- Do not change any page's rendered content. The only output change is the presence (or deliberate absence) of the GA script tags.
- No test framework exists in this repo. Verification is `pnpm exec tsc --noEmit`, `pnpm exec eslint <changed files>`, and a **production** build check (`pnpm build && pnpm start`) — this project has a documented history of bugs that only reproduce in production.
- **Port 3000 holds a long-running dev server that is not yours — never kill it.** It shares `.next` with the repo, so build in an APFS-cloned copy of the repo under the scratchpad (`cp -c -R`) as previous phases did, and serve on a free port (e.g. 3141). Shut down only your own server.
- Never commit a real or dummy `.env` file — `.gitignore` already covers `.env*`. Only `.env.example` (which is tracked) gains a new line.
- Work directly on `main`, commit locally, do NOT push to origin.

---

### Task 1: GA4 tag + market user property

**Files:**
- Modify: `package.json` (+ lockfile) — add `@next/third-parties`
- Create: `lib/analytics.ts`
- Create: `components/analytics/MarketUserProperty.tsx`
- Modify: `app/[locale]/layout.tsx`
- Modify: `app/(selector)/layout.tsx`
- Modify: `.env.example`

**Interfaces:**
- Produces: `GA_ID: string | undefined` (`lib/analytics.ts`) — the single place the env var is read.
- Produces: `MarketUserProperty({ market })` client component.
- Consumes: `Market` from `@/lib/group/market`; `GoogleAnalytics` from `@next/third-parties/google`.

- [ ] **Step 1: Install the dependency**

Run: `pnpm add @next/third-parties@16.2.9`

`@next/third-parties` versions track Next.js's own (`next` is pinned at `16.2.9` in `package.json`). If that exact version does not exist on the registry, run `pnpm add @next/third-parties` instead to take the latest, and note in your report which version actually got installed and why.

Confirm afterwards that `pnpm install` is clean and the lockfile updated.

- [ ] **Step 2: Create `lib/analytics.ts`**

```ts
/* ID de medição do GA4.

   Ainda não existe um ID real — o dono do site não forneceu. Enquanto
   NEXT_PUBLIC_GA_ID não estiver definido, nenhum script de analytics é
   renderizado (ver os dois root layouts). Nada de ID placeholder aqui:
   um G-XXXXXXXXXX inventado passaria por dado real.

   Atenção: variáveis NEXT_PUBLIC_* são embutidas no build, não lidas em
   tempo de execução. Definir a variável na Vercel exige um novo deploy
   para ter efeito. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
```

- [ ] **Step 3: Create `components/analytics/MarketUserProperty.tsx`**

```tsx
"use client";

import { useEffect } from "react";
import type { Market } from "@/lib/group/market";

type GtagWindow = Window & {
  gtag?: (command: string, ...args: unknown[]) => void;
};

/* Define o mercado (br/py) como user property do GA4.

   Segmentar Brasil × Paraguai por user property é mais robusto do que
   depender de regex de path do lado do GA4: o dado viaja junto do evento,
   sobrevive a mudanças de URL e funciona em relatórios que não expõem o
   caminho da página. Só existe dentro da árvore [locale] — em "/" (o
   seletor de país) o visitante ainda não escolheu mercado nenhum. */
export function MarketUserProperty({ market }: { market: Market }) {
  useEffect(() => {
    const w = window as GtagWindow;
    w.gtag?.("set", "user_properties", { market });
  }, [market]);

  return null;
}
```

- [ ] **Step 4: Wire it into `app/[locale]/layout.tsx`**

Add these imports alongside the file's existing ones:

```ts
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA_ID } from "@/lib/analytics";
import { MarketUserProperty } from "@/components/analytics/MarketUserProperty";
```

In the default export's returned JSX, inside `<body>`, after the existing `<NextIntlClientProvider>…</NextIntlClientProvider>` element (as a sibling, still inside `<body>`), add:

```tsx
        {GA_ID && (
          <>
            <GoogleAnalytics gaId={GA_ID} />
            <MarketUserProperty market={locale} />
          </>
        )}
```

`locale` at that point in the component is already narrowed to a valid locale by the `hasLocale(routing.locales, locale)` check above it, so it satisfies `Market` without a cast. If TypeScript disagrees, do NOT add an `as Market` cast to silence it — report it instead, because that narrowing is a guarantee earlier phases deliberately established.

Change nothing else in this file — in particular leave `generateStaticParams`, `dynamicParams`, `generateMetadata`, `viewport`, and the `hasLocale`/`notFound`/`setRequestLocale`/`getMessages` calls exactly as they are.

- [ ] **Step 5: Wire it into `app/(selector)/layout.tsx`**

Add imports:

```ts
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA_ID } from "@/lib/analytics";
```

and inside `<body>`, after `{children}`:

```tsx
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
```

No `MarketUserProperty` here — deliberately. `/` is the country selector; the visitor has not chosen a market yet, so there is no honest value to set.

- [ ] **Step 6: Document the variable in `.env.example`**

Append to the file:

```
# GA4 — ID de medição (formato G-XXXXXXXXXX). Enquanto estiver vazio,
# nenhum script de analytics é carregado. É NEXT_PUBLIC_*, ou seja,
# embutido no build: definir na Vercel exige um novo deploy para valer.
NEXT_PUBLIC_GA_ID=
```

- [ ] **Step 7: Verify types and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint lib/analytics.ts components/analytics/MarketUserProperty.tsx "app/[locale]/layout.tsx" "app/(selector)/layout.tsx"`
Expected: no errors.

- [ ] **Step 8: Verify the DISABLED state (the state this actually ships in)**

With no `NEXT_PUBLIC_GA_ID` set anywhere, run `pnpm build && pnpm start -p 3141` (in the APFS clone).

Confirm on `/`, `/br`, `/py`, `/br/construcao` and `/py/obras`:
- the HTML contains **no** `googletagmanager.com` reference, no `gtag`, and no `dataLayer` — grep the raw HTML for each of those three strings and expect zero hits on every page;
- pages render normally and the browser console is clean.

This is the state the site ships in today, so it is the more important of the two checks.

- [ ] **Step 9: Verify the ENABLED state with a throwaway ID**

Rebuild in the clone with a dummy value supplied inline, e.g.:

`NEXT_PUBLIC_GA_ID=G-TEST12345 pnpm build && pnpm start -p 3141`

Confirm:
- `/br`, `/py` and `/` now include the `googletagmanager.com/gtag/js?id=G-TEST12345` script;
- `/br` and `/py` also include the `MarketUserProperty` client component's effect — verify functionally in the browser: load `/py`, then evaluate `window.dataLayer` in the console and confirm a `set`/`user_properties` entry carrying `market: "py"` is present (and `"br"` on `/br`);
- `/` includes the gtag script but does NOT set a market user property.

**This dummy ID must never leave your build environment** — do not write it into `.env`, `.env.example`, any committed file, or the commit itself. Discard the clone afterwards.

- [ ] **Step 10: Commit**

```bash
git add package.json pnpm-lock.yaml lib/analytics.ts components/analytics/MarketUserProperty.tsx "app/[locale]/layout.tsx" "app/(selector)/layout.tsx" .env.example
git commit -m "$(cat <<'EOF'
Add GA4 scaffolding with market user property

Fase 7: <GoogleAnalytics> from @next/third-parties in both root layouts,
plus a client component that sets the market (br/py) as a GA4 user
property inside the [locale] tree — segmenting Brazil from Paraguay by a
real dimension instead of by URL-path regex. The country selector at "/"
gets the tag but no market property: no market has been chosen yet.

Ships inert on purpose: there is no real Measurement ID yet, and with
NEXT_PUBLIC_GA_ID unset no analytics script is emitted at all. No
placeholder ID was invented.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
