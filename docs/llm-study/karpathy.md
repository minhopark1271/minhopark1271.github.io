---
title: Karpathy의 LLM 학습 자료
parent: LLM 공부
nav_order: 1
---

# Karpathy의 LLM 학습 자료

Andrej Karpathy는 Tesla AI 디렉터 출신으로, OpenAI 창립 멤버이기도 합니다. 그가 만든 교육 자료들은 LLM과 딥러닝을 이해하는 데 최고의 리소스로 평가받습니다.

---

## Neural Networks: Zero to Hero

[https://karpathy.ai/zero-to-hero.html](https://karpathy.ai/zero-to-hero.html)

신경망 입문부터 GPT 구현까지 다루는 무료 강의 시리즈입니다. 파이썬 코드로 직접 구현하며 배우는 것이 특징입니다.

### 강의 구성

| 순서 | 주제 | 내용 |
|------|------|------|
| 1 | micrograd | 역전파와 미분의 원리 |
| 2-3 | makemore | 문자 단위 언어 모델, MLP |
| 4-5 | 심화 | 배치 정규화, WaveNet |
| 6-7 | 현대 모델 | GPT 구현, Tokenizer |

**선수 지식**: 파이썬 프로그래밍, 고등학교 수준 미적분

---

## minGPT

[https://github.com/karpathy/minGPT](https://github.com/karpathy/minGPT)

약 300줄의 PyTorch 코드로 GPT를 구현한 교육용 프로젝트입니다. 복잡한 다른 구현들과 달리 "small, clean, interpretable and educational"을 목표로 합니다.

### 핵심 파일

- `model.py` - Transformer 모델 정의
- `bpe.py` - Byte Pair Encoder (토크나이저)
- `trainer.py` - PyTorch 학습 코드

{: .note }
현재는 반-보관(semi-archived) 상태이며, 더 기능적인 [nanoGPT](https://github.com/karpathy/nanoGPT)로 개발이 이어지고 있습니다.

---

## LLM Visualization

[https://bbycroft.net/llm](https://bbycroft.net/llm)

LLM의 내부 동작을 **3D 애니메이션**으로 시각화한 인터랙티브 웹사이트입니다. 텍스트만으로 이해하기 어려운 Transformer 구조와 Attention 메커니즘을 직관적으로 파악할 수 있습니다.

### 특징

- 토큰이 모델을 통과하는 과정을 단계별로 시각화
- 각 레이어와 연산을 인터랙티브하게 탐색 가능
- Attention 패턴을 3D로 확인

{: .highlight }
위 자료들을 순서대로 학습하면 LLM의 원리를 기초부터 탄탄하게 이해할 수 있습니다. Zero to Hero 강의로 이론을 배우고, minGPT로 코드를 분석하며, LLM Visualization으로 직관적 이해를 보완하는 것을 추천합니다.
