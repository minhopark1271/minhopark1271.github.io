---
title: LLM Architecture
parent: 개발
nav_order: 31
description: LLM(Large Language Model) 아키텍처의 핵심 구조와 개념
---

# LLM Architecture
{:.no_toc}

LLM 아키텍처를 이해하기 위한 핵심 키워드

---

## Visualization

- [LLM Visualization by Brendan Bycroft](https://bbycroft.net/llm)

---

## 핵심 개념 및 구조

### Input/Output
- Token
- Tokenizer (BPE, WordPiece)
- Vocabulary
- Special tokens (BOS, EOS, PAD)

### Embedding
- Token Embedding
- Positional Encoding (Sinusoidal, RoPE, ALiBi)
- Embedding Dimension

### Transformer Block
- Layer Normalization (Pre-LN, Post-LN)
- Residual Connection (Skip Connection)

### Attention
- Self-Attention
- Multi-Head Attention
- Query (Q), Key (K), Value (V)
- Attention Score / Attention Weight
- Softmax
- Scaled Dot-Product Attention
- Causal Mask (Autoregressive Mask)
- KV Cache

### Feed-Forward Network (MLP)
- Hidden Layer
- Activation Function (GELU, SwiGLU)
- Up Projection / Down Projection

### Output
- LM Head (Language Model Head)
- Logits
- Softmax → Probability Distribution
- Sampling (Temperature, Top-k, Top-p)

### Training
- Cross-Entropy Loss
- Next Token Prediction
- Gradient Descent
- Backpropagation
