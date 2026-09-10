import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

/* Chamado pelo DashboardCentra depois de qualquer escrita no módulo Marketing
   (criar/editar obra, publicar/despublicar, mexer em fotos) — expira a tag
   "portfolio" (ver lib/portfolio.ts) NA HORA, pra quem recarregar
   /[locale]/portfolio já ver a mudança, sem esperar a janela normal de 1h.

   { expire: 0 }, não "max": o dashboard é exatamente o "sistema externo que
   precisa de expiração imediata" que a doc do revalidateTag descreve — "max"
   é stale-while-revalidate (mostra o cache velho e só atualiza em segundo
   plano na visita SEGUINTE), o que não atende "a pessoa atualizar a página
   já tem que ver a foto nova". */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  revalidateTag("portfolio", { expire: 0 });
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
