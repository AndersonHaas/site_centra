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
