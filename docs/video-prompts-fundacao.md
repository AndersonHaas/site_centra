# Prompts de vídeo IA — Exploração da fundação do silo

Prompts prontos para gerar os vídeos da seção **Fundação** do site. Os prompts estão
em inglês (os modelos de vídeo respondem melhor); as notas de uso estão em português.

## Como usar

1. Gere o vídeo na ferramenta escolhida (Seedance 2.0 no Jimeng, Veo 3 no Gemini/Flow,
   Sora ou Runway Gen-4).
2. **Re-encode para scroll-scrub** (o scrub exige todos os frames como keyframe) e
   salve direto em `site/public/videos/fundacao.mp4` (o componente lê de
   `/videos/fundacao.mp4`):

   ```bash
   ffmpeg -i fundacao-original.mp4 -an -g 1 -crf 23 -movflags +faststart site/public/videos/fundacao.mp4
   ```

3. Na home ([app/page.tsx](../app/page.tsx)), troque `<Fundacao />` por
   `<Fundacao variant="video" />` para comparar com a versão 3D.

### Regras que valem para todas as ferramentas

- **Plano-sequência, sem cortes**: o vídeo será scrubado pelo scroll — cortes secos
  "pulam" de forma estranha quando o usuário controla o tempo. Todos os prompts
  principais pedem one-take contínuo.
- **Sem rostos humanos reais** nas imagens de referência (o Seedance bloqueia).
  Operários apenas distantes, de costas, com capacete.
- **Paleta do site**: navy profundo (#050b14), aço, azul #2484d6, golden hour no
  final — casa com `media/works/silos-goldenhour.jpg`.
- Gere em **16:9** para desktop; se quiser versão mobile, rode também em 9:16.

### Imagens do site para usar como referência de estilo

| Arquivo | Uso sugerido |
|---|---|
| `media/works/silos-goldenhour.jpg` | Estilo/última cena (@Image1) |
| `media/works/cvale-complexo.jpg` | Cenário do canteiro (@Image2) |
| `media/works/copacol-aerea.jpg` | Enquadramento aéreo (@Image3) |

---

## PROMPT MASTER — Seedance 2.0 (15 s, um take, para o scroll-scrub)

> Faça upload de `silos-goldenhour.jpg` (@Image1), `cvale-complexo.jpg` (@Image2)
> e `copacol-aerea.jpg` (@Image3) antes de colar o prompt. Duração: 15 s.

```
One-take continuous camera, no cuts. Cinematic engineering documentary of a
grain silo foundation under construction. Scene style references @Image1's
golden-hour steel silos; construction site environment references @Image2;
aerial framing references @Image3. No people visible except distant workers
in hard hats seen from behind.

0-3s: Bird's eye aerial shot over a vast agro-industrial construction site
at dawn, crane shot slowly descending toward a massive circular excavation
where a silo foundation is being built. Surveying stakes and formwork
visible, cool blue morning light.

3-6s: Camera keeps descending below ground level as the earth becomes a
clean cross-section cutaway: rows of deep concrete piles glowing softly,
technical blueprint-style thin cyan lines overlaying the soil layers,
semi-transparent engineering visualization, 4K CGI look.

6-9s: Continuous push-in toward the pile caps and the circular ring
foundation, extreme close-up traveling along dense steel rebar cages,
metallic texture, shallow depth of field, dust particles floating in
shafts of light.

9-12s: Camera tilts up while fresh concrete pours smoothly around the
rebar in elegant slow motion, the ring foundation completing itself,
timelapse energy but continuous camera, steel anchor bolts emerging in a
perfect circle.

12-15s: Crane shot rising vertically along the corrugated steel silo wall
being assembled, faster and faster, bursting above the rim into a warm
golden-hour sky matching @Image1, the full silo complex revealed below,
lens flare, settle on a majestic wide shot.

Camera: single continuous crane/dolly move throughout, stable, no
handheld shake. Style: photorealistic with subtle engineering-CGI cutaway
during the underground segment, cinematic quality, film grain, 2.35:1
feel. Sound: deep ambient hum, distant construction, rising orchestral
swell resolving at the golden-hour reveal.
```

**Por que assim**: cada faixa de tempo vira uma "faixa de scroll" na seção — o
usuário literalmente rola da terra ao topo do silo. O corte CGI do subsolo casa
com as legendas HUD que o site sobrepõe (Estacas → Anel → Costado).

### Variante Seedance — só o subsolo (10 s, loop de fundo)

```
Seamless loop, one-take. Engineering CGI cross-section of a grain silo
foundation: camera orbits slowly around a semi-transparent underground
visualization — concrete piles, pile caps and circular ring beam in
luminous steel-blue (#2484d6) wireframe over dark navy (#050b14)
background, thin cyan measurement lines and small technical labels
appearing and fading. Subtle floating dust, depth of field. Loop point:
orbit returns to start angle at 10s. Style: premium technical
visualization, dark, precise, no text burned in. Sound: low ambient hum.
```

Use como **fundo de seção** (autoplay em loop, sem scrub) se preferir não usar o scrub.

---

## Veo 3 (Gemini/Flow) — mesmo roteiro, sintaxe própria

> Veo aceita descrição corrida; não há sistema @. Peça 2 gerações de 8 s
> (Veo gera clipes mais curtos) e emende, ou use a versão de 15 s se disponível.

**Parte 1 (aéreo → subsolo):**

```
Cinematic one-take crane shot, no cuts, photorealistic engineering
documentary. Dawn over a vast Brazilian agro-industrial construction
site. The camera descends from a bird's eye view toward a massive
circular silo foundation excavation, then continues below ground level
as the soil becomes a clean CGI cross-section: deep concrete piles, pile
caps, and a circular ring foundation revealed with thin glowing cyan
blueprint lines over dark navy tones. Ends pushing toward dense steel
rebar cages in shallow depth of field. Cool steel-blue palette, film
grain, no people, no text. Deep ambient hum with distant construction
sounds.
```

**Parte 2 (concretagem → topo golden hour):**

```
Cinematic one-take crane shot, no cuts, continuing from a close-up of
steel rebar cages inside a circular silo ring foundation. Fresh concrete
pours smoothly around the rebar in elegant motion, anchor bolts emerge
in a perfect circle, then the camera rises vertically along a corrugated
steel silo wall, accelerating, bursting above the rim into a warm
golden-hour sky. The full agro-industrial silo complex is revealed
below with lens flare. Photorealistic, cinematic, film grain. Rising
orchestral swell resolving into calm.
```

---

## Sora / Runway Gen-4 — versão compacta

```
Continuous one-take crane shot, no cuts, 15 seconds. Engineering
documentary of a grain silo foundation: aerial dawn view of a circular
excavation on an agro-industrial site → camera descends underground into
a clean CGI cutaway of concrete piles and ring foundation with glowing
cyan blueprint lines on dark navy → macro travel along steel rebar →
concrete pours and anchor bolts emerge → camera rises along the
corrugated steel silo wall into golden-hour sky revealing the full
complex. Photorealistic with technical-CGI underground segment, steel
blue and navy palette, film grain, no people, no on-screen text.
```

---

## Checklist de qualidade ao receber o vídeo

- [ ] Um take só, sem cortes secos (essencial para o scrub).
- [ ] Sem texto queimado no vídeo (as legendas HUD são do site).
- [ ] Começa escuro/aéreo e termina claro/golden hour (a seção fica entre fundos navy).
- [ ] Sem rostos identificáveis.
- [ ] Re-encodado com `-g 1` antes de ir para `site/public/videos/`.
- [ ] Peso final < 12 MB para 15 s em 1080p (suba o CRF se passar).
