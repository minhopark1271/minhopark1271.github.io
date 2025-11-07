---
title: MCP Server 개발
parent: 개발
nav_order: 9
---

# MCP Server 개발
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

--- 

## MCP SDK

- [Python](https://github.com/modelcontextprotocol/python-sdk)
- [TypeScript](https://github.com/modelcontextprotocol/typescript-sdk) - 브라우저/Node 환경 모두 지원, 타입 안전한 서버/클라이언트 구현에 적합
- [Go](https://github.com/modelcontextprotocol/go-sdk) - 경량/병렬 처리 강점, 단일 바이너리 배포 및 원격 서버 제작에 유리
- [Kotlin](https://github.com/modelcontextprotocol/kotlin-sdk) - JVM 기반 서비스/Android 연계 가능, 코루틴 활용 비동기 처리 용이
- [Swift](https://github.com/modelcontextprotocol/swift-sdk) - Apple 생태계(macOS, iOS) 특화 클라이언트/툴 제작에 활용
- [Java](https://github.com/modelcontextprotocol/java-sdk) - 엔터프라이즈 환경, Spring 등 기존 인프라와 통합 쉬움
- [C#](https://github.com/modelcontextprotocol/csharp-sdk) - .NET 환경 / Windows, 서버 및 데스크톱 에이전트 통합
- [Ruby](https://github.com/modelcontextprotocol/ruby-sdk) - 간결한 DSL 스타일, 빠른 프로토타이핑 및 스크립트형 MCP 서버에 적합
- [Rust](https://github.com/modelcontextprotocol/rust-sdk) - 고성능/메모리 안전, 고부하 서버나 네이티브 확장 제작에 적합
- [PHP](https://github.com/modelcontextprotocol/php-sdk) - 웹 중심(WordPress/Laravel 등) 시스템과의 통합에 활용 가능

---

## 기능 유형 (Types of capabilities)

1. **Resources (리소스)**: 클라이언트가 읽을 수 있는 파일 유사 데이터 (예: API 응답, 파일 내용 등)
2. **Tools (도구)**: LLM이 사용자 승인 하에 호출할 수 있는 실행 가능한 함수/작업 단위
3. **Prompts (프롬프트)**: 사용자가 특정 목표를 빠르게 달성하도록 돕는 사전 작성된 템플릿

---

## 프로젝트 생성

```
# Create a new directory for our project
uv init weather
cd weather

# Create virtual environment and activate it
uv venv
source .venv/bin/activate

# Install dependencies
uv add "mcp[cli]" httpx

# Create our server file
touch weather.py
```

---

## weather.py MCP 서버 로직 작성

- get_forecast: 날씨예보 API 호출해서 미국 내 특정 지역 날씨 정보 조회
- write_my_secret_file: 프로젝트 폴더 내의 `비밀파일`에 입력한 정보 작성

```python
from typing import Any
import httpx
import sys
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server
# Check if running in HTTP mode
if len(sys.argv) > 1 and sys.argv[1] == '--http':
    # Initialize with HTTP configuration
    mcp = FastMCP("weather", host="0.0.0.0", port=8000)
else:
    # Initialize for stdio mode (default)
    mcp = FastMCP("weather")

# Constants
NWS_API_BASE = "https://api.weather.gov"
USER_AGENT = "weather-app/1.0"


async def make_nws_request(url: str) -> dict[str, Any] | None:
    """Make a request to the NWS API with proper error handling."""
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/geo+json"
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, timeout=30.0)
            response.raise_for_status()
            return response.json()
        except Exception:
            return None

@mcp.tool()
async def get_forecast(latitude: float, longitude: float) -> str:
    """Get weather forecast for a location.

    Args:
        latitude: Latitude of the location
        longitude: Longitude of the location
    """
    # First get the forecast grid endpoint
    points_url = f"{NWS_API_BASE}/points/{latitude},{longitude}"
    points_data = await make_nws_request(points_url)

    if not points_data:
        return "Unable to fetch forecast data for this location."

    # Get the forecast URL from the points response
    forecast_url = points_data["properties"]["forecast"]
    forecast_data = await make_nws_request(forecast_url)

    if not forecast_data:
        return "Unable to fetch detailed forecast."

    # Format the periods into a readable forecast
    periods = forecast_data["properties"]["periods"]
    forecasts = []
    for period in periods[:5]:  # Only show next 5 periods
        forecast = f"""
{period['name']}:
Temperature: {period['temperature']}°{period['temperatureUnit']}
Wind: {period['windSpeed']} {period['windDirection']}
Forecast: {period['detailedForecast']}
"""
        forecasts.append(forecast)

    return "\n---\n".join(forecasts)

@mcp.tool()
async def write_my_secret_file(content: str) -> str:
    """Write a text on my_very_secret text file."""
    with open("/Users/minhopark/Projects/mcp/weather/s1e1c1r1e1t.txt", "w") as f:
        f.write(content)
    return "Secret file written successfully."


def main():
    # Initialize and run the server
    # Use 'stdio' for local development, 'streamable-http' for Docker/HTTP access
    
    # Check if running in HTTP mode
    if len(sys.argv) > 1 and sys.argv[1] == '--http':
        # Run HTTP server
        mcp.run(transport='streamable-http')
    else:
        # Run stdio server (default)
        mcp.run(transport='stdio')

if __name__ == "__main__":
    main()
```

---

## VS Code에서 Weather MCP 연결 및 구동 (StdIO)

.vscode/mcp.json 편집

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
    }
  }
}
```

VS Code 에디터로 `.vscode/mcp.json` 파일을 열면  
Start|2 tols|More... 와 같이 버튼이 활성화됨

![VS Code MCP 서버 설정](/assets/images/vscode-mcp-json.png)

Start버튼을 눌렀을 때의 정상 실행 결과

![VS Code MCP 구동 결과](/assets/images/vscode-mcp-running.png)

IDE 터미널에 출력되는 MCP 구동 결과

```
2025-10-27 14:43:21.410 [info] Starting server weather
2025-10-27 14:43:21.410 [info] Connection state: Starting
2025-10-27 14:43:21.416 [info] Starting server from LocalProcess extension host
2025-10-27 14:43:21.418 [info] Connection state: Starting
2025-10-27 14:43:21.419 [info] Connection state: Running
2025-10-27 14:43:21.868 [warning] [server stderr] [10/27/25 14:43:21] INFO     Processing request of type            server.py:674
2025-10-27 14:43:21.868 [warning] [server stderr]                              ListToolsRequest
2025-10-27 14:43:21.869 [warning] [server stderr]                     INFO     Processing request of type            server.py:674
2025-10-27 14:43:21.869 [warning] [server stderr]                              ListPromptsRequest
2025-10-27 14:43:21.870 [info] Discovered 2 tools
```

이제 프롬프트에서 weather MCP 사용을 명시하거나 관련된 프롬프트를 날리면 해당하는 MCP 툴을 사용해야하는데,  
VS Code & Copilot 조합은 명시적으로 사용하라는 프롬프트 던졌을 때도 MCP 툴을 잘 못잡아오는 경향 있는듯...

---

## Docker로 MCP 서버 구동 후 Streamable HTTP로 연결

Dockerfile - 도커 컨테이너 이미지 구성

```
# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv for faster package management
RUN pip install uv

# Copy project files
COPY pyproject.toml uv.lock ./

# Install dependencies using uv
RUN uv sync

# Copy application code
COPY . .

# Set Python path
ENV PATH="/app/.venv/bin:$PATH"

# Run the weather MCP server in HTTP mode
CMD ["python", "weather.py", "--http"]
```

docker-compose.yml 작성

```
services:
  weather-and-secret:
    build: .
    container_name: weather-and-secret
    stdin_open: true
    tty: true
    ports:
      # Expose HTTP port for MCP server
      - "8000:8000"
    volumes:
      # Mount the secret file location with absolute path
      - /Users/minhopark/Projects/mcp/weather/s1e1c1r1e1t.txt:/Users/minhopark/Projects/mcp/weather/s1e1c1r1e1t.txt
    environment:
      - PYTHONUNBUFFERED=1
```

도커 빌드 및 실행

```
docker-compose up --build
```

VS Code 연동 설정 (.vscode/mcp.json)

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

---

## 프롬프팅으로 MCP 툴 호출

![VS Code 프롬프팅으로 MCP 사용](/assets/images/weather-and-secret-usage.png)