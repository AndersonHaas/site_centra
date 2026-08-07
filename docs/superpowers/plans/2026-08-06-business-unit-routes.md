# Business Unit Routes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the site from "one company page" into "group landing + per-business-unit pages", matching the site owner's URL spec (`/br/`, `/br/construcao`, `/br/pre-moldados`, etc.). This is "Fase 4" of `~/.claude/plans/qual-a-melhor-elegant-zephyr.md`.

**Architecture:** The current home page (`app/[locale]/page.tsx` — Hero/Obras/Clientes/Contato, all construction-specific) moves to `app/[locale]/construcao/page.tsx`, gaining a guard layout. A new, lightweight `app/[locale]/page.tsx` becomes the group landing page — brief intro + cards linking to whichever business units are active in that market (`MARKETS[market].activeUnits`, from Fase 1's data layer). `Navbar`/`Footer` stop importing a static `NAV_LINKS` and instead take a `market` prop, building their link list from the same `activeUnits` source via a new `lib/group/nav.ts` helper — this is what keeps `/py`'s nav from ever showing a unit that doesn't exist there. `/solucoes` is retired (its 6 services now map to unit pages + construcao's "diferenciais") via a redirect to `/construcao`. A new `app/[locale]/not-found.tsx` gives 404s (both explicit, from `assertUnitActive`, and organic, from routes that don't exist yet) a branded page instead of Next's unstyled default.

Two tasks: Task 1 is the restructuring core — it must land as one unit, because moving the home page content away from `/` breaks the *old* nav's hash-links (`/#obras`, `/#clientes`) the moment it lands, so the nav rewrite has to ship in the same commit. Task 2 adds the 3 new unit pages (pré-moldados, metalúrgica, guindastes) — safely separable, because Task 1's `not-found.tsx` means linking to a unit page that doesn't exist yet degrades gracefully (branded 404) rather than breaking.

**Tech Stack:** Next.js 16 (App Router), next-intl, TypeScript. No new dependency.

## Global Constraints

- Business unit IDs and their per-market labels: `construcao` → "Construção" (br) / "Construcción" (py); `pre-moldados` → "Pré-moldados" (br) / "Prefabricados" (py, not used yet since `py.activeUnits` doesn't include it); `metalurgica` → "Metalúrgica" (br); `guindastes` → "Guindastes" (br) / "Grúas" (py, not used yet).
- Nav links, in order: business units from `MARKETS[market].activeUnits` (in the order they appear in that array), then a static "A Centra"/"Nosotros" → `/sobre`, then "Equipe"/"Equipo" → `/equipe`.
- The primary CTA ("Fale com a Centra" / "Hable con Centra") must point to `/construcao#contato`, not `/#contato` — the contact section now lives on the construcao page, not the group landing.
- Do not display any placeholder legal entity name (`MARKETS[market].legalEntity.name`) on a public page — those values are unconfirmed placeholders (per Fase 1's review). The footer copyright line stays generic ("Grupo Centra"), not a specific unconfirmed legal name.
- `SECTORS` (from `lib/content.ts`) stays as-is in the Footer — orthogonal to this restructuring, not to be touched.
- `NAV_LINKS` in `lib/content.ts` is retired in this phase (nothing should import it after Task 1) — remove the export, don't leave dead code.
- The group landing page's and unit stub pages' copy must describe only already-established facts (the 4 units, the BR/PY market split already encoded in `lib/group/markets.ts`) — no invented numbers or claims.
- Do not touch `components/sections/Obras.tsx`, `components/sections/Portfolio.tsx`, `app/[locale]/obras/page.tsx`'s `Portfolio` usage (Fase 3's work), or `app/api/contato/route.ts`.
- No test framework. Verification is `pnpm exec tsc --noEmit`, `pnpm exec eslint <changed files>`, `pnpm build`, live browser checks.
- Work directly on `main`, commit locally, do NOT push to origin.
- The exact API shape of next-intl's `redirect` (used for the `/solucoes` retirement) should be verified against the installed package (`node_modules/next-intl`) before use — if it differs from what's shown in Task 1 Step 9, adapt to match the installed version; the intent (a locale-aware redirect to `/construcao`) is what must be preserved.

---

### Task 1: Restructure home into group landing + `/construcao`, make nav market-aware

**Files:**
- Modify: `lib/group/units.ts`
- Create: `lib/group/nav.ts`
- Modify: `lib/content.ts`
- Modify: `components/sections/Navbar.tsx`
- Modify: `components/sections/Footer.tsx`
- Move: `app/[locale]/page.tsx` → `app/[locale]/construcao/page.tsx`
- Create: `app/[locale]/construcao/layout.tsx`
- Create: `app/[locale]/page.tsx` (new group landing, replaces the moved file)
- Create: `app/[locale]/not-found.tsx`
- Modify: `app/[locale]/sobre/page.tsx`
- Modify: `app/[locale]/equipe/page.tsx`
- Modify: `app/[locale]/obras/page.tsx`
- Modify: `app/[locale]/solucoes/page.tsx` (becomes a redirect)

**Interfaces:**
- Consumes: `Market` from `@/lib/group/market`, `MARKETS` from `@/lib/group/markets`, `assertUnitActive` from `@/lib/group/guard` (all existing, Fase 1).
- Produces: `getNavLinks(market: Market): Array<{label: string; href: string}>` from `lib/group/nav.ts` — Task 2's unit pages don't need this, but any future page adding its own nav-adjacent UI should use it instead of hand-rolling a link list.
- Produces: `Navbar` and `Footer` now both require a `market: Market` prop — every page that renders them must pass it. Task 2's new pages must follow this same pattern.

- [ ] **Step 1: Extend `lib/group/units.ts` with per-market labels**

Replace the full file content:

```ts
import type { BusinessUnitId } from "./types";
import type { Market } from "./market";

export const BUSINESS_UNITS: Record<
  BusinessUnitId,
  { icon: string; label: Record<Market, string> }
> = {
  construcao: {
    icon: "Building2",
    label: { br: "Construção", py: "Construcción" },
  },
  "pre-moldados": {
    icon: "Boxes",
    label: { br: "Pré-moldados", py: "Prefabricados" },
  },
  metalurgica: {
    icon: "Frame",
    label: { br: "Metalúrgica", py: "Metalúrgica" },
  },
  guindastes: {
    icon: "Construction",
    label: { br: "Guindastes", py: "Grúas" },
  },
};
```

- [ ] **Step 2: Create `lib/group/nav.ts`**

```ts
import type { Market } from "./market";
import { MARKETS } from "./markets";
import { BUSINESS_UNITS } from "./units";

export function getNavLinks(market: Market): Array<{ label: string; href: string }> {
  const unitLinks = MARKETS[market].activeUnits.map((unit) => ({
    label: BUSINESS_UNITS[unit].label[market],
    href: `/${unit}`,
  }));

  return [
    ...unitLinks,
    { label: market === "py" ? "Nosotros" : "A Centra", href: "/sobre" },
    { label: market === "py" ? "Equipo" : "Equipe", href: "/equipe" },
  ];
}
```

- [ ] **Step 3: Remove `NAV_LINKS` from `lib/content.ts`**

Delete this block (it's replaced by `getNavLinks`):
```ts
export const NAV_LINKS = [
  { label: "Obras", href: "/#obras" },
  { label: "Clientes", href: "/#clientes" },
  { label: "Soluções", href: "/solucoes" },
  { label: "A Centra", href: "/sobre" },
  { label: "Equipe", href: "/equipe" },
];
```
Leave every other export in `lib/content.ts` untouched.

- [ ] **Step 4: Replace `components/sections/Navbar.tsx`**

Full new content:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/ui/Logo";
import { Magnetic } from "@/components/ui/Magnetic";
import { getNavLinks } from "@/lib/group/nav";
import type { Market } from "@/lib/group/market";

const COPY: Record<
  Market,
  { cta: string; openMenu: string; closeMenu: string; logoLabel: string }
> = {
  br: {
    cta: "Fale com a Centra",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    logoLabel: "Centra — início",
  },
  py: {
    cta: "Hable con Centra",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    logoLabel: "Centra — inicio",
  },
};

export function Navbar({ market }: { market: Market }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const navLinks = getNavLinks(market);
  const copy = COPY[market];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      firstLinkRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="border-b border-white/10 bg-ink-950/95 backdrop-blur-xl">
        <nav className="container-x flex h-[70px] items-center justify-between">
          <Link href="/" aria-label={copy.logoLabel}>
            <Logo priority />
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group relative text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  {l.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-brand-400 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <Magnetic>
              <Link href="/construcao#contato" className="btn-primary">
                {copy.cta}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Magnetic>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 text-white lg:hidden"
            aria-label={open ? copy.closeMenu : copy.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-white/10 bg-ink-950/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="container-x flex flex-col gap-1 py-6">
              {navLinks.map((l, i) => (
                <li key={l.href}>
                  <Link
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-lg font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="mt-3 px-3">
                <Link
                  href="/construcao#contato"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  {copy.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
```

- [ ] **Step 5: Replace `components/sections/Footer.tsx`**

Full new content:

```tsx
import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { Link } from "@/i18n/navigation";
import { SECTORS } from "@/lib/content";
import { getNavLinks } from "@/lib/group/nav";
import type { Market } from "@/lib/group/market";

const COPY: Record<
  Market,
  {
    description: string;
    navTitle: string;
    sectorsTitle: string;
    cta: string;
    tagline: string;
    rightsReserved: string;
  }
> = {
  br: {
    description:
      "Engenharia e construção de alto desempenho para os setores industrial, agroindustrial e comercial.",
    navTitle: "Navegação",
    sectorsTitle: "Setores",
    cta: "Fale com a Centra →",
    tagline: "Grupo Centra — Brasil e Paraguai",
    rightsReserved: "Todos os direitos reservados.",
  },
  py: {
    description:
      "Ingeniería y construcción de alto desempeño para los sectores industrial, agroindustrial y comercial.",
    navTitle: "Navegación",
    sectorsTitle: "Sectores",
    cta: "Hable con Centra →",
    tagline: "Grupo Centra — Brasil y Paraguay",
    rightsReserved: "Todos los derechos reservados.",
  },
};

export function Footer({ market }: { market: Market }) {
  const year = new Date().getFullYear();
  const copy = COPY[market];
  const navLinks = getNavLinks(market);

  return (
    <footer className="relative overflow-clip border-t border-white/10 bg-ink-950">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/55">
              {copy.description}
            </p>
            <Link
              href="/construcao#contato"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-300 transition-colors hover:text-brand-200"
            >
              {copy.cta}
            </Link>
          </div>

          <div>
            <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/55">
              {copy.navTitle}
            </h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((l) => (
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
          </div>

          <div>
            <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/55">
              {copy.sectorsTitle}
            </h3>
            <ul className="mt-5 space-y-3">
              {SECTORS.map((s) => (
                <li key={s} className="text-sm text-white/65">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
          <p className="text-xs text-white/55">
            © {year} Grupo Centra. {copy.rightsReserved}
          </p>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            {copy.tagline}
          </p>
        </div>
      </div>

      {/* Wordmark gigante em contorno — assinatura de rodapé */}
      <Reveal y={60} className="pointer-events-none select-none">
        <p
          aria-hidden="true"
          className="text-stroke-white -mb-[0.24em] text-center font-sans text-[17.5vw] font-bold leading-none tracking-tight opacity-25"
        >
          CENTRA
        </p>
      </Reveal>
    </footer>
  );
}
```

Note the copyright line intentionally says "Grupo Centra" — not a specific legal entity name — because `MARKETS[market].legalEntity.name` is still an unconfirmed placeholder (per Fase 1's review); do not substitute it in here.

- [ ] **Step 6: Move the home page to `/construcao`, add its guard layout**

```bash
mkdir -p "app/[locale]/construcao"
git mv "app/[locale]/page.tsx" "app/[locale]/construcao/page.tsx"
```

Read the moved file's current content — it's unchanged from before (`Navbar`, `Hero`, `TrustBar`, `Obras`, `Credenciais`, `Fundacao`, `Stats`, `Clientes`, `Contato`, `Footer`) — and make ONLY this edit: it currently calls `<Navbar />` and `<Footer />` with no props. Add `params` to the page function and pass `market` to both. The file becomes:

```tsx
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Obras } from "@/components/sections/Obras";
import { Credenciais } from "@/components/sections/Credenciais";
import { Fundacao } from "@/components/sections/Fundacao";
import { Stats } from "@/components/sections/Stats";
import { Clientes } from "@/components/sections/Clientes";
import { Contato } from "@/components/sections/Contato";
import { Footer } from "@/components/sections/Footer";
import type { Market } from "@/lib/group/market";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ConstrucaoPage({ params }: Props) {
  const { locale } = await params;
  const market = locale as Market;

  return (
    <>
      <Navbar market={market} />
      <main>
        <Hero />
        <TrustBar />
        <Obras />
        <Credenciais />
        <Fundacao />
        <Stats />
        <Clientes />
        <Contato />
      </main>
      <Footer market={market} />
    </>
  );
}
```

Create `app/[locale]/construcao/layout.tsx`:

```tsx
import { assertUnitActive } from "@/lib/group/guard";
import type { Market } from "@/lib/group/market";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function ConstrucaoLayout({ children, params }: Props) {
  const { locale } = await params;
  assertUnitActive(locale as Market, "construcao");
  return children;
}
```

- [ ] **Step 7: Create the new group landing page at `app/[locale]/page.tsx`**

```tsx
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { MARKETS } from "@/lib/group/markets";
import { BUSINESS_UNITS } from "@/lib/group/units";
import type { Market } from "@/lib/group/market";

const COPY: Record<Market, { eyebrow: string; title: string; description: string; cta: string }> = {
  br: {
    eyebrow: "Grupo Centra",
    title: "Engenharia e indústria de alto desempenho.",
    description:
      "Construção civil, pré-moldados e artefatos de cimento, estruturas metálicas e locação de guindastes — conheça as unidades do grupo.",
    cta: "Conhecer",
  },
  py: {
    eyebrow: "Grupo Centra",
    title: "Ingeniería y construcción de alto desempeño.",
    description:
      "Construcción civil del Grupo Centra en Paraguay, con el respaldo de la experiencia del grupo en Brasil.",
    cta: "Conocer",
  },
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GroupLandingPage({ params }: Props) {
  const { locale } = await params;
  const market = locale as Market;
  const copy = COPY[market];
  const units = MARKETS[market].activeUnits;

  return (
    <>
      <Navbar market={market} />
      <main className="pt-[70px]">
        <section className="bg-ink-950 px-6 py-24 text-center text-white md:py-32">
          <p className="hud text-brand-300">{copy.eyebrow}</p>
          <h1 className="display mt-4 text-4xl md:text-6xl">{copy.title}</h1>
          <p className="mx-auto mt-6 max-w-xl text-white/70">{copy.description}</p>
        </section>
        <section className="container-x grid gap-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {units.map((unit) => (
            <Link
              key={unit}
              href={`/${unit}`}
              className="group flex flex-col justify-between rounded-2xl border border-hair bg-surface p-6 transition-colors hover:border-brand-200"
            >
              <span className="text-lg font-semibold text-ink">
                {BUSINESS_UNITS[unit].label[market]}
              </span>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-600">
                {copy.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </section>
      </main>
      <Footer market={market} />
    </>
  );
}
```

- [ ] **Step 8: Create `app/[locale]/not-found.tsx`**

Bilingual and neutral — it can't reliably know which locale triggered it (Next.js `not-found.tsx` files don't receive route `params`), so it says both:

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950 px-6 text-center text-white">
      <p className="hud text-brand-300">404</p>
      <h1 className="display text-2xl md:text-3xl">
        Página não encontrada / Página no encontrada
      </h1>
      <Link href="/" className="btn-ghost">
        Voltar / Volver
      </Link>
    </main>
  );
}
```

This plain `next/link` to `/` is intentional — `/` is the country selector (Fase 2), outside the `[locale]` tree, so it must NOT go through the locale-prefixing `Link` from `@/i18n/navigation` (which would try to prefix it into `/br/` or `/py/`, defeating the point of sending a lost visitor back to the selector).

- [ ] **Step 9: Retire `/solucoes` as a redirect to `/construcao`**

Replace the full content of `app/[locale]/solucoes/page.tsx`:

```tsx
import { redirect } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SolucoesRedirect({ params }: Props) {
  const { locale } = await params;
  redirect({ href: "/construcao", locale: locale as "br" | "py" });
}
```

**Before using this, check `node_modules/next-intl`'s actual `redirect` signature from `createNavigation`** (it's re-exported via `i18n/navigation.ts`, created in an earlier phase) — if the installed version's API differs (e.g. different argument shape), adapt this to match; the goal is simply "visiting `/br/solucoes` or `/py/solucoes` redirects to `/br/construcao` or `/py/construcao` respectively."

- [ ] **Step 10: Pass `market` to `Navbar`/`Footer` in the remaining existing pages**

`app/[locale]/sobre/page.tsx` — currently:
```tsx
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { About } from "@/components/sections/About";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "A Centra",
  description:
    "Conheça a Centra Engenharia — missão, visão, valores e a equipe que transforma projetos em empreendimentos de alto desempenho.",
};

export default function SobrePage() {
  return (
    <>
      <Navbar />
      <main className="pt-[70px]">
        <About />
      </main>
      <Footer />
    </>
  );
}
```
Replace with:
```tsx
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { About } from "@/components/sections/About";
import { Footer } from "@/components/sections/Footer";
import type { Market } from "@/lib/group/market";

export const metadata: Metadata = {
  title: "A Centra",
  description:
    "Conheça a Centra Engenharia — missão, visão, valores e a equipe que transforma projetos em empreendimentos de alto desempenho.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SobrePage({ params }: Props) {
  const { locale } = await params;
  const market = locale as Market;

  return (
    <>
      <Navbar market={market} />
      <main className="pt-[70px]">
        <About />
      </main>
      <Footer market={market} />
    </>
  );
}
```

`app/[locale]/equipe/page.tsx` — apply the exact same transformation (same shape: `Navbar`/`Equipe`/`Footer`, add `Props`/`params`/`market` the same way, replacing the bare `<Navbar />`/`<Footer />` with `<Navbar market={market} />`/`<Footer market={market} />`). Keep its existing `metadata` export unchanged.

`app/[locale]/obras/page.tsx` — this file already has `params`/`locale`/`market` from Fase 3 (it computes `const market = locale as Market;` and passes it to `Portfolio`). Just add `market={market}` to its existing `<Navbar />` and `<Footer />` calls — do not change anything else in this file.

- [ ] **Step 11: Verify types and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors. (This will catch any page that still calls `<Navbar />`/`<Footer />` without the now-required `market` prop — if it does, you missed a spot; find it and fix it.)

Run: `pnpm exec eslint lib/group/units.ts lib/group/nav.ts lib/content.ts components/sections/Navbar.tsx components/sections/Footer.tsx "app/[locale]/construcao/page.tsx" "app/[locale]/construcao/layout.tsx" "app/[locale]/page.tsx" "app/[locale]/not-found.tsx" "app/[locale]/solucoes/page.tsx" "app/[locale]/sobre/page.tsx" "app/[locale]/equipe/page.tsx" "app/[locale]/obras/page.tsx"`
Expected: no errors.

- [ ] **Step 12: Verify production build**

Run: `pnpm build`
Expected: build succeeds. Route list should show `/[locale]` (now the group landing), `/[locale]/construcao`, `/[locale]/sobre`, `/[locale]/equipe`, `/[locale]/obras`, `/[locale]/solucoes` (redirect).

- [ ] **Step 13: Live browser verification**

On `/br`:
- Renders the NEW group landing page (short intro + 4 unit cards: Construção, Pré-moldados, Metalúrgica, Guindastes).
- Clicking "Construção" goes to `/br/construcao` and renders what used to be the full home page (Hero through Contato).
- Clicking the other 3 cards shows the branded 404 page (`not-found.tsx`) — expected, their pages don't exist until Task 2.
- Navbar (both desktop and mobile) shows: Construção, Pré-moldados, Metalúrgica, Guindastes, A Centra, Equipe. The CTA "Fale com a Centra" goes to `/br/construcao#contato` and actually scrolls to the contact section once there.
- Footer nav list matches the Navbar's.
- `/br/solucoes` redirects to `/br/construcao`.
- `/br/sobre`, `/br/equipe`, `/br/obras` all still render correctly with a working Navbar/Footer.
- `/br/does-not-exist` shows the branded 404, not Next's default.

On `/py`:
- Group landing renders with Spanish copy, only ONE unit card: Construcción.
- Clicking it goes to `/py/construcao`.
- Navbar shows: Construcción, Nosotros, Equipo. CTA says "Hable con Centra", goes to `/py/construcao#contato`.
- `/py/pre-moldados` (or any other non-active unit) shows the branded 404 — this is correct per the site owner's explicit rule (never show a business unit that doesn't operate in that market yet).

No console errors anywhere.

- [ ] **Step 14: Commit**

```bash
git add lib/group/units.ts lib/group/nav.ts lib/content.ts components/sections/Navbar.tsx components/sections/Footer.tsx "app/[locale]/construcao/page.tsx" "app/[locale]/construcao/layout.tsx" "app/[locale]/page.tsx" "app/[locale]/not-found.tsx" "app/[locale]/solucoes/page.tsx" "app/[locale]/sobre/page.tsx" "app/[locale]/equipe/page.tsx" "app/[locale]/obras/page.tsx"
git commit -m "$(cat <<'EOF'
Restructure home into group landing + /construcao unit page

Fase 4 of the Grupo Centra architecture. The former home page (Hero
through Contato — all construction-specific) moves to /construcao,
gated by assertUnitActive. / becomes a lightweight group landing
listing whichever business units are active in that market. Navbar
and Footer no longer import a static NAV_LINKS — they take a market
prop and build their link list from MARKETS[market].activeUnits, so
/py's nav can never show a unit that doesn't operate there. /solucoes
redirects to /construcao. A new not-found.tsx gives 404s (including
unit pages not yet built) a branded page instead of Next's default.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: The 3 remaining BR business unit pages

**Files:**
- Create: `app/[locale]/pre-moldados/layout.tsx`
- Create: `app/[locale]/pre-moldados/page.tsx`
- Create: `app/[locale]/metalurgica/layout.tsx`
- Create: `app/[locale]/metalurgica/page.tsx`
- Create: `app/[locale]/guindastes/layout.tsx`
- Create: `app/[locale]/guindastes/page.tsx`

**Interfaces:**
- Consumes: `assertUnitActive` from `@/lib/group/guard`, `BUSINESS_UNITS` from `@/lib/group/units`, `Market` from `@/lib/group/market`, `Navbar`/`Footer` (both requiring `market` prop, from Task 1).
- Produces: nothing new — these are leaf pages.

**IMPORTANT — content boundary:** these 3 units (pré-moldados/artefatos de cimento, estruturas metálicas, locação de guindastes) have NO real technical content in this project yet: no product catalog, no PDF fichas técnicas, no DWG/BIM files, no crane load/reach capacity tables, no fabrication capacity figures. **Do not invent any of this.** Every one of these is a real, safety-relevant or legally-relevant technical claim about a real construction company — a fabricated crane capacity table or a made-up fabrication throughput number is actively harmful, not a harmless placeholder. Each page below is a real, complete, professionally-designed page — just with an explicit, honest "conteúdo em atualização" state instead of fabricated specifics, in the same spirit as the phone-number placeholder already used elsewhere in this project.

- [ ] **Step 1: Create `app/[locale]/pre-moldados/layout.tsx`**

```tsx
import { assertUnitActive } from "@/lib/group/guard";
import type { Market } from "@/lib/group/market";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PreMoldadosLayout({ children, params }: Props) {
  const { locale } = await params;
  assertUnitActive(locale as Market, "pre-moldados");
  return children;
}
```

- [ ] **Step 2: Create `app/[locale]/pre-moldados/page.tsx`**

```tsx
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { BUSINESS_UNITS } from "@/lib/group/units";
import type { Market } from "@/lib/group/market";

const COPY: Record<Market, { eyebrow: string; description: string; catalogNote: string; contactCta: string }> = {
  br: {
    eyebrow: "Unidade de negócio",
    description:
      "Indústria de pré-moldados e artefatos de cimento do Grupo Centra: produção de elementos que aceleram prazos de obra sem abrir mão da qualidade.",
    catalogNote:
      "Catálogo técnico, fichas técnicas em PDF e arquivos para projeto (DWG/BIM) por produto — em atualização. Fale com nosso time comercial para especificações e prazos.",
    contactCta: "Falar com o time comercial",
  },
  py: {
    eyebrow: "Unidad de negocio",
    description:
      "Industria de prefabricados y artefactos de cemento del Grupo Centra.",
    catalogNote: "Contenido en actualización.",
    contactCta: "Hablar con el equipo comercial",
  },
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PreMoldadosPage({ params }: Props) {
  const { locale } = await params;
  const market = locale as Market;
  const copy = COPY[market];

  return (
    <>
      <Navbar market={market} />
      <main className="pt-[70px]">
        <section className="container-x py-24 md:py-32">
          <p className="hud text-brand-600">{copy.eyebrow}</p>
          <h1 className="display mt-4 text-3xl md:text-5xl">
            {BUSINESS_UNITS["pre-moldados"].label[market]}
          </h1>
          <p className="mt-6 max-w-2xl text-ink-soft">{copy.description}</p>
          <div className="mt-10 rounded-2xl border border-hair bg-surface p-6">
            <p className="text-sm text-ink-soft">{copy.catalogNote}</p>
            <a href="#contato" className="btn-primary mt-6 inline-flex">
              {copy.contactCta}
            </a>
          </div>
        </section>
      </main>
      <Footer market={market} />
    </>
  );
}
```

Note: the `<a href="#contato">` here is a plain same-page anchor because this page has no `#contato` section of its own yet — clicking it currently does nothing useful (no target on the page). This is intentional and acceptable for this phase: leave it as a plain anchor pointing at a same-page id that will exist once this unit gets a real contact section in a later content pass. Do not link it to `/construcao#contato` (that would send a pré-moldados inquiry to the construction unit's contact form, which is wrong).

- [ ] **Step 3: Create `app/[locale]/metalurgica/layout.tsx`**

Same shape as Step 1, with `"metalurgica"` instead of `"pre-moldados"`:

```tsx
import { assertUnitActive } from "@/lib/group/guard";
import type { Market } from "@/lib/group/market";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function MetalurgicaLayout({ children, params }: Props) {
  const { locale } = await params;
  assertUnitActive(locale as Market, "metalurgica");
  return children;
}
```

- [ ] **Step 4: Create `app/[locale]/metalurgica/page.tsx`**

Same shape as Step 2's page, with `"metalurgica"` and this copy:

```tsx
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { BUSINESS_UNITS } from "@/lib/group/units";
import type { Market } from "@/lib/group/market";

const COPY: Record<Market, { eyebrow: string; description: string; catalogNote: string; contactCta: string }> = {
  br: {
    eyebrow: "Unidade de negócio",
    description:
      "Metalúrgica do Grupo Centra: fabricação e montagem de estruturas metálicas de alto desempenho.",
    catalogNote:
      "Catálogo de linha de produto e capacidade fabril — em atualização. Fale com nosso time comercial para especificações e prazos.",
    contactCta: "Falar com o time comercial",
  },
  py: {
    eyebrow: "Unidad de negocio",
    description: "Metalúrgica del Grupo Centra.",
    catalogNote: "Contenido en actualización.",
    contactCta: "Hablar con el equipo comercial",
  },
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function MetalurgicaPage({ params }: Props) {
  const { locale } = await params;
  const market = locale as Market;
  const copy = COPY[market];

  return (
    <>
      <Navbar market={market} />
      <main className="pt-[70px]">
        <section className="container-x py-24 md:py-32">
          <p className="hud text-brand-600">{copy.eyebrow}</p>
          <h1 className="display mt-4 text-3xl md:text-5xl">
            {BUSINESS_UNITS.metalurgica.label[market]}
          </h1>
          <p className="mt-6 max-w-2xl text-ink-soft">{copy.description}</p>
          <div className="mt-10 rounded-2xl border border-hair bg-surface p-6">
            <p className="text-sm text-ink-soft">{copy.catalogNote}</p>
            <a href="#contato" className="btn-primary mt-6 inline-flex">
              {copy.contactCta}
            </a>
          </div>
        </section>
      </main>
      <Footer market={market} />
    </>
  );
}
```

- [ ] **Step 5: Create `app/[locale]/guindastes/layout.tsx`**

Same shape as Step 1/3, with `"guindastes"`:

```tsx
import { assertUnitActive } from "@/lib/group/guard";
import type { Market } from "@/lib/group/market";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function GuindastesLayout({ children, params }: Props) {
  const { locale } = await params;
  assertUnitActive(locale as Market, "guindastes");
  return children;
}
```

- [ ] **Step 6: Create `app/[locale]/guindastes/page.tsx`**

Same shape, with this copy (note: NO capacity/reach table — that's the specific "do not invent" case called out above):

```tsx
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { BUSINESS_UNITS } from "@/lib/group/units";
import type { Market } from "@/lib/group/market";

const COPY: Record<Market, { eyebrow: string; description: string; catalogNote: string; contactCta: string }> = {
  br: {
    eyebrow: "Unidade de negócio",
    description:
      "Locação de guindastes do Grupo Centra: frota e equipamentos para movimentação de cargas em obras de grande porte.",
    catalogNote:
      "Tabela de alcance e carga por equipamento, e páginas por base regional — em atualização. Fale com nosso time comercial para orçamento.",
    contactCta: "Solicitar orçamento",
  },
  py: {
    eyebrow: "Unidad de negocio",
    description: "Locación de grúas del Grupo Centra.",
    catalogNote: "Contenido en actualización.",
    contactCta: "Solicitar presupuesto",
  },
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GuindastesPage({ params }: Props) {
  const { locale } = await params;
  const market = locale as Market;
  const copy = COPY[market];

  return (
    <>
      <Navbar market={market} />
      <main className="pt-[70px]">
        <section className="container-x py-24 md:py-32">
          <p className="hud text-brand-600">{copy.eyebrow}</p>
          <h1 className="display mt-4 text-3xl md:text-5xl">
            {BUSINESS_UNITS.guindastes.label[market]}
          </h1>
          <p className="mt-6 max-w-2xl text-ink-soft">{copy.description}</p>
          <div className="mt-10 rounded-2xl border border-hair bg-surface p-6">
            <p className="text-sm text-ink-soft">{copy.catalogNote}</p>
            <a href="#contato" className="btn-primary mt-6 inline-flex">
              {copy.contactCta}
            </a>
          </div>
        </section>
      </main>
      <Footer market={market} />
    </>
  );
}
```

- [ ] **Step 7: Verify types and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint "app/[locale]/pre-moldados/layout.tsx" "app/[locale]/pre-moldados/page.tsx" "app/[locale]/metalurgica/layout.tsx" "app/[locale]/metalurgica/page.tsx" "app/[locale]/guindastes/layout.tsx" "app/[locale]/guindastes/page.tsx"`
Expected: no errors.

- [ ] **Step 8: Verify production build**

Run: `pnpm build`
Expected: build succeeds, all 3 new routes present under both `/br/*` and `/py/*` in the route table (they exist as files under `app/[locale]/`, reachable at both prefixes — the guard is what actually blocks `/py/pre-moldados` etc. at request time, not the route table).

- [ ] **Step 9: Live browser verification**

- `/br/pre-moldados`, `/br/metalurgica`, `/br/guindastes` all render (previously showed the branded 404 from Task 1 — now real pages).
- The group landing (`/br`) cards for these 3 units now go to real pages instead of 404s.
- `/py/pre-moldados`, `/py/metalurgica`, `/py/guindastes` still correctly show the branded 404 (guard still blocks them — `py.activeUnits` is still `["construcao"]` only).
- No console errors.

- [ ] **Step 10: Commit**

```bash
git add "app/[locale]/pre-moldados" "app/[locale]/metalurgica" "app/[locale]/guindastes"
git commit -m "$(cat <<'EOF'
Add pré-moldados, metalúrgica, guindastes unit pages (BR only)

Fase 4 continued. All 3 pages are real and complete but honestly
placeholder on technical specifics (product catalog, PDF/DWG files,
crane capacity tables) — that data doesn't exist in this project yet
and isn't safe to invent. Each links to a same-page #contato anchor
reserved for a future dedicated contact section per unit, not to
/construcao's (a pré-moldados inquiry shouldn't land on the
construction unit's contact form).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
