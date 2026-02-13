---
title: 투자 성과 지표
parent: 투자
nav_order: 14
description: 트레이딩 백테스트에서 사용하는 15가지 핵심 성과 지표(Win Rate, Profit Factor, Sharpe, Sortino, Calmar, MDD 등)의 정의, 공식, 해석 기준을 정리합니다.
---

# 백테스트 성과 지표 완전 가이드
{:.no_toc}

스윙 트레이딩 백테스트 시스템에서 사용하는 주요 투자 성과 지표와 추가로 고려할 지표들을 정리합니다. 각 지표의 정의, 계산 공식, 해석 기준(참고치 포함)을 다룹니다.

### Link

- [QuantifiedStrategies - Trading Performance Metrics](https://www.quantifiedstrategies.com/trading-performance/)
- [LuxAlgo - Top 7 Metrics for Backtesting](https://www.luxalgo.com/blog/top-7-metrics-for-backtesting-results/)
- [Wall Street Prep - Sortino Ratio](https://www.wallstreetprep.com/knowledge/sortino-ratio/)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 지표 분류 개요

성과 지표는 측정 대상에 따라 네 가지로 분류할 수 있습니다.

| 분류 | 지표 | 핵심 질문 |
|------|------|----------|
| **수익성** | Win Rate, Profit Factor, Total PnL, Avg PnL, Expectancy | 돈을 벌고 있는가? |
| **위험 조정 수익** | Sharpe, Sortino, Calmar, Martin Ratio | 위험 대비 적절한 수익인가? |
| **위험/드로다운** | MDD, Ulcer Index, Max Consecutive Losses | 최악의 상황은 어떤가? |
| **거래 품질** | Payoff Ratio, Risk-Reward Ratio, Recovery Factor | 개별 거래와 전략의 질은 어떤가? |

---

## 1. Win Rate (승률)

전체 거래 중 수익을 낸 거래의 비율입니다.

```
Win Rate = 수익 거래 수 / 전체 거래 수 × 100%
```

### 해석 기준

| 등급 | 범위 | 설명 |
|------|------|------|
| 낮음 | < 40% | 트렌드 팔로잉 전략에서는 정상 범위 |
| 보통 | 40~50% | 높은 Payoff Ratio와 결합 시 수익 가능 |
| 양호 | 50~60% | 스윙 트레이딩의 일반적 범위 |
| 우수 | 60~70% | 우수한 수준 |
| 주의 | > 80% | 과최적화(overfitting) 가능성 의심 |

**핵심**: 승률 단독으로는 전략 수익성을 판단할 수 없습니다. 반드시 Payoff Ratio(평균 수익/평균 손실)와 함께 평가해야 합니다. 승률이 30%여도 Payoff Ratio가 3:1 이상이면 수익이 가능합니다.

---

## 2. Profit Factor (수익 팩터)

총 수익금(Gross Profit)을 총 손실금(Gross Loss)으로 나눈 비율입니다. 단일 지표로 전략의 전체적인 수익성을 판단하기에 가장 유용한 지표입니다.

```
Profit Factor = Gross Profit / Gross Loss
```

승률과 Payoff Ratio로도 표현할 수 있습니다:

```
Profit Factor = (Win Rate × Avg Win) / ((1 - Win Rate) × Avg Loss)
```

### 해석 기준

| 등급 | 범위 | 설명 |
|------|------|------|
| 손실 | < 1.0 | 전략이 돈을 잃고 있음 |
| 손익분기 | 1.0 | 수익 = 손실 |
| 최소 허용 | 1.0~1.5 | 미약한 수익성, 개선 필요 |
| 양호 | 1.5~2.0 | 실전 투입 고려 가능 |
| 우수 | 2.0~3.0 | 강력한 전략 |
| 주의 | > 4.0 | 과최적화 가능성 의심 |

**실전 기준**: 최소 1.5 이상, 이상적으로 1.75~2.0 이상을 목표로 합니다.

---

## 3. Maximum Drawdown (MDD, 최대 낙폭)

자본 곡선(Equity Curve)에서 고점 대비 저점까지의 최대 하락 비율입니다. 전략이 감내해야 할 최악의 손실 구간을 나타냅니다.

```
MDD = (저점 - 고점) / 고점 × 100%
```

### 드로다운 vs 회복 필요 수익률

드로다운과 회복의 비대칭성을 이해하는 것이 중요합니다:

| 드로다운 | 회복 필요 수익률 |
|----------|------------------|
| -10% | +11.1% |
| -20% | +25.0% |
| -30% | +42.9% |
| -50% | +100.0% |

### 해석 기준

| 등급 | 범위 | 설명 |
|------|------|------|
| 우수 | < 10% | 매우 보수적이고 안정적 |
| 양호 | 10~20% | 스윙 트레이딩에서 수용 가능 |
| 보통 | 20~30% | 심리적 압박 발생 가능 |
| 위험 | 30~50% | 대부분의 트레이더가 포기하는 구간 |
| 치명적 | > 50% | 회복이 극히 어려움 |

**실전 기준**: 20~25% 이하 유지가 권장되며, 최적 목표는 15% 이하입니다. MDD는 전략의 심리적 실행 가능성과 직결됩니다.

---

## 4. Sharpe Ratio (샤프 비율)

무위험 수익률 대비 초과 수익을 변동성(표준편차)으로 나눈 위험 조정 수익률 지표입니다.

```
Sharpe Ratio = (R_p - R_f) / σ_p

  R_p = 전략 수익률
  R_f = 무위험 수익률
  σ_p = 수익률의 표준편차

연율화 (1시간 캔들 기준):
  Annualized Sharpe = Sharpe × √8760
```

### 해석 기준

| 등급 | 범위 | 설명 |
|------|------|------|
| 부적절 | < 0 | 무위험 수익률보다 낮은 성과 |
| 미흡 | 0~0.5 | 위험 대비 보상 부족 |
| 보통 | 0.5~1.0 | 수용 가능하지만 개선 여지 있음 |
| 양호 | 1.0~2.0 | 프로 트레이더 목표 범위 |
| 우수 | 2.0~3.0 | 매우 우수한 위험 조정 수익 |
| 탁월 | > 3.0 | 과적합 가능성 점검 필요 |

**한계**: 상방 변동성(큰 수익)도 패널티로 반영하기 때문에, 간헐적으로 큰 수익이 발생하는 전략에서는 부정확할 수 있습니다. 이 한계를 보완하는 것이 Sortino Ratio입니다.

---

## 5. Average PnL per Trade (거래당 평균 손익)

전체 거래의 평균 수익/손실입니다.

```
Avg PnL = Total Net Profit / Total Number of Trades
```

양수여야 전략이 수익성이 있으며, 절대 금액보다는 자본 대비 비율(%)로 해석하는 것이 적합합니다. 거래 빈도와 함께 해석해야 합니다: Avg PnL이 작아도 거래 빈도가 높으면 총 수익이 크고, 반대의 경우도 있습니다.

---

## 6. Payoff Ratio (보상 비율, Avg Win / Avg Loss)

수익 거래의 평균 금액과 손실 거래의 평균 금액의 비율입니다.

```
Payoff Ratio = Average Winning Trade / Average Losing Trade
```

### Risk-Reward Ratio와의 차이

| 구분 | Risk-Reward Ratio | Payoff Ratio |
|------|------------------|--------------|
| 성격 | 사전 계획 (pre-trade) | 사후 결과 (post-trade) |
| 기준 | TP/SL 설정 거리 | 실제 Avg Win / Avg Loss |
| 의미 | 얼마를 걸고 얼마를 노리는가 | 실제로 얼마를 벌고 얼마를 잃었는가 |

### 해석 기준

| 등급 | 범위 | 설명 |
|------|------|------|
| 불리 | < 1.0 | 평균 손실이 평균 수익보다 큼 (높은 승률 필요) |
| 균형 | 1.0~1.5 | 50% 이상 승률과 결합 시 수익 가능 |
| 양호 | 1.5~2.0 | 40% 승률에서도 수익 가능 |
| 우수 | 2.0~3.0 | 트렌드 팔로잉에서 양호한 수준 |
| 탁월 | > 3.0 | 매우 우수하지만 승률이 낮을 수 있음 |

**관계식**: 세 지표(Win Rate, Payoff Ratio, Profit Factor) 중 두 개를 알면 나머지를 산출할 수 있습니다:
```
Profit Factor = (Win Rate × Payoff Ratio) / (1 - Win Rate)
```

---

## 7. Total PnL (총 손익)

전체 기간 동안 발생한 총 수익 또는 손실입니다.

```
Total PnL = Σ(각 거래의 PnL)
Cumulative Return = (최종 자본 - 초기 자본) / 초기 자본 × 100%
```

단독으로는 한계가 있습니다. 같은 Total PnL +100%라도 MDD 10%인 전략과 MDD 60%인 전략은 전혀 다른 품질입니다. 기간, 거래 횟수, MDD와 함께 해석해야 합니다.

---

## 8. Risk-Reward Ratio (위험-보상 비율)

각 거래에서 사전에 설정한 손절(SL) 대비 목표 수익(TP)의 비율입니다.

```
Risk-Reward Ratio = TP 거리 / SL 거리

ATR 기반 예시:
  SL = Entry - (ATR × SL_multiplier)
  TP = Entry + (ATR × TP_multiplier)
  RR = TP_multiplier / SL_multiplier
```

### RR 비율별 손익분기 승률

| RR 비율 | 손익분기 승률 |
|---------|--------------|
| 1:1 | 50.0% |
| 1.5:1 | 40.0% |
| 2:1 | 33.3% |
| 3:1 | 25.0% |

---

## 9. Sortino Ratio (소르티노 비율)

Sharpe Ratio의 개선 버전으로, 전체 변동성 대신 **하방 변동성(Downside Deviation)만**을 위험 척도로 사용합니다. 큰 수익이 패널티가 되지 않습니다.

```
Sortino Ratio = (R_p - R_target) / σ_downside

  R_target = 목표 수익률 (보통 0% 또는 무위험 수익률)
  σ_downside = √[Σ min(R_i - R_target, 0)² / N]
```

### Sharpe vs Sortino 비교

| 항목 | Sharpe | Sortino |
|------|--------|---------|
| 위험 정의 | 전체 변동성 (상방+하방) | 하방 변동성만 |
| 큰 수익의 효과 | 페널티로 작용 | 무시 (긍정적) |
| 적합 대상 | 대칭적 수익 분포 | 비대칭적 수익 분포 (트레이딩) |

### 해석 기준

| 등급 | 범위 | 설명 |
|------|------|------|
| 부적절 | < 0 | 목표 수익률 미달 |
| 미흡 | 0~1.0 | 하방 위험 대비 수익 부족 |
| 양호 | 1.0~2.0 | 양호한 하방 위험 조정 수익 |
| 우수 | 2.0~3.0 | 우수 |
| 탁월 | > 3.0 | 탁월 |

**실전 기준**: Sortino 2.0은 대략 Sharpe 1.0~1.5에 해당합니다. 간헐적으로 큰 수익이 발생하는 스윙 트레이딩에서 Sharpe보다 더 정확한 평가를 제공합니다.

---

## 10. Calmar Ratio (칼마 비율)

연율화 수익률(Annualized Return)을 최대 낙폭(MDD)으로 나눈 비율입니다. 최악의 손실 대비 연간 수익성을 평가합니다.

```
Calmar Ratio = Annualized Return / |Maximum Drawdown|
```

### 해석 기준

| 등급 | 범위 | 설명 |
|------|------|------|
| 미흡 | < 0.5 | 드로다운 대비 수익 부족 |
| 보통 | 0.5~1.0 | 수용 가능하나 개선 여지 |
| 양호 | 1.0~2.0 | 양호한 위험-수익 균형 |
| 우수 | 2.0~3.0 | 우수한 전략 |
| 엘리트 | > 3.0 | 최상위 (현실적으로 매우 드묾) |

**위치 선정**: Sharpe/Sortino가 일상적 변동성을 측정한다면, Calmar는 극단적 손실(MDD)에 초점을 맞춥니다. 헤지펀드 및 CTA(Commodity Trading Advisor) 평가에서 널리 사용됩니다.

---

## 11. Recovery Factor (회복 팩터)

순 수익을 최대 낙폭(MDD)으로 나눈 비율입니다. 전략의 최악의 손실 극복 능력을 나타냅니다.

```
Recovery Factor = |Net Profit| / |Maximum Drawdown|
```

### 해석 기준

| 등급 | 범위 | 설명 |
|------|------|------|
| 미흡 | < 1.0 | 순 수익이 최대 손실을 만회하지 못함 |
| 최소 | 1.0~2.0 | 최소한의 회복 능력 |
| 양호 | 2.0~5.0 | 양호한 복원력 |
| 우수 | 5.0~10.0 | 매우 강건한 전략 |
| 탁월 | > 10.0 | 탁월한 복원력 |

**주의**: Calmar Ratio와 유사하지만 연율화하지 않습니다. 백테스트 기간이 길어지면 자연적으로 Recovery Factor가 높아지므로, 반드시 테스트 기간을 함께 명시해야 합니다.

---

## 12. Expectancy (기대값)

한 번의 거래에서 기대할 수 있는 평균 수익/손실입니다. 전략의 장기적 수익성을 단일 숫자로 표현합니다.

```
Expectancy = (Win Rate × Avg Win) - (Loss Rate × Avg Loss)
```

R-multiple(리스크 단위) 기준으로 정규화하면:

```
Expectancy (R) = (Win Rate × Payoff Ratio) - (1 - Win Rate)
```

### 계산 예시

```
Win Rate = 45%, Avg Win = $300, Avg Loss = $150

Expectancy = (0.45 × $300) - (0.55 × $150)
           = $135 - $82.5
           = $52.5 per trade
```

양수면 거래를 반복할수록 수익이 누적되고, 음수면 장기적으로 손실이 누적됩니다. R-multiple 기준 0.2R 이상이면 양호한 전략입니다.

**Kelly Criterion과의 연관**:

```
Kelly % = W - [(1 - W) / R]    (W = 승률, R = Payoff Ratio)

실전에서는 Full Kelly의 25~50%만 사용 (Fractional Kelly)
→ 과도한 드로다운 방지
```

---

## 13. Maximum Consecutive Losses (최대 연속 손실)

백테스트 기간 동안 연속으로 발생한 손실 거래의 최대 횟수입니다.

### 확률적 추정 공식

```
N거래 중 최대 연속 손실 기대값 ≈ log(N) / log(1 / (1 - Win Rate))
```

### 승률별 예상 연속 손실 (100회 거래 기준)

| 승률 | 예상 최대 연속 손실 |
|------|---------------------|
| 40% | 약 9~11회 |
| 50% | 약 6~8회 |
| 55% | 약 5~7회 |
| 60% | 약 4~6회 |
| 70% | 약 3~4회 |

### 연속 손실과 드로다운의 관계

| 거래당 리스크 | 5연속 손실 | 10연속 손실 |
|--------------|-----------|------------|
| 1% | -4.9% | -9.6% |
| 2% | -9.6% | -18.3% |
| 5% | -22.6% | -40.1% |

**핵심**: Risk of Ruin(파산 확률)을 0에 가깝게 유지하려면 거래당 자본의 1~2%만 리스크로 설정하는 것이 권장됩니다.

---

## 14. Ulcer Index (궤양 지수)

드로다운의 **깊이(depth)와 지속 기간(duration)**을 모두 반영하는 하방 변동성 지표입니다. 이름은 투자자가 드로다운 시 느끼는 스트레스에서 유래했습니다.

```
Step 1: Percent_Drawdown_i = (Close_i - 14기간 최고가) / 14기간 최고가 × 100
Step 2: Squared_Average = Σ(Percent_Drawdown_i²) / 14
Step 3: Ulcer Index = √(Squared_Average)
```

**Martin Ratio** (Ulcer Performance Index):

```
Martin Ratio = (R_p - R_f) / Ulcer Index
→ Sharpe Ratio와 유사하지만, 분모를 표준편차 대신 Ulcer Index 사용
```

### 해석 기준

| 등급 | 범위 | 설명 |
|------|------|------|
| 매우 안정 | 0~2 | 극히 낮은 하방 위험 |
| 안정 | 2~5 | 낮은 하방 위험 |
| 보통 | 5~10 | 중간 수준 (주의 필요) |
| 위험 | 10~20 | 상당한 하방 위험 |
| 매우 위험 | > 20 | 심각한 드로다운 발생 중 |

**MDD와의 차이**: MDD는 드로다운의 최대 깊이만 보여주지만, Ulcer Index는 기간까지 반영합니다. MDD가 같은 -20%라도 3일 회복 vs 60일 지속은 Ulcer Index 값이 크게 다릅니다.

---

## 15. 종합 평가 기준표

스윙 트레이딩 백테스트 결과를 종합 평가할 때 사용하는 기준표입니다.

| 지표 | 최소 기준 | 양호 | 우수 |
|------|----------|------|------|
| Win Rate | > 35% | 45~55% | > 55% |
| Profit Factor | > 1.5 | 1.75~2.5 | > 2.5 |
| MDD | < 30% | < 20% | < 10% |
| Sharpe Ratio | > 0.5 | > 1.0 | > 2.0 |
| Sortino Ratio | > 0.5 | > 1.5 | > 2.5 |
| Calmar Ratio | > 0.5 | > 1.0 | > 2.0 |
| Recovery Factor | > 2.0 | > 5.0 | > 10.0 |
| Expectancy | > 0 | > 0.1R | > 0.3R |
| Payoff Ratio | > 1.0 | > 1.5 | > 2.0 |
| Max Consecutive Losses | < 15 | < 10 | < 6 |
| Ulcer Index | < 10 | < 5 | < 2 |

---

## 핵심 원칙

1. **단일 지표에 의존하지 않기**: 여러 분류의 지표를 교차 검증하여 전략의 일관성을 확인해야 합니다.
2. **과적합에 주의**: 백테스트에서 모든 지표가 "탁월"한 경우 오히려 과최적화를 의심해야 합니다.
3. **거래 비용 반영**: 수수료, 슬리피지를 포함한 후 지표를 계산해야 실전에 의미 있습니다.
4. **통계적 유의성 확보**: 최소 100회 이상의 거래로 지표를 산출해야 신뢰할 수 있습니다.
5. **Sharpe보다 Sortino 선호**: 트레이딩 전략처럼 비대칭 수익 분포에서는 Sortino가 더 정확합니다.

<!--
  참고: src/prediction/swing_backtest.py (BacktestMetrics)
  참고: src/prediction/swing_analysis.py (AnalysisBacktestEngine)
  작성일: 2026-02-13
-->
