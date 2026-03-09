---
title: UI UX Pro Max
parent: 개발
nav_order: 45
description: "UI UX Pro Max 스킬의 디자인 시스템 자동 생성, 100개 산업별 추론 규칙, 13개 기술 스택 지원 등 핵심 기능과 활용법을 소개합니다."
---

# UI UX Pro Max — AI 디자인 추론 엔진
{:.no_toc}

프로젝트 요구사항을 분석해 **산업별 맞춤 디자인 시스템을 자동 생성**하는 AI 스킬입니다. 67개 UI 스타일, 96개 컬러 팔레트, 100개 산업별 추론 규칙을 기반으로 동작합니다.

### Link

- [GitHub - ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 개요

UI UX Pro Max는 단순히 UI 코드를 생성하는 것이 아니라, **추론 엔진(Reasoning Engine)**을 통해 프로젝트 맥락에 맞는 디자인 의사결정을 자동화합니다.

예를 들어 "뷰티 스파 랜딩 페이지"를 요청하면:
- Hero-Centric + Social Proof 패턴 추천
- Soft UI Evolution 스타일 적용
- 차분한 톤의 컬러 팔레트 선정
- 네온 컬러, 거친 애니메이션 등 **안티패턴 자동 배제**

이 모든 판단이 BM25 랭킹 알고리즘과 JSON 기반 조건부 규칙으로 처리됩니다.

---

## 콘텐츠 라이브러리

스킬에 내장된 디자인 리소스 규모:

| 영역 | 수량 | 예시 |
|------|------|------|
| **UI 스타일** | 67개 | Glassmorphism, Claymorphism, Brutalism, Neumorphism, Bento Grid, AI-Native UI 등 |
| **컬러 팔레트** | 96개 | SaaS, E-commerce, Healthcare, Fintech, Beauty 등 산업별 분류 |
| **폰트 페어링** | 57개 | Google Fonts import 코드 포함 |
| **차트 타입** | 25개 | 대시보드용 시각화 유형 |
| **UX 가이드라인** | 99개 | 접근성, 모범 사례 포함 |
| **산업별 추론 규칙** | 100개 | Tech, Finance, Healthcare, E-commerce, Creative 등 7개 섹터 |

---

## 디자인 시스템 생성 파이프라인

핵심 동작 방식은 **5개 도메인 병렬 검색 → 추론 엔진 처리 → 디자인 시스템 출력**입니다.

```
사용자 요청
    ↓
┌─────────────────────────────────────┐
│  5개 도메인 병렬 검색               │
│  1. Product Type (100개 카테고리)   │
│  2. Style (67개 스타일)             │
│  3. Color Palette (96개 팔레트)     │
│  4. Landing Page Pattern (24개)     │
│  5. Typography (57개 폰트 조합)     │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  추론 엔진 (Reasoning Engine)       │
│  - BM25 랭킹으로 스타일 우선순위    │
│  - 산업별 안티패턴 필터링            │
│  - JSON 조건부 규칙 처리            │
└─────────────────────────────────────┘
    ↓
디자인 시스템 출력
(패턴, 스타일, 색상, 타이포, 효과, 체크리스트)
```

### 출력 결과물

생성된 디자인 시스템에는 다음이 포함됩니다:

- **추천 패턴**: 페이지 구조 및 레이아웃 전략
- **스타일**: 적합한 UI 스타일과 적용 방법
- **컬러**: 산업 맥락에 맞는 팔레트
- **타이포그래피**: 디스플레이 + 본문 폰트 조합
- **효과**: 애니메이션, 인터랙션 가이드
- **안티패턴**: 해당 맥락에서 피해야 할 요소
- **체크리스트**: 접근성, 반응형 등 배포 전 검증 항목

---

## 지원 기술 스택

13개 프레임워크/플랫폼에 대해 **스택별 맞춤 가이드라인**을 제공합니다:

| 플랫폼 | 스택 |
|--------|------|
| **웹** | React, Next.js, Vue, Nuxt.js, Nuxt UI, Svelte, Astro, HTML+Tailwind, shadcn/ui |
| **모바일** | React Native, Flutter, SwiftUI, Jetpack Compose |

동일한 요청이라도 React와 SwiftUI에서는 다른 코드와 가이드라인이 생성됩니다.

---

## 설치 방법

### Claude Code (Marketplace)

```bash
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

### CLI 설치 (권장)

```bash
npm install -g uipro-cli
cd /path/to/your/project
uipro init --ai claude    # Claude Code용
uipro init --ai cursor    # Cursor용
uipro init --ai all       # 모든 AI 어시스턴트용
```

**지원 AI 도구**: Claude Code, Cursor, Windsurf, GitHub Copilot, Kiro, Codex, Gemini CLI, Roo Code 등 14개 플랫폼

---

## 사용 방법

### 자연어 요청 (Skill 모드)

설치 후 별도 명령 없이 자연어로 요청하면 자동 활성화됩니다:

```
"SaaS 제품 랜딩 페이지 만들어줘"
"헬스케어 분석 대시보드 디자인해줘"
"핀테크 앱 온보딩 화면 구성해줘"
```

### 디자인 시스템 직접 생성

Python 스크립트로 디자인 시스템을 직접 조회하거나 저장할 수 있습니다:

```bash
# 산업별 디자인 시스템 생성
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "beauty spa" --design-system

# 특정 도메인 검색
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "glassmorphism" --domain style

# 스택별 가이드라인 조회
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "form validation" --stack react
```

### 검색 파라미터

| 옵션 | 설명 |
|------|------|
| `--domain` | style, typography, chart, pattern, product type 중 필터링 |
| `--stack` | react, html-tailwind, vue, swiftui 등 스택별 가이드라인 |
| `--design-system` | 전체 디자인 시스템 생성 |
| `--persist` | `design-system/` 폴더에 저장 |
| `--page` | 페이지별 오버라이드 파일 생성 |
| `--offline` | 번들된 에셋만 사용 (GitHub 다운로드 없이) |

---

## 디자인 시스템 영속성

생성된 디자인 시스템은 계층적 구조로 저장되어 세션 간 일관성을 유지합니다:

```
design-system/
├── MASTER.md          # 글로벌 디자인 원칙 (source of truth)
└── pages/
    ├── dashboard.md   # 대시보드 페이지 오버라이드
    └── landing.md     # 랜딩 페이지 오버라이드
```

```bash
# 디자인 시스템 생성 + 저장
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" \
  --design-system --persist

# 페이지별 오버라이드 추가
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "settings page" \
  --design-system --persist --page settings
```

`MASTER.md`가 전역 기준이 되고, 개별 페이지 파일이 필요에 따라 오버라이드하는 구조입니다.

---

## Frontend Design 스킬과 비교

두 스킬은 접근 방식이 다릅니다:

| 항목 | Frontend Design | UI UX Pro Max |
|------|----------------|---------------|
| **초점** | 즉석 코드 생성 | 디자인 시스템 추론 + 코드 생성 |
| **의사결정** | AI가 자유롭게 미학적 판단 | 100개 산업별 규칙 기반 판단 |
| **안티패턴** | "AI slop" 회피 원칙 | 산업별 명시적 안티패턴 목록 |
| **출력** | 완성된 HTML/React/Vue 코드 | 디자인 시스템 문서 + 코드 |
| **영속성** | 단발성 생성 | `design-system/` 폴더로 세션 간 유지 |
| **스택 지원** | 웹 중심 (HTML, React, Vue) | 웹 + 모바일 13개 스택 |
| **적합 상황** | 빠른 프로토타입, 단일 페이지 | 다중 페이지 프로젝트, 일관된 디자인 체계 필요 시 |

단일 페이지를 빠르게 만들 때는 Frontend Design, 프로젝트 전체의 디자인 체계를 수립할 때는 UI UX Pro Max가 적합합니다. 두 스킬을 함께 사용하는 것도 가능합니다 — UI UX Pro Max로 디자인 시스템을 확립한 후, Frontend Design으로 개별 페이지를 구현하는 방식입니다.

---

## 정리

| 항목 | 내용 |
|------|------|
| **핵심** | 산업별 추론 규칙 기반 디자인 시스템 자동 생성 |
| **라이브러리** | 67 스타일 + 96 팔레트 + 57 폰트 + 100 규칙 |
| **스택** | 13개 (React, Vue, SwiftUI, Flutter 등) |
| **설치** | Claude Code Marketplace 또는 `uipro-cli` |
| **강점** | 산업 맥락 반영, 안티패턴 배제, 디자인 영속성 |
| **전제 조건** | Python 3.x (검색/생성 스크립트용) |
