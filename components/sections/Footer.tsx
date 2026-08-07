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
