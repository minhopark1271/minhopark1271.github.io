---
title: UV
parent: 개발
nav_order: 2
description: "UV 패키지 매니저 완벽 가이드. Rust로 작성된 초고속 Python 버전 및 가상환경 관리. pyproject.toml, uv.lock, 핵심 명령어 사용법."
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

---

## 프로젝트 초기화 시 생성 파일

- `pyproject.toml`: 프로젝트 메타 + dependencies 배열 관리 (hatchling 기본 빌드 백엔드)
- `.python-version`: 고정 Python 버전 (예: 3.11)
- `uv.lock`: 의존성 해석 결과 고정 (버전 관리 시스템에 포함 권장)
- `requirements.txt` / `requirements-dev.txt`: freeze 출력물 (선택적 공유)
- `.venv/`: 가상환경 디렉토리 (bin / lib / include)

### `pyproject.toml` 와 `uv.lock` 관계

**역할 분담:**  

- `pyproject.toml`: "선언적 의도" (직접 의존성, 버전 범위, 메타데이터, 최소 Python 버전 등)
- `uv.lock`: "구체적 결과값" (모든 직·간접 의존성의 **정확한 버전 + 해시** 스냅샷)

---

## 실행 흐름 예 

### 초기화 및 사용 예

1. 초기화: `uv init` → 빈 dependencies / 기본 메타 생성
2. 의존성 추가: `uv add fastapi` → pyproject 수정 + 즉시 해석 → lock 갱신
3. 팀 공유: pyproject + lock 커밋 → 동료는 `uv sync`로 동일 그래프 재현
4. 범위 변경: `pyproject.toml` 에서 `requests = "^2.31"` 를 `"^2.32"` 로 올림 → **lock 재생성 필요** (`uv lock`)
5. 설치 재현: 클린 환경에서 `uv sync` 실행 → lock 기준 설치 (변동 없음)
6. 업그레이드: `uv lock --upgrade` (주의: 존재할 경우 전체 그래프 재평가)

### 의존성 추가 후 스크립트 실행

1. `uv add requests` → pyproject 수정 + 해석 + (필요 시) lock 갱신
2. `uv lock` (자동 또는 명시) → 결정된 버전 스냅샷 저장
3. `uv sync` → venv 생성/업데이트 + 캐시 활용 설치
4. `uv run script.py` → 활성화 자동 처리 후 실행

### 의존성 추가 전략: `uv add` vs `uv pip install`

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

---

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

---

## Trouble shotting

### 어떤 파이썬 버전 사용중인지 확인

```
which python
which pip

uv python list

uv pip install <패키지> --python 3.11
```

### uv가 사용하는 파이썬 버전 지정

```
uv python pin python3.11
>>> Pinned `.python-version` to `3.11`
```

### 가상환경 재설치

```
# 가상환경 안밖 pip 버전 확인
uv pip list
python -m pip list

uv venv .venv
source .venv/bin/activate
uv pip install <패키지>
```

