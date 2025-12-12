---
title: SWING 모델
parent: 투자
nav_order: 6
math: true
---

# SWING 모델 구성
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## Target

- BTC or ETH
- BTC, ETH는 변동성이 상대적으로 낮고 안정성은 높으므로 긴 시간텀 거래에 적합

### 아이디어

- BTC, ETH OHLCV 자체의 시계열 패턴
- 시장간 가격 차이에 따른 패턴: cadli, bianace BTC/USDT, upbit BTC/KRW
- 선물시장의 가격, 거래량, Open interest, Funding rate 패턴과의 연관성
   - binance BTC-USDT-VANYLLA-PERPETUAL: OHLCV, Open interest, Funding rate
   - binance BTC-USDC-VANYLLA-PERPETUAL: OHLCV, Open interest, Funding rate
   - binance BTC-USD-INVERSE-PERPETUAL: OHLCV, Open interest, Funding rate

**기타 (추후 보강 고려)**

- BTC <> ETH <> 나머지 코인간 연관성
- BTC <> 금(GC) <> 달러인덱스(DXY) <> 미국채선물(ZN, ZF, ...) <> 공포지수(VIX) <> 암호화폐 탐욕지수 (Crypto F&G)간 연관성

---

## Time Frame

### Input: 1D, 1H 조합

- 1D x 14 : 2주간의 중기 추세
- 1H x 72 (24 * 3) : 3일간의 단기 추세

### 출력

- 향후 1일간 Min 변동률
- 향후 1일간 Max 변동률
- 1일 후 종가 변동률
- 현재가 대비 1일 후 종가의 변동률 구간별 확률
   - -5% 이하
   - -5 ~ -3 %
   - -3 ~ -1 %
   - -1 ~ 1%
   - 1% ~ 3%
   - 3% ~ 5%
   - 5% 이상

### 출력의 활용

- 가격변동구간별 확률로 기대수익이 가장 높은 TP/SL 설정
- 기대수익이 기준 이상인 구간에서만 포지션 진입

### 다중 출력 사용시 주의점

- Min/Max/Close는 보통 MAE/MSE loss 사용 (회귀)
- 구간 확률은 Cross-Entropy 사용 (분류)
- 그냥 합치면 CE가 너무 커서 회귀가 무시되거나, 반대로 회귀가 너무 커서 확률 학습이 안될 수 있음
- 회귀는 평균 근처로 뭉개고싶어하고 확률 분포는 tail의 극단값을 살리고 싶어함
- 논리적으로 정합성이 떨어지는 결과 나올 수 있음. (ex. Min > Close, Max < Close, Close != Sum(e * P))
- 변동률 구간은 좀 더 잘 설정하기.
   - 시장 regime이 바뀔 수 있음
   - 클래스간 불균형 있음. (ex. 대부분이 -1% ~ 1% 사이에 몰리는 경우 등)
   - 변동성 구간 분포 한 번 보고 bin 수, size 균등 확률로 재설계하자.

### 다중 출력 구현 순서

- 처음엔 1일 후 수익률 구간 확률만 예측하는 단일 출력 분류 모델 구현
- 그 후 Min/Max/Close 회귀를 멀티태스크로 추가
- 분류/회귀 헤드를 분리
   - 분류헤드: bin logits -> Dense(7) + Softmax
   - 회귀헤드: [Min, Max, Close] -> Dense(3)

### 다중 출력 Loss 조합

```
L_reg = MAE_min + MAE_max + MAE_close
L_cls = CrossEntropy(bins)
L_total = λ_reg * L_reg + λ_cls * L_cls
```

### 다중 출력 학습 전략 (λ_reg 스케줄)

1. 1단계: 분류 단일 태스크 예열 (λ_reg = 0, λ_cls = 1)
   - 목적: 수익률 구간 분류 헤드가 안정적으로 학습되도록 먼저 예열
   - 설정
     - 회귀 헤드 출력은 계산만 하고 loss에는 포함하지 않음
     - 손실 함수: `L_total = L_cls`
   - 튜닝 포인트
     - 윈도우 길이, LSTM 구조, LR, 정규화, 클래스 불균형 처리 등 기본 세팅을 이 단계에서 먼저 확정

2. 2단계: 멀티태스크로 확장 (λ_reg ↑, λ_cls = 1 고정)
   - 목적: 기존에 학습된 분류 표현(shared representation)을 유지하면서 회귀 헤드(Min/Max/Close)를 함께 학습
   - 초기 설정 예시
     - epoch 초반: `λ_reg = 0.3, λ_cls = 1.0`
     - 이후 몇 epoch에 걸쳐 `λ_reg`를 1.0까지 선형/계단식으로 증가
     - 최종적으로: `λ_reg = 1, λ_cls = 1`
   - 손실 함수
     - `L_reg = MAE_min + MAE_max + MAE_close`
     - `L_cls = CrossEntropy(bins)`
     - `L_total = λ_reg * L_reg + λ_cls * L_cls`
   - 주의점
     - λ_reg를 갑자기 1로 올리면 회귀 손실이 너무 커져 분류 표현이 깨질 수 있으므로
       작은 값에서 시작해 점진적으로 올리는 스케줄 사용

---

## Input Features

### Indicators 계산 대상

cadli ETH-USDT OHLCV 데이터

### 요소 요약

- 가격 : 종가 기준, r1, r6, r24
- 추세 : EMA12, EMA26, MACD(12, 26, 9), RSI14
- 변동성 : ATR14
- 거래량 : Log Volume
- 계절성 : 날짜, Weekday, Hour

### 가격

- **방법**: 로그수익률, r1, r6, r24
- **공식**: $r_t=\ln(C_t/C_{t-1})$

### EMA12, EMA26

- **방법**: 종가 대비 편차 비율
- **공식**: $d_t=(C_t-EMA_t)/C_t$

### MACD(12,26,9) Hist.

- **방법**: ATR로 나눠 상대화
- **공식**: $Hist. = (MACD-Signal)/ATR$

### RSI14

- **방법**: [-1,1] 스케일링
- **공식**: $RSI^\pm_t = (RSI_t - 50)/50$

### ATR14

- **방법**: 상대 변동성 정규화
- **공식**: $ATR^\ast_t = ATR_t / C_t$

### Volume

- **방법**: 20이동평균 대비 상대 거래량 (로그)
- **공식**: $v_{rel} = \ln((1+V)/(1+MA_{20}(V)))$
- **비고**: log_volume은 스케일이 타 피쳐 대비 너무 커서 제거 (다른 피쳐: -1~1, log_volume: 10~15)  

### Month

- **방법**: 주기적 인코딩 (sin, cos)
- **공식**: $Month_{sin} = \sin(2\pi \cdot month / 12)$, $Month_{cos} = \cos(2\pi \cdot month / 12)$
- **비고**: 월별 계절 패턴을 순환적으로 표현

### Day of Month

- **방법**: 주기적 인코딩 (sin, cos)
- **공식**: $Day_{sin} = \sin(2\pi \cdot day / 31)$, $Day_{cos} = \cos(2\pi \cdot day / 31)$
- **비고**: 월내 주기성 및 월말 리밸런싱 효과를 순환적으로 표현

### Weekday

- **방법**: 주기적 인코딩 (sin, cos)
- **공식**: $Weekday_{sin} = \sin(2\pi \cdot weekday / 7)$, $Weekday_{cos} = \cos(2\pi \cdot weekday / 7)$
- **비고**: 요일별 반복적 거래 패턴 반영

### Hour

- **방법**: 주기적 인코딩 (sin, cos)
- **공식**: $Hour_{sin} = \sin(2\pi \cdot hour / 24)$, $Hour_{cos} = \cos(2\pi \cdot hour / 24)$
- **비고**: 시간대별 거래량 및 변동성 주기를 순환적으로 표현

### 선물 요소 대상

- binance ETH-USDT-VANILLA-PERPETUAL

### 선물 가격 프리미엄

- **방법**: 현물 대비 선물 가격 프리미엄 비율
- **공식**: $Premium_t = (F_t - S_t) / S_t$
- **비고**: 
  - $F_t$: 선물 종가, $S_t$: 현물 종가
  - 양수: 선물 프리미엄 (강세장), 음수: 선물 디스카운트 (약세장)
  - USDT/USDC 중 거래량이 많은 것, USD-INVERSE 각각 계산

### 선물 거래량

- **방법**: 선물 20이동평균 대비 상대 거래량
- **공식**: $FV_{rel,t} = \ln((1+V_{futures,t})/(1+MA_{20}(V_{futures,t})))$
- **비고**: futures_log_volume은 스케일 문제로 제거

### 선물 거래량 비율

- **방법**: 현물 대비 선물 거래량 비율 (로그)
- **공식**: $VR_t = \ln(V_{futures} / V_{spot})$
- **비고**: 
  - 선물 거래 활성도가 높을수록 양수 증가
  - 시장 관심도 및 레버리지 포지션 규모 반영

### Open Interest 변화율

- **방법**: OI의 로그 변화율 및 상대 규모
- **공식**: $\Delta OI_t = \ln(OI_t / OI_{t-1})$
- **비고**: 
  - 변화율: 새로운 포지션 유입/청산 속도
  - 급격한 변화는 청산 위험 또는 강한 추세 신호

### Mark Price

- **방법**: 선물 Mark Price와 현물 가격 간의 차이
- **공식**: $MarkSpread_t = \frac{Mark_t - S_t}{S_t}$
- **비고**: 
  - Mark Price는 여러 거래소 현물 가격의 가중평균으로 산출
  - 선물 가격과 달리 자금조달료 영향을 받지 않는 "공정한" 기준 가격
  - Mark Price > Spot: 선물시장 프리미엄 지속적 존재
  - 극단적 괴리는 자금조달료 급변동 또는 시장 불안정성 신호

### Funding Rate

- **방법**: 퍼센트 단위로 스케일링
- **공식**: $FR_t \times 100$ (%)
- **비고**: 
  - 양수(보통 0~0.1%): Long이 Short에게 지불 → 롱 과열
  - 음수: Short이 Long에게 지불 → 숏 과열  

### 시장간 가격 차이 요소

현물 시장 간 가격 괴리(프리미엄/디스카운트)는 단기 수급, 자본 유입/유출, 지역 규제 및 온/오프램프 비용을 반영하는 선행/확인 지표가 될 수 있다. 기준(Reference) 가격을 하나 정하고 다른 시장 가격을 이 기준에 상대화한다.

**기본 상대 프리미엄 (Relative Spread)**
- **방법**: 기준 거래소 가격 대비 상대 비율
- **공식**: $Spread^{(ex)}_t = \frac{P^{(ex)}_t - P^{(ref)}_t}{P^{(ref)}_t}$
- 기준 가격은 cadli ETH-USDT, 시장 가격은 binance ETH-USDT

### 연관 자산 가격 요소

cadli BTC-USDT OHLCV 기준

- 가격: 로그수익률($r_t=\ln(C_t/C_{t-1})$), r1, r6, r24
- 거래량: 상대 거래량 ($v_{rel} = \ln((1+V)/(1+MA_{20}(V)))$) - log_volume은 스케일 문제로 제거

---

## 입력 총정리 (Standard Scaler 피쳐 포함)

| No. | 카테고리 | 피쳐명 | 공식/방법 | 설명 |
|-----|---------|-------|-----------|------|
| 1 | **가격 (ETH-USDT)** | r1 | $r_t=\ln(C_t/C_{t-1})$ | 1시간 로그수익률 |
| 2 | | r6 | $r_t=\ln(C_t/C_{t-6})$ | 6시간 로그수익률 |
| 3 | | r24 | $r_t=\ln(C_t/C_{t-24})$ | 24시간 로그수익률 |
| 4 | **추세 지표** | EMA12_dev | $d_t=(C_t-EMA_{12})/C_t$ | 종가 대비 EMA12 편차 비율 |
| 5 | | EMA26_dev | $d_t=(C_t-EMA_{26})/C_t$ | 종가 대비 EMA26 편차 비율 |
| 6 | | MACD_hist_norm | $Hist. = (MACD-Signal)/ATR$ | ATR로 정규화된 MACD 히스토그램 |
| 7 | | RSI14_norm | $RSI^\pm_t = (RSI_t - 50)/50$ | [-1,1]로 정규화된 RSI |
| 8 | **변동성** | ATR14_rel | $ATR^\ast_t = ATR_t / C_t$ | 종가 대비 상대 변동성 |
| 9 | **거래량** | rel_log_volume | $v_{rel} = \ln((1+V)/(1+MA_{20}(V)))$ | 20일 이동평균 대비 상대 거래량 (로그) |
| 10 | **계절성** | month_sin | $\sin(2\pi \cdot month / 12)$ | 월 주기 인코딩 (sin) |
| 11 | | month_cos | $\cos(2\pi \cdot month / 12)$ | 월 주기 인코딩 (cos) |
| 12 | | day_sin | $\sin(2\pi \cdot day / 31)$ | 일 주기 인코딩 (sin) |
| 13 | | day_cos | $\cos(2\pi \cdot day / 31)$ | 일 주기 인코딩 (cos) |
| 14 | | weekday_sin | $\sin(2\pi \cdot weekday / 7)$ | 요일 주기 인코딩 (sin) |
| 15 | | weekday_cos | $\cos(2\pi \cdot weekday / 7)$ | 요일 주기 인코딩 (cos) |
| 16 | | hour_sin | $\sin(2\pi \cdot hour / 24)$ | 시간 주기 인코딩 (sin) |
| 17 | | hour_cos | $\cos(2\pi \cdot hour / 24)$ | 시간 주기 인코딩 (cos) |
| 18 | **선물 가격** | futures_premium | $Premium_t = (F_t - S_t) / S_t$ | 현물 대비 선물 프리미엄 |
| 19 | **선물 거래량** | futures_rel_log_volume | $FV_{rel,t} = \ln((1+V_{futures,t})/(1+MA_{20}(V_{futures,t})))$ | 선물 20일 이동평균 대비 상대 거래량 (로그) |
| 20 | | volume_ratio | $VR_t = \ln(V_{futures} / V_{spot})$ | 현물 대비 선물 거래량 비율 |
| 21 | **선물 지표** | oi_change | $\Delta OI_t = \ln(OI_t / OI_{t-1})$ | Open Interest 변화율 |
| 22 | | mark_spread | $MarkSpread_t = \frac{Mark_t - S_t}{S_t}$ | Mark Price와 현물 가격 간 차이 |
| 23 | | funding_rate | $FR_t \times 100$ | Funding Rate (%) |
| 24 | **시장간 차이** | spot_spread | $Spread^{(ex)}_t = \frac{P^{(binance)}_t - P^{(cadli)}_t}{P^{(cadli)}_t}$ | cadli 대비 binance 현물 가격 차이 |
| 25 | **연관 자산 (BTC)** | btc_r1 | $r_t=\ln(C_t/C_{t-1})$ | BTC 1시간 로그수익률 |
| 26 | | btc_r6 | $r_t=\ln(C_t/C_{t-6})$ | BTC 6시간 로그수익률 |
| 27 | | btc_r24 | $r_t=\ln(C_t/C_{t-24})$ | BTC 24시간 로그수익률 |
| 28 | | btc_rel_log_volume | $v_{rel} = \ln((1+V)/(1+MA_{20}(V)))$ | BTC 20일 이동평균 대비 상대 거래량 (로그) |
| 29 | **결손 지표** | missing_oi | 0/1 | OI 데이터 결손 여부 |
| 30 | | missing_fr | 0/1 | FR 데이터 결손 여부 |
| 31 | **가공 피쳐 Z-score** | r1_z | $z = (x - \mu) / \sigma$ | 1시간 로그수익률 z-score |
| 32 | | r6_z | $z = (x - \mu) / \sigma$ | 6시간 로그수익률 z-score |
| 33 | | r24_z | $z = (x - \mu) / \sigma$ | 24시간 로그수익률 z-score |
| 34 | | EMA12_dev_z | $z = (x - \mu) / \sigma$ | EMA12 편차 비율 z-score |
| 35 | | EMA26_dev_z | $z = (x - \mu) / \sigma$ | EMA26 편차 비율 z-score |
| 36 | | MACD_hist_norm_z | $z = (x - \mu) / \sigma$ | MACD 히스토그램 z-score |
| 37 | | ATR14_rel_z | $z = (x - \mu) / \sigma$ | 상대 변동성(ATR) z-score |
| 38 | | rel_log_volume_z | $z = (x - \mu) / \sigma$ | 상대 거래량(log) z-score |
| 39 | | futures_premium_z | $z = (x - \mu) / \sigma$ | 선물 프리미엄 z-score |
| 40 | | futures_rel_log_volume_z | $z = (x - \mu) / \sigma$ | 선물 상대 로그 거래량 z-score |
| 41 | | volume_ratio_z | $z = (x - \mu) / \sigma$ | 선물/현물 거래량 비율 z-score |
| 42 | | oi_change_z | $z = (x - \mu) / \sigma$ | OI 로그 변화율 z-score |
| 43 | | funding_rate_z | $z = (x - \mu) / \sigma$ | Funding Rate(%) z-score |
| 44 | | mark_spread_z | $z = (x - \mu) / \sigma$ | Mark Price vs 현물 차이 z-score |
| 45 | | spot_spread_z | $z = (x - \mu) / \sigma$ | binance vs cadli 가격 차이 z-score |
| 46 | | btc_r1_z | $z = (x - \mu) / \sigma$ | BTC 1시간 로그수익률 z-score |
| 47 | | btc_r6_z | $z = (x - \mu) / \sigma$ | BTC 6시간 로그수익률 z-score |
| 48 | | btc_r24_z | $z = (x - \mu) / \sigma$ | BTC 24시간 로그수익률 z-score |
| 49 | | btc_rel_log_volume_z | $z = (x - \mu) / \sigma$ | BTC 상대 로그 거래량 z-score |
| 50 | **Raw OHLCV Z-score** | hl_range_raw_z | $z = (H_t - L_t)$ z-score | 고저 스프레드(H-L) z-score |
| 51 | | oc_change_raw_z | $z = (C_t - O_t)$ z-score | 시가 대비 종가 변화(C-O) z-score |
| 52 | | volume_raw_z | $z = V_t$ z-score | ETH 현물 거래량 z-score |
| 53 | | fut_volume_raw_z | $z = V_{futures,t}$ z-score | 선물 거래량 z-score |
| 54 | | funding_raw_z | $z = FR_t$ z-score | Funding Rate 원본 값 z-score |
| 55 | | btc_volume_raw_z | $z = V_{BTC,t}$ z-score | BTC 거래량 z-score |

**피쳐 수 요약**
- Original Features: 31개 (가격, 추세, 변동성, 거래량, 계절성, 선물, 시장간 차이, BTC, 결손 지표)
- Z-scored Features: 24개 (가공 피쳐 18개 + Raw OHLCV 6개)
- **총 입력 피쳐: 55개** (Raw OHLCV 6개는 z-score만 사용, 원본 제외)

**StandardScaler 적용 방법**
- Training: 전체 학습 데이터에 대해 fit_transform, scaler 저장
- Inference/Evaluation: 저장된 scaler로 transform만 수행
- Pre-clipping: $\mu \pm 5\sigma$ 범위로 극단값 클리핑 후 스케일링
- Post-clipping: z-score를 [-5, 5] 범위로 클리핑

**시간별 데이터 (72시간)**: 위 56개 피쳐 사용

---

## 학습 데이터 운용 전략

- 기간별 결손 데이터는 zero-fill 하고 결손 index 추가

### 1단계 학습 - 연구/튜닝 단계

- Train: 2020.01. ~ 2024.06. (앞 80%)
- Validation: 2024.07. ~ 2025.06. (뒤 20%)
- Test: 2025.07. ~

**학습 절차**
- 학습: 모델 구조, 윈도우 길이, hidden size, LR, regularization, epoch, batch 등 Train/Validation Set 이용하여 최적 도출
- 목적 함수: Val MAE
- 성능 테스트: Test set 사용

### 2단계 학습 - 운영 모델 최적 학습

- Train: 2020.01. ~ 2025.09.
- Validation: 2025.10. ~
- Test: 없음

**학습 절차**
- 적절 에폭 수 1단계 기반으로 고정
- 목적 함수: Train MAE
- 성능 테스트: 없음
- Early stop: Val MAE (과적합 방지 목적, 하이퍼파라미터 튜닝 용도 아님)

---

## Logs; Trouble shooting & Variations ~ 20251202_case1_2

학습이 잘 안된다...  
입력에 따른 결과의 패턴이 임의적이고 노이즈가 많아서 학습 가능한 것이 제한적인가봄.  

- training, validation 다 섞어서 과적합이라도 만들어보자.
- cls, reg loss weight 조정
- 학습 이후 데이터로 평가부터 일단 해보자.
- t24를 예상하지 말고 좀 더 단기 (t6, t3)의 결과를 예상해보자.
- daily feature를 제외시키고, hourly time window를 줄여보자.
- log, delta, rel 처리한 입력 외에 raw data를 z-score(Standard Scaler)로 정규화한것도 추가하자.
- 출력을 최대한 단순화 한 것 학습시켜보기: 분류 떼고 Max / Min / Close 일부만 예측하는 모델
- 시간 스케일 줄여서 데이터 수 늘리기 (indicator 계산 해야함.)

### 1. Train & Validation 다 섞어서 학습한 것

- 이건 학습이 된다.
- Daily Features가 동일한 셋이 Training, Validation에 같이 들어있어서 거기에 과적합 된듯
- Classification만 학습했을 때 val_loss 0.8158 까지 학습됨.
- 예측 성능이 어떤지나 한 번 보자.
- 168_0.815830_1764233120.weights.h5
- LAMBDA_REG = 5.0, LAMBDA_CS = 1.0, LR = 0.0001
- 1764573663_51_0.7176_acc_0.6400_mae_0.0119_val_acc_0.6790_val_mae_0.0102_history.json

### 2. cls, reg loss weight 조정

- Training, Validation 날짜 기준으로만 섞이지 않도록 분리
- 28_1.915654_1764234673.weights.h5
- LAMBDA_REG = 5.0, LAMBDA_CLS = 1.0, LR = 0.0001 으로 조정했더니
- regression, classification 둘다 개선되네
- 72_1.990571_1764295573.weights.h5
- LAMBDA_REG = 20.0, LAMBDA_CLS = 1.0, LEARNING_RATE = 0.00001 으로 조정하고 추가 학습
- 31_2.312712_1764296652.weights.h5
- Training, Validation 기간을 앞뒤로 나눠서 분리하고 처음부터 재학습
- 5, 1, 0.0001
- 42_2.042198_1764302759.weights.h5
- 20, 1, 0.00001
- 61_2.361417_1764304148.weights.h5

### Leaning

- train / val 2024-07-01 기준으로 나눈 것 전혀 학습 안됨. 중간만 찍어냄
- train / val 날짜 기준으로 80% / 20%로 나눈 것 전혀 학습 안됨. 중간만 찍어냄
- train / val 무작위로 다 섞은 것 (동일 daily feature가 24개 중복) 학습은 되지만 경향성 거의 없음.
- train / val을 명확히 분리할수록 경향성보다 무작위성이 커서 학습이 안됨
- 학습 목표값을 일반적으로 설정할 것이 아니라 특수한 경우에 국한해야 할 것으로 보임.
   - 7개의 cls 빈 > 2개(상승/하락) 또는 3개(상승/횡보/하락)으로 압축
   - 특정 position을 취했을 때 수익률이 높은 조건인지 아닌지만 학습 < 고안해보기
- 시간봉으로 t24 예측이 기계로 학습하기에 유리한 조건은 아닌듯? < 확인해보기
   - 기간이 꽤 길어서 임의성 큼
   - 데이터 샘플 부족
   - 수 시간 단위로 예측, 패턴은 수 분 단위로 입력 (Day trading 모델이 더 유리할 것으로 추측)
- 학습을 더 잘할 수 있는 피쳐 입력해주기 (log, delta, rel > standard scaler) < 확인해보기
- Daily features를 아예 없애는 것 테스트 해볼 필요 있음

---

## Logs; Trouble shooting & Variations ~ 20251202_case3

### train / val 분리 options
- Opt 1. 2024-07-01 기준 전/후로 분리
- Opt 2. 날짜 기준으로 겹치지 않도록 80/20%로 분리
- Opt 3. 무작위로 섞어서 80/20%로 분리

### Bin 수정

- BIN_LABELS = ['<-0.44', '-0.44~+0.55', '>+0.55']

```
[Duplicate Analysis for t6]
  Total rows: 51903
  Unique values: 51899
  Duplicate rows: 4
  Duplicate ratio: 0.01%

  bins = [-29.85, -0.44, 0.55, 31.60]

================================================================================
6H Forward Return (%) Quintile Distribution
================================================================================
quintile_t6  count        min       max      mean    median      std
          0  17301 -29.853877 -0.443197 -1.869070 -1.305243 1.744667
          1  17301  -0.443192  0.553733  0.043214  0.036948 0.275149
          2  17301   0.553920 31.604432  1.997357  1.487582 1.612152

--------------------------------------------------------------------------------
Total samples: 51903
Mean: 0.0572%
Median: 0.0369%
Std: 2.0971%

--------------------------------------------------------------------------------
Max return: 31.6044% at 2020-03-13 10:00:00
Min return: -29.8539% at 2020-03-13 04:00:00
================================================================================
```

### Label smoothing with temperature

- 학습해보면 accuracy는 올라가는데 loss도 올라가서 종료되는 경우 있음
- 각각 bin에 속할 확률이 특정 수준을 넘어 과하게 학습되기 때문 (과적합)
- 각각 bin에 속할 확률을 좀더 균등분배하기위해 temperature 적용

```
# org
clss = Dense(num_classes, activation='softmax', name='clss')(cls_dense)

# modified
SMOOTHING_TEMPERATURE = 3.0
cls_logits = Dense(num_classes, activation=None, name='cls_logits')(cls_dense)
clss = Lambda(lambda x: tf.nn.softmax(x / SMOOTHING_TEMPERATURE), name='cls')(cls_logits)
```

### 3. Target future slide 24 > 6, bin 7 > 3

- Target future slide를 24에서 6으로 줄이고, bin을 7에서 3개로 줄여도 학습률이 극적으로 개선되지는 않음.
- 다만 **데이터 분리 옵션 2**, Temperature 3 적용하니 꽤 학습됨
- LAMBDA_REG = 0.0, LAMBDA_CLS = 1.0, LEARNING_RATE = 0.0001
- models/1764654412_66_1.0560_acc_0.3423_mae_0.1190_val_acc_0.3790_val_mae_0.0856.weights.h5
- 파일명 accuracy max 대신 min 넣은 버그 수정 & DROPOUT_RATE = 0.5,LEARNING_RATE = 0.00001
- DROPOUT_RATE는 학습 방향의 randomness를 올리기 위해서 0.3 > 0.5로 상향해봄
- models/1764657511_70_1.0543_acc_0.4581_mae_0.3241_val_acc_0.4274_val_mae_0.1843.weights.h5
- LAMBDA_REG = 5.0, LAMBDA_CLS = 1.0, LEARNING_RATE = 0.0001
- classification 정확도 0.33으로 바로 망가져버리네. Smoothing temperature 써서 비중이 더 크게 적용되는듯
- LAMBDA_REG = 0.1, LAMBDA_CLS = 1.0, LEARNING_RATE = 0.0001
- models/1764658800_37_1.0544_acc_0.4858_mae_0.0111_val_acc_0.4292_val_mae_0.0108.weights.h5

```
=== Evaluation Results (2020-02-03 to 2025-06-30) ===
Samples: 47377

Classification:
  Accuracy: 0.4630
  [Predicted > Actual Distribution]
    <-0.44 (n=11102): <-0.44: 44.1%, -0.44~+0.55: 25.1%, >+0.55: 30.9%
    -0.44~+0.55 (n=17949): <-0.44: 26.1%, -0.44~+0.55: 50.1%, >+0.55: 23.9%
    >+0.55 (n=18326): <-0.44: 34.1%, -0.44~+0.55: 21.9%, >+0.55: 43.9%
```

```
=== Evaluation Results (2025-07-01 to 2025-11-30) ===
Samples: 3649

Classification:
  Accuracy: 0.3689
  [Predicted > Actual Distribution]
    <-0.44 (n=536): <-0.44: 37.3%, -0.44~+0.55: 24.6%, >+0.55: 38.1%
    -0.44~+0.55 (n=2075): <-0.44: 30.3%, -0.44~+0.55: 37.9%, >+0.55: 31.8%
    >+0.55 (n=1038): <-0.44: 36.4%, -0.44~+0.55: 28.9%, >+0.55: 34.7%
```

- 결론: 방향성에 대해 1도 학습하지 못한다.
- 현재 피쳐로는 경향성이 나타나지 않는다. > 피쳐 개선 필요 or 원래 경향이 없나?
   - Standard scaler 사용한 피쳐 추가
   - Daily features 날리고 Option 3 사용
- 분류를 먼저 학습하는 방식 말고 회귀만, 특히 기간 중 min, max만 학습하는 경우 패턴이 있을까?
- 그래도 모르니 일단 Option 3로 한 번 학습해보자.
- LAMBDA_REG = 0.1, LAMBDA_CLS = 1.0, LEARNING_RATE = 0.001, DROPOUT_RATE = 0.5
- models/1764665257_215_0.7342_acc_0.7604_mae_0.0081_val_acc_0.6832_val_mae_0.0084.weights.h5

```
=== Evaluation Results (2020-02-03 to 2025-06-30) ===
Samples: 47377

Classification:
  Accuracy: 0.7685
  Per-class distribution: [('<-0.44', 15829, 15738), ('-0.44~+0.55', 15786, 17830), ('>+0.55', 15762, 13809)]

  [Actual > Predicted Distribution]
    <-0.44 (n=15829): <-0.44: 80.0%, -0.44~+0.55: 17.8%, >+0.55: 2.2%
    -0.44~+0.55 (n=15786): <-0.44: 15.5%, -0.44~+0.55: 74.9%, >+0.55: 9.6%
    >+0.55 (n=15762): <-0.44: 4.0%, -0.44~+0.55: 20.3%, >+0.55: 75.7%

  [Predicted > Actual Distribution]
    <-0.44 (n=15738): <-0.44: 80.4%, -0.44~+0.55: 15.6%, >+0.55: 4.0%
    -0.44~+0.55 (n=17830): <-0.44: 15.8%, -0.44~+0.55: 66.3%, >+0.55: 17.9%
    >+0.55 (n=13809): <-0.44: 2.5%, -0.44~+0.55: 11.0%, >+0.55: 86.4%

Regression (MAE):
  Min return: 0.007657
  Max return: 0.007007
  Close return: 0.008676
  Direction accuracy: 0.8170

Regression Correlation Analysis:
  min_return:
    Pearson: 0.6517, Spearman: 0.6759
    R²: 0.3984
  max_return:
    Pearson: 0.6880, Spearman: 0.7098
    R²: 0.4207
  close_return:
    Pearson: 0.7486, Spearman: 0.8324
    R²: 0.5397
```

```
=== Evaluation Results (2025-07-01 to 2025-11-30) ===
Samples: 3649

Classification:
  Accuracy: 0.3585
  Per-class distribution: [('<-0.44', 1207, 1142), ('-0.44~+0.55', 1218, 1587), ('>+0.55', 1224, 920)]

  [Actual > Predicted Distribution]
    <-0.44 (n=1207): <-0.44: 32.7%, -0.44~+0.55: 39.9%, >+0.55: 27.4%
    -0.44~+0.55 (n=1218): <-0.44: 30.7%, -0.44~+0.55: 47.9%, >+0.55: 21.3%
    >+0.55 (n=1224): <-0.44: 30.5%, -0.44~+0.55: 42.6%, >+0.55: 26.9%

  [Predicted > Actual Distribution]
    <-0.44 (n=1142): <-0.44: 34.6%, -0.44~+0.55: 32.7%, >+0.55: 32.7%
    -0.44~+0.55 (n=1587): <-0.44: 30.3%, -0.44~+0.55: 36.8%, >+0.55: 32.9%
    >+0.55 (n=920): <-0.44: 36.0%, -0.44~+0.55: 28.3%, >+0.55: 35.8%

Regression (MAE):
  Min return: 0.010429
  Max return: 0.009683
  Close return: 0.015253
  Direction accuracy: 0.5056

Regression Correlation Analysis:
  min_return:
    Pearson: -0.0232, Spearman: -0.0248
    R²: -0.3469
  max_return:
    Pearson: 0.0257, Spearman: 0.0637
    R²: -0.4091
  close_return:
    Pearson: -0.0100, Spearman: 0.0185
    R²: -0.3774
```

- 응 예측력 없어.
- Bin 7개 > 3개로 줄인 것, Label smoothing with Temp.를 도입했으나
- 과거 입력의 과적합 외에 예측력 있는 유의미한 패턴을 전혀 학습하지 못했다.
- 너무 하나도 안맞아서 오히려 신기함.

---

## Logs; Trouble shooting & Variations ~ 20251205_case4

### 피쳐 변경

- Daily features 삭제
- Hourly features, standard scaler로 조정한 입력 변수 추가

### 4-1. Daily features 삭제

- Daily features 삭제, Opt3 사용.
- SMOOTHING_TEMPERATURE = 3.0, LAMBDA_REG = 0.1, LAMBDA_CLS = 1.0, LEARNING_RATE = 0.001, DROPOUT_RATE = 0.5
- models/1764844898_284_0.7413_acc_0.7644_mae_0.0083_val_acc_0.6836_val_mae_0.0086.weights.h5
- 아주 약한 상관성 나타남

```
=== Evaluation Results (2025-07-01 to 2025-11-30) ===
Samples: 3649

Classification:
  Accuracy: 0.3738
  Per-class distribution: [('<-0.44', 1207, 1250), ('-0.44~+0.55', 1218, 1358), ('>+0.55', 1224, 1041)]

  [Actual > Predicted Distribution]
    <-0.44 (n=1207): <-0.44: 37.4%, -0.44~+0.55: 32.5%, >+0.55: 30.2%
    -0.44~+0.55 (n=1218): <-0.44: 33.2%, -0.44~+0.55: 43.1%, >+0.55: 23.7%
    >+0.55 (n=1224): <-0.44: 32.3%, -0.44~+0.55: 36.0%, >+0.55: 31.7%

  [Predicted > Actual Distribution]
    <-0.44 (n=1250): <-0.44: 36.1%, -0.44~+0.55: 32.3%, >+0.55: 31.6%
    -0.44~+0.55 (n=1358): <-0.44: 28.9%, -0.44~+0.55: 38.7%, >+0.55: 32.5%
    >+0.55 (n=1041): <-0.44: 35.0%, -0.44~+0.55: 27.8%, >+0.55: 37.3%

Regression (MAE):
  Min return: 0.010479
  Max return: 0.009291
  Close return: 0.014869
  Direction accuracy: 0.4966

Regression Correlation Analysis:
  min_return:
    Pearson: 0.1073, Spearman: 0.0845
    R²: -0.3079
  max_return:
    Pearson: 0.0504, Spearman: 0.0536
    R²: -0.3362
  close_return:
    Pearson: 0.0512, Spearman: 0.0526
    R²: -0.3186
```

### 4-2. Regression 없애고, smoothing term 없앴을 때 예측 개선이 있는지

- SMOOTHING_TEMPERATURE = 1.0, LAMBDA_REG = 0.0, LAMBDA_CLS = 1.0, LEARNING_RATE = 0.001, DROPOUT_RATE = 0.3
- models/1764900243_199_0.7318_acc_0.7732_mae_0.6074_val_acc_0.6912_val_mae_0.4868.weights.h5

``` 
=== Evaluation Results (2025-07-01 to 2025-11-30) ===
Samples: 3649

Classification:
  Accuracy: 0.3776
  Per-class distribution: [('<-0.44', 1207, 1089), ('-0.44~+0.55', 1218, 1393), ('>+0.55', 1224, 1167)]

  [Actual > Predicted Distribution]
    <-0.44 (n=1207): <-0.44: 33.5%, -0.44~+0.55: 32.6%, >+0.55: 33.9%
    -0.44~+0.55 (n=1218): <-0.44: 26.6%, -0.44~+0.55: 45.6%, >+0.55: 27.8%
    >+0.55 (n=1224): <-0.44: 29.5%, -0.44~+0.55: 36.3%, >+0.55: 34.2%

  [Predicted > Actual Distribution]
    <-0.44 (n=1089): <-0.44: 37.1%, -0.44~+0.55: 29.8%, >+0.55: 33.1%
    -0.44~+0.55 (n=1393): <-0.44: 28.3%, -0.44~+0.55: 39.8%, >+0.55: 31.9%
    >+0.55 (n=1167): <-0.44: 35.0%, -0.44~+0.55: 29.0%, >+0.55: 35.9%
```

### 4-3. Regression은 다시 붙였을 때

- SMOOTHING_TEMPERATURE = 1.0, LAMBDA_REG = 1.0, LAMBDA_CLS = 1.0, LEARNING_RATE = 0.001, DROPOUT_RATE = 0.3
- models/1764903927_183_0.7405_acc_0.7664_mae_0.0080_val_acc_0.6808_val_mae_0.0083.weights.h5

```
=== Evaluation Results (2025-07-01 to 2025-11-30) ===
Samples: 3649

Classification:
  Accuracy: 0.3500
  Per-class distribution: [('<-0.44', 1207, 951), ('-0.44~+0.55', 1218, 1416), ('>+0.55', 1224, 1282)]

  [Actual > Predicted Distribution]
    <-0.44 (n=1207): <-0.44: 27.0%, -0.44~+0.55: 34.5%, >+0.55: 38.5%
    -0.44~+0.55 (n=1218): <-0.44: 24.5%, -0.44~+0.55: 43.3%, >+0.55: 32.3%
    >+0.55 (n=1224): <-0.44: 26.7%, -0.44~+0.55: 38.6%, >+0.55: 34.6%

  [Predicted > Actual Distribution]
    <-0.44 (n=951): <-0.44: 34.3%, -0.44~+0.55: 31.3%, >+0.55: 34.4%
    -0.44~+0.55 (n=1416): <-0.44: 29.4%, -0.44~+0.55: 37.2%, >+0.55: 33.4%
    >+0.55 (n=1282): <-0.44: 36.3%, -0.44~+0.55: 30.7%, >+0.55: 33.1%

Regression (MAE):
  Min return: 0.010184
  Max return: 0.010456
  Close return: 0.015602
  Direction accuracy: 0.4963

Regression Correlation Analysis:
  min_return:
    Pearson: 0.1425, Spearman: 0.0735
    R²: -0.2356
  max_return:
    Pearson: 0.0160, Spearman: 0.0305
    R²: -0.5028
  close_return:
    Pearson: -0.0114, Spearman: -0.0223
    R²: -0.4222
```

### 4-4. Regression만 남겼을 때

```
Regression (MAE):
  Min return: 0.011275
  Max return: 0.010117
  Close return: 0.016473
  Direction accuracy: 0.4867

Regression Correlation Analysis:
  min_return:
    Pearson: 0.1338, Spearman: 0.1857
    R²: -0.9648
  max_return:
    Pearson: 0.0245, Spearman: 0.0882
    R²: -0.7714
  close_return:
    Pearson: -0.0128, Spearman: -0.0048
    R²: -0.7931
```

---

## Logs; Trouble shooting & Variations ~ 20251209_case5

### 수정사항

- Evaluation에서 Standard Scaler다시 fit하는 버그 수정

### split opt 3

- split_opt=3
- SMOOTHING_TEMPERATURE = 1.0
- LAMBDA_REG = 1.0
- LAMBDA_CLS_CLOSE = 1.0
- LAMBDA_CLS_HIGH = 1.0
- LAMBDA_CLS_LOW = 1.0
- LEARNING_RATE = 0.001
- DROPOUT_RATE = 0.3

```
2025-12-09 14:22:45,368 - __main__ - INFO - Loaded model for inference from models/1765256371_178_1.9344_vca_0.7342_vha_0.7018_vla_0.7007_vmae_0.0070.weights.h5

=== Evaluation Results (2025-07-01 to 2025-11-30) ===
Samples: 3649

Classification (Close):
  Accuracy: 0.3738
  Per-class distribution: [('DOWN', 1207, 1221), ('STAY', 1218, 1116), ('UP', 1224, 1312)]

  [Actual > Predicted Distribution]
    DOWN (n=1207): DOWN: 37.4%, STAY: 27.7%, UP: 34.9%
    STAY (n=1218): DOWN: 33.7%, STAY: 34.0%, UP: 32.3%
    UP (n=1224): DOWN: 29.2%, STAY: 30.1%, UP: 40.7%

  [Predicted > Actual Distribution]
    DOWN (n=1221): DOWN: 37.0%, STAY: 33.7%, UP: 29.3%
    STAY (n=1116): DOWN: 29.9%, STAY: 37.1%, UP: 33.0%
    UP (n=1312): DOWN: 32.1%, STAY: 30.0%, UP: 38.0%

Classification (High):
  Accuracy: 0.3686
  Per-class distribution: [('STAY', 1276, 1496), ('UP', 1323, 1039), ('BUST', 1050, 1114)]

  [Actual > Predicted Distribution]
    STAY (n=1276): STAY: 45.7%, UP: 28.4%, BUST: 25.9%
    UP (n=1323): STAY: 40.3%, UP: 29.0%, BUST: 30.7%
    BUST (n=1050): STAY: 36.2%, UP: 27.8%, BUST: 36.0%

  [Predicted > Actual Distribution]
    STAY (n=1496): STAY: 39.0%, UP: 35.6%, BUST: 25.4%
    UP (n=1039): STAY: 34.9%, UP: 37.0%, BUST: 28.1%
    BUST (n=1114): STAY: 29.6%, UP: 36.4%, BUST: 33.9%

Classification (Low):
  Accuracy: 0.3661
  Per-class distribution: [('CRASH', 1089, 1062), ('DOWN', 1360, 1198), ('STAY', 1200, 1389)]

  [Actual > Predicted Distribution]
    CRASH (n=1089): CRASH: 34.3%, DOWN: 26.9%, STAY: 38.8%
    DOWN (n=1360): CRASH: 28.9%, DOWN: 35.4%, STAY: 35.7%
    STAY (n=1200): CRASH: 24.7%, DOWN: 35.2%, STAY: 40.1%

  [Predicted > Actual Distribution]
    CRASH (n=1062): CRASH: 35.1%, DOWN: 37.0%, STAY: 27.9%
    DOWN (n=1198): CRASH: 24.5%, DOWN: 40.2%, STAY: 35.3%
    STAY (n=1389): CRASH: 30.5%, DOWN: 34.9%, STAY: 34.6%

Regression (MAE):
  Min return: 0.011351
  Max return: 0.011576
  Close return: 0.016979
  Direction accuracy: 0.5311

Regression Correlation Analysis:
  min_return:
    Pearson: 0.0524, Spearman: -0.0014
    R²: -0.5111
  max_return:
    Pearson: 0.0753, Spearman: 0.0819
    R²: -0.8504
  close_return:
    Pearson: 0.0219, Spearman: 0.0527
    R²: -0.6556
```

### split opt 1

- split_opt 3 > 1 및 LEARNING_RATE 0.001 > 0.0001로 바꿔서 시도
- split_opt=1
- SMOOTHING_TEMPERATURE = 1.0
- LAMBDA_REG = 1.0
- LAMBDA_CLS_CLOSE = 1.0
- LAMBDA_CLS_HIGH = 1.0
- LAMBDA_CLS_LOW = 1.0
- LEARNING_RATE = 0.001
- DROPOUT_RATE = 0.3

```
2025-12-09 14:41:08,624 - __main__ - INFO - Loaded model for inference from ./models/1765258866_36_3.1962_vca_0.3993_vha_0.4341_vla_0.4122_vmae_0.0102.weights.h5

=== Evaluation Results (2025-07-01 to 2025-11-30) ===
Samples: 3649

Classification (Close):
  Accuracy: 0.3867
  Per-class distribution: [('DOWN', 1207, 1223), ('STAY', 1218, 1124), ('UP', 1224, 1302)]

  [Actual > Predicted Distribution]
    DOWN (n=1207): DOWN: 35.2%, STAY: 22.9%, UP: 41.8%
    STAY (n=1218): DOWN: 32.6%, STAY: 41.5%, UP: 25.9%
    UP (n=1224): DOWN: 32.8%, STAY: 27.9%, UP: 39.3%

  [Predicted > Actual Distribution]
    DOWN (n=1223): DOWN: 34.8%, STAY: 32.5%, UP: 32.8%
    STAY (n=1124): DOWN: 24.6%, STAY: 44.9%, UP: 30.4%
    UP (n=1302): DOWN: 38.8%, STAY: 24.3%, UP: 36.9%

Classification (High):
  Accuracy: 0.3960
  Per-class distribution: [('STAY', 1276, 1216), ('UP', 1323, 1099), ('BUST', 1050, 1334)]

  [Actual > Predicted Distribution]
    STAY (n=1276): STAY: 41.1%, UP: 29.7%, BUST: 29.2%
    UP (n=1323): STAY: 31.2%, UP: 32.8%, BUST: 36.0%
    BUST (n=1050): STAY: 26.5%, UP: 27.2%, BUST: 46.3%

  [Predicted > Actual Distribution]
    STAY (n=1216): STAY: 43.2%, UP: 34.0%, BUST: 22.9%
    UP (n=1099): STAY: 34.5%, UP: 39.5%, BUST: 26.0%
    BUST (n=1334): STAY: 27.9%, UP: 35.7%, BUST: 36.4%

Classification (Low):
  Accuracy: 0.4272
  Per-class distribution: [('CRASH', 1089, 1407), ('DOWN', 1360, 1437), ('STAY', 1200, 805)]

  [Actual > Predicted Distribution]
    CRASH (n=1089): CRASH: 54.5%, DOWN: 36.5%, STAY: 9.0%
    DOWN (n=1360): CRASH: 35.0%, DOWN: 42.0%, STAY: 23.0%
    STAY (n=1200): CRASH: 28.1%, DOWN: 39.1%, STAY: 32.8%

  [Predicted > Actual Distribution]
    CRASH (n=1407): CRASH: 42.2%, DOWN: 33.8%, STAY: 24.0%
    DOWN (n=1437): CRASH: 27.6%, DOWN: 39.7%, STAY: 32.6%
    STAY (n=805): CRASH: 12.2%, DOWN: 38.9%, STAY: 48.9%

Regression (MAE):
  Min return: 0.008351
  Max return: 0.007895
  Close return: 0.012308
  Direction accuracy: 0.5177

Regression Correlation Analysis:
  min_return:
    Pearson: 0.2687, Spearman: 0.2974
    R²: -0.0685
  max_return:
    Pearson: 0.1513, Spearman: 0.1414
    R²: -0.0608
  close_return:
    Pearson: 0.0074, Spearman: 0.0236
    R²: -0.0003
```

---

## Logs; Trouble shooting & Variations ~ 20251209_case6

### 실수로 빠트린 6개 피쳐 추가

- EMA12_dev 추세 지표
- EMA26_dev 추세 지표
- mark_spread 선물 지표
- EMA12_dev_z 가공 피쳐 Z-score
- EMA26_dev_z 가공 피쳐 Z-score
- mark_spread_z 가공 피쳐 Z-score

### 입력 조건 및 결과

- split_opt=1
- SMOOTHING_TEMPERATURE = 1.0
- LAMBDA_REG = 1.0
- LAMBDA_CLS_CLOSE = 1.0
- LAMBDA_CLS_HIGH = 1.0
- LAMBDA_CLS_LOW = 1.0
- LEARNING_RATE = 0.0001
- DROPOUT_RATE = 0.3

```
2025-12-09 16:34:54,093 - __main__ - INFO - Loaded model for inference from ./models/1765265692_40_3.1959_vca_0.3948_vha_0.4262_vla_0.4248_vmae_0.0103.weights.h5

=== Evaluation Results (2025-07-01 to 2025-11-30) ===
Samples: 3649

Classification (Close):
  Accuracy: 0.3845
  Per-class distribution: [('DOWN', 1207, 1260), ('STAY', 1218, 1423), ('UP', 1224, 966)]

  [Actual > Predicted Distribution]
    DOWN (n=1207): DOWN: 36.7%, STAY: 32.2%, UP: 31.1%
    STAY (n=1218): DOWN: 31.9%, STAY: 49.2%, UP: 18.9%
    UP (n=1224): DOWN: 35.0%, STAY: 35.5%, UP: 29.5%

  [Predicted > Actual Distribution]
    DOWN (n=1260): DOWN: 35.2%, STAY: 30.9%, UP: 34.0%
    STAY (n=1423): DOWN: 27.3%, STAY: 42.1%, UP: 30.6%
    UP (n=966): DOWN: 38.8%, STAY: 23.8%, UP: 37.4%

Classification (High):
  Accuracy: 0.3845
  Per-class distribution: [('STAY', 1276, 1126), ('UP', 1323, 1223), ('BUST', 1050, 1300)]

  [Actual > Predicted Distribution]
    STAY (n=1276): STAY: 36.7%, UP: 34.7%, BUST: 28.6%
    UP (n=1323): STAY: 30.6%, UP: 34.7%, BUST: 34.7%
    BUST (n=1050): STAY: 24.1%, UP: 30.6%, BUST: 45.3%

  [Predicted > Actual Distribution]
    STAY (n=1126): STAY: 41.6%, UP: 36.0%, BUST: 22.5%
    UP (n=1223): STAY: 36.2%, UP: 37.5%, BUST: 26.2%
    BUST (n=1300): STAY: 28.1%, UP: 35.3%, BUST: 36.6%

Classification (Low):
  Accuracy: 0.4229
  Per-class distribution: [('CRASH', 1089, 1390), ('DOWN', 1360, 1280), ('STAY', 1200, 979)]

  [Actual > Predicted Distribution]
    CRASH (n=1089): CRASH: 52.3%, DOWN: 36.0%, STAY: 11.7%
    DOWN (n=1360): CRASH: 35.5%, DOWN: 36.7%, STAY: 27.8%
    STAY (n=1200): CRASH: 28.1%, DOWN: 32.4%, STAY: 39.5%

  [Predicted > Actual Distribution]
    CRASH (n=1390): CRASH: 41.0%, DOWN: 34.7%, STAY: 24.2%
    DOWN (n=1280): CRASH: 30.6%, DOWN: 39.0%, STAY: 30.4%
    STAY (n=979): CRASH: 13.0%, DOWN: 38.6%, STAY: 48.4%

Regression (MAE):
  Min return: 0.008858
  Max return: 0.008073
  Close return: 0.012622
  Direction accuracy: 0.5106

Regression Correlation Analysis:
  min_return:
    Pearson: 0.1565, Spearman: 0.1834
    R²: -0.0113
  max_return:
    Pearson: 0.1237, Spearman: 0.1428
    R²: -0.0924
  close_return:
    Pearson: 0.0078, Spearman: -0.0079
    R²: -0.0216
```

- 피쳐 빠진 것 추가하기 전/후 별 차이 없음. 오히려 약간 떨어짐
- 한 번 더 돌리고 결과 확인

```
2025-12-09 17:08:08,046 - __main__ - INFO - Loaded model for inference from ./models/1765267686_38_3.1961_vca_0.3987_vha_0.4255_vla_0.4205_vmae_0.0104.weights.h5

=== Evaluation Results (2025-07-01 to 2025-11-30) ===
Samples: 3649

Classification (Close):
  Accuracy: 0.3774
  Per-class distribution: [('DOWN', 1207, 1385), ('STAY', 1218, 1095), ('UP', 1224, 1169)]

  [Actual > Predicted Distribution]
    DOWN (n=1207): DOWN: 39.3%, STAY: 22.1%, UP: 38.6%
    STAY (n=1218): DOWN: 36.9%, STAY: 39.7%, UP: 23.3%
    UP (n=1224): DOWN: 37.7%, STAY: 28.1%, UP: 34.2%

  [Predicted > Actual Distribution]
    DOWN (n=1385): DOWN: 34.2%, STAY: 32.5%, UP: 33.3%
    STAY (n=1095): DOWN: 24.4%, STAY: 44.2%, UP: 31.4%
    UP (n=1169): DOWN: 39.9%, STAY: 24.3%, UP: 35.8%

Classification (High):
  Accuracy: 0.3735
  Per-class distribution: [('STAY', 1276, 789), ('UP', 1323, 1015), ('BUST', 1050, 1845)]

  [Actual > Predicted Distribution]
    STAY (n=1276): STAY: 28.7%, UP: 27.8%, BUST: 43.5%
    UP (n=1323): STAY: 20.7%, UP: 28.6%, BUST: 50.7%
    BUST (n=1050): STAY: 14.2%, UP: 26.9%, BUST: 59.0%

  [Predicted > Actual Distribution]
    STAY (n=789): STAY: 46.4%, UP: 34.7%, BUST: 18.9%
    UP (n=1015): STAY: 35.0%, UP: 37.2%, BUST: 27.8%
    BUST (n=1845): STAY: 30.1%, UP: 36.4%, BUST: 33.6%

Classification (Low):
  Accuracy: 0.4283
  Per-class distribution: [('CRASH', 1089, 1911), ('DOWN', 1360, 905), ('STAY', 1200, 833)]

  [Actual > Predicted Distribution]
    CRASH (n=1089): CRASH: 71.9%, DOWN: 20.2%, STAY: 7.9%
    DOWN (n=1360): CRASH: 48.2%, DOWN: 27.1%, STAY: 24.7%
    STAY (n=1200): CRASH: 39.4%, DOWN: 26.3%, STAY: 34.2%

  [Predicted > Actual Distribution]
    CRASH (n=1911): CRASH: 41.0%, DOWN: 34.3%, STAY: 24.8%
    DOWN (n=905): CRASH: 24.3%, DOWN: 40.8%, STAY: 34.9%
    STAY (n=833): CRASH: 10.3%, DOWN: 40.3%, STAY: 49.3%

Regression (MAE):
  Min return: 0.008725
  Max return: 0.008092
  Close return: 0.012370
  Direction accuracy: 0.5171

Regression Correlation Analysis:
  min_return:
    Pearson: 0.0706, Spearman: 0.1700
    R²: -0.1824
  max_return:
    Pearson: 0.0552, Spearman: 0.0761
    R²: -0.1229
  close_return:
    Pearson: -0.0319, Spearman: -0.0274
    R²: -0.0119
```

- EMA 항목 제거

```
2025-12-09 17:22:35,840 - __main__ - INFO - Loaded model for inference from ./models/1765268554_40_3.1993_vca_0.3890_vha_0.4248_vla_0.4202_vmae_0.0104.weights.h5

=== Evaluation Results (2025-07-01 to 2025-11-30) ===
Samples: 3649

Classification (Close):
  Accuracy: 0.3913
  Per-class distribution: [('DOWN', 1207, 1058), ('STAY', 1218, 1641), ('UP', 1224, 950)]

  [Actual > Predicted Distribution]
    DOWN (n=1207): DOWN: 32.7%, STAY: 36.2%, UP: 31.1%
    STAY (n=1218): DOWN: 24.8%, STAY: 56.4%, UP: 18.8%
    UP (n=1224): DOWN: 29.5%, STAY: 42.2%, UP: 28.3%

  [Predicted > Actual Distribution]
    DOWN (n=1058): DOWN: 37.3%, STAY: 28.5%, UP: 34.1%
    STAY (n=1641): DOWN: 26.6%, STAY: 41.9%, UP: 31.5%
    UP (n=950): DOWN: 39.5%, STAY: 24.1%, UP: 36.4%

Classification (High):
  Accuracy: 0.3963
  Per-class distribution: [('STAY', 1276, 1495), ('UP', 1323, 909), ('BUST', 1050, 1245)]

  [Actual > Predicted Distribution]
    STAY (n=1276): STAY: 48.4%, UP: 23.3%, BUST: 28.4%
    UP (n=1323): STAY: 39.1%, UP: 28.4%, BUST: 32.5%
    BUST (n=1050): STAY: 34.4%, UP: 22.5%, BUST: 43.1%

  [Predicted > Actual Distribution]
    STAY (n=1495): STAY: 41.3%, UP: 34.6%, BUST: 24.1%
    UP (n=909): STAY: 32.7%, UP: 41.4%, BUST: 26.0%
    BUST (n=1245): STAY: 29.1%, UP: 34.5%, BUST: 36.4%

Classification (Low):
  Accuracy: 0.4303
  Per-class distribution: [('CRASH', 1089, 1245), ('DOWN', 1360, 1232), ('STAY', 1200, 1172)]

  [Actual > Predicted Distribution]
    CRASH (n=1089): CRASH: 49.9%, DOWN: 35.2%, STAY: 15.0%
    DOWN (n=1360): CRASH: 30.7%, DOWN: 35.3%, STAY: 34.0%
    STAY (n=1200): CRASH: 23.7%, DOWN: 30.8%, STAY: 45.6%

  [Predicted > Actual Distribution]
    CRASH (n=1245): CRASH: 43.6%, DOWN: 33.6%, STAY: 22.8%
    DOWN (n=1232): CRASH: 31.1%, DOWN: 39.0%, STAY: 30.0%
    STAY (n=1172): CRASH: 13.9%, DOWN: 39.4%, STAY: 46.7%

Regression (MAE):
  Min return: 0.008741
  Max return: 0.008046
  Close return: 0.012320
  Direction accuracy: 0.5155

Regression Correlation Analysis:
  min_return:
    Pearson: 0.1281, Spearman: 0.2016
    R²: -0.1806
  max_return:
    Pearson: 0.1257, Spearman: 0.1341
    R²: -0.1391
  close_return:
    Pearson: -0.0363, Spearman: -0.0296
    R²: -0.0030
```

- EMA 피쳐 빼고 계산한 것이 오히려 성능이 좋음

---

## Logs; Trouble shooting & Variations ~ 20251210_case7

### 수정사항

- ema는 뺌
- bin 3개 있으니깐 특히 close의 경우에 변동성 항목과 직접 연관되어 가운데 <> 극단 으로 나뉘고, 방향성은 익히지 못하는 듯
- min, max, close 각각 bin 2개로 수정
- future slide 6 > 12, 24도 테스트 해보기
- split_opt=1

```
2025-12-10 14:54:06,033 - __main__ - INFO - Loaded model for inference from ./models/1765346044_28_2.0264_vca_0.5042_vha_0.6092_vla_0.5998_vmae_0.0107.weights.h5

======================================================================
  📊 EVALUATION SUMMARY (2025-07-01 to 2025-11-30)
======================================================================
  Samples: 3649

  📈 Classification Accuracy:
     Close: 0.4889
     High:  0.5475
     Low:   0.6136

  📉 Regression Pearson Correlation:
     Min:   0.0235
     Max:   0.0360
     Close: -0.0021

  🎯 Close Direction Accuracy: 0.5086 (50.86%)
======================================================================

Classification (Close):
  Accuracy: 0.4889
  Per-class distribution: [('DOWN', 1761, 1244), ('UP', 1888, 2405)]

  [Actual > Predicted Distribution]
    DOWN (n=1761): DOWN: 32.4%, UP: 67.6%
    UP (n=1888): DOWN: 35.7%, UP: 64.3%

  [Predicted > Actual Distribution]
    DOWN (n=1244): DOWN: 45.8%, UP: 54.2%
    UP (n=2405): DOWN: 49.5%, UP: 50.5%

Classification (High):
  Accuracy: 0.5475
  Per-class distribution: [('STAY', 2029, 1746), ('UP', 1620, 1903)]

  [Actual > Predicted Distribution]
    STAY (n=2029): STAY: 52.3%, UP: 47.7%
    UP (n=1620): STAY: 42.2%, UP: 57.8%

  [Predicted > Actual Distribution]
    STAY (n=1746): STAY: 60.8%, UP: 39.2%
    UP (n=1903): STAY: 50.8%, UP: 49.2%

Classification (Low):
  Accuracy: 0.6136
  Per-class distribution: [('DOWN', 1605, 1787), ('STAY', 2044, 1862)]

  [Actual > Predicted Distribution]
    DOWN (n=1605): DOWN: 61.7%, STAY: 38.3%
    STAY (n=2044): DOWN: 38.9%, STAY: 61.1%

  [Predicted > Actual Distribution]
    DOWN (n=1787): DOWN: 55.5%, STAY: 44.5%
    STAY (n=1862): DOWN: 33.0%, STAY: 67.0%

Regression (MAE):
  Min return: 0.009202
  Max return: 0.008326
  Close return: 0.012783

Regression Correlation Analysis:
  min_return:
    Pearson: 0.0235, Spearman: 0.0094
    R²: -0.2530
  max_return:
    Pearson: 0.0360, Spearman: 0.0618
    R²: -0.1948
  close_return:
    Pearson: -0.0021, Spearman: -0.0509
    R²: -0.0549
```

- split_opt=2

```
2025-12-10 15:07:32,465 - __main__ - INFO - Loaded model for inference from ./models/1765346851_48_1.9189_vca_0.5336_vha_0.6463_vla_0.6567_vmae_0.0107.weights.h5

======================================================================
  📊 EVALUATION SUMMARY (2025-07-01 to 2025-11-30)
======================================================================
  Samples: 3649

  📈 Classification Accuracy:
     Close: 0.5086
     High:  0.5802
     Low:   0.5963

  📉 Regression Pearson Correlation:
     Min:   0.3124
     Max:   0.1884
     Close: -0.0096

  🎯 Close Direction Accuracy: 0.5015 (50.15%)
======================================================================


──────────────────────────────────────────────────────────────────────
  DETAILED RESULTS
──────────────────────────────────────────────────────────────────────

Classification (Close):
  Accuracy: 0.5086
  Per-class distribution: [('DOWN', 1761, 2142), ('UP', 1888, 1507)]

  [Actual > Predicted Distribution]
    DOWN (n=1761): DOWN: 59.9%, UP: 40.1%
    UP (n=1888): DOWN: 57.6%, UP: 42.4%

  [Predicted > Actual Distribution]
    DOWN (n=2142): DOWN: 49.3%, UP: 50.7%
    UP (n=1507): DOWN: 46.8%, UP: 53.2%

Classification (High):
  Accuracy: 0.5802
  Per-class distribution: [('STAY', 2029, 2123), ('UP', 1620, 1526)]

  [Actual > Predicted Distribution]
    STAY (n=2029): STAY: 64.6%, UP: 35.4%
    UP (n=1620): STAY: 50.2%, UP: 49.8%

  [Predicted > Actual Distribution]
    STAY (n=2123): STAY: 61.7%, UP: 38.3%
    UP (n=1526): STAY: 47.1%, UP: 52.9%

Classification (Low):
  Accuracy: 0.5963
  Per-class distribution: [('DOWN', 1605, 1734), ('STAY', 2044, 1915)]

  [Actual > Predicted Distribution]
    DOWN (n=1605): DOWN: 58.1%, STAY: 41.9%
    STAY (n=2044): DOWN: 39.2%, STAY: 60.8%

  [Predicted > Actual Distribution]
    DOWN (n=1734): DOWN: 53.8%, STAY: 46.2%
    STAY (n=1915): DOWN: 35.1%, STAY: 64.9%

Regression (MAE):
  Min return: 0.008196
  Max return: 0.007865
  Close return: 0.012317

Regression Correlation Analysis:
  min_return:
    Pearson: 0.3124, Spearman: 0.3153
    R²: 0.0537
  max_return:
    Pearson: 0.1884, Spearman: 0.1852
    R²: -0.0220
  close_return:
    Pearson: -0.0096, Spearman: -0.0103
    R²: -0.0043
```

- split_opt=3

```
2025-12-10 16:06:33,552 - __main__ - INFO - Loaded model for inference from ./models/1765350391_234_1.0911_vca_0.8261_vha_0.8378_vla_0.8504_vmae_0.0073.weights.h5

======================================================================
  📊 EVALUATION SUMMARY (2025-07-01 to 2025-11-30)
======================================================================
  Samples: 3649

  📈 Classification Accuracy:
     Close: 0.5152
     High:  0.5314
     Low:   0.5229

  📉 Regression Pearson Correlation:
     Min:   0.0738
     Max:   0.0358
     Close: -0.0107

  🎯 Close Direction Accuracy: 0.5163 (51.63%)
======================================================================


──────────────────────────────────────────────────────────────────────
  DETAILED RESULTS
──────────────────────────────────────────────────────────────────────

Classification (Close):
  Accuracy: 0.5152
  Per-class distribution: [('DOWN', 1761, 1800), ('UP', 1888, 1849)]

  [Actual > Predicted Distribution]
    DOWN (n=1761): DOWN: 50.9%, UP: 49.1%
    UP (n=1888): DOWN: 47.9%, UP: 52.1%

  [Predicted > Actual Distribution]
    DOWN (n=1800): DOWN: 49.8%, UP: 50.2%
    UP (n=1849): DOWN: 46.8%, UP: 53.2%

Classification (High):
  Accuracy: 0.5314
  Per-class distribution: [('STAY', 2029, 2011), ('UP', 1620, 1638)]

  [Actual > Predicted Distribution]
    STAY (n=2029): STAY: 57.4%, UP: 42.6%
    UP (n=1620): STAY: 52.2%, UP: 47.8%

  [Predicted > Actual Distribution]
    STAY (n=2011): STAY: 57.9%, UP: 42.1%
    UP (n=1638): STAY: 52.7%, UP: 47.3%

Classification (Low):
  Accuracy: 0.5229
  Per-class distribution: [('DOWN', 1605, 1746), ('STAY', 2044, 1903)]

  [Actual > Predicted Distribution]
    DOWN (n=1605): DOWN: 50.2%, STAY: 49.8%
    STAY (n=2044): DOWN: 46.0%, STAY: 54.0%

  [Predicted > Actual Distribution]
    DOWN (n=1746): DOWN: 46.1%, STAY: 53.9%
    STAY (n=1903): DOWN: 42.0%, STAY: 58.0%

Regression (MAE):
  Min return: 0.011425
  Max return: 0.010429
  Close return: 0.016413

Regression Correlation Analysis:
  min_return:
    Pearson: 0.0738, Spearman: 0.0360
    R²: -0.4871
  max_return:
    Pearson: 0.0358, Spearman: 0.0686
    R²: -0.5264
  close_return:
    Pearson: -0.0107, Spearman: 0.0218
    R²: -0.5817
```

- target future slide = 6 > 24 로 바꿔도 도찐개찐

---

## Time Window 수정 고려

값(현재 72, 즉 3일치 데이터)을 조정할 때의 영향과 Time Series Forecasting, 특히 LSTM 모델에서의 Best Practice에 대해 설명해 드리겠습니다.

### 1. 값 변경 시 예상되는 영향

**A. 48로 줄이는 경우 (2일)**

*   **장점:**
    *   **학습 속도 향상:** 시퀀스 길이가 짧아져 연산량이 줄어듭니다.
    *   **최신성 반영:** 먼 과거의 노이즈를 배제하고, 가장 최근의 시장 변동(Momentum)에 집중합니다.
*   **단점:**
    *   **패턴 유실:** 3일 이상의 기간에 걸쳐 형성되는 패턴이나 추세를 놓칠 수 있습니다.
    *   **정보 부족:** 모델이 판단할 수 있는 문맥(Context)이 줄어듭니다.

**B. 144(6일) ~ 216(9일)으로 늘리는 경우**

*   **장점:**
    *   **주기성 포착:** 암호화폐나 주식 시장의 **주간 패턴(Weekly Seasonality, 168시간)**을 포함하거나 근접하게 되어, 요일별 특성 등을 학습할 가능성이 높아집니다.
    *   **장기 의존성:** 더 긴 호흡의 추세 전환을 감지할 수 있습니다.
*   **단점:**
    *   **학습 난이도 상승:** LSTM이 장기 의존성(Long-term dependency) 문제를 어느 정도 해결했지만, 시퀀스가 너무 길어지면 여전히 초기 정보가 희석되거나 학습 효율이 떨어질 수 있습니다.
    *   **과적합(Overfitting):** 과거의 특정 패턴에 과도하게 맞춰질 위험이 있습니다.

### 2. Time Series & LSTM Best Practice

학계와 실무에서 통용되는 일반적인 가이드라인은 다음과 같습니다.

**1. 주요 주기(Cycle)를 포함하라**

*   데이터에 주기성이 있다면 그 주기를 포함하는 것이 좋습니다.
*   **Hourly Data의 경우:**
    *   **일간 주기(Daily):** 24시간
    *   **주간 주기(Weekly):** 168시간
*   **Best Practice:** 현재 설정된 **72(3일)**는 단기 추세를 보기에 적절한 타협점입니다. 만약 더 긴 패턴을 보고 싶다면 어중간한 144, 216보다는 **168(정확히 1주일)**을 테스트해보는 것이 논리적입니다.

**2. 시퀀스 길이의 한계 (Vanishing Gradient)**

*   LSTM은 보통 **50~200 스텝** 정도까지는 잘 작동하지만, 그 이상 길어지면 성능 향상이 둔화되거나 오히려 떨어지는 경향이 있습니다.
*   **200 이상의 긴 시퀀스**를 다뤄야 한다면, 단순 LSTM보다는 **Attention 메커니즘**을 추가하거나 Transformer 계열 모델을 사용하는 것이 현대적인 Best Practice입니다.

**3. Feature Engineering으로 보완**

*   단순히 Window를 늘리는 대신, **장기 지표를 별도의 Feature로 주입**하는 방법이 효율적입니다.
*   예: Window는 72로 유지하되, 입력 Feature에 `7일 이동평균`, `30일 변동성` 값을 추가하여 모델이 굳이 긴 시퀀스를 훑지 않아도 장기 추세를 알 수 있게 합니다.

### 요약 및 추천

*   **현재(72):** 단기 트레이딩에 적합한 무난한 설정입니다.
*   **실험 추천:**
    *   **168 (1주일):** 주간 패턴이 중요한지 확인하고 싶다면 168로 늘려보세요. (LSTM이 감당 가능한 수준입니다.)
    *   **48:** 스캘핑에 가까운 초단기 대응이 목표가 아니라면 너무 짧을 수 있습니다.

결론적으로, **72에서 168 사이**가 LSTM 단일 모델로는 가장 효율적인 구간으로 보입니다.

### 테스트 결과

- 느리기만 하고 별 소득없었음.

```
2025-12-11 13:21:00,507 - __main__ - INFO - Loaded model for inference from models/1765415912_32_2.0248_vca_0.5091_vha_0.6026_vla_0.6077_vmae_0.0104.weights.h5

======================================================================
  📊 EVALUATION SUMMARY (2025-07-01 to 2025-11-30)
======================================================================
  Samples: 3632

  📈 Classification Accuracy:
     Close: 0.5179
     High:  0.5534
     Low:   0.6178

  📉 Regression Pearson Correlation:
     Min:   0.0051
     Max:   -0.0032
     Close: 0.0084

  🎯 Close Direction Accuracy: 0.5184 (51.84%)
======================================================================


──────────────────────────────────────────────────────────────────────
  DETAILED RESULTS
──────────────────────────────────────────────────────────────────────

Classification (Close):
  Accuracy: 0.5179
  Per-class distribution: [('DOWN', 1747, 314), ('UP', 1885, 3318)]

  [Actual > Predicted Distribution]
    DOWN (n=1747): DOWN: 8.9%, UP: 91.1%
    UP (n=1885): DOWN: 8.4%, UP: 91.6%

  [Predicted > Actual Distribution]
    DOWN (n=314): DOWN: 49.4%, UP: 50.6%
    UP (n=3318): DOWN: 48.0%, UP: 52.0%

Classification (High):
  Accuracy: 0.5534
  Per-class distribution: [('STAY', 2016, 1676), ('UP', 1616, 1956)]

  [Actual > Predicted Distribution]
    STAY (n=2016): STAY: 51.3%, UP: 48.7%
    UP (n=1616): STAY: 39.7%, UP: 60.3%

  [Predicted > Actual Distribution]
    STAY (n=1676): STAY: 61.8%, UP: 38.2%
    UP (n=1956): STAY: 50.2%, UP: 49.8%

Classification (Low):
  Accuracy: 0.6178
  Per-class distribution: [('DOWN', 1597, 1799), ('STAY', 2035, 1833)]

  [Actual > Predicted Distribution]
    DOWN (n=1597): DOWN: 62.9%, STAY: 37.1%
    STAY (n=2035): DOWN: 39.1%, STAY: 60.9%

  [Predicted > Actual Distribution]
    DOWN (n=1799): DOWN: 55.8%, STAY: 44.2%
    STAY (n=1833): DOWN: 32.4%, STAY: 67.6%

Regression (MAE):
  Min return: 0.008856
  Max return: 0.008103
  Close return: 0.012340

Regression Correlation Analysis:
  min_return:
    Pearson: 0.0051, Spearman: 0.0052
    R²: -0.2105
  max_return:
    Pearson: -0.0032, Spearman: -0.0099
    R²: -0.1482
  close_return:
    Pearson: 0.0084, Spearman: 0.0181
    R²: -0.0002
```

---

## Logs; Trouble shooting & Variations ~ 20251212_case8

### 대상 변경

**기존 대상**
- 예측 대상: cadli ETH-USDT
   - 가격, 추세/변동성/거래량 지표
- 선물 대상: binance ETH-USDT-VANILLA-PERPETUAL
   - 가격, 거래량, open interest, mark price, funding rate
- 스프레드 대상: binance ETH-USDT
   - 가격
- 연관 자산: cadli BTC-USDT
   - 가격, 거래량

**변경 대상**
- 예측 대상: binance BTC-USDT
   - 가격, 추세/변동성/거래량 지표
- 선물 대상: binance BTC-USDT-VANILLA-PERPETUAL, BTC-USDC-VANYLLA-PERPETUAL, BTC-USD-INVERSE_PERPETUAL
   - 가격, 거래량, open interest, mark price, funding rate
- 스프레드 대상: cadli BTC-USDT
   - 가격
- 연관 자산: binance ETH-USDT
   - 가격, 거래량

