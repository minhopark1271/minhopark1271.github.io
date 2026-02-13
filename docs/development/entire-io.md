---
title: "Entire"
parent: 개발
nav_order: 36
description: "전 GitHub CEO가 창업한 Entire.io의 AI 에이전트 컨텍스트 버전 관리 플랫폼 소개. Checkpoints, Claude Code 연동, 세션 되감기 등 핵심 기능을 정리합니다."
---

# Entire.io: AI 에이전트 시대의 Git 워크플로
{:.no_toc}

AI 코딩 에이전트가 만든 코드의 "이유(why)"까지 버전 관리하겠다는 새로운 개발자 플랫폼.

### Link

- [Entire 공식 사이트](https://entire.io)
- [Entire Docs - Introduction](https://docs.entire.io)
- [TechCrunch 보도 (2026-02-10)](https://techcrunch.com/2026/02/10/former-github-ceo-thomas-dohmke-launches-entire/)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 배경: 왜 이게 필요한가

AI 코딩 에이전트(Claude Code, Codex, Gemini CLI 등)가 일상 개발 도구가 되면서 새로운 문제가 생겼다. Git은 **코드 변경(what)**은 추적하지만, 에이전트가 그 코드를 만들 때 사용한 **프롬프트, 대화 맥락, 도구 호출 내역(why)**은 저장하지 않는다.

에이전트가 생성하는 코드량이 늘수록:
- PR 리뷰 시 "왜 이렇게 작성됐는지" 파악이 어려워짐
- 같은 실수를 다른 에이전트가 반복할 수 있음
- 이른바 "AI slop" 코드의 의도를 재현하기 어려움

Entire는 이 갭을 메우려는 플랫폼이다.

---

## Entire.io 개요

| 항목 | 내용 |
|------|------|
| 창업자 | Thomas Dohmke (전 GitHub CEO) |
| 시드 라운드 | $60M (약 3억 달러 밸류에이션) |
| 리드 투자사 | Felicis, Madrona, M12, Basis Set |
| 엔젤 투자자 | Jerry Yang, Olivier Pomel, Garry Tan |
| 첫 제품 | Checkpoints (오픈소스 CLI) |
| 공개일 | 2026-02-10 |

개발자 툴 분야에서 "역대급 시드 규모"로 보도되었다.

### 한 줄 정의

> Git 워크플로에 AI 에이전트 세션/맥락(context)을 함께 버전 관리하여, 코드 변경의 이유(프롬프트, 대화, 도구 사용 내역)까지 추적/공유 가능하게 하는 개발자 플랫폼.

---

## 플랫폼 구성 3요소

1. **Git 호환 데이터베이스** - AI가 만든 코드와 메타데이터를 Git 체계 안에서 통합 관리
2. **시맨틱 추론 레이어** - 다중 에이전트가 서로의 맥락을 이해하고 협업할 수 있는 계층
3. **AI 네이티브 UI** - 에이전트-인간 협업을 전제로 설계된 인터페이스

---

## Checkpoints: 첫 번째 제품

Entire의 오픈소스 CLI 도구. 코드 커밋과 함께 AI 에이전트 세션의 맥락을 "1급 데이터"로 캡처한다.

**캡처되는 데이터:**

| 데이터 | 설명 |
|--------|------|
| Conversation | 프롬프트/응답 전체 트랜스크립트 |
| File changes | 세션 동안 수정된 파일 목록 |
| Tool calls | 실행된 커맨드, 읽은 파일 등 |
| Token usage | 입력/출력/캐시 토큰 수 |
| Timestamps | 시작, 체크포인트, 종료 시각 |

이 맥락은 검색 가능하고, 팀 내 공유 가능하며, 영속적으로 남는다. 같은 팀의 다른 에이전트가 이전 프롬프트/해결 가이던스를 재사용해 실수를 반복하지 않도록 돕는 구조이다.

---

## Claude Code 연동

Entire는 Anthropic의 Claude Code와 1st-class 통합을 제공한다. Git hooks 기반으로 동작하며, 기존 개발 흐름에 자연스럽게 붙는다.

### 동작 방식

```
Claude Code 시작 → Entire가 프로세스 감지
    → 파일 변경/커밋 시 Git hooks 실행
    → 설정 전략에 따라 체크포인트 생성
    → 세션 데이터는 entire/checkpoints/v1 브랜치에 기록
```

### 사전 준비

- Entire CLI 설치
- Claude Code 설치
- `entire enable`로 리포지토리 활성화

### 예시 워크플로

```bash
# 1. 리포지토리에서 Entire 활성화
entire enable

# 2. Claude Code 시작
claude

# 3. Claude에게 작업 지시 (예: JWT 인증 추가)
# 4. 다른 터미널에서 상태 확인
entire status

# 5. 필요 시 이전 체크포인트로 되감기
entire rewind

# 6. 커밋 & 푸시
git commit -m "Add JWT authentication"
git push

# 7. entire.io에서 세션 컨텍스트 확인
```

---

## 주요 기능

### 서브에이전트 중첩 세션

Claude Code가 Task 도구로 sub-agent를 띄우면, Entire가 이를 nested session으로 캡처한다. 복잡한 멀티 에이전트 워크플로의 전체 맥락을 보존할 수 있다.

### 세션 중 되감기 (Rewind)

Claude Code 실행 중 다른 터미널에서 이전 체크포인트 상태로 복구 가능하다.

```bash
entire rewind                      # 대화형으로 되감기 포인트 선택
entire rewind --to <commit>        # 특정 커밋으로 되감기
entire rewind --list               # 되감기 포인트 목록 (JSON)
entire rewind --logs-only          # 로그만 복원 (워크디렉토리 변경 없음)
entire rewind --reset              # 브랜치를 커밋으로 리셋 (파괴적)
```

### 이전 세션 재개 (Resume)

```bash
entire resume <branch>             # 이전 세션 브랜치로 전환/재개
entire resume <branch> -f          # 확인 없이 강제 재개
```

브랜치 체크아웃 → 세션 ID 탐색 → 로컬에 로그가 없으면 복원 → 재개 커맨드 안내 순서로 동작한다.

### 커밋 설명 (Explain)

커밋이나 체크포인트가 "어떻게, 왜 작성됐는지" 조회하거나 AI 요약을 생성할 수 있다.

```bash
entire explain --commit <sha>                  # 커밋 설명 조회
entire explain --checkpoint <id>               # 체크포인트 설명
entire explain --checkpoint <id> --generate    # AI 요약 생성
entire explain --full                          # 전체 트랜스크립트 조회
```

`--generate` 옵션은 Claude CLI 설치 및 인증이 필요하다.

---

## 권장 사용법

**논리적 구간에서 커밋하기**
- 기능 구현 완료 후
- 큰 변경 전
- 나중에 되감고 싶을 수 있는 시점

커밋할 때마다 체크포인트가 쌓이므로, 자연스러운 구간에서 커밋하면 되감기 포인트가 의미 있는 단위로 남는다.

**PR에서 세션 리뷰하기**

PR 생성 시 커밋에 `Entire-Checkpoint` 트레일러가 포함된다. 리뷰어가 이를 클릭하면 세션 상세를 확인할 수 있어, 코드뿐 아니라 "왜 이렇게 작성됐는지"까지 파악할 수 있다.

---

## 트러블슈팅

**세션이 캡처되지 않을 때:**
1. `entire status`로 enable 여부 확인
2. `.git/hooks`에 Git hooks가 설치되었는지 확인
3. Claude Code를 리포지토리 내부에서 실행 중인지 확인

**되감기가 안 될 때:**
- 체크포인트가 있는 활성 세션이 필요
- `entire status`로 상태 확인 (세션이 없으면 세션 브랜치에만 존재할 수 있음)

---

## 지원 연동

현재 공식 문서 기준으로 다음 AI 코딩 도구와 연동을 지원한다:

- **Anthropic Claude Code** - 1st-class 통합 (세션/체크포인트 자동 캡처)
- **Google Gemini CLI** - 프리뷰 연동

---

## 시사점

AI 코딩 에이전트의 확산으로, 코드 자체뿐 아니라 **코드 생성 맥락의 관리**가 새로운 인프라 레이어로 부상하고 있다. 전 GitHub CEO가 $60M 시드를 받아 이 문제에 뛰어들었다는 것 자체가, 업계에서 이 니즈를 얼마나 절실하게 느끼고 있는지를 보여준다.

특히 Claude Code 사용자 입장에서는 Git hooks 기반으로 기존 워크플로를 거의 바꾸지 않고 에이전트 세션 맥락을 남길 수 있다는 점이 실용적이다. PR 리뷰 시 "AI가 왜 이렇게 만들었는지"를 팀원이 바로 확인할 수 있는 흐름은, 에이전트 기반 개발이 팀 단위로 확산될수록 가치가 커질 것이다.
