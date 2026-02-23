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

---

## microgpt

- [블로그 포스트](https://karpathy.github.io/2026/02/12/microgpt/)
- [소스 코드 (Gist)](https://gist.github.com/karpathy/8627fe009c40f57531cb18360106ce95)
- [GeekNews 요약](https://news.hada.io/topic?id=26746)

**외부 의존성 없이 순수 파이썬 약 200줄로 GPT 전체 학습·추론을 구현한 프로젝트**입니다. micrograd, makemore, nanoGPT로 이어진 Karpathy의 "LLM 증류" 시리즈의 최종판으로, 프로덕션 LLM과의 차이는 규모와 효율성뿐이며 핵심 알고리듬은 동일합니다.

### 구성 요소

| 컴포넌트 | 설명 |
|---------|------|
| Dataset | 32,000개 이름 데이터 (makemore 동일) |
| Tokenizer | 문자 단위 인코딩 (27 토큰: 26 알파벳 + BOS) |
| Autograd | `Value` 클래스 기반 스칼라 역전파 엔진 |
| Architecture | GPT-2 축소판 (RMSNorm, Multi-head Attention, MLP, 잔차 연결) |
| Optimizer | Adam (모멘텀 + 적응적 학습률 + bias correction) |
| Training | 1,000 스텝, 손실 3.3 → 2.37 (약 1분 소요) |

### 학습 과정

```
토큰 입력 → 임베딩(토큰+위치) → Multi-head Attention → MLP → Softmax
                                    ↓
                        Cross-entropy 손실 → 역전파 → Adam 업데이트
```

학습 후 "kamon", "karai", "vialan" 등 그럴듯한 이름을 생성합니다.

### 단계별 학습 코드

Karpathy는 `train0.py` ~ `train5.py`까지 점진적으로 복잡도를 높이는 학습 경로를 제공합니다.

| 단계 | 내용 |
|------|------|
| train0 | 바이그램 카운팅 |
| train1 | 수동 그래디언트 계산 |
| train2 | Autograd 도입 |
| train3 | Attention 메커니즘 추가 |
| train4 | 전체 Transformer 아키텍처 |
| train5 | Adam 옵티마이저 적용 (최종) |

### ChatGPT와의 관계

microgpt와 ChatGPT는 근본적으로 **동일한 다음 토큰 예측 루프**를 사용합니다. 차이점은:

- **규모**: 4,192 파라미터 vs 수십억 파라미터, 32K 이름 vs 수조 토큰
- **인프라**: 단일 CPU vs 수천 GPU/TPU 분산 학습
- **후처리**: 없음 vs SFT + RLHF로 대화형 튜닝

{: .note }
"마법은 없다(There is no magic)" — 언어 모델은 학습 데이터의 통계적 패턴에 맞게 수치 파라미터를 조정하는 것이며, "환각(hallucination)"은 모델이 확률 분포에서 통계적으로 그럴듯한 시퀀스를 생성하기 때문에 발생합니다.
