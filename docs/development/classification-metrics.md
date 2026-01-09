---
title: 분류모델 평가지표
parent: 개발
nav_order: 26
description: "머신러닝 분류 모델 평가지표 완벽 정리. 혼동행렬, 정밀도, 재현율, F1 스코어, ROC-AUC, PR-AUC 개념과 Python 구현 예제."
---

# 분류모델 평가지표
{:.no_toc}

분류 모델의 성능을 평가하는 핵심 지표들: 혼동행렬, 정밀도, 재현율, F1 스코어, ROC-AUC, PR-AUC

### Link

- [원문 - 분류모델 평가지표](https://data-minggeul.tistory.com/10)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 혼동행렬 (Confusion Matrix)

분류 평가의 기초가 되는 4가지 요소로 구성된 행렬.

|  | **실제 Negative (0)** | **실제 Positive (1)** |
|---|---|---|
| **예측 Negative (0)** | TN (True Negative) | FN (False Negative) |
| **예측 Positive (1)** | FP (False Positive) | TP (True Positive) |

**핵심**: FP/FN은 **예측값**을 기준으로 Positive/Negative가 결정된다.

- **TP (True Positive)**: 양성을 양성으로 올바르게 예측
- **TN (True Negative)**: 음성을 음성으로 올바르게 예측
- **FP (False Positive)**: 음성을 양성으로 잘못 예측 (1종 오류)
- **FN (False Negative)**: 양성을 음성으로 잘못 예측 (2종 오류)

---

## 주요 평가지표

### 정확도 (Accuracy)

전체 샘플 중 올바르게 예측한 비율.

```
Accuracy = (TP + TN) / (TP + TN + FP + FN)
```

**한계**: 클래스 불균형 시 신뢰도 낮음 (예: 99% 음성 데이터에서 모두 음성 예측 → 99% 정확도)

### 재현율 (Recall, TPR, Sensitivity)

**실제 양성** 샘플 중 올바르게 예측한 비율.

```
Recall = TP / (TP + FN)
```

**활용**: 거짓 음성(FN)의 리스크가 큰 분야
- 사기 탐지: 사기를 정상으로 분류하면 손실 발생
- 질병 진단: 환자를 정상으로 분류하면 치료 기회 상실
- 부도 예측: 부도를 정상으로 분류하면 대출 손실

### 정밀도 (Precision)

**양성으로 예측한** 샘플 중 실제 양성의 비율.

```
Precision = TP / (TP + FP)
```

**활용**: 거짓 양성(FP)의 리스크가 큰 분야
- 스팸 필터: 정상 메일을 스팸으로 분류하면 중요 메일 손실
- 추천 시스템: 관련 없는 상품 추천 시 사용자 이탈

### 거짓양성율 (FPR, Fall-out)

**실제 음성** 샘플 중 잘못 예측한 비율.

```
FPR = FP / (FP + TN)
```

### F1 스코어

정밀도와 재현율의 조화평균. 둘 사이의 균형을 평가.

```
F1 = 2 × (Precision × Recall) / (Precision + Recall)
```

**특징**: 정밀도와 재현율 중 하나가 낮으면 F1도 낮아짐

---

## ROC 곡선과 AUC

### ROC 곡선 (Receiver Operating Characteristic)

임계값(threshold)을 변화시키며 **FPR(X축)**과 **TPR(Y축)**의 관계를 나타낸 곡선.

**곡선 해석**:
- (0,0): 모든 샘플을 음성으로 예측
- (1,1): 모든 샘플을 양성으로 예측
- 왼쪽 위로 볼록할수록 좋은 모델 (FPR 낮고 TPR 높음)

**임계값 변화에 따른 특성**:
- 임계값 ↓: FPR↑, TPR↑ (더 많이 양성으로 예측)
- 임계값 ↑: FPR↓, TPR↓ (더 적게 양성으로 예측)

### ROC-AUC

ROC 곡선 아래 면적(Area Under Curve).

- **AUC = 1.0**: 완벽한 분류기
- **AUC = 0.5**: 랜덤 예측 (대각선)
- **AUC < 0.5**: 랜덤보다 나쁨

---

## PR 곡선과 AUC

### PR 곡선 (Precision-Recall)

임계값을 변화시키며 **Recall(X축)**과 **Precision(Y축)**의 관계를 나타낸 곡선.

**곡선 해석**:
- 오른쪽 위로 볼록할수록 좋은 모델 (Recall, Precision 모두 높음)
- ROC 곡선과 달리 매끄럽지 않은 형태

**임계값 변화에 따른 특성**:
- 임계값 → 0: 높은 재현율, 낮은 정밀도
- 임계값 → 1: 낮은 재현율, 높은 정밀도

### PR-AUC

PR 곡선 아래 면적. 클래스 불균형 데이터에서 더 유용.

---

## ROC-AUC vs PR-AUC

| 항목 | ROC-AUC | PR-AUC |
|------|---------|--------|
| **X축** | FPR | Recall |
| **Y축** | TPR (Recall) | Precision |
| **좋은 모델** | 왼쪽 위로 볼록 | 오른쪽 위로 볼록 |
| **랜덤 예측** | 0.5 (대각선) | 양성 비율에 비례 |
| **클래스 불균형** | 영향 적음 | 민감하게 반영 |

### 선택 기준

**ROC-AUC 사용**:
- 클래스 균형이 비교적 맞는 경우
- TN도 중요한 경우

**PR-AUC 사용**:
- 클래스 불균형이 심한 경우 (예: 사기 탐지 1%, 정상 99%)
- 양성 클래스 예측이 더 중요한 경우

---

## 실무 관점

일반적으로 "AUC"라고 하면 ROC-AUC를 의미하지만, **실제 업무에서는 Precision과 Recall을 고려하면서 모형을 개발하는 경우가 더 많다**.

### 임계값 튜닝

분류 모델은 확률값을 출력하고, 임계값을 기준으로 클래스를 결정:

```python
# 기본 임계값 0.5
prediction = 1 if probability >= 0.5 else 0

# 재현율 중시: 임계값 낮춤
prediction = 1 if probability >= 0.3 else 0

# 정밀도 중시: 임계값 높임
prediction = 1 if probability >= 0.7 else 0
```

### 평가지표 선택 가이드

| 상황 | 추천 지표 |
|------|----------|
| 클래스 균형, 전반적 성능 | Accuracy, ROC-AUC |
| 클래스 불균형 | PR-AUC, F1 Score |
| FN 비용 높음 (놓치면 안됨) | Recall |
| FP 비용 높음 (잘못 분류하면 안됨) | Precision |
| 균형 잡힌 평가 | F1 Score |
