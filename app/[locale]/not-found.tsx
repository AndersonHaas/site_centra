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
