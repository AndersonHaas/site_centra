import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function CountrySelectorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink-950 px-6 py-16 text-center">
      <Logo priority />
      <p className="mt-8 max-w-xl text-balance text-white/70">
        Engenharia e construção de alto desempenho no Brasil — construção
        civil, pré-moldados, estruturas metálicas e locação de guindastes —
        com a expansão da nossa construtora para o Paraguai.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link href="/br" className="btn-primary">
          Brasil — Português
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/py" lang="es" className="btn-ghost">
          Paraguay — Español
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
