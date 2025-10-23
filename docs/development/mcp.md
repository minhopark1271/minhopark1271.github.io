---
title: MCP
parent: 개발
nav_order: 2
---

# MCP(Model Context Protocol)

LLM이 외부 데이터와 도구에 표준화된 방식으로 접근할 수 있게 해주는 개방적 프로토콜  
Anthropic에서 제안 / OpenAI는 A2A(Agent간 통신 프로토콜) 표준 제시  
[Introducing the Model Context Protocol – Anthropic](https://www.anthropic.com/news/model-context-protocol)  
[Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)  

--- 

- **표준화된 연결**: 다양한 AI 모델과 데이터 소스, 도구를 하나의 규칙으로 연결
- **지식 한계 극복**: LLM의 훈련 데이터 한계, 업데이트 지연 문제를 외부 정보 연결로 해결
- **전문 도메인 지원**: 의료, 기업, 내부 시스템 등 특화된 데이터와 지식에 접근 가능
- **통합 비용 절감**: 각 시스템별 커스텀 개발 없이 MCP로 통합 가능
- **사전 구축된 커넥터**: 파일 시스템, DB, 개발 도구, 생산성 도구 등 다양한 통합 지원
- **유연한 모델 교체**: GPT-4, Claude, Gemini 등 다양한 LLM을 손쉽게 교체 가능
- **복잡한 워크플로우 지원**: 여러 데이터/도구를 조합한 고도화된 AI 에이전트 구축 가능
- **핵심 역할 구조**
  - MCP 서버: 도구/데이터 제공
  - MCP 클라이언트: LLM과 서버 연결
  - MCP 호스트: 사용자 인터페이스
- **보안 및 인증**: 개인 액세스 토큰(PAT) 등 안전한 데이터 접근 방식 제공
- **비즈니스 가치 연결**: AI와 실제 업무/서비스/데이터를 연결하는 다리 역할

---

## MCP 연동을 통한 LLM Agent의 역할 확장

Agent의 눈과 귀; 입력 확장  
Agent의 팔 다리; 직접 실행  
Agent, Lenggraph가 필요한 입력을 취득하고 실행하는 반복작업을 가능하게 함.  
확장성 높음, 보안 및 안전성에 주의 필요.

- **통합의 표준화**: 기존에는 AI 모델과 외부 시스템(예: 데이터베이스, 웹 서비스, 애플리케이션)을 연결할 때마다 복잡한 맞춤형 코드를 작성해야 했으나, MCP는 단일 프로토콜로 통합하여 개발자가 효율적으로 다양한 시스템을 연동할 수 있게 함.
- **에이전트형 AI 실현**: MCP를 통해 AI는 단순 질의응답을 넘어, 날씨 API 조회, 캘린더 일정 등록, 파일 정리, 웹 크롤링 등 실제 외부 도구와 연동해 실시간 작업을 수행하는 에이전트로 동작할 수 있음.
- **데이터 접근성 확대**: AI 모델은 학습 데이터에만 의존하지 않고, MCP를 통해 기업 내부 데이터베이스, 최신 웹 정보 등 다양한 외부 데이터를 실시간으로 활용하여 더 정확하고 최신의 답변을 제공할 수 있음.
- **유연하고 안전한 연결**: MCP 구조는 서비스별 독립적 업데이트가 가능해 시스템 간 영향이 적고, 접근 권한을 세분화하여 AI가 필요한 데이터와 도구만 안전하게 사용할 수 있도록 지원함.
- **개방형 생태계 조성**: MCP는 오픈소스 표준으로 누구나 새로운 도구와 서비스를 MCP 생태계에 연결할 수 있어, 다양한 AI·도구·서비스가 상호작용하는 혁신적인 생태계가 빠르게 확장되고 있음.

---

## MCP 서버, 클라이언트, 호스트 개념

- **MCP 서버**: 다양한 도구(파일, DB, 웹, API 등)와 데이터를 LLM이 사용할 수 있도록 **표준화된 연동**을 제공
- **MCP 클라이언트**: LLM과 MCP 서버를 연결하는 브릿지 역할, 요청 전달 및 결과 반환
- **MCP 호스트**: Claude Desktop, Cursor IDE 등 사용자 인터페이스를 제공하며 MCP 클라이언트와 서버를 통합 (VS Code, Chat GPT, 기타 Agents...)

---

## MCP 서버 리스팅 플랫폼

MCP 서버를 공유·탐색할 수 있는 주요 플랫폼 목록  

1. **MCP Market**  
   - 주소: [https://mcpmarket.com](https://mcpmarket.com)  
   - 특징: 다양한 MCP 서버를 카테고리별로 정리한 대표적인 플랫폼. Claude, Cursor 등과 연동 가능한 서버를 한눈에 탐색할 수 있음. 매일 인기 서버 순위 갱신, 각 서버의 기능·API·커뮤니티 평판 제공.

2. **GitHub MCP Registry**  
   - 주소: [https://github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)  
   - 설명: GitHub이 출시한 공식 MCP 서버 검색 허브. 안정성과 신뢰성 보장. GitHub Copilot 등 AI 도구에서 바로 서버 추가 가능. 각 서버의 README에서 기능·보안 정보 확인 가능.

3. **Awesome MCP Servers**  
   - 주소: [https://github.com/punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)  
   - 설명: 전 세계 MCP 서버를 큐레이션한 오픈소스 목록. Claude, NotebookLM, Cursor 사용자들이 참고용으로 많이 활용. 300개 이상의 프로덕션급 서버 포함.

4. **Smithery.ai**  
   - 주소: [https://smithery.ai](https://smithery.ai)  
   - 설명: 실험적·커뮤니티 기반 MCP 서버를 모아둔 웹 디렉터리. NotebookLM 및 Anthropic 커뮤니티에서 자주 언급. 서버별 설치 명령어와 설정 예시 제공.

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

## Local MCP 서버 운용

[Connect to local MCP servers](https://modelcontextprotocol.io/docs/develop/connect-local-servers)

---

## remote MCP 서버 사용

[Connect to remote MCP servers](https://modelcontextprotocol.io/docs/develop/connect-remote-servers)

Remote MCP 서버는 로컬 MCP 서버와 유사하게 동작하지만, 인터넷에 호스팅되어 로컬 설치 없이 어디서든 접근할 수 있음

`MCP 연동 핵심은 서비스별로 필요한 인증 키 및 권한 설정인듯`

---

## MCP 서버 개발

[Build an MCP server](https://modelcontextprotocol.io/docs/develop/build-server)

---

## MCP 사용기 참조

[우아한기술블로그](https://techblog.woowahan.com/22342/)