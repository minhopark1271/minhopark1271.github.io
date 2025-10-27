---
title: MCP 서버 사용
parent: MCP
nav_order: 2
---

# MCP Server 사용
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

--- 

## VS Code로 MCP 사용

[Use MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)

```
# project-dir/.vscode/mcp.json
{
  "servers": {
    "weather": {
      "command": "uv",
      "args": [
        "--directory",
        "/Users/minhopark/Projects/mcp/weather",
        "run",
        "weather.py"
      ]
    },
    "weather-and-secret": {
      "type": "http",
      "url": "http://localhost:8000/mcp"
    }
  }
}
```

---

## Cursor로 MCP 사용

[MCP로 외부 도구와 데이터 소스를 Cursor에 연결하기](https://docs.cursor.com/ko/context/mcp)

```
# project-dir/.cursor/mcp.json
{
  "mcpServers": {
    "weather": {
      "command": "uv",
      "args": [
        "--directory",
        "/Users/minhopark/Projects/mcp/weather",
        "run",
        "weather.py"
      ]
    },
    "weather-and-secret": {
      "type": "http",
      "url": "http://localhost:8000/mcp"
    }
  }
}
```

---

## ChatGPT로 MCP 사용

- 웹앱 > 계정 > 설정 > 연동 앱 및 커넥터 > 고급 설정 > 개발자 모드
- 웹앱 > 계정 > 설정 > 연동 앱 및 커넥터 > 만들기 > URL을 통한 연동만 지원
