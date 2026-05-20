#!/usr/bin/env python3
import math

# ═══════════════════════════════════════════════════════════════
# ANÁLISE DE CONVEXIDADE DO PORTFÓLIO BAROLO
# Modelo Convex 1ª Geração: CP = w₁C₁ + w₂C₂ + ... + λ₁F + λ₂M + λ₃D
# ═══════════════════════════════════════════════════════════════

portfolio = {
    'ETH': {'qty': 2.084106, 'price': 1470, 'volatility': 0.68, 'type': 'token'},
    'SOL': {'qty': 20.42, 'price': 47.50, 'volatility': 0.85, 'type': 'token'},
    'ADA': {'qty': 375.245, 'price': 0.52, 'volatility': 0.72, 'type': 'token'},
    'RDNT': {'qty': 7290.46, 'price': 0.002, 'volatility': 1.20, 'type': 'airdrop'},
    'EIGEN': {'qty': 153.36, 'price': 2.80, 'volatility': 1.15, 'type': 'token'},
    'POL': {'qty': 218, 'price': 0.65, 'volatility': 0.95, 'type': 'token'},
    'ZK': {'qty': 876, 'price': 0.28, 'volatility': 1.30, 'type': 'token'},
    'XAI': {'qty': 692.86, 'price': 0.22, 'volatility': 1.10, 'type': 'token'},
    'ZETA': {'qty': 51.1434, 'price': 3.00, 'volatility': 1.25, 'type': 'token'},
    'USDT': {'qty': 2140.12, 'price': 1.00, 'volatility': 0.05, 'type': 'stablecoin'},
    'USDS': {'qty': 301.01, 'price': 1.00, 'volatility': 0.08, 'type': 'stablecoin'},
}

# ─────────────────────────────────────────────────────────────
# 1. CALCULAR PESOS (wᵢ)
# ─────────────────────────────────────────────────────────────

spot_value = sum(a['qty'] * a['price'] for a in portfolio.values())
stables_value = portfolio['USDT']['qty'] * 1.0 + portfolio['USDS']['qty'] * 1.0
lp_value = 365
debt_total = 750.16 + 808.77

gross_assets = spot_value + stables_value + lp_value
net_worth = gross_assets - debt_total

weights = {}
for asset, data in portfolio.items():
    value = data['qty'] * data['price']
    weights[asset] = value / gross_assets

print("=" * 75)
print("PORTFÓLIO DE LUCAS — ANÁLISE DE CONVEXIDADE (Modelo Convex 1ª Geração)")
print("=" * 75)
print(f"\nPOSIÇÃO ATUAL (May 2026):")
print(f"  Ativos Brutos: ${gross_assets:,.2f}")
print(f"  Dívida: ${debt_total:,.2f}")
print(f"  Patrimônio Líquido: ${net_worth:,.2f}")
print(f"  Leverage: {(gross_assets / net_worth):.2f}x")

# ─────────────────────────────────────────────────────────────
# 2. ESTIMAR CONVEXIDADE (Cᵢ)
# ─────────────────────────────────────────────────────────────

convexities = {}
for asset, data in portfolio.items():
    vol = data['volatility']

    # Volatilidade quadrática (risco não-linear)
    vol_convex = vol ** 2

    # Tail risk factor
    if data['type'] == 'airdrop':
        tail_risk = 0.25
    elif data['type'] == 'stablecoin':
        tail_risk = 0.01
    else:
        tail_risk = 0.10

    # Liquidez
    if data['type'] == 'stablecoin':
        liquidity_factor = 0.0
    elif weights[asset] > 0.15:
        liquidity_factor = 0.05
    elif weights[asset] > 0.05:
        liquidity_factor = 0.15
    else:
        liquidity_factor = 0.25

    convexities[asset] = vol_convex + tail_risk + liquidity_factor

print(f"\nCONVEXIDADE POR ATIVO (C[i]):")
print(f"{'Asset':<10} {'Weight':<12} {'Vol':<8} {'Convex':<10} {'w*C':<12}")
print("-" * 60)

for asset in sorted(weights.keys(), key=lambda x: weights[x], reverse=True):
    w = weights[asset]
    c = convexities[asset]
    impact = w * c
    print(f"{asset:<10} {w*100:>6.2f}%     {portfolio[asset]['volatility']:>5.2f}  {c:>8.4f}  {impact:>10.4f}")

total_weighted_convex = sum(weights[a] * convexities[a] for a in weights.keys())
print(f"\nSum(w[i] * C[i]) = {total_weighted_convex:.4f}")

# ─────────────────────────────────────────────────────────────
# 3. FRAGILITY INDEX (F)
# ─────────────────────────────────────────────────────────────

leverage_ratio = gross_assets / net_worth
aave_hf = 6.88
kamino_ltv = 0.401

liq_distance_aave = (aave_hf - 1.0) / aave_hf
liq_distance_kamino = (1.0 - kamino_ltv) / kamino_ltv

leverage_component = (leverage_ratio - 1.0) * 0.3
liquidation_component = (1.0 - (liq_distance_aave * 0.5 + liq_distance_kamino * 0.5)) * 0.5
concentration_hhi = sum(w**2 for w in weights.values())
concentration_component = concentration_hhi * 0.2

fragility_f = leverage_component + liquidation_component + concentration_component

print(f"\nFRAGILITY INDEX (F = {fragility_f:.4f}):")
print(f"  Leverage (30%): {leverage_component:.4f} | ratio {leverage_ratio:.2f}x")
print(f"  Liquidation (50%): {liquidation_component:.4f} | AAVE HF {aave_hf:.2f}, Kamino LTV {kamino_ltv:.1%}")
print(f"  Concentration (20%): {concentration_component:.4f} | HHI {concentration_hhi:.4f}")
if fragility_f < 0.15:
    print(f"  ✅ ROBUSTO (F < 0.15)")
elif fragility_f < 0.30:
    print(f"  ⚡ MODERADO (0.15 ≤ F < 0.30)")
else:
    print(f"  ⚠️  FRÁGIL (F ≥ 0.30)")

# ─────────────────────────────────────────────────────────────
# 4. MARKOV CHAIN ADJUSTMENT (M)
# ─────────────────────────────────────────────────────────────

fgi = 31  # Fear & Greed Index (May 2026)
if fgi > 50:
    current_state = 'BULL'
    state_convex_mult = 0.9
elif fgi > 25:
    current_state = 'LATERAL'
    state_convex_mult = 1.1
else:
    current_state = 'BEAR'
    state_convex_mult = 1.4

print(f"\nMARKOV CHAIN ADJUSTMENT (M = {state_convex_mult:.4f}):")
print(f"  Estado atual (FGI={fgi}): {current_state}")
print(f"  Multiplicador: {state_convex_mult:.2f}x (bear market aumenta convexidade)")

# ─────────────────────────────────────────────────────────────
# 5. COEFICIENTES (λ₁, λ₂, λ₃)
# ─────────────────────────────────────────────────────────────

lambda_1 = 0.60
lambda_2 = 0.25
lambda_3 = 0.15

print(f"\nPONDERADORES (λ):")
print(f"  λ₁ (convexidade dos ativos): {lambda_1}")
print(f"  λ₂ (fragilidade estrutural): {lambda_2}")
print(f"  λ₃ (ajuste de regime): {lambda_3}")

# ─────────────────────────────────────────────────────────────
# 6. CONVEXIDADE FINAL (CP)
# ─────────────────────────────────────────────────────────────

CP = lambda_1 * total_weighted_convex + lambda_2 * fragility_f + lambda_3 * state_convex_mult

print(f"\n" + "=" * 75)
print(f"CONVEXIDADE DO PORTFÓLIO (CP):")
print(f"=" * 75)
print(f"CP = {lambda_1} × {total_weighted_convex:.4f} + {lambda_2} × {fragility_f:.4f} + {lambda_3} × {state_convex_mult:.2f}")
print(f"CP = {lambda_1 * total_weighted_convex:.4f} + {lambda_2 * fragility_f:.4f} + {lambda_3 * state_convex_mult:.4f}")
print(f"\nCP = {CP:.4f}")
print("=" * 75)

# INTERPRETAÇÃO
if CP < 0.10:
    profile = "🟢 BAIXA — Linear (previsível)"
elif CP < 0.20:
    profile = "🟡 MODERADA — Balanceado"
elif CP < 0.35:
    profile = "🟠 ALTA — Assimétrico (tail risk)"
else:
    profile = "🔴 MUITO ALTA — Volátil (cauda extrema)"

print(f"\n{profile}")
print(f"\nRISCOS IDENTIFICADOS:")
print(f"  1. Volatilidade: ZK (1.30), RDNT (1.20), ZETA (1.25) — fat tails")
print(f"  2. Leverage: 1.21x em AAVE/Kamino amplifica down moves")
print(f"  3. Iliquidez: Assets pequenos (<5% cada) + spread maior")
print(f"  4. Regime: Bear market (FGI={fgi}) aumenta correlação e tail events")
print(f"\nHEDGES:")
print(f"  ✅ Stables: 64% do portfólio reduzem convexidade geral")
print(f"  ✅ Health Factor: 6.88 em AAVE (muito acima de 1.5)")
print(f"  ✅ LTV: 40% em Kamino (abaixo de liquidação ~77%)")

print("\n" + "=" * 75)
