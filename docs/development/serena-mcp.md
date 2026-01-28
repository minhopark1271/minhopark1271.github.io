---
title: "Serena MCP"
parent: 개발
nav_order: 35
description: "Serena MCP의 심볼 기반 코드 탐색 원리를 저수준에서 설명합니다. Lexing, AST, LSP를 거쳐 AI가 코드를 텍스트가 아닌 구조로 이해하는 과정과 실제 시연을 포함합니다."
---

# Serena MCP: 심볼 기반 코드 탐색의 원리
{:.no_toc}

AI 코딩 도구가 코드를 텍스트가 아닌 **구조(심볼)**로 이해하는 방법을 Serena MCP를 통해 설명합니다. Lexing부터 LSP까지의 저수준 동작 원리와 실제 프로젝트에서의 시연을 포함합니다.

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## Serena MCP란

Serena는 **시맨틱 코딩 도구(Semantic Coding Tools)**를 제공하는 MCP 서버입니다. MCP(Model Context Protocol)는 LLM이 외부 도구에 표준화된 방식으로 접근하는 프로토콜인데, Serena는 이 프로토콜 위에서 **코드의 구조를 이해하고 조작하는 기능**을 제공합니다.

일반적인 텍스트 편집 도구(Read/Edit)는 파일을 문자열로 다룹니다. 반면 Serena는 코드를 **클래스, 함수, 변수** 등의 심볼 단위로 인식합니다.

---

## 핵심 기능

### 심볼 기반 코드 탐색

| 도구 | 역할 |
|---|---|
| `get_symbols_overview` | 파일 내 클래스, 함수, 변수 등의 심볼 목록을 한눈에 파악 |
| `find_symbol` | 이름 패턴으로 심볼 검색 (예: `MyClass/my_method`) |
| `find_referencing_symbols` | 특정 심볼을 참조하는 모든 코드 위치 탐색 |

### 심볼 기반 코드 편집

| 도구 | 역할 |
|---|---|
| `replace_symbol_body` | 함수/클래스 전체를 새 코드로 교체 |
| `insert_before_symbol` / `insert_after_symbol` | 심볼 앞뒤에 코드 삽입 |
| `rename_symbol` | 코드베이스 전체에서 심볼 이름 변경 (리팩토링) |
| `replace_content` | regex 기반 부분 편집 (몇 줄만 수정할 때) |

### 기타

- **파일 시스템 접근**: `read_file`, `create_text_file`, `list_dir`, `find_file`, `search_for_pattern`
- **메모리 시스템**: `write_memory` / `read_memory`로 프로젝트 정보를 대화 간에 유지
- **프로젝트 관리**: `activate_project`, `switch_modes`, `onboarding`

---

## 전체 아키텍처

```
Claude Code ←→ MCP Protocol ←→ Serena Server ←→ LSP (Language Server Protocol)
                                                    ↓
                                              코드베이스 분석
                                          (심볼 트리, 참조 관계 등)
```

Serena는 내부적으로 **LSP(Language Server Protocol)**를 활용합니다. LSP는 VS Code 같은 IDE가 코드 자동완성, 정의로 이동, 참조 찾기에 사용하는 것과 동일한 프로토콜입니다.

---

## 심볼(Symbol)이란

프로그래밍 언어에서 **이름이 붙은 코드 엔티티**를 의미합니다.

```python
class TradingBot:          # 심볼: 클래스 (kind=5)
    def __init__(self):    # 심볼: 메서드 (kind=6), 부모: TradingBot
        self.balance = 0   # 심볼: 변수/프로퍼티 (kind=13)

    def execute(self):     # 심볼: 메서드 (kind=6), 부모: TradingBot
        pass

def helper():              # 심볼: 함수 (kind=12), 최상위
    pass

MAX_RETRY = 3              # 심볼: 상수/변수 (kind=13), 최상위
```

각 심볼이 가지는 정보:

- **name_path**: 심볼 트리 내 경로 (예: `TradingBot/execute`)
- **kind**: LSP 표준 심볼 종류 번호 (Class=5, Method=6, Function=12, Variable=13 등)
- **location**: 파일 경로 + 시작/끝 행·열 번호
- **children**: 하위 심볼 목록 (클래스 → 메서드들)

---

## 저수준 동작 원리

심볼 탐색이 실제로 어떤 과정을 거치는지, 소스 코드에서 심볼 테이블까지의 변환 과정을 단계별로 설명합니다.

### 1단계: 렉싱 (Lexing)

소스 코드를 **토큰 스트림**으로 변환합니다. 코드의 문자열을 의미 있는 최소 단위로 쪼개는 작업입니다.

```
"def predict(self, data):"
  → [DEF, IDENTIFIER("predict"), LPAREN, IDENTIFIER("self"), COMMA,
     IDENTIFIER("data"), RPAREN, COLON]
```

### 2단계: 파싱 (Parsing) → AST 생성

토큰 스트림을 **추상 구문 트리(Abstract Syntax Tree)**로 변환합니다. 코드의 계층 구조가 트리 형태로 표현됩니다.

```
FunctionDef
├── name: "predict"
├── args:
│   ├── arg: "self"
│   └── arg: "data"
├── body:
│   ├── Assign(target="result", value=Call(...))
│   └── Return(value=Name("result"))
└── decorators: []
```

### 3단계: 스코프 분석 & 타입 추론

AST를 순회하며 각 이름의 **정의(definition)**와 **참조(reference)** 관계를 구축합니다. 이 과정에서 심볼 테이블과 참조 인덱스가 만들어집니다.

```
Symbol Table:
┌──────────────────────┬──────────┬─────────────────────────┐
│ name_path            │ kind     │ defined_at              │
├──────────────────────┼──────────┼─────────────────────────┤
│ PredictionModel      │ Class    │ prediction_model.py:10  │
│ PredictionModel/     │          │                         │
│   __init__           │ Method   │ prediction_model.py:11  │
│ PredictionModel/     │          │                         │
│   predict            │ Method   │ prediction_model.py:27  │
└──────────────────────┴──────────┴─────────────────────────┘

Reference Index:
┌──────────────────────┬─────────────────────────────────────┐
│ symbol               │ referenced_at                       │
├──────────────────────┼─────────────────────────────────────┤
│ PredictionModel      │ api/routes.py:45                    │
│                      │ dashboard/components/view.py:12     │
│ PredictionModel/     │                                     │
│   predict            │ api/routes.py:52                    │
│                      │ prediction/runner.py:30             │
└──────────────────────┴─────────────────────────────────────┘
```

### 4단계: 인덱스 유지

Language Server는 이 정보를 **메모리 내 인덱스**로 유지합니다. 파일 변경 시 전체를 다시 파싱하지 않고 **증분 업데이트(incremental update)**만 수행합니다.

### 전체 흐름 요약

```
소스 코드
    ↓ Lexer
토큰 스트림
    ↓ Parser
AST (추상 구문 트리)
    ↓ Semantic Analysis
심볼 테이블 + 참조 인덱스 + 타입 정보
    ↓ LSP Protocol (JSON-RPC)
Serena (심볼 기반 도구 제공)
    ↓ MCP Protocol
Claude Code (심볼 단위로 코드 이해·편집)
```

---

## LSP 통신의 실제 모습

Serena가 `get_symbols_overview`를 호출하면 내부적으로 다음과 같은 JSON-RPC 통신이 발생합니다.

```json
// Serena → Language Server (요청)
{
  "method": "textDocument/documentSymbol",
  "params": {
    "textDocument": { "uri": "file:///path/to/prediction_model.py" }
  }
}

// Language Server → Serena (응답)
[
  {
    "name": "PredictionModel",
    "kind": 5,
    "range": {
      "start": {"line": 10, "character": 0},
      "end": {"line": 85, "character": 0}
    },
    "children": [
      {
        "name": "__init__",
        "kind": 6,
        "range": {"start": {"line": 11}, "end": {"line": 25}}
      },
      {
        "name": "predict",
        "kind": 6,
        "range": {"start": {"line": 27}, "end": {"line": 55}}
      }
    ]
  }
]
```

### Serena 도구 → LSP 요청 매핑

| Serena 도구 | LSP 요청 | 용도 |
|---|---|---|
| `get_symbols_overview` | `textDocument/documentSymbol` | 파일 내 심볼 트리 조회 |
| `find_symbol` | `workspace/symbol` + 필터링 | 이름 패턴으로 심볼 검색 |
| `find_referencing_symbols` | `textDocument/references` | 심볼 참조 위치 탐색 |
| `rename_symbol` | `textDocument/rename` | 전체 코드베이스에서 이름 변경 |
| `replace_symbol_body` | LSP 위치 정보 활용 + 파일 편집 | 심볼 본문 교체 |

---

## grep과 심볼 탐색의 차이

동일한 이름 `model`이 여러 파일에서 다른 의미로 사용되는 경우를 봅시다.

```python
# utils.py
class Config:
    model = "lstm"          # (A) 클래스 변수

# train.py
from keras import Model
model = Model(inputs, outputs)  # (B) 로컬 변수
model.compile(...)

# dashboard.py
model = "prediction_model"  # (C) 문자열 할당
```

**grep `model`** → A, B, C 모두 매칭됩니다. 문맥 구분이 불가능합니다.

**LSP `find_referencing_symbols("Config/model")`** → **A만 정확히 반환**합니다. LSP는 스코프와 타입 정보를 알고 있기 때문에, 같은 이름이라도 어떤 심볼의 참조인지 구분할 수 있습니다.

| 일반 텍스트 편집 (Read/Edit) | Serena 심볼 편집 |
|---|---|
| 파일을 텍스트로 읽고 문자열 매칭으로 수정 | 코드 구조를 파악하여 심볼 단위로 수정 |
| `old_string` → `new_string` 치환 | `MyClass/my_method`의 본문 교체 |
| 참조 찾기는 grep에 의존 | LSP 기반 정확한 참조 추적 |

---

## 실제 프로젝트 시연

실제 Python 트레이딩 봇 프로젝트에서 심볼 탐색을 수행한 결과입니다. **파일 내용을 한 줄도 직접 읽지 않고** 코드 구조와 호출 관계를 파악하는 과정을 보여줍니다.

### 1단계: 파일의 심볼 개요 조회

`prediction_view.py` 파일의 구조를 확인합니다.

```
도구: get_symbols_overview("prediction_view.py", depth=1)

결과:
{
  "Constant": ["KST_OFFSET", "MODEL_CONFIG"],
  "Function": [
    "_to_kst_str",
    "render_prediction_page",
    "_render_chart",
    "_render_indicator_panel",
    "_render_history_table",
    "_render_model_info"
  ]
}
```

파일 내용을 열지 않고도 **상수 2개, 함수 6개**로 구성된 함수형 구조임을 바로 파악할 수 있습니다.

### 2단계: 특정 함수의 시그니처 확인

핵심 함수인 `render_prediction_page`의 상세 정보를 조회합니다.

```
도구: find_symbol("render_prediction_page", include_info=true)

결과:
- 위치: 54~180행 (127줄)
- 시그니처: def render_prediction_page(model_type: str) -> None
- 설명: "Render a full prediction dashboard page for the given model type."
```

127줄짜리 함수의 본문을 읽지 않고도 시그니처, 위치, 역할을 파악했습니다.

### 3단계: 이 함수를 호출하는 곳 탐색

```
도구: find_referencing_symbols("render_prediction_page")

결과:
- 51_scalping.py:4   → import
- 51_scalping.py:9   → render_prediction_page("scalping")
- 52_daytrading.py:4 → import
- 52_daytrading.py:9 → render_prediction_page("daytrading")
- 53_swing.py:4      → import
- 53_swing.py:9      → render_prediction_page("swing")
```

3개의 페이지 파일에서 각각 다른 `model_type` 인자로 호출되고 있음을 정확히 파악했습니다.

### 4단계: 관련 Repository의 구조 파악

```
도구: get_symbols_overview("gate_prediction_repository.py", depth=1)

결과:
{
  "Variable": ["logger"],
  "Function": [
    "insert_gate_prediction",
    "insert_batch_predictions",
    "list_predictions",
    "get_latest_prediction",
    "get_latest_prediction_by_type",
    "get_prediction_timeseries",
    "update_actual_price",
    "get_prediction"
  ]
}
```

Repository 패턴으로 구현된 8개의 CRUD 함수를 한눈에 파악합니다.

### 시연 요약

전체 탐색 과정에서 **파일 본문을 한 줄도 읽지 않았습니다.** 심볼 도구만으로 파악한 정보:

1. 파일 구조 (상수/함수 목록)
2. 함수 시그니처와 docstring
3. 함수가 호출되는 위치와 인자 값
4. 연관된 Repository의 API 목록

이것이 심볼 기반 코드 탐색의 실질적 장점입니다. 대규모 코드베이스에서 전체 파일을 읽는 대신, 필요한 정보만 정확하게 추출할 수 있습니다.

---

## 정리

Serena MCP는 LSP라는 검증된 인프라 위에 MCP 인터페이스를 얹어, AI 코딩 도구가 **IDE 수준의 코드 이해력**을 갖추게 합니다.

핵심은 코드를 텍스트가 아닌 **언어의 의미론(semantics)**에 기반하여 이해한다는 점입니다. 이는 IDE에서 "Go to Definition", "Find All References", "Rename Symbol" 등의 기능과 동일한 기반 기술이며, 이를 통해 AI가 단순 문자열 검색을 넘어 정확한 코드 탐색과 안전한 리팩토링을 수행할 수 있습니다.
