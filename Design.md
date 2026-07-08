# Design.md — UX & Design System do Barolo Capital

> **Para que serve:** este é o mapa único de design/UX do site. Para mudar cor, fonte,
> nav, componente ou comportamento, **consulte aqui primeiro** — a tabela "Quero mudar X"
> diz exatamente qual arquivo e qual trecho editar, sem ter que ler o código todo.
>
> **Realidade atual (importante):** o site é **HTML estático puro, sem build step**.
> Cada página é **autossuficiente**: seu CSS fica num `<style>` inline e seu JS em
> `<script>` inline. **Não existe** um `tokens.css`/`components.css`/`ui.js` compartilhado.
> Só há dois assets compartilhados: `data.js` (posições) e `ui-polish.css` (polish leve).
> Consequência prática: **mudanças de design geralmente precisam ser repetidas em cada
> página** (veja a tabela de divergência de tokens). Este doc existe justamente para
> tornar isso rápido.

Última atualização: 06/07/2026

---

## 0. Regras invioláveis (nunca quebrar)

1. **Privacidade** — nenhum endereço de carteira em URL pública (só no JS). `<meta name="robots" content="noindex, nofollow">` em toda página. `robots.txt` bloqueia crawlers. O site é *prova de competência*, não portfólio público.
2. **`JetBrains Mono` em TODO número/dado/ticker** — valores, tickers, APYs, datas. Nunca trocar a fonte dos números.
3. **`data.js` é a fonte única de posições** (`window.BAROLO_DATA`). Preços/quantidades/dívidas saem dele; os HTML só têm fallback. Atualização mensal = editar `data.js` (ver `MONTHLY_UPDATE_WORKFLOW.md`).
4. **`emprestimos.html` é um bundle** (arquivo minificado/gzip de ~884 KB numa linha). **Não editar à mão** — não tem `:root`/nav/CSS legível. Precisa do código-fonte original + rebuild.
5. **Sem framework, sem build** — só HTML/CSS/JS. Nada de npm/webpack no runtime.

---

## 1. Quero mudar X → vá aqui

| Quero mudar… | Onde | Como |
|---|---|---|
| **Cor da marca (ouro), verde, vermelho, fundo, texto** | `:root{}` de **cada** página (5 arquivos) | Buscar `:root{` no `<style>`. Os tokens **divergiram** — ver §2 (tabela). Trocar em todas p/ ficar consistente. |
| **Tema claro/escuro (valores)** | `[data-theme="light"]{}` de cada página | Mesmo esquema do `:root`. |
| **Fontes** | `<head>` de cada página (`<link>`/`@import`) + regras `font-family` | Ver §3. |
| **Links / ordem do menu (nav)** | `<div class="nav-links">` de cada página | Ver §4.1. `pools.html` tem **2 navs** (desktop+mobile) — mudar os dois. |
| **Ticker de preços (topo/rodapé)** | classes `.ticker-*` / `.market-ticker` / `.mk-*` + o fetch em JS | Ver §4.2. Difere entre index (topo) e dashboards (rodapé). |
| **Botões pequenos** | `.btn-sm` no `<style>` de cada página | Ver §4.3 (valores divergem por página). |
| **Cards (KPI/stat/métrica)** | classes por página (`.stat-card`, `.kpi-card`, `.metric-card`, `.card`…) | Ver §4.4. |
| **Abas (tabs)** | `switchTab(...)` + `.tab` + painéis `#panel-*`/`.tab-pane` | Ver §4.5 e §6. Assinaturas diferem por página. |
| **Tooltip dos gráficos** (bolinha vs quadrado) | `Chart.defaults` inline logo após o Chart.js no `<head>` de cada página | Ver §4.6. Padrão = bolinha cheia da cor, sem borda. Global — não mexer em cada gráfico. |
| **Toggle de tema / idioma / moeda** | funções JS inline (`toggleTheme`, `toggleLang`/`toggleIndexLang`, `toggleCurrency`) | Ver §5. |
| **Conteúdo/estrutura de uma página** | o próprio arquivo (ver mapa em §6) | Cada página é autossuficiente. |
| **Textos EN/PT** | atributos `data-i18n="chave"` + objeto de strings no JS (`INDEX_LANG_STRINGS`/`LANG_STRINGS`) | index tem toggle EN/PT; dashboards são PT. |
| **Números do portfólio (qty, preço, dívida)** | `data.js` | **Não** editar HTML — ver `MONTHLY_UPDATE_WORKFLOW.md`. |
| **Polish global (scrollbar, seleção, hover de card)** | `ui-polish.css` (raiz, compartilhado) | Único CSS realmente compartilhado. Vence por especificidade/`!important`. |
| **Favicon** | `<link rel="icon" ...>` (data-URI SVG "B") no `<head>` de cada página | Idêntico em todas. |

---

## 2. Tokens (cores, tema, escala)

Definidos em `:root{}` (tema escuro, padrão) e `[data-theme="light"]{}` no `<style>` de cada
página. **`data-theme` fica no `<html>`**, salvo em `localStorage['bc-theme']`. Um IIFE inline
no `<head>` aplica o tema salvo antes da 1ª pintura (anti-flash).

### 2.1 Paleta canônica (idêntica nas 5 páginas — pode trocar com segurança se replicar em todas)
```
--accent / --gold : #c9a050   (ouro — cor da marca)
--green           : #3fb950   (positivo)
--red             : #f85149   (negativo)
--bg              : #0e0e12   (fundo)
--surface         : #141418   (cartões)
--surface2        : #1a1a20   (cartões 2)
--border          : #2a2620
--text / --cream  : #e8dfc8
--muted           : #8a7a62   (texto secundário)
```
Tema claro (idêntico nas 5): `--bg:#f5f0e8 · --surface:#faf6ee · --surface2:#f0ebe0 · --border:#ddd4c0 · --border2:#ccc2a8 · --text:#2a1e0e · --muted:#7a6a52`.

### 2.2 Tokens que DIVERGEM por página (⚠️ cuidado — mudar num não muda no outro)
| Token | index | portfolio | pools | ferramentas | relatorio |
|---|---|---|---|---|---|
| `--border2` (escuro) | `#3a3228` | `#3a3228` | `#3a3228` | `rgba(201,160,80,.15)` | `#3a3228` |
| `--accent` (claro) | — | `#8a6820` | `#8a6820` | `#8a6820` | `#8a6820` |
| `--green`/`--red` (claro) | — | `#4a7c3f`/`#9c2a2a` | idem | idem | — |
| `--gold2` | `#9a7228` | — | — | — | `#8a6820` |
| `--card-shadow` | — | ✓ | ✓ | (própria) | ✓ |
| **Só de uma página** | `--fib-1..6`, `--cream`, `--dark` | `--yellow`, `--orange`, `--stable` | `--wine`, `--yellow`, `--font`, `--mono` | `--purple`, `--orange`, `--s1/2/3`, `--dim`, `--radius`, `--shadow`, `--font-mono/head/serif` | `--card-shadow` |

> Regra prática: para uma mudança de cor **consistente**, edite o `:root`/`[data-theme=light]` das **5** páginas. Tokens "só de uma página" existem porque aquela página precisa deles — não apague.

---

## 3. Tipografia

Carregadas no `<head>` de cada página (Fontshare / Google Fonts). Três fontes, papéis fixos:

| Fonte | Uso | Onde |
|---|---|---|
| **Satoshi** | UI geral (texto, labels, botões) | todas as páginas exceto títulos display |
| **Cormorant Garamond** | Títulos/display editoriais | hero e títulos grandes (forte no `index.html`) |
| **JetBrains Mono** | **Todo número/dado/ticker/nav** | valores, APYs, tickers, links do nav | 

Regra: número = mono, sempre. Ao criar componente novo com valores, use `font-family:'JetBrains Mono',monospace`.

---

## 4. Componentes compartilhados (vocabulário)

> "Compartilhado" aqui = mesmo **nome de classe** repetido em várias páginas, mas o CSS é
> **copiado inline em cada uma** (podem divergir). Sempre confira na página que vai editar.

### 4.1 Nav (`<nav>` + `.nav-links` + `.nav-right`)
- **Dois tipos de nav no site:**
  - **Landing (`index.html`)** — nav por âncoras: `Home · About · Portfolio · Strategies · Contact`. Tem hamburger mobile (`#navLinks`, `.nav-hamburger`, `toggleMobile()`), logo SVG "BAROLO CAPITAL" com gradiente, underline dourado animado (`.nav-links a::after`). Altura ~60px, `position:sticky`.
  - **Dashboards + relatório** — nav entre páginas: `Início · Portfolio · Pools & DeFi · Empréstimos · Ferramentas`. A página atual tem `class="active"`. Estilo mais compacto (`position:fixed`, ~50px, `.nav-brand`, sem underline animado). É uma **variante** — CSS próprio inline em cada dashboard.
- ⚠️ **`pools.html` tem DOIS blocos `<nav>`** (desktop + duplicado mobile). Mudou o nav? Mude os dois.
- ⚠️ **`ferramentas.html`**: os links "Pools & DeFi" e "Empréstimos" estão na mesma linha do HTML (cosmético, funciona).
- `emprestimos.html` (bundle) tem o nav dentro do bundle — não editável aqui.

### 4.2 Ticker de preços
- **index.html** — ticker rolando no topo (`.ticker-wrap` / `.ticker-track` / `.ticker-item`, animação `@keyframes ticker`). Fetch: `initTicker()` (CoinGecko), atualiza a cada 60s.
- **dashboards (portfolio/pools)** — barra fixa no rodapé com gwei · BTC · ETH · SOL (`.market-ticker`, `.mk-*` no portfolio; `.market-ticker`/`.ticker-item` no pools). Fetch próprio (CoinGecko + Alchemy p/ gwei). **É outro componente**, apesar de reusar o nome `.ticker-item`.

### 4.3 Botões
- `.nav-btn` (dourado sólido, CTA do nav — index) · `.nav-input` (campo login) · **`.btn-sm`** (botão pequeno de controle, usado em toda página — **valores divergem**: index não tem; relatorio/dashboards têm versão "ghost" com `background:none`).

### 4.4 Cards
Contagem de definições por página (vocabulário próprio de cada uma): `portfolio` ~19 · `pools` ~12 · `ferramentas` ~10 · `relatorio` 1 · `index` misc (`.stat-card`, `.hero-card`, `.token-card`, `.strat-card`). Não há um "card" único — cada dashboard tem seus `.kpi-card`/`.stat-card`/`.metric-card`/`.card`/`.chart-panel`. Edite na página.
- Hover de card (elevação + brilho dourado) vem de **`ui-polish.css`** (compartilhado) para `.stat-card,.metric-card,.defi-card,.hero-card`.

### 4.5 Abas (tabs)
- **portfolio_analytics** — `switchTab(name, btn)`; abas: `Ativos · Performance · Métricas · Risco & Convexidade · DeFi & Mercado`. Aba salva em `localStorage['bc-active-tab']`.
- **ferramentas** — `switchTab(id, btn)` (assinatura diferente!); 10 abas: `Crenças · Liquidação · Cenários · Sizing & Risk · Diário DeFi · Alertas · Evolução · Pools APY · Ciclo · Semanal`. Painéis: `#panel-*`.
- ⚠️ As duas `switchTab` têm **assinaturas diferentes** — não copie de uma pra outra.

### 4.6 Tooltips de gráfico (Chart.js) — bolinha cheia da cor da série
Padrão do site: ao passar o mouse, o indicador de cor no tooltip é uma **bolinha (círculo)
cheia da cor da série, sem borda** — não o quadrado padrão do Chart.js.

Aplicado **globalmente** via `Chart.defaults`, num `<script>` inline logo **após o
`<script src=…chart.umd…>`** no `<head>` de cada página com gráficos
(`portfolio_analytics`, `pools`, `ferramentas`, `index`, `relatorio`). Um único ponto por
página — **não** precisa tocar em cada gráfico:
```js
Chart.defaults.plugins.tooltip.usePointStyle = true;
Chart.defaults.plugins.tooltip.callbacks.labelPointStyle = () => ({ pointStyle:'circle', rotation:0 });
Chart.defaults.plugins.tooltip.callbacks.labelColor = (ctx) => {
  const ds=ctx.dataset||{}, at=v=>Array.isArray(v)?v[ctx.dataIndex]:v;
  const c=[at(ds.borderColor),at(ds.pointBackgroundColor),at(ds.backgroundColor)]
            .find(x=>typeof x==='string'&&x) || '#c9a050';
  return { borderColor:c, backgroundColor:c, borderWidth:0 }; // mesma cor = sem borda
};
```
- Trocar o formato (quadrado/triângulo/…): mudar `pointStyle`. Reativar borda: `borderWidth>0` + `borderColor` diferente.
- Um gráfico só volta ao quadrado se ele **sobrescrever** `usePointStyle:false` ou `callbacks.labelColor` no próprio config.
- `emprestimos.html` (bundle) não recebe — seus gráficos estão dentro do bundle.

---

## 5. Interações (funções JS — cada página tem a sua, inline)

> Não há JS compartilhado. Cada página define suas próprias funções. Para achar: buscar
> `function nomeDaFuncao` no arquivo. Comportamentos podem divergir de propósito.

| Função | O que faz | Observações por página |
|---|---|---|
| `toggleTheme()` | alterna `data-theme`, salva `bc-theme` | **portfolio** e **ferramentas** também **reconstroem os gráficos** no toggle (destroy+rebuild / `Ciclo.rebuild()`). Se mexer, preserve isso. index/pools/relatorio são simples. |
| `toggleMobile()` / `closeMobile()` | abre/fecha menu mobile (`#navLinks.open`) | só **index** (landing). |
| `setActive(el)` | marca link ativo do nav | index. |
| `toggleIndexLang()` | EN⇄PT na landing | **só index**. Strings em `INDEX_LANG_STRINGS`. |
| `toggleLang()` / `applyLang()` | EN⇄PT | pools, ferramentas (strings em `LANG_STRINGS`). Dashboards em geral são PT. |
| `toggleCurrency()` | cicla régua USD→BRL→BTC→ETH | **portfolio** (4 estados, salva `bc-currency`), **pools**, **ferramentas**. |
| `window.Ciclo` | aba Ciclo (indicadores on-chain BTC) | **só ferramentas** (IIFE, escopo `#panel-ciclo`, lê `btc-onchain.json`). |

Anti-flash de tema: IIFE inline no `<head>` de cada página lê `bc-theme` e aplica `data-theme` antes de pintar. Mantenha inline.

---

## 6. Mapa das páginas

| Página | Papel | Nav | Seções/JS principais |
|---|---|---|---|
| **index.html** | Landing pública (EN padrão, toggle PT) | âncoras + hamburger | Hero editorial 2 colunas + painel "Barolo · Live" (φ/razão áurea, espiral, aurora, efeito de digitação), token board com sparklines, widget de gwei fixo, seções `01 Sobre · 02 Portfolio · 03 Strategies · 04 Contact`. JS: `initTicker`, `toggleIndexLang`, sparklines, φ-spiral. |
| **portfolio_analytics.html** | Dashboard principal (PT) | dashboard | Exec bar, abas (Ativos/Performance/Métricas/Risco & Convexidade/DeFi & Mercado), donut de alocação, curva de patrimônio, heatmap, drawdown, DCA, Evolução Patrimonial, **Renda Passiva Realizada** (livro-razão mensal, `RENDA_2026` + `buildRendaPassiva()`, aba DeFi & Mercado), régua USD/BRL/BTC/ETH, KPI "vs HODL", ~32 canvases Chart.js. `toggleTheme` reconstrói gráficos. |
| **pools.html** | Pools de liquidez + DeFi (PT) | dashboard (**2 navs**) | Meta 5%, P&L YTD, card pool ativa (WETH/USDC **Base**), gráficos, iframes lazy (Revert/GeckoTerminal/AAVE), explorador de APR. Array `POOLS`. |
| **ferramentas.html** | Ferramentas + Diário (PT, toggle EN) | dashboard | 10 abas (calculadoras Kelly/Merton/Hedge/LevHedge, Liquidação, Cenários, Diário, Alertas, **Ciclo** on-chain BTC). `window.Ciclo`, `switchTab(id,btn)`. |
| **relatorio.html** | Relatório/PDF (PT) | dashboard (compacto, `no-print`) | Resumo executivo, tabela de ativos, posições DeFi, evolução, `window.print()` com `@media print`. Menor/mais limpo. |
| **emprestimos.html** | Lending AAVE/Kamino | (no bundle) | ⚠️ **Bundle minificado** — não editar aqui. Fonte + rebuild. |

**Assets compartilhados:** `data.js` (posições), `ui-polish.css` (polish), `btc-onchain.json` (dados do Ciclo, gerado por GitHub Action diária).

---

## 7. Como testar e publicar

- **Testar local** (Node, Python não está no PATH): subir um server estático simples na raiz e abrir `http://localhost:8080/<pagina>.html`. F12 → Console p/ erros. (Config em `.claude/launch.json`.)
- **Checklist ao mexer em qualquer página:** tema claro/escuro alterna e persiste · nav funciona · abas/idioma/moeda funcionam (se houver) · gráficos Chart.js renderizam · **0 erros no console** · números continuam em JetBrains Mono.
- **Deploy:** GitHub Pages (`barolocapital.com.br`). Push direto na `main` → site atualiza em ~1–2 min. (Ver `CLAUDE.md` › Deploy.)

---

## 8. Notas / pegadinhas conhecidas

- Tokens **divergiram** entre páginas (§2.2) — não existe fonte única de cor. Mudança de cor consistente = editar as 5.
- `emprestimos.html` é bundle (não editável à mão).
- `pools.html` tem 2 `<nav>`; `ferramentas.html` tem 2 links na mesma linha (cosmético).
- `toggleTheme` de **portfolio** e **ferramentas** reconstrói gráficos — não simplificar.
- Screenshots de `index`/dashboards podem travar por causa das animações (aurora/espiral/typing) — é ambiental, não erro da página.
- Ao editar JS inline: conferir chaves balanceadas (`depth==0`) e nenhuma função duplicada (histórico de corrupção em `CLAUDE.md`).
- **Nunca salvar HTML via proxy Cloudflare** — ele ofusca e-mails em `data-cfemail` + script `/cdn-cgi/email-decode` que não existe no GitHub Pages → visitante vê "[email protected]" (aconteceu no contato do index; corrigido 08/07/2026).
- Este doc descreve a **realidade inline atual**. Se um dia o site adotar uma biblioteca compartilhada (`tokens.css`/`components.css`), atualize este arquivo primeiro.
