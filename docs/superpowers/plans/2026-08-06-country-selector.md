# Country Selector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/` a real country/language selector page (Brasil/Português vs. Paraguay/Español) instead of an automatic redirect to the detected locale. This is "Fase 2" of `~/.claude/plans/qual-a-melhor-elegant-zephyr.md`.

**Architecture:** `proxy.ts` gets a one-line bypass so it stops redirecting `/` through next-intl's locale detection. A new route group `app/(selector)/` (invisible in the URL) supplies its own root layout and page for `/` — Next.js's "multiple root layouts" pattern, the same one `app/[locale]/layout.tsx` already established in a prior phase (there's no shared `app/layout.tsx`; each top-level tree under `app/` owns its own `<html>`/`<body>`).

**Tech Stack:** Next.js 16 (App Router). No new dependency.

## Global Constraints

- `/br` and `/py` must keep working exactly as before this change — only `/` behavior changes (stops auto-redirecting, becomes a real page).
- The selector page's institutional copy must describe facts already established in this project (the group operates construction + pré-moldados + estruturas metálicas + locação de guindastes in Brazil, with the construction unit expanding into Paraguay) — do not invent new facts, numbers, or claims not already stated elsewhere in this project's content or by the site owner.
- The site's brand identity (the `Logo`/`LogoMark` component, "CENTRA" wordmark) is shared across markets for now — a possible distinct Paraguay visual identity was raised by the site owner but never resolved to a concrete decision (no new logo asset or brand data exists), so this phase reuses the existing `Logo` component unchanged. Note this openly if asked; it isn't a decision this phase makes.
- Do not touch `i18n/routing.ts`, `i18n/request.ts`, `app/[locale]/layout.tsx`, or anything under `app/[locale]/` — this phase only adds the new selector tree and the proxy bypass.
- No test framework exists in this repo. Verification is `pnpm exec tsc --noEmit`, `pnpm exec eslint <changed files>`, `pnpm build`, and live browser checks.
- Work directly on `main`, commit locally, do NOT push to origin.

---

### Task 1: `/` becomes a real country selector page

**Files:**
- Modify: `proxy.ts`
- Create: `app/(selector)/layout.tsx`
- Create: `app/(selector)/page.tsx`

**Interfaces:**
- Consumes: `Logo` from `@/components/ui/Logo` (existing, unchanged).
- No new exports other later phases depend on — this is a leaf page.

- [ ] **Step 1: Modify `proxy.ts`**

Current full content:
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

Replace the full file content with:
```ts
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }
  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

(Only change: the `NextResponse` import and the 3-line bypass at the top of `proxy`. The matcher and everything else is unchanged. Read the actual current file first to confirm it matches what's shown above before editing — if it doesn't match, stop and report rather than guessing.)

- [ ] **Step 2: Create `app/(selector)/layout.tsx`**

```tsx
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";

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
  metadataBase: new URL("https://site-centra-ultimo.vercel.app"),
  title: "Centra — Brasil e Paraguai",
};

export const viewport: Viewport = {
  themeColor: "#050b14",
  width: "device-width",
  initialScale: 1,
};

export default function SelectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt"
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
```

This duplicates the font setup from `app/[locale]/layout.tsx` rather than extracting a shared helper — two call sites, low change frequency, not worth the extra indirection (and avoids touching the already-reviewed `app/[locale]/layout.tsx` again for an unrelated change).

- [ ] **Step 3: Create `app/(selector)/page.tsx`**

```tsx
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function CountrySelectorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink-950 px-6 py-16 text-center">
      <Logo />
      <p className="mt-8 max-w-xl text-balance text-white/70">
        Engenharia e construção de alto desempenho no Brasil — construção
        civil, pré-moldados, estruturas metálicas e locação de guindastes —
        com a expansão da nossa construtora para o Paraguai.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link href="/br" className="btn-primary">
          Brasil — Português
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <Link href="/py" className="btn-ghost">
          Paraguay — Español
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
```

`btn-primary` and `btn-ghost` are existing Tailwind utility classes already used elsewhere in this project (e.g. `components/sections/Navbar.tsx`, `components/sections/Obras.tsx`) — do not redefine them, they already exist in `app/globals.css`.

- [ ] **Step 4: Verify types and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint proxy.ts "app/(selector)/layout.tsx" "app/(selector)/page.tsx"`
Expected: no errors.

- [ ] **Step 5: Verify production build**

Run: `pnpm build`
Expected: build succeeds, route list now includes `/` as its own static route alongside the existing `/br`/`/py` tree.

- [ ] **Step 6: Live browser verification**

- `/` renders the selector page directly (no redirect — check the Network tab, there should be no 307/308 on `/` anymore).
- Both buttons work: clicking "Brasil — Português" goes to `/br`, clicking "Paraguay — Español" goes to `/py`.
- `/br` and `/py` and their sub-routes still work exactly as before (unaffected by this change).
- No console errors on `/`.
- Visual check: fonts render correctly on `/` (not a system-font fallback) — confirms the duplicated font setup in the new layout is wired correctly.

- [ ] **Step 7: Commit**

```bash
git add proxy.ts "app/(selector)/layout.tsx" "app/(selector)/page.tsx"
git commit -m "$(cat <<'EOF'
Add country selector at / (Brasil/Português vs Paraguay/Español)

Fase 2 of the Grupo Centra architecture: proxy.ts stops auto-redirecting
"/" to the detected locale; a new app/(selector)/ route group (its own
root layout, Next's multiple-root-layouts pattern) renders a real
selector page there instead.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
