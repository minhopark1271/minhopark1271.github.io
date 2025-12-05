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

### 입력 총정리

| 카테고리 | 피쳐명 | 공식/방법 | 설명 |
|---------|-------|-----------|------|
| **가격 (ETH-USDT)** | r1 | $r_t=\ln(C_t/C_{t-1})$ | 1시간 로그수익률 |
| | r6 | $r_t=\ln(C_t/C_{t-6})$ | 6시간 로그수익률 |
| | r24 | $r_t=\ln(C_t/C_{t-24})$ | 24시간 로그수익률 |
| **추세 지표** | EMA12_dev | $d_t=(C_t-EMA_{12})/C_t$ | 종가 대비 EMA12 편차 비율 |
| | EMA26_dev | $d_t=(C_t-EMA_{26})/C_t$ | 종가 대비 EMA26 편차 비율 |
| | MACD_hist_norm | $Hist. = (MACD-Signal)/ATR$ | ATR로 정규화된 MACD 히스토그램 |
| | RSI14_norm | $RSI^\pm_t = (RSI_t - 50)/50$ | [-1,1]로 정규화된 RSI |
| **변동성** | ATR14_rel | $ATR^\ast_t = ATR_t / C_t$ | 종가 대비 상대 변동성 |
| **거래량** | rel_log_volume | $v_{rel} = \ln((1+V)/(1+MA_{20}(V)))$ | 20일 이동평균 대비 상대 거래량 (로그) |
| **계절성** | month_sin | $\sin(2\pi \cdot month / 12)$ | 월 주기 인코딩 (sin) |
| | month_cos | $\cos(2\pi \cdot month / 12)$ | 월 주기 인코딩 (cos) |
| | day_sin | $\sin(2\pi \cdot day / 31)$ | 일 주기 인코딩 (sin) |
| | day_cos | $\cos(2\pi \cdot day / 31)$ | 일 주기 인코딩 (cos) |
| | weekday_sin | $\sin(2\pi \cdot weekday / 7)$ | 요일 주기 인코딩 (sin) |
| | weekday_cos | $\cos(2\pi \cdot weekday / 7)$ | 요일 주기 인코딩 (cos) |
| | hour_sin | $\sin(2\pi \cdot hour / 24)$ | 시간 주기 인코딩 (sin) |
| | hour_cos | $\cos(2\pi \cdot hour / 24)$ | 시간 주기 인코딩 (cos) |
| **선물 가격** | futures_premium | $Premium_t = (F_t - S_t) / S_t$ | 현물 대비 선물 프리미엄 |
| **선물 거래량** | futures_rel_log_volume | $FV_{rel,t} = \ln((1+V_{futures,t})/(1+MA_{20}(V_{futures,t})))$ | 선물 20일 이동평균 대비 상대 거래량 (로그) |
| | volume_ratio | $VR_t = \ln(V_{futures} / V_{spot})$ | 현물 대비 선물 거래량 비율 |
| **선물 지표** | oi_change | $\Delta OI_t = \ln(OI_t / OI_{t-1})$ | Open Interest 변화율 |
| | mark_spread | $MarkSpread_t = \frac{Mark_t - S_t}{S_t}$ | Mark Price와 현물 가격 간 차이 |
| | funding_rate | $FR_t \times 100$ | Funding Rate (%) |
| **시장간 차이** | spot_spread | $Spread^{(ex)}_t = \frac{P^{(binance)}_t - P^{(cadli)}_t}{P^{(cadli)}_t}$ | cadli 대비 binance 현물 가격 차이 |
| **연관 자산 (BTC)** | btc_r1 | $r_t=\ln(C_t/C_{t-1})$ | BTC 1시간 로그수익률 |
| | btc_r6 | $r_t=\ln(C_t/C_{t-6})$ | BTC 6시간 로그수익률 |
| | btc_r24 | $r_t=\ln(C_t/C_{t-24})$ | BTC 24시간 로그수익률 |
| | btc_rel_log_volume | $v_{rel} = \ln((1+V)/(1+MA_{20}(V)))$ | BTC 20일 이동평균 대비 상대 거래량 (로그) |
| **결손 지표** | missing_oi | 0/1 | OI 데이터 결손 여부 |
| | missing_fr | 0/1 | FR 데이터 결손 여부 |

- **일별 데이터 (14일)**: 가격, 추세, 변동성, 거래량, 계절성, 선물 지표, 시장간 차이, BTC 연관성
- **시간별 데이터 (72시간)**: 동일 피쳐 + 고빈도 계절성 (시간별)

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

## Logs; Trouble shooting & Variations ~ 202512XX_case4

### 피쳐 변경

- Daily features 삭제
- Hourly features, standard scaler로 조정한 입력 변수 추가

### 4-1. Daily features 삭제

- Daily features 삭제, Opt3 사용.
- LAMBDA_REG = 0.1, LAMBDA_CLS = 1.0, LEARNING_RATE = 0.001, DROPOUT_RATE = 0.5
- models/1764844898_284_0.7413_acc_0.7644_mae_0.0083_val_acc_0.6836_val_mae_0.0086.weights.h5
- 약한 상관성 나타남

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

### 4-1. Daily features 삭제

- LAMBDA_REG = 0.0, LAMBDA_CLS = 1.0, LEARNING_RATE = 0.001, DROPOUT_RATE = 0.3
