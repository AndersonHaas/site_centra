# Validação responsiva da Centra

Implementação local concluída em 10/09/2026. Após revisão do usuário, a abertura até 1023 px passou a usar a foto como fundo integrado, com escurecimento atrás do texto e enquadramento do totem na parte inferior. A legenda fica restrita ao desktop. O layout desktop e as demais seções permanecem como na revisão anterior.

[Captura atual da abertura mobile](../artifacts/mobile-hero/br-390.png). A matriz de capturas abaixo documenta a primeira revisão, anterior a esse ajuste pontual.

Foram verificadas 88 combinações: 11 rotas × 8 telas. Rotas compartilhadas: início, sobre, portfólio e aviso legal, em `/br` e `/py`. Unidades brasileiras: pré-moldados, metalúrgica e guindastes. Telas: 320×740, 375×812, 390×844, 430×932, 768×1024, 1024×900, 1440×960 e 844×390.

| Verificação | Resultado |
| --- | --- |
| Largura da página e elementos fora da tela | 88/88 sem transbordamento horizontal |
| Totem no celular | Imagem com proporção original, sem recorte ou sobreposição de texto |
| Abertura desktop | Texto separado da marca; CENTRA e CONSTRUTORA legíveis a 1024 e 1440 px |
| Menu | Foco contido no cabeçalho, Escape, retorno ao botão, rolagem em 844×240 e desbloqueio ao mudar para desktop |
| Mercados | Troca preserva a rota compartilhada; unidades continuam restritas ao Brasil |
| Contato | Links mailto/WhatsApp conferidos sem abrir ou enviar mensagens |
| Formulário PT/ES | Validação local, envio pendente, erro de campo do servidor, erro geral, falha de rede e sucesso com respostas interceptadas |
| Portfólio PT/ES | Filtros combinados, estado vazio, seleção com aria-pressed, setas da galeria, foco e controles em orientação horizontal |
| Movimento | Rolagem nativa no toque; obras e todas as etapas da fundação em fluxo normal; cena 3D somente em desktop adequado |
| Movimento reduzido | Cena 3D e Lenis desmontados ao mudar a preferência, sem esconder etapas |
| Imagens e estabilidade | Imagens otimizadas do Next.js; proporção móvel conferida; CLS observado de 0 nas sete larguras |
| Console | Sem erros JavaScript ou de hidratação no teste de carregamento das sete larguras |
| Lint e build | Ambos aprovados; build com 18 páginas estáticas geradas |

O escurecimento da abertura fica concentrado atrás da coluna de texto. Texto branco e acento azul claro permanecem sobre a área escura. Os botões principais usam o tom 600 para melhorar contraste. Campos têm fonte de 16 px e os controles de navegação e galeria têm área mínima de 44 × 44 px.

As capturas completas usam movimento reduzido para apresentar o conteúdo em fluxo. A cena desktop e o movimento padrão foram verificados separadamente. As capturas anteriores usaram fontes alternativas durante uma falha inicial de rede; as finais usam as fontes originais Inter e JetBrains Mono. Medições realizadas em Chrome headless via Playwright no Windows, com emulação de toque nas larguras móveis; não substituem testes em aparelhos físicos. As imagens geradas ficam localmente em `artifacts/`, ignoradas pelo Git por seu volume.

O ambiente não possui as variáveis de conexão do portfólio. A página real apresenta seu estado vazio; filtros e galeria foram exercitados com duas obras de teste e fotos existentes através de uma rota local temporária, removida ao finalizar. Nenhuma fonte de dados, API ou banco foi alterada. Todas as requisições do formulário nos testes foram interceptadas no navegador.

Para repetir, iniciar o servidor local na porta 3000 e executar:

```powershell
node scripts/responsive-captures.mjs after
node scripts/responsive-interactions.mjs
node scripts/responsive-gallery.mjs
node scripts/responsive-runtime.mjs
npm.cmd run lint
npm.cmd run build
```

O teste de galeria exige o servidor de desenvolvimento, pois cria e remove sua rota temporária. O comparador foi gerado por `scripts/responsive-report.mjs`, reunindo a matriz completa e as capturas finais da abertura. A publicação não fez parte desta etapa.
