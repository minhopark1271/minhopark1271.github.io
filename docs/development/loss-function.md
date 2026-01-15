---
title: 비용함수
parent: 개발
nav_order: 33
description: 딥러닝 비용함수(Loss Function) 종류와 특징, 용도별 선택 가이드를 정리합니다.
---

# 비용함수 (Loss Function)
{:.no_toc}

딥러닝 모델 학습에 사용되는 비용함수 종류와 특징.

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 회귀 (Regression)

| 함수 | 수식 | 특징 |
|------|------|------|
| **MSE** (Mean Squared Error) | Σ(y-ŷ)²/n | 가장 기본, 이상치에 민감 |
| **MAE** (Mean Absolute Error) | Σ\|y-ŷ\|/n | 이상치에 강건 |
| **RMSE** | √MSE | MSE의 스케일 보정 |
| **Huber Loss** | MSE (작은 오차), MAE (큰 오차) | MSE+MAE 장점 결합 |
| **Log-Cosh** | Σlog(cosh(y-ŷ)) | Huber와 유사, 미분 가능 |

---

## 분류 (Classification)

| 함수 | 용도 | 특징 |
|------|------|------|
| **Binary Cross-Entropy** | 이진 분류 | Sigmoid 출력과 함께 사용 |
| **Categorical Cross-Entropy** | 다중 분류 (one-hot) | Softmax 출력과 함께 사용 |
| **Sparse Categorical CE** | 다중 분류 (정수 라벨) | 메모리 효율적 |
| **Focal Loss** | 클래스 불균형 | 쉬운 샘플 가중치 낮춤 |
| **Hinge Loss** | SVM, 마진 기반 | max(0, 1-y·ŷ) |

---

## 확률 분포

| 함수 | 용도 | 특징 |
|------|------|------|
| **KL Divergence** | 분포 간 차이 | VAE 등에서 사용 |
| **NLL** (Negative Log-Likelihood) | 확률 모델 | Cross-Entropy와 동치 |

---

## 특수 목적

| 함수 | 용도 |
|------|------|
| **Contrastive Loss** | Siamese Network, 유사도 학습 |
| **Triplet Loss** | 얼굴 인식, 임베딩 학습 |
| **CTC Loss** | 음성 인식, OCR (시퀀스 정렬) |
| **DICE Loss** | 이미지 세그멘테이션 |
| **IoU Loss** | 객체 탐지 (바운딩 박스) |

---

## 용도별 선택

| 태스크 | 권장 손실함수 |
|--------|--------------|
| 회귀 | MSE (일반), MAE (이상치 있을 때) |
| 이진 분류 | Binary Cross-Entropy |
| 다중 분류 | Categorical Cross-Entropy |
| 클래스 불균형 | Focal Loss |
| 임베딩 학습 | Triplet Loss, Contrastive Loss |
