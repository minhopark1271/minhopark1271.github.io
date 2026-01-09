---
title: Claude Code
parent: 개발
nav_order: 14
description: "Claude Code CLI 완벽 가이드. 파일 작업, 코드 검색, Bash 명령 실행, 작업 관리까지. --continue, --resume, /init, /plan 등 핵심 명령어 사용법."
---

# Claude Code
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

--- 

## Links

- [꼭 알아야하는 클로드 코드 필수 꿀팁 60가지, Youtube](https://www.youtube.com/watch?v=a1a9wV88MSM)
- [claude-code, Github](https://github.com/anthropics/claude-code)

---

## 핵심 개념

Claude Code는 Anthropic의 공식 CLI 도구로, 소프트웨어 개발 작업을 지원하는 대화형 도구입니다.

### 주요 특징

- **파일 작업**: 읽기, 편집, 작성을 통한 코드베이스 수정
- **코드 검색**: Glob, Grep을 사용한 빠른 파일 및 내용 검색
- **명령 실행**: Bash 명령어를 통한 빌드, 테스트, Git 작업
- **작업 관리**: TodoWrite를 통한 복잡한 작업의 계획 및 추적
- **에이전트**: 복잡한 탐색, 계획 수립을 위한 전문 서브에이전트

---

## 주요 사용 패턴

```
# 직전 작업 쓰레드 재시작
claude --continue

# 이전 작업 쓰레드 목록에서 선택하여 재시작
claude --resume
```

```
# 파일 주입
@file
```

```
/init
>> CLAUDE.md 생성
```

```
--plan
# 작업내용 구체화하고 사용자 확인을 통해 clarify까지 함
# 최종 확인한 작업 내용은 .plan.md로 정리
# 구현 진행
```

```
# 컨텍스트 비우기
/clear

# 현재 컨텍스트 사용량
/context
```

```
# 추론 모델 변경
/model

# 현재 토큰 사용량
/usage
```

```
# plan mode <> accept edit mode 전환
>> SHIFT + Tab
```

---

## Super Claude

- [SuperClaude](https://github.com/SuperClaude-Org/SuperClaude_Framework)

---

## Skills

- [Agent Skills](https://code.claude.com/docs/ko/skills)

---

## Plugin

- [Plugin](https://code.claude.com/docs/ko/plugins)

```bash
# 로컬 claude code에 anthropic에서 운영하는 plugin marketplace 등록
/plugin marketplace add anthropics/claude-code
```

