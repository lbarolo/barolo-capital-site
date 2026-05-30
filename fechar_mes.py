#!/usr/bin/env python3
"""
Barolo Capital — Script de Fechamento Mensal
Atualiza os 6 arquivos HTML com os dados novos, cria snapshot JSON e faz push.

Uso:
    python fechar_mes.py --template              # gera dados_TEMPLATE.json para preencher
    python fechar_mes.py dados.json              # atualiza arquivos
    python fechar_mes.py dados.json --dry-run    # mostra o que mudaria, sem escrever
    python fechar_mes.py dados.json --push ghp_TOKEN  # atualiza + push GitHub
"""

import json, re, sys, subprocess
from pathlib import Path
from datetime import datetime

SITE_DIR = Path(__file__).parent

# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def load(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))

def read(path):
    return Path(path).read_text(encoding='utf-8')

def write(path, content):
    Path(path).write_text(content, encoding='utf-8')

def sub(pattern, repl, text, label='', flags=0):
    """re.sub com validação — lança erro se o padrão não for encontrado."""
    result, n = re.subn(pattern, repl, text, count=1, flags=flags)
    if n == 0:
        raise ValueError(f"Padrão não encontrado [{label}]: {pattern[:100]}")
    return result

def fmt_usdt(v):
    """Formata USDT com vírgula para exibição HTML (ex: 2,000)."""
    return f"{int(v):,}"

# ─────────────────────────────────────────────────────────────────────────────
# Validações
# ─────────────────────────────────────────────────────────────────────────────

def validate(d):
    a, k = d['aave'], d['kamino']
    erros = []

    # Consistência da dívida total
    debt_calc = round(a['usdc_borrow'] + k['usdc_borrow'], 2)
    debt_info = d['derived']['total_debt']
    if abs(debt_calc - debt_info) > 1:
        erros.append(f"total_debt informado ({debt_info}) ≠ AAVE+Kamino ({debt_calc})")

    # Stables = USDT qty + USDS qty (portfólio)
    stables_calc = round(d['holdings']['USDT']['qty'] + d['holdings']['USDS']['qty'], 2)
    stables_info = d['derived']['stables_usd']
    if abs(stables_calc - stables_info) > 5:
        erros.append(f"stables_usd informado ({stables_info}) ≠ USDT+USDS ({stables_calc})")

    # Pool: result = fees - il
    pool_result = round(d['pool']['fees'] - d['pool']['il'], 2)

    # Rates razoáveis
    if not (0 < a['borrow_apy'] < 25):
        erros.append(f"AAVE borrow_apy suspeito: {a['borrow_apy']}%")
    if not (0 < k['borrow_apy'] < 25):
        erros.append(f"Kamino borrow_apy suspeito: {k['borrow_apy']}%")
    if not (0 < k['ltv'] < 77):
        erros.append(f"Kamino LTV suspeito: {k['ltv']}% (liq em 77.28%)")

    return erros, pool_result

# ─────────────────────────────────────────────────────────────────────────────
# Atualizações por arquivo
# ─────────────────────────────────────────────────────────────────────────────

def update_index(d, dry_run):
    path = SITE_DIR / 'index.html'
    txt = read(path)

    eth  = d['holdings']['ETH']['qty']
    stab = d['derived']['stables_usd']
    debt = d['derived']['total_debt']
    a_b  = d['aave']['usdc_borrow']
    k_b  = d['kamino']['usdc_borrow']

    txt = sub(r"(\{ id: 'ethereum',\s+qty:\s+)[\d.]+,",
              rf"\g<1>{eth},", txt, 'index ETH qty')

    txt = sub(r"(var STABLES_USD\s+=\s+)[\d.]+;(\s+// USDT )",
              rf"\g<1>{stab};\2", txt, 'index STABLES_USD')

    # TOTAL_DEBT linha 1 (com comentário "AAVE X USDC + Kamino Y USDC")
    txt = sub(r"(var TOTAL_DEBT\s+=\s+)[\d.]+;(\s+// AAVE [\d.]+ USDC \+ Kamino)",
              rf"\g<1>{debt};\2", txt, 'index TOTAL_DEBT L1')

    # TOTAL_DEBT linha 2 (comentário com valores dinâmicos "AAVE X + Kamino Y")
    txt = sub(r"(var TOTAL_DEBT\s+=\s+)[\d.]+;(\s+// AAVE [\d.]+ \+ Kamino [\d.]+)",
              rf"\g<1>{debt}; // AAVE {a_b} + Kamino {k_b}", txt, 'index TOTAL_DEBT L2')

    changes = [f"ETH={eth}", f"STABLES={stab}", f"DEBT={debt}"]
    if not dry_run:
        write(path, txt)
    return changes

def update_portfolio_analytics(d, dry_run):
    path = SITE_DIR / 'portfolio_analytics.html'
    txt = read(path)

    a  = d['aave']
    k  = d['kamino']
    wv = d['derived']['wealth_curve_value']

    # WEEKLY_UPDATE defi.aave
    txt = sub(r"(usdtSupplied:\s+)[\d.]+,",    rf"\g<1>{a['usdt_qty']},",   txt, 'PA usdtSupplied')
    txt = sub(r"(usdcBorrowed:\s+)[\d.]+,(\s+healthFactor)",
              rf"\g<1>{a['usdc_borrow']},\2",  txt, 'PA aave usdcBorrowed')

    # WEEKLY_UPDATE defi.kamino
    txt = sub(r"(solSupplied:\s+)[\d.]+,",     rf"\g<1>{k['sol_qty']},",    txt, 'PA solSupplied')
    txt = sub(r"(pyusdSupplied:\s+)[\d.]+,",   rf"\g<1>{k['usds_qty']},",   txt, 'PA pyusdSupplied')
    txt = sub(r"(usdcBorrowed:\s+)[\d.]+,(\s+ltv:)",
              rf"\g<1>{k['usdc_borrow']},\2",  txt, 'PA kamino usdcBorrowed')
    txt = sub(r"(ltv:\s+)[\d.]+,",             rf"\g<1>{k['ltv']},",         txt, 'PA kamino ltv')

    # Constantes de dívida
    txt = sub(r"(var AAVE_DEBT\s+=\s+)[\d.]+;",   rf"\g<1>{a['usdc_borrow']};", txt, 'PA AAVE_DEBT')
    txt = sub(r"(var KAMINO_DEBT\s+=\s+)[\d.]+;",  rf"\g<1>{k['usdc_borrow']};", txt, 'PA KAMINO_DEBT')

    # APY fallbacks no exec bar
    txt = sub(r"(_liveAaveBorrowApy\s+\|\|\s+)[\d.]+;",   rf"\g<1>{a['borrow_apy']};",  txt, 'PA aaveBorrowApy')
    txt = sub(r"(_liveKaminoBorrowApy\s+\|\|\s+)[\d.]+;",  rf"\g<1>{k['borrow_apy']};",  txt, 'PA kaminoBorrowApy')
    txt = sub(r"(_liveAaveUsdtApy\s+\|\|\s+)[\d.]+;",      rf"\g<1>{a['usdt_apy']};",    txt, 'PA aaveUsdtApy')
    txt = sub(r"(_liveKaminoSolApy\s+\|\|\s+)[\d.]+;",     rf"\g<1>{k['sol_apy']};",     txt, 'PA kaminoSolApy')
    txt = sub(r"(_liveKaminoUsdsApy\s+\|\|\s+)[\d.]+;",    rf"\g<1>{k['usds_apy']};",    txt, 'PA kaminoUsdsApy')

    # wealthCurve — substitui o último número da array values
    txt = sub(r"(values:.*,)(\d+)(\],)", rf"\g<1>{wv}\3", txt, 'PA wealthCurve', flags=re.DOTALL)

    changes = [f"Kamino={k['usdc_borrow']}@{k['borrow_apy']}%", f"wealthCurve={wv}"]
    if not dry_run:
        write(path, txt)
    return changes

def update_emprestimos(d, dry_run):
    path = SITE_DIR / 'emprestimos.html'
    txt = read(path)

    a = d['aave']
    k = d['kamino']
    ltv_fill = f"{k['ltv'] / 77.20 * 100:.1f}%"

    # ── HTML display ──
    txt = sub(r'(id="em-aave-usdt-qty"[^>]+>)[\d,]+',
              rf'\g<1>{fmt_usdt(a["usdt_qty"])}', txt, 'EM aave usdt qty')

    txt = sub(r'(id="em-aave-borrow" data-usd=")[\d.]+(")',
              rf'\g<1>{a["usdc_borrow"]}\2', txt, 'EM aave borrow data-usd')
    txt = sub(r'(id="em-aave-borrow"[^>]*>\$)[\d.]+',
              rf'\g<1>{a["usdc_borrow"]}', txt, 'EM aave borrow display')
    txt = sub(r'(id="em-aave-borrow-qty">)[\d.]+',
              rf'\g<1>{a["usdc_borrow"]}', txt, 'EM aave borrow qty')
    txt = sub(r'(id="em-aave-borrow-apy">)[\d.]+%',
              rf'\g<1>{a["borrow_apy"]}%', txt, 'EM aave borrow apy')

    txt = sub(r'(id="em-kamino-sol-qty"[^>]+>)[\d.]+',
              rf'\g<1>{k["sol_qty"]}', txt, 'EM kamino sol qty')
    txt = sub(r'(id="em-kamino-usds-qty"[^>]+>)[\d.]+',
              rf'\g<1>{k["usds_qty"]}', txt, 'EM kamino usds qty')

    txt = sub(r'(id="em-kamino-borrow" data-usd=")[\d.]+(")',
              rf'\g<1>{k["usdc_borrow"]}\2', txt, 'EM kamino borrow data-usd')
    txt = sub(r'(id="em-kamino-borrow"[^>]*>\$)[\d.]+',
              rf'\g<1>{k["usdc_borrow"]}', txt, 'EM kamino borrow display')
    txt = sub(r'(id="em-kamino-borrow-qty">)[\d.]+',
              rf'\g<1>{k["usdc_borrow"]}', txt, 'EM kamino borrow qty')
    txt = sub(r'(id="em-kamino-borrow-apy">)[\d.]+%',
              rf'\g<1>{k["borrow_apy"]}%', txt, 'EM kamino borrow apy')

    txt = sub(r'(id="em-kamino-ltv-pct"[^>]+>)[\d.]+%',
              rf'\g<1>{k["ltv"]:.2f}%', txt, 'EM kamino ltv pct')
    txt = sub(r'(id="em-kamino-ltv-lbl"[^>]+>)[\d.]+%',
              rf'\g<1>{k["ltv"]:.2f}%', txt, 'EM kamino ltv lbl')
    txt = sub(r'(id="em-kamino-ltv-fill"[^>]*width:)[\d.]+%',
              rf'\g<1>{ltv_fill}', txt, 'EM kamino ltv fill')

    # ── JS updateCollateralCards ──
    txt = sub(r'(const usdtQty = )[\d]+;', rf'\g<1>{int(a["usdt_qty"])};', txt, 'EM usdtQty')
    txt = sub(r'(const solQty\s+=\s+)[\d.]+;', rf'\g<1>{k["sol_qty"]};', txt, 'EM solQty')
    txt = sub(r'(const usdsQty = )[\d.]+;', rf'\g<1>{k["usds_qty"]};', txt, 'EM usdsQty')
    txt = sub(r'(aaveTotal - )[\d.]+\)', rf'\g<1>{a["usdc_borrow"]})', txt, 'EM aave net')
    txt = sub(r'(kaminoTotal - )[\d.]+\)', rf'\g<1>{k["usdc_borrow"]})', txt, 'EM kamino net')
    txt = sub(r'(\()[\d.]+( \/ aaveTotal \* 100)', rf'\g<1>{a["usdc_borrow"]}\2', txt, 'EM aave ltv calc')
    txt = sub(r'(\()[\d.]+( \/ kaminoTotal \* 100)', rf'\g<1>{k["usdc_borrow"]}\2', txt, 'EM kamino ltv calc')

    # ── JS updateLiqPrices ──
    txt = sub(r'(const aaveWeth = [\d.]+, aaveUsdt = )[\d]+, (aaveBorrow = )[\d.]+;',
              rf'\g<1>{int(a["usdt_qty"])}, \g<2>{a["usdc_borrow"]};', txt, 'EM liq aave')
    txt = sub(r'(const kSol = )[\d.]+, (kUsds = )[\d.]+, (kBorrow = )[\d.]+;',
              rf'\g<1>{k["sol_qty"]}, \g<2>{k["usds_qty"]}, \g<3>{k["usdc_borrow"]};', txt, 'EM liq kamino')

    # ── JS fallbacks em updateYieldCards ──
    txt = sub(r'(_liveAaveUsdtQty\s+\|\|\s+)[\d]+',   rf'\g<1>{int(a["usdt_qty"])}',   txt, 'EM fallback usdtQty')
    txt = sub(r'(_liveAaveUsdcDebt\s+\|\|\s+)[\d.]+',  rf'\g<1>{a["usdc_borrow"]}',     txt, 'EM fallback usdcDebt')
    txt = sub(r'(_liveAaveWethApy\s+\|\|\s+)[\d.]+',   rf'\g<1>{a["weth_apy"]}',        txt, 'EM fallback wethApy')
    txt = sub(r'(_liveAaveUsdtApy\s+\|\|\s+)[\d.]+',   rf'\g<1>{a["usdt_apy"]}',        txt, 'EM fallback usdtApy')
    txt = sub(r'(_liveKaminoSol\s+\|\|\s+)[\d.]+',     rf'\g<1>{k["sol_qty"]}',         txt, 'EM fallback kaminoSol')
    txt = sub(r'(_liveKaminoUsds\s+\|\|\s+)[\d.]+',    rf'\g<1>{k["usds_qty"]}',        txt, 'EM fallback kaminoUsds')
    txt = sub(r'(_liveKaminoDebt\s+\|\|\s+)[\d.]+',    rf'\g<1>{k["usdc_borrow"]}',     txt, 'EM fallback kaminoDebt')
    txt = sub(r'(_liveKaminoSolApy\s+\|\|\s+)[\d.]+',  rf'\g<1>{k["sol_apy"]}',         txt, 'EM fallback solApy')
    txt = sub(r'(_liveKaminoUsdsApy\s+\|\|\s+)[\d.]+', rf'\g<1>{k["usds_apy"]}',        txt, 'EM fallback usdsApy')

    # ── Strings de detalhe de yield ──
    txt = sub(
        r'(id="aave-supply-yield-detail">)[\d.]+ WETH @ [\d.]+% \+ [\d,]+ USDT @ [\d.]+%',
        rf'\g<1>{a["weth_qty"]} WETH @ {a["weth_apy"]}% + {fmt_usdt(a["usdt_qty"])} USDT @ {a["usdt_apy"]}%',
        txt, 'EM aave supply detail'
    )
    txt = sub(
        r'(id="aave-borrow-cost-detail">)[\d.]+ USDC @ [\d.]+%',
        rf'\g<1>{a["usdc_borrow"]} USDC @ {a["borrow_apy"]}%',
        txt, 'EM aave borrow detail'
    )
    txt = sub(
        r'(id="kamino-supply-yield-detail">)[\d.]+ SOL @ [\d.]+% \+ [\d.]+ USDS @ [\d.]+%',
        rf'\g<1>{k["sol_qty"]} SOL @ {k["sol_apy"]}% + {k["usds_qty"]} USDS @ {k["usds_apy"]}%',
        txt, 'EM kamino supply detail'
    )
    txt = sub(
        r'(id="kamino-borrow-cost-detail">)[\d.]+ USDC @ [\d.]+%',
        rf'\g<1>{k["usdc_borrow"]} USDC @ {k["borrow_apy"]}%',
        txt, 'EM kamino borrow detail'
    )

    changes = [f"AAVE={a['usdc_borrow']}@{a['borrow_apy']}%", f"Kamino={k['usdc_borrow']}@{k['borrow_apy']}%"]
    if not dry_run:
        write(path, txt)
    return changes

def update_ferramentas(d, dry_run):
    path = SITE_DIR / 'ferramentas.html'
    txt = read(path)

    a = d['aave']
    k = d['kamino']

    txt = sub(r'(aaveDebt:)[\d.]+,',  rf'\g<1>{a["usdc_borrow"]},', txt, 'FE aaveDebt')
    txt = sub(r'(aaveUSDT:)[\d]+,',   rf'\g<1>{int(a["usdt_qty"])},', txt, 'FE aaveUSDT')
    txt = sub(r'(aaveETH:)[\d.]+,',   rf'\g<1>{a["weth_qty"]},',   txt, 'FE aaveETH')
    txt = sub(r'(kamDebt:)[\d.]+,',   rf'\g<1>{k["usdc_borrow"]},', txt, 'FE kamDebt')
    txt = sub(r'(kamPYUSD:)[\d.]+,',  rf'\g<1>{k["usds_qty"]},',   txt, 'FE kamPYUSD')
    txt = sub(r'(kamSOL:)[\d.]+,',    rf'\g<1>{k["sol_qty"]},',    txt, 'FE kamSOL')

    if not dry_run:
        write(path, txt)
    return ["BASE atualizado"]

def update_relatorio(d, dry_run):
    path = SITE_DIR / 'relatorio.html'
    txt = read(path)

    a    = d['aave']
    k    = d['kamino']
    debt = d['derived']['total_debt']

    txt = sub(r'(var DEBT_TOTAL\s+=\s+)[\d.]+;', rf'\g<1>{debt};', txt, 'RE DEBT_TOTAL')

    txt = sub(r'(var AAVE_ETH_QTY=)[\d.]+,\s+(AAVE_ETH_APY=)[\d.]+;',
              rf'\g<1>{a["weth_qty"]},   \g<2>{a["weth_apy"]/100:.4f};', txt, 'RE AAVE_ETH')
    txt = sub(r'(var AAVE_USDT_QTY=)[\d]+,\s+(AAVE_USDT_APY=)[\d.]+;',
              rf'\g<1>{int(a["usdt_qty"])},  \g<2>{a["usdt_apy"]/100:.4f};', txt, 'RE AAVE_USDT')
    txt = sub(r'(var AAVE_BORROW=)[\d.]+,\s+(AAVE_BORROW_APY=)[\d.]+;',
              rf'\g<1>{a["usdc_borrow"]},  \g<2>{a["borrow_apy"]/100:.4f};', txt, 'RE AAVE_BORROW')
    txt = sub(r'(var KAM_SOL_QTY=)[\d.]+,\s+(KAM_SOL_APY=)[\d.]+;',
              rf'\g<1>{k["sol_qty"]},   \g<2>{k["sol_apy"]/100:.4f};', txt, 'RE KAM_SOL')
    txt = sub(r'(var KAM_USDS_QTY=)[\d.]+,\s+(KAM_USDS_APY=)[\d.]+;',
              rf'\g<1>{k["usds_qty"]}, \g<2>{k["usds_apy"]/100:.4f};', txt, 'RE KAM_USDS')
    txt = sub(r'(var KAM_BORROW=)[\d.]+,\s+(KAM_BORROW_APY=)[\d.]+;',
              rf'\g<1>{k["usdc_borrow"]},   \g<2>{k["borrow_apy"]/100:.4f};', txt, 'RE KAM_BORROW')

    if not dry_run:
        write(path, txt)
    return ["APYs atualizados"]

def update_pools(d, dry_run):
    path = SITE_DIR / 'pools.html'
    txt = read(path)

    a        = d['aave']
    k        = d['kamino']
    p        = d['pool']
    eth_qty  = d['holdings']['ETH']['qty']
    pool_pnl = round(p['fees'] - p['il'], 2)

    # Pool ativa no array POOLS — fees, il, result (days é calculado dinamicamente via JS)
    # Usa .*? não-greedy para atravessar o IIFE em days:(function(){...})()
    txt = sub(
        r"(pair:'WETH/USDC 0\.3%'.*?fees:)[\d.]+,(\s*il:)[\d.]+,(\s*result:)[-\d.]+,",
        rf"\g<1>{p['fees']},\g<2>{p['il']},\g<3>{pool_pnl},",
        txt, 'PO pool ativa', flags=re.DOTALL
    )

    # ETH qty no objeto QTYS da meta 5%
    txt = sub(r'(ethereum:)[\d.]+,(solana:)', rf'\g<1>{eth_qty},\g<2>', txt, 'PO QTYS ethereum')

    # Debt fallbacks
    txt = sub(r'(_liveAaveDebt \|\| )[\d.]+\)',   rf'\g<1>{a["usdc_borrow"]})', txt, 'PO aaveDebt fallback')
    txt = sub(r'(_liveKaminoDebt \|\| )[\d.]+\)', rf'\g<1>{k["usdc_borrow"]})', txt, 'PO kaminoDebt fallback')

    # Taxa de borrow AAVE para cálculo do APR líquido da pool
    txt = sub(r'(const AAVE_BORROW_RATE = )[\d.]+;', rf'\g<1>{a["borrow_apy"]};', txt, 'PO AAVE_BORROW_RATE')

    if not dry_run:
        write(path, txt)
    return [f"pool fees={p['fees']}, il={p['il']}, pnl={pool_pnl}"]

def create_snapshot(d, pool_pnl, dry_run):
    today = d.get('date', datetime.now().strftime('%Y-%m-%d'))
    month_names = {
        '01':'JANEIRO','02':'FEVEREIRO','03':'MARCO','04':'ABRIL',
        '05':'MAIO','06':'JUNHO','07':'JULHO','08':'AGOSTO',
        '09':'SETEMBRO','10':'OUTUBRO','11':'NOVEMBRO','12':'DEZEMBRO'
    }
    month_num  = today[5:7]
    month_name = month_names.get(month_num, month_num)
    dd, mm, yy = today[8:10], today[5:7], today[2:4]

    snap_dir  = SITE_DIR / 'EXPORTS SEMANAIS' / month_name
    snap_path = snap_dir / f"{dd}-{mm}-{yy}-posicoes.json"

    a, k, p = d['aave'], d['kamino'], d['pool']

    snapshot = {
        "date":              today,
        "source":            "CoinGecko + AAVE V4 + Kamino + Revert Finance",
        "portfolio_total_cg": d.get('portfolio_total_cg', 0),
        "holdings":           d.get('holdings', {}),
        "aave_v4": {
            "supply_weth":  {"qty": a['weth_qty'],    "apy_pct": a['weth_apy']},
            "supply_usdt":  {"qty": a['usdt_qty'],    "apy_pct": a['usdt_apy']},
            "borrow_usdc":  {"qty": a['usdc_borrow'], "apy_pct": a['borrow_apy']}
        },
        "kamino": {
            "supply_sol":   {"qty": k['sol_qty'],     "apy_pct": k['sol_apy']},
            "supply_usds":  {"qty": k['usds_qty'],    "apy_pct": k['usds_apy']},
            "borrow_usdc":  {"qty": k['usdc_borrow'], "apy_pct": k['borrow_apy']},
            "ltv_pct":      k['ltv'],
            "liq_ltv_pct":  77.28
        },
        "pool_weth_usdc_base": {
            "pair":       "WETH/USDC 0.3%",
            "network":    "Base",
            "token_id":   4694262,
            "open":       "2026-02-24",
            "capital":    365,
            "pooled_usd": p['pooled'],
            "fees_usd":   p['fees'],
            "il_usd":     p['il'],
            "pnl_usd":    pool_pnl,
            "range_min":  1855.72,
            "range_max":  3146.36,
            "eth_price":  d['holdings'].get('ETH', {}).get('price', 0)
        },
        "derived": d.get('derived', {})
    }

    if not dry_run:
        snap_dir.mkdir(parents=True, exist_ok=True)
        snap_path.write_text(json.dumps(snapshot, indent=2, ensure_ascii=False), encoding='utf-8')
    return str(snap_path.name)

def git_push(token, dry_run):
    if dry_run:
        print("  [dry-run] git push ignorado")
        return

    today = datetime.now().strftime('%d/%m/%Y')
    subprocess.run(['git', 'add', '-A'], cwd=SITE_DIR, capture_output=True)
    r = subprocess.run(
        ['git', 'commit', '-m', f'chore: fechamento mensal {today} — posições atualizadas'],
        cwd=SITE_DIR, capture_output=True, text=True
    )
    if r.returncode != 0 and 'nothing to commit' not in r.stdout:
        print(f"  ✗ git commit: {r.stderr.strip()}")
        return
    push_url = f"https://lbarolo:{token}@github.com/lbarolo/barolo-capital-site.git"
    r = subprocess.run(['git', 'push', push_url, 'main'], cwd=SITE_DIR, capture_output=True, text=True)
    if r.returncode == 0:
        print("  ✓ Push → barolocapital.com.br")
    else:
        print(f"  ✗ Push falhou: {r.stderr.strip()}")

# ─────────────────────────────────────────────────────────────────────────────
# Template JSON
# ─────────────────────────────────────────────────────────────────────────────

TEMPLATE = {
    "_instrucoes": "Preencha todos os campos com os valores dos prints. Remova este campo antes de rodar.",
    "date": "2026-06-20",
    "portfolio_total_cg": 0.0,
    "holdings": {
        "ETH":   {"qty": 0.0, "price": 0.0, "value": 0.0},
        "SOL":   {"qty": 0.0, "price": 0.0, "value": 0.0},
        "USDT":  {"qty": 0.0, "price": 0.9987, "value": 0.0},
        "USDS":  {"qty": 0.0, "price": 0.9996, "value": 0.0},
        "ADA":   {"qty": 375.245, "price": 0.0, "value": 0.0},
        "EIGEN": {"qty": 153.36298802, "price": 0.0, "value": 0.0},
        "POL":   {"qty": 218.0, "price": 0.0, "value": 0.0},
        "ZK":    {"qty": 876.0, "price": 0.0, "value": 0.0},
        "RDNT":  {"qty": 7290.46, "price": 0.0, "value": 0.0},
        "XAI":   {"qty": 692.86, "price": 0.0, "value": 0.0},
        "ZETA":  {"qty": 51.1434, "price": 0.0, "value": 0.0}
    },
    "aave": {
        "_fonte": "AAVE V4 → pro.aave.com",
        "weth_qty":     1.89,
        "weth_apy":     0.0,
        "usdt_qty":     2000.0,
        "usdt_apy":     0.0,
        "usdc_borrow":  0.0,
        "borrow_apy":   0.0
    },
    "kamino": {
        "_fonte": "Kamino Finance → kamino.finance",
        "sol_qty":      0.0,
        "sol_apy":      0.0,
        "usds_qty":     0.0,
        "usds_apy":     0.0,
        "usdc_borrow":  0.0,
        "borrow_apy":   0.0,
        "ltv":          0.0
    },
    "pool": {
        "_fonte": "Revert Finance → revert.finance",
        "fees":   0.0,
        "il":     0.0,
        "pooled": 0.0
    },
    "derived": {
        "_calculo": "stables = USDT qty + USDS qty | total_debt = AAVE borrow + Kamino borrow | wealth_curve_value = CG total + pool pooled - total_debt",
        "stables_usd":        0.0,
        "total_debt":         0.0,
        "wealth_curve_value": 0
    }
}

# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def main():
    args = sys.argv[1:]

    if not args or '--template' in args:
        out = SITE_DIR / 'dados_TEMPLATE.json'
        out.write_text(json.dumps(TEMPLATE, indent=2, ensure_ascii=False), encoding='utf-8')
        print(f"✓ Template gerado: {out.name}")
        print("  1. Preencha os valores com os dados dos prints")
        print("  2. Rode: python fechar_mes.py dados_TEMPLATE.json")
        print("  3. Para push: python fechar_mes.py dados_TEMPLATE.json --push ghp_TOKEN")
        return

    data_path = args[0]
    dry_run   = '--dry-run' in args
    token     = None
    if '--push' in args:
        idx = args.index('--push')
        if idx + 1 < len(args):
            token = args[idx + 1]

    prefix = '[DRY RUN] ' if dry_run else ''
    print(f"\n{prefix}Barolo Capital — Fechamento Mensal")
    print(f"Dados: {data_path}")
    print("─" * 55)

    d = load(data_path)

    # Validação
    erros, pool_pnl = validate(d)
    if erros:
        print("\n⚠ AVISOS:")
        for e in erros:
            print(f"  • {e}")

    # Atualiza arquivos
    print("\nAtualizando arquivos:")
    files = [
        ("index.html",               update_index),
        ("portfolio_analytics.html", update_portfolio_analytics),
        ("emprestimos.html",         update_emprestimos),
        ("ferramentas.html",         update_ferramentas),
        ("relatorio.html",           update_relatorio),
        ("pools.html",               update_pools),
    ]
    for name, fn in files:
        try:
            changes = fn(d, dry_run)
            print(f"  ✓ {name} — {', '.join(changes)}")
        except ValueError as e:
            print(f"  ✗ {name} — {e}")

    # Snapshot
    snap = create_snapshot(d, pool_pnl, dry_run)
    print(f"  ✓ Snapshot: {snap}")

    # Push
    if token:
        print("\nFazendo push:")
        git_push(token, dry_run)
    else:
        msg = 'Para publicar: python fechar_mes.py ' + data_path + ' --push ghp_TOKEN'
        print('  ' + msg)

    suffix = '[DRY RUN] ' if dry_run else ''
    print(suffix + 'Concluido!')

if __name__ == '__main__':
    main()
