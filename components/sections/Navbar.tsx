"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/ui/Logo";
import { MarketSwitcher } from "@/components/ui/MarketSwitcher";
import { getContactHref, getNavLinks } from "@/lib/group/nav";
import type { Market } from "@/lib/group/market";

export function Navbar({ market }: { market: Market }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navLinks = getNavLinks();
  const contactHref = getContactHref();
  /* Sem namespace: os links trazem chaves completas (nav.*). */
  const t = useTranslations();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const toggle = toggleRef.current;
    document.body.style.overflow = "hidden";
    const background = Array.from(document.querySelectorAll<HTMLElement>("main, footer"));
    const previousInert = background.map(el => el.inert);
    background.forEach(el => { el.inert = true; });
    firstLinkRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      background.forEach((el, i) => { el.inert = previousInert[i]; });
      if (window.matchMedia("(max-width: 1023px)").matches) toggle?.focus();
    };
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const controls = Array.from(headerRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? [])
          .filter(el => el.getClientRects().length > 0);
        const first = controls[0];
        const last = controls.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first?.focus();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50" onClick={(e) => {
      if ((e.target as HTMLElement).closest("a")) setOpen(false);
    }}>
      <div className="border-b border-white/10 bg-ink-950/95 backdrop-blur-xl">
        <nav className="container-x flex h-[70px] items-center justify-between gap-2">
          <Link href="/" className="flex min-h-11 shrink-0 items-center" aria-label={t("nav.logoLabel")}>
            <Logo market={market} priority />
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group relative inline-flex min-h-11 items-center text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  {t(l.labelKey)}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-brand-400 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* O gap-4 dos dois lados do divisor (e o strength reduzido do
              magnético, que antes fazia o CTA "esticar" na direção do seletor)
              existem para separar dois alvos de clique com consequências bem
              diferentes: trocar de mercado x abrir o contato. */}
          <div className="hidden items-center gap-4 lg:flex">
            <MarketSwitcher market={market} />
            <span aria-hidden className="h-5 w-px bg-white/15" />
            <Link href={contactHref} className="btn-primary">
              {t("nav.cta")}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:hidden">
            <MarketSwitcher market={market} />
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 text-white"
              aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            data-lenis-prevent
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="max-h-[calc(100dvh-70px)] overflow-y-auto overscroll-contain border-b border-white/10 bg-ink-950/95 backdrop-blur-xl lg:hidden"
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
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
              <li className="mt-3 px-3">
                <Link
                  href={contactHref}
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  {t("nav.cta")}
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
