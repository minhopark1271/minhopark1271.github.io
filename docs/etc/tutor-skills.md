---
title: LLM 튜터
parent: 기타
nav_order: 52
description: Claude Code 기반 AI 학습 시스템 tutor-skills의 설치, 사용법, 워크플로우를 설명합니다. PDF/코드베이스를 Obsidian 학습 노트로 변환하고 대화형 퀴즈로 학습합니다.
---

# tutor-skills: Claude Code로 공부하기
{:.no_toc}

Claude Code의 Skills 기능을 활용해 PDF 교재나 코드베이스를 Obsidian 학습 볼트로 변환하고, 대화형 퀴즈로 학습하는 오픈소스 프로젝트입니다.

### Link

- [tutor-skills GitHub](https://github.com/RoundTable02/tutor-skills)
- [GeekNews 소개글](https://news.hada.io/topic?id=27156)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 핵심 아이디어

Claude Code의 **Plan 모드**에서는 `AskUserQuestion` 도구를 통해 사용자에게 질문을 던질 수 있습니다. tutor-skills는 이 메커니즘을 **메타인지 학습**(metacognitive learning)에 활용합니다.

- 학습 자료를 구조화된 노트로 자동 변환
- 개념별 연습 문제 자동 생성
- 진단 퀴즈로 약점 파악
- 약점 영역 집중 드릴

제작자는 이 시스템으로 **매일 30분씩 2주 만에 AWS 자격증**을 취득했다고 합니다.

---

## 설치

```bash
# 원라인 설치 (권장)
npx skills add RoundTable02/tutor-skills

# 수동 설치
git clone https://github.com/RoundTable02/tutor-skills.git
cd tutor-skills
./install.sh
```

Claude Code, Cursor, Windsurf 등 Claude Code Skills를 지원하는 환경에서 사용 가능합니다.

---

## 두 가지 Skill

### 1. `/tutor-setup` — 학습 볼트 생성

지식 소스를 구조화된 Obsidian 학습 볼트로 변환합니다. **자동 모드 감지** 기능으로 입력 자료의 종류를 판별합니다.

| 모드 | 감지 대상 | 용도 |
|------|----------|------|
| **Document Mode** | PDF, TXT, MD, HTML, EPUB | 교재·문서 학습 |
| **Codebase Mode** | package.json, pom.xml, Cargo.toml 등 | 코드베이스 온보딩 |

#### Document Mode 워크플로우

9단계 파이프라인으로 학습 볼트를 생성합니다.

| 단계 | 내용 |
|------|------|
| D1. Source Discovery | 소스 파일 스캔, 추출, 검증 |
| D2. Content Analysis | 주제 계층구조 및 의존성 맵 구축 |
| D3. Tag Standard | 케밥-케이스 태그 레지스트리 정의 |
| D4. Vault Structure | 주제별 번호 폴더 생성 |
| D5. Dashboard | MOC, 빠른 참고, 시험 함정 정리 |
| D6. Concept Notes | 표, 다이어그램, 콜아웃 포함 구조화 노트 |
| D7. Practice Questions | 주제당 8개 이상의 연습 문제 (폴드 콜아웃) |
| D8. Interlinking | wiki-links로 모든 노트 교차참조 |
| D9. Self-Review | 품질 체크리스트 검증 |

생성되는 볼트 구조:

```
StudyVault/
├── 00-Dashboard/        # MOC + Quick Reference + Exam Traps
├── 01-<Topic1>/         # 개념 노트 + 연습 문제
├── 02-<Topic2>/
└── ...
```

#### Codebase Mode 워크플로우

코드베이스를 분석하여 아키텍처 이해를 위한 학습 자료를 생성합니다.

| 단계 | 내용 |
|------|------|
| C1. Project Exploration | 파일 스캔, 기술 스택 감지, 레이아웃 매핑 |
| C2. Architecture Analysis | 패턴, 흐름, 모듈 식별 |
| C3. Tag Standard | `#arch-*`, `#module-*`, `#pattern-*` 레지스트리 |
| C4–C8 | 볼트 구조 생성, 모듈 노트, 실습 문제 등 |
| C9. Self-Review | 품질 체크리스트 검증 |

```
StudyVault/
├── 00-Dashboard/        # 아키텍처 개요
├── 01-Architecture/     # 시스템 설계
├── 02-<Module1>/
├── ...
├── NN-DevOps/           # 빌드/배포
└── NN+1-Exercises/      # 온보딩 실습
```

---

### 2. `/tutor` — 대화형 퀴즈

생성된 StudyVault를 기반으로 대화형 퀴즈 세션을 진행합니다.

#### 세션 타입

| 타입 | 가용 조건 | 설명 |
|------|----------|------|
| **Diagnostic** | 미측정 영역(⬜) 존재 시 | 새로운 영역의 광범위한 평가 |
| **Drill weak areas** | 약점(🟥/🟨) 존재 시 | 약점 영역 표적 연습 |
| **Choose a section** | 항상 | 원하는 영역 선택 학습 |
| **Hard-mode review** | 모든 영역 🟩/🟦 시 | 숙련 자료 도전 |

#### 퀴즈 흐름

1. StudyVault 감지 및 학습 대시보드 읽기
2. 현재 능력 기반 세션 옵션 제시
3. **라운드당 4개 문제** 전달 (각 4지선다, 힌트 없음)
4. 답안 채점 및 오답 설명
5. 개념 파일·대시보드 자동 업데이트

#### 개념 수준 진행 추적

개별 문제가 아닌 **개념 단위**로 정확도를 추적합니다. 각 개념마다 시도 횟수, 정답 수, 마지막 테스트 날짜, 오답 오류 노트를 기록합니다.

| 배지 | 수준 | 정확도 |
|------|------|--------|
| 🟥 | Weak | 0–39% |
| 🟨 | Fair | 40–69% |
| 🟩 | Good | 70–89% |
| 🟦 | Mastered | 90–100% |
| ⬜ | Unmeasured | 데이터 없음 |

약점으로 분류된 개념은 드릴 세션에서 **새로운 맥락으로 재출제**됩니다.

---

## 사용 워크플로우

```
1. 학습 자료 준비     → PDF, 교재, 코드베이스를 작업 디렉토리에 배치
2. /tutor-setup       → StudyVault 자동 생성
3. Obsidian 검토      → 생성된 노트를 Obsidian으로 열어 읽기
4. /tutor             → 진단 퀴즈 실시 → 약점 파악
5. 약점 복습          → Obsidian에서 해당 노트 집중 복습
6. /tutor             → 약점 드릴 → 정확도 갱신
7. 반복               → 모든 영역이 🟩/🟦이 될 때까지
```

---

## 설계 원칙

| 원칙 | 설명 |
|------|------|
| **자동 모드 감지** | 프로젝트 마커로 Document vs Codebase 자동 구분 |
| **개념 추적** | 개별 질문이 아닌 개념 수준의 정확도 기록 |
| **활동적 회상** | 숨겨진 답(폴드 콜아웃)으로 시험 환경 시뮬레이션 |
| **상호연결** | wiki-links로 모든 노트를 학습 그래프로 통합 |

---

## 활용 사례

- **자격증 준비**: AWS, 정보처리기사 등 시험 대비
- **코드베이스 온보딩**: 새 프로젝트 합류 시 아키텍처 빠른 파악
- **기술 학습**: 새로운 프레임워크나 언어 체계적 학습

Claude Code의 Plan 모드와 Skills 시스템이 단순 코딩 도구를 넘어 **학습 도구**로 확장될 수 있음을 보여주는 프로젝트입니다.
