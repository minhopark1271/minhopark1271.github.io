---
title: SWING 모델
parent: 투자
nav_order: 6
---

# SWING 모델 구성
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## Target

- BTC, ETH
- BTC, ETH는 변동성이 상대적으로 낮고 안정성은 높으므로 긴 시간텀 거래에 적합

### 아이디어

- BTC, ETH OHLCV 자체의 시계열 패턴
- 시장간 가격 차이에 따른 패턴: cadli, ccix, bianace BTC/USDT, upbit BTC/KRW
- 선물시장의 가격, 거래량, Open interest, Funding rate 패턴과의 연관성
   - binance BTC-USDT-VANYLLA-PERPETUAL: OHLCV, Open interest, Funding rate
   - binance BTC-USDC-VANYLLA-PERPETUAL: OHLCV, Open interest, Funding rate
   - binance BTC-USD-INVERSE-PERPETUAL: OHLCV, Open interest, Funding rate
- BTC <> ETH <> 나머지 코인간 연관성
- BTC <> 금(GC) <> 달러인덱스(DXY) <> 미국채선물(ZN, ZF, ...) <> 공포지수(VIX) <> 암호화폐 탐욕지수 (Crypto F&G)간 연관성
- 이 중에 중요하고 입수가능한 몇가지를 입력으로 사용해보자

---

## Time Frame

### 입력 : 1D, 1H 조합

- 1D x 60 : 2달간의 장기 추세
- 1H x 168 (24 * 7) : 7일간의 단기 추세

### 출력

- 1D Min, Max, Close, 가격변동구간별 확률
- 3D Min, Max, Close, 가격변동구간별 확률

**가격변동구간별 확률**
- 종가 기준 + (Min, Max)
- 절대가격기준 -10 ~ +10
- 세부 수치는 데이터를 한 번 보고 정하자

### 출력의 활용

- 가격변동구간별 확률로 기대수익이 가장 높은 TP/SL 설정
- 기대수익이 기준 이상인 구간에서만 포지션 진입

---

## Input Features

### 요소

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

### 극단값
- 극단값은 1%/99% 윈저라이즈 사용
