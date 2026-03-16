---
title: /insights
parent: 개발
nav_order: 57
description: "Claude Code의 /insights 명령어로 세션 사용 패턴을 분석하고, 마찰 지점과 워크플로우 개선점을 자동으로 도출하는 방법을 설명합니다."
---

# Claude Code /insights 사용법
{:.no_toc}

Claude Code에 내장된 `/insights` 명령어로 내 코딩 습관을 분석하고, 워크플로우를 개선하는 방법을 정리합니다.

### Link

- [Deep Dive: How Claude Code's /insights Command Works](https://www.zolkos.com/2026/02/04/deep-dive-how-claude-codes-insights-command-works.html)
- [/insights: The Command That Analyzes How You Code with Claude](https://angelo-lima.fr/en/claude-code-insights-command/)
- [Claude Code /insights - Your Personal AI Coding Report](https://sonim1.com/en/blog/claude-code-insights/)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## /insights란?

2026년 2월 Anthropic이 추가한 Claude Code 내장 명령어입니다. 최근 30일간의 세션 로그를 분석하여 **사용 패턴, 마찰 지점, 개선 제안**을 담은 인터랙티브 HTML 리포트를 생성합니다.

핵심 특징:

- **로컬 데이터만 사용** — 소스 코드가 외부로 전송되지 않음
- **분석 모델은 Haiku** — 비용 효율적이고 빠른 추론
- **캐싱 지원** — 이전 분석 결과를 캐싱하여 새 세션만 추가 분석
- **별도 설정 불필요** — `/insights` 입력만으로 실행

```bash
# Claude Code 터미널에서 실행
/insights

# 리포트 생성 경로
~/.claude/usage-data/report.html
```

---

## 분석 파이프라인

`/insights`는 6단계 파이프라인으로 세션 데이터를 처리합니다.

### Stage 1: 세션 필터링 & 메타데이터 추출

분석 대상에서 제외되는 세션:
- 에이전트 서브세션
- 사용자 메시지 2개 미만
- 1분 미만의 짧은 세션

추출되는 메타데이터: 세션 ID, 타임스탬프, 소요 시간, 토큰 사용량, 도구 사용 빈도, 프로그래밍 언어, Git 활동, 코드 변경량 등.

### Stage 2: 트랜스크립트 요약

30,000자를 초과하는 긴 트랜스크립트는 25,000자 단위로 청킹한 뒤, 각 청크를 독립적으로 요약합니다. 사용자 요청, Claude 동작, 마찰 지점, 결과를 중심으로 압축합니다.

### Stage 3: Facet 추출 (핵심 단계)

**Facet**은 각 세션에 대한 구조화된 정성 평가입니다. 실행당 최대 50개의 새 세션을 Haiku 모델(max 4096 tokens)로 분석하여 추출합니다.

| Facet 카테고리 | 예시 값 |
|-------------|---------|
| **목표(Goal)** | 기능 구현, 버그 수정, 리팩토링, PR 생성, 코드베이스 이해 |
| **마찰(Friction)** | 요청 오해, 잘못된 접근, 사용자 거부, 과도한 변경 |
| **만족도(Satisfaction)** | frustrated → dissatisfied → likely satisfied → satisfied → happy |
| **세션 유형** | 단일 작업, 다중 작업, 반복 개선, 탐색, 빠른 질문 |

캐싱: `~/.claude/usage-data/facets/<session-id>.json`에 저장되어, 다음 실행 시 재처리 없이 새 세션만 분석합니다.

### Stage 4: 집계 분석

8개의 전문 분석 프롬프트(각 8192 tokens)가 집계된 통계를 처리합니다. 세션 수, 메시지 총계, 소요 시간, 도구 사용 분포, 목표 분포, 결과 패턴 등을 종합 분석합니다.

### Stage 5: 요약 생성

최종 LLM 호출로 4파트 구조의 "At a Glance" 요약을 생성합니다:
1. **What's working** — 효과적인 워크플로우
2. **What's hindering** — 반복되는 마찰 지점
3. **Quick wins** — 즉시 적용 가능한 개선점
4. **Ambitious workflows** — 장기적 워크플로우 개선 방향

### Stage 6: HTML 리포트 렌더링

모든 분석 결과를 인터랙티브 HTML 리포트로 렌더링합니다.

---

## 리포트 구성

생성되는 HTML 리포트는 다음 섹션으로 구성됩니다.

### 통계 대시보드

| 지표 | 설명 |
|------|------|
| 세션 수 | 분석 기간 내 총/분석 완료 세션 |
| 메시지 수 | 사용자 + Claude 메시지 총합 |
| 총 소요 시간 | 누적 작업 시간 |
| 커밋 수 | Git 커밋 횟수 |
| 활동 일수 | Claude Code를 사용한 날 수 |

### 인터랙티브 시각화

- **일별 활동 차트** — 타임존 선택 지원
- **도구 사용 분포** — Read, Edit, Bash, Grep 등의 비율
- **프로그래밍 언어 비중** — 주로 사용한 언어
- **세션 유형 분류** — 단일 작업, 반복 개선, 탐색 등

### 프로젝트 영역 분석

프로젝트별로 세션 수와 작업 내용을 요약합니다. 예시:

> **Blog Content Creation & Publishing** (35 sessions)
> "블로그 포스트 작성, 웹 조사, Git 서브모듈 커밋/푸시 워크플로우 처리..."

### 인터랙션 스타일 분석

사용자의 코딩 스타일을 2인칭 내러티브로 묘사합니다. 도구 사용 빈도, 세션 길이, 인터럽트 패턴 등을 종합하여 프로파일링합니다.

### 마찰 분석 (Friction Analysis)

구체적인 예시와 함께 마찰 유형을 분류합니다:

- **부족한 초기 지시** — 중간에 요구사항을 추가하며 재시작
- **반복 실패 패턴** — 같은 유형의 오류가 세션마다 반복
- **외부 시스템 충돌** — Git 서브모듈, GitHub Pages 등의 비직관적 동작

### CLAUDE.md 제안 (가장 실용적)

반복적으로 내리는 지시를 `CLAUDE.md`에 규칙으로 코드화하는 제안입니다. **복사-붙여넣기 형식**으로 제공됩니다.

예시:
> "Jekyll 마크다운에서 달러 기호를 이스케이프할 때 `<span>$</span>`을 사용하세요. `\$`나 `&#36;`은 효과가 없습니다."

### 기능 추천

사용 패턴에 기반하여 활용하지 않은 Claude Code 기능을 추천합니다:

- **Custom Skills** — 반복 작업을 `/command`로 자동화
- **Hooks** — 이벤트 기반 자동 검증 (커밋 전 프론트매터 검사 등)
- **Headless Mode** — 비대화형 배치 실행
- **MCP Servers** — 외부 도구 연동

### On the Horizon

미래 워크플로우 개선 시나리오를 제시합니다. 병렬 에이전트 활용, 엔드투엔드 파이프라인 자동화 등의 가능성을 탐색합니다.

---

## 활용 팁

### 실행 주기

- **2~3주에 1회** 정기 실행 권장
- 마일스톤 완료 후, 또는 마찰이 많았던 기간 이후 실행
- 월간 비교로 개선 추이 확인

### 실행 후 워크플로우

```
1. 마찰 분석(Friction Analysis) 먼저 확인
2. CLAUDE.md 제안 중 유용한 규칙 복사 → CLAUDE.md에 추가
3. 추천 기능 중 1개 선택하여 시험 적용
4. 다음 실행 시 개선 여부 비교
```

### 주의사항

- 분석 대상은 **최근 30일**, 실행당 **최대 50개 새 세션**
- 이전 분석 결과는 캐싱되므로 반복 실행 비용이 낮음
- 세션 로그는 `~/.claude/projects/` 하위에 로컬 저장
- Facet 캐시는 `~/.claude/usage-data/facets/`에 저장

---

## 실제 리포트 예시

129개 세션(3주간)을 분석한 리포트의 주요 결과:

**통계 요약:**
> 265 sessions total · 129 analyzed · 1,187 messages · 332h · 199 commits

**인터랙션 스타일:**
> "Prolific content creator who uses Claude Code primarily as a blog publishing pipeline... hands-on and interruptive interaction style with active steering..."

**마찰 분석 결과:**

| 유형 | 설명 |
|------|------|
| 불충분한 초기 지시 | 카테고리 미지정으로 2회 재시작 |
| 텍스트 이스케이프 반복 실패 | `$` 이스케이프에 3가지 접근 시도 후 해결 |
| Git 서브모듈 복잡성 | 서브모듈 구조로 커밋/푸시 다회 시도 |

**CLAUDE.md 제안:**
- 블로그 작성 후 자동 커밋/푸시 규칙 추가
- `<span>$</span>` 이스케이프 규칙 문서화
- Git 서브모듈 워크플로우 순서 명시

---

## 요약

| 항목 | 내용 |
|------|------|
| **명령어** | `/insights` |
| **분석 범위** | 최근 30일, 실행당 최대 50개 새 세션 |
| **분석 모델** | Haiku (비용 효율적) |
| **리포트 경로** | `~/.claude/usage-data/report.html` |
| **데이터 전송** | 없음 (로컬 데이터만 사용) |
| **권장 주기** | 2~3주에 1회 |
| **핵심 가치** | CLAUDE.md 규칙 자동 제안, 마찰 지점 식별, 워크플로우 개선 |
