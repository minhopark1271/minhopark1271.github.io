---
title: 협업 도구 연동
parent: 경영
nav_order: 3
description: "Jira, GitHub, Slack, Confluence를 이슈 키 중심으로 연결하는 협업 루프 설계와 10인 팀 비용 시나리오를 정리합니다."
---

# 소규모 팀 협업 도구 연동 루프 설계
{:.no_toc}

10인 이하 팀에서 Jira(칸반) → GitHub(코드) → Slack(실시간) → Confluence(문서)를 하나의 이슈 키로 연결하는 통합 워크플로우를 설계합니다.

### Link

- [Atlassian 제품군과 요금제](/docs/startup/atlassian)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 연동 루프 전체 구조

```
  Jira ◄─── issue-key link ───► GitHub
  (Kanban)                      (Code/PR)
    │\                              │
    │ └─── issue notify ──┐   PR notify
    │                     │         │
    │ native              │         │
    │ embed/link          │         │
    ▼                     ▼         ▼
  Confluence ── page share ──► Slack
  (Docs)                      (Realtime)
  [optional]
```

| 연동 경로 | 방식 |
|-----------|------|
| Jira ↔ GitHub | 이슈 키 기반 브랜치/커밋/PR 자동 링크 |
| Jira → Slack | 이슈 생성·전환 알림 |
| GitHub → Slack | PR/커밋 알림 |
| Jira ↔ Confluence | 네이티브 연동 (이슈 임베드, 페이지 링크) |
| Confluence → Slack | 페이지 공유·업데이트 알림 |

**핵심 원칙**: 모든 도구가 Jira 이슈 키(예: `PROJ-123`)를 중심으로 연결됩니다.

> **Confluence는 선택사항**입니다. 간단한 문서는 Jira 티켓 내에, 코드 문서는 Git에 작성하면 Confluence 없이도 운용 가능합니다. 설계 문서·온보딩 가이드 등 구조화된 문서가 필요해지면 도입하면 됩니다.

---

## 도구 간 연동 앱 (모두 무료)

### Jira ↔ GitHub: GitHub for Jira

| 기능 | 설명 |
|------|------|
| 자동 링크 | 커밋/브랜치/PR에 이슈 키 포함 시 Jira에 자동 반영 |
| 개발 패널 | Jira 이슈 사이드바에 브랜치·커밋·PR 상태 표시 |
| Smart Commits | `PROJ-123 #done`으로 이슈 자동 전환 |
| 자동화 트리거 | PR 머지 시 Jira 이슈 상태 변경 (자동화 규칙) |

**브랜치 네이밍 컨벤션**:

```
feature/PROJ-123-description
bugfix/PROJ-456-fix-name
```

이슈 키가 브랜치명에 포함되면 Jira가 자동 인식합니다.

### Jira ↔ Slack: Jira Cloud for Slack

| 기능 | 설명 |
|------|------|
| 이슈 알림 | 이슈 생성·전환·코멘트 시 Slack 채널에 알림 |
| 이슈 생성 | Slack 메시지에서 바로 Jira 이슈 생성 |
| 이슈 프리뷰 | Jira 링크 공유 시 인라인 카드 표시 |
| 구독 | 채널별 JQL 필터로 알림 대상 지정 |

### GitHub ↔ Slack: GitHub for Slack

| 기능 | 설명 |
|------|------|
| PR 알림 | PR 생성·리뷰 요청·머지 시 Slack 알림 |
| 커밋 알림 | 특정 브랜치 커밋 시 알림 |
| `/github subscribe` | 채널별 레포·이벤트 구독 설정 |

### Confluence ↔ Jira (네이티브)

같은 Atlassian 사이트 내에서 별도 설치 없이 동작합니다.

| 기능 | 설명 |
|------|------|
| 이슈 임베드 | Confluence 페이지에 Jira 이슈/필터 삽입 |
| 페이지 링크 | Jira 이슈에 Confluence 페이지 링크 |
| 양방향 추적 | 설계 문서 ↔ 구현 이슈 상호 참조 |

---

## 실제 워크플로우 예시

```
1. Jira에서 이슈 PROJ-123 생성 (칸반 → To Do)
   → Slack #dev-jira 에 알림 자동 발송

2. 담당자가 이슈를 In Progress로 이동
   → Git에서 feature/PROJ-123-xxx 브랜치 생성
   → 커밋 메시지에 PROJ-123 포함

3. PR 생성 (GitHub)
   → Jira 이슈 개발 패널에 PR 링크 자동 표시
   → Slack #dev-pr 에 PR 알림
   → Jira 이슈를 In Review로 자동 전환 (자동화 규칙)

4. 코드 리뷰 & 머지
   → Jira 이슈를 Done으로 자동 전환
   → Slack 알림

5. 필요시 Confluence에 설계 문서 작성
   → Jira 이슈에 문서 링크
   → Slack #docs 에 알림
```

---

## Slack 채널 구조 예시

| 채널 | 용도 |
|------|------|
| `#general` | 전체 공지 |
| `#dev` | 개발 일반 논의 |
| `#dev-pr` | PR/코드 리뷰 알림 (GitHub 연동) |
| `#dev-jira` | Jira 이슈 변경 알림 |
| `#docs` | Confluence 페이지 알림 |

---

## 문서화 전략

Confluence 없이도 Jira 티켓 + Git으로 기본은 커버할 수 있습니다.

| 내용 유형 | 위치 | 이유 |
|-----------|------|------|
| 작업 정의·진행 기록 | Jira 티켓 내 | 작업 컨텍스트와 일체화 |
| 설계·분석·연구 문서 | Confluence | 구조화·검색·공유 용이 |
| 코드 문서·주석 | Git codebase | 코드와 함께 버전 관리 |
| 온보딩·프로세스 가이드 | Confluence | 반복 참조, 최신 상태 유지 |
| 회의록·의사결정 로그 | Confluence | 검색 가능한 이력 |

---

## 비용 시나리오 (10인 기준, 월 단위)

### Scenario A: 올프리 — <span>$</span>0/월

| 도구 | 플랜 | 비용 |
|------|------|------|
| Jira | Free | <span>$</span>0 |
| GitHub | Free | <span>$</span>0 |
| Confluence | Free | <span>$</span>0 |
| Slack | Free | <span>$</span>0 |
| **합계** | | **<span>$</span>0** |

**제약**: Jira/Confluence 10명 하드캡, Slack 90일 히스토리·앱 10개 제한, Jira 자동화 100건/월, GitHub Required Reviewers 미지원

**적합**: 도입 초기 검증 단계

### Scenario B: Slack만 유료 — ~<span>$</span>80/월

| 도구 | 플랜 | 비용 |
|------|------|------|
| Jira | Free | <span>$</span>0 |
| GitHub | Free | <span>$</span>0 |
| Confluence | Free | <span>$</span>0 |
| Slack | **Pro** | **~<span>$</span>73–88** |
| **합계** | | **~<span>$</span>73–88/월** |

**해소되는 제약**: 메시지 히스토리 무제한, 외부 앱 연동 무제한, 그룹 허들

**적합**: 실사용 단계. **가장 현실적인 시작점**

### Scenario C: 핵심 유료 — ~<span>$</span>160/월

| 도구 | 플랜 | 비용 |
|------|------|------|
| Jira | **Standard** | **~<span>$</span>79** |
| GitHub | Free | <span>$</span>0 |
| Confluence | Free | <span>$</span>0 |
| Slack | **Pro** | **~<span>$</span>73–88** |
| **합계** | | **~<span>$</span>152–167/월** |

**추가 이점**: Jira 자동화 1,700건/월, 프로젝트별 세분화 권한, 250GB 스토리지

**적합**: 자동화를 적극 활용하거나 인원 10명 초과 예상 시

### Scenario D: 풀 Standard — ~<span>$</span>220/월

| 도구 | 플랜 | 비용 |
|------|------|------|
| Jira | **Standard** | **~<span>$</span>79** |
| GitHub | Free | <span>$</span>0 |
| Confluence | **Standard** | **~<span>$</span>54–64** |
| Slack | **Pro** | **~<span>$</span>73–88** |
| **합계** | | **~<span>$</span>206–231/월** |

**추가 이점**: Confluence 250GB + 외부 공유 + 페이지 분석, Atlassian 도구 Standard급 통일

**적합**: 문서 양이 많거나 외부(고객/파트너) 문서 공유 필요 시

---

## 비용 비교 요약

| 시나리오 | 월 비용 | 연 비용 | 핵심 트레이드오프 |
|---------|--------|--------|----------------|
| A. 올프리 | <span>$</span>0 | <span>$</span>0 | Slack 90일 히스토리, 앱 10개 제한 |
| **B. Slack Pro** | **~<span>$</span>80** | **~<span>$</span>960** | **히스토리·연동 해결. 가장 현실적** |
| C. +Jira Std | ~<span>$</span>160 | ~<span>$</span>1,920 | 자동화 본격 활용, 10명 초과 대비 |
| D. +Conf Std | ~<span>$</span>220 | ~<span>$</span>2,640 | 문서 외부 공유·분석 필요 시 |

### 10인 초과 시 비용 변화

Jira Free·Confluence Free는 **10명 하드캡**이므로, 11번째 멤버부터 Standard 이상 필수입니다. 인원별 월 비용 추정(Scenario D 기준, 전 도구 Standard/Pro):

| 인원 | Jira Std | Conf Std | Slack Pro | 월 합계 | 연 합계 |
|------|---------|---------|----------|--------|--------|
| 10인 | ~<span>$</span>79 | ~<span>$</span>59 | ~<span>$</span>80 | **~<span>$</span>218** | ~<span>$</span>2,616 |
| 15인 | ~<span>$</span>119 | ~<span>$</span>89 | ~<span>$</span>120 | **~<span>$</span>328** | ~<span>$</span>3,936 |
| 20인 | ~<span>$</span>158 | ~<span>$</span>118 | ~<span>$</span>160 | **~<span>$</span>436** | ~<span>$</span>5,232 |
| 30인 | ~<span>$</span>237 | ~<span>$</span>177 | ~<span>$</span>240 | **~<span>$</span>654** | ~<span>$</span>7,848 |

> GitHub Free는 인원 무관 <span>$</span>0이므로 제외. 인당 약 **~<span>$</span>22/월** 수준으로 선형 증가합니다. 연간 결제 시 15–20% 할인 적용 가능.

---

## 권장 도입 순서

```
Phase 1 (즉시)     Jira Free + GitHub Free + Slack Free
                    → 기본 루프 구축, 연동 앱 설치, 컨벤션 수립

Phase 2 (1–2주 후)  Slack → Pro 업그레이드
                    → 히스토리·연동 제한 해소 확인 후 결정

Phase 3 (필요 시)   Confluence Free 추가
                    → 설계 문서·온보딩 가이드 등 구조화 문서 필요 시

Phase 4 (스케일)    Jira/Confluence Standard 업그레이드
                    → 인원 10명 초과 또는 자동화 한계 도달 시
```

---

## 도입 시 세팅 체크리스트

- [ ] Atlassian Cloud 사이트 생성 (Jira + Confluence 통합)
- [ ] Jira 프로젝트 생성 (칸반 보드 템플릿)
- [ ] 칸반 컬럼 설정: `Backlog → To Do → In Progress → In Review → Done`
- [ ] 이슈 타입 정의: Epic / Task / Bug
- [ ] GitHub for Jira 앱 설치 및 레포 연결
- [ ] 브랜치 네이밍 컨벤션 합의: `feature/PROJ-123-description`
- [ ] Slack 워크스페이스 생성 (또는 기존 사용)
- [ ] Jira Cloud for Slack 앱 설치
- [ ] GitHub for Slack 앱 설치
- [ ] Slack 채널 구조 설정 (`#dev`, `#dev-pr`, `#dev-jira`)
- [ ] 자동화 규칙 설정 (PR 생성 → In Review, PR 머지 → Done)
- [ ] 팀 온보딩: 컨벤션 공유, 첫 이슈 생성 연습

---

## 현행 대비 도입 특장점

| 관점 | 현행 (메신저 + Git만) | Jira + Slack + Confluence 도입 후 |
|------|---------------------|---------------------|
| 작업 현황 | 물어봐야 앎 | 칸반 보드에서 한눈에 |
| 할당·우선순위 | 구두/메시지 → 유실 | 이슈 단위 명시적 할당 |
| 진행 추적 | PR 기준으로만 추정 | 이슈 상태 자동 전환 (PR→Done) |
| 코드↔작업 연결 | 커밋 로그 뒤져야 함 | 이슈 키 하나로 브랜치/PR/커밋 자동 링크 |
| 알림 | 관련 없는 메시지에 묻힘 | 채널별 구독 — 내 PR, 내 이슈만 |
| 이력 검색 | 메신저 스크롤 | Jira JQL + Slack 검색 |
| 자료 공유 | 로컬 파일 내려받아 열어야 함 | 클라우드에서 실시간 공유 |
| AI 연동 | 수동 복붙 | Jira·GitHub·Slack 모두 MCP 제공 — AI가 직접 수행 |

**한 줄 요약**: "누가 뭘 하고 있고, 어디까지 됐는지"를 묻지 않아도 알 수 있게 됩니다.

---

## 참고 사항

> **가격 기준 시점**: 본 포스트의 모든 요금 정보는 **2026년 3월** 조사 기준입니다. 각 서비스의 최신 가격은 공식 웹사이트에서 확인하시기 바랍니다.

- 모든 연동 앱(GitHub for Jira, Jira for Slack, GitHub for Slack)은 **무료**
- [Atlassian 제품군과 요금제 비교](/docs/startup/atlassian)
