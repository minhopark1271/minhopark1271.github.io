---
title: 활성함수
parent: 개발
nav_order: 32
description: 딥러닝 활성함수(Activation Function) 종류와 특징, 용도별 선택 가이드를 정리합니다.
---

# 활성함수 (Activation Function)
{:.no_toc}

딥러닝에서 비선형성을 추가하는 활성함수 종류와 특징.

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 기본 함수

| 함수 | 수식 | 범위 | 특징 |
|------|------|------|------|
| **Sigmoid** | 1/(1+e⁻ˣ) | (0, 1) | 이진 분류 출력층, vanishing gradient 문제 |
| **Tanh** | (eˣ-e⁻ˣ)/(eˣ+e⁻ˣ) | (-1, 1) | 0 중심, sigmoid보다 수렴 빠름 |
| **Softmax** | eˣⁱ/Σeˣʲ | (0, 1) | 다중 분류 출력층, 확률 분포 |

---

## ReLU 계열

| 함수 | 수식 | 특징 |
|------|------|------|
| **ReLU** | max(0, x) | 가장 널리 사용, dying ReLU 문제 |
| **Leaky ReLU** | max(αx, x), α=0.01 | 음수 영역 기울기 유지 |
| **PReLU** | max(αx, x), α 학습 | Leaky ReLU의 α를 학습 |
| **ELU** | x (x>0), α(eˣ-1) (x≤0) | 음수 영역 부드러운 곡선 |

---

## 최신/고급 함수

| 함수 | 특징 |
|------|------|
| **GELU** | GPT, BERT 등 Transformer에서 사용 |
| **SiLU/Swish** | x·σ(x), 자가 게이팅 |
| **SwiGLU** | LLaMA 등 최신 LLM에서 사용 |
| **Mish** | x·tanh(softplus(x)) |
| **SELU** | Self-normalizing, 특정 조건에서 자동 정규화 |

---

## 용도별 선택

| 용도 | 권장 활성함수 |
|------|--------------|
| 은닉층 | ReLU, GELU, SwiGLU |
| 이진 분류 출력 | Sigmoid |
| 다중 분류 출력 | Softmax |
| 회귀 출력 | Linear (활성함수 없음) |
