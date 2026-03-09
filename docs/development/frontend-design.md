---
title: Frontend Design
parent: 개발
nav_order: 44
description: "Claude Code의 Frontend Design 스킬로 프로덕션급 웹 UI를 즉시 생성하는 방법과 실전 활용 사례를 소개합니다."
---

# Frontend Design 스킬 — AI로 만드는 고품질 웹 인터페이스
{:.no_toc}

Claude Code의 공식 플러그인 중 하나인 Frontend Design 스킬은 단일 HTML 파일부터 React 컴포넌트까지, **프로덕션 수준의 웹 UI를 대화만으로 생성**합니다.

### Link

- [Claude Code 공식 플러그인](https://github.com/anthropics/claude-code-plugins)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 개요

Frontend Design 스킬은 `/frontend-design` 명령으로 호출하며, 사용자가 원하는 웹 인터페이스를 설명하면 **실제 작동하는 코드**를 생성합니다. 핵심 차별점은 "AI가 만든 티가 나는" 범용적 디자인을 의도적으로 배제하고, 맥락에 맞는 독창적 미학을 추구한다는 점입니다.

### 지원 출력 형식

| 형식 | 설명 | 적합한 상황 |
|------|------|------------|
| **단일 HTML** | HTML/CSS/JS가 하나의 파일에 포함 | 빠른 프로토타입, 랜딩 페이지 |
| **React** | JSX 컴포넌트 + CSS-in-JS 또는 모듈 CSS | 기존 React 프로젝트에 통합 |
| **Vue** | SFC(Single File Component) | Vue 프로젝트에 통합 |
| **HTML + 외부 CSS/JS** | 파일 분리 구조 | 정적 사이트, 다중 페이지 |

---

## 주요 기능

### 1. 디자인 시스템 자동 구성

스킬은 코드 생성 전에 다음 요소를 내부적으로 결정합니다:

- **톤 선택**: 브루탈리즘, 미니멀, 레트로-퓨처리즘, 럭셔리, 에디토리얼 등 극단적 방향 중 택 1
- **타이포그래피 페어링**: Google Fonts에서 디스플레이 폰트 + 본문 폰트 조합 선정
- **컬러 팔레트**: CSS 변수 기반의 일관된 색상 체계

```css
/* 자동 생성되는 CSS 변수 예시 */
:root {
  --color-bg: #0a0a0f;
  --color-surface: #14141f;
  --color-accent: #ff6b35;
  --color-text: #e8e6e3;
  --font-display: 'Playfair Display', serif;
  --font-body: 'Source Sans 3', sans-serif;
}
```

### 2. 모션 & 인터랙션

정적 페이지가 아닌, **동적 요소가 기본 포함**됩니다:

- **페이지 로드 애니메이션**: 요소별 시차(stagger)를 둔 순차 등장
- **스크롤 트리거**: `IntersectionObserver` 기반 스크롤 반응 효과
- **호버 상태**: 마우스오버 시 미세한 변환(transform, scale, color shift)
- **CSS-only 우선**: JavaScript 없이 가능한 효과는 CSS로 처리

### 3. 레이아웃 & 공간 구성

일반적인 좌우 대칭, 상하 나열 구조를 벗어나는 구성을 지향합니다:

- **비대칭 그리드**: CSS Grid의 `grid-template-areas`를 활용한 불균형 배치
- **오버랩**: `position: absolute`와 `z-index`로 요소 겹침 효과
- **네거티브 스페이스**: 의도적 여백으로 시선 유도
- **대각선 흐름**: `clip-path`나 `transform: skew()`로 직선적 레이아웃 탈피

### 4. 배경 & 텍스처

단색 배경 대신 분위기를 형성하는 시각적 레이어가 추가됩니다:

```css
/* 그래디언트 메쉬 배경 예시 */
.hero {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(255,107,53,0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.1) 0%, transparent 50%),
    var(--color-bg);
}

/* 노이즈 텍스처 오버레이 */
.noise-overlay::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,...");
  opacity: 0.03;
  pointer-events: none;
}
```

---

## 사용 방법

### 기본 호출

```
/frontend-design 트레이딩 대시보드 랜딩 페이지 만들어줘
```

### 구체적 요청

더 정확한 결과를 위해 다음 요소를 포함하면 좋습니다:

| 요소 | 예시 |
|------|------|
| **목적** | "사용자 회원가입을 유도하는 랜딩 페이지" |
| **대상** | "개발자 대상", "투자자 대상" |
| **분위기** | "다크 테마에 미니멀한 느낌", "레트로 아케이드 스타일" |
| **기술 제약** | "React 컴포넌트로", "단일 HTML로" |
| **참고** | "Apple 웹사이트 느낌으로", "Bloomberg 터미널 스타일" |

---

## 실전 활용 사례

### 사례 1: 프로젝트 포트폴리오 페이지

```
/frontend-design 개인 프로젝트 포트폴리오 페이지.
다크 테마, 프로젝트 카드 3-4개 배치, 각 카드에 호버 효과.
에디토리얼/매거진 느낌으로.
```

**결과물 특징**:
- 세리프 디스플레이 폰트로 매거진 표지 같은 타이틀
- 카드 호버 시 미세한 3D tilt 효과
- 스크롤 시 카드가 순차적으로 fade-in

### 사례 2: SaaS 랜딩 페이지

```
/frontend-design AI 분석 도구 SaaS 랜딩 페이지.
히어로 섹션 + 기능 소개 3개 + CTA 버튼.
럭셔리/프리미엄 느낌, 라이트 테마.
```

**결과물 특징**:
- 크림색 배경에 금색 악센트
- 히어로 텍스트에 그래디언트 클리핑
- CTA 버튼에 미세한 pulse 애니메이션

### 사례 3: 데이터 대시보드 컴포넌트

```
/frontend-design 실시간 암호화폐 가격 카드 컴포넌트.
React로 작성. 가격 변동률, 미니 차트, 24h 거래량 표시.
Bloomberg 터미널 같은 인더스트리얼 느낌.
```

**결과물 특징**:
- 모노스페이스 폰트로 데이터 밀도 높은 레이아웃
- 가격 변동 시 색상 전환 애니메이션
- CSS Grid 기반 밀집 배치

### 사례 4: 이벤트/컨퍼런스 초대 페이지

```
/frontend-design 개발자 밋업 이벤트 초대 페이지.
날짜, 장소, 연사 정보, 참가 신청 버튼 포함.
레트로-퓨처리즘 스타일, 네온 컬러.
```

**결과물 특징**:
- 어두운 배경에 네온 글로우 효과
- 카운트다운 타이머 CSS 애니메이션
- 연사 카드에 글리치(glitch) 호버 효과

---

## AI Slop을 피하는 원칙

이 스킬이 특별히 경계하는 "AI가 만든 티가 나는" 패턴들:

| 지양 요소 | 대안 |
|----------|------|
| Inter, Roboto, Arial 등 범용 폰트 | Playfair Display, DM Serif, Outfit 등 개성 있는 폰트 |
| 보라색 그래디언트 + 흰 배경 | 맥락에 맞는 독자적 컬러 팔레트 |
| 균등 배분된 3-column 카드 | 비대칭 그리드, 오버랩, 다이내믹 레이아웃 |
| 둥근 모서리 + 그림자만의 카드 | 보더, 텍스처, 패턴 등 다양한 표면 처리 |
| 아이콘 + 제목 + 설명 반복 | 계층 구조와 시각적 리듬의 변주 |

핵심은 **의도적 선택(intentionality)**입니다. 미니멀이든 맥시멀이든, 명확한 미학적 방향이 있어야 합니다.

---

## 생성 파일 활용법

생성된 HTML 파일은 바로 브라우저에서 확인 가능합니다:

```bash
# macOS에서 브라우저로 바로 열기
open output.html

# 또는 로컬 서버로 실행
python -m http.server 8080
# → http://localhost:8080/output.html
```

React 컴포넌트인 경우 기존 프로젝트에 복사하여 사용하거나, 별도 Vite 프로젝트에서 확인합니다:

```bash
npm create vite@latest preview -- --template react
cd preview
# 생성된 컴포넌트 파일을 src/에 복사
npm install && npm run dev
```

---

## 정리

| 항목 | 내용 |
|------|------|
| **호출** | `/frontend-design {요청 내용}` |
| **출력** | HTML, React, Vue 등 실제 작동 코드 |
| **강점** | 독창적 디자인, 모션/인터랙션 기본 포함 |
| **적합** | 랜딩 페이지, 포트폴리오, 대시보드, 이벤트 페이지, 컴포넌트 |
| **부적합** | 복잡한 상태 관리가 필요한 full SPA, 백엔드 연동 |

프론트엔드 디자인 감각이 부족하거나, 빠르게 프로토타입을 만들어야 할 때 유용합니다. 구체적으로 분위기와 맥락을 설명할수록 더 정확한 결과를 얻을 수 있습니다.
