---
title: Attention Layer
parent: 개발
nav_order: 28
---

# Attention Layer
{:.no_toc}

딥러닝에서 Attention 메커니즘은 모델이 입력의 어떤 부분에 "주의를 기울일지" 동적으로 결정하는 방법이다. 특히 시계열, 자연어 처리에서 핵심적인 역할을 한다.

### Link

- [Attention Is All You Need (Vaswani et al., 2017)](https://arxiv.org/abs/1706.03762)
- [Neural Machine Translation by Jointly Learning to Align and Translate (Bahdanau et al., 2014)](https://arxiv.org/abs/1409.0473)
- [TensorFlow MultiHeadAttention](https://www.tensorflow.org/api_docs/python/tf/keras/layers/MultiHeadAttention)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 개요

### Attention이란?

Attention은 입력 시퀀스의 모든 위치를 참조하되, **각 위치의 중요도를 동적으로 계산**하여 가중 평균을 구하는 메커니즘이다.

```
입력 시퀀스: [x₁, x₂, x₃, ..., xₙ]
              ↓
         Attention 가중치 계산
              ↓
가중치:      [α₁, α₂, α₃, ..., αₙ]  (합 = 1)
              ↓
출력:        Σ(αᵢ × xᵢ)  ← 가중 평균
```

### 왜 필요한가?

| 문제 | 기존 방식 | Attention 해결 |
|------|----------|----------------|
| 긴 시퀀스 | 정보가 압축되며 손실 | 어떤 위치든 직접 참조 가능 |
| 고정된 표현 | 입력과 무관한 동일한 처리 | 입력에 따라 다른 부분에 집중 |
| 해석 가능성 | 블랙박스 | 가중치 시각화로 모델 해석 가능 |

---

## 직관적 이해

### 비유: 논문 읽기

**Attention 없이 (고정 규칙)**
```
논문을 처음부터 끝까지 읽으면서
"항상 같은 형광펜 규칙"으로 밑줄 긋기

- 숫자가 나오면 노란색
- 결론 문장이면 빨간색
- ... (학습된 고정 패턴)

→ 입력이 뭐든 같은 규칙 적용
```

**Attention 있을 때 (동적 참조)**
```
논문을 읽으면서
"지금 이해하려는 내용"에 따라 다른 부분 참조

- 결과 해석 중 → 방법론 섹션 다시 참조
- 수치 비교 중 → 관련 테이블 참조
- 결론 작성 중 → 서론의 연구 질문 참조

→ Query(현재 맥락)에 따라 참조 위치가 달라짐
```

### 핵심 차이

| 구분 | Without Attention | With Attention |
|------|-------------------|----------------|
| 정보 처리 | 모든 시점 순차 처리 | 모든 시점 순차 처리 |
| 참조 방식 | **고정된 가중치** | **입력 의존적 가중치** |
| 비유 | 고정 규칙으로 형광펜 | 맥락에 따라 다른 페이지 참조 |

---

## Attention의 종류

### 1. Bahdanau Attention (Additive Attention)

2014년 제안된 최초의 효과적인 Attention 메커니즘.

**구성 요소:**
- **Query (Q)**: 현재 상태 (무엇을 찾을지)
- **Keys (K)**: 각 위치의 식별자
- **Values (V)**: 각 위치의 실제 정보

**수식:**
```
score(Q, Kᵢ) = V · tanh(W₁·Q + W₂·Kᵢ)
αᵢ = softmax(scoreᵢ)
context = Σ(αᵢ × Vᵢ)
```

### 2. Scaled Dot-Product Attention

Transformer에서 사용하는 방식. 더 빠르고 효율적.

**수식:**
```
Attention(Q, K, V) = softmax(Q·Kᵀ / √dₖ) · V
```

- `Q·Kᵀ`: Query와 Key의 내적 (유사도)
- `√dₖ`: 스케일링 (값이 커지는 것 방지)

### 3. Multi-Head Attention

여러 개의 Attention을 병렬로 수행하여 다양한 관점 학습.

```
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│Head 1│ │Head 2│ │Head 3│ │Head 4│
└──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘
   └────────┴────────┴────────┘
                │
                ▼
          Concatenate
                │
                ▼
        Linear Projection
```

---

## 수학적 설명

### Bahdanau Attention 상세

**Step 1: Score 계산**
```
# Query: 마지막 hidden state (batch, hidden_dim)
# Keys/Values: 모든 hidden states (batch, seq_len, hidden_dim)

score = V·tanh(W₁·query + W₂·keys)
# score shape: (batch, seq_len, 1)
```

**Step 2: Softmax로 확률 분포 변환**
```
attention_weights = softmax(score, axis=1)
# 모든 가중치 합 = 1
# 확률 분포처럼 해석 가능
```

**Step 3: 가중 합**
```
context = Σ(attention_weights × values)
# context shape: (batch, hidden_dim)
```

### 기하학적 해석

**Hidden State = 고차원 공간의 점**

```
64차원 공간에서:

     Query(h₉₆)
        ↗
       /  θ₁ (작음) → 높은 attention
      /
     ● h₅₀  ← Query와 비슷한 방향

        ↗
       /
      /   θ₂ (큼) → 낮은 attention
     ● h₁₀  ← Query와 다른 방향
```

- **Score**: Query와 각 Key의 유사도 (방향이 비슷할수록 높음)
- **Softmax**: 유사도를 확률 분포로 변환
- **Context**: 가중 평균점 (Query와 관련된 정보들의 조합)

---

## Multi-Head Attention 헤드 수 가이드라인

### 경험적 가이드라인

| 출처 | 설정 | 비율 |
|------|------|------|
| Transformer 원논문 | d=512, 8 heads | 64-dim/head |
| BERT | d=768, 12 heads | 64-dim/head |
| GPT-2 | d=768, 12 heads | 64-dim/head |
| **일반적 권장** | - | **≥16-dim/head** |

### 헤드 수 증가 시 고려사항

| Heads | key_dim (총 128 고정) | 판단 |
|-------|----------------------|------|
| 4 | 32-dim/head | ✓ 적절 |
| 8 | 16-dim/head | ⚠️ 경계선 |
| 16 | 8-dim/head | ❌ 너무 작음 |

**주의**: 각 헤드가 서로 다른 특성을 학습하도록 **강제되지 않음**. 실제로는 헤드 간 중복(redundancy)이 발생할 수 있다.

---

## LSTM + Attention 구현 예시

### 모델 아키텍처 비교

**1. Standard LSTM (Attention 없음)** - 37,826 params
```
┌─────────────────────────────────────────────────────────────────┐
│                         Input                                   │
│                   (batch, 96, 50)                               │
│               96 timesteps × 50 features                        │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LSTM (64 units)                              │
│                 return_sequences=False                          │
│                   Output: (batch, 64)                           │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Dropout (0.3)                                │
│                   Output: (batch, 64)                           │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Dense (64, ReLU)                             │
│                   Output: (batch, 64)                           │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Dense (1, Sigmoid)                           │
│                   Output: (batch, 1)                            │
└─────────────────────────────────────────────────────────────────┘
```

**2. LSTM + Bahdanau Attention** - 46,082 params (+22%)
```
┌─────────────────────────────────────────────────────────────────┐
│                         Input                                   │
│                   (batch, 96, 50)                               │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LSTM (64 units)                              │
│                 return_sequences=True                           │
│                 Output: (batch, 96, 64)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────────┐
│   Last Hidden State     │     │      All Hidden States          │
│   Query: (batch, 64)    │     │      Values: (batch, 96, 64)    │
└─────────────────────────┘     └─────────────────────────────────┘
              └───────────────┬───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                BahdanauAttention (64 units)                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  W1: (64, 64), W2: (64, 64), V: (64, 1) = 8,256 params     │ │
│  │  score = V·tanh(W1·query + W2·values)                      │ │
│  │  attention_weights: (batch, 96, 1)                         │ │
│  │  context = Σ(weights × values): (batch, 64)                │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Dropout (0.3)                                │
│                   Output: (batch, 64)                           │
└─────────────────────────────────────────────────────────────────┘
                              ▼
                    [이하 Standard와 동일]
```

**3. LSTM + Multi-Head Attention** - 71,042 params (+88%)
```
┌─────────────────────────────────────────────────────────────────┐
│                         Input                                   │
│                   (batch, 96, 50)                               │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LSTM (64 units)                              │
│                 return_sequences=True                           │
│                 Output: (batch, 96, 64)                         │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│           MultiHeadAttention (4 heads, key_dim=32)              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Query = Key = Value = LSTM output (Self-Attention)        │ │
│  │                                                            │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                       │ │
│  │  │Head 1│ │Head 2│ │Head 3│ │Head 4│                       │ │
│  │  │32-dim│ │32-dim│ │32-dim│ │32-dim│                       │ │
│  │  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘                       │ │
│  │     └────────┴────────┴────────┘                           │ │
│  │                  │                                         │ │
│  │                  ▼                                         │ │
│  │         Concat → (batch, 96, 128)                          │ │
│  │                  │                                         │ │
│  │                  ▼                                         │ │
│  │     Linear Projection → (batch, 96, 64)                    │ │
│  │                                                            │ │
│  │     Parameters: 33,216                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               GlobalAveragePooling1D                            │
│            (batch, 96, 64) → (batch, 64)                        │
│            시간축 평균으로 고정 길이 벡터 생성                          │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Dropout (0.3)                                │
│                   Output: (batch, 64)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    [이하 Standard와 동일]
```

### 코드 구현: Bahdanau Attention

```python
import tensorflow as tf
from tensorflow.keras.layers import Layer, Dense, LSTM, Input, Dropout

class BahdanauAttention(Layer):
    """
    Bahdanau Attention (Additive Attention)

    Reference: Bahdanau et al., 2014
    "Neural Machine Translation by Jointly Learning to Align and Translate"
    """

    def __init__(self, units: int = 64, **kwargs):
        super().__init__(**kwargs)
        self.units = units
        self.W1 = Dense(units, use_bias=False, name='attention_W1')
        self.W2 = Dense(units, use_bias=False, name='attention_W2')
        self.V = Dense(1, use_bias=False, name='attention_V')

    def call(self, query, values):
        """
        Args:
            query: (batch, hidden_dim) - 마지막 hidden state
            values: (batch, seq_len, hidden_dim) - 모든 hidden states

        Returns:
            context: (batch, hidden_dim) - 가중 평균된 벡터
            attention_weights: (batch, seq_len, 1) - 시각화용
        """
        # Expand query for broadcasting
        query_with_time = tf.expand_dims(query, 1)  # (batch, 1, hidden)

        # Additive attention score
        score = self.V(tf.nn.tanh(
            self.W1(query_with_time) + self.W2(values)
        ))

        # Softmax over sequence
        attention_weights = tf.nn.softmax(score, axis=1)

        # Weighted sum
        context = tf.reduce_sum(attention_weights * values, axis=1)

        return context, attention_weights


def create_lstm_attention_model(seq_len, features, lstm_units=64, attention_units=64):
    """LSTM + Bahdanau Attention 모델 생성"""

    inputs = Input(shape=(seq_len, features))

    # LSTM with return_sequences=True
    lstm_out = LSTM(lstm_units, return_sequences=True)(inputs)

    # Get last hidden state as query
    last_hidden = lstm_out[:, -1, :]

    # Apply attention
    attention = BahdanauAttention(units=attention_units)
    context, weights = attention(last_hidden, lstm_out)

    # Output layers
    x = Dropout(0.3)(context)
    x = Dense(32, activation='relu')(x)
    outputs = Dense(1, activation='sigmoid')(x)

    return tf.keras.Model(inputs, outputs)


# 사용 예시
model = create_lstm_attention_model(seq_len=96, features=50)
model.summary()
```

### 코드 구현: Multi-Head Attention

```python
from tensorflow.keras.layers import MultiHeadAttention, GlobalAveragePooling1D

def create_lstm_multihead_model(seq_len, features, lstm_units=64,
                                 num_heads=4, key_dim=32):
    """LSTM + Multi-Head Self-Attention 모델 생성"""

    inputs = Input(shape=(seq_len, features))

    # LSTM with return_sequences=True
    lstm_out = LSTM(lstm_units, return_sequences=True)(inputs)
    # lstm_out shape: (batch, 96, 64)

    # Multi-Head Self-Attention
    attention_output = MultiHeadAttention(
        num_heads=num_heads,
        key_dim=key_dim,
        name='multihead_attention'
    )(lstm_out, lstm_out)  # Self-attention: Q=K=V
    # attention_output shape: (batch, 96, 64)

    # Global Average Pooling to get fixed-size vector
    pooled = GlobalAveragePooling1D()(attention_output)
    # pooled shape: (batch, 64)

    # Output layers
    x = Dropout(0.3)(pooled)
    x = Dense(32, activation='relu')(x)
    outputs = Dense(1, activation='sigmoid')(x)

    return tf.keras.Model(inputs, outputs)


# 사용 예시
model = create_lstm_multihead_model(
    seq_len=96,
    features=50,
    num_heads=4,
    key_dim=32
)
model.summary()
```

### 모델 파라미터 비교

| 모델 | 파라미터 수 | 특징 |
|------|------------|------|
| Standard LSTM | 37,826 | 빠른 학습, 간단 |
| + Bahdanau Attention | 46,082 (+22%) | 해석 가능, 동적 참조 |
| + Multi-Head Attention | 71,042 (+88%) | 다양한 패턴 학습 |

---

## Attention Weights 시각화

```python
import matplotlib.pyplot as plt
import numpy as np

def visualize_attention(attention_weights, timestamps=None):
    """Attention 가중치 시각화"""
    weights = attention_weights.numpy().squeeze()  # (seq_len,)

    plt.figure(figsize=(12, 3))
    plt.bar(range(len(weights)), weights, alpha=0.7)
    plt.xlabel('Time Step')
    plt.ylabel('Attention Weight')
    plt.title('Attention Distribution over Time')

    # 상위 5개 시점 표시
    top_indices = np.argsort(weights)[-5:]
    for idx in top_indices:
        plt.annotate(f't-{len(weights)-idx}',
                    (idx, weights[idx]),
                    textcoords="offset points",
                    xytext=(0,5), ha='center')

    plt.tight_layout()
    plt.show()
```

**시각화 예시:**
```
시간축 →   t-96  t-72  t-48  t-24  t-12  t-6   t-3   t-1
           ─────────────────────────────────────────────
가중치     0.01  0.02  0.03  0.05  0.08  0.15  0.25  0.30
           ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████████████
                                          ▲
                              급등/급락 직전 패턴에 집중
```

---

## 요약

| 항목 | 내용 |
|------|------|
| **역할** | 입력 시퀀스의 동적 가중 조합 |
| **핵심 차이** | 고정 참조 → 입력 의존적 참조 |
| **수학적** | Score → Softmax → 가중합 |
| **기하학적** | Query와 유사한 방향에 높은 가중치 |
| **장점** | 긴 시퀀스 처리, 해석 가능성 |

### 언제 사용하나?

- **시계열 예측**: 특정 과거 시점이 중요할 때
- **자연어 처리**: 문장 내 단어 간 관계 학습
- **이미지**: 특정 영역에 집중 (Visual Attention)

### 주의사항

- Multi-Head에서 헤드 간 중복 발생 가능
- 헤드 수 증가 시 LSTM 차원도 함께 확장 권장
- Attention weights 시각화로 모델 동작 검증 필요
