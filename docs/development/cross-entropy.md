---
title: Cross Entropy
parent: 개발
nav_order: 27
description: "머신러닝에서 분류 문제의 손실 함수로 가장 널리 사용되는 크로스 엔트로피에 대해 알아본다."
---

# 크로스 엔트로피 (Cross Entropy)
{:.no_toc}

머신러닝에서 분류 문제의 손실 함수로 가장 널리 사용되는 크로스 엔트로피에 대해 알아본다.

### Link

- [머신러닝 크로스 엔트로피 - velog](https://velog.io/@rcchun/%EB%A8%B8%EC%8B%A0%EB%9F%AC%EB%8B%9D-%ED%81%AC%EB%A1%9C%EC%8A%A4-%EC%97%94%ED%8A%B8%EB%A1%9C%ED%94%BCcross-entropy)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 엔트로피 (Entropy)

엔트로피는 **불확실성의 척도**다. 어떤 사건이 발생할지 예측하기 어려울수록 엔트로피가 높다.

### 수식

확률 분포 $p$에 대한 엔트로피:

$$H(p) = -\sum_{i} p(x_i) \log p(x_i)$$

### 예시

| 사건 | 확률 | 엔트로피 |
|------|------|----------|
| 동전 던지기 | 1/2 | $-2 \times \frac{1}{2} \log \frac{1}{2} \approx 0.693$ |
| 주사위 던지기 | 1/6 | $-6 \times \frac{1}{6} \log \frac{1}{6} \approx 1.79$ |

주사위가 더 불확실하므로 엔트로피가 높다.

### Python 구현

```python
import numpy as np

def entropy(p):
    """확률 분포의 엔트로피 계산"""
    p = np.array(p)
    # 0인 확률은 제외 (0 * log(0) = 0으로 처리)
    p = p[p > 0]
    return -np.sum(p * np.log(p))

# 동전 던지기
coin = [0.5, 0.5]
print(f"동전 엔트로피: {entropy(coin):.4f}")  # 0.6931

# 주사위 던지기
dice = [1/6] * 6
print(f"주사위 엔트로피: {entropy(dice):.4f}")  # 1.7918

# 확실한 사건 (엔트로피 = 0)
certain = [1.0, 0.0]
print(f"확실한 사건 엔트로피: {entropy(certain):.4f}")  # 0.0000
```

---

## 크로스 엔트로피 (Cross Entropy)

크로스 엔트로피는 **두 확률 분포 간의 차이**를 측정한다. 실제 분포 $q$와 예측 분포 $p$가 얼마나 다른지를 나타낸다.

### 수식

$$H(q, p) = -\sum_{i} q(x_i) \log p(x_i)$$

- $q$: 실제 분포 (정답 레이블)
- $p$: 예측 분포 (모델 출력)

### 딥러닝에서의 의미

분류 문제에서:
- **실제 분포 $q$**: 원-핫 인코딩된 정답 (예: `[0, 1, 0]`)
- **예측 분포 $p$**: 소프트맥스 출력 (예: `[0.1, 0.7, 0.2]`)

크로스 엔트로피가 낮을수록 예측이 정답에 가깝다.

### Python 구현

```python
import numpy as np

def cross_entropy(q, p):
    """두 분포 간의 크로스 엔트로피 계산"""
    q = np.array(q)
    p = np.array(p)
    # 수치 안정성을 위해 작은 값 추가
    p = np.clip(p, 1e-15, 1 - 1e-15)
    return -np.sum(q * np.log(p))

# 정답: 클래스 1 (원-핫 인코딩)
y_true = [0, 1, 0]

# 좋은 예측
y_pred_good = [0.1, 0.8, 0.1]
print(f"좋은 예측 CE: {cross_entropy(y_true, y_pred_good):.4f}")  # 0.2231

# 나쁜 예측
y_pred_bad = [0.4, 0.3, 0.3]
print(f"나쁜 예측 CE: {cross_entropy(y_true, y_pred_bad):.4f}")  # 1.2040

# 완벽한 예측
y_pred_perfect = [0, 1, 0]
print(f"완벽한 예측 CE: {cross_entropy(y_true, y_pred_perfect):.4f}")  # 0.0000
```

---

## 이진 크로스 엔트로피 (Binary Cross Entropy)

이진 분류 문제에서 사용하는 크로스 엔트로피의 특수 형태다.

### 수식

$$BCE = -\frac{1}{N}\sum_{i=1}^{N} \left[ y_i \log(\hat{y}_i) + (1-y_i) \log(1-\hat{y}_i) \right]$$

- $y_i$: 실제 레이블 (0 또는 1)
- $\hat{y}_i$: 예측 확률 (0~1)

### Python 구현

```python
import numpy as np

def binary_cross_entropy(y_true, y_pred):
    """이진 크로스 엔트로피 계산"""
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    y_pred = np.clip(y_pred, 1e-15, 1 - 1e-15)

    bce = -(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))
    return np.mean(bce)

# 예시
y_true = [1, 0, 1, 1, 0]
y_pred = [0.9, 0.1, 0.8, 0.7, 0.2]

print(f"BCE: {binary_cross_entropy(y_true, y_pred):.4f}")  # 0.1974
```

---

## KL 발산 (Kullback-Leibler Divergence)

KL 발산은 두 확률 분포 간의 차이를 측정하는 또 다른 방법이다.

### 수식

$$D_{KL}(q \| p) = \sum_{i} q(x_i) \log \frac{q(x_i)}{p(x_i)}$$

### 크로스 엔트로피와의 관계

$$D_{KL}(q \| p) = H(q, p) - H(q)$$

즉, **KL 발산 = 크로스 엔트로피 - 엔트로피**

분류 문제에서 실제 분포 $q$가 원-핫 인코딩이면 $H(q) = 0$이므로:

$$D_{KL}(q \| p) = H(q, p)$$

따라서 크로스 엔트로피를 최소화하면 KL 발산도 최소화된다.

### Python 구현

```python
import numpy as np

def kl_divergence(q, p):
    """KL 발산 계산"""
    q = np.array(q)
    p = np.array(p)
    p = np.clip(p, 1e-15, 1 - 1e-15)
    q = np.clip(q, 1e-15, 1 - 1e-15)

    return np.sum(q * np.log(q / p))

# 두 분포 비교
q = [0.4, 0.6]  # 실제 분포
p = [0.5, 0.5]  # 예측 분포

print(f"H(q): {entropy(q):.4f}")
print(f"H(q,p): {cross_entropy(q, p):.4f}")
print(f"KL(q||p): {kl_divergence(q, p):.4f}")
print(f"H(q,p) - H(q): {cross_entropy(q, p) - entropy(q):.4f}")
```

---

## TensorFlow/Keras에서 사용

### 다중 클래스 분류

```python
import tensorflow as tf
from tensorflow.keras import layers, models

model = models.Sequential([
    layers.Dense(64, activation='relu', input_shape=(10,)),
    layers.Dense(3, activation='softmax')  # 3개 클래스
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',  # 원-핫 인코딩 레이블
    # loss='sparse_categorical_crossentropy',  # 정수 레이블
    metrics=['accuracy']
)
```

### 이진 분류

```python
model = models.Sequential([
    layers.Dense(64, activation='relu', input_shape=(10,)),
    layers.Dense(1, activation='sigmoid')  # 이진 출력
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)
```

---

## 요약

| 개념 | 용도 | 수식 |
|------|------|------|
| 엔트로피 | 불확실성 측정 | $H(p) = -\sum p \log p$ |
| 크로스 엔트로피 | 분포 간 차이 (손실 함수) | $H(q,p) = -\sum q \log p$ |
| KL 발산 | 분포 간 거리 | $D_{KL} = H(q,p) - H(q)$ |

크로스 엔트로피를 최소화하면:
- 예측 분포가 실제 분포에 가까워짐
- KL 발산이 줄어듦
- 모델 성능이 향상됨
