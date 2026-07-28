# Página de portfólio de obras (/obras)

## Contexto

O site já tem uma seção "Obras" na home (`components/sections/Obras.tsx`) — um
teaser cinematográfico (scroll-jacked, 1 foto por obra) com 4 obras cadastradas
em `WORKS` (`lib/content.ts`). O usuário quer uma página dedicada, tipo "folder"
de portfólio, com 2-3 fotos por obra, cobrindo **todas** as obras que ele tem
fotos — não só as 4 já usadas.

Fotos novas foram encontradas em `Fotos Marketing/` (na raiz do projeto,
irmã de `site/`), organizadas em uma pasta por obra:

- 9 pastas com prefixo `CVale -` / `CVale ` (cliente C.Vale)
- 7 pastas com prefixo `Copacol -` (cliente Copacol)
- 1 pasta `Imagens Geral Centra` — fotos institucionais soltas, **não** é uma
  obra e fica de fora do portfólio.

Total: **16 obras**. Fotos são originais de drone/celular (até 76MB por pasta,
resolução ~4000px+), precisam de otimização antes de ir pro site — mesmo
processo (`sips`) já usado nas fotos atuais.

Requisito explícito do usuário: a página precisa ser **extremamente
profissional** e **fácil de visualizar no celular**.

## Decisão: complementa a home, não substitui

- A seção `Obras` da home continua como está (teaser cinematográfico, 4 obras).
- Ganha um botão "Ver todas as obras →" que leva para `/obras`.
- O link "Obras" do `Navbar`/`NAV_LINKS` continua apontando para `/#obras`
  (teaser da home) — não é alterado. A nova página só é alcançada pelo botão
  dentro da seção.

## Dados

Novo array `PROJECTS` em `lib/content.ts`, independente do `WORKS` existente
(que continua servindo só o teaser da home — não será migrado nem removido).

```ts
export const PROJECTS = [
  {
    slug: "cvale-upd",       // kebab-case, cliente + pasta
    client: "C.Vale",        // "C.Vale" | "Copacol"
    title: "UPD",            // nome da pasta sem o prefixo do cliente
    images: ["cvale-upd-1", "cvale-upd-2", "cvale-upd-3"], // 1 a 3 chaves
  },
  // ... 16 entradas
] as const;
```

- Título = nome da pasta limpo (remove prefixo `CVale -`/`Copacol -` e
  normaliza espaçamento/hífen). Sem descrição textual por obra nesta fase —
  não inventar copy que o usuário não forneceu; ele pode complementar depois.
- Client é só `"C.Vale"` ou `"Copacol"` (usado no filtro e na tag do card).
- Ordem do array: agrupado por cliente (C.Vale primeiro, depois Copacol) e
  alfabético por título dentro de cada grupo — determinístico, sem depender
  de metadata externa que não existe (data da obra, porte, etc.).

## Pipeline de imagens

Script/processo único (rodado uma vez, não em build):

1. Para cada uma das 16 pastas em `Fotos Marketing/`, selecionar até 3 fotos:
   - Priorizar arquivos que comecem com `DJI_` (fotos aéreas — mais
     profissionais);
   - Se não houver 3 `DJI_*`, completar com as demais fotos da pasta em ordem
     alfabética até 3.
   - Pastas com 1 ou 2 fotos ficam com 1 ou 2 mesmo (não duplicar).
2. Redimensionar cada foto selecionada para no máximo 2000px no lado maior,
   reexportar como JPEG qualidade ~80 via `sips`.
3. Salvar em `site/media/works/portfolio/<slug>-<n>.jpg` (n = 1..3).
4. Essas imagens são importadas estaticamente no componente da seção (mesmo
   padrão do `Obras.tsx` atual: `import foo from "@/media/works/..."`, dict
   `slug -> StaticImageData[]`, `placeholder="blur"`).

Nota: os arquivos originais em `Fotos Marketing/` ficam fora do repo do site
(pasta irmã, não versionada); só as versões otimizadas entram em
`site/media/works/portfolio/`.

## Rota e página

`app/obras/page.tsx` — mesmo padrão de `/sobre`, `/equipe`, `/solucoes`:

```tsx
export const metadata: Metadata = {
  title: "Obras",
  description: "Portfólio completo de obras da Centra Engenharia...",
};

export default function ObrasPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[70px]">
        <Portfolio />
      </main>
      <Footer />
    </>
  );
}
```

## Componente `components/sections/Portfolio.tsx`

**Filtro de cliente** (Todas / C.Vale / Copacol):
- Pills horizontais, roláveis por scroll no mobile (sem overflow quebrando
  layout), fixas/sticky no topo da seção.
- Estado local (`useState`), filtra o array `PROJECTS` renderizado — sem
  reload nem query param (simples, client-side).

**Grid de cards**:
- 1 coluna no mobile, 2 no tablet (`md:`), 3 no desktop (`lg:`).
- Cada card = **1 foto de capa** (a primeira do array `images`, tipicamente a
  aérea) com moldura sóbria, cliente como tag (canto), título abaixo, e um
  indicador discreto "+N fotos" quando `images.length > 1`.
- Sem colagem de múltiplas fotos dentro do card — isso ficaria poluído e
  ilegível no mobile. A ideia de "2-3 fotos por obra" se resolve no lightbox,
  não no card.
- `next/image` com `sizes` calibrado por breakpoint (`(max-width: 768px) 100vw,
  (max-width: 1024px) 50vw, 33vw`) pra não baixar a imagem desktop no celular.
- Sem scroll-jacking nem animações pesadas (diferente do deck da home) —
  prioridade é carregamento rápido e leitura fácil em qualquer tela.

**Lightbox** (novo `components/ui/Lightbox.tsx`, reutilizável):
- Abre em tela cheia ao clicar no card, mostrando todas as fotos daquela obra.
- Fundo `ink-950` sólido (não translúcido) — visual editorial, não popup
  genérico.
- Navegação: swipe nativo (touch) no mobile, setas no desktop, fecha com X,
  tap fora, ou ESC.
- Obra com 1 foto só: abre sem setas/indicador de navegação.
- Focus trap básico e `aria-label` nos controles (acessibilidade mínima).

## Edge cases

- Pastas com 1 foto (ex.: "Bairro Catarinense", "São Francisco"): card e
  lightbox funcionam normalmente, sem paginação.
- Filtro "Todas" é o estado inicial.
- Reduced motion: transições do lightbox (fade simples) respeitam
  `prefers-reduced-motion` — sem exigir `framer-motion` elaborado aqui, só o
  necessário.

## Fora de escopo (pendências reais, não desta fase)

- Descrição textual por obra (setor, escopo, localização, data) — usuário
  pode complementar depois, obra por obra.
- Curadoria manual de quais fotos aparecem (a seleção automática por `DJI_`
  prefix é um ponto de partida, não a palavra final).
- Migração/unificação com o array `WORKS` do teaser da home.
