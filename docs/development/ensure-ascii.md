---
title: ensure_ascii
parent: 개발
nav_order: 42
description: ASCII, 유니코드, UTF-8의 관계와 Python JSON 직렬화에서 ensure_ascii 옵션이 한글 출력에 미치는 영향을 설명합니다.
---

# ensure_ascii와 한글 JSON 출력
{:.no_toc}

Python에서 JSON을 출력할 때 한글이 `\ud558\ub77d`처럼 깨져 보이는 이유와 해결법.

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## ASCII란 무엇인가

ASCII(American Standard Code for Information Interchange)는 1963년에 만들어진 문자 인코딩 표준입니다. 영문 알파벳, 숫자, 기본 기호를 **7비트(128개 문자)**로 표현합니다.

| 범위 | 내용 |
|------|------|
| 0–31 | 제어 문자 (줄바꿈, 탭 등) |
| 32–126 | 출력 가능 문자 (A–Z, a–z, 0–9, 특수문자) |
| 127 | DEL |

```
A = 65
a = 97
0 = 48
```

128개 문자로 영어권 사용은 충분했지만, **한국어·중국어·일본어·아랍어** 등 비영어권 언어는 표현할 수 없었습니다.

---

## 유니코드 (Unicode)

ASCII의 한계를 극복하기 위해 만들어진 국제 표준입니다. 전 세계 모든 문자에 고유한 **코드 포인트(Code Point)**를 부여합니다.

```
한 = U+D55C
글 = U+AE00
A  = U+0041
```

현재 유니코드는 **14만 개 이상**의 문자를 포함하며, 이모지도 유니코드로 정의됩니다.

```
🌑 = U+1F311
🌘 = U+1F318
```

유니코드는 **"어떤 문자에 어떤 번호를 부여한다"**는 규격이고, 실제 메모리/파일에 어떻게 저장하는지는 별개의 문제입니다. 그 저장 방식이 바로 인코딩입니다.

---

## UTF-8 인코딩

UTF-8(Unicode Transformation Format - 8-bit)은 유니코드 코드 포인트를 실제 바이트로 저장하는 방식 중 가장 널리 쓰이는 인코딩입니다.

### 핵심 특징

- **가변 길이**: 문자에 따라 1~4바이트 사용
- **ASCII 호환**: ASCII 문자(0–127)는 그대로 1바이트로 표현
- **한글**: 3바이트 사용

```
A     → 1바이트: 0x41
한    → 3바이트: 0xED 0x95 0x9C
🌑   → 4바이트: 0xF0 0x9F 0x8C 0x91
```

### ASCII와의 관계

UTF-8은 ASCII의 상위 호환입니다. ASCII 텍스트는 UTF-8로 읽어도 동일하게 동작합니다. 반면 한글을 ASCII로 표현하는 방법은 없습니다.

---

## JSON에서 한글 표현

JSON 스펙(RFC 8259)은 문자열을 UTF-8로 저장하도록 권장하지만, **비ASCII 문자를 `\uXXXX` 형식의 이스케이프로 표현하는 것도 허용**합니다.

두 표현은 **완전히 동일한 데이터**입니다.

```json
// 이스케이프 표현 (ASCII만 사용)
{"name": "\ud558\ub77d \ucd94\uc138"}

// UTF-8 직접 표현
{"name": "하락 추세"}
```

`\uD55C`는 `한`의 유니코드 코드 포인트 U+D55C를 JSON 이스케이프로 표기한 것입니다.

---

## Python의 ensure_ascii

Python `json` 모듈은 기본적으로 `ensure_ascii=True`로 동작합니다. 이 옵션이 켜져 있으면 비ASCII 문자를 모두 `\uXXXX` 이스케이프로 변환합니다.

```python
import json

data = {"name": "하락 추세", "emoji": "🌑"}

# 기본값: ensure_ascii=True
print(json.dumps(data))
# {"name": "\ud558\ub77d \ucd94\uc138", "emoji": "\ud83c\udf11"}

# ensure_ascii=False
print(json.dumps(data, ensure_ascii=False))
# {"name": "하락 추세", "emoji": "🌑"}
```

### 왜 기본값이 True일까

JSON이 처음 설계될 때 ASCII 환경에서도 안전하게 전송되도록 비ASCII 문자를 이스케이프하는 것이 관행이었습니다. Python도 이 관행을 기본값으로 채택했습니다.

오늘날 대부분의 시스템은 UTF-8을 지원하므로, `ensure_ascii=False`를 사용하는 것이 사람이 읽기에 훨씬 유리합니다.

---

## 실전 예시

### curl + python3 -m json.tool

```bash
# 기본: 한글이 이스케이프로 출력됨
curl -s http://api.example.com/data | python3 -m json.tool

# 출력:
# {"state": "\ud558\ub77d \ucd94\uc138"}
```

`python3 -m json.tool`은 내부적으로 `ensure_ascii=True`를 사용합니다.

```bash
# 해결: ensure_ascii=False로 재직렬화
curl -s http://api.example.com/data | \
  python3 -c "import json,sys; print(json.dumps(json.load(sys.stdin), ensure_ascii=False, indent=2))"

# 출력:
# {"state": "하락 추세"}
```

### jq 사용

`jq`는 기본적으로 유니코드 문자를 그대로 출력합니다.

```bash
curl -s http://api.example.com/data | jq .
# {"state": "하락 추세"}
```

### 파일 저장 시

```python
import json

data = {"message": "안녕하세요"}

# 파일에 한글 그대로 저장
with open("output.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
```

---

## 정리

| 개념 | 설명 |
|------|------|
| **ASCII** | 영어·숫자·기호 128자를 위한 7비트 인코딩 |
| **유니코드** | 전 세계 문자에 코드 포인트를 부여하는 국제 표준 |
| **UTF-8** | 유니코드를 1~4바이트로 저장하는 인코딩 방식. ASCII 호환 |
| **`\uXXXX`** | 유니코드 코드 포인트의 JSON 이스케이프 표현. 데이터는 동일 |
| **`ensure_ascii=True`** | Python json 기본값. 비ASCII를 `\uXXXX`로 출력 |
| **`ensure_ascii=False`** | 한글·이모지 등을 그대로 출력. 사람이 읽기 쉬움 |

데이터 자체는 변하지 않습니다. `ensure_ascii`는 **출력 표현 방식**만 제어하는 옵션입니다.
