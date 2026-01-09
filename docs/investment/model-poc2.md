---
title: DAY TRADING용 예측 모델
parent: 투자
nav_order: 7
description: "BTC DAY TRADING 예측 모델. 15분봉 LSTM으로 단기 가격 예측. 87개 피쳐(가격, 추세, 선물 프리미엄, OI, FR) 엔지니어링. 2~4 클래스 분류 실험 결과."
---

# DAY TRADING 모델 구성
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## Target

- BTC, ETH
- XRP, SOL, ADA, ZEC, DOGE
- 당초 계획은 BTC, ETH 대상 SWING MODEL이 잘 작동하면 변동성이 높은 알트를 대상으로 더 짧은 시간으로 모델을 구성해 보는 것이었으나, 경향성을 품을 만한 피쳐가 가장 많은 BTC를 대상으로 N분봉을 사용하여 짧은 구간을 예측하는 모델(DAY TRADING) 구성

### Original Features (46)

| No. | 카테고리 | 피쳐명 | 공식/방법 | 설명 |
|---:|---|---|---|---|
| 1 | 가격 | r1 | $r_t=\ln(C_t/C_{t-1})$ | 1시간 로그수익률 |
| 2 |  | r4 | $r_t=\ln(C_t/C_{t-4})$ | 4시간 로그수익률 |
| 3 |  | r12 | $r_t=\ln(C_t/C_{t-12})$ | 12시간 로그수익률 |
| 4 | 추세 | EMA12_dev | $(C_t-EMA_{12})/C_t$ | EMA12 편차 비율 |
| 5 |  | EMA26_dev | $(C_t-EMA_{26})/C_t$ | EMA26 편차 비율 |
| 6 |  | MACD_hist_norm | $(MACD-Signal)/ATR$ | MACD 히스토그램 |
| 7 |  | RSI14_norm | $(RSI_t-50)/50$ | 정규화 RSI |
| 8 | 변동성 | ATR14_rel | $ATR_t/C_t$ | 상대 변동성 |
| 9 | 거래량 | rel_log_volume | $\ln((1+V)/(1+MA_{20}(V)))$ | 상대 거래량 |
| 10 | 계절성 | month_sin | $\sin(2\pi m/12)$ | 월 주기 |
| 11 |  | month_cos | $\cos(2\pi m/12)$ | 월 주기 |
| 12 |  | day_sin | $\sin(2\pi d/31)$ | 일 주기 |
| 13 |  | day_cos | $\cos(2\pi d/31)$ | 일 주기 |
| 14 |  | weekday_sin | $\sin(2\pi w/7)$ | 요일 주기 |
| 15 |  | weekday_cos | $\cos(2\pi w/7)$ | 요일 주기 |
| 16 |  | hour_sin | $\sin(2\pi h/24)$ | 시간 주기 |
| 17 |  | hour_cos | $\cos(2\pi h/24)$ | 시간 주기 |
| 18 | USDT Perp | usdt_perp_premium | $(F_t-S_t)/S_t$ | 프리미엄 |
| 19 |  | usdt_perp_rel_log_volume | $\ln((1+V)/(1+MA_{20}(V)))$ | 거래량 |
| 20 |  | usdt_perp_volume_ratio | $\ln(V_f/V_s)$ | 거래량 비율 |
| 21 |  | usdt_perp_oi_change | $\ln(OI_t/OI_{t-1})$ | OI 변화 |
| 22 |  | usdt_perp_mark_spread | $(Mark_t-S_t)/S_t$ | Mark 스프레드 |
| 23 |  | usdt_perp_funding_rate | $FR_t\times100$ | Funding |
| 24 | USDC Perp | usdc_perp_premium | $(F_t-S_t)/S_t$ | 프리미엄 |
| 25 |  | usdc_perp_rel_log_volume | $\ln((1+V)/(1+MA_{20}(V)))$ | 거래량 |
| 26 |  | usdc_perp_volume_ratio | $\ln(V_f/V_s)$ | 거래량 비율 |
| 27 |  | usdc_perp_oi_change | $\ln(OI_t/OI_{t-1})$ | OI 변화 |
| 28 |  | usdc_perp_mark_spread | $(Mark_t-S_t)/S_t$ | Mark 스프레드 |
| 29 |  | usdc_perp_funding_rate | $FR_t\times100$ | Funding |
| 30 | USD Inverse | usd_inverse_premium | $(F_t-S_t)/S_t$ | 프리미엄 |
| 31 |  | usd_inverse_rel_log_volume | $\ln((1+V)/(1+MA_{20}(V)))$ | 거래량 |
| 32 |  | usd_inverse_volume_ratio | $\ln(V_f/V_s)$ | 거래량 비율 |
| 33 |  | usd_inverse_oi_change | $\ln(OI_t/OI_{t-1})$ | OI 변화 |
| 34 |  | usd_inverse_mark_spread | $(Mark_t-S_t)/S_t$ | Mark 스프레드 |
| 35 |  | usd_inverse_funding_rate | $FR_t\times100$ | Funding |
| 36 | 시장간 | spot_spread | $(P^{bin}_t-P^{cad}_t)/P^{cad}_t$ | 거래소 스프레드 |
| 37 | 연관자산 | eth_r1 | $\ln(C_t/C_{t-1})$ | ETH 수익률 |
| 38 |  | eth_r4 | $\ln(C_t/C_{t-4})$ | ETH 수익률 |
| 39 |  | eth_r12 | $\ln(C_t/C_{t-12})$ | ETH 수익률 |
| 40 |  | eth_rel_log_volume | $\ln((1+V)/(1+MA_{20}(V)))$ | ETH 거래량 |
| 41 | 결손 | missing_usdt_perp | 0/1 | 결손 여부 |
| 42 |  | missing_usdc_perp | 0/1 | 결손 여부 |
| 43 |  | missing_usd_inverse | 0/1 | 결손 여부 |
| 44 | OI 결손 | missing_oi_usdt_perp | 0/1 | OI 결손 |
| 45 |  | missing_oi_usdc_perp | 0/1 | OI 결손 |
| 46 |  | missing_oi_usd_inverse | 0/1 | OI 결손 |

### Z-scored Features (41)

> $z=(x-\mu)/\sigma$

| No. | 카테고리 | 피쳐명 | 설명 |
|---:|---|---|---|
| 1 | 가격 | r1_z | r1 z-score |
| 2 |  | r4_z | r4 z-score |
| 3 |  | r12_z | r12 z-score |
| 4 | 추세 | EMA12_dev_z | EMA12 z |
| 5 |  | EMA26_dev_z | EMA26 z |
| 6 |  | MACD_hist_norm_z | MACD z |
| 7 | 변동성 | ATR14_rel_z | ATR z |
| 8 | 거래량 | rel_log_volume_z | 거래량 z |
| 9 | USDT Perp | usdt_perp_premium_z | 프리미엄 z |
| 10 |  | usdt_perp_rel_log_volume_z | 거래량 z |
| 11 |  | usdt_perp_volume_ratio_z | 비율 z |
| 12 |  | usdt_perp_oi_change_z | OI z |
| 13 |  | usdt_perp_mark_spread_z | 스프레드 z |
| 14 |  | usdt_perp_funding_rate_z | Funding z |
| 15 | USDC Perp | usdc_perp_premium_z | 프리미엄 z |
| 16 |  | usdc_perp_rel_log_volume_z | 거래량 z |
| 17 |  | usdc_perp_volume_ratio_z | 비율 z |
| 18 |  | usdc_perp_oi_change_z | OI z |
| 19 |  | usdc_perp_mark_spread_z | 스프레드 z |
| 20 |  | usdc_perp_funding_rate_z | Funding z |
| 21 | USD Inverse | usd_inverse_premium_z | 프리미엄 z |
| 22 |  | usd_inverse_rel_log_volume_z | 거래량 z |
| 23 |  | usd_inverse_volume_ratio_z | 비율 z |
| 24 |  | usd_inverse_oi_change_z | OI z |
| 25 |  | usd_inverse_mark_spread_z | 스프레드 z |
| 26 |  | usd_inverse_funding_rate_z | Funding z |
| 27 | 시장간 | spot_spread_z | 스프레드 z |
| 28 | ETH | eth_r1_z | ETH 수익률 z |
| 29 |  | eth_r4_z | ETH 수익률 z |
| 30 |  | eth_r12_z | ETH 수익률 z |
| 31 |  | eth_rel_log_volume_z | ETH 거래량 z |
| 32 | Raw | hl_range_raw_z | H-L z |
| 33 |  | oc_change_raw_z | C-O z |
| 34 |  | volume_raw_z | 현물 거래량 z |
| 35 | Futures Raw | fut_volume_raw_usdt_perp_z | USDT 선물 거래량 z |
| 36 |  | fut_volume_raw_usdc_perp_z | USDC 선물 거래량 z |
| 37 |  | fut_volume_raw_usd_inverse_z | Inverse 선물 거래량 z |
| 38 | Funding Raw | funding_raw_usdt_perp_z | Funding z |
| 39 |  | funding_raw_usdc_perp_z | Funding z |
| 40 |  | funding_raw_usd_inverse_z | Funding z |
| 41 | ETH Raw | eth_volume_raw_z | ETH 거래량 z |

---

### test logs

- split_opt=1
- 2 classes

```
2025-12-16 15:38:35,421 - __main__ - INFO - Loaded model for inference from ./models/1765867109_15_1.9975_vca_0.5054_vha_0.6356_vla_0.6159_vmae_0.0073.weights.h5

======================================================================
  📊 EVALUATION SUMMARY (2025-07-01 to 2025-11-30)
======================================================================
  Samples: 14593

  📈 Classification Accuracy:
     Close: 0.5024
     High:  0.6032
     Low:   0.6366

  📉 Regression Pearson Correlation:
     Min:   -0.0354
     Max:   0.0147
     Close: -0.0301

  🎯 Close Direction Accuracy: 0.4889 (48.89%)
```

- 3 classes

```
2025-12-16 16:11:09,234 - __main__ - INFO - Loaded model for inference from ./models/1765869063_14_3.1741_vca_0.4088_vha_0.4386_vla_0.4380_vmae_0.0072.weights.h5

======================================================================
  📊 EVALUATION SUMMARY (2025-07-01 to 2025-11-30)
======================================================================
  Samples: 14593

  📈 Classification Accuracy:
     Close: 0.4004
     High:  0.4190
     Low:   0.4646

  📉 Regression Pearson Correlation:
     Min:   0.0072
     Max:   0.0214
     Close: 0.0066

  🎯 Close Direction Accuracy: 0.5051 (50.51%)
======================================================================


──────────────────────────────────────────────────────────────────────
  DETAILED RESULTS
──────────────────────────────────────────────────────────────────────

Classification (Close):
  Accuracy: 0.4004
  Per-class distribution: [('DOWN', 4573, 3137), ('STAY', 5314, 6626), ('UP', 4706, 4830)]

  [Actual > Predicted Distribution]
    DOWN (n=4573): DOWN: 25.4%, STAY: 35.2%, UP: 39.5%
    STAY (n=5314): DOWN: 16.0%, STAY: 57.6%, UP: 26.4%
    UP (n=4706): DOWN: 23.9%, STAY: 41.6%, UP: 34.5%

  [Predicted > Actual Distribution]
    DOWN (n=3137): DOWN: 37.0%, STAY: 27.2%, UP: 35.9%
    STAY (n=6626): DOWN: 24.3%, STAY: 46.2%, UP: 29.6%
    UP (n=4830): DOWN: 37.4%, STAY: 29.0%, UP: 33.6%

Classification (High):
  Accuracy: 0.4190
  Per-class distribution: [('STAY', 6525, 6645), ('UP', 4995, 2145), ('BUST', 3073, 5803)]

  [Actual > Predicted Distribution]
    STAY (n=6525): STAY: 56.1%, UP: 14.4%, BUST: 29.6%
    UP (n=4995): STAY: 41.3%, UP: 15.2%, BUST: 43.5%
    BUST (n=3073): STAY: 30.0%, UP: 14.7%, BUST: 55.3%

  [Predicted > Actual Distribution]
    STAY (n=6645): STAY: 55.1%, UP: 31.0%, BUST: 13.9%
    UP (n=2145): STAY: 43.7%, UP: 35.3%, BUST: 21.0%
    BUST (n=5803): STAY: 33.2%, UP: 37.5%, BUST: 29.3%

Classification (Low):
  Accuracy: 0.4646
  Per-class distribution: [('CRASH', 3342, 5376), ('DOWN', 5181, 1667), ('STAY', 6070, 7550)]

  [Actual > Predicted Distribution]
    CRASH (n=3342): CRASH: 60.6%, DOWN: 11.6%, STAY: 27.7%
    DOWN (n=5181): CRASH: 36.9%, DOWN: 13.5%, STAY: 49.6%
    STAY (n=6070): CRASH: 23.7%, DOWN: 9.5%, STAY: 66.8%

  [Predicted > Actual Distribution]
    CRASH (n=5376): CRASH: 37.7%, DOWN: 35.6%, STAY: 26.7%
    DOWN (n=1667): CRASH: 23.3%, DOWN: 42.0%, STAY: 34.7%
    STAY (n=7550): CRASH: 12.3%, DOWN: 34.0%, STAY: 53.7%

Regression (MAE):
  Min return: 0.005231
  Max return: 0.004550
  Close return: 0.006869

Regression Correlation Analysis:
  min_return:
    Pearson: 0.0072, Spearman: 0.0451
    R²: -0.0410
  max_return:
    Pearson: 0.0214, Spearman: 0.0728
    R²: -0.0238
  close_return:
    Pearson: 0.0066, Spearman: 0.0181
    R²: -0.0011
──────────────────────────────────────────────────────────────────────
```

- 4 classes

```
2025-12-16 16:43:09,523 - __main__ - INFO - Loaded model for inference from ./models/1765870983_16_4.0020_vca_0.3222_vha_0.3426_vla_0.3320_vmae_0.0072.weights.h5

======================================================================
  📊 EVALUATION SUMMARY (2025-07-01 to 2025-11-30)
======================================================================
  Samples: 14593

  📈 Classification Accuracy:
     Close: 0.3140
     High:  0.3663
     Low:   0.3675

  📉 Regression Pearson Correlation:
     Min:   0.1437
     Max:   0.0392
     Close: -0.0066

  🎯 Close Direction Accuracy: 0.4981 (49.81%)
======================================================================


──────────────────────────────────────────────────────────────────────
  DETAILED RESULTS
──────────────────────────────────────────────────────────────────────

Classification (Close):
  Accuracy: 0.3140
  Per-class distribution: [('CRASH', 2826, 2006), ('DOWN', 4403, 2604), ('UP', 4411, 7661), ('BUST', 2953, 2322)]

  [Actual > Predicted Distribution]
    CRASH (n=2826): CRASH: 18.6%, DOWN: 19.4%, UP: 37.5%, BUST: 24.5%
    DOWN (n=4403): CRASH: 10.8%, DOWN: 16.7%, UP: 61.0%, BUST: 11.6%
    UP (n=4411): CRASH: 11.2%, DOWN: 17.0%, UP: 60.8%, BUST: 11.0%
    BUST (n=2953): CRASH: 17.4%, DOWN: 19.4%, UP: 41.8%, BUST: 21.5%

  [Predicted > Actual Distribution]
    CRASH (n=2006): CRASH: 26.3%, DOWN: 23.6%, UP: 24.5%, BUST: 25.6%
    DOWN (n=2604): CRASH: 21.0%, DOWN: 28.3%, UP: 28.8%, BUST: 22.0%
    UP (n=7661): CRASH: 13.8%, DOWN: 35.0%, UP: 35.0%, BUST: 16.1%
    BUST (n=2322): CRASH: 29.8%, DOWN: 21.9%, UP: 20.9%, BUST: 27.3%

Classification (High):
  Accuracy: 0.3663
  Per-class distribution: [('STAY', 5099, 6876), ('UP', 4582, 2895), ('RISE', 3213, 3720), ('BUST', 1699, 1102)]

  [Actual > Predicted Distribution]
    STAY (n=5099): STAY: 58.4%, UP: 18.4%, RISE: 18.8%, BUST: 4.4%
    UP (n=4582): STAY: 48.9%, UP: 20.8%, RISE: 25.0%, BUST: 5.3%
    RISE (n=3213): STAY: 34.9%, UP: 21.0%, RISE: 34.2%, BUST: 9.9%
    BUST (n=1699): STAY: 31.5%, UP: 19.5%, RISE: 30.4%, BUST: 18.5%

  [Predicted > Actual Distribution]
    STAY (n=6876): STAY: 43.3%, UP: 32.6%, RISE: 16.3%, BUST: 7.8%
    UP (n=2895): STAY: 32.4%, UP: 32.9%, RISE: 23.3%, BUST: 11.5%
    RISE (n=3720): STAY: 25.7%, UP: 30.8%, RISE: 29.6%, BUST: 13.9%
    BUST (n=1102): STAY: 20.5%, UP: 22.1%, RISE: 28.8%, BUST: 28.6%

Classification (Low):
  Accuracy: 0.3675
  Per-class distribution: [('CRASH', 2054, 2247), ('FALL', 3146, 1472), ('DOWN', 4593, 4669), ('STAY', 4800, 6205)]

  [Actual > Predicted Distribution]
    CRASH (n=2054): CRASH: 33.3%, FALL: 15.2%, DOWN: 33.2%, STAY: 18.3%
    FALL (n=3146): CRASH: 21.2%, FALL: 11.8%, DOWN: 38.2%, STAY: 28.7%
    DOWN (n=4593): CRASH: 11.2%, FALL: 9.8%, DOWN: 32.7%, STAY: 46.2%
    STAY (n=4800): CRASH: 7.9%, FALL: 7.0%, DOWN: 26.7%, STAY: 58.4%

  [Predicted > Actual Distribution]
    CRASH (n=2247): CRASH: 30.5%, FALL: 29.7%, DOWN: 22.9%, STAY: 16.9%
    FALL (n=1472): CRASH: 21.2%, FALL: 25.2%, DOWN: 30.6%, STAY: 23.0%
    DOWN (n=4669): CRASH: 14.6%, FALL: 25.8%, DOWN: 32.2%, STAY: 27.4%
    STAY (n=6205): CRASH: 6.0%, FALL: 14.6%, DOWN: 34.2%, STAY: 45.2%

Regression (MAE):
  Min return: 0.005276
  Max return: 0.004569
  Close return: 0.006867

Regression Correlation Analysis:
  min_return:
    Pearson: 0.1437, Spearman: 0.0580
    R²: -0.0638
  max_return:
    Pearson: 0.0392, Spearman: 0.0886
    R²: -0.1486
  close_return:
    Pearson: -0.0066, Spearman: 0.0175
    R²: -0.0019
```


다음 작업은 [model-poc3](model-poc3) 에 이어서.