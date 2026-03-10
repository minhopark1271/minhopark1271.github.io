---
title: Ontology & Semantic Layer
parent: 개발
nav_order: 51
description: Ontology와 Semantic Layer가 LLM에 제공하는 확장성을 분석합니다. 구조화된 지식 표현이 환각을 줄이고, Text-to-SQL 정확도를 높이며, 엔터프라이즈 AI 에이전트의 추론 능력을 강화하는 원리를 설명합니다.
---

# Ontology와 Semantic Layer가 LLM에 제공하는 확장성
{:.no_toc}

LLM이 엔터프라이즈 환경에서 신뢰할 수 있는 추론을 수행하려면, 구조화된 지식 기반이 필수입니다. Ontology와 Semantic Layer가 그 핵심 인프라 역할을 합니다.

### Link

- [The State of the Semantic Layer: 2025 in Review - AtScale](https://www.atscale.com/blog/semantic-layer-2025-in-review/)
- [The Role of Ontologies with LLMs - Enterprise Knowledge](https://enterprise-knowledge.com/the-role-of-ontologies-with-llms/)
- [Semantic Layer as the Data Interface for LLMs - dbt Labs](https://www.getdbt.com/blog/semantic-layer-as-the-data-interface-for-llms)
- [Ontologies, Context Graphs, and Semantic Layers: What AI Actually Needs in 2026](https://metadataweekly.substack.com/p/ontologies-context-graphs-and-semantic)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## LLM의 근본적 한계

LLM은 방대한 텍스트를 학습해 유창한 언어를 생성하지만, 다음과 같은 구조적 한계가 있습니다.

| 한계 | 설명 |
|------|------|
| **환각(Hallucination)** | 사실이 아닌 정보를 자신있게 생성 |
| **도메인 무지** | 조직 내부의 비즈니스 규칙, 메트릭 정의를 알지 못함 |
| **맥락 부재** | 데이터 간 관계와 계층 구조를 파악하지 못함 |
| **일관성 결여** | 동일 질문에 대해 다른 SQL, 다른 해석을 생성 |

이 한계를 해결하는 두 가지 핵심 기술이 **Ontology**와 **Semantic Layer**입니다.

---

## 개념 정의

### Ontology

Ontology는 특정 도메인 내의 **개념, 관계, 규칙**을 형식적으로 정의하는 체계입니다.

```
[고객] --주문하다--> [상품]
[상품] --속하다--> [카테고리]
[주문] --포함하다--> [결제]
```

- RDF(Resource Description Framework), OWL(Web Ontology Language) 같은 표준으로 표현
- 계층 구조, 연관 관계, 논리적 제약 조건을 인코딩
- **자동 추론(Inference)** 가능: 기존 사실에서 새로운 지식을 도출

### Semantic Layer

Semantic Layer는 원시 데이터 구조(테이블, 컬럼)를 **비즈니스 용어로 변환하는 인터페이스**입니다.

```yaml
# Semantic Layer 메트릭 정의 예시
metrics:
  - name: monthly_revenue
    description: "월별 매출 (환불 제외)"
    type: sum
    sql: "SUM(amount) WHERE status != 'refunded'"
    time_grains: [day, week, month]
```

- 비즈니스 메트릭의 단일 정의(Single Source of Truth)
- dimension, measure, relationship를 선언적으로 정의
- BI 도구, LLM, API 등 다양한 소비자에게 동일한 의미를 제공

### 핵심 차이

| 기준 | Ontology | Semantic Layer |
|------|----------|----------------|
| **목적** | 도메인 이해와 추론 | 데이터 분석과 소비 |
| **대상** | AI 시스템, 지식 그래프 | BI 도구, 분석가, LLM |
| **강점** | 자동 추론, 다중 도메인 통합 | 메트릭 일관성, 셀프서비스 |
| **표현** | RDF/OWL (형식 논리) | YAML/SQL (선언적 정의) |

대규모 엔터프라이즈에서는 **두 가지를 함께 사용**합니다. Semantic Layer로 운영 분석을 처리하고, Ontology로 AI 추론을 지원합니다.

---

## LLM 확장성 #1: Semantic Layer를 통한 정확한 데이터 접근

### Text-to-SQL 정확도 향상

LLM에 raw 스키마만 제공했을 때와 Semantic Layer를 함께 제공했을 때의 차이는 극적입니다.

| 조건 | Text-to-SQL 정확도 |
|------|-------------------|
| GPT-4 + Raw Schema | **16.7%** |
| GPT-4 + Semantic Layer | **54.2%** (3배 향상) |
| GPT-4 + Headless Semantic Layer (AtScale) | **92.5%** |

Semantic Layer가 제공하는 메트릭 정의, 차원 관계, 조인 로직이 LLM의 SQL 생성을 가이드하기 때문입니다.

### 작동 원리

```
사용자 질문: "지난 달 신규 고객 매출이 얼마야?"
         │
         ▼
    ┌─────────────┐
    │  LLM 해석    │  자연어 → 의도 파악
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │ Semantic Layer│  메트릭/차원 매핑
    │  참조        │  "신규 고객" → customer_type = 'new'
    │             │  "매출" → monthly_revenue 메트릭
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │ SQL 생성     │  제약 조건 내에서 정확한 쿼리 생성
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │ 데이터 반환   │  검증된 결과
    └─────────────┘
```

Cube, dbt Semantic Layer, AtScale 등의 플랫폼이 이 아키텍처를 구현합니다. Cube는 RAG 기반으로 사용자 프롬프트를 API 호출로 변환하고, 이를 결정론적으로 SQL로 컴파일합니다.

### 확장성 포인트

- **새 메트릭 추가**: Semantic Layer에 메트릭 정의만 추가하면 LLM이 즉시 활용 가능
- **스키마 변경 격리**: 하위 테이블 구조가 변경되어도 Semantic Layer 정의만 수정하면 LLM 측 변경 불필요
- **멀티 소비자**: 동일한 메트릭 정의를 BI 도구, LLM, API가 공유 → 일관된 숫자 보장

---

## LLM 확장성 #2: Ontology를 통한 구조화된 추론

### Knowledge Graph + Ontology 기반 Grounding

Ontology가 LLM에 제공하는 가장 큰 가치는 **패턴 매칭을 넘어 구조화된 추론**을 가능하게 하는 것입니다.

```
[기존 LLM]
  "서울 날씨 알려줘" → 학습 데이터 기반 패턴 매칭 → 부정확할 수 있음

[Ontology-Grounded LLM]
  "서울 날씨 알려줘" → Ontology에서 '서울' = 도시 엔티티 확인
                     → Knowledge Graph에서 현재 기상 데이터 조회
                     → 구조화된 사실 기반 응답 생성
```

### GraphRAG: Ontology 기반 RAG의 진화

일반 RAG는 각 문서 청크를 독립적으로 처리하지만, GraphRAG는 Ontology 기반 Knowledge Graph를 활용합니다.

| 항목 | 일반 RAG | GraphRAG |
|------|----------|----------|
| **검색 단위** | 문서 청크 (독립적) | 엔티티 + 관계 (연결된 그래프) |
| **맥락 이해** | 청크 내 텍스트만 | 엔티티 간 관계 추론 |
| **멀티홉 추론** | 불가능 | 가능 (A→B→C 관계 추적) |
| **모호성 해소** | 어려움 | Ontology 기반 disambiguation |

**실제 사례**: 한 글로벌 재단은 전략적 투자 분석에 LLM을 적용하려 여러 차례 실패한 후, Enterprise Knowledge Graph + Ontology를 도입해 공개 데이터, 내부 투자 문서, 독점 데이터셋을 통합 분석하는 데 성공했습니다.

### 확장성 포인트

- **도메인 확장**: 새 도메인의 Ontology를 추가 연결하면 LLM이 cross-domain 추론 가능
- **지식 누적**: Knowledge Graph에 엔티티/관계 추가 시 LLM이 즉시 활용 (재학습 불필요)
- **추론 규칙 확장**: Ontology에 새 규칙 추가만으로 LLM의 추론 능력 강화

---

## LLM 확장성 #3: AI 에이전트의 기반 인프라

### Semantic-First AI Agent

2025-2026년 엔터프라이즈 AI의 핵심 패턴은 **Semantic-First AI Agent**입니다. LLM 에이전트가 Semantic Layer와 Ontology 위에서 직접 추론하는 구조입니다.

```
┌──────────────────────────────────────┐
│           AI Agent (LLM)             │
│   자연어 이해 + 계획 수립 + 실행       │
└───────────┬──────────┬───────────────┘
            │          │
     ┌──────▼──┐  ┌────▼────────┐
     │Semantic │  │  Ontology   │
     │ Layer   │  │  + KG       │
     │         │  │             │
     │메트릭   │  │도메인 지식   │
     │데이터   │  │관계 추론     │
     └────┬────┘  └──────┬──────┘
          │              │
    ┌─────▼──────────────▼──────┐
    │    데이터 웨어하우스 / DB     │
    └───────────────────────────┘
```

이 아키텍처에서 확장성이 발생하는 지점:

| 확장 요소 | Semantic Layer 역할 | Ontology 역할 |
|----------|-------------------|---------------|
| **새 데이터 소스** | 메트릭 매핑 추가 | 엔티티/관계 모델링 |
| **새 비즈니스 도메인** | 도메인별 메트릭 세트 | cross-domain 링크 |
| **새 AI 에이전트** | 동일 메트릭 API 재사용 | 동일 Knowledge Graph 공유 |
| **거버넌스 규칙** | 접근 권한, 메트릭 정의 | 의미 규칙, 제약 조건 |

### 데이터 거버넌스와의 결합

Ontology는 의미(meaning), 규칙(rules), 관계(relationships)를 **단일 시맨틱 레이어로 통합**하여, LLM을 포함한 시스템이 해석할 수 있는 구조를 제공합니다. 이를 통해:

- 모델링 비용 절감
- 구현 단순화
- 거버넌스 중앙 집중화
- 장기 유지보수 현실화

---

## 주요 플랫폼 비교

| 플랫폼 | 유형 | 특징 |
|--------|------|------|
| **Cube** | Headless Semantic Layer | RAG 기반 Text-to-SQL, API 중심, 플랫폼 독립적 |
| **dbt Semantic Layer** | MetricFlow 기반 | dbt 생태계 통합, OSI 표준 호환 |
| **AtScale** | Enterprise Semantic Layer | 92.5% Text-to-SQL 정확도, BI 통합 강점 |
| **Neo4j + Ontology** | Knowledge Graph | GraphRAG 구현, 관계 추론 |
| **Ontotext** | Semantic Graph DB | RDF/OWL 기반 Ontology 관리 |

2025년 OSI(Open Semantic Interface) 표준이 출범하면서, 이들 플랫폼 간의 메트릭 정의가 이식 가능(portable)해지고 있습니다.

---

## 실무 적용 전략

### 단계별 도입

```
Phase 1: Semantic Layer 구축
  → 핵심 비즈니스 메트릭 정의
  → LLM 기반 Text-to-SQL 파이프라인 연결
  → 즉각적인 정확도 향상 확인

Phase 2: Ontology 설계
  → 도메인 엔티티/관계 모델링
  → Knowledge Graph 구축
  → GraphRAG로 문서 QA 고도화

Phase 3: AI Agent 통합
  → Semantic Layer + Ontology 기반 에이전트 구축
  → 멀티 도메인 추론 활성화
  → 거버넌스 자동화
```

### 핵심 원칙

1. **Semantic Layer 먼저**: 비즈니스 메트릭 정의는 즉각적인 ROI를 제공합니다
2. **Ontology는 점진적으로**: 전체 도메인을 한번에 모델링하지 말고, 핵심 엔티티부터 시작합니다
3. **LLM은 소비자**: Ontology와 Semantic Layer를 만드는 것은 사람이고, LLM은 이를 활용하는 소비자입니다
4. **표준 준수**: OSI, RDF/OWL 등 개방형 표준을 따라야 플랫폼 종속을 방지합니다

---

## 요약

Ontology와 Semantic Layer는 LLM의 확장성을 서로 다른 축에서 강화합니다.

- **Semantic Layer** → **데이터 접근의 확장성**: 메트릭 추가만으로 LLM이 새로운 데이터를 정확히 조회
- **Ontology** → **추론 능력의 확장성**: 지식 추가만으로 LLM이 새로운 도메인을 이해하고 추론
- **결합 시** → **AI 에이전트의 확장성**: 신뢰할 수 있는 엔터프라이즈 AI 시스템의 기반 인프라

Raw LLM만으로는 엔터프라이즈 요구사항을 충족할 수 없습니다. 구조화된 의미 체계가 LLM을 "유창한 텍스트 생성기"에서 "신뢰할 수 있는 비즈니스 추론 엔진"으로 전환하는 핵심 열쇠입니다.
