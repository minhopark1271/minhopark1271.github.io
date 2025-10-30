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
- [VS Code & GitHub Copilot: Spec-Driven Development](youtube.com/watch?v=DTw9X7MtU5s&utm_source=pytorchkr&ref=pytorchkr)
- [Video Overview](https://www.youtube.com/watch?v=a9eR1xsfvHg)
- [Vidoe CLARIFY and ANALYZE](https://www.youtube.com/watch?v=YD66SBpJY2M)
- [Video CHECKLIST](https://www.youtube.com/watch?v=zTiLF3-BvGs)
- [Video Speckit with existing project](https://www.youtube.com/watch?v=SGHIQTsPzuY)

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

specify init --here
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

---

## 3. 프로젝트 진행 전 기능 확인

### 가용한 AI Coding Agents 확인

```
specify check
```

### 핵심 기능
1. **/constitution**: 프로젝트의 대원칙 및 개발 가이드 정의
   - 세세한 규칙 포함되지 않도록 최소로 정의하는 것에서 시작
   - 개발을 진행하면서 꼭 포함하고싶은 절차, 가이드 등도 제공 가능
     - ex. implement할 때는 task 단위로 브랜치를 만들고 구현완료 후에 커밋해줘
     - ex. 비슷한 속성을 공유하더라도 Object를 상속하는 경우는 최대한 배제해줘

2. **/specify**: 특정 요구사항과 기능을 상세하게 명세.
   - 무엇을 왜 하는지에 대해 상세 정의
   - Requirements, User Stories가 핵심 결과물

3. **/plan**: 기술스택과 아키텍처 포함해서 실제 구현 계획 생성.

4. **/task**: plan에서 수립한 계획을 바탕으로 실제 구현 가능한 작업 단위 생성
   - 각 태스크의 구체적인 목표치와 완료 기준까지 작성하면 좋음

5. **/implement**: task를 직접 코드로 구현하는 단계.
   - 코드 작성 - 테스트코드 작성 - 테스트 - 디버깅의 반복

### 보조 기능
- **/clarify**: 스펙의 불명확한 부분을 찾고 사용자가 답변함으로써 스펙 구체화.
  - /specify 뒤(/plan 전)에 사용 추천
  - 언더스펙 문제 대응
- **/analyze**: 스펙, 기술 계획, 작업 간의 일관성 및 헌법 위반 여부 분석.
  - /task 뒤(/implement 전)에 사용 추천
  - 요구사항 모순점 개선으로 일관성 확보
- **/checklist**: 완결성, 명확성, 일관성 확보를 위해 사용자가 임의로 추가하고싶은 체크리스트 생성

--- 

## 4. Constitution 작성

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

## 5. spec 작성

### What and Why 에 집중해서 기능적 스펙 작성

이번 시도에서는 내가 하려고 했던 모든 기능을 처음부터 끝까지 모두 제시했는데,  
spec 하나하나가 브랜치로 작동하기 때문에 작은 기능단위로 나눠서 실행하기에 더 적합한 듯 싶다.  

정확히 원하는 구조, 기술스택, 파일 등이 있다면 여기서 정의해도 됨.

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

## 6. plan 작성

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

## 7. task 작성

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

---

## 8. uv 사용 설정

```
/plan

파이썬 및 라이브러리 버전관리는 uv 사용
```

명령 넣었더니 uv 초기 설정하며 오류가 엄청 나는데  
아 모르겠고 알아서 해줘.  
tensorflow, keras, sklearn, pandas, numpy간 버전 맞추기 반복.

```
✅ 모든 작업 완료 - TensorFlow 2.20.0 기준으로 정렬

적용된 변경사항
pyproject.toml

tensorflow==2.20.0
keras>=3.10.0 (TensorFlow 2.20 요구사항)
numpy>=1.26.0 (TensorFlow 2.20 요구사항)
pandas>=2.2.0 (numpy 2.x 바이너리 호환성)
scikit-learn>=1.5.0 (numpy 2.x 호환성)
mysql-connector-python>=9.0.0 (protobuf>=5.28 호환)
streamlit>=1.40.0 (protobuf>=5.28 호환)
실제 설치된 버전 (uv.lock 생성됨)

TensorFlow: 2.20.0
Keras: 3.12.0
NumPy: 2.3.4
pandas: 2.3.3
scikit-learn: 1.7.2
Streamlit: 1.50.0
MySQL Connector: 9.5.0
문서 업데이트

quickstart.md: 의존성 목록 및 TensorFlow 2.20 호환성 노트 추가
test_environment.py: 메이저 버전 prefix 체크로 완화 (유연한 버전 허용)
검증 완료

✅ 모든 패키지 import 성공
✅ pytest 테스트 통과
✅ uv.lock 파일 생성 완료
```

---

## 9. implement

### Phase 0

```
/implement

Phase 0: Environment & Tooling 태스크 진행
```

Phase 0 완료

```
Follow instructions in speckit.tasks.prompt.md.
phase 단위로 구현 완료할 때 마다 파일 커밋하도록 룰에 추가해줘.
```

커밋 완료

```
/implement
db config 값은 .resources/database/.env.mysql에 있는 값을 카피해서 적절한 곳에 넣어주고,
db 초기화 할 때 기본값으로도 넣어줘
```

DB 설정 값 불러오고 .env 및 src/databse/connection.py 디폴트 값 설정 완료


### Phase 1 tasks 재정의

기존에 만들어져 있는 db 정보 전달,  
데이터 들어있는 상황에 맞춰 Phase 2 tasks 다시 정의 요청

```
/tasks

.resources/database/sql/create_database.sql
.resources/database/sql/create_ohlcv_table.sql
.resources/database/sql/grant_privileges.sql
.resources/database/sql/modify_exchange_symbol.sql
에 따라서 기존에 OHLCV_1M, OHLCV_15M, OHLCV_1H 테이블을 만들어져있고,
OHLCV_1M 안에는 데이터도 들어있음을 참고해서 Phase1 task 상세 내용 수정해줘.
```

### Phase 1 implement

```
/implement

implement tasks in phase 1
mark progress checkboxes when all done
```

결과

```
Phase 1 complete! All tasks (T010-T016) finished. Summary:

Phase 1: Database Schema & Connectivity - Complete ✅

# Completed Tasks:

- ✅ T010: Connection pooling (10 tests: 5 unit + 5 integration)
- ✅ T011: Migration SQL (5 new tables: ASSET, TECHNICAL_INDICATORS, LSTM_MODEL, PREDICTION, TRADING_DECISION)
- ✅ T012: Migration runner (idempotent, tested twice)
- ✅ T013: Repository layer (4 repositories: ohlcv, indicators, prediction, decision)
- ✅ T014: Validation tests (54 unit tests for ENUM/RSI/confidence/price validation)
- ✅ T015: Partition manager placeholder (deferred to Phase 11)
- ✅ T016: Performance tests (4 tests: p95 latency 120ms, index_merge acceptable for MVP)

# Files Created:

- connection.py - Connection pooling
- create_tables.sql - Schema DDL
- migrate.py - Migration executor
- repositories - 4 repository modules with validation
- partition_manager.py - Placeholder for optimization
- database - 4 test files (59 unit tests)
- test_performance.py - 4 performance tests

## Database Schema:

- 8 tables total (3 existing OHLCV + 5 new)
- ENUM constraints for exchange/symbol/timeframe/decision_type
- Foreign keys with CASCADE/RESTRICT
- PRIMARY KEY indexing (partitioning deferred)

## Test Coverage:

- 72 tests total (71 passing when run together, all pass when isolated)
- Unit test isolation note documented
- Performance: avg 38ms SELECT, p95 120ms (acceptable for MVP)
```

### 중간에 룰 업데이트

- 자꾸 체크리스트 체크하는거 빠트림.  
- 다 구현했다고 하는데 마음에 안들거나 수정하고 싶은 부분 있으니 커밋후 대기하도록 함.  
- 한 브랜치에서 계속 작업하는데, Phase별로 branch를 나누도록 변경

```
/constitution

Phase 단위로 implement를 하려고 하는데,
Implement완료할 때 마다 tasks.md에 Task Progress Checklists를 체크하도록 해줘.
Implement가 완료될 때마다 커밋 해주고
이후 사용자가 수정사항을 요청하는 프로세스로 이어지도록 해줘.
새로운 Phase를 implement하기 전에 새로운 브랜치를 만들어줘.
```

### Phase 3 까지 진행 후 코드 구조 확인

상세 내용은 대충 알아서 잘 만들고 테스트하고 있는것 같아서 안보고 넘김  
디비 테이블 양식이랑, api 양식이 잘 구현되어 있는지 정도 확인하고  
Phase 3까지 쭉 진행.  

```
trading_bot/
├── .specify/
│   └── memory/
│       └── constitution.md (v2.2.0 - Phase-based workflow with checklist discipline)
│
├── specs/
│   └── 001-continuous-ohlcv-data/
│       ├── spec.md (Feature specification)
│       ├── plan.md (Technical architecture)
│       ├── tasks.md (Phase 0-12 task breakdown)
│       └── checklists/
│           └── requirements.md (12/16 complete)
│
├── src/
│   ├── config/
│   │   ├── __init__.py
│   │   ├── database.py ✅ (DB config loader)
│   │   └── logging_config.py ✅ (Structured logging setup)
│   │
│   ├── database/
│   │   ├── __init__.py
│   │   ├── connection.py ✅ (Connection pooling)
│   │   ├── migrations/
│   │   │   ├── create_tables.sql ✅ (ASSET, TECHNICAL_INDICATORS, etc.)
│   │   │   └── create_ohlcv_1d.sql ✅ [Phase 3] (Daily candle table)
│   │   └── repositories/
│   │       └── ohlcv_repository.py ✅ (insert_ohlcv, get_latest_timestamp, get_ohlcv_range)
│   │
│   └── data_collection/
│       ├── __init__.py
│       ├── fetchers/
│       │   └── coindesk_api.py ✅ [Phase 2] (HTTP client for CoinDesk API)
│       │       ├── fetch_ohlcv_data() - Single batch fetch
│       │       └── fetch_ohlcv_batch() - Multi-batch with pagination
│       │
│       ├── collectors/
│       │   ├── backfill_collector.py ✅ [Phase 2] (Historical data backfill)
│       │   │   └── BackfillCollector class
│       │   │       ├── collect() - Full historical backfill
│       │   │       └── Duplicate handling via ON DUPLICATE KEY UPDATE
│       │   │
│       │   └── continuous_collector.py ✅ [Phase 3] (Incremental hourly collection)
│       │       └── ContinuousCollector class
│       │           ├── collect_asset() - Single asset incremental fetch
│       │           ├── aggregate_asset() - Post-collection aggregation
│       │           ├── collect_cycle() - Multi-asset orchestration
│       │           ├── run_daemon() - Continuous mode (schedule library)
│       │           └── run_once() - Single-shot mode (cron-friendly)
│       │
│       └── aggregators/
│           └── candle_aggregator.py ✅ [Phase 2] (Timeframe conversion)
│               └── aggregate_candles() - 1m → 15m/1h/1d
│
├── tests/
│   ├── unit/
│   │   ├── config/
│   │   │   ├── test_database.py ✅ (6 tests)
│   │   │   └── test_logging.py ✅ (4 tests)
│   │   │
│   │   ├── database/
│   │   │   ├── test_connection.py ✅ (4 tests)
│   │   │   └── test_ohlcv_repository.py ✅ (8 tests)
│   │   │
│   │   └── data_collection/
│   │       ├── test_coindesk_api.py ⚠️ [Phase 2] (6 tests - 6 failing, pre-existing)
│   │       ├── test_backfill_collector.py ✅ [Phase 2] (10 tests - all passing)
│   │       └── test_continuous_collector.py ✅ [Phase 3] (20 tests - all passing)
│   │           ├── TestContinuousCollector (12 tests)
│   │           ├── TestAggregationTrigger (6 tests) - T033 performance
│   │           └── TestMultiAssetOrchestration (2 tests) - T034/T035
│   │
│   └── integration/
│       └── database/
│           └── test_performance.py ✅ (1 test)
│
├── pyproject.toml ✅ (uv project config)
├── uv.lock ✅ (Dependency lock file)
├── .python-version (3.11.13)
└── pytest.ini ✅ (Test configuration)
```

specs 하위에 001-continuous-ohlcv-data 내용 하단에 프로젝트 계획파일들이 있어서 상위로 옮기고,  
checklist에 불필요한 requirements 정의되어있어서 삭제 후  
Phase 4로 이어서 진행

---

001-continuous-ohlcv-data지우고 내용 상위로 옮겼더니 인식을 잘 못함.  
현재 specify, plan, task, implement 한 프로젝트 내용 모두가 저기에 포함되나봄.  
원래대로 복구

---

작업하다보니 깨달은건데,  
Feature 단위로 /specify, /plan, /task, /implement 사이클을 한번씩 돌리게 설계되었나봄.  
TODO. Phase 단위로 끊어서 브랜치 따서 작업할 때 어떻게 연계해야 하는지 더 살펴보기

---

작업 끝나면 docs/phase-description.md 형태로 문서 작성하고 마무리하게 constitution에 넣기
새 phase 작업하기 전에 기존 작업 내용 참고하도록하기

---

### Phase 7 까지 마무리

중간중간 앞에 실제로 미완료 된 항목들(실제 데이터 계속 수집, 모델 학습)에 따라
Scaffold까지만 작성하도록 하는 등 tasks 일부 수정

```
참고: 기존 코드에 lint 경고 444개 발견 (대부분 typing.List → list 등 Python 3.11 스타일 업그레이드). Phase 7 코드는 통과, 전체 정리는 별도 작업 필요.

이 부분 전반적으로 수정해줘.

use context7 mcp
```

이런 식으로 중간중간 부족한 부분 채우기

---

### Phase 9 까지 마무리

Phase 9에서 몇 가지 모니터링 api를 구현하고 별도의 app으로 구동하도록 만듦.

Phase 10은 streamlit 사용해서 대시보드 구현하는 부분이어서  
Phsee 9구현사항 기반으로 task 구체화 요청했더니 아주 상세한 리스트로 작성됨.

기존 tasks.md

```
### Phase 10: Streamlit Dashboard (US5 - P5 continuation)

| ID | Story | FR | Priority | Type | Depends On |
|----|-------|----|----------|------|------------|
| T100 | US5 | FR-015..FR-020 | P5 | build | T090 |
| T101 | US5 | FR-015..FR-020 | P5 | test | T100 |
| T102 | US5 | FR-015..FR-020 | P5 | build | T100 |
| T103 | US5 | FR-015..FR-020 | P5 | test | T102 |
| T104 | US5 | FR-015..FR-020 | P5 | perf | T100 |

#### T100: Streamlit dashboard (`monitoring/streamlit_dashboard.py`) layout (asset selector, prediction chart, position decisions table)
Tests: Manual smoke; component rendering without exceptions.

#### T101: Dashboard data fetch tests (mock API responses).

#### T102: Auto-refresh & caching (`@st.cache_data`) integration
Tests: Refresh toggled; cache invalidates on new prediction.

#### T103: Filtering (confidence slider, date range, position type) tests.

#### T104: Dashboard load time test (<3s initial render, <1s refresh).
```

요청

```
/tasks

phase 9에서 구현한 app의 api를 바탕으로 Phase 10 태스크를 구체화해줘
```

수정된 tasks.md

```
### Phase 10: Streamlit Dashboard (US5 - P5 continuation)

| ID | Story | FR | Priority | Type | Depends On |
|----|-------|----|----------|------|------------|
| T100 | US5 | FR-015..FR-020 | P5 | build | T090 |
| T101 | US5 | FR-015..FR-020 | P5 | test | T100 |
| T102 | US5 | FR-015..FR-020 | P5 | build | T100 |
| T103 | US5 | FR-015..FR-020 | P5 | build | T100 |
| T104 | US5 | FR-015..FR-020 | P5 | test | T102,T103 |
| T105 | US5 | FR-015..FR-020 | P5 | perf | T100,T102 |

#### T100: Create Streamlit dashboard layout in `src/dashboard/app.py` with 3 tabs: Predictions, Positions, Performance
**Description**: Implement multi-tab Streamlit application consuming Phase 9 API (http://127.0.0.1:8000). Layout includes:
- **Predictions Tab**: Asset selector (dropdown), date range picker, prediction table with columns (prediction_id, symbol, predicted_price, confidence, actual_price, direction), line chart showing predicted vs actual prices over time
- **Positions Tab**: Position decisions table with filters (action: LONG/SHORT/STAY, execution status), columns (position_id, symbol, action, confidence, entry_price, profit_loss_pct, evaluation_status)
- **Performance Tab**: Metrics cards (total predictions, accuracy rate, win rate, avg profit/loss), symbol-wise accuracy breakdown table, position performance by action type

**API Endpoints Used**:
- `GET /predictions?symbol={symbol}&start_date={date}&end_date={date}&page={n}&page_size=50`
- `GET /predictions/accuracy?symbol={symbol}&start_date={date}&end_date={date}`
- `GET /positions?symbol={symbol}&action={action}&is_executed={bool}&page={n}&page_size=50`
- `GET /positions/performance?symbol={symbol}&start_date={date}&end_date={date}`

**Exit Criteria**:
- Dashboard loads without exceptions
- All 3 tabs render with placeholder data (empty tables show "No data available")
- Asset selector populated from hardcoded list (BTC-USDT, ETH-USDT, BTC-EUR, ETH-EUR)
- Date range picker defaults to last 7 days

**Tests**: Manual smoke test - start dashboard with `streamlit run src/dashboard/app.py`, verify tabs clickable, widgets interactive.

**Edge Cases**: API unavailable (display error message), empty response (show "No data" message), invalid date range (start > end, show validation error).

**Risks**: Streamlit version compatibility; mitigate by pinning streamlit>=1.40.0 in pyproject.toml.

#### T101: Implement API client module `src/dashboard/api_client.py` with error handling and retry logic
**Description**: Create HTTP client wrapper using `httpx` to call Phase 9 API endpoints. Functions:
- `fetch_predictions(symbol=None, start_date=None, end_date=None, page=1, page_size=50)` → returns dict with 'data' and 'pagination' keys
- `fetch_prediction_accuracy(symbol=None, start_date=None, end_date=None)` → returns accuracy metrics dict
- `fetch_positions(symbol=None, action=None, is_executed=None, page=1, page_size=50)` → returns positions list
- `fetch_position_performance(symbol=None, start_date=None, end_date=None)` → returns performance metrics dict

**Error Handling**:
- Connection errors: Retry up to 3 times with exponential backoff (1s, 2s, 4s)
- Timeout: 5 seconds per request
- HTTP errors: Raise custom `APIClientError` with status code and message
- Rate limiting (429): Respect Retry-After header, show user message

**Exit Criteria**:
- All 4 functions implemented with type hints
- Connection errors trigger retry (verify with mock)
- 429 response raises APIClientError with retry_after value

**Tests**: Unit tests with mocked httpx responses (success, timeout, 429, 500, connection error).

#### T102: Add auto-refresh with Streamlit timer and `@st.cache_data` for API responses
**Description**: Implement automatic data refresh every 60 seconds using `st.empty()` and `time.sleep()` pattern. Cache API responses with `@st.cache_data(ttl=60)` decorator to avoid redundant API calls within refresh window. Add manual refresh button in sidebar.

**Caching Strategy**:
- Predictions list: Cache key includes (symbol, start_date, end_date, page)
- Accuracy metrics: Cache key includes (symbol, start_date, end_date)
- Positions list: Cache key includes (symbol, action, is_executed, page)
- Performance metrics: Cache key includes (symbol, start_date, end_date)

**Exit Criteria**:
- Auto-refresh updates data every 60 seconds (visible timestamp in sidebar)
- Manual refresh button clears cache and reloads data
- Cache hit reduces API calls (verify with logging)

**Tests**: Integration test - verify cached data served within TTL, fresh data fetched after TTL expires.

#### T103: Implement filtering controls in sidebar: symbol selector, date range, confidence slider (0.0-1.0), action filter (LONG/SHORT/STAY/ALL)
**Description**: Add Streamlit sidebar widgets:
- `st.selectbox("Symbol", options=["ALL", "BTC-USDT", "ETH-USDT", ...])` - filters predictions/positions by symbol
- `st.date_input("Date Range", value=(7 days ago, today))` - filters by prediction_ts or executed_at
- `st.slider("Min Confidence", 0.0, 1.0, 0.6, 0.05)` - filters predictions/positions by confidence ≥ threshold
- `st.radio("Action", ["ALL", "LONG", "SHORT", "STAY"])` - filters positions by action type

**Filter Application**:
- Filters update query parameters sent to API endpoints
- "ALL" option omits filter parameter from API call
- Apply filters on tab change (each tab respects current filter state)

**Exit Criteria**:
- All 4 filter widgets render in sidebar
- Changing filter triggers API call with new parameters
- Filter state persists across tab switches

**Tests**: Manual test - change filter, verify API call query params match filter values (inspect network or add debug logging).

#### T104: Add visualization components: prediction accuracy chart (line chart), profit/loss histogram, position distribution pie chart
**Description**: Implement data visualizations using `st.line_chart()`, `st.bar_chart()`, and `plotly.express`:
- **Predictions Tab**: Line chart showing predicted_price vs actual_price over time for selected symbol (x=target_ts, y=price, 2 lines)
- **Positions Tab**: Histogram of profit_loss_pct distribution (bins: <-10%, -10 to -5%, ..., >10%)
- **Performance Tab**: Pie chart of position distribution by action (LONG/SHORT/STAY counts)

**Chart Requirements**:
- Use Streamlit native charts for simplicity (line/bar charts)
- Use plotly for interactive pie chart with hover tooltips
- Display "No data for chart" message if response empty
- Color code: Green for positive P&L, Red for negative, Gray for STAY

**Exit Criteria**:
- All 3 chart types render with sample data
- Charts update when filters change
- Empty data shows placeholder message

**Tests**: Visual inspection with mock data (positive/negative P&L, multiple symbols).

**Edge Cases**: Single data point (chart still renders), all STAY positions (pie chart shows 100% STAY), missing actual_price (line chart shows predicted only).

#### T105: Performance test: dashboard initial load <3s, refresh <1s, handle 1000+ prediction rows without lag
**Description**: Benchmark dashboard performance under realistic data volumes. Measure:
- **Initial Load Time**: Time from `streamlit run` to first render (<3s target)
- **Refresh Time**: Time from manual refresh click to updated data display (<1s target)
- **Large Dataset Handling**: Paginated table with 1000+ rows (pagination prevents lag)
- **Concurrent Users**: Dashboard responds correctly when API has multiple dashboard instances (rate limiting tested in Phase 9)

**Performance Targets** (from plan.md):
- p95 initial load: <3s
- p95 refresh: <1s
- Memory: Stable (no growth beyond 100MB after 10 refreshes)
- UI responsiveness: No freezes during API calls (use `st.spinner()`)

**Exit Criteria**:
- Initial load completes <3s (measured with `time.time()`)
- Refresh completes <1s
- Table with 1000 rows renders smoothly (pagination at 50 rows/page)
- Memory profiling shows no leaks

**Tests**: 
- Automated: `tests/dashboard/test_performance.py` using `selenium` or `streamlit.testing.v1`
- Load test: Run dashboard, perform 10 manual refreshes, verify memory stable with `psutil`

**Edge Cases**: Slow API response (>5s timeout), rate limit hit (429 error displayed), network disconnection (error message shown).

**Risks**: Streamlit performance degradation with large datasets; mitigate by implementing pagination and limiting chart data points to latest 100.
```

상세 내용은 살피지 않았지만 대충 좋아보여서 /implement 이어서 진행

---

### specs/* 하단 spec guides 인식 문제 개선

Phase별로 /implement 진행하기 전에 수동으로 브랜치명과 동일하게 파일 복사해주니 잘 인식함.

```
git checkout -b phase-10-dashboard
cp -r specs/phase-9-monitoring-api specs/phase-10-dashboard
```

---

## 그때그때 해야할 일

1. Phase 단위로 나눠서 구현 진행
2. 구현을 진행하기 전에 master로 부터 새 브랜치로 포크
3. 브랜치 명은 phase-{phase}-{description}
4. 직전 Phase의 specs를 이번 Phase의 브랜치명과 동일하게 카피
  ex. `cp -r phase-0-init phase-1-some-execution`
5. /implement
  1. Phase 내의 tasks구현 (디폴트)
  2. TDD 기반 구현 (디폴트)
  3. 테스트 통과 못해도 넘어가기도 하고, 테스트를 이상하게 줄여서 넘어가기도함 - 프롬프트로 제한하기
  4. docs, readme 작성 요청하면 좋을 듯
  5. Phase 및 tasks 단위 체크리스트 모두 체크하도록 하기
  6. TBU 구체적으로 더 요청하면 좋을 내용
6. 모든 Phase의 구현이 완료된 이후에는 docs/ 아래 브랜치명으로 구현 내용 문서 작성
7. 완료된 구현을 바탕으로 기존 구현된 내용 수정
8. 완료된 구현을 바탕으로 다음 task에 수정 필요한 것 수정 & 구제화
9. 커밋
10. 사용자 확인, 마스터머지: 요건 사용자가 해야할 듯

- Python 버전과 라이브러리 의존성
  - Python 버전 다양성 최소화, 가능하면 단일화
  - Python 의존성은 uv로 관리 명시 speckit 프로젝트 내에서 관리(constitution)

브랜치 안/밖에서 할 일이 따로 있네

### /checklist 사용해서 시킬 일 정리

1. Before implement
  - phase-{phase}-{description} 브랜치로 포크
  - 직전 Phase의 specs 파일 새 phase명에 맞춰 복사
2. After implement
  - phase 별로 docs작성
  - 새로운 아키텍처 구성요소가 추가되는 경우 Readme 추가
  - 새로운 애플리케이션 추가되는 경우 Readme 추가
  - 완료된 구현 내용에 맞춰 기존 구현사항 중 수정할 내용이 있는지 검토
  - 완료된 구현 내용에 맞춰 다음 tasks 구체화
  - 커밋

---

TODO later
1. script/evaluate_positions.py 실행부분 따로 떼기
2. src/data_collection 안에 collectors/continuous_collector.py 실행하는 app 생성
3. src/features 안에 inference_assembler.py, training_assembler.py 합치기

...