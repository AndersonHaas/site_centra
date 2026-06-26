# Centra Engenharia — Site institucional

Site institucional premium da **Centra Engenharia e Empreendimentos**, inspirado na
estética do terminal-industries.com e adaptado à marca navy/azul da Centra.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (tokens em `app/globals.css`)
- **framer-motion** (scroll, parallax, reveals, contadores, botões magnéticos)
- **lenis** (scroll suave com momentum)
- **three.js** (estrutura metálica 3D em wireframe, procedural)
- **lucide-react** (ícones)

## Experiência (FX cinematográfico)

- **Hero** full-bleed com foto real, Ken Burns, parallax e HUD técnico (mono).
- **Estrutura 3D**: galpão metálico em wireframe (three.js) — gira e responde ao mouse.
- **Obras**: galeria de painéis full-bleed com as fotos reais e parallax no scroll.
- Scroll suave (lenis), cursor custom, barra de progresso, botões magnéticos.
- Tudo respeita `prefers-reduced-motion` (desliga animações/scroll suave/3D anima).

## Como rodar

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # build de produção (estático)
pnpm start    # servir o build
```

## Estrutura

```
app/
  layout.tsx        # fontes, SEO, SmoothScroll + CustomCursor + ScrollProgress
  globals.css       # design tokens, tipografia, utilitários, lenis/cursor/grain
  page.tsx          # composição das seções
components/
  ui/               # Logo, Reveal, SectionHeader, Counter, CustomCursor,
                    # ScrollProgress, Magnetic
  providers/        # SmoothScroll (lenis)
  three/            # SteelStructure (galpão 3D wireframe, three.js)
  sections/         # Navbar, Hero, TrustBar, Stats, About, Solutions,
                    # Estrutura, Obras, Equipe, Clientes, Contato, Footer
lib/
  content.ts        # TODO o conteúdo institucional (texto, equipe, clientes, WORKS…)
  utils.ts          # helper cn()
media/
  works/            # fotos reais das obras (importadas estaticamente p/ blur-up)
```

> As fotos das obras ficam em `media/` (fora de `public/`) para que o Next gere
> versões otimizadas + placeholder blur automaticamente. Para trocar, substitua os
> arquivos em `media/works/` e ajuste os metadados em `WORKS` (`lib/content.ts`).

## O que editar

- **Textos, números, equipe, clientes, setores** → `lib/content.ts` (fonte única).
- **Dados de contato** → `components/sections/Contato.tsx` (constante `CONTACTS`).
  Os valores atuais (e-mail, telefone) são **placeholders** — substitua pelos reais.
- **Cores da marca** → tokens `--color-brand-*` e `--color-ink-*` em `app/globals.css`.
- **Formulário de contato**: hoje apenas exibe estado de sucesso no cliente. Para
  receber mensagens, conectar a um endpoint/serviço (ex.: Resend, Formspree, route
  handler em `app/api/`).

## Notas de design

- Ritmo dark → claro → dark (hero/soluções/contato escuros; sobre/obras/equipe/clientes claros).
- Eyebrows numeradas em fonte mono (detalhe técnico/editorial).
- Respeita `prefers-reduced-motion` em todas as animações.
- O logo é um SVG recriado a partir da identidade do briefing (`components/ui/Logo.tsx`).
  Substitua pelo arquivo vetorial oficial quando disponível.
