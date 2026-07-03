---
name: Centra Engenharia
description: Site institucional cinematográfico-industrial para engenharia e construção de alto desempenho
colors:
  ink-950: "#050b14"
  ink-900: "#08111d"
  ink-850: "#0a1726"
  ink-800: "#0e2032"
  ink-700: "#16314a"
  ink-600: "#1f4a72"
  brand-50: "#eef6fd"
  brand-100: "#d6eafb"
  brand-200: "#aed6f6"
  brand-300: "#79bbef"
  brand-400: "#4aa0e6"
  brand-500: "#2484d6"
  brand-600: "#1568b8"
  brand-700: "#135495"
  brand-800: "#14497b"
  brand-900: "#153d66"
  paper: "#f4f7fb"
  paper-2: "#eaf0f7"
  surface: "#ffffff"
  ink: "#0a1726"
  ink-soft: "#44586c"
  ink-faint: "#76879a"
  hair: "#e2e9f1"
  signal: "#f97316"
typography:
  display:
    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif"
    fontWeight: 600
    letterSpacing: "-0.035em"
    lineHeight: 0.98
  body:
    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.6
  eyebrow:
    fontFamily: "var(--font-mono-jb), ui-monospace, SF Mono, monospace"
    fontSize: "0.72rem"
    fontWeight: 500
    letterSpacing: "0.18em"
  hud:
    fontFamily: "var(--font-mono-jb), ui-monospace, SF Mono, monospace"
    fontSize: "0.62rem"
    letterSpacing: "0.24em"
    lineHeight: 1
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  full: "99px"
spacing:
  section-y: "6rem"
  section-y-lg: "8rem"
  container-pad: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.brand-500}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "0.85rem 1.4rem"
  button-primary-hover:
    backgroundColor: "{colors.brand-400}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "0.85rem 1.3rem"
---

# Design System: Centra Engenharia

## 1. Overview

**Creative North Star: "The Industrial HUD"**

O sistema visual da Centra trata o site como um overlay técnico de central de comando sobre obras reais: navy profundo nas seções de impacto (hero, números, contato), labels em mono com coordenadas geográficas e marcadores de canto que lembram a moldura de uma câmera de monitoramento de obra. A fotografia é sempre real — galpões, silos, equipe em campo — nunca ilustração genérica; o grain sutil sobre o escuro e o Ken Burns lento no hero reforçam a sensação de "estamos olhando para uma obra em andamento, agora". O sistema rejeita explicitamente o institucional-genérico (gradiente azul-corporativo raso, ícone em card, stock photo descontextualizada) em favor de prova concreta: números reais, fotos reais, nomes de clientes reais.

Ritmo de página alterna dark → claro → dark (hero/soluções/contato escuros; sobre/obras/equipe/clientes claros), o que dá variação sem perder a espinha navy que ancora a marca.

**Key Characteristics:**
- Navy profundo como base de impacto, branco/paper como base de prova e leitura longa
- HUD técnico (coordenadas, labels mono, marcadores de canto) como assinatura visual
- Fotografia documental real com Ken Burns/parallax, nunca stock genérico
- Gradiente de marca (aço → ciano) usado com extrema parcimônia, só em palavras de destaque no headline e métricas
- Componentes precisos e confiantes: bordas retas, transições rápidas e deliberadas, zero decoração gratuita

## 2. Colors

Paleta de dois registros: navy cinematográfico para seções de impacto, neutros claros e frios para seções de prova/leitura. Um único acento azul de marca carrega toda a identidade — não há paleta secundária nem terciária.

### Primary
- **Brand Blue** (`#2484d6` / brand-500): CTA primário, ícones de destaque, indicador de status ao vivo no hero. Hover sobe para `#4aa0e6` (brand-400).
- **Steel Gradient** (`linear-gradient(100deg, #cfe6fa 0%, #4aa0e6 48%, #aed6f6 100%)` via `.text-gradient-brand`): reservado para uma palavra de ênfase por headline/métrica — nunca para títulos inteiros ou corpo de texto.

### Neutral
- **Deep Navy** (`#050b14` ink-950): fundo de hero, stats, contato, footer — a "tela escura" do HUD.
- **Navy Layer** (`#08111d`–`#1f4a72`, ink-900 a ink-600): camadas de profundidade sobre o navy (bordas, divisores, overlays) — nunca usado como cor sólida de fundo isolada.
- **Cool Paper** (`#f4f7fb` paper / `#eaf0f7` paper-2): fundo das seções claras (sobre, obras, equipe, clientes).
- **Surface** (`#ffffff`): cards e painéis sobre fundo paper.
- **Ink** (`#0a1726`): texto principal sobre fundo claro.
- **Ink Soft** (`#44586c`): corpo de texto secundário sobre claro — usado no lugar de cinza neutro para manter o tom frio-azulado da marca.
- **Ink Faint** (`#76879a`): metadados, legendas, eyebrow sobre fundo claro.
- **Hair** (`#e2e9f1`): divisores e bordas sobre fundo claro.

### Named Rules
**The One Gradient Rule.** O gradiente de marca aparece no máximo uma vez por seção, sempre em texto curto (uma palavra ou número), nunca como fundo decorativo nem em mais de um elemento simultâneo na viewport.

**The Real-Photo Rule.** Toda imagem de fundo é fotografia real de obra; nenhuma ilustração, ícone grande ou stock genérico assume o papel de imagem principal.

## 3. Typography

**Display Font:** Inter (var(--font-inter)), peso 600, com fallback ui-sans-serif/system-ui
**Body Font:** Inter, mesma família, peso 400-500
**Label/Mono Font:** JetBrains Mono (var(--font-mono-jb)), com fallback ui-monospace/SF Mono

**Character:** Uma única família sans (Inter) carrega hierarquia inteira por peso e tamanho — geométrica, neutra, técnica. O contraste vem do mono (JetBrains Mono) reservado estritamente para metadados técnicos (eyebrows, HUD, coordenadas), nunca para títulos ou corpo.

### Hierarchy
- **Display** (600, `clamp` até ~4rem / `text-[3.5rem] xl:text-[4rem]`, line-height 0.98, letter-spacing -0.035em): headlines de hero e section headers. Usa `text-wrap: balance` implícito via classes utilitárias.
- **Headline/Title** (600, 2.4–2.9rem): títulos de seção (`SectionHeader`).
- **Body** (400-500, 1–1.125rem, line-height 1.6): texto corrido, máximo ~65-75ch via `max-w-3xl`/`max-w-2xl` nos containers de texto.
- **Eyebrow** (500, 0.72rem, letter-spacing 0.18em, uppercase, mono): rótulo de seção acima do título — já em uso extensivo no projeto.
- **HUD label** (0.62rem, letter-spacing 0.24em, uppercase, mono): metadados ambientais (coordenadas, "Obra 01", status).

### Named Rules
**The Mono-Is-Metadata Rule.** JetBrains Mono é reservado para informação técnica/ambiental (coordenadas, status, eyebrow). Nunca aparece em headline, body ou CTA — isso quebraria a leitura de "dado técnico" que o mono carrega.

## 4. Elevation

O sistema é flat por doutrina: nenhum `box-shadow` estrutural é usado. Profundidade vem inteiramente de camadas tonais — overlays de navy semitransparente sobre fotografia (`bg-ink-950/85`, gradientes lineares de leitura), blur sutil em painéis sobre imagem (`backdrop-blur-sm`) e bordas de 1px em baixa opacidade (`border-white/10`) para separar planos. Isso mantém a leitura "cinematográfica" (luz e sombra vêm da própria fotografia, não de sombras de UI sintéticas).

### Named Rules
**The No-Synthetic-Shadow Rule.** Profundidade é tonal (overlay, gradiente, blur, borda translúcida), nunca `box-shadow`. Se um elemento parece "flutuar", a causa é blur + borda, não sombra.

## 5. Components

Componentes são precisos e confiantes: bordas retas (raio pequeno, 0.5rem no máximo), transições rápidas e deliberadas (`ease-out-expo`, 0.25-0.3s), sem ornamento. A sensação é de equipamento bem calibrado, não de software "amigável".

### Buttons
- **Shape:** raio pequeno (`rounded-lg` / 0.5rem).
- **Primary (`btn-primary`):** fundo `brand-500`, texto branco, padding `0.85rem 1.4rem`. Hover: fundo sobe para `brand-400`, eleva 1px (`translateY(-1px)`) e ganha glow azul (`box-shadow: 0 12px 34px -12px rgba(36,132,214,0.65)`) — única exceção à regra de no-shadow, tratada como feedback de interação, não como elevação estrutural.
- **Ghost (`btn-ghost`):** transparente, borda branca translúcida 1px (`rgba(255,255,255,0.18)`), texto branco. Hover: fundo branco a 6% de opacidade, borda sobe para 40%.

### Stat Cards
- **Shape:** sem raio individual — grid de células com `gap-px` formando uma grade unificada com borda externa única (`rounded-2xl`, `border-white/10`).
- **Background:** `bg-ink-950/70` com `backdrop-blur-sm` sobre fundo fotográfico com overlay.
- **Content:** número em display 600 + sufixo em gradiente de marca; label em corpo pequeno branco/60%.

### Navigation
- **Style:** fixa no topo, transparente no estado inicial, `bg-ink-950/80` + `backdrop-blur-xl` + borda inferior ao rolar (`scrolled` state, transição 500ms).
- **Links:** texto branco/70%, hover para branco 100% com underline animado (largura 0→100% em 300ms) ancorado no `brand-400`.
- **Mobile:** painel full-width com fade+slide (`AnimatePresence`, ease-out-expo, 300ms), botão de fechar substitui o hambúrguer.

### Section Header (assinatura)
Padrão usado em toda transição de seção: índice numérico em eyebrow mono + linha divisória de 8px + label eyebrow, seguido de título display com `text-balance`, seguido de descrição opcional em `ink-soft`/`white/65`. Anima em cascata (`Reveal` com delays de 0.06–0.12s).

### HUD / Corner Ticks (assinatura)
Marcadores de canto em L (borda 1px, `white/20`, 36×36px) nos quatro cantos do hero, simulando viewfinder de câmera. Combinado com coordenadas geográficas reais (`hud` text) e indicador de status pulsante (`animate-ping`). Reservado para seções de abertura/clímax (hero); não replicar em todas as seções, sob pena de perder o impacto de "abertura de cena".

## 6. Do's and Don'ts

### Do:
- **Do** usar fotografia real de obra como imagem de fundo em qualquer seção de impacto; nunca ilustração ou stock genérico.
- **Do** reservar o gradiente de marca para uma palavra/número de ênfase por seção.
- **Do** manter profundidade via overlay/blur/borda translúcida, nunca `box-shadow` estrutural (exceção única: glow de hover em CTA primário).
- **Do** usar JetBrains Mono só para metadados técnicos (eyebrow, HUD, coordenadas).
- **Do** alternar dark→claro→dark entre seções para dar ritmo sem perder a espinha navy.
- **Do** respeitar `prefers-reduced-motion` em toda animação (parallax, Ken Burns, reveals, ping) — já implementado, manter em qualquer componente novo.

### Don't:
- **Don't** usar gradiente azul-corporativo genérico como fundo decorativo de seção inteira — isso é exatamente o institucional-raso que a marca rejeita.
- **Don't** introduzir ícone-em-card-redondo acima de heading como padrão repetido; a Centra usa prova (foto, número, nome de cliente), não iconografia decorativa.
- **Don't** adicionar `box-shadow` tradicional em cards ou painéis; quebra a doutrina flat-cinematográfica.
- **Don't** usar cinza neutro puro para texto secundário sobre fundo claro; usar `ink-soft`/`ink-faint` (tingidos de navy) para manter coerência de marca.
- **Don't** replicar o HUD de cantos (corner ticks) em mais de uma seção por página; é assinatura de abertura, não ornamento repetível.
- **Don't** usar stock photo ou ilustração genérica de "engenharia" — toda imagem deve ser de obra real da Centra (ou claramente identificável como tal).
