---
title: SDD (Spec Kit)
parent: 개발
nav_order: 3
---

# SDD(Spec Driven Development)
{:.no_toc}


### Links

- [Spec Kit - GitHub](https://github.com/github/spec-kit)
- [SDD with AI - GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- [Spec Kit Comprehensive Guide](https://github.com/github/spec-kit/blob/main/spec-driven.md)
- [Video Overview](https://www.youtube.com/watch?v=a9eR1xsfvHg)
- [VS Code & GitHub Copilot: Spec-Driven Development](youtube.com/watch?v=DTw9X7MtU5s&utm_source=pytorchkr&ref=pytorchkr)

## 목차
{:.no_toc}

1. TOC
{:toc}

--- 

## 1. 설치

```
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

--- 

## 2. 프로젝트 초기화

```
specify init <PROJECT_NAME>
```

### 결과로 생성되는 폴더 및 파일 목록

```
<PROJECT_NAME>/
├── .github/  # /speckit.* 실행시 참고하는 프롬프트 가이드 (프로젝트 룰 생성하는 룰)
│   └── prompts/
│       ├── speckit.analyze.prompt.md
│       ├── speckit.checklist.prompt.md
│       ├── speckit.clarify.prompt.md
│       ├── speckit.constitution.prompt.md
│       ├── speckit.implement.prompt.md
│       ├── speckit.plan.prompt.md
│       ├── speckit.specify.prompt.md
│       └── speckit.tasks.prompt.md
└── .specify/
    ├── memory/  # speckit.* 실행 결과 생성되는 프롬프트 가이드 (프로젝트 룰)
    │   └── constitution.md
    ├── scripts/
    │   └── bash/
    │       ├── check-prerequisites.sh
    │       ├── common.sh
    │       ├── create-new-feature.sh
    │       ├── setup-plan.sh
    │       └── update-agent-context.sh
    └── templates/
        ├── agent-file-template.md
        ├── checklist-template.md
        ├── plan-template.md
        ├── spec-template.md
        └── tasks-template.md
```

### 가용한 툴 확인

```
specify check
```

--- 

## 3. Constitution 작성

### 초안 작성

```
/speckit.constitution
Fill the constitution with the **bare minimum requirements** for a local application based on the template.

# Functional spec
1. This application runs GET http requests to get price and volume of assets traded.
2. This application runs POST, PUT http requests to actually make a trading order.
3. This application connects to a local database with INSERT and SELECT query to store and fetch price and volume data.
4. This application trains LSTM model to predict future asset prices.
5. This application runs inference with the LSTM model to predict future asset prices.

# Database spec
1. use MySQL 8.0 for local database.
2. use tensorflow, keras, scikit-learn to preprocess data and build, train, infer LSTM model.
```

/speckit.constitution 명령어 사용해서 speckit의 constitution 작성 가이드 적용되도록 하기.

**bare minimum requirements**를 명시해서 최대한 간단하게 작성.

.specify/memory/constituion.md작성된 것 확인하고 원하는 부분 수정

수정시에도 /speckit.constituion 사용하여 자연어로 수정사항 주입하는게 편함.

### 수정 및 정제

다른 모델 사용해서 다시 검토

```
/speckit.constitution

Fill the constitution with the **bare minimum requirements** for a local application based on the template.

# Functional spec
1. This application runs GET http requests to get price and volume of assets traded.
2. This application runs POST, PUT http requests to actually make a trading order.
3. This application connects to a local database with INSERT and SELECT query to store and fetch price and volume data.
4. This application trains LSTM model to predict future asset prices.
5. This application runs inference with the LSTM model to predict future asset prices.

# Database spec
1. use MySQL 8.0 for local database.
2. use tensorflow, keras, scikit-learn to preprocess data and build, train, infer LSTM model.

위 명령에 따라 작성된 constitution.md에서 추가하거나 뺄 것이 있는지 검토해줘.
```

결과

```
(블라블라 생략)

... 

5. 예상 버전 영향
- Option A: MAJOR bump → 2.0.0 (원칙 재정의 및 다수 규칙 제거)
- Option B: MINOR bump → 1.2.0 (섹션 추가)
- Option C: PATCH bump → 1.1.1 (경미한 문구 정리)

6. 다음 단계
원하시는 옵션을 선택해주시면 해당 버전 규칙에 따라 패치 초안을 만들어 적용할 수 있습니다.
- “A로 가자” / “B로 가자” / “C로 가자” 중 알려주세요.

7. 선택 도움
- 빠른 프로토타입 & 단순성 중시 → A
- 운영/품질 지침 유지하면서 최소 경계만 강조 → B
- 거의 현행 유지, 살짝 정리 → C

원하시는 방향 알려주시면 바로 diff 형태로 준비하겠습니다. 어떤 옵션으로 진행할까요?
```

단순하고 빠른 프로토타이핑을 원하기 때문에 A로 진행

---

## 4. spec 작성

### What and Why 에 집중해서 기능적 스펙 작성

이번 시도에서는 내가 하려고 했던 모든 기능을 처음부터 끝까지 모두 제시했는데, spec 하나하나가 브랜치로 작동하기 때문에 작은 기능단위로 나눠서 실행하기에 더 적합한 듯 싶다.

```
/speckit.specify 

1. fetch ohlcv data from to backfill asset price and volume history. assets may vary.
2. store ohlcv data on db for future usage.
3. fetch ohlcv data from to continuously collect asset price and volume data.
---
4. can run SELECT query stored ohlcv data to use them as an input feature of LSTM model.
5. The query is also used for inference input.
6. The query should run for individual asset or collectively.
---
7. LSTM model must be trained to predict future (1day or maybe tuned) price of a specified asset using previous ohlcv data of various assets as input.
---
8. LSTM model prediction can be monitored by user realtime.
---
9. trading bot can make descisions and/or actions to buy/hold/sell the targeted asset.
10. trading bot can make descisions and/or actions to take long/short position for the target asset.
---
11. trading bot's descisions and actions can be monitored by user.
```

### 다른 모델 사용해서 다시 한번 정제

```
/speckit.specify 

1. fetch ohlcv data from to backfill asset price and volume history. assets may vary.
2. store ohlcv data on db for future usage.
3. fetch ohlcv data from to continuously collect asset price and volume data.
---
4. can run SELECT query stored ohlcv data to use them as an input feature of LSTM model.
5. The query is also used for inference input.
6. The query should run for individual asset or collectively.
---
7. LSTM model must be trained to predict future (1day or maybe tuned) price of a specified asset using previous ohlcv data of various assets as input.
---
8. LSTM model prediction can be monitored by user realtime.
---
9. trading bot can make descisions and/or actions to buy/hold/sell the targeted asset.
10. trading bot can make descisions and/or actions to take long/short position for the target asset.
---
11. trading bot's descisions and actions can be monitored by user.

**기존에 작성된 것과 비교해서 불필요한 부분 빼고, 부족한 부분 더 채워줘**
```

### Trading Execution 부분은 일단 빼고 Descision만 하도록 범위 축소

```
/speckit.specify

기 작성된 spec.md 참고해서
Trading Decision & Execution > Descision만 mocking 하는 형태로 기능을 줄여줘
```

- **[NEEDS CLARIFICATION]**이 붙은 부분들 처리: Agent에서 주는 안 중에 골라서 프롬프트 입력

- Video Overview에서 강조하는 부분은 **Review and Acceptance Checklist**인데 반해서 내 실행결과로는 각 User Story마다 **Acceptance Scenarios**만 나옴.
- 더 상세한 리스트로 작성하는 것이 좋을 지 아닐지는 추후 진행 후 판단하기로..

- 기존에 구현된 데이터 조회 양식, DB 양식, LSTM 모델 샘플 제공 예정임을 명시.

```
Backfilling data에서 자료 받아오는 부분과 database 구성은 추후 내가 직접 일부 구현 샘플을 넣을 예정이야.
LSTM modeling 부분도 추후 내가 샘플 모델을 제공할 예정이야
```

---

## 5. plan 작성

### Tech Stack and Architecture 명시

```
Follow instructions in [speckit.plan.prompt.md](file:///Users/minhopark/Projects/trading_bot/.github/prompts/speckit.plan.prompt.md).
## User Story 1
- OHLCV data는 single asset에 대해 최대 2000개의 데이터포인트를 받아오는 HTTP GET api를 사용해서 수집함.
- OHLCV data는 .resources/market.py의 fetch_data_coindesk 함수를 동일하게 구현.
- OHLCV data variation은 backfill_data에 있는 market, symbol pair를 사용할 수 있게 구현.
- OHLCV data를 실제로 backfill 하지 않고, 코드만 작성.
- OHLCV data를 저장하는 database는 .resources/database의 config를 그대로 사용할 예정이고, 이미 로컬에 실행되고 있어서 바로 연결해서 사용 가능해.
- database에는 1분봉 데이터가 이미 수집되어 있음 (2025-10-14 까지)

## User Story 2
- Continus collection에서는 기존에 수집된 데이터의 범위를 확인하고 1시간 간격으로 추가로 발생한 1분봉 데이터를 수집.
- User Story 1 에서 사용한 함수를 재활용할 수 있도록 구현.
- 매 시간 추가 데이터 수집을 트리거할 수 있도록 구현.
- 새로 수집한 데이터와 이미 저장된 데이터가 겹치는 경우 아래의 룰을 따름
  - 데이터가 동일한 경우 무시
  - 데이터가 다른 경우 (과거 데이터가 불완전한 것으로 판단하고) 덮어씀.
- 수집하는 데이터는 User Story 1에서 수집하는 모든 market, symbol pair.
- 1분봉 데이터가 수집 완료되는 시점에, 1분봉 데이터 기반으로 15분봉, 1시간봉 데이터도 파싱해서 저장해줘.
  - 1분봉 데이터를 15분봉, 1시간봉 등으로 aggregate할 때, 항상 동일한 시점을 기준으로 binning 되도록 기준을 세워줘.

## User Story 3
- 데이터 쿼리 속도가 너무 느린 경우, 파티션 등을 사용해서 읽기 속도를 최적화해줘.
- 지표를 쿼리할 때 속도가 너무 느리거나 차트 분석시 의미가 중복되는 경우 등은 적절히 고려해서 Warning Comment를 남겨줘.
- 각각 지표의 의미와 활용예를 커멘트로 남겨줘.

## User Story 4
- LSTM 모델은 .resources/model_handler.py에 있는 모델을 참고해서 구현해줘.
- scikit-learn, tensorflow, keras 를 사용해.
- 학습과 추론 부분을 구현해.
- 학습은 중간에 이어서 가능하도록 해줘.
- 학습이 잘 되고 있는지 모니터링할 수 있게 해줘.

## User Story 5
- 실시간 모니터링은 일단 LSTM이 추론한 결과를 데이터베이스에 저장하고,
- 데이터베이스에 저장된 결과를 외부에서 조회할 수 있는 api로 구현해줘.
- API를 어디서 호출할지는 몇 가지 가볍게 운용할 수 있는 옵션을 추천해줘. (ex. streamlit.io)

## User Story 6
- Trading Decision도 Execution을 mock해서 데이터베이스에 저장하도록 해줘.
- 시간이 지난 후 Trading Descision이 적절했는지, 이득/손실이 어떻게 되는지 사후평가할 수 있는 로직을 작성하고, 이 역시 같은 데이터베이스 테이블에 update하도록 해줘.

## User Story 7
User Story 5에 병합해줘
```

Tech Stack, Architecture는 샘플파일로 명시함.

### 결과

```
# 변경된 파일

## spec.md
- User Story 7을 User Story 5에 병합


# 새로 생성된 파일

## plan.md
- 메타데이터: 브랜치, 날짜, 스펙 링크
- Summary: 기능 개요 (1문단)
- Technical Context
 - 언어/버전
 - 주요 의존성
 - 스토리지
 - 테스팅
 - 타겟 플랫폼
 - 프로젝트 타입
 - 성능 목표
 - 제약사항
 - 규모/범위
- Constitution Check
- Project Structure
- 문서 구조: 6개 파일 (plan.md, research.md, data-model.md, quickstart.md, contracts/, tasks.md)
- 소스 코드 구조
- 구조 결정 근거
- Complexity Tracking: 헌법 위반 정당화 테이블 (현재 비어있음)

## requirements.md
- 사양 품질 체크리스트
- 구현 전 명세 완성도 검증용

## monitoring-api.yaml
- OpenAPI 3.0 사양서
- 예측/결정 조회 API 엔드포인트 정의
- 6개 경로: 
 - /predictions
 - /predictions/{id}
 - /predictions/accuracy
 - /decisions
 - /decisions/{id}
 - /decisions/performance

## data-model.md
- 데이터베이스 스키마 설계
- 6개 엔티티:
 - Asset
 - OHLCV_1M/15M/1H
 - TechnicalIndicators
 - LSTMModel
 - Prediction
 - TradingDecision
- ERD, 관계도, 검증 규칙, 인덱스, 파티셔닝 전략 포함

## quickstart.md
- 개발자 온보딩 가이드
- 8개 워크플로우:
 - 데이터 백필
 - 수집
 - 조회
 - 지표 계산
 - LSTM 훈련
 - 예측 생성
 - 모의 거래
 - 사후 평가
- 설치, 테스트, 배포 가이드

## research.md
- 기술 의사결정 문서
- 8개 연구 항목 (R1-R8)
 - API 성능
 - 쿼리 볼륨
 - 지표 라이브러리
 - 훈련 스케줄
 - 시간 정렬
 - 모니터링 배포
 - P&L 로직
 - DB 파티셔닝
```

아주 본격적으로 검토할 내용이 방대해지는데,
얼추 의도한 대로 명료하게 정리된 것 같고 맘에 안드는 내용은 대충 나중에 고쳐도 될 것 같으니 일단 OK.

### 한 번 더 리뷰 & 수정 요청

```
/speckit.plan 

현재 계획된 문서에 모순점은 없는지,
혹은 추가하거나 단순화하기 좋은 내용은 없을지 한번 더 검토해줘.
```

내용이 방대하고, 내가 중간중간 일부분만 수정해서 컨플릭도 꽤 있는듯하다.  
Agent가 반환한 내용

1. 잠재적 오류 수준
2. 정합성 및 가독성 개선 수준
3. 단순화 및 추가 할만한 내용

| 파일 | 제안 | 영향 |
|------|--------------|----|
| plan.md | Phase 1 Re-check 문구에서 PATCH/PUT 제거 | 오해 제거
| monitoring-api.yaml | POST /decisions 추가 (mock 실행) | FR-016, FR-018 정렬
| data-model.md | decision_type ENUM 설명에서 LONG 제거 또는 공식 포함 | 모델/API 동기화
| spec.md | Stochastic Oscillator 유지 시 TechnicalIndicators 컬럼 추가 안내 또는 Acceptance 시나리오에서 제거 | 기능 범위 명확화
| quickstart.md | error_pct 산식, decision 상태/평가 흐름, confidence 표시 형식 추가 | 개발자 이해 증대
| data-model.md / 전체 | 테이블 네이밍 규칙 통일 (snake_case 권장) | 구현 난이도 ↓
| monitoring-api.yaml | Decision/Prediction에 status 필드 선택적 추가 | 상태 기반 UI 용이
| research.md | Partitioning 예시 테이블명 snake_case로 통일 | 일관성 확보

다시 리스트 바탕으로 수정 요청

```
1 제안대로,
2 제안대로,
3 LONG 포함,
4 Stochastic Oscillator 제거,
5 적당한 포맷으로 추가,
6 대문자 snake_case로 통일,
7 무시,
8 Partitioning 기간 2020-01-01 부터 최신까지로 변경
```

---

## 6. task 작성

- 요청

```
/speckit.tasks

태스크를 작성해줘.
각각 태스크가 적절히 작성되었는지 확인할 수 있는 테스트 체크리스트도 같이 작성해줘.
```

- 결과

```
블라블라
...

suggested next steps
To start execution smoothly, take these small initial steps (they correspond to early tasks):

Environment bootstrap (T001–T004):

Create requirements.txt with pinned versions.
Add Ruff config / pyproject.toml.
Implement src/utils/config.py for .env loading.
Add pytest.ini and a trivial smoke test.
Database foundation (T010–T016):

Implement connection.py with pooling.
Write create_tables.sql using data-model.md.
Build migrate.py (idempotent).
Add partition helper & tests.
Proceed into backfill logic (T020–T024) once repositories are stubbed.

If you’d like, I can begin by scaffolding the environment (requirements.txt, basic directory tree, config loader, pytest setup) in the next turn—just say the word.

completion summary
You now have a comprehensive, test-oriented roadmap (tasks.md) mapping every functional requirement and user story to concrete build/test/perf tasks plus edge cases and risks. This closes the planning loop and sets up a clear execution path with measurable exit criteria. Let me know when you want to start implementing Phase 0 tasks; I can create the initial code scaffolding immediately.
```

- 진행상황을 명시적으로 기록하고 모니터링하기 위해서 체크리스트 추가 요청

```
/tasks

모든 태스크 하위에 투두 리스트 형식으로 현재 진행상황을 체크할 수 있는 체크박스를 만들어줘
```

- 결과 (tasks.md)

```
## Task Progress Checklists

Use these checkboxes to track lifecycle per task: Planned, In Progress, Implemented, Tests Passing, Docs Updated.
Convention: Mark left-to-right. Skip states not applicable (e.g., pure perf tasks may not need Docs Updated).

### Phase 0: Environment & Tooling
- T001: [ ] Planned [ ] In Progress [ ] Implemented [ ] Tests Passing [ ] Docs Updated
- T002: [ ] Planned [ ] In Progress [ ] Implemented [ ] Tests Passing [ ] Docs Updated
- T003: [ ] Planned [ ] In Progress [ ] Implemented [ ] Tests Passing [ ] Docs Updated
- T004: [ ] Planned [ ] In Progress [ ] Implemented [ ] Tests Passing [ ] Docs Updated

... 중략

```

## 7. 구현 시작

```
/implement
```
