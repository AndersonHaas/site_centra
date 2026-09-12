import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { Link } from "@/i18n/navigation";
import { SECTORS } from "@/lib/content";
import { getContactHref, getFooterLinks } from "@/lib/group/nav";
import type { Market } from "@/lib/group/market";

export function Footer({ market }: { market: Market }) {
  const year = new Date().getFullYear();
  const navLinks = getFooterLinks(market);
  /* Sem namespace: getFooterLinks devolve chaves completas (units.*, nav.*). */
  const t = useTranslations();

  return (
    <footer className="relative overflow-clip border-t border-white/10 bg-ink-950">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo market={market} />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/55">
              {t("footer.description")}
            </p>
            <Link
              href={getContactHref()}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-300 transition-colors hover:text-brand-200"
            >
              {t("footer.cta")}
            </Link>
            <a
              href="https://www.instagram.com/centraempreendimentos/"
              target="_blank"
              rel="noreferrer"
              aria-label={t("footer.instagramLabel")}
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white/65 transition-colors hover:text-brand-300"
            >
              <InstagramIcon />
              @centraempreendimentos
            </a>
          </div>

          <div>
            <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/55">
              {t("footer.navTitle")}
            </h3>
            <ul className="mt-4">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex min-h-11 items-center text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/55">
              {t("footer.sectorsTitle")}
            </h3>
            <ul className="mt-4">
              {SECTORS.map((sector) => (
                <li key={sector} className="text-sm text-white/65">
                  {t(`sectors.${sector}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p className="text-xs text-white/55">
              © {year} Grupo Centra. {t("footer.rightsReserved")}
            </p>
            <Link
              href="/aviso-legal"
              className="inline-flex min-h-11 items-center text-xs text-white/55 underline-offset-2 transition-colors hover:text-white hover:underline"
            >
              {t("avisoLegal.linkLabel")}
            </Link>
          </div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            {t("footer.tagline")}
          </p>
        </div>
      </div>
    </footer>
  );
}
