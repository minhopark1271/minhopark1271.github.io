---
title: MCP 서버 연결
parent: 개발
nav_order: 8
description: "Use MCP servers in VS Code"
---

# MCP Server 연결
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## VS Code MCP 연결

[Use MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)

### 설정 파일

project-dir/.vscode/mcp.json

```json
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

### 설정 필드 (STDIO)

| Field   | Required | Description | Examples |
|---------|----------|-------------|----------|
| type    | Yes      | Server connection type | "stdio" |
| command | Yes      | Command to start the server executable. Must be available on your system path or contain its full path. | "npx", "node", "python", "docker" |
| args    | No       | Array of arguments passed to the command | ["server.py", "--port", "3000"] |
| env     | No       | Environment variables for the server | {"API_KEY": "${input:api-key}"} |
| envFile | No       | Path to an environment file to load more variables |  |

### 설정 필드 (HTTP/SSE)

| Field   | Required | Description | Examples |
|---------|----------|-------------|----------|
| type    | Yes      | Server connection type | "http", "sse" |
| url     | Yes      | URL of the server | "http://localhost:3000", "https://api.example.com/mcp" |
| headers | No       | HTTP headers for authentication or configuration | {"Authorization": "Bearer ${input:api-token}"} |

**.github/copilot-instructions.md** 에서 툴 사용여부 튜닝 가능

---

## Cursor MCP 연결

[MCP로 외부 도구와 데이터 소스를 Cursor에 연결하기](https://docs.cursor.com/ko/context/mcp)

### 설정 파일

project-dir/.cursor/mcp.json

```json
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

### 지원 전송 방식

| Transport      | Execution environment | Deployment       | Users         | Input                  | Auth  |
|----------------|-----------------------|------------------|---------------|------------------------|-------|
| stdio          | Local                 | Cursor manages   | Single user   | Shell command          | Manual |
| SSE            | Local/Remote          | Deploy as server | Multiple users| URL to an SSE endpoint | OAuth  |
| Streamable HTTP| Local/Remote          | Deploy as server | Multiple users| URL to an HTTP endpoint| OAuth  |

### 설정 필드

VS Code와 동일

---

## Claude Code MCP 연결

[MCP를 통해 Claude Code를 도구에 연결](https://code.claude.com/docs/ko/mcp)

---

## ChatGPT로 MCP 사용

- 웹앱 > 계정 > 설정 > 연동 앱 및 커넥터 > 고급 설정 > 개발자 모드
- 웹앱 > 계정 > 설정 > 연동 앱 및 커넥터 > 만들기 > URL을 통한 연동만 지원
