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
- **방법**: 종가 대비 편차 비율 + z-score  
- **공식**: $d^{(9)}_t=(EMA9_t-C_t)/C_t$, EMA21도 동일 적용  

### MACD(12,26,9)
- **방법**: ATR 또는 가격으로 나눠 상대화 + z-score  
- **공식**: $MACD^\*_t = MACD_t / ATR_{t,W}$ 또는 $/C_t$  

### RSI(14)
- **방법**: [-1,1] 스케일링  
- **공식**: $RSI^\pm_t = (RSI_t - 50)/50$  

### Volume
- **방법**: log(1+V) + 롤링 평균 대비 비율  
- **공식**: $v^\*_t = V_t/SMA(V)_{t,W} - 1$  
- **비고**: 로버스트 z-score 적용  

#### 추가 팁

- 1D와 1H는 각각의 윈도우 기준으로 독립 정규화.
- 훈련 구간의 통계만 사용하여 스케일링 (누수 방지).
- 극단값은 tanh 정규화 또는 1%/99% 윈저라이즈 권장.
