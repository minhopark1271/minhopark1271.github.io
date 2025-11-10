---
title: POC모델
parent: 투자
nav_order: 6
---

# POC 모델 구성
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## Time Frame

### 입력 : 1D, 1H 조합

- 1D x 60 : 2달간의 장기 추세
- 1H x 168 (24 * 7) : 7일간의 단기 추세

### 출력

- 1D Min, Max, Close
- 3D Min, Max, Close

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
