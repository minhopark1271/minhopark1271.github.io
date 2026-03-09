---
title: Marketing Skills
parent: 개발
nav_order: 47
description: "AI 코딩 에이전트용 마케팅 스킬 모음 marketingskills의 주요 기능, 35개 스킬 카테고리, 설치 및 활용법을 소개합니다."
---

# Marketing Skills — AI 에이전트용 마케팅 자동화 스킬
{:.no_toc}

AI 코딩 에이전트(Claude Code, Cursor, Windsurf 등)에 **마케팅 전문 지식과 워크플로우**를 추가하는 오픈소스 스킬 모음입니다. 자연어 요청만으로 랜딩페이지 최적화, 이메일 시퀀스 설계, SEO 진단 등 실무 마케팅 작업을 수행할 수 있습니다.

### Link

- [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) — GitHub 저장소
- [Coding for Marketers](https://codingformarketers.com/) — 마케터를 위한 코딩 가이드 (제작자 제공)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 개요

Corey Haines가 제작한 이 프로젝트는 마케팅 업무를 **마크다운 기반 스킬 파일**로 정의합니다. 각 스킬은 특정 마케팅 작업에 대한 프레임워크, 체크리스트, 베스트 프랙티스를 포함하며, AI 에이전트가 이를 참조하여 작업을 수행합니다.

**핵심 특징:**
- **35개 스킬**: 전환 최적화부터 가격 전략까지 마케팅 전 영역 커버
- **상호 연결 구조**: `product-marketing-context`가 기반 스킬로 작동하여 제품·타겟·포지셔닝 맥락 공유
- **멀티 에이전트 지원**: Claude Code, Cursor, Windsurf 등 Agent Skills 규격을 지원하는 모든 에이전트에서 사용 가능
- **모듈식 설치**: 전체 또는 필요한 스킬만 선택 설치

---

## 스킬 카테고리 (35개)

### 전환 최적화 (Conversion Optimization)

| 스킬 | 용도 |
|------|------|
| `page-cro` | 마케팅 페이지 전환율 최적화 |
| `signup-flow-cro` | 회원가입 흐름 최적화 |
| `onboarding-cro` | 온보딩 및 Time-to-Value 최적화 |
| `form-cro` | 리드 캡처 폼 최적화 |
| `popup-cro` | 모달, 오버레이, 배너 최적화 |
| `paywall-upgrade-cro` | 인앱 페이월 및 피처 게이트 최적화 |

### 콘텐츠 & 카피

| 스킬 | 용도 |
|------|------|
| `copywriting` | 마케팅 카피 작성 및 리라이트 |
| `copy-editing` | 기존 카피 편집·개선 |
| `cold-email` | B2B 콜드 이메일 및 시퀀스 |
| `email-sequence` | 자동화 이메일 플로우·드립 캠페인 |
| `social-content` | SNS 콘텐츠 기획·작성 |

### SEO & 검색 최적화

| 스킬 | 용도 |
|------|------|
| `seo-audit` | 기술 SEO 및 온페이지 진단 |
| `ai-seo` | AI 검색 최적화 (AEO, GEO, LLMO) |
| `programmatic-seo` | 대규모 SEO 페이지 자동 생성 |
| `site-architecture` | 사이트 구조·네비게이션 설계 |
| `competitor-alternatives` | 경쟁사 비교 페이지 작성 |
| `schema-markup` | 구조화 데이터(JSON-LD) 구현 |

### 광고 & 배포

| 스킬 | 용도 |
|------|------|
| `paid-ads` | Google, Meta, LinkedIn 광고 캠페인 관리 |
| `ad-creative` | 광고 소재 대량 생성·반복 테스트 |

### 분석 & 테스트

| 스킬 | 용도 |
|------|------|
| `analytics-tracking` | 이벤트 트래킹·측정 설정 (GA4 등) |
| `ab-test-setup` | A/B 테스트 설계·계획 |

### 전략 & 가격

| 스킬 | 용도 |
|------|------|
| `marketing-ideas` | 140가지 SaaS 마케팅 전략 아이디어 |
| `marketing-psychology` | 심리학 원리 기반 마케팅 프레임워크 |
| `launch-strategy` | 제품 런칭·공지 계획 수립 |
| `pricing-strategy` | 가격·패키징·수익화 전략 |

### 리텐션 & 그로스

| 스킬 | 용도 |
|------|------|
| `churn-prevention` | 이탈 방지 플로우, 할인 오퍼, 결제 복구 |
| `free-tool-strategy` | 무료 마케팅 도구·계산기 전략 |
| `referral-program` | 리퍼럴·제휴 프로그램 설계 |

### 세일즈 & RevOps

| 스킬 | 용도 |
|------|------|
| `revops` | 리드 라이프사이클·세일즈 핸드오프 |
| `sales-enablement` | 세일즈 자료·반론 처리 문서 작성 |
| `content-strategy` | 콘텐츠 기획·토픽 전략 |

---

## 설치 방법

### CLI 설치 (권장)

```bash
# 전체 스킬 설치
npx skills add coreyhaines31/marketingskills

# 특정 스킬만 설치
npx skills add coreyhaines31/marketingskills --skill page-cro copywriting seo-audit

# 사용 가능한 스킬 목록 확인
npx skills add coreyhaines31/marketingskills --list
```

`.agents/skills/` 디렉토리에 설치되며, `.claude/skills/`로 심볼릭 링크가 생성됩니다.

### Claude Code 플러그인

```
/plugin marketplace add coreyhaines31/marketingskills
/plugin install marketing-skills
```

### Git Submodule

```bash
git submodule add https://github.com/coreyhaines31/marketingskills.git .agents/marketingskills
```

프로젝트에 직접 포함시켜 버전 관리가 가능합니다.

---

## 사용법

### 자연어 요청

스킬이 설치되면 에이전트에게 자연어로 마케팅 작업을 요청할 수 있습니다. 에이전트가 요청 의도를 파악하여 적절한 스킬을 자동으로 트리거합니다.

```
"이 랜딩페이지 전환율 최적화해줘"          → page-cro
"SaaS 홈페이지 카피 작성해줘"             → copywriting
"GA4 회원가입 이벤트 트래킹 설정해줘"      → analytics-tracking
"5단계 웰컴 이메일 시퀀스 만들어줘"        → email-sequence
"경쟁사 비교 페이지 만들어줘"              → competitor-alternatives
"사이트 SEO 감사 실행해줘"               → seo-audit
```

### 슬래시 커맨드

```
/page-cro          # 페이지 전환 최적화
/email-sequence    # 이메일 시퀀스 설계
/seo-audit         # SEO 진단
/pricing-strategy  # 가격 전략 수립
```

---

## 스킬 구조

각 스킬은 마크다운 파일로 구성되며, 다음과 같은 구조를 가집니다:

```
skills/
├── product-marketing-context.md    # 기반 스킬 (모든 스킬이 참조)
├── page-cro.md                     # 개별 스킬 파일
├── copywriting.md
├── seo-audit.md
└── ...
```

**`product-marketing-context`**는 모든 스킬의 기반이 되는 핵심 문서입니다. 제품 정보, 타겟 고객, 포지셔닝 전략을 정의하면 나머지 스킬들이 이 맥락을 참조하여 일관된 마케팅 메시지를 생성합니다.

---

## 활용 시나리오

### SaaS 런칭 준비

1. `product-marketing-context`에 제품 정보 작성
2. `/launch-strategy`로 런칭 계획 수립
3. `/copywriting`으로 랜딩페이지 카피 작성
4. `/email-sequence`로 런칭 알림 이메일 시퀀스 설계
5. `/paid-ads`로 런칭 광고 캠페인 기획

### 전환율 개선 프로젝트

1. `/page-cro`로 현재 페이지 진단
2. `/ab-test-setup`으로 테스트 설계
3. `/analytics-tracking`으로 측정 환경 구축
4. 결과 분석 후 `/signup-flow-cro`로 후속 최적화

### SEO 강화

1. `/seo-audit`으로 현황 진단
2. `/site-architecture`로 사이트 구조 개선
3. `/programmatic-seo`로 대량 페이지 생성
4. `/schema-markup`으로 구조화 데이터 추가

---

## 요약

| 항목 | 내용 |
|------|------|
| **스킬 수** | 35개 |
| **주요 영역** | CRO, 콘텐츠, SEO, 광고, 분석, 전략, 세일즈 |
| **지원 에이전트** | Claude Code, Cursor, Windsurf 등 |
| **설치** | `npx skills add` / 플러그인 / submodule |
| **라이선스** | MIT |

코딩 에이전트를 활용하는 SaaS 창업자, 그로스 마케터, 1인 개발자에게 특히 유용합니다. 마케팅 전문가를 고용하기 어려운 초기 스타트업이 AI 에이전트에 마케팅 역량을 부여하는 실용적인 방법입니다.
