---
title: 입력 정규화
parent: 투자
nav_order: 5
---

# 입력 정규화
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 정규화 비교

### 주요 정규화(Scaling) 방식 비교

| 이름 | 수식 | 중심 기준 | 이상치 내성 | 특징 및 활용 |
|------|------|-------------|---------------|----------------|
| **Z-Score (StandardScaler)** | $z = \frac{x - \mu}{\sigma}$ | 평균(Mean) | 낮음 | 정규분포형 데이터에 적합. 학습 안정성 좋지만 극단값에 민감. |
| **Min-Max Scaler** | $s = \frac{x - x_{min}}{x_{max} - x_{min}}$ | 최소–최대 | 매우 낮음 | [0,1] 범위. 신경망 입력에 직관적이지만 이상치 영향 큼. |
| **MaxAbs Scaler** | $s = \frac{x}{\|x\|_{max}}$ | 0 중심 | 낮음 | 양/음 대칭 데이터에 유용. 특히 Signed Data에 적합. |
| **RobustScaler** | $s = \frac{x - \text{Median}}{\text{IQR}}$ | 중앙값 | **높음** | 이상치에 강함. 로그수익률, 암호화폐 변동성에 최적. |
| **Quantile Transformer** | $s = F(x)$ (누적분포 기반) | 비모수 | **매우 높음** | 분포를 정규분포(또는 균등분포)로 매핑. 왜도(skewness) 교정에 좋음. |
| **Power Transformer (Yeo-Johnson)** | 로그형 변환 | 평균 | 중간 | 비정상적 분포를 정규화. 로그/루트 계열 대안. |
| **Log Transform** | $s = \ln(x+1)$ | 없음 | 높음 | 양수 값만 가능. 볼륨/가격 등 비대칭 분포에 유용. |
| **MinRank (RankScaler)** | $s = \frac{\text{rank}(x)}{N}$ | 순위 기반 | **매우 높음** | 순위 유지, 이상치 완전 무시. 분포 모양 불필요. |
| **Rolling Z-Score** | $s_t = \frac{x_t - \mu_t(w)}{\sigma_t(w)}$ | 이동 평균 | 중간 | 시계열 구간별 정규화. 데이터 레짐 변환에 강함. |

### 실전 추천 조합

| 데이터 유형 | 권장 스케일링 | 이유 |
|--------------|----------------|------|
| **가격 시계열 (Close, Open 등)** | Log-Return + Z-Score(롤링) | 정상성 확보 + 단위 표준화 |
| **변동성 지표 (ATR, STDDEV 등)** | RobustScaler / ATR/Close 비율 | 이상치에 강함 |
| **RSI, StochRSI 등 유계 지표** | 그대로 또는 [0,1] Scaling | 이미 정규화됨 |
| **Volume / 거래량** | Log(1+Volume) + RobustScaler | 로그 변환으로 왜도 보정 |
| **EMA, MACD 등 추세형** | (Close - EMA) / EMA 비율 | 단위 제거로 학습 안정화 |

### 정규화 선택 가이드

| 목표 | 추천 방식 | 이유 |
|------|-------------|------|
| 이상치가 잦은 암호화폐 | **RobustScaler / QuantileTransformer** | 극단값 영향 최소화 |
| 분포가 비정규/치우침 심함 | **QuantileTransformer / PowerTransformer** | 분포 왜곡 보정 |
| 모델 입력 범위가 [0,1] 요구 | **Min-Max / RankScaler** | 안정적 입력 제한 |
| 시계열 패턴 중심 (롤링 학습) | **Rolling Z-Score** | 구간별 표준화로 레짐 전환 적응 |
| 속도 및 간단함 중요 | **Z-Score** | 가장 일반적이고 계산 비용 낮음 |

---

## RobustScaler

### 실시간 추론에서 학습 범위를 벗어나는 데이터 대응

RobustScaler는 학습 시점의 **중앙값(Median)** 과 **사분위 범위(IQR)** 를 기준으로 정규화합니다.  
따라서 실시간 데이터가 학습 시의 분포 범위를 벗어나면, 스케일이 과도하게 커지거나 왜곡이 발생할 수 있습니다.  
이를 방지하기 위한 주요 대응 방법은 다음과 같습니다.

### 1. 윈저라이징(Winsorizing) / 클리핑(Clipping)

값을 IQR 범위 밖에서 잘라내어 극단적인 입력이 모델에 영향을 주지 않게 합니다.

```python
import numpy as np

def winsorize(x, q1, q3, k=3.0):
    iqr = q3 - q1
    low, high = q1 - k * iqr, q3 + k * iqr
    return np.clip(x, low, high)

# 예시: 학습 시 저장된 Q1, Q3 기반으로 실시간 입력 클리핑
X_real = winsorize(X_real, q1_train, q3_train)
X_scaled = scaler.transform(X_real)
```

### 2. 롤링(Rolling) 기준 업데이트

실시간 구간별로 중앙값과 IQR을 재계산하여 정규화.  
→ 시장 환경이 변할 때(레짐 전환) 더 안정적인 정규화 가능.

```python
def robust_rolling_scale(series, window=500):
    med = series.rolling(window).median()
    iqr = series.rolling(window).quantile(0.75) - series.rolling(window).quantile(0.25)
    return (series - med) / iqr
```

### 3. 주기적 재적합(Re-fitting)

일정 주기(예: 주간, 월간)마다 새 데이터로 `fit()` 재계산.
> - 단, 미래 데이터 누수 방지를 위해 반드시 **과거 데이터만 사용**
> - 실시간 환경에서는 **“fit 후 transform”** 대신 **“transform-only”** 로 유지

### 4. 피처별 대체 스케일 방식 혼합

가격 변동이 큰 피처(log-return 등)는 RobustScaler를 사용하되,  
지표(RSI, EMA 등)는 비율 또는 단순 스케일을 사용하여 안정화합니다.

| 피처 유형 | 권장 스케일 방식 |
|------------|------------------|
| 가격/수익률 | RobustScaler + 클리핑 |
| 모멘텀 지표(RSI 등) | [0,1] 정규화 |
| 추세/EMA | (Close-EMA)/EMA 비율 |
| 변동성 지표(ATR 등) | ATR/Close 비율 |

### 요약

- RobustScaler는 이상치에 강하지만, **새 분포로 확장 시 왜곡이 발생할 수 있음**
- **Winsorizing + Rolling 업데이트 + 부분 재적합** 조합이 가장 실전적인 접근
- 피처별 특성에 맞게 스케일 방식을 **혼합 적용**하면 안정성이 크게 향상됨
