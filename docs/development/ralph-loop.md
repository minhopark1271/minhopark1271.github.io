---
title: Ralph Loop
parent: 개발
nav_order: 46
description: "Ralph Loop의 자율 반복 개발 개념, 동작 원리, 주요 구현체(snarktank/ralph, frankbria/ralph-claude-code) 설치 및 활용법을 소개합니다."
---

# Ralph Loop — AI 자율 반복 개발 루프
{:.no_toc}

AI 코딩 에이전트를 **작업이 완료될 때까지 자동으로 반복 실행**하는 기법입니다. 한 번의 프롬프트로 수 시간~수일간 자율 개발이 가능합니다.

### Link

- [snarktank/ralph](https://github.com/snarktank/ralph) — PRD 기반 루프 (Amp / Claude Code)
- [frankbria/ralph-claude-code](https://github.com/frankbria/ralph-claude-code) — Claude Code 전용 자율 프레임워크
- [awesome-ralph](https://github.com/snwfdhmp/awesome-ralph) — Ralph 관련 리소스 모음

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 개요

Ralph는 Geoffrey Huntley가 고안한 기법으로, 핵심은 놀랍도록 단순합니다:

> "Ralph is a Bash loop." — Geoffrey Huntley

`while true` 루프 안에서 AI 코딩 에이전트에게 동일한 프롬프트를 반복 전달하고, 매 반복마다 이전 작업 결과(git history, 진행 파일)를 컨텍스트로 활용하여 점진적으로 작업을 완성합니다. 이름은 심슨 가족의 Ralph Wiggum에서 따왔으며, "실패해도 끈질기게 다시 시도하는" 철학을 담고 있습니다.

### 기존 방식과의 차이

| 항목 | 단발 실행 | Ralph Loop |
|------|----------|------------|
| **실행 횟수** | 1회 | 완료까지 N회 반복 |
| **컨텍스트** | 단일 세션 | 매 반복마다 fresh context + git history |
| **실패 처리** | 사용자가 수동 재시도 | 자동 재시도 + 학습 반영 |
| **작업 규모** | 단일 기능 | PRD 전체 (다수 스토리) |
| **소요 시간** | 수분 | 수시간~수일 |

---

## 동작 원리

모든 Ralph 구현체의 공통 사이클:

```
┌─────────────────────────────────────┐
│  1. 프롬프트/PRD 읽기               │
│  2. AI 에이전트 실행 (fresh context) │
│  3. 코드 변경 + 테스트 실행          │
│  4. 진행 상황 기록 (git commit 등)   │
│  5. 완료 조건 확인                   │
│     ├─ 미완료 → 1번으로 돌아감       │
│     └─ 완료 → 루프 종료              │
└─────────────────────────────────────┘
```

**핵심 설계**: 매 반복마다 **새로운 AI 인스턴스**가 생성됩니다. 이전 컨텍스트는 직접 전달되지 않고, 다음 3가지를 통해 간접적으로 연속성이 유지됩니다:

1. **Git 커밋 히스토리** — 이전 반복에서 변경한 코드
2. **진행 파일** (`progress.txt`, `prd.json`) — 완료/미완료 작업 추적
3. **AGENTS.md** — 반복 중 발견한 패턴과 주의사항 누적

---

## 주요 구현체

### 1. snarktank/ralph — PRD 기반 루프

PRD(Product Requirements Document)를 JSON으로 변환하고, 스토리 단위로 반복 실행합니다.

**반복 사이클**:
1. 피처 브랜치 생성
2. 우선순위가 가장 높은 미완료 스토리 선택
3. 해당 스토리 구현
4. 타입체크 + 테스트 실행
5. 통과 시 커밋 + `prd.json`에 `passes: true` 기록
6. `progress.txt`에 학습 내용 추가
7. 모든 스토리가 완료될 때까지 반복

```bash
# 설치 (Claude Code Marketplace)
/plugin marketplace add snarktank/ralph
/plugin install ralph-skills@ralph-marketplace

# PRD 생성 → JSON 변환 → 실행
# 1. PRD 작성
"Load the prd skill and create a PRD for user authentication"

# 2. Ralph 형식 변환
"Load the ralph skill and convert tasks/prd-auth.md to prd.json"

# 3. 루프 실행
./scripts/ralph/ralph.sh              # 기본 10회 반복
./scripts/ralph/ralph.sh 20           # 20회 반복
./scripts/ralph/ralph.sh --tool claude 15  # Claude Code로 15회
```

**AGENTS.md 개념**: 매 반복 후 발견한 패턴을 AGENTS.md에 기록합니다. AI 도구가 이 파일을 자동으로 읽기 때문에, 이후 반복에서 같은 실수를 반복하지 않는 누적 학습 효과가 있습니다.

```markdown
<!-- AGENTS.md 예시 -->
## 발견된 패턴
- 이 코드베이스는 인증에 NextAuth를 사용함
- DB 스키마 변경 시 반드시 migration 파일 생성 필요

## 주의사항
- settings 컴포넌트는 src/components/settings/에 위치
- API 라우트 변경 시 middleware.ts도 함께 수정해야 함
```

**적정 스토리 크기**: 한 번의 컨텍스트 윈도우에서 완료 가능한 크기가 이상적입니다.

| 적정 크기 | 과대 (분할 필요) |
|----------|-----------------|
| DB 컬럼 + 마이그레이션 추가 | "전체 대시보드 구축" |
| UI 컴포넌트 삽입 | "인증 시스템 추가" |
| 서버 액션 로직 수정 | "API 레이어 리팩토링" |
| 필터 드롭다운 구현 | |

---

### 2. frankbria/ralph-claude-code — Claude Code 전용 프레임워크

Claude Code에 특화된 구현체로, 지능형 종료 감지, 레이트 리미팅, 서킷 브레이커 등 프로덕션급 안전장치를 갖추고 있습니다.

**설치**:

```bash
git clone https://github.com/frankbria/ralph-claude-code.git
cd ralph-claude-code
./install.sh
# → ralph, ralph-monitor, ralph-enable 등 글로벌 명령어 등록
```

**프로젝트 활성화**:

```bash
cd my-project
ralph-enable        # 인터랙티브 위저드 (프로젝트 타입 자동 감지)
ralph --monitor     # tmux 모니터링과 함께 실행
```

위저드가 프로젝트 타입(TypeScript, Python, Rust, Go)과 프레임워크(Next.js, FastAPI, Django)를 자동 감지하고, GitHub Issues나 PRD에서 태스크를 가져올 수 있습니다.

**실행 옵션**:

```bash
ralph --monitor              # tmux 모니터링 (권장)
ralph --calls 50             # 시간당 API 호출 제한
ralph --live                 # 실시간 Claude Code 출력 확인
ralph --resume <session_id>  # 이전 세션 이어서 실행
ralph --output-format json   # JSON 출력
ralph --status               # API 사용량 확인
```

---

## 지능형 종료 감지

frankbria 구현체의 핵심 기능입니다. 단순 키워드 매칭이 아닌 **이중 조건 게이트**로 조기 종료를 방지합니다:

```
종료 조건 = completion_indicators >= 2 AND EXIT_SIGNAL: true
```

| 상황 | completion_indicators | EXIT_SIGNAL | 결과 |
|------|----------------------|-------------|------|
| "1단계 완료, 다음 기능으로" | 1 | false | **계속** |
| "모든 작업 완료" | 3 | false | **계속** (명시적 신호 대기) |
| "완료, 종료합니다" | 2 | true | **종료** |

Claude가 "phase complete"라고 말해도 `EXIT_SIGNAL: false`이면 다음 기능 구현을 계속 진행합니다.

---

## 안전장치

### 레이트 리미팅

```bash
# 시간당 100회 호출 제한 (기본값)
MAX_CALLS_PER_HOUR=100

# 조정
ralph --calls 50
```

### 서킷 브레이커

무한 루프와 반복 실패를 감지하여 자동으로 루프를 중단합니다:

| 조건 | 임계값 |
|------|--------|
| 진전 없는 연속 반복 | 3회 |
| 동일 에러 반복 | 5회 |
| 쿨다운 후 자동 복구 | 30분 |

상태 전이: `CLOSED` (정상) → `OPEN` (차단) → `HALF_OPEN` (시도) → `CLOSED`

### API 5시간 제한 대응

Claude API의 5시간 사용량 제한을 3단계로 감지합니다:
1. 타임아웃 가드 — 타임아웃과 API 제한 구분
2. JSON 파싱 — `rate_limit_event` 필드 감지
3. 텍스트 폴백 — 제한 메시지 의미 분석

무인 모드에서는 API 제한 도달 시 자동 대기합니다.

---

## 프로젝트 구조

frankbria 구현체의 프로젝트 파일 구조:

```
my-project/
├── .ralph/
│   ├── PROMPT.md       # 상위 목표 (프로젝트 설명)
│   ├── fix_plan.md     # 구체적 태스크 목록
│   ├── AGENT.md        # 빌드/테스트 명령어 (자동 유지)
│   └── specs/          # 상세 요구사항
│       └── stdlib/     # 재사용 패턴
└── .ralphrc            # 프로젝트 설정
```

**파일 계층 관계**:

```
PROMPT.md (상위 목표)
    ↓
specs/ (상세 요구사항)
    ↓
fix_plan.md (구체적 태스크)
    ↓
AGENT.md (빌드/테스트 명령어)
```

### .ralphrc 설정 예시

```bash
PROJECT_NAME="my-project"
PROJECT_TYPE="typescript"
MAX_CALLS_PER_HOUR=100
CLAUDE_TIMEOUT_MINUTES=15
SESSION_CONTINUITY=true
SESSION_EXPIRY_HOURS=24
CB_NO_PROGRESS_THRESHOLD=3
CB_SAME_ERROR_THRESHOLD=5
```

---

## 태스크 가져오기

다양한 소스에서 태스크를 자동으로 가져올 수 있습니다:

```bash
# GitHub Issues에서 가져오기
ralph-enable --from github --label "sprint-1"

# PRD 문서에서 가져오기
ralph-enable --from prd ./docs/requirements.md

# Beads에서 가져오기
ralph-enable --from beads
```

---

## 구현체 비교

| 항목 | snarktank/ralph | frankbria/ralph-claude-code |
|------|----------------|----------------------------|
| **AI 도구** | Amp, Claude Code | Claude Code 전용 |
| **태스크 관리** | prd.json (스토리 단위) | fix_plan.md (체크리스트) |
| **학습 메커니즘** | AGENTS.md + progress.txt | .ralph/ 디렉토리 |
| **안전장치** | 기본 반복 제한 | 서킷 브레이커 + 레이트 리미팅 |
| **종료 감지** | 모든 스토리 passes: true | 이중 조건 게이트 |
| **모니터링** | git log 기반 | tmux 대시보드 |
| **프로젝트 감지** | 수동 | 자동 (타입, 프레임워크) |
| **적합 상황** | 명확한 PRD가 있는 프로젝트 | 범용 자율 개발 |

---

## 정리

| 항목 | 내용 |
|------|------|
| **핵심 개념** | AI 에이전트를 완료까지 반복 실행하는 자율 루프 |
| **원리** | fresh context + git history + 진행 파일로 연속성 유지 |
| **강점** | 수시간~수일 무인 개발, 반복 학습, 자동 품질 검증 |
| **안전장치** | 서킷 브레이커, 레이트 리미팅, 이중 종료 감지 |
| **적합 상황** | PRD 기반 다수 기능 구현, 장시간 자율 개발 |
| **주의** | 스토리 크기 조절 필수, API 비용 관리 필요 |

단발 프롬프트의 한계를 넘어, AI를 **지속적 개발 파트너**로 활용할 수 있는 패러다임입니다.
