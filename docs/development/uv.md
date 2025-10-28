---
title: UV
parent: 개발
nav_order: 2
---

# UV
{:.no_toc}

파이썬 버전 및 가상환경 관리 툴  
An extremely fast Python package and project manager, written in Rust.

### Link

- [uv - GitHub](https://github.com/astral-sh/uv)

## 목차
{:.no_toc}

1. TOC
{:toc}

--- 

## 주요 특징

- 하나의 도구로 pip, pip-tools, pipx, poetry, pyenv, twine, virtualenv 모두 대체
- pip 대비 10~100배 더 빠른 속도
- 범용 잠금 파일(universal lockfile)을 통한 종합적인 프로젝트 관리 제공
- 스크립트 실행 및 코드 내(inline) 의존성 메타데이터 지원
- 다양한 Python 버전 설치 및 관리
- Python 패키지로 배포된 툴 실행과 설치 지원
- 익숙한 CLI를 유지하는 pip 호환 인터페이스 + 성능 향상
- 확장 가능한 대규모 프로젝트를 위한 Cargo 스타일 워크스페이스 지원
- 전역 캐시 기반 의존성 중복 제거로 디스크 공간 효율화
- Rust나 사전 Python 설치 없이 curl 또는 pip로 바로 설치 가능
- macOS, Linux, Windows 지원
- uv는 Ruff 제작사 Astral이 지원하는 프로젝트

## 설치

```
# On macOS and Linux.
curl -LsSf https://astral.sh/uv/install.sh | sh
```

```
# With pip.
pip install uv
```

```
# 최신버전으로 업데이트
uv self update
```

## PIP vs UV 핵심 비교

| 항목 | pip (+ venv) | uv |
|------|--------------|----|
| 프로젝트 초기화 | 수동 디렉토리 + venv 생성 | `uv init <name>` 시 자동 가상환경 + 메타파일 생성 |
| 가상환경 활성화 | 직접 `source .venv/bin/activate` | 패키지 설치/실행 시 자동 활성화 |
| 패키지 추가 | `pip install` 후 requirements 관리 수동 | `uv add` 로 `pyproject.toml` & lock 자동 반영 |
| 개발 의존성 | 별도 관리 어려움 | `uv add --dev` 명시적 분리 |
| 버전 잠금 | requirements.txt freeze | `uv lock` + 재현성 설치 `uv sync` |
| Python 버전 관리 | 외부(pyenv 등) 의존 | 내장 `uv python install / list / pin` |
| 의존성 해석 | 순차 처리 | 병렬 처리 (PubGrub) |
| 캐시 | 프로젝트별 중복 저장 | 전역 캐시 + 하드 링크 절약 |
| 네트워크 | HTTP/1.1 | HTTP/2 + 연결 풀링 |
| 디스크 효율 | 복사 반복 | 하드 링크로 중복 최소화 |
| 스크립트 실행 | `python -m` | `uv run`, 버전 지정, 의존성 자동 처리 |

## 프로젝트 초기화 시 생성 파일 개요

- `pyproject.toml`: 프로젝트 메타 + dependencies 배열 관리 (hatchling 기본 빌드 백엔드)
- `.python-version`: 고정 Python 버전 (예: 3.11)
- `uv.lock`: 의존성 해석 결과 고정 (버전 관리 시스템에 포함 권장)
- `requirements.txt` / `requirements-dev.txt`: freeze 출력물 (선택적 공유)
- `.venv/`: 가상환경 디렉토리 (bin / lib / include)

## 계층적 관리 구조: uv ↔ venv ↔ pip

```
사용자 명령 (uv CLI)
	↓
uv 명령 계층 (add / lock / sync / run / python ...)
	↓
의존성 해석(PubGrub) + 버전 결정
	↓
lock 생성/갱신 (uv.lock)
	↓
환경 관리 레이어 (venv 생성/활성화 자동화)
	↓
pip 호환 실행 엔진 (설치/제거/업그레이드 호출)
	↓
전역 캐시 & 하드 링크 (디스크/네트워크 최적화)
	↓
파일 시스템(.venv/, 캐시 디렉토리)
```

**요약:**  

- uv는 pip를 "대체"한다기보다 pip 기능(설치/삭제/목록)을 상위 추상화로 감싸 재현성·속도·환경 일관성을 강화.
- 사용자는 `uv add` 같은 선언적 명령을 통해 의존성 **의도(intent)** 를 기록하고, 실제 설치는 해결된 lock을 기반으로 pip 호환 실행기로 적용.
- venv 생성/활성화는 **명시적 activate** 없이도 uv가 명령 실행 시 자동으로 해당 가상환경을 선택(디렉토리 기준 루트 탐색).
- 전역 캐시는 여러 venv 간 중복 wheel 다운로드/압축 해제를 줄여 설치 속도를 가속.
- `uv run`은 실행 직전 필요한 Python 버전 및 의존성 존재 여부를 확인 → 없으면 설치 후 실행.
- pip 직접 호출이 필요한 경우(`uv pip ...`)도 동일 캐시/환경 최적화 레이어를 재사용.


**실행 흐름 예 (의존성 추가 후 스크립트 실행):**  

1. `uv add requests` → pyproject 수정 + 해석 + (필요 시) lock 갱신
2. `uv lock` (자동 또는 명시) → 결정된 버전 스냅샷 저장
3. `uv sync` → venv 생성/업데이트 + 캐시 활용 설치
4. `uv run script.py` → 활성화 자동 처리 후 실행

## `pyproject.toml` 와 `uv.lock` 관계

**역할 분담:**  

- `pyproject.toml`: "선언적 의도" (직접 의존성, 버전 범위, 메타데이터, 최소 Python 버전 등)
- `uv.lock`: "구체적 결괏값" (모든 직·간접 의존성의 **정확한 버전 + 해시** 스냅샷)

**관계 모델:**  

| 파일 | 성격 | 포함 내용 | 변경 트리거 | VCS 포함 권장 | 사용 시점 |
|------|------|-----------|-------------|---------------|-----------|
| pyproject.toml | 선언(Declarative) | 직접 dependencies / constraints | 개발자가 add/편집 | 예 | 해석 입력 |
| uv.lock | 해석 결과(Resolved) | 전체 dependency graph 확정 버전/해시 | 해석 알고리즘 결과(PubGrub) | 예 (재현성 목적) | 설치/동기화 |

**워크플로우 시나리오:**

1. 초기화: `uv init` → 빈 dependencies / 기본 메타 생성
2. 의존성 추가: `uv add fastapi` → pyproject 수정 + 즉시 해석 → lock 갱신
3. 팀 공유: pyproject + lock 커밋 → 동료는 `uv sync`로 동일 그래프 재현
4. 범위 변경: `pyproject.toml` 에서 `requests = "^2.31"` 를 `"^2.32"` 로 올림 → **lock 재생성 필요** (`uv lock`)
5. 설치 재현: 클린 환경에서 `uv sync` 실행 → lock 기준 설치 (변동 없음)
6. 업그레이드: `uv lock --upgrade` (주의: 존재할 경우 전체 그래프 재평가)

**베스트 프랙티스:**  

- lock은 항상 VCS에 포함해 CI/배포/컨테이너 재현성 확보.
- pyproject 수동 편집 후 lock 재생성 안 하면 "stale lock" 상태 → 의존성 drift 가능 → CI에서 pyproject vs lock diff 검사 권장.
- 보안 스캔/라이선스 검증은 lock을 기준으로 수행하면 transitive까지 정확히 파악 가능.
- 긴 범위(`>=`, `<`)보다 **좁은 범위 또는 고정 버전** + 주기적 업그레이드 윈도우 설정으로 예측 가능성 유지.

**문제/경고 사례:**  

- (A) `uv pip install` 로 임시 추가 후 `uv add` 생략 → pyproject 누락 → lock과 실행 환경 괴리 → 장기적 재현성 저하.
- (B) 수동으로 lock 삭제 후 sync → 해석 다시 수행, 결과가 이전과 달라 빌드 재현성 깨짐.
- (C) Python 버전 변경 (`.python-version`) 후 기존 lock 유지 → 일부 패키지 환경별 선택적 의존성 충족 실패 가능 → 반드시 `uv lock` 재실행.

**업데이트 패턴 요약:**  

| 작업 | 권장 명령 | 이유 |
|------|-----------|------|
| 새 패키지 추가 | `uv add <pkg>` → `uv lock` (자동) | 선언 + 해석 일관성 |
| 다수 업그레이드 | `uv lock --upgrade` | 전체 그래프 재평가 |
| Python 버전 변경 | `uv python pin` → `uv lock` | 호환 재검증 |
| 임시 설치 후 승격 | `uv pip install <pkg>` 테스트 → `uv add <pkg>` | 의존성 의도 반영 |
| CI 설치 | `uv sync --frozen` (예정 기능 또는 검증 스크립트) | lock 불일치 탐지 |

## 의존성 추가 전략: `uv add` vs `uv pip install`

`uv add` 사용 시:
- 프로젝트 선언적 관리 (pyproject.toml에 기록)
- 일반/개발 의존성 명확히 구분
- 버전 정책 + 추후 잠금/동기화 자동화 용이

`uv pip install` 사용 시:
- 즉시 설치 / 임시 테스트 / 기존 pip 습관 유지
- 선언적 목록에 자동 반영되지 않음 (freeze 필요)

사용 가이드:
- 팀/공유/장기 유지 프로젝트 → `uv add`
- 실험/일회성/REPL → `uv pip install`

## 핵심 명령어 요약

패키지:
```
uv add requests
uv add --dev pytest
uv remove requests
uv pip install -r requirements.txt
uv pip uninstall <name>
```
잠금 & 동기화:
```
uv lock
uv sync            # lock 기반 설치
uv sync --dev      # dev 포함
```
가상환경 & Python:
```
uv venv --python 3.11
uv python install 3.11 3.12
uv python list
uv python pin 3.11
```
실행:
```
uv run script.py
uv run --python 3.11 -m pytest
```

## 마이그레이션 가이드 (pip / poetry → uv)

1. 기존 가상환경 비활성화 & 정리 (`deactivate`)
2. 프로젝트 루트에서 `uv init` (기존 `pyproject.toml` 있으면 보존, dependencies 재구성)
3. 이전 `requirements.txt` → `uv pip install -r requirements.txt` 후 `uv add`로 선언적 이전 권장
4. Poetry → dependencies/ group(dev) 항목을 `uv add (--dev)`로 재작성
5. `poetry.lock` → 필요한 버전 명시 후 `uv lock` 생성
6. CI 스크립트: `poetry install` 대체 `uv sync`; `poetry run` → `uv run`
7. 캐시 활용 위해 전역 설치 경로 권한 및 PATH 확인
