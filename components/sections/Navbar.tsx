"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/ui/Logo";
import { Magnetic } from "@/components/ui/Magnetic";
import { MarketSwitcher } from "@/components/ui/MarketSwitcher";
import { getContactHref, getNavLinks } from "@/lib/group/nav";
import type { Market } from "@/lib/group/market";

export function Navbar({ market }: { market: Market }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const navLinks = getNavLinks();
  const contactHref = getContactHref();
  /* Sem namespace: os links trazem chaves completas (nav.*). */
  const t = useTranslations();

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
          <Link href="/" aria-label={t("nav.logoLabel")}>
            <Logo priority />
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group relative text-sm font-medium text-white/70 transition-colors hover:text-white"
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
            <Magnetic strength={0.2}>
              <Link href={contactHref} className="btn-primary">
                {t("nav.cta")}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Magnetic>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
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
