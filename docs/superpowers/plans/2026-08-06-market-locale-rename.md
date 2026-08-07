# Market Locale Rename Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the site's i18n locale codes from language codes (`pt`/`es`) to market codes (`br`/`py`), and route all internal navigation links through next-intl's locale-aware `Link` so they carry the correct `/br` or `/py` prefix instead of relying on the proxy's redirect. This is "Fase 0" of the Grupo Centra multi-unit, multi-country architecture plan (`~/.claude/plans/qual-a-melhor-elegant-zephyr.md`) — the foundational rename everything else builds on.

**Architecture:** The next-intl `locale` now represents *market* (`"br" | "py"`), not language — a new `lib/group/market.ts` module separates the two concepts (`Market` vs `Language`) so a future bilingual `/py` doesn't require reworking the translation layer. `i18n/routing.ts`/`i18n/request.ts`/`app/[locale]/layout.tsx` are updated to use the new codes; `Navbar.tsx`/`Footer.tsx` swap `next/link` for `next-intl/navigation`'s `Link` so hrefs are locale-prefixed automatically.

**Tech Stack:** Next.js 16 (App Router, Turbopack), next-intl v4.13.5 (already installed), pnpm.

## Global Constraints

- Locale codes change from `["pt", "es"]` to `["br", "py"]`; `defaultLocale` changes from `"pt"` to `"br"`. `localePrefix: "always"` is unchanged.
- `Market` (`"br" | "py"`) and `Language` (`"pt" | "es"`) are separate types from the start, even though they map 1:1 today (`br→pt`, `py→es`) — this is deliberate, not incidental, per the approved architecture plan.
- Message files stay named by **language** (`messages/pt.json`, `messages/es.json`) — do NOT rename them to `br.json`/`py.json`. Messages are a language-scoped resource reused across markets; market-scoped data (legal entity, active business units, contact info) is a separate concern for a later phase (`lib/group/markets.ts`, not part of this plan).
- Do not touch `lib/content.ts`, `lib/portfolio-data.ts`, `scripts/sync-portfolio.py`, or any `components/sections/*` file other than `Navbar.tsx`/`Footer.tsx` — everything else is out of scope for this plan (deferred to later phases of the architecture plan).
- **Known, pre-existing, intentionally-unfixed issue — do not attempt to fix it, and do not treat it as a regression caused by this plan:** hash-anchor links like `/#obras` (used in `NAV_LINKS`) do not smooth-scroll to their target section when clicked from a different page, because Next.js App Router doesn't auto-scroll to an arbitrary `id` on a fresh route navigation, and a prior fix attempt for this was explicitly reverted earlier in this project by the site owner's request after it caused a worse regression. Task 2 in this plan changes how these links get their `href` prefixed (locale-aware), NOT their scroll behavior — verify the link navigates to the correct `/br/...`/`/py/...` URL, but do not chase or attempt to fix the lack of smooth-scroll on arrival. If you see it, note it in your report as "pre-existing, out of scope" and move on.
- No test framework exists in this repo. Verification is `pnpm exec tsc --noEmit`, `pnpm exec eslint <changed files>`, `pnpm build`, and live browser checks — no automated test files to write.
- Work directly on `main` (the site owner has explicitly confirmed working directly on main for this project, no worktree needed).

---

### Task 1: Rename locale codes `pt`/`es` → `br`/`py`

**Files:**
- Create: `lib/group/market.ts`
- Modify: `i18n/routing.ts`
- Modify: `i18n/request.ts`
- Modify: `app/[locale]/layout.tsx`

**Interfaces:**
- Produces: `Market` type (`"br" | "py"`), `Language` type (`"pt" | "es"`), `MARKET_LANGUAGE: Record<Market, Language>`, `HTML_LANG: Record<Market, string>`, `OG_LOCALE: Record<Market, string>` — all exported from `lib/group/market.ts`. Task 2 and all future phases of the architecture plan import `Market` from here.
- Produces: `routing.locales` now `["br", "py"]`, `routing.defaultLocale` now `"br"` (same export names/shape as before, only values change) — Task 2 depends on this.

- [ ] **Step 1: Create `lib/group/market.ts`**

```ts
export type Market = "br" | "py";
export type Language = "pt" | "es";

export const MARKET_LANGUAGE: Record<Market, Language> = {
  br: "pt",
  py: "es",
};

export const HTML_LANG: Record<Market, string> = {
  br: "pt-BR",
  py: "es-419",
};

export const OG_LOCALE: Record<Market, string> = {
  br: "pt_BR",
  py: "es_419",
};
```

`OG_LOCALE` is not consumed yet in this plan (the `openGraph.locale` field in `app/[locale]/layout.tsx` lives in a static `metadata` export, not a per-request `generateMetadata` — converting it to be dynamic is out of scope here, deferred to the SEO phase of the architecture plan). It's defined now because it belongs conceptually with `HTML_LANG` and costs nothing to add.

- [ ] **Step 2: Modify `i18n/routing.ts`**

Replace the full file content:

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["br", "py"],
  defaultLocale: "br",
  localePrefix: "always",
});
```

- [ ] **Step 3: Modify `i18n/request.ts`**

Replace the full file content:

```ts
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { MARKET_LANGUAGE, type Market } from "@/lib/group/market";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const language = MARKET_LANGUAGE[locale as Market];

  return {
    locale,
    messages: (await import(`../messages/${language}.json`)).default,
  };
});
```

- [ ] **Step 4: Modify `app/[locale]/layout.tsx`**

Two targeted changes to the existing file (do not rewrite the whole file — only these two spots):

1. Add the import (alongside the existing `routing` import):
```ts
import { HTML_LANG, type Market } from "@/lib/group/market";
```

2. Replace this line:
```ts
      lang={locale === "es" ? "es-419" : "pt-BR"}
```
with:
```ts
      lang={HTML_LANG[locale as Market]}
```

3. Replace the `metadataBase` line:
```ts
  metadataBase: new URL("https://centraengenharia.com.br"),
```
with:
```ts
  metadataBase: new URL("https://site-centra-ultimo.vercel.app"),
```
(This points at the site's actual current live URL instead of a `.com.br` domain that was never live. It will change again when the real `.com` domain is decided, at the domain-cutover phase of the architecture plan — not a final value, just no longer pointing at a domain nobody owns.)

- [ ] **Step 5: Verify types and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint lib/group/market.ts i18n/routing.ts i18n/request.ts "app/[locale]/layout.tsx"`
Expected: no errors.

- [ ] **Step 6: Verify production build**

Run: `pnpm build`
Expected: build succeeds, route list shows `/br` and `/py` variants (not `/pt`/`/es`).

- [ ] **Step 7: Live browser verification**

Start the dev server and check:
- `/` redirects to `/br` (not `/pt`).
- `/br`, `/br/sobre`, `/br/solucoes`, `/br/obras`, `/br/equipe` all render, content identical to before this change.
- `/py` and its sub-routes also render (still showing the same Portuguese content as `/br` — that's expected, string extraction for real Spanish content is a separate future phase, not part of this plan).
- `/pt` and `/es` (the old codes) now return a 404 — this is correct, confirms the rename took effect everywhere including the proxy.
- `<html lang="...">` is `pt-BR` on `/br/*` and `es-419` on `/py/*` (check via browser dev tools or view-source).
- No console errors.

- [ ] **Step 8: Commit**

```bash
git add lib/group/market.ts i18n/routing.ts i18n/request.ts "app/[locale]/layout.tsx"
git commit -m "$(cat <<'EOF'
Rename i18n locale codes from pt/es to br/py

Fase 0 of the Grupo Centra architecture: the locale now represents
market (br/py), not language (pt/es) — lib/group/market.ts separates
the two concepts so a future bilingual /py doesn't require reworking
the translation layer. Message files stay named by language.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Route internal navigation through next-intl's locale-aware `Link`

**Files:**
- Create: `i18n/navigation.ts`
- Modify: `components/sections/Navbar.tsx`
- Modify: `components/sections/Footer.tsx`

**Interfaces:**
- Consumes: `routing` from `i18n/routing.ts` (Task 1's renamed `["br", "py"]` locales — this task must run after Task 1, since testing correct href prefixes depends on the renamed codes).
- Produces: `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname`, all exported from `i18n/navigation.ts` — future phases of the architecture plan (SEO phase's `generateMetadata`/`alternates`, and any new page needing locale-aware navigation) import from here instead of `next/link`/`next/navigation`.

- [ ] **Step 1: Create `i18n/navigation.ts`**

```ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

- [ ] **Step 2: Modify `components/sections/Navbar.tsx`**

Replace this import line:
```ts
import Link from "next/link";
```
with:
```ts
import { Link } from "@/i18n/navigation";
```

No other changes needed in this file — every existing `<Link href={...}>` usage (logo, desktop nav items, CTA, mobile nav items, mobile CTA) is already compatible with next-intl's `Link` (same props shape, same ref-forwarding to the underlying `<a>`).

- [ ] **Step 3: Modify `components/sections/Footer.tsx`**

1. Add the import (alongside the existing `Logo`/`Reveal` imports):
```ts
import { Link } from "@/i18n/navigation";
```

2. Replace the NAV_LINKS rendering block — currently:
```tsx
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
```
becomes:
```tsx
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
```

Do **not** change the `"Fale com a Centra →"` link (`<a href="#contato">`, no leading slash) — it's a same-page hash anchor, not cross-page navigation, and doesn't need locale prefixing. Leave it as a plain `<a>`.

- [ ] **Step 4: Verify types and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint components/sections/Navbar.tsx components/sections/Footer.tsx i18n/navigation.ts`
Expected: no errors.

- [ ] **Step 5: Verify production build**

Run: `pnpm build`
Expected: build succeeds, no new warnings.

- [ ] **Step 6: Live browser verification**

On both `/br` and `/py`:
- Every Navbar link (desktop and mobile menu) navigates to the correctly locale-prefixed URL — e.g. from `/br`, clicking "Soluções" goes to `/br/solucoes`, not `/solucoes` (which would 404 or trigger a redirect round-trip). From `/py`, the same click goes to `/py/solucoes`.
- Footer nav links behave the same way.
- The Navbar/Footer CTA "Fale com a Centra" (`/#contato`) still navigates to the home page correctly prefixed (`/br/#contato` or `/py/#contato`) — remember the Global Constraints note: it navigating correctly is what matters here; smooth-scroll-on-arrival is a known pre-existing issue, not something to fix or flag as new.
- No console errors, no new redirect round-trips visible in the Network tab when clicking internal links (this is the actual improvement this task delivers — confirm it, don't just assume).

- [ ] **Step 7: Commit**

```bash
git add i18n/navigation.ts components/sections/Navbar.tsx components/sections/Footer.tsx
git commit -m "$(cat <<'EOF'
Route internal nav links through next-intl locale-aware Link

Navbar and Footer previously used next/link with unprefixed hrefs,
so every internal click went through an extra proxy redirect to add
the locale prefix. Both now use next-intl's Link (i18n/navigation.ts),
which prefixes hrefs directly.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
