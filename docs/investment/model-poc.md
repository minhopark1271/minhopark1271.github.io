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

- 가격 : 종가
- 추세 : EMA9, EMA21, MACD(12, 26, 9), RSI(14)
- 거래량 : Volume

### 가격
- **방법**: 로그수익률
- **공식**: $r_t=\ln(C_t/C_{t-1})$

### EMA9, EMA21
- **방법**: 종가 대비 편차 비율
- **공식**: $d_t=(EMA_t-C_t)/C_t$

### MACD(12,26,9)
- **방법**: 가격으로 나눠 상대화
- **공식**: $MACD^\ast_t = MACD_t/C_t$

### RSI(14)
- **방법**: [-1,1] 스케일링
- **공식**: $RSI^\pm_t = (RSI_t - 50)/50$

### Volume
- **방법**: log(1+V) + 롤링 평균 대비 비율
- **공식**: $v^\ast_t = V_t/SMA(V)_{t,W} - 1$

### 극단값
- 극단값은 1%/99% 윈저라이즈 사용
