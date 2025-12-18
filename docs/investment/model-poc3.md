---
title: DAY TRADING용 평가 모델
parent: 투자
nav_order: 8
---

# DAY TRADING용 평가 모델 구성
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## Target

- 피쳐 엔지니어링은 앞단에서 얼추 함.
- 가격예 예측은 무작위성과 노이즈가 커서 사실상 패턴 학습이 활용에 유효한 수준에 미치지 못함.
- 출력 및 목적함수를 최적화해서 예외적으로 수익률이 좋은 케이스만 골라내는 평가모델로 변경.

---

## 핵심 아이디어

### 1) PnL 중심 평가/학습으로 전환

- 종가(level) 자체를 맞추기보다는 **포지션을 취했을 때의 기대 수익(=PnL)**을 중심으로 모델을 설계한다.
- 기본 방향:
  - **평가 지표**: 정확도(accuracy) → **거래 성과(PnL, Sharpe, MDD 등)**
  - **학습 목표**: 방향/변동성 분류 → **선택적 트레이딩 + 리스크 추정 + PnL 최적화**

#### 목적함수(권장)

- PnL을 주목표로 두고, 분포/리스크/의사결정 품질을 위한 보조 손실을 함께 둔다.

\[
L_{total} = L_{pnl} + \alpha \cdot L_{reg/quantile} + \beta \cdot L_{gate/action}
\]

- \(L_{pnl}\): 포지션을 취했을 때의 기대 PnL을 최대화(손실은 음수 기대값 등으로 구성)
- \(L_{reg/quantile}\): 분포/리스크 안정화(quantile 또는 기존 reg)
- \(L_{gate/action}\): 언제/어떻게 거래할지(선택적 트레이딩) 품질 개선

---

### 2) 선택적 트레이딩: Action 헤드 + Gate(Trade/No-trade) 헤드

> 목표: 모든 시점에 방향을 찍지 않고, **거래할 만한 구간만** 골라서 LONG/SHORT를 선택

#### 출력 설계

- **Gate head**: `P(trade)` (0~1)
- **Action head**: `P(NO_TRADE)`, `P(LONG)`, `P(SHORT)`

#### 라벨(예시)

- `ret = close_ret_pct` (t 대비 t+H 수익률, %)
- 거래 비용(수수료+슬리피지): `c` (%)
- `pnl_long = ret - c`
- `pnl_short = -ret - c`
- `best = max(pnl_long, pnl_short)`
- `gate = 1` if `best >= edge_threshold` else `0`
- `action = argmax([0, pnl_long, pnl_short])`  (gate=0일 때 NO_TRADE 유도)

#### 손실 설계 포인트

- `L_gate`: BCE (필요하면 class weight / focal loss 적용)
- `L_action`: CE
  - 붕괴 방지: **gate=1인 샘플에서만 action loss를 강하게**
    - 예: `L_action_weighted = gate * CE(action)`

---

### 3) min/max를 “변동성 감지”가 아니라 “리스크/TP·SL 확률”로 사용: Quantile로 전환

> 목표: min/max 예측을 단순한 변동성 여부가 아니라 **리스크(손실 tail)와 TP/SL 도달 가능성** 추정에 사용

#### 출력 설계(예시)

- close / min / max 각각에 대해 분위수 예측
  - `q10, q50, q90` (또는 q05/q50/q95)

#### 손실

- **Pinball loss(Quantile loss)**
  - `q90`은 과소예측(실제>예측)을 더 크게 벌해 상단 tail을 학습
  - `q10`은 과대예측을 더 크게 벌해 하단 tail을 학습

#### 활용(예시)

- Long 기준:
  - `min_q10`이 SL(-0.5%)보다 훨씬 낮으면 → 하방 tail 위험 큼(거래 회피)
  - `max_q50`가 TP(+0.8%) 이상이면 → TP 가능성이 높아 거래 후보
- Gate/Action과 결합:
  - `gate`가 높고, `q` 기반 리스크 조건을 만족하는 케이스만 실행

> NOTE: Quantile crossing(q10 ≤ q50 ≤ q90) 방지를 위해 출력 파라미터화를 고려

---

### 4) 목표를 수익률이 아니라 “포지션 PnL 분위수”로

> 목표: 시장 수익률 분포가 아니라 **포지션(롱/숏) 수익 분포**를 직접 예측해 의사결정에 연결

#### PnL 타깃 정의(가장 단순)

- `pnl_long_pct = close_ret_pct - c`
- `pnl_short_pct = -close_ret_pct - c`

#### 출력 설계(예시)

- Long PnL: `q10, q50, q90`
- Short PnL: `q10, q50, q90`

#### 의사결정 예시

- 리스크 제한:
  - 선택한 포지션의 `q10 > -risk_limit` 조건을 만족할 때만 거래
- 수익 선택:
  - 조건을 만족하는 포지션 중 `q50`가 더 큰 쪽(LONG vs SHORT)을 선택
- 선택적 실행:
  - `gate` 상위 구간(예: top-k%)에서만 실행하여 precision@k 형태로 운영

---

### 5) 평가 지표를 “정확도”에서 “트레이딩 성과”로 전환

- **Coverage**: 거래 비율(= gate=1 비율 또는 |position|>임계 비율)
- **Expected PnL / Trade**: 비용 포함 평균 거래 수익
- **Hit rate**: 수익 난 거래 비율
- **Profit factor / Sharpe / Max Drawdown(MDD)**
- **Precision@k**: 확신도 상위 k%만 거래했을 때 성과
- **Quantile 품질**:
  - Calibration: `P(y <= q90) ≈ 0.9` 등
  - Sharpness: 구간폭(`q90-q10`) vs coverage 균형

---

## 적용 로드맵(단계적 개선)

1. **Action + Gate 헤드 추가** → 선택적 트레이딩 구조 확립
2. **PnL 중심 평가 지표 도입** (coverage, PnL/trade, precision@k)
3. **close/min/max를 quantile로 전환** → 리스크/TP·SL 판단 강화
4. **PnL quantile로 타깃 전환** → 전략 성과에 직접 최적화
5. \(\alpha, \beta\) 튜닝 및 레짐/정규화 적용(필요 시)

