---
title: CRLF
parent: 개발
nav_order: 43
description: CR(Carriage Return)과 LF(Line Feed)의 타자기 유래, 표현 방식, OS별 차이, 그리고 Git에서 줄바꿈 호환성을 처리하는 방법을 정리합니다.
---

# CR, LF, CRLF — 줄바꿈 문자의 유래와 OS별 차이
{:.no_toc}

줄바꿈(newline)은 단순해 보이지만, OS마다 다른 방식을 채택하면서 개발자들에게 끊임없이 문제를 일으키는 주제입니다.

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## CR과 LF란?

| 문자 | 이름 | ASCII 코드 | 이스케이프 | 의미 |
|------|------|-----------|-----------|------|
| **CR** | Carriage Return | 13 (0x0D) | `\r` | 커서를 현재 줄의 **맨 앞**으로 이동 |
| **LF** | Line Feed | 10 (0x0A) | `\n` | 커서를 **다음 줄**로 이동 |

- **CR + LF** (`\r\n`): 줄의 맨 앞으로 돌아간 뒤 다음 줄로 이동 → "줄바꿈"의 완전한 동작
- 현대에는 이 두 동작을 하나로 합쳐 "줄바꿈"이라 부르지만, 역사적으로는 별개의 기계적 동작이었습니다.

---

## 타자기에서의 유래

CR과 LF의 기원은 **기계식 타자기**입니다.

### 캐리지 리턴 (Carriage Return)

타자기에는 종이를 고정하는 **캐리지(carriage)**가 있었습니다. 글자를 타이핑하면 캐리지가 왼쪽에서 오른쪽으로 이동합니다. 줄 끝에 도달하면 **레버를 당겨 캐리지를 맨 왼쪽으로 되돌리는 동작**이 캐리지 리턴입니다.

### 라인 피드 (Line Feed)

캐리지를 되돌린 뒤 **종이를 한 줄 위로 올리는 동작**이 라인 피드입니다. 이 두 동작을 합쳐야 비로소 "다음 줄의 시작"으로 이동하게 됩니다.

### 텔레타이프로의 전승

1901년 **보도 코드(Baudot code)**에 이미 CR과 LF가 별도 문자로 존재했습니다. 초기 텔레타이프(전신 인쇄기)에서 인쇄 헤드가 오른쪽 끝에서 왼쪽 시작점으로 돌아오는 데 물리적 시간이 필요했기 때문에, **CR 다음에 LF를 보내면서 그 사이에 패딩 문자를 넣어** 인쇄 헤드의 복귀 시간을 확보했습니다.

```
... 텍스트 끝 → CR (헤드 복귀 시작) → [패딩] → LF (종이 이동) → 다음 줄 시작
```

이 물리적 제약이 CR과 LF를 분리된 두 문자로 유지시킨 핵심 이유입니다.

---

## OS별 줄바꿈 방식

### 왜 달라졌는가?

1970년대 이후 각 운영체제가 독립적으로 줄바꿈 표현을 결정하면서 분기가 발생했습니다.

| OS | 줄바꿈 문자 | 표현 | 비고 |
|----|-----------|------|------|
| **Windows** | CR+LF | `\r\n` | DOS에서 계승. 타자기/텔레타이프 전통 유지 |
| **Unix/Linux** | LF | `\n` | 단순화. 한 문자로 충분하다는 설계 철학 |
| **macOS** | LF | `\n` | OS X(2001) 이후 Unix 기반으로 전환 |
| **Classic Mac** (OS 9 이전) | CR | `\r` | 현재는 사실상 사용되지 않음 |

### Windows — CRLF (`\r\n`)

MS-DOS가 CP/M의 관례를 이어받았고, CP/M은 텔레타이프의 CR+LF 관례를 따랐습니다. Windows는 이 전통을 계속 유지합니다.

```
Hello World!\r\n
Second line\r\n
```

### Unix/Linux/macOS — LF (`\n`)

Unix를 설계한 **Ken Thompson**은 줄바꿈에 2바이트를 쓰는 것이 낭비라고 판단하여 LF 한 문자만 사용했습니다. 이후 Linux와 macOS(OS X부터)가 이 방식을 따릅니다.

```
Hello World!\n
Second line\n
```

---

## 실제로 어떤 문제가 발생하는가?

### 1. diff가 파일 전체를 변경된 것으로 표시

Windows 사용자가 LF 파일을 열어 저장하면 모든 줄에 `\r`이 추가되어, 실제 코드 변경이 없어도 **모든 줄이 수정된 것**으로 나타납니다.

### 2. 셸 스크립트 실행 오류

```bash
#!/bin/bash\r\n    # ← \r 때문에 인터프리터를 찾지 못함
```

`\r`이 포함된 셸 스크립트는 `/bin/bash\r: No such file or directory` 에러를 발생시킵니다.

### 3. CSV/데이터 파싱 오류

줄 끝에 보이지 않는 `\r`이 남아 문자열 비교가 실패하거나, 마지막 필드에 `\r`이 붙는 문제가 발생합니다.

---

## 호환성 처리 방법

### 1. Git — `core.autocrlf` 설정

Git은 줄바꿈 자동 변환 기능을 제공합니다.

| 설정값 | commit 시 | checkout 시 | 권장 OS |
|--------|----------|------------|---------|
| `true` | CRLF → LF | LF → CRLF | Windows |
| `input` | CRLF → LF | 변환 없음 | macOS/Linux |
| `false` | 변환 없음 | 변환 없음 | 수동 관리 |

```bash
# Windows
git config --global core.autocrlf true

# macOS / Linux
git config --global core.autocrlf input
```

### 2. `.gitattributes` — 저장소 단위 설정 (권장)

`core.autocrlf`는 개인 설정이므로 팀원마다 다를 수 있습니다. **`.gitattributes`** 파일로 저장소 수준에서 강제하는 것이 확실합니다.

```gitattributes
# 텍스트 파일: Git이 자동 감지 후 LF로 정규화
* text=auto

# 특정 파일 강제 지정
*.sh    text eol=lf
*.bat   text eol=crlf
*.py    text eol=lf
*.js    text eol=lf

# 바이너리 파일: 변환하지 않음
*.png   binary
*.jpg   binary
*.zip   binary
```

- `text=auto`: Git이 텍스트/바이너리를 자동 판별
- `eol=lf`: 항상 LF로 저장 (OS 무관)
- `eol=crlf`: 항상 CRLF로 저장
- `binary`: 변환하지 않음

### 3. 에디터 설정

대부분의 코드 에디터에서 줄바꿈 방식을 지정할 수 있습니다.

**VS Code** — `settings.json`:

```json
{
  "files.eol": "\n"
}
```

**EditorConfig** — `.editorconfig`:

```ini
[*]
end_of_line = lf
charset = utf-8
```

### 4. 기존 파일 일괄 변환

이미 CRLF가 섞인 파일을 정리하려면:

```bash
# dos2unix 설치 (macOS)
brew install dos2unix

# 단일 파일 변환
dos2unix file.txt          # CRLF → LF
unix2dos file.txt          # LF → CRLF

# 디렉토리 일괄 변환
find . -name "*.py" -exec dos2unix {} +
```

Git 저장소 전체를 정규화하려면:

```bash
# .gitattributes 설정 후
git add --renormalize .
git commit -m "Normalize line endings"
```

---

## 정리

| 항목 | 설명 |
|------|------|
| **CR (`\r`)** | 커서를 줄 맨 앞으로 (타자기 캐리지 복귀) |
| **LF (`\n`)** | 커서를 다음 줄로 (종이 한 줄 올림) |
| **CRLF (`\r\n`)** | Windows 줄바꿈 (타자기 전통 유지) |
| **LF (`\n`)** | Unix/macOS 줄바꿈 (단순화) |
| **Git 호환** | `.gitattributes` + `core.autocrlf`로 팀 단위 통일 |
| **에디터 호환** | `.editorconfig` 또는 에디터 설정으로 LF 통일 |

핵심 원칙: **저장소에는 LF로 통일하고, 로컬 checkout 시 OS에 맞게 변환**하는 것이 가장 안전한 전략입니다.
