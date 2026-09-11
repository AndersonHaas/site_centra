import { readFile, writeFile, copyFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const dir = 'artifacts/responsive';
const read = async file => JSON.parse(await readFile(`${dir}/${file}`, 'utf8'));
const before = await read('before/metrics.json');
const after = await read('after/metrics.json');
const homes = await read('home-final/metrics.json');
for (const home of homes) {
  const i = after.findIndex(row => row.route === home.route && row.width === home.width);
  after[i] = home;
  const file = `${home.route.slice(1)}-${home.width}x${home.height}.png`;
  await copyFile(`${dir}/home-final/${file}`, `${dir}/after/${file}`);
}
assert.equal(before.length, 88);
assert.equal(after.length, 88);
assert(after.every(row => row.documentWidth === row.width && row.overflow.length === 0));
await writeFile(`${dir}/after/metrics.json`, JSON.stringify(after, null, 2));
const routes = [...new Set(after.map(row => row.route))];
const views = [...new Set(after.map(row => `${row.width}x${row.height}`))];
await writeFile(`${dir}/index.html`, `<!doctype html>
<html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Centra — validação responsiva</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#eaf0f7;color:#0a1726;font:16px system-ui,sans-serif}
header{padding:24px;background:#08111d;color:white}h1{font-size:24px;margin:0 0 12px}p{line-height:1.5}
.controls{display:flex;gap:16px;flex-wrap:wrap}label{display:grid;gap:8px}select{font:inherit;padding:10px;min-height:44px;border-radius:8px}
main{padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:16px}figure{margin:0;min-width:0}figcaption{padding:12px;font-weight:600}
.frame{height:76vh;overflow:auto;background:white;border:1px solid #cbd5e1;border-radius:8px}.frame img{display:block;width:100%;height:auto}
footer{padding:0 24px 24px;font-size:14px}a{color:#135495}.links{display:flex;gap:20px;flex-wrap:wrap}
@media(max-width:700px){main{grid-template-columns:1fr}.frame{height:65vh}}
</style>
<header><h1>Centra — antes e depois</h1><p>88 combinações de rota e tela verificadas. Resultado final: sem rolagem horizontal e sem elementos fora da largura da página.</p>
<div class="controls"><label>Página<select id="route">${routes.map(r => `<option>${r}</option>`).join('')}</select></label>
<label>Tela<select id="view">${views.map(v => `<option>${v}</option>`).join('')}</select></label></div></header>
<main>${['before', 'after'].map((phase, i) => `<figure><figcaption>${i ? 'Depois' : 'Antes'}</figcaption><div class="frame"><img id="${phase}" alt="Captura ${i ? 'depois' : 'antes'} dos ajustes"></div></figure>`).join('')}</main>
<footer><p>As capturas completas usam movimento reduzido para mostrar todo o conteúdo. As imagens anteriores foram feitas com fontes alternativas durante a falha inicial de rede; as finais usam Inter e JetBrains Mono. A cena desktop e o movimento padrão foram verificados separadamente.</p>
<div class="links"><a href="hero-320.png">Abertura 320 px</a><a href="hero-1024.png">Abertura 1024 px</a><a href="hero-1440.png">Abertura 1440 px</a><a href="foundation-desktop.png">Fundação desktop</a><a href="py-gallery-landscape.png">Galeria horizontal</a><a href="runtime.json">Medições de carregamento</a></div></footer>
<script>
const route = document.getElementById('route'), view = document.getElementById('view');
function update(){for(const phase of ['before','after']) document.getElementById(phase).src = phase + '/' + route.value.slice(1).replaceAll('/','-') + '-' + view.value + '.png';}
route.addEventListener('change',update);view.addEventListener('change',update);update();
</script></html>`);
console.log('Report generated: 88/88 final layouts without overflow.');
