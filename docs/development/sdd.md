---
title: SDD (Spec Kit)
parent: 개발
nav_order: 3
---

# SDD(Spec Driven Development)
{:.no_toc}

[Spec Kit - GitHub](https://github.com/github/spec-kit)

[SDD with AI - GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)

[Spec Kit Comprehensive Guide](https://github.com/github/spec-kit/blob/main/spec-driven.md)

[Video Overview](https://www.youtube.com/watch?v=a9eR1xsfvHg)

[VS Code & GitHub Copilot: Spec-Driven Development](youtube.com/watch?v=DTw9X7MtU5s&utm_source=pytorchkr&ref=pytorchkr)


## 목차
{:.no_toc}

1. TOC
{:toc}

--- 

## Spec kit 탐구

### 1. 설치

```
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

--- 

### 2. 프로젝트 초기화

```
specify init <PROJECT_NAME>
```

결과로 생성되는 폴더 및 파일 목록

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

가용한 툴 확인

```
specify check
```

--- 

### 3. Constitution 작성

- 초안 작성

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

- 수정 및 정제

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

### 4. 커서로 project principles 작성

```
/speckit.constitution Create principles focused on code quality, testing standards, user experience consistency, and performance requirements
```

### 5. 커서로 스펙 작성

What and Why 에 집중해서 기능적 스펙 작성

```
/speckit.specify Build an application that can help me organize my photos in separate photo albums. Albums are grouped by date and can be re-organized by dragging and dropping on the main page. Albums are never in other nested albums. Within each album, photos are previewed in a tile-like interface.
```

### 6. 커서로 technical implementation plan 작성

Tech Stack and Architecture 명시

```
/speckit.plan The application uses Vite with minimal number of libraries. Use vanilla HTML, CSS, and JavaScript as much as possible. Images are not uploaded anywhere and metadata is stored in a local SQLite database.
```

### 7. 커서로 작업을 task 단위로 나누기

```
/speckit.tasks
```

### 8. 구현

```
/speckit.implement
```
