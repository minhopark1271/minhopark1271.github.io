---
title: MCP 개요
parent: 개발
nav_order: 7
description: "MCP(Model Context Protocol) 완벽 가이드. Anthropic이 제안한 LLM 외부 도구 연동 표준. STDIO/HTTP 프로토콜, 마켓플레이스, VS Code/Cursor/Claude Code 연동법."
---

# MCP(Model Context Protocol)
{:.no_toc}

LLM이 외부 데이터와 도구에 표준화된 방식으로 접근할 수 있게 해주는 개방적 프로토콜  
Anthropic에서 제안 

[Introducing the Model Context Protocol – Anthropic](https://www.anthropic.com/news/model-context-protocol)  
[Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)  

## 목차
{:.no_toc}

1. TOC
{:toc}

--- 

## 특징

- **표준화된 연결**: 다양한 AI 모델과 데이터 소스, 도구를 하나의 규칙으로 연결
- **지식 한계 극복**: LLM의 훈련 데이터 한계, 업데이트 지연 문제를 외부 정보 연결로 해결
- **전문 도메인 지원**: 의료, 기업, 내부 시스템 등 특화된 데이터와 지식에 접근 가능
- **통합 비용 절감**: 각 시스템별 커스텀 개발 없이 MCP로 통합 가능
- **사전 구축된 커넥터**: 파일 시스템, DB, 개발 도구, 생산성 도구 등 다양한 통합 지원
- **유연한 모델 교체**: GPT-4, Claude, Gemini 등 다양한 LLM을 손쉽게 교체 가능
- **복잡한 워크플로우 지원**: 여러 데이터/도구를 조합한 고도화된 AI 에이전트 구축 가능
- **핵심 역할 구조**: 서버 / 클라이언트 / 호스트 (아래 섹션 참고)
- **보안 및 인증**: 개인 액세스 토큰(PAT) 등 안전한 데이터 접근 방식 제공
- **비즈니스 가치 연결**: AI와 실제 업무/서비스/데이터를 연결하는 다리 역할

---

## MCP 연동을 통한 LLM Agent의 역할 확장

Agent의 눈과 귀; 입력 확장  
Agent의 팔 다리; 직접 실행  
Agent, LangGraph가 필요한 입력을 취득하고 실행하는 반복작업을 가능하게 함.  
확장성 높음, 보안 및 안전성에 주의 필요.

---

## MCP 서버, 클라이언트, 호스트 개념

- **MCP 서버**: 다양한 도구(파일, DB, 웹, API 등)와 데이터를 LLM이 사용할 수 있도록 **표준화된 연동**을 제공
- **MCP 클라이언트**: LLM과 MCP 서버를 연결하는 브릿지 역할, 요청 전달 및 결과 반환
- **MCP 호스트**: Claude Desktop, Cursor IDE 등 사용자 인터페이스를 제공하며 MCP 클라이언트와 서버를 통합 (VS Code, Chat GPT, 기타 Agents...)

---

## MCP 서버 마켓플레이스

MCP 서버를 공유·탐색할 수 있는 주요 플랫폼 목록  

1. **Smithery.ai**  
   - 주소: [https://smithery.ai](https://smithery.ai)  
   - 설명: 실험적·커뮤니티 기반 MCP 서버를 모아둔 웹 디렉터리. NotebookLM 및 Anthropic 커뮤니티에서 자주 언급. 서버별 설치 명령어와 설정 예시 제공.
   - 클라우드 호스팅 서비스(원격 호출용 런처 스크립트) 제공

2. **GitHub MCP Registry**  
   - 주소: [https://github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)  
   - 설명: GitHub이 출시한 공식 MCP 서버 검색 허브. 안정성과 신뢰성 보장. GitHub Copilot 등 AI 도구에서 바로 서버 추가 가능. 각 서버의 README에서 기능·보안 정보 확인 가능.
   - GitHub Hosting Registry: [https://github.com/mcp](https://github.com/mcp)

3. **Awesome MCP Servers**  
   - 주소: [https://github.com/punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)  
   - 설명: 전 세계 MCP 서버를 큐레이션한 오픈소스 목록. Claude, NotebookLM, Cursor 사용자들이 참고용으로 많이 활용. 300개 이상의 프로덕션급 서버 포함.

4. **MCP Market**  
   - 주소: [https://mcpmarket.com](https://mcpmarket.com)  
   - 특징: 다양한 MCP 서버를 카테고리별로 정리한 플랫폼. Claude, Cursor 등과 연동 가능한 서버를 한눈에 탐색할 수 있음. 매일 인기 서버 순위 갱신, 각 서버의 기능·API·커뮤니티 평판 제공.

5. 기타 LLM 클라이언트마다 운영하는 마켓플레이스

---

## 주요 MCP 서버별 기능
- **Sequential Thinking MCP**:
  - 복잡한 문제를 단계별로 분해·실행
  - 멀티스텝 워크플로우 관리
  - 논리적 추론 및 오류 복구 지원
- **Playwright MCP**:
  - 브라우저 자동화, 웹 탐색, 클릭, 입력, 접근성 진단, 데이터 크롤링 등 웹 자동화
- **GitHub MCP**: 
  - 리포지토리 검색, 클론, 이슈/PR 생성
  - 코드 리뷰 등 오픈소스 협업 자동화
- **Context7 MCP**: 
  - 코드 분석, 문서 자동 생성, 함수/클래스 설명 추출, 다국어 문서화 지원.
  - 최신 Documentation 반영
- **Figma MCP**: 
  - Figma 디자인 정보 추출
  - 컴포넌트 구조화
  - UI 분석 및 코드 생성

---

## MCP 서버 통신 프로토콜

MCP 서버와 클라이언트는 구현 및 배포 시나리오에 따라 두 가지 대표적인 전송(Transport) 방식을 활용한다.
SSE 방식은 지원 종료 예정으로, 제외했다.

### 1. STDIO (Standard Input/Output)

한 프로세스의 표준 출력(stdout)을 다른 프로세스의 표준 입력(stdin)에 파이프로 연결해 메시지를 교환한다. 별도 네트워크 소켓을 열지 않아 방화벽/포트/SSL 설정이 필요 없다.

**주요 특징:**
- 동일 머신(로컬)에서 가장 단순하고 빠른 연결 형태 (IPC 수준 지연)
- 외부 노출 포트가 없어 공격 표면 최소화 (보안에 유리)
- 프로세스 생명주기와 세션이 일치 → 상태 정리 용이
- 운영/모니터링(메트릭, 중앙 로그) 추가 구성은 수작업 필요

**적합한 사용 사례:**
- 개인 개발 환경, IDE 통합(VS Code, Cursor, Claude Desktop 등)
- 민감 내부 데이터 접근(사내 코드베이스, 비공개 문서)
- 빠른 프로토타이핑 & 실험

**제약 사항:**
- 원격/수평 확장 어려움 (머신 경계 밖 통신 불가)
- 장애 복구 자동화(헬스체크, 재시작 정책) 별도 작성 필요
- 장시간 작업 중간 진행 상황 스트리밍은 별도 프로토콜 설계 요구

### 2. Streamable HTTP

HTTP/1.1 Chunked Transfer Encoding + HTTP/2 Frame 기반 스트리밍을 활용해 응답을 조각(chunk/frame) 단위로 점진적으로 전송한다. 일반 HTTP가 짧은 정적 리소스에 최적화된 것과 달리 대용량/점진 생성/실시간 로그/오디오/서버 푸시 등에 적합. MCP 문서에서 프로덕션 확장 시 권장되는 방식.

**주요 특징:**
- 기존 웹 인프라(로드 밸런서, 프록시, CDN, Observability 스택) 재사용 가능
- 수평 확장 및 컨테이너/Kubernetes 배포 용이
- 장시간 실행되는 툴 호출의 중간 진행 상황 스트리밍 가능
- 표준 HTTP 인증/캐시/전송 암호화(TLS) 적용 쉬움

**적합한 사용 사례:**
- 팀/조직 공유 공용 MCP 서버
- 대용량 처리(크롤링, 분석) 진행 상황 피드백 필요
- SLA/모니터링/자동 복구 요구되는 프로덕션 환경

**제약 사항:**
- 초기 구성 복잡도(Reverse Proxy, TLS, 인증) 증가
- 네트워크 노출로 공격 표면 확대 → Rate Limit/WAF/권한 스코프 관리 필수

### 비교

| 구분 | STDIO | Streamable HTTP |
|------|-------|-----------------|
| **연결 범위** | 동일 머신 | 네트워크/인터넷 |
| **확장성** | 단일 프로세스 | 수평 확장/로드밸런싱 |
| **보안 표면** | 포트 미노출(최소) | 공개 엔드포인트(통제 필요) |
| **지연** | 매우 낮음 | 네트워크 지연 영향 |
| **스트리밍** | 직접 구현 필요 | Chunk/Frame 즉시 활용 |
| **장애 복구** | 수동/간단 재시작 | 오케스트레이션 자동 복구 |
| **관측성** | 별도 파이프/스크립트 | 표준 로그·메트릭·트레이싱 |
| **배포** | 로컬 스크립트 | 컨테이너/클라우드 표준화 |
| **인증** | OS 사용자/파일 권한 | 토큰/OAuth/프록시 계층 |

- **개인 실험/로컬 IDE/민감 데이터** → STDIO 우선
- **공유 서비스/확장성/운영 관측성/스트리밍** → Streamable HTTP 선택
- !! STDIO 통신방식 사용하는 경우 서버 로직 내에서 쓰기 금지 (print, console.log 등)

---

## Claude Desctop으로 MCP 사용하기

[Connect to local MCP servers](https://modelcontextprotocol.io/docs/develop/connect-local-servers)

[Connect to remote MCP servers](https://modelcontextprotocol.io/docs/develop/connect-remote-servers)

---

## VS Code로 MCP 사용하기

내 경우 Visual Studio Code에 GitHub Copilot설치해서 Coding Agent로 자주 이용하는 편이다.
VS Code 내부적으로 MCP 서버 마켓플레이를 운영하고 있어서 클릭 몇번으로 간단히 연동하고 사용할 수 있다.
지원하는 MCP 서버 종류가 상대적으로 적으나, 있을 건 다 있음.

[Use MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)

- **필요사항**: VS Code, Copilot
- **VS Code MCP 사용 설정**: Settings - chat.mcp.access

### VS code 자체 마켓플레이스 이용 (Extensions view)
- **MCP gallery 이용 설정**: Settings - chat.mcp.gallery.enabled
- **검색** - Code - Preferences - Extensions (cmd + shift + x) - @mcp 검색
- **설치** - install 버튼 클릭 (사용준비 끝. 연동된 서비스 인증 필요한 경우 인증키 넣기)

### Custom config 입력
- workspace에서 .vscode/mcp.json 추가
- mcp.json에 서버 설정 추가

---

## Cursor에서 MCP 사용하기

[MCP로 외부 도구와 데이터 소스를 Cursor에 연결하기](https://docs.cursor.com/ko/context/mcp)

---

## Claude Code에 MCP 설정

[MCP를 통해 Claude Code를 도구에 연결](https://code.claude.com/docs/ko/mcp)

---

## MCP 서버 개발

[Build an MCP server](https://modelcontextprotocol.io/docs/develop/build-server)

- Resources: File-like data that can be read by clients (like API responses or file contents)
- Tools: Functions that can be called by the LLM (with user approval)
- Prompts: Pre-written templates that help users accomplish specific tasks

---

## MCP 클라이언트 개발

[Build an MCP client](https://modelcontextprotocol.io/docs/develop/build-client)

---

## MCP Inspector

[MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)
