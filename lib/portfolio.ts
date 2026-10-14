import "server-only";
import type { Market } from "@/lib/group/market";

/* Portfólio lido do Supabase do DashboardCentra — Rodada 3 do módulo Marketing
   de lá. `mkt_portfolio_publico()` é uma função pública (RPC, SECURITY DEFINER)
   que devolve só as obras `publicada = true`, já ordenadas; o bucket
   `mkt-portfolio` é público, então a foto vira URL direta, sem token.

   ISR de 1h (`revalidate`): publicar/despublicar uma obra no dashboard demora
   até 1h pra refletir aqui. Revalidação sob demanda fica para depois. */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BUCKET = "mkt-portfolio";

export type PortfolioCountry = "BR" | "PY";
export type PortfolioStatus = "finalizado" | "em_andamento";

export type PortfolioCategoria = {
  slug: string;
  ordem: number;
  nome: string;
};

export type PortfolioObra = {
  slug: string;
  client: string;
  title: string;
  images: string[];
  country: PortfolioCountry;
  cidade: string;
  uf: string;
  detalhes: string | null;
  status: PortfolioStatus;
  categoria: PortfolioCategoria | null;
};

type CategoriaApi = {
  slug: string;
  ordem: number;
  nome_pt: string;
  nome_es: string;
};

type ObraApi = {
  slug: string;
  titulo: string;
  cliente: string;
  cidade: string;
  uf: string;
  pais: PortfolioCountry;
  detalhes: string | null;
  situacao: PortfolioStatus;
  ordem: number;
  fotos: string[];
  categoria: CategoriaApi | null;
};

/* `locale` escolhe o nome da categoria: no Paraguai usa `nome_es`, caindo no
   `nome_pt` enquanto a tradução não for preenchida no dashboard. */
export async function getPortfolio(locale: Market): Promise<PortfolioObra[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[portfolio] NEXT_PUBLIC_SUPABASE_URL/ANON_KEY ausentes em .env.local");
    return [];
  }

  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/mkt_portfolio_publico`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: "{}",
      next: { revalidate: 3600, tags: ["portfolio"] },
    });
  } catch (err) {
    console.error("[portfolio] Falha de rede ao buscar mkt_portfolio_publico:", err);
    return [];
  }

  if (!res.ok) {
    console.error("[portfolio] mkt_portfolio_publico respondeu", res.status, await res.text());
    return [];
  }

  const obras: ObraApi[] = await res.json();
  return obras.map((o) => ({
    slug: o.slug,
    client: o.cliente,
    title: o.titulo,
    images: o.fotos.map((path) => `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`),
    country: o.pais,
    cidade: o.cidade,
    uf: o.uf,
    detalhes: o.detalhes,
    status: o.situacao,
    categoria: o.categoria
      ? {
          slug: o.categoria.slug,
          ordem: o.categoria.ordem,
          nome: (locale === "py" && o.categoria.nome_es?.trim()) || o.categoria.nome_pt,
        }
      : null,
  }));
}

/* Clientes distintos das obras publicadas, os com mais obras primeiro (empate
   mantém a ordem do dashboard — sort é estável). Nomes vêm limpos de espaços
   para "C.Vale " e "C.Vale" não virarem dois clientes. */
export function portfolioClients(obras: PortfolioObra[]): string[] {
  const count = new Map<string, number>();
  for (const o of obras) {
    const name = o.client.trim();
    if (name) count.set(name, (count.get(name) ?? 0) + 1);
  }
  return Array.from(count.keys()).sort((a, b) => count.get(b)! - count.get(a)!);
}
