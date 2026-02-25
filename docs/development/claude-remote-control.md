---
title: Remote Control
parent: 개발
nav_order: 40
description: Claude Code Remote Control로 로컬 세션을 스마트폰, 태블릿, 브라우저에서 원격 제어하는 방법과 동작 원리를 설명합니다.
---

# Claude Code Remote Control
{:.no_toc}

로컬 터미널에서 실행 중인 Claude Code 세션을 다른 기기에서 이어서 사용하는 기능.

### Link

- [공식 문서 - Remote Control](https://code.claude.com/docs/en/remote-control)
- [GeekNews 토픽](https://news.hada.io/topic?id=26977)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## Remote Control이란

Claude Code Remote Control은 로컬 머신에서 실행 중인 세션을 **스마트폰, 태블릿, 다른 PC의 브라우저**에서 원격으로 조작할 수 있는 기능이다. 2025년 리서치 프리뷰로 공개되었다.

핵심 특징은 **코드가 클라우드로 올라가지 않는다**는 점이다. 세션은 로컬에서 계속 실행되고, 원격 기기는 해당 세션에 대한 **뷰어 + 입력 채널** 역할만 한다.

```
[로컬 터미널] ←→ [Anthropic API (relay)] ←→ [원격 기기: 웹/앱]
```

### Cloud 기반 Claude Code on the Web과의 차이

| 항목 | Remote Control | Claude Code on the Web |
|------|---------------|----------------------|
| **실행 환경** | 로컬 머신 | Anthropic 클라우드 |
| **파일시스템** | 로컬 파일 직접 접근 | 클라우드 환경 (repo clone) |
| **MCP 서버** | 로컬 MCP 서버 사용 가능 | 클라우드 MCP만 |
| **사용 시나리오** | 진행 중인 로컬 작업 이어서 하기 | 로컬 환경 없이 새 작업 시작 |

---

## 요구 사항

- **플랜**: Pro 또는 Max (API 키 미지원, Team/Enterprise 미지원)
- **인증**: `claude` 실행 후 `/login`으로 claude.ai 로그인 완료
- **워크스페이스 신뢰**: 프로젝트 디렉토리에서 `claude`를 최소 1회 실행하여 trust dialog 승인

---

## 사용 방법

### 새 세션으로 시작

```bash
claude remote-control
```

실행하면 **세션 URL**과 **QR 코드**가 표시된다. Spacebar로 QR 코드 토글 가능.

지원 플래그:
- `--verbose`: 상세 연결/세션 로그
- `--sandbox` / `--no-sandbox`: 파일시스템 및 네트워크 격리 (기본 off)

### 기존 세션에서 전환

이미 Claude Code를 사용 중이라면 세션 내에서 명령어를 입력:

```
/remote-control
```

또는 줄여서 `/rc`. 현재 대화 히스토리가 그대로 유지된다.

**팁**: `/rename`으로 세션 이름을 지정해두면 다른 기기에서 찾기 쉽다.

### 다른 기기에서 접속

3가지 방법 중 선택:

1. **세션 URL 직접 접속**: 터미널에 표시된 URL을 브라우저에서 열기
2. **QR 코드 스캔**: Claude 앱(iOS/Android)으로 스캔
3. **claude.ai/code 또는 앱에서 검색**: 세션 목록에서 컴퓨터 아이콘 + 초록 점 표시된 세션 선택

### 모든 세션에 자동 활성화

매번 명령어를 치지 않고 항상 Remote Control을 켜두려면:

```
/config → Enable Remote Control for all sessions → true
```

---

## 연결 구조와 보안

```
로컬 Claude Code → (outbound HTTPS) → Anthropic API → (streaming) → 원격 기기
```

**보안 특징**:
- 로컬 머신에 **인바운드 포트를 열지 않는다** (outbound HTTPS만 사용)
- 로컬 세션이 Anthropic API에 등록 후 **polling** 방식으로 작업 수신
- 모든 트래픽은 **TLS** 암호화 (일반 Claude Code 세션과 동일)
- 다수의 **단기 자격 증명**(short-lived credentials)을 목적별로 발급, 독립적으로 만료

코드나 파일이 클라우드에 저장되지 않고, 실행은 완전히 로컬에서 이루어진다.

---

## 활용 시나리오

### 멀티 디바이스 워크플로우

사무실 PC에서 장시간 리팩토링을 시작한 뒤, 점심 시간에 스마트폰으로 진행 상황 확인 및 다음 지시 전달. 퇴근 후 집 PC에서 마무리.

```
09:00 사무실 터미널에서 claude remote-control
12:00 점심: 스마트폰 앱에서 진행상황 확인 → 추가 지시
18:00 집 PC 브라우저에서 마무리 작업
```

### 로컬 MCP 서버가 필요한 작업

데이터베이스, Docker, 커스텀 MCP 서버 등 로컬 환경에 의존하는 작업은 Cloud 기반 "Claude Code on the Web"으로는 불가능하다. Remote Control은 로컬 환경을 그대로 유지하므로 이런 작업에 적합하다.

### 장시간 빌드/테스트 모니터링

빌드나 테스트 스위트 실행 중 자리를 비울 때, 스마트폰으로 실시간 상태를 확인하고 실패 시 즉시 디버깅 지시를 보낼 수 있다.

---

## 제약 사항

| 제약 | 설명 |
|------|------|
| **동시 연결 1개** | 세션당 1개의 원격 연결만 가능 |
| **터미널 유지 필수** | 터미널을 닫거나 `claude` 프로세스를 종료하면 세션 종료 |
| **네트워크 단절** | 머신이 깨어있지만 ~10분간 네트워크 불가 시 세션 타임아웃 |
| **플랜 제한** | Pro/Max만 지원, Team/Enterprise 미지원 |

---

## 정리

| 구분 | 내용 |
|------|------|
| **무엇** | 로컬 Claude Code 세션을 원격 기기에서 이어서 사용 |
| **어디서** | claude.ai/code, iOS/Android Claude 앱 |
| **핵심 원리** | 실행은 로컬, 원격 기기는 뷰어+입력 역할 |
| **보안** | outbound HTTPS만 사용, 인바운드 포트 없음, TLS 암호화 |
| **시작** | `claude remote-control` 또는 `/rc` |
