---
title: Trigger.dev
parent: 개발
nav_order: 40
description: "Trigger.dev 완벽 가이드. 타임아웃 없는 백그라운드 작업 & AI 에이전트 실행 플랫폼. 요금제, LLM 연동 구조, Supabase 연동, 투자 대시보드 운용 예시."
---

# Trigger.dev — 백그라운드 작업 & AI 에이전트 플랫폼
{:.no_toc}

"타임아웃 없이, 서버 관리 없이, TypeScript 코드 그대로" 장시간 실행 작업을 클라우드에서 처리하는 완전 관리형 인프라 서비스.

### Link

- [Trigger.dev 공식 사이트](https://trigger.dev)
- [공식 문서](https://trigger.dev/docs)
- [GitHub](https://github.com/triggerdotdev/trigger.dev)
- [Supabase 파트너 페이지](https://supabase.com/partners/integrations/triggerdotdev)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 개요

Vercel, AWS Lambda 같은 서버리스 환경은 편리하지만 치명적인 한계가 있다.

```
AWS Lambda    → 최대 15분 타임아웃
Vercel        → 최대 5분 (무료), 300초 (유료)
Cloudflare    → 최대 30초 (CPU 시간)
```

LLM 기반 멀티스텝 분석, 영상 처리, 대용량 CSV 배치 처리 같은 작업은 이 제한에 금방 걸린다. Trigger.dev는 이 문제를 해결하기 위해 만들어진 플랫폼이다.

### 핵심 특징

| 기능 | 설명 |
|------|------|
| **타임아웃 없음** | 수 시간짜리 작업도 실행 가능 |
| **자동 재시도** | 실패 시 지수 백오프(exponential backoff) 포함 |
| **체크포인트-재개** | CRIU 기술로 작업 상태 스냅샷 저장, 대기 중 리소스 무료 |
| **자동 스케일링** | 트래픽에 따라 인스턴스 자동 확장/축소 |
| **동시성 제어** | 사용자/티어별 큐 설정 |
| **실시간 모니터링** | 대시보드에서 각 단계 시각적 추적 |
| **크론 스케줄** | 코드 또는 대시보드에서 스케줄 설정 |
| **Human-in-the-loop** | 사람 개입 대기 워크플로우 지원 |
| **오픈소스** | Apache 2.0, 자체 호스팅 가능 |

### 아키텍처 동작 방식

```
앱 코드 → task.trigger() 호출
           ↓
       즉시 핸들 반환 (사용자는 기다리지 않음)
           ↓
       Trigger.dev 클라우드에서 백그라운드 실행
           ↓
       대기 시: CRIU 체크포인트로 상태 저장 + 리소스 해제
       재개 시: 정확한 상태에서 복원
           ↓
       결과 → Realtime API로 프론트엔드 스트리밍 가능
```

**체크포인트-재개 시스템**이 가장 독특한 기능이다. 작업이 `wait.for()`로 대기 중일 때 CRIU(Checkpoint/Restore In Userspace) 기술로 전체 메모리 상태를 스냅샷으로 저장하고 인프라를 해제한다. 재개 시 정확한 상태에서 이어받기 때문에, 5초 이상의 대기는 **비용이 발생하지 않는다.**

---

## 요금제

Trigger.dev는 **컴퓨팅 사용량 기반** 요금제다. 코드가 실제로 실행되는 시간에만 비용이 발생한다.

### 플랜별 비교

| 항목 | 무료 | Hobby ($10) | Pro ($50) |
|------|------|-------------|-----------|
| 포함 크레딧 | $5/월 | $10/월 | $50/월 |
| 동시 실행 | 10개 | 25개 | 100개 |
| 크론 스케줄 | **10개** | 100개 | 1,000개 |
| 로그 보존 | **1일** | 7일 | 30일 |
| 알림 대상 | 1개 | 5개 | 25개 |
| 팀 멤버 | 5명 | 5명 | 25명 |
| 지원 | 커뮤니티 | 커뮤니티 | Slack |

### 머신 타입별 초당 비용

| 머신 | vCPU | RAM | 초당 비용 | 실행당 고정비 |
|------|------|-----|---------|------------|
| Micro | 0.25 | 0.25GB | $0.0000169 | $0.000025 |
| Small 1x | 0.5 | 0.5GB | $0.0000338 | $0.000025 |
| Small 2x | 1 | 1GB | $0.0000675 | $0.000025 |
| Medium 1x | 1 | 2GB | $0.0000850 | $0.000025 |
| Medium 2x | 2 | 4GB | $0.0001700 | $0.000025 |
| Large 1x | 4 | 8GB | $0.0003400 | $0.000025 |
| Large 2x | 8 | 16GB | $0.0006800 | $0.000025 |

### 비용 계산 예시

```
Small 1x 머신에서 10초 작업, 하루 100회 실행

1 run = (10초 × $0.0000338) + $0.000025
      = $0.000338 + $0.000025
      = $0.000363

1일  = 100 × $0.000363 = $0.0363
1월  = $0.0363 × 30    = $1.09
```

### 무료 플랜 실전 한계

무료 플랜에서 가장 큰 제약은 **크론 스케줄 10개 한도**와 **로그 1일 보존**이다.
하지만 자산별 개별 스케줄이 아닌 **배치 방식**으로 설계하면 스케줄 3~4개로도 50개 자산을 처리할 수 있다.

```typescript
// ❌ 나쁜 설계: 자산당 스케줄 1개 → 스케줄 50개 소비
// ✅ 좋은 설계: 스케줄 1개가 전체 자산 배치 처리

export const hourlyUpdate = schedules.task({
  id: "hourly-update",
  cron: "0 * * * *",       // 스케줄 1개만 소비
  run: async () => {
    const assets = await getWatchlist();  // DB에서 전체 목록 조회
    await batch.triggerAndWait(           // 병렬 처리
      assets.map(a => ({ task: fetchPrice, payload: a }))
    );
  },
});
```

---

## LLM 요금 구조

Trigger.dev는 **LLM을 제공하지 않는다.** 코드 실행 인프라만 담당하고, LLM 호출은 각자 보유한 API 키로 외부 제공자에 직접 요청된다.

### 비용 구조 개요

```
┌──────────────────────────────────────────────────────────┐
│                      내 코드                              │
│                                                          │
│  import { anthropic } from "@ai-sdk/anthropic"           │
│  → process.env.ANTHROPIC_API_KEY 자동 참조               │
└──────────────┬──────────────────┬───────────────────────-┘
               │                  │
               ▼                  ▼
  ┌────────────────────┐  ┌──────────────────────┐
  │   Trigger.dev      │  │  LLM 제공자           │
  │  컴퓨팅 비용 청구   │  │  토큰 사용 비용 청구  │
  │  (vCPU × 초)       │  │  (각 제공자 계정)     │
  └────────────────────┘  └──────────────────────┘
```

### API 키 설정

Trigger.dev 대시보드 → Environment Variables에서 등록:

```
ANTHROPIC_API_KEY  = sk-ant-xxxxxxxxxxxx
OPENAI_API_KEY     = sk-xxxxxxxxxxxx
GOOGLE_API_KEY     = AIzaxxxxxxxxxxxxxxxx
SUPABASE_URL       = https://xxx.supabase.co
SUPABASE_KEY       = eyJxxxxxxxxxxxxxxxx
```

코드에서는 일반 Node.js 환경변수와 동일하게 접근한다.

### LLM 사용 예시 (Vercel AI SDK)

```typescript
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";  // 내 Anthropic 계정
import { openai }    from "@ai-sdk/openai";      // 내 OpenAI 계정
import { google }    from "@ai-sdk/google";      // 내 Google AI 계정

export const analyzeStock = task({
  id: "analyze-stock",
  run: async ({ symbol }: { symbol: string }) => {

    // Claude → 내 Anthropic 계정에 청구
    const { text } = await generateText({
      model: anthropic("claude-haiku-4-5-20251001"),
      prompt: `${symbol} 종목을 분석해주세요.`,
    });

    return { analysis: text };
  },
});
```

### 제공자별 비용 최적화 전략

```typescript
// 단계적 모델 활용: 저렴한 모델로 1차 필터 → 중요한 것만 심층 분석

const importance = await generateText({
  model: google("gemini-1.5-flash"), // 무료 티어 or 초저가
  prompt: `이 뉴스의 중요도: high/medium/low?`,
});

if (importance.text === "high") {
  const deepAnalysis = await generateText({
    model: anthropic("claude-sonnet-4-6"), // 중요한 것만 고성능 모델
    prompt: `상세 기업 분석...`,
  });
}
```

| 용도 | 추천 모델 | 이유 |
|------|-----------|------|
| 1차 분류/필터 | Gemini 1.5 Flash | 무료 티어 존재 |
| 뉴스 호재/악재 분류 | Claude Haiku 4.5 | 분류 정확도, 저렴 |
| 기본적 분석 심층 | Claude Sonnet 4.6 | 복잡한 추론 필요 |
| 긴 문서 시황 분석 | Gemini 1.5 Pro | 100만 토큰 컨텍스트 |

> **주의**: ChatGPT Plus ($20/월)는 API 사용과 완전히 별개다. API는 `platform.openai.com`에서 별도 크레딧을 충전해야 한다. Anthropic도 마찬가지로 `console.anthropic.com`에서 API 계정을 따로 관리한다.

---

## Supabase 연동 예시

Trigger.dev와 Supabase는 공식 파트너십이 있어 연동이 매우 자연스럽다.

### 연동 패턴 3가지

**① Supabase Edge Function → Trigger.dev 태스크 호출**

DB 이벤트 발생 → Edge Function 웹훅 → Trigger.dev 태스크 트리거

```typescript
// supabase/functions/on-new-asset/index.ts (Deno)
import { tasks } from "@trigger.dev/sdk/v3";

Deno.serve(async (req) => {
  const payload = await req.json();
  // watchlist에 새 자산 추가 시 즉시 초기 분석 트리거
  await tasks.trigger("initial-analysis", {
    symbol: payload.record.symbol,
  });
  return new Response("OK");
});
```

**② Trigger.dev 태스크 내에서 Supabase CRUD**

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const fetchAndStore = task({
  id: "fetch-and-store",
  retry: { maxAttempts: 3 },
  run: async ({ symbol }: { symbol: string }) => {

    // 외부 API에서 데이터 수집
    const price = await fetchPriceFromAPI(symbol);

    // Supabase에 저장
    const { error } = await supabase
      .from("price_snapshots")
      .insert({ symbol, price: price.current, change_pct: price.change_pct });

    if (error) throw new Error(error.message); // 자동 재시도 트리거

    return { symbol, stored: true };
  },
});
```

**③ DB 상태 기반 배치 처리**

```typescript
export const batchAnalysis = schedules.task({
  id: "batch-analysis",
  cron: "0 9 * * 1-5", // 평일 오전 9시
  run: async () => {

    // active 자산 전체 조회
    const { data: assets } = await supabase
      .from("watchlist")
      .select("symbol, asset_type")
      .eq("active", true);

    // 병렬 처리 후 완료 대기
    const results = await batch.triggerAndWait(
      assets!.map(asset => ({
        task: analyzeFundamentals,
        payload: asset,
      }))
    );

    // 분석 완료 후 요약 레포트 생성
    await generateDailyReport.trigger({ results });
  },
});
```

---

## 투자 대시보드 운용 예시

Supabase + Trigger.dev + Next.js 조합으로 구성하는 투자 대시보드의 전체 구조.

### 시스템 아키텍처

```
[Next.js 프론트엔드]
        ↕ Realtime API
[Supabase]
  ├── watchlist          (관심 자산 목록)
  ├── price_snapshots    (가격 스냅샷 이력)
  ├── analysis_results   (AI 분석 결과)
  └── alerts             (알림 이력)
        ↕ DB Webhook / 직접 호출
[Trigger.dev]
  ├── hourly-price-fetch    (1시간 주기 가격 수집)
  ├── daily-analysis        (일별 AI 기본적 분석)
  ├── news-sentiment        (뉴스 호재/악재 분석)
  └── price-alert           (급등락 알림)
```

### Supabase 테이블 설계

```sql
-- 관심 자산 목록
CREATE TABLE watchlist (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol      TEXT NOT NULL,
  asset_type  TEXT,          -- 'stock', 'crypto', 'etf', 'index'
  name        TEXT,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 가격 스냅샷
CREATE TABLE price_snapshots (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol       TEXT NOT NULL,
  price        DECIMAL,
  change_pct   DECIMAL,
  volume       BIGINT,
  captured_at  TIMESTAMPTZ DEFAULT NOW()
);

-- AI 분석 결과
CREATE TABLE analysis_results (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol         TEXT NOT NULL,
  analysis_type  TEXT,   -- 'fundamental', 'technical', 'news_sentiment'
  content        JSONB,  -- 분석 결과 전체
  sentiment      TEXT,   -- 'bullish', 'bearish', 'neutral'
  analyzed_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### Trigger.dev 태스크 구성

```typescript
// trigger/tasks/price-fetcher.ts

// ① 시간별 가격 수집
export const hourlyPriceFetch = schedules.task({
  id: "hourly-price-fetch",
  cron: "0 * * * *",
  run: async () => {
    const { data: assets } = await supabase
      .from("watchlist").select("*").eq("active", true);

    await batch.triggerAndWait(
      assets!.map(asset => ({ task: fetchSinglePrice, payload: asset }))
    );
  },
});

// ② 개별 가격 조회 + 급등락 감지
export const fetchSinglePrice = task({
  id: "fetch-single-price",
  retry: { maxAttempts: 3, backoff: { type: "exponential" } },
  run: async ({ symbol, asset_type }: Asset) => {

    const price = await fetchPriceFromAPI(symbol, asset_type);

    await supabase.from("price_snapshots").insert({
      symbol, price: price.current, change_pct: price.change_pct,
    });

    // 5% 이상 급변 시 알림 트리거
    if (Math.abs(price.change_pct) > 5) {
      await priceAlert.trigger({ symbol, change_pct: price.change_pct });
    }
  },
});

// ③ 일별 AI 기본적 분석
export const dailyFundamental = schedules.task({
  id: "daily-fundamental",
  cron: "0 9 * * 1-5",
  run: async () => {
    const { data: assets } = await supabase
      .from("watchlist").select("symbol").eq("active", true);

    for (const asset of assets!) {
      await analyzeFundamentals.trigger({ symbol: asset.symbol });
      await wait.for({ seconds: 2 }); // 체크포인트: 대기 중 무과금
    }
  },
});

// ④ 뉴스 호재/악재 분석
export const newsSentiment = schedules.task({
  id: "news-sentiment",
  cron: "0 8,20 * * *", // 하루 2회
  run: async () => {
    const { data: assets } = await supabase
      .from("watchlist").select("symbol").eq("active", true);

    for (const asset of assets!) {
      const news = await fetchNewsAPI(asset.symbol);
      if (!news.length) continue;

      const { text } = await generateText({
        model: anthropic("claude-haiku-4-5-20251001"),
        prompt: `
          ${asset.symbol} 뉴스를 분석하세요:
          ${news.map(n => n.headline).join('\n')}

          JSON 형식으로 반환:
          {
            "positives": ["호재1", "호재2"],
            "negatives": ["악재1"],
            "risks": ["리스크1"],
            "sentiment": "bullish|bearish|neutral",
            "summary": "한 줄 요약"
          }
        `,
      });

      await supabase.from("analysis_results").insert({
        symbol: asset.symbol,
        analysis_type: "news_sentiment",
        content: JSON.parse(text),
        sentiment: JSON.parse(text).sentiment,
      });

      await wait.for({ seconds: 1 });
    }
  },
});
```

### 월 운영비 추산

| 단계 | 자산 수 | 업데이트 주기 | Trigger.dev | LLM (Claude Haiku) | 합계 |
|------|--------|-------------|------------|-------------------|------|
| MVP | 20개 | 1시간 | 무료 | ~$2 | ~$2 |
| 성장 | 50개 | 30분 | Hobby $10 | ~$8 | ~$18 |
| 본격 | 100개 | 15분 + 뉴스 | Pro $50 | ~$20 | ~$70 |

---

## Claude Code 연동 예시

Trigger.dev는 Claude Code 기반 AI 코딩 에이전트를 서버리스로 실행하는 용도로도 활용할 수 있다. 장시간 실행되는 코드 분석/수정 태스크를 API로 트리거하고 결과를 스트리밍으로 받는 구조다.

### Claude Agent SDK + Trigger.dev

```typescript
// trigger/tasks/code-agent.ts
import { task, wait } from "@trigger.dev/sdk/v3";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // ANTHROPIC_API_KEY 환경변수 자동 참조

export const codeReviewAgent = task({
  id: "code-review-agent",
  // 코드 분석은 오래 걸릴 수 있음 → 타임아웃 없음이 핵심
  run: async ({ repoUrl, prNumber }: { repoUrl: string; prNumber: number }) => {

    // PR diff 수집
    const diff = await fetchPRDiff(repoUrl, prNumber);

    // Claude에게 코드 리뷰 요청
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{
        role: "user",
        content: `다음 PR을 리뷰해주세요:\n\n${diff}`,
      }],
    });

    const review = response.content[0].type === "text"
      ? response.content[0].text
      : "";

    // 결과를 DB에 저장
    await supabase.from("code_reviews").insert({
      repo: repoUrl, pr_number: prNumber, review,
    });

    // GitHub에 코멘트 자동 등록
    await postGitHubComment(repoUrl, prNumber, review);

    return { reviewed: true, prNumber };
  },
});
```

### Human-in-the-loop 패턴

코드 자동 배포처럼 사람의 승인이 필요한 워크플로우:

```typescript
export const deployWithApproval = task({
  id: "deploy-with-approval",
  run: async ({ branch, environment }: DeployPayload) => {

    // Step 1: 테스트 실행
    const testResult = await runTests.triggerAndWait({ branch });
    if (!testResult.output.passed) {
      return { deployed: false, reason: "Tests failed" };
    }

    // Step 2: 사람의 승인 대기 (최대 24시간 — 이 동안 비용 없음)
    const approval = await wait.for({
      event: "deploy-approval",
      timeout: "24h",
    });

    if (!approval.approved) {
      return { deployed: false, reason: "Rejected by reviewer" };
    }

    // Step 3: 실제 배포
    await deployToEnvironment(branch, environment);
    return { deployed: true, environment };
  },
});
```

### AI 에이전트 오케스트레이터 패턴

여러 전문 에이전트를 조율하는 오케스트레이터:

```typescript
export const marketResearchOrchestrator = task({
  id: "market-research",
  run: async ({ symbols }: { symbols: string[] }) => {

    // 병렬로 전문 에이전트 실행
    const [prices, fundamentals, news, technicals] = await Promise.all([
      batch.triggerAndWait(symbols.map(s => ({ task: priceAgent, payload: { symbol: s } }))),
      batch.triggerAndWait(symbols.map(s => ({ task: fundamentalAgent, payload: { symbol: s } }))),
      batch.triggerAndWait(symbols.map(s => ({ task: newsAgent, payload: { symbol: s } }))),
      batch.triggerAndWait(symbols.map(s => ({ task: technicalAgent, payload: { symbol: s } }))),
    ]);

    // 최종 종합 분석 에이전트
    const { text: finalReport } = await generateText({
      model: anthropic("claude-sonnet-4-6"),
      prompt: `
        다음 분석 결과를 종합하여 투자 의견을 제시하세요.
        가격: ${JSON.stringify(prices)}
        기본: ${JSON.stringify(fundamentals)}
        뉴스: ${JSON.stringify(news)}
        기술: ${JSON.stringify(technicals)}
      `,
    });

    return { report: finalReport };
  },
});
```

---

## 로컬 구현 vs Trigger.dev 비교

### 핵심 차이: 재시도 로직

```python
# 로컬 Python: 직접 구현, 30줄+
def fetch_with_retry(symbol, max_retries=5):
    for attempt in range(max_retries):
        try:
            return fetch_price(symbol)
        except Exception as e:
            wait_time = (2 ** attempt) + random.uniform(0, 1)
            if attempt == max_retries - 1:
                send_alert(f"CRITICAL: {symbol} failed")
                raise
            time.sleep(wait_time)
```

```typescript
// Trigger.dev: 선언적, 3줄
export const fetchPrice = task({
  id: "fetch-price",
  retry: { maxAttempts: 5, backoff: { type: "exponential" } },
  run: async (payload) => { /* 비즈니스 로직만 */ },
});
```

### 항목별 비교

| | 로컬/자체 서버 | Trigger.dev |
|--|--------------|-------------|
| 인프라 관리 | 서버 유지보수 필요 | 완전 관리형 |
| 타임아웃 | 프로세스 제약 | 무제한 |
| 재시도 로직 | 직접 구현 | 선언적 설정 |
| 동시성 제어 | Lock/Queue 직접 구현 | 기본 제공 |
| 실패 가시성 | 로그 직접 관리 | 대시보드 시각화 |
| 스케일링 | 서버 스펙 업그레이드 | 자동 탄력적 확장 |
| 체크포인트 | 구현 불가 | CRIU 기반 자동 |
| Human-in-the-loop | 복잡한 상태 관리 | `wait.for()` 한 줄 |
| 비용 구조 | 서버 고정비 | 실제 사용량 기반 |
| 언어 | Python/Go 등 자유 | TypeScript/JS 전용 |

---

## 언제 쓰면 좋은가

**추천:**
- LLM 파이프라인이 여러 단계로 길어질 때
- 백그라운드 배치 작업의 모니터링/재시도가 필요할 때
- 서버리스 타임아웃에 계속 막힐 때
- Human-in-the-loop 워크플로우가 필요할 때
- 인프라 없이 빠르게 프로토타입을 만들 때

**비추천:**
- Python 기반 기존 프로젝트 (TypeScript/JS 전용)
- 단순 REST API 서버 (Next.js/FastAPI로 충분)
- 실시간 저지연이 핵심인 서비스 (콜드 스타트 고려)
- 초소형 사이드 프로젝트 (오버엔지니어링)

---

## 관련 포스트

- [Supabase](./supabase) — PostgreSQL 기반 BaaS, Trigger.dev와 조합하는 백엔드
- [Vercel](./vercel) — 프론트엔드 배포, Trigger.dev와 같이 쓰는 풀스택 조합
- [MCP](./mcp) — Model Context Protocol, AI 에이전트 도구 확장
