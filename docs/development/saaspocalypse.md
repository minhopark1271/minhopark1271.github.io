---
title: SaaSpocalypse
parent: 개발
nav_order: 53
description: "Claude Cowork 플러그인이 촉발한 SaaSpocalypse 현상을 분석합니다. SaaS 기업 주가 폭락, 구독형 비즈니스 모델의 위기, AI 에이전트가 가져올 소프트웨어 산업의 구조적 변화를 다룹니다."
---

# SaaSpocalypse: AI가 SaaS를 삼키다
{:.no_toc}

2026년 2월, Anthropic의 Claude Cowork 플러그인 11종 발표 이후 SaaS 기업 시가총액 <span>$</span>2,850억이 증발했습니다. 이른바 **SaaSpocalypse**의 시작입니다.

### Link

- [TechCrunch - SaaS in, SaaS out: Here's what's driving the SaaSpocalypse](https://techcrunch.com/2026/03/01/saas-in-saas-out-heres-whats-driving-the-saaspocalypse/)
- [Bain & Company - Why SaaS Stocks Have Dropped](https://www.bain.com/insights/why-saas-stocks-have-dropped-and-what-it-signals-for-softwares-next-chapter/)
- [Medium - Claude Cowork Just Triggered the "SaaSpocalypse"](https://medium.com/@bhallaanuj69/claude-cowork-just-triggered-the-saaspocalypse-how-11-plugins-wiped-out-200-billion-in-market-51082035c355)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## SaaSpocalypse란

**SaaSpocalypse**(SaaS + Apocalypse)는 범용 AI 에이전트가 기존 SaaS 제품의 비즈니스 모델을 근본적으로 위협하는 현상을 말합니다. 2024~2025년의 Copilot이 "사람을 돕는 도우미"였다면, 2026년의 AI 에이전트는 **사람 대신 일하는 실행자**로 진화했습니다.

CRM(Customer Relationship Management — 고객 정보 관리, 영업 파이프라인 추적, 마케팅 자동화 등을 수행하는 소프트웨어. Salesforce, HubSpot, Dynamics 365 등)에 로그인하고, 스프레드시트를 관리하고, 조달 워크플로우를 실행하는 것까지 — 에이전트 하나가 중간 관리직 10~15명의 행정 업무를 처리할 수 있다는 보고가 글로벌 금융/물류 대기업에서 나오고 있습니다.

---

## 방아쇠를 당긴 Claude Cowork

2026년 1월 30일, Anthropic은 Claude Cowork에 **11개 공식 플러그인**을 발표했습니다.

| 플러그인 영역 | 대체 가능한 기존 SaaS |
|---|---|
| **Productivity** (작업/캘린더/워크플로우) | Asana, Monday.com, ClickUp, Notion |
| **Enterprise Search** (사내 문서/도구 검색) | Elastic, Coveo, Glean |
| **Sales** (리드 리서치, 딜 준비) | Salesforce, HubSpot, Outreach |
| **Finance** (재무 분석, 모델링) | Anaplan, Adaptive Insights |
| **Legal** (계약 검토, 리서치) | Thomson Reuters, LexisNexis |
| **Marketing** (콘텐츠, 캠페인 관리) | Marketo, Mailchimp, Hootsuite |
| **Customer Support** (티켓 처리, 응대) | Zendesk, Intercom, Freshdesk |
| **Product Management** (로드맵, 요구사항) | Jira, Linear, Productboard |
| **Data Analysis** (데이터 분석/시각화) | Tableau, Looker, Power BI |
| **Biology Research** (생물학 연구 보조) | 특수 분야 연구 도구 |
| **Plugin Create** (커스텀 플러그인 생성) | 내부 자동화 도구, Zapier |

핵심은 이 플러그인들이 Slack, Notion, Jira, Microsoft 365 등 기존 도구와 **연동**되면서, 각 도메인의 전문 SaaS를 **우회**한다는 점입니다. 별도의 CRM 라이센스 없이도 Claude가 CRM 역할을 수행하고, 별도의 프로젝트 관리 도구 없이도 작업을 추적합니다.

---

## 주가에 나타난 충격

발표 후 일주일(1/30~2/4) 동안의 시장 반응은 극적이었습니다.

| 기업 | 하락폭 | 영향받은 영역 |
|---|---|---|
| **Atlassian** (TEAM) | **-35%** | 프로젝트 관리, 이슈 트래킹 |
| **Monday.com** (MNDY) | **~-40%** | 워크 매니지먼트 |
| **Salesforce** (CRM) | **-28%** | CRM, 세일즈 자동화 |
| **Adobe** (ADBE) | **-30~35%** (12개월) | 크리에이티브/마케팅 |
| **Thomson Reuters** (TRI) | **-16%** | 법률 리서치 |
| **RELX** (LexisNexis 모회사) | **-14%** | 법률/기업 정보 |

2025년 말부터 시작된 SaaS 지수의 하락(-6.5%, S&P 500은 +17.6%)이 2026년 초에 **-20% 이상의 급락**으로 가속화되었습니다. 2022년 금리 인상 때의 Tech 급락, 2008년 금융위기 이후 가장 빠른 SaaS 섹터 드로우다운입니다.

총 증발 시가총액은 **약 <span>$</span>2,850억~<span>$</span>1조** 수준으로 추정됩니다(집계 범위에 따라 상이).

---

## 구독형 비즈니스 모델의 위기

SaaSpocalypse의 본질은 주가 하락이 아니라 **Per-Seat 과금 모델의 구조적 붕괴**입니다.

### 문제의 핵심

AI 에이전트를 갖춘 직원 1명이 기존 5명의 업무를 처리할 수 있다면, 기업은 라이센스 시트를 **줄이지 늘리지 않습니다**. 20년간 SaaS 경제를 떠받쳐 온 "사용자 수 x 월정액" 공식이 무너지기 시작한 것입니다.

### 대안 과금 모델의 부상

| 기존 모델 | 신규 모델 | 예시 |
|---|---|---|
| Per-Seat (사용자당 월정액) | Usage-Based (사용량 기반) | 토큰 소비, API 호출 수 |
| 고정 구독료 | Outcome-Based (성과 기반) | 처리된 트랜잭션, 달성 목표 |
| 기능별 티어 | Agent-Based (에이전트 기반) | AI 에이전트 단위 과금 |

Gartner는 2030년까지 포인트 SaaS 제품의 **35%가 AI 에이전트로 대체**되고, 기업 SaaS 지출의 **40% 이상**이 사용량/성과 기반 과금으로 전환될 것으로 전망합니다.

---

## "대체 아닌 활용" 반론

물론 반론도 있습니다.

> "AI 에이전트는 전문 소프트웨어를 **대체하는 게 아니라 활용하는 것**이다. Jira를 없애는 게 아니라 Jira를 더 잘 쓰게 해주는 것이다."

이 주장에는 일리가 있습니다. 현재 Claude Cowork 플러그인도 Slack, Jira, Notion 등 기존 도구와 **연동**하는 방식으로 작동합니다. 기존 인프라 위에서 동작하는 것이지, 바닥부터 갈아엎는 것이 아닙니다.

**그러나**, 큰 흐름에서 주목해야 할 포인트는 다릅니다.

### 단기: 구독형 모델 충격

연동 방식이라 해도 **시트 수 감소**는 불가피합니다. AI 에이전트가 5명분의 일을 하면 기업은 5개 시트가 아닌 1~2개만 유지합니다. SaaS 기업의 매출 구조가 이미 흔들리고 있습니다.

### 중장기: 대체에 가까운 진화

전문가들은 2027년까지 "소프트웨어"라는 개념 자체가 **"에이전틱 서비스"**로 전환될 수 있다고 봅니다. CRM을 구매하는 것이 아니라 AI "세일즈 에이전트"를 고용하는 시대가 옵니다. 플랫폼 위에 올라간 에이전트가 기존 SaaS의 역할을 통째로 흡수하는 것입니다.

MCP(Model Context Protocol) 생태계가 이 전환을 가속화하고 있습니다. Python/TypeScript SDK의 월간 다운로드가 **9,700만 건**을 돌파했고, Claude Code는 출시 8개월 만에 GitHub Copilot과 Cursor를 제치고 **가장 많이 사용되는 AI 코딩 도구**가 되었습니다.

이 흐름은 되돌릴 수 없습니다.

---

## Claude 만세

솔직히 말하면 — Claude의 현재 위치는 압도적입니다.

- **코딩**: SWE-bench Verified 80.9% (GPT-5.2 ~70%, Gemini ~65%)
- **추론**: 복잡한 디버깅에서 가장 적은 오류
- **정확성**: 환각(hallucination) 최소화, 대량 토큰 처리에 강점
- **생태계**: Claude Code + MCP + Cowork 플러그인의 삼각편대

코딩 에이전트로서의 Claude Code, 지식 노동 에이전트로서의 Claude Cowork, 그리고 이 모든 것을 연결하는 MCP 프로토콜. Anthropic이 구축한 이 생태계가 SaaSpocalypse의 진앙이자, 향후 소프트웨어 산업 재편의 중심축입니다.

---

## 부록: AI 모델 전쟁의 풍경

Claude만 잘하는 것은 아닙니다. 각 모델에는 고유한 강점이 있고, 경쟁 구도 자체가 발전을 가속화합니다.

### Google Gemini — 멀티미디어와 학습의 왕

Gemini의 진짜 강점은 **멀티모달 통합**과 **Google 생태계**입니다.

- **네이티브 멀티모달**: 처음부터 멀티모달로 설계된 모델. 텍스트, 이미지, 오디오, 비디오를 동시에 이해하고 분석
- **100만 토큰 컨텍스트 윈도우**: 전체 코드베이스, 긴 문서를 한 번에 처리
- **Google 검색 연동**: 실시간 웹 데이터로 응답을 검증(grounding)
- **학습/연구 도구**: 강의 녹음을 팟캐스트 스타일 Audio Overview로 변환, 교재를 퀴즈/플래시카드로 자동 생성
- **속도**: 응답 속도에서 ChatGPT와 Claude를 앞섬

그리고 Google이 가진 **플랫폼 해자**가 결정적입니다. YouTube의 20년치 비디오/오디오/메타데이터는 세계 최대의 멀티모달 훈련 데이터 원천이고, 경쟁사가 저작권 소송에 시달리는 동안 Google은 이 자산을 독점적으로 활용합니다. 30억 대의 Android 기기에 Gemini가 기본 탑재되고, Workspace·Search·Maps·Gmail과 네이티브 연동되면서, Google 생태계 안에서 Gemini는 **"처음이자 유일한 AI"**가 되어가고 있습니다.

### OpenAI GPT — 범용성과 접근성의 대명사

ChatGPT(GPT-5.2)는 여전히 **가장 많은 사람이 쓰는 AI**입니다.

- **범용 대화**: 일상 질문부터 브레인스토밍까지 무난하게 처리
- **크리에이티브 작업**: 특정 톤과 의도를 반영한 텍스트 생성에 강점
- **거대한 생태계**: GPT Store, 플러그인, API 통합이 가장 넓음
- **직관적 UX**: AI에 익숙하지 않은 일반인도 바로 사용 가능

"AI를 처음 써보는 사람에게 뭘 추천하냐"는 질문에는 여전히 ChatGPT가 정답입니다. 다만 OpenAI가 무료 티어에 **광고 도입을 검토 중**이라는 보도가 나오면서, "AI 시대의 Google 검색"이 되려는 건지 우려의 시선도 있습니다.

### 기타 모델들

| 모델 | 소속 | 특징 |
|---|---|---|
| **Grok 4.1** (xAI) | Elon Musk의 xAI | Arena 스코어 1477로 2위권. 실시간 데이터 접근. 느슨한 콘텐츠 정책 덕에 NSFW 생성 도구로도 인기 — 의도했든 아니든 킬러 유스케이스가 되어버렸습니다 |
| **DeepSeek v3.2** | DeepSeek (중국) | ChatGPT/Claude 수준의 품질을 **10~30배 저렴**하게 제공. 효율 혁명 |
| **Qwen 3** | Alibaba (중국) | 235B 파라미터 MoE 모델. DeepSeek-R1 대비 다수 벤치마크에서 우위 |
| **Ernie 5.0** | Baidu (중국) | 중국 시장 Arena 스코어 1위(1446). 중국어 처리 최적화 |
| **GLM 5** | Zhipu AI (중국) | 2026년 2월 출시. 중국 내 기업용 시장 공략 |

2026년 2월에만 Gemini 3 Pro, Sonnet 5, GPT-5.3, Qwen 3.5, DeepSeek v4, Grok 4.20이 동시에 출시되는 **"Model Rush"**가 발생했습니다. 중국 모델의 약진이 특히 눈에 띄는데, DeepSeek와 Qwen은 미국 모델에 비해 압도적으로 낮은 비용으로 경쟁력 있는 성능을 보여주며 AI의 민주화를 이끌고 있습니다.

---

## 정리

| 관점 | 현황 |
|---|---|
| **촉발점** | Claude Cowork 11개 플러그인 (2026.01.30) |
| **시장 충격** | SaaS 섹터 시총 <span>$</span>2,850억~<span>$</span>1조 증발 |
| **구조 변화** | Per-Seat → Usage/Outcome 기반 과금 전환 |
| **단기 전망** | 기존 도구 활용(연동) 중심, but 시트 수 감소 불가피 |
| **중장기 전망** | 소프트웨어 → 에이전틱 서비스로 패러다임 전환 |
| **승자** | 에이전트 생태계를 구축한 플랫폼 (Anthropic, Google, OpenAI) |

SaaS 시대는 저물고, 에이전트 시대가 시작되었습니다.

*작성일: 2026-03-11 / 데이터 기준: 2026년 3월 초 (주가 데이터, 벤치마크 스코어, 시장 전망 등)*
