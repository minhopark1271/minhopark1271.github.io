---
title: asdf-vm
parent: 개발
nav_order: 54
description: asdf-vm으로 Node.js, Python, Ruby 등 모든 런타임 버전을 하나의 CLI로 통합 관리하는 방법과 .tool-versions 설정을 설명합니다.
---

# asdf-vm 통합 런타임 버전 관리
{:.no_toc}

nvm, pyenv, rbenv를 하나로 대체하는 멀티 런타임 버전 매니저.

### Link

- [asdf-vm 공식 사이트](https://asdf-vm.com/)
- [asdf GitHub](https://github.com/asdf-vm/asdf)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## asdf란

asdf는 **하나의 CLI로 모든 프로그래밍 언어와 도구의 버전을 관리**하는 도구입니다. Node.js는 nvm, Python은 pyenv, Ruby는 rbenv처럼 언어마다 별도 버전 매니저를 사용하는 대신, asdf 하나로 모든 것을 통합합니다.

핵심은 `.tool-versions` 파일입니다. 이 파일 하나에 프로젝트에서 사용하는 모든 도구와 버전을 선언하면, 팀 전체가 동일한 개발 환경을 즉시 구성할 수 있습니다.

---

## 기존 버전 매니저와 비교

| 항목 | 도구별 매니저 (nvm, pyenv 등) | asdf |
|------|---------------------------|------|
| 설치 도구 수 | 언어마다 1개씩 | 1개 |
| 명령어 체계 | 도구마다 다름 | 통일 |
| 설정 파일 | `.nvmrc`, `.python-version` 등 분산 | `.tool-versions` 1개로 통합 |
| 새 언어 추가 | 새 매니저 학습 필요 | `asdf plugin add`로 완료 |
| 레거시 호환 | 해당 도구만 | `.nvmrc`, `.ruby-version` 등 기존 파일도 인식 |

---

## 설치

### macOS (Homebrew)

```bash
brew install asdf
```

### Linux (소스 빌드)

```bash
# 의존성 설치
apt install git bash curl

# 소스 클론 및 빌드
git clone https://github.com/asdf-vm/asdf.git --branch v0.18.1
cd asdf
make

# 빌드된 바이너리를 PATH에 추가
cp asdf /usr/local/bin/
```

### Go를 통한 설치

```bash
go install github.com/asdf-vm/asdf/cmd/asdf@v0.18.1
```

---

## 셸 설정

### Bash (`~/.bash_profile`)

```bash
export PATH="${ASDF_DATA_DIR:-$HOME/.asdf}/shims:$PATH"
```

### Zsh (`~/.zshrc`)

```bash
export PATH="${ASDF_DATA_DIR:-$HOME/.asdf}/shims:$PATH"

# 자동완성 설정
mkdir -p "${ASDF_DATA_DIR:-$HOME/.asdf}/completions"
asdf completion zsh > "${ASDF_DATA_DIR:-$HOME/.asdf}/completions/_asdf"
fpath=(${ASDF_DATA_DIR:-$HOME/.asdf}/completions $fpath)
autoload -Uz compinit && compinit
```

### Fish (`~/.config/fish/config.fish`)

```fish
set -gx PATH (string join : $ASDF_DATA_DIR ~/.asdf)/shims $PATH
```

셸 설정 후 **터미널을 재시작**해야 적용됩니다.

---

## 플러그인 관리

asdf는 **플러그인 시스템**으로 도구를 확장합니다. 각 언어/도구마다 플러그인이 존재하며, 추가하면 해당 도구의 버전을 관리할 수 있습니다.

### 공식 플러그인

| 언어 | 플러그인 URL |
|------|------------|
| Node.js | `https://github.com/asdf-vm/asdf-nodejs` |
| Ruby | `https://github.com/asdf-vm/asdf-ruby` |
| Elixir | `https://github.com/asdf-vm/asdf-elixir` |
| Erlang | `https://github.com/asdf-vm/asdf-erlang` |

커뮤니티 플러그인은 [asdf-community](https://github.com/asdf-community)와 [GitHub Topics](https://github.com/topics/asdf-plugin)에서 찾을 수 있습니다. Python, Java, Go, Rust 등 주요 언어 대부분을 지원합니다.

### 명령어

```bash
# 플러그인 추가
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf plugin add python                       # 단축명 사용

# 설치된 플러그인 목록
asdf plugin list
asdf plugin list --urls                       # URL 포함

# 모든 사용 가능한 플러그인 검색
asdf plugin list all

# 플러그인 업데이트
asdf plugin update --all                      # 전체 업데이트
asdf plugin update nodejs                     # 특정 플러그인만

# 플러그인 제거 (설치된 모든 버전도 함께 삭제)
asdf plugin remove nodejs
```

---

## 버전 관리

### 버전 설치

```bash
# 특정 버전 설치
asdf install nodejs 20.11.0

# 최신 안정 버전 설치
asdf install nodejs latest

# 특정 메이저의 최신 버전
asdf install nodejs latest:20
```

### 버전 설정

```bash
# 현재 프로젝트에 설정 (현재 디렉토리의 .tool-versions에 기록)
asdf set nodejs 20.11.0

# 글로벌 설정 ($HOME/.tool-versions에 기록)
asdf set -u nodejs 20.11.0

# 시스템에 설치된 버전 사용
asdf set nodejs system
```

### 버전 조회

```bash
# 현재 사용 중인 버전 확인
asdf current                                  # 모든 도구
asdf current nodejs                           # 특정 도구

# 설치된 버전 목록
asdf list nodejs

# 설치 가능한 모든 버전
asdf list all nodejs
asdf list all nodejs 20                       # 20.x만 필터링

# 최신 안정 버전 확인
asdf latest nodejs
```

### 버전 제거

```bash
asdf uninstall nodejs 18.0.0
```

---

## .tool-versions 파일

프로젝트 루트에 `.tool-versions` 파일을 두면 해당 디렉토리와 하위 디렉토리에서 자동으로 적용됩니다.

### 형식

```
nodejs 20.11.0
python 3.11.7
ruby 3.3.0
```

### 지원하는 버전 표기

| 표기 | 설명 | 예시 |
|------|------|------|
| `x.y.z` | 실제 버전 | `nodejs 20.11.0` |
| `latest` | 최신 안정 버전 | `nodejs latest` |
| `latest:x` | 메이저별 최신 | `nodejs latest:20` |
| `ref:tag` | Git 태그/브랜치/커밋 | `elixir ref:v1.0.2` |
| `path:경로` | 커스텀 빌드 경로 | `elixir path:~/src/elixir` |
| `system` | 시스템 버전 사용 | `nodejs system` |

여러 버전을 공백으로 나열하면 **폴백 체인**이 됩니다. 첫 번째 버전이 없으면 다음 버전을 시도합니다.

### 버전 결정 우선순위

1. 환경변수 `ASDF_${TOOL}_VERSION` (예: `ASDF_NODEJS_VERSION=20.11.0`)
2. 현재 디렉토리의 `.tool-versions`
3. 상위 디렉토리의 `.tool-versions` (루트까지 탐색)
4. `$HOME/.tool-versions` (글로벌 설정)

---

## 설정 (.asdfrc)

`$HOME/.asdfrc` 파일로 asdf 동작을 커스터마이즈할 수 있습니다.

| 옵션 | 기본값 | 설명 |
|------|--------|------|
| `legacy_version_file` | `no` | `.nvmrc`, `.ruby-version` 등 레거시 파일 인식 |
| `always_keep_download` | `no` | 설치 후 소스/바이너리 보관 |
| `concurrency` | `auto` | 컴파일 시 CPU 코어 수 |
| `plugin_repository_last_check_duration` | `60` | 플러그인 저장소 동기화 간격(분) |

```
legacy_version_file = yes
```

`legacy_version_file = yes`로 설정하면 기존 `.nvmrc`, `.node-version`, `.ruby-version`, `.python-version` 파일도 인식합니다. 다른 버전 매니저에서 마이그레이션할 때 유용합니다.

### 주요 환경변수

| 변수 | 설명 |
|------|------|
| `ASDF_CONFIG_FILE` | `.asdfrc` 파일 경로 (기본: `$HOME/.asdfrc`) |
| `ASDF_DATA_DIR` | 플러그인, shim, 버전 설치 위치 (기본: `$HOME/.asdf`) |
| `ASDF_CONCURRENCY` | 컴파일 시 사용할 코어 수 |

---

## 실전 워크플로우

### 새 프로젝트 셋업

```bash
# 1. 필요한 플러그인 추가
asdf plugin add nodejs
asdf plugin add python

# 2. 버전 설치
asdf install nodejs 20.11.0
asdf install python 3.11.7

# 3. 프로젝트 버전 설정
cd my-project
asdf set nodejs 20.11.0
asdf set python 3.11.7

# 4. .tool-versions 파일이 자동 생성됨
cat .tool-versions
# nodejs 20.11.0
# python 3.11.7

# 5. .tool-versions를 Git에 커밋
git add .tool-versions
git commit -m "Add .tool-versions"
```

### 기존 프로젝트 참여

```bash
# 1. 프로젝트 클론
git clone https://github.com/team/project.git
cd project

# 2. .tool-versions에 명시된 플러그인 추가 후 설치
asdf plugin add nodejs
asdf plugin add python
asdf install
# .tool-versions의 모든 도구를 자동으로 설치
```

### nvm에서 마이그레이션

```bash
# 1. .asdfrc에 레거시 파일 지원 활성화
echo "legacy_version_file = yes" >> ~/.asdfrc

# 2. asdf nodejs 플러그인 추가
asdf plugin add nodejs

# 3. 기존 .nvmrc 파일이 자동 인식됨
# 추후 .tool-versions로 전환 가능
```

---

## 정리

| 특징 | 설명 |
|------|------|
| **통합 관리** | 모든 언어/도구를 하나의 CLI로 |
| **팀 동기화** | `.tool-versions` 커밋으로 환경 통일 |
| **간단한 확장** | `asdf plugin add`로 새 도구 추가 |
| **레거시 호환** | `.nvmrc`, `.ruby-version` 등 기존 파일 인식 |
| **CI/CD 통합** | GitHub Actions 지원 |

프로젝트에서 2개 이상의 런타임을 사용한다면, 도구별 매니저 대신 asdf로 통합하는 것이 관리 효율성 면에서 유리합니다.
