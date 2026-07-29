import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { NAV_LINKS, SECTORS } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-clip border-t border-white/10 bg-ink-950">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/55">
              Engenharia e construção de alto desempenho para os setores
              industrial, agroindustrial e comercial.
            </p>
            <a
              href="#contato"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-300 transition-colors hover:text-brand-200"
            >
              Fale com a Centra →
            </a>
          </div>

          <div>
            <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/55">
              Navegação
            </h3>
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
          </div>

          <div>
            <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/55">
              Setores
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
            © {year} Centra Engenharia e Empreendimentos. Todos os direitos
            reservados.
          </p>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            Construindo o Sul do Brasil
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
