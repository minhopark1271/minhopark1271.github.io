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

- 향후 1일간 Min
- 향후 1일간 Max
- 1일 후 종가
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

ETH cadli OHLCV 데이터

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

- **방법**: 로그 거래량
- **공식**: $v = \ln(1+V)$  

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

### 선물 가격 프리미엄

- **방법**: 현물 대비 선물 가격 프리미엄 비율
- **공식**: $Premium_t = (F_t - S_t) / S_t$
- **비고**: 
  - $F_t$: 선물 종가, $S_t$: 현물 종가
  - 양수: 선물 프리미엄 (강세장), 음수: 선물 디스카운트 (약세장)
  - USDT/USDC 중 거래량이 많은 것, USD-INVERSE 각각 계산

### 선물 거래량

- **방법**: 선물 거래량 자체를 로그 스케일로 변환해 크기(절대 활성도)를 안정화
- **공식**: $FV_t = \ln(1 + V_{futures,t})$
- **비고**: 
  - 극단적 스파이크(청산, 뉴스 이벤트)를 완화하면서 규모 비교 가능
  - 변화율 대신 절대적 유입 강도를 직접 반영 (모멘텀 초기 구간에서 유리)
  - Spot 대비 비율(Volume Ratio)와 조합하여 선물 단독 vs 상대적 활성도 모두 포착
  - USDT/USDC 중 거래량이 많은 것, USD-INVERSE 각각 계산

### 선물 거래량 비율

- **방법**: 현물 대비 선물 거래량 비율 (로그)
- **공식**: $VR_t = \ln(V_{futures} / V_{spot})$
- **비고**: 
  - 선물 거래 활성도가 높을수록 양수 증가
  - 시장 관심도 및 레버리지 포지션 규모 반영
  - USDT/USDC 중 거래량이 많은 것, USD-INVERSE 각각 계산

### Open Interest 변화율

- **방법**: OI의 로그 변화율 및 상대 규모
- **공식**: $\Delta OI_t = \ln(OI_t / OI_{t-1})$
- **비고**: 
  - 변화율: 새로운 포지션 유입/청산 속도
  - 급격한 변화는 청산 위험 또는 강한 추세 신호
  - USDT/USDC 중 거래량이 많은 것, USD-INVERSE 각각 계산

### Funding Rate

- **방법**: 직접 사용 (이미 정규화된 비율)
- **공식**: $FR_t$ (as-is)
- **비고**: 
  - 양수(보통 0~0.1%): Long이 Short에게 지불 → 롱 과열
  - 음수: Short이 Long에게 지불 → 숏 과열  
  - USDT/USDC 중 거래량이 많은 것, USD-INVERSE 각각 계산

### 시장간 가격 차이 요소 - 환율 필요

현물 시장 간 가격 괴리(프리미엄/디스카운트)는 단기 수급, 자본 유입/유출, 지역 규제 및 온/오프램프 비용을 반영하는 선행/확인 지표가 될 수 있다. 기준(Reference) 가격을 하나 정하고 다른 시장 가격을 이 기준에 상대화한다.

**기본 상대 프리미엄 (Relative Spread)**
- **방법**: 기준 거래소 가격 대비 상대 비율
- **공식**: $Spread^{(ex)}_t = \frac{P^{(ex)}_t - P^{(ref)}_t}{P^{(ref)}_t}$
- **비고**: 여러 거래소(ex)를 집합으로 관리: Upbit KRW, Binance USDC, Coinbase USD 등

---

## 학습 데이터 운용 전략

- 기간별 결손 데이터는 zero-fill 하고 결손 index 추가

### 1단계 학습 - 연구/튜닝 단계

- Train: 2020.01. ~ 2024.12.
- Validation: 2025.01. ~ 2025.06.
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
