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

- 1D Min, Max, Close, 가격변동구간별 확률
- 3D Min, Max, Close, 가격변동구간별 확률

**가격변동구간별 확률**
- 종가 기준 + (Min, Max)
- 절대가격기준 -10% ~ +10%
- 세부 수치는 데이터를 한 번 보고 정하자

### 출력의 활용

- 가격변동구간별 확률로 기대수익이 가장 높은 TP/SL 설정
- 기대수익이 기준 이상인 구간에서만 포지션 진입

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
- Early stop: Val MAE (과적합 방지 목적, 하이퍼파라미터 튜닝용도 아님)
