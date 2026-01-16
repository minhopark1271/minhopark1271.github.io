---
title: Genspark
parent: 개발
nav_order: 34
description: "Genspark AI 완벽 가이드. Super Agent, Sparkpage, AI Slides 등 문서 생성 기능. 전 Baidu 임원들이 만든 차세대 AI 검색 및 자동화 플랫폼."
---

# Genspark
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## Links

- [Genspark 공식 사이트](https://www.genspark.ai/)
- [Genspark 소개 영상 (YouTube)](https://www.youtube.com/watch?v=p2jP5-r07CI)
- [Genspark AI Review 2025](https://skywork.ai/blog/genspark-ai-review-2025-super-agent-ai-search/)

---

## 개요

Genspark는 2023년 설립된 AI 기반 검색 및 자동화 플랫폼이다. 기존 검색 엔진의 한계(링크 목록 제공, 여러 사이트 방문 필요, SEO 최적화 콘텐츠 우선)를 극복하기 위해 만들어졌다.

핵심 철학은 **"Agentic Engine"** - AI 에이전트가 자율적으로 정보를 수집, 종합, 제시하는 것이다.

---

## 역사

### 창립 (2023)

- **Eric Jing (CEO)**: 전 Microsoft Bing 창립 멤버, Baidu Xiaodu CEO. "Xiaoice의 아버지"로 불리며 4천만 대 이상의 AI 음성 디바이스 출시 경험
- **Kay Zhu (CTO)**: Google에서 최초의 딥 뉴럴 랭킹 모델을 프로덕션 검색에 적용. 전 Baidu Xiaodu Technology CTO

회사 법인명은 **MainFunc Inc.**, 본사는 캘리포니아 Palo Alto에 위치한다.

### 주요 마일스톤

| 시기 | 이벤트 |
|------|--------|
| 2023 | 회사 설립 |
| 2024.06 | 서비스 런칭 (Perplexity-Wikipedia 하이브리드 형태) |
| 2024.06 | Seed 라운드 $60M (Lanchi Ventures 주도) |
| 2025.02 | Series A $100M (기업가치 $530M) |
| 2025.04 | Super Agent 출시 - 검색에서 실행으로 전환 |
| 2025 | Series B $275M (기업가치 $1.25B), ARR $50M 돌파 |

---

## 핵심 기능

### 1. Sparkpage

Genspark의 핵심 기능으로, AI 에이전트가 동적으로 생성하는 웹페이지다.

**특징:**
- 여러 소스의 정보를 하나의 응집된 페이지로 통합
- 상업적 영향이나 비즈니스 편향 없는 중립적 정보 제공
- AI Copilot 통합으로 실시간 질문 응답 가능
- 공유 및 협업 편집 지원

기존에는 단순히 Sparkpage를 생성하는 것이 주 기능이었으나, 2025년 4월 이후로는 작업 실행의 "개요"로서 역할이 확장되었다.

### 2. Super Agent

2025년 4월 출시된 완전 자율형 노코드 어시스턴트다.

**주요 기능:**
- **Call For Me**: AI가 실제 전화를 걸어 대화 (OpenAI Realtime API 활용)
- **AI Slides**: PDF, Word, Excel 업로드 시 10분 내 전문 슬라이드 생성
- **AI Docs**: 구조화된 문서 자동 생성
- **AI Sheets**: 스프레드시트 생성
- **AI Video**: 영상 콘텐츠 생성
- **AI Designer**: 디자인 작업

### 3. Mixture-of-Agents 아키텍처

**구성:**
- 30개 이상의 파운데이션 모델 (GPT-4.1, OpenAI o3-mini-high, DeepSeek R1, Claude, Gemini 등)
- 80~150개의 전문 도구
- 20개 이상의 프리미엄 데이터셋

**검증 프로세스:**
1. 추론 모델(o3-mini-high, DeepSeek R1)이 수백 개 소스에서 정보 분석
2. GPT, Claude, Gemini 등 다른 모델이 결과 검증
3. 여러 라운드 반복하여 정보 교차 확인

### 4. Deep Research

복잡한 연구 작업을 위한 기능으로, 여러 AI 모델 팀이 협력하여 정보를 분석하고 검증한다.

---

## 사용 예시

### 리서치 작업

```
프롬프트: "2025년 AI 반도체 시장 동향 분석"

결과:
- 주요 소스들을 종합한 Sparkpage 생성
- 시장 규모, 주요 플레이어, 트렌드 정리
- AI Copilot으로 후속 질문 가능
```

### 문서 생성

```
프롬프트: "분기 실적 보고서 슬라이드 만들어줘" + Excel 파일 업로드

결과:
- 데이터 분석 후 핵심 지표 추출
- 전문적인 슬라이드 덱 자동 생성
- 차트, 그래프 포함
```

### 전화 업무 대행

```
프롬프트: "내일 오후 3시 레스토랑 예약 전화해줘"

결과:
- AI가 실제 전화 발신
- 자연스러운 음성 대화로 예약 진행
- 결과 보고
```

### 콘텐츠 생성

```
프롬프트: "신제품 출시 홍보 영상 만들어줘"

결과:
- 스크립트 자동 생성
- AI Video로 영상 제작
- 편집 및 수정 가능
```

---

## 경쟁사 비교

| 서비스 | 특징 | 강점 |
|--------|------|------|
| **Genspark** | Sparkpage + Super Agent | 구조화된 리서치 + 작업 실행 |
| **Perplexity** | 투명한 인용 검색 | 출처 명시, 빠른 답변 |
| **Manus** | 작업 자동화 에이전트 | 태스크 자동화 특화 |

Genspark는 리서치 엔진과 슈퍼 에이전트의 중간 지점에 위치한다. Sparkpage라는 구조화된 리서치 브리프가 차별점이다.

---

## 가격

2025년 초 기준, 명확한 가격 정책이 공개되지 않았다. Freemium 모델로 무료 사용 후 유료 업그레이드 옵션이 있는 것으로 알려져 있다.

---

## 참고 자료

- [Genspark 공식 사이트](https://www.genspark.ai/)
- [What is genspark.ai? - Skywork AI](https://skywork.ai/blog/what-is-genspark-ai/)
- [Genspark ships no-code agents - OpenAI](https://openai.com/index/genspark/)
- [Eric Jing CEO Interview - Lanchi Ventures](https://lanchiventures.com/eric-jing-ceo-of-genspark-seeing-agi/)
- [Genspark: Ultimate System of Context - Emergence Capital](https://www.emcap.com/thoughts/genspark-the-ultimate-system-of-context)
