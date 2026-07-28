# Página de portfólio de obras (/obras) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a página `/obras`, um portfólio completo com as 17 obras encontradas em `Fotos Marketing/` (até 3 fotos cada), com filtro por cliente, grade responsiva mobile-first e lightbox — acessível a partir de um botão "Ver todas as obras" na seção Obras da home.

**Architecture:** Fotos originais (fora do repo) são otimizadas uma única vez via script `sips` para `public/images/portfolio/`. Uma nova seção `Portfolio.tsx` lê os dados de um novo array `PROJECTS` em `lib/content.ts` (independente do `WORKS` existente, que não é tocado), renderiza uma grade filtrável e abre um componente `Lightbox` reutilizável ao clicar num card. A rota `app/obras/page.tsx` segue o mesmo padrão de `/equipe`/`/sobre`/`/solucoes`.

**Tech Stack:** Next.js 16 (App Router) + React 19 + Tailwind v4 + lucide-react. Sem framer-motion nesta feature (grade e lightbox não usam scroll-jacking nem animações elaboradas — apenas `Reveal`/`RevealStagger` já existentes para entrada suave). pnpm como gerenciador de pacotes.

## Global Constraints

- Next.js 16 / React 19 / Tailwind v4 — usar exatamente os padrões já presentes no projeto (`next/image`, `next/link`, `@/*` alias, tokens de `app/globals.css`).
- **Sem framework de testes automatizados no projeto** (confirmado: `package.json` só tem `dev`/`build`/`start`/`lint`, nenhum arquivo `*.test.*`/`*.spec.*` existe). Verificação de cada task via `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`, e checagem visual no navegador — não introduzir Jest/Vitest/Testing Library nesta feature.
- **Mobile-first e "extremamente profissional"** (requisito explícito do usuário): grade de 1 coluna no celular, sem colagens de fotos dentro do card, sem popups translúcidos, `sizes` do `next/image` calibrado por breakpoint. A Task 7 é dedicada a verificar isso.
- Não inventar descrição textual por obra — só cliente + título (nome da pasta limpo) + fotos. Sem `sector`/`scope`/`location` como em `WORKS`.
- `WORKS` e `components/sections/Obras.tsx` (teaser da home) não são alterados, exceto a adição pontual do CTA na Task 6.
- O link "Obras" do `NAV_LINKS`/`Navbar` continua apontando para `/#obras` — não mexer nele.
- Imagens do portfólio ficam em `public/images/portfolio/`, referenciadas por caminho de string (não import estático) — ver spec para a justificativa (45 imagens).
- Pasta fonte `Fotos Marketing/` fica em `/Users/andersonhaas/Desktop/Centra/Fotos Marketing` (irmã de `site/`, fora do repo) — todos os caminhos relativos no script partem do diretório `site/`.

---

### Task 1: Script de otimização das fotos + geração dos assets

**Files:**
- Create: `scripts/process-portfolio-photos.sh`
- Create (gerado pelo script, não editado manualmente): `public/images/portfolio/*.jpg` (45 arquivos)

**Interfaces:**
- Consumes: pastas de origem em `../Fotos Marketing/<pasta>` (nomes exatos abaixo).
- Produces: arquivos `public/images/portfolio/<slug>-<n>.jpg` (n = 1..3), consumidos pela Task 2 (`PROJECTS.images`, caminhos `/images/portfolio/<slug>-<n>.jpg`).

- [ ] **Step 1: Criar o script**

```bash
#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

SRC_ROOT="../Fotos Marketing"
DEST_DIR="public/images/portfolio"
mkdir -p "$DEST_DIR"

process_obra() {
  local slug="$1"
  local folder="$2"
  local src="$SRC_ROOT/$folder"

  if [ ! -d "$src" ]; then
    echo "ERRO: pasta não encontrada: $src" >&2
    exit 1
  fi

  local files=()
  while IFS= read -r f; do
    files+=("$f")
  done < <(find "$src" -maxdepth 1 -type f \( -iname "DJI_*.jpg" -o -iname "DJI_*.jpeg" \) | sort)

  while IFS= read -r f; do
    local already=0
    for existing in "${files[@]:-}"; do
      [ "$existing" = "$f" ] && already=1 && break
    done
    if [ "$already" -eq 0 ]; then
      files+=("$f")
    fi
  done < <(find "$src" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | sort)

  local n=1
  for f in "${files[@]}"; do
    if [ "$n" -gt 3 ]; then
      break
    fi
    sips -Z 2000 -s format jpeg -s formatOptions 80 "$f" --out "$DEST_DIR/${slug}-${n}.jpg" >/dev/null
    echo "  ${slug}-${n}.jpg <- $(basename "$f")"
    n=$((n + 1))
  done
}

process_obra "cvale-bairro-catarinense" "CVale - Bairro Catarinense"
process_obra "cvale-encantado" "CVale - Encantado"
process_obra "cvale-insumos-alto-piquiri" "CVale - Insumos Alto Piquiri"
process_obra "cvale-obra-285-cd" "CVale - Obra 285 - CD"
process_obra "cvale-sao-francisco" "CVale - São Francisco"
process_obra "cvale-sede-administrativa" "CVale Sede Administrativa"
process_obra "cvale-supermercado-maripa" "CVale - Supermercado Maripá"
process_obra "cvale-upd" "CVale - UPD"
process_obra "cvale-universidade" "CVale - Universidade"
process_obra "copacol-cpa" "Copacol - CPA"
process_obra "copacol-matrizeiros" "Copacol - Matrizeiros"
process_obra "copacol-obra-225-unidade-nova-aurora" "Copacol - Obra 225 - Unidade Nova Aurora"
process_obra "copacol-obra-229-unidade-penha" "Copacol - Obra 229 - Unidade Penha"
process_obra "copacol-obra-271-amidonaria" "Copacol - Obra 271 - Amidonaria"
process_obra "copacol-obra-307-urs" "Copacol - Obra 307 - URS"
process_obra "copacol-silo-jesuitas" "Copacol - Silo Jesuítas"
process_obra "copacol-upd" "Copacol - UPD"

echo "Total de imagens geradas: $(ls "$DEST_DIR" | wc -l | tr -d ' ')"
```

- [ ] **Step 2: Dar permissão de execução**

Run: `chmod +x scripts/process-portfolio-photos.sh`

- [ ] **Step 3: Rodar o script a partir da raiz do projeto (`site/`)**

Run: `./scripts/process-portfolio-photos.sh`
Expected: 17 blocos de log (um por obra, cada linha `  <slug>-<n>.jpg <- <arquivo original>`), terminando em `Total de imagens geradas: 45`.

- [ ] **Step 4: Verificar contagem e que nenhum arquivo ficou corrompido/vazio**

Run: `ls public/images/portfolio | wc -l`
Expected: `45`

Run: `find public/images/portfolio -size 0`
Expected: nenhuma saída (nenhum arquivo de 0 bytes).

- [ ] **Step 5: Commit**

```bash
git add scripts/process-portfolio-photos.sh public/images/portfolio
git commit -m "Adiciona script e assets otimizados do portfólio de obras"
```

---

### Task 2: Dados das 17 obras em `lib/content.ts`

**Files:**
- Modify: `lib/content.ts:149` (logo após o fechamento do array `WORKS`, antes de `export const SECTORS`)

**Interfaces:**
- Consumes: caminhos gerados na Task 1 (`/images/portfolio/<slug>-<n>.jpg`).
- Produces: `PROJECTS: readonly { slug: string; client: "C.Vale" | "Copacol"; title: string; images: readonly string[] }[]` e `ProjectClient = "C.Vale" | "Copacol"`, consumidos pela Task 4 (`Portfolio.tsx`).

- [ ] **Step 1: Inserir o tipo e o array `PROJECTS`**

Em `lib/content.ts`, logo depois de `] as const;` que fecha `WORKS` (linha 149) e antes de `export const SECTORS = [` (linha 151), inserir:

```ts

export type ProjectClient = "C.Vale" | "Copacol";

/* Portfólio completo — página /obras. Fotos otimizadas em
   public/images/portfolio/, geradas por scripts/process-portfolio-photos.sh
   a partir de Fotos Marketing/ (fora do repo). Sem descrição textual por
   obra nesta fase — ver
   docs/superpowers/specs/2026-07-28-portfolio-obras-design.md. */
export const PROJECTS = [
  {
    slug: "cvale-bairro-catarinense",
    client: "C.Vale",
    title: "Bairro Catarinense",
    images: ["/images/portfolio/cvale-bairro-catarinense-1.jpg"],
  },
  {
    slug: "cvale-encantado",
    client: "C.Vale",
    title: "Encantado",
    images: [
      "/images/portfolio/cvale-encantado-1.jpg",
      "/images/portfolio/cvale-encantado-2.jpg",
    ],
  },
  {
    slug: "cvale-insumos-alto-piquiri",
    client: "C.Vale",
    title: "Insumos Alto Piquiri",
    images: [
      "/images/portfolio/cvale-insumos-alto-piquiri-1.jpg",
      "/images/portfolio/cvale-insumos-alto-piquiri-2.jpg",
      "/images/portfolio/cvale-insumos-alto-piquiri-3.jpg",
    ],
  },
  {
    slug: "cvale-obra-285-cd",
    client: "C.Vale",
    title: "Obra 285 - CD",
    images: [
      "/images/portfolio/cvale-obra-285-cd-1.jpg",
      "/images/portfolio/cvale-obra-285-cd-2.jpg",
      "/images/portfolio/cvale-obra-285-cd-3.jpg",
    ],
  },
  {
    slug: "cvale-sao-francisco",
    client: "C.Vale",
    title: "São Francisco",
    images: ["/images/portfolio/cvale-sao-francisco-1.jpg"],
  },
  {
    slug: "cvale-sede-administrativa",
    client: "C.Vale",
    title: "Sede Administrativa",
    images: [
      "/images/portfolio/cvale-sede-administrativa-1.jpg",
      "/images/portfolio/cvale-sede-administrativa-2.jpg",
      "/images/portfolio/cvale-sede-administrativa-3.jpg",
    ],
  },
  {
    slug: "cvale-supermercado-maripa",
    client: "C.Vale",
    title: "Supermercado Maripá",
    images: [
      "/images/portfolio/cvale-supermercado-maripa-1.jpg",
      "/images/portfolio/cvale-supermercado-maripa-2.jpg",
      "/images/portfolio/cvale-supermercado-maripa-3.jpg",
    ],
  },
  {
    slug: "cvale-upd",
    client: "C.Vale",
    title: "UPD",
    images: [
      "/images/portfolio/cvale-upd-1.jpg",
      "/images/portfolio/cvale-upd-2.jpg",
      "/images/portfolio/cvale-upd-3.jpg",
    ],
  },
  {
    slug: "cvale-universidade",
    client: "C.Vale",
    title: "Universidade",
    images: [
      "/images/portfolio/cvale-universidade-1.jpg",
      "/images/portfolio/cvale-universidade-2.jpg",
    ],
  },
  {
    slug: "copacol-cpa",
    client: "Copacol",
    title: "CPA",
    images: [
      "/images/portfolio/copacol-cpa-1.jpg",
      "/images/portfolio/copacol-cpa-2.jpg",
      "/images/portfolio/copacol-cpa-3.jpg",
    ],
  },
  {
    slug: "copacol-matrizeiros",
    client: "Copacol",
    title: "Matrizeiros",
    images: [
      "/images/portfolio/copacol-matrizeiros-1.jpg",
      "/images/portfolio/copacol-matrizeiros-2.jpg",
      "/images/portfolio/copacol-matrizeiros-3.jpg",
    ],
  },
  {
    slug: "copacol-obra-225-unidade-nova-aurora",
    client: "Copacol",
    title: "Obra 225 - Unidade Nova Aurora",
    images: [
      "/images/portfolio/copacol-obra-225-unidade-nova-aurora-1.jpg",
      "/images/portfolio/copacol-obra-225-unidade-nova-aurora-2.jpg",
      "/images/portfolio/copacol-obra-225-unidade-nova-aurora-3.jpg",
    ],
  },
  {
    slug: "copacol-obra-229-unidade-penha",
    client: "Copacol",
    title: "Obra 229 - Unidade Penha",
    images: [
      "/images/portfolio/copacol-obra-229-unidade-penha-1.jpg",
      "/images/portfolio/copacol-obra-229-unidade-penha-2.jpg",
      "/images/portfolio/copacol-obra-229-unidade-penha-3.jpg",
    ],
  },
  {
    slug: "copacol-obra-271-amidonaria",
    client: "Copacol",
    title: "Obra 271 - Amidonaria",
    images: [
      "/images/portfolio/copacol-obra-271-amidonaria-1.jpg",
      "/images/portfolio/copacol-obra-271-amidonaria-2.jpg",
      "/images/portfolio/copacol-obra-271-amidonaria-3.jpg",
    ],
  },
  {
    slug: "copacol-obra-307-urs",
    client: "Copacol",
    title: "Obra 307 - URS",
    images: [
      "/images/portfolio/copacol-obra-307-urs-1.jpg",
      "/images/portfolio/copacol-obra-307-urs-2.jpg",
      "/images/portfolio/copacol-obra-307-urs-3.jpg",
    ],
  },
  {
    slug: "copacol-silo-jesuitas",
    client: "Copacol",
    title: "Silo Jesuítas",
    images: [
      "/images/portfolio/copacol-silo-jesuitas-1.jpg",
      "/images/portfolio/copacol-silo-jesuitas-2.jpg",
      "/images/portfolio/copacol-silo-jesuitas-3.jpg",
    ],
  },
  {
    slug: "copacol-upd",
    client: "Copacol",
    title: "UPD",
    images: [
      "/images/portfolio/copacol-upd-1.jpg",
      "/images/portfolio/copacol-upd-2.jpg",
      "/images/portfolio/copacol-upd-3.jpg",
    ],
  },
] as const;
```

- [ ] **Step 2: Verificar que cada caminho referenciado existe de fato**

Run:
```bash
grep -o '/images/portfolio/[a-z0-9-]*\.jpg' lib/content.ts | sort -u | while read -r p; do
  [ -f "public${p}" ] || echo "FALTANDO: $p"
done
echo "Verificação concluída."
```
Expected: nenhuma linha `FALTANDO: ...` impressa, só `Verificação concluída.` — confirma que os 45 caminhos citados em `PROJECTS` batem com os 45 arquivos gerados na Task 1.

- [ ] **Step 3: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add lib/content.ts
git commit -m "Adiciona dados das 17 obras (PROJECTS) para a página de portfólio"
```

---

### Task 3: Componente `Lightbox`

**Files:**
- Create: `components/ui/Lightbox.tsx`

**Interfaces:**
- Consumes: nada de tasks anteriores (componente autônomo).
- Produces: `Lightbox({ images: string[]; title: string; index: number; onClose: () => void; onIndexChange: (index: number) => void })` — usado pela Task 4.

- [ ] **Step 1: Criar o componente**

```tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type LightboxProps = {
  images: string[];
  title: string;
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function Lightbox({
  images,
  title,
  index,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const canNavigate = images.length > 1;

  const goPrev = () =>
    onIndexChange((index - 1 + images.length) % images.length);
  const goNext = () => onIndexChange((index + 1) % images.length);

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (canNavigate && e.key === "ArrowLeft") goPrev();
      if (canNavigate && e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[70] flex flex-col bg-ink-950"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (canNavigate && Math.abs(delta) > 50) {
          if (delta > 0) goPrev();
          else goNext();
        }
        touchStartX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 md:px-8">
        <p className="hud text-white/70">
          {title} · {String(index + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="rounded-full border border-white/15 p-2 text-white/80 transition-colors hover:border-white/40 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative flex-1">
        <Image
          key={images[index]}
          src={images[index]}
          alt={title}
          fill
          sizes="100vw"
          className="object-contain"
        />

        {canNavigate && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-ink-950/50 p-2.5 text-white/80 transition-colors hover:border-white/40 hover:text-white md:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-ink-950/50 p-2.5 text-white/80 transition-colors hover:border-white/40 hover:text-white md:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add components/ui/Lightbox.tsx
git commit -m "Adiciona componente Lightbox reutilizável (fullscreen, swipe, teclado)"
```

---

### Task 4: Seção `Portfolio` (grade + filtro)

**Files:**
- Create: `components/sections/Portfolio.tsx`

**Interfaces:**
- Consumes: `PROJECTS`, `ProjectClient` de `@/lib/content` (Task 2); `Lightbox` de `@/components/ui/Lightbox` (Task 3); `SectionHeader`, `Reveal`, `RevealStagger`, `RevealItem` de `@/components/ui/*` (já existentes); `cn` de `@/lib/utils`.
- Produces: `Portfolio()` — usado pela Task 5 (`app/obras/page.tsx`).

- [ ] **Step 1: Criar o componente**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { Lightbox } from "@/components/ui/Lightbox";
import { PROJECTS, type ProjectClient } from "@/lib/content";
import { cn } from "@/lib/utils";

const FILTERS: Array<{ label: string; value: ProjectClient | "Todas" }> = [
  { label: "Todas", value: "Todas" },
  { label: "C.Vale", value: "C.Vale" },
  { label: "Copacol", value: "Copacol" },
];

export function Portfolio() {
  const [filter, setFilter] = useState<ProjectClient | "Todas">("Todas");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const projects =
    filter === "Todas" ? PROJECTS : PROJECTS.filter((p) => p.client === filter);

  const activeProject = PROJECTS.find((p) => p.slug === activeSlug) ?? null;

  return (
    <section className="relative bg-paper py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          as="h1"
          index="01"
          eyebrow="Portfólio"
          title={
            <>
              Obras que mostram{" "}
              <span className="text-brand-600">nossa escala</span>.
            </>
          }
          description="Projetos entregues para cooperativas agroindustriais e o setor público no Sul do Brasil — cada um com seu registro fotográfico."
        />

        <Reveal className="mt-10">
          <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:px-0">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  filter === f.value
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-hair bg-surface text-ink-soft hover:border-brand-200 hover:text-ink",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        <RevealStagger
          className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          gap={0.05}
        >
          {projects.map((project) => (
            <RevealItem key={project.slug}>
              <button
                type="button"
                onClick={() => {
                  setActiveSlug(project.slug);
                  setActiveIndex(0);
                }}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-hair text-left"
              >
                <Image
                  src={project.images[0]}
                  alt={`${project.client} — ${project.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
                <span className="hud absolute left-4 top-4 rounded-full border border-white/15 bg-ink-950/40 px-3 py-1.5 text-white/80 backdrop-blur-sm">
                  {project.client}
                </span>
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2">
                  <h3 className="text-lg font-semibold leading-tight text-white">
                    {project.title}
                  </h3>
                  {project.images.length > 1 && (
                    <span className="hud flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-ink-950/40 px-2.5 py-1.5 text-white/80 backdrop-blur-sm">
                      <ImageIcon className="h-3 w-3" />
                      {project.images.length}
                    </span>
                  )}
                </div>
              </button>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>

      {activeProject && (
        <Lightbox
          images={[...activeProject.images]}
          title={`${activeProject.client} — ${activeProject.title}`}
          index={activeIndex}
          onClose={() => setActiveSlug(null)}
          onIndexChange={setActiveIndex}
        />
      )}
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Portfolio.tsx
git commit -m "Adiciona seção Portfolio com grade filtrável e lightbox"
```

---

### Task 5: Rota `/obras`

**Files:**
- Create: `app/obras/page.tsx`

**Interfaces:**
- Consumes: `Navbar` (`@/components/sections/Navbar`), `Portfolio` (Task 4), `Footer` (`@/components/sections/Footer`) — todos já existentes/produzidos.
- Produces: rota HTTP `GET /obras`.

- [ ] **Step 1: Criar a página**

```tsx
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Portfolio } from "@/components/sections/Portfolio";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Obras",
  description:
    "Portfólio completo de obras da Centra Engenharia — projetos entregues para cooperativas agroindustriais e o setor público no Sul do Brasil.",
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

- [ ] **Step 2: Build de produção**

Run: `pnpm build`
Expected: build conclui sem erros, com `/obras` listada nas rotas geradas (procurar por `○ /obras` ou equivalente na saída do Next).

- [ ] **Step 3: Verificação visual no navegador (desktop)**

Suba o servidor de dev (`PORT=3210 pnpm dev`), abra `http://localhost:3210/obras` no navegador de preview e confirme:
- As 17 obras aparecem na grade (3 colunas em desktop).
- Os filtros "Todas / C.Vale / Copacol" funcionam (contagem visível muda ao filtrar).
- Clicar num card abre o lightbox com a foto correta; setas funcionam quando há mais de 1 foto; ESC e clique no X fecham.

- [ ] **Step 4: Commit**

```bash
git add app/obras/page.tsx
git commit -m "Adiciona rota /obras (página de portfólio completo)"
```

---

### Task 6: CTA "Ver todas as obras" na home

**Files:**
- Modify: `components/sections/Obras.tsx:1-24` (imports) e `components/sections/Obras.tsx:88-91` (fim da seção)

**Interfaces:**
- Consumes: rota `/obras` (Task 5).
- Produces: nada consumido por outras tasks — ponto final da feature.

- [ ] **Step 1: Adicionar o import de `Link`**

Em `components/sections/Obras.tsx`, no bloco de imports (linha 1-19), adicionar logo abaixo de `import { ArrowUpRight } from "lucide-react";`:

```tsx
import Link from "next/link";
```

- [ ] **Step 2: Adicionar o CTA antes do fechamento da seção**

Localizar, perto do fim do arquivo:

```tsx
        </Reveal>
      </div>
    </section>
  );
}
```

(é o fechamento do bloco "Faixa de atuação" seguido do fechamento de `<section>` da função `Obras`). Substituir por:

```tsx
        </Reveal>
      </div>

      {/* CTA — portfólio completo */}
      <div className="container-x mt-14 md:mt-16">
        <Reveal>
          <div className="flex justify-center">
            <Link href="/obras" className="btn-ghost">
              Ver todas as obras
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck + build**

Run: `pnpm exec tsc --noEmit && pnpm build`
Expected: sem erros.

- [ ] **Step 4: Verificação visual**

Com `pnpm dev` rodando, abrir `http://localhost:3210/` (ou porta configurada), rolar até a seção Obras, confirmar que o botão "Ver todas as obras" aparece após a faixa de estados e que o clique navega para `/obras`.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Obras.tsx
git commit -m "Adiciona CTA 'Ver todas as obras' na seção Obras da home"
```

---

### Task 7: Verificação mobile-first dedicada

Task de QA — sem código novo. Requisito explícito do usuário ("extremamente profissional e fácil no celular") merece uma checagem própria, não só "funciona".

**Files:** nenhum (só verificação).

- [ ] **Step 1: Redimensionar o navegador de preview para viewport mobile (375×812) e abrir `/obras`**

Confirmar:
- Grade em 1 coluna, cards com foto legível (não cortada de forma estranha) e texto do título/tag legível sobre a foto.
- Pills de filtro cabem na tela e rolam horizontalmente sem quebrar o layout (sem overflow vertical indesejado).
- Toque num card abre o lightbox em tela cheia; swipe (arraste horizontal) troca de foto quando há mais de uma; botão de fechar é alcançável com o polegar (canto superior direito, tamanho de toque adequado).

- [ ] **Step 2: Redimensionar para tablet (768×1024) e re-confirmar grade em 2 colunas**

- [ ] **Step 3: Redimensionar para desktop (1280×800) e re-confirmar grade em 3 colunas e hover state (leve zoom na foto do card)**

- [ ] **Step 4: Checar performance de carregamento**

Com o painel de rede do navegador de preview, confirmar que ao carregar `/obras` em viewport mobile as imagens baixadas correspondem ao `sizes` mobile (não a versão larga de desktop) — inspecionar 2-3 requisições de imagem e comparar a largura efetiva servida pelo `next/image` com a largura da viewport.

- [ ] **Step 5: Screenshot final para registro**

Capturar screenshot da grade em mobile e do lightbox aberto, para conferência visual do "extremamente profissional" — se algo parecer amador (fotos cortadas de forma ruim, texto ilegível, espaçamento apertado), voltar à Task 4 e ajustar antes de considerar a feature concluída.
