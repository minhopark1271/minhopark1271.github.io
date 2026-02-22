---
title: aiohttp
parent: 개발
nav_order: 38
description: "Python 비동기 HTTP 클라이언트 라이브러리 비교. aiohttp, httpx, niquests, curl_cffi의 성능 차이 원인과 아키텍처를 분석하고, 사용 목적별 최적 라이브러리를 추천합니다."
---

# Python 비동기 HTTP 클라이언트 비교
{:.no_toc}

Python에서 비동기 API 호출에 사용할 수 있는 HTTP 클라이언트 라이브러리를 비교하고, 성능 차이의 근본 원인을 분석합니다.

### Link

- [aiohttp GitHub](https://github.com/aio-libs/aiohttp)
- [httpx GitHub](https://github.com/encode/httpx)
- [niquests GitHub](https://github.com/jawah/niquests)
- [curl_cffi GitHub](https://github.com/lexiforest/curl_cffi)
- [httpx Async Performance Issue #3215](https://github.com/encode/httpx/issues/3215)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 전체 비교

| 항목 | aiohttp | httpx | niquests | curl_cffi |
|---|---|---|---|---|
| GitHub Stars | ~15,000+ | ~13,000+ | ~1,000+ | ~2,000+ |
| HTTP/2 | X | O | O | O |
| HTTP/3 | X | X | O | O |
| Sync + Async | Async only | O | O | O |
| WebSocket | O | X | O | O |
| 서버 기능 | O | X | X | X |
| HTTP 파서 | httptools (C) | h11 (Pure Python) | urllib3 기반 | libcurl (C) |
| API 스타일 | 독자적 | requests 호환 | requests drop-in | requests 유사 |

---

## aiohttp

asyncio 전용으로 설계된 비동기 HTTP 클라이언트/서버 라이브러리입니다. aio-libs 프로젝트에서 관리하며 async Python 생태계에서 가장 성숙한 선택지입니다.

### 특징

- **Async 전용 설계**: asyncio 이벤트 루프에 최적화된 내부 구조
- **httptools 파서**: C 바인딩 기반 HTTP 파서로 파싱 오버헤드 최소화
- **클라이언트 + 서버**: HTTP 서버 기능도 제공 (ASGI 대안)
- **WebSocket 내장**: 별도 라이브러리 없이 WebSocket 통신 가능
- **Connection Pool**: `TCPConnector`로 세밀한 커넥션 관리 가능

### 사용 예시

```python
import aiohttp
import asyncio

async def fetch_prices(symbols: list[str]):
    async with aiohttp.ClientSession() as session:
        tasks = []
        for symbol in symbols:
            url = f"https://api.binance.com/api/v3/ticker/price?symbol={symbol}"
            tasks.append(session.get(url))

        responses = await asyncio.gather(*tasks)
        results = []
        for resp in responses:
            data = await resp.json()
            results.append(data)
        return results

asyncio.run(fetch_prices(["BTCUSDT", "ETHUSDT", "SOLUSDT"]))
```

### 제약사항

- sync 코드에서 사용 불가 (이벤트 루프 필수)
- `requests`와 다른 API → 학습 곡선 존재
- HTTP/2 미지원

---

## httpx

`requests` 호환 API를 유지하면서 sync/async를 모두 지원하는 모던 HTTP 클라이언트입니다. FastAPI를 만든 encode 팀이 개발합니다.

### 특징

- **Sync + Async 동시 지원**: 동일한 API로 `Client` / `AsyncClient` 선택
- **requests 호환 API**: 기존 코드 마이그레이션이 쉬움
- **HTTP/2 네이티브 지원**
- **테스트 친화적**: `AsyncClient`를 mock하여 FastAPI 테스트에 활용
- **완전한 type hint 지원**

### 사용 예시

```python
import httpx
import asyncio

async def fetch_prices(symbols: list[str]):
    async with httpx.AsyncClient() as client:
        tasks = [
            client.get(f"https://api.binance.com/api/v3/ticker/price?symbol={s}")
            for s in symbols
        ]
        responses = await asyncio.gather(*tasks)
        return [r.json() for r in responses]

asyncio.run(fetch_prices(["BTCUSDT", "ETHUSDT", "SOLUSDT"]))
```

### 제약사항

- 고동시성에서 aiohttp 대비 성능 열세 (원인은 아래 성능 분석 참고)
- 무거운 부하에서 `httpx.ReadError` 발생 가능

---

## niquests

`requests`의 완전한 drop-in 대체 라이브러리입니다. HTTP/1.1, 2, 3을 자동 선택하며, 기존 코드 변경 없이 업그레이드할 수 있습니다.

### 특징

- **requests 완전 호환**: import만 바꾸면 됨
- **HTTP/1.1 · 2 · 3 자동 협상**
- **WebSocket + SSE 지원**
- **DNSSEC, OCSP 등 보안 기능 내장**

### 사용 예시

```python
import niquests
import asyncio

async def fetch_prices(symbols: list[str]):
    async with niquests.AsyncSession() as session:
        tasks = [
            session.get(f"https://api.binance.com/api/v3/ticker/price?symbol={s}")
            for s in symbols
        ]
        responses = await asyncio.gather(*tasks)
        return [r.json() for r in responses]

asyncio.run(fetch_prices(["BTCUSDT", "ETHUSDT", "SOLUSDT"]))
```

### 제약사항

- 커뮤니티 규모가 작음 (프로덕션 사례 제한적)
- 벤치마크 데이터 부족

---

## curl_cffi

libcurl의 Python 바인딩으로, 브라우저의 TLS 핑거프린트를 모방할 수 있는 HTTP 클라이언트입니다.

### 특징

- **최고 수준 성능**: aiohttp와 동등, requests/httpx 대비 20~30% 빠름
- **TLS 핑거프린트 우회**: 브라우저의 JA3 핑거프린트를 모방하여 봇 감지 우회
- **HTTP/2 · 3 지원**
- **requests 유사 API**

### 사용 예시

```python
from curl_cffi.requests import AsyncSession
import asyncio

async def fetch_prices(symbols: list[str]):
    async with AsyncSession() as session:
        tasks = [
            session.get(f"https://api.binance.com/api/v3/ticker/price?symbol={s}")
            for s in symbols
        ]
        responses = await asyncio.gather(*tasks)
        return [r.json() for r in responses]

asyncio.run(fetch_prices(["BTCUSDT", "ETHUSDT", "SOLUSDT"]))
```

### 제약사항

- libcurl C 라이브러리 의존 (순수 Python이 아님)
- 설치 환경 제약 가능 (wheel 미제공 플랫폼)
- 디버깅이 상대적으로 어려움

---

## 성능 차이의 근본 원인

### "aiohttp가 httpx보다 10배 빠르다"는 정확한가?

결론부터 말하면 **조건부로만 맞는 수치**입니다.

### 벤치마크 수치

Oxylabs 벤치마크 (M1 Mac, 기가비트 인터넷):

| 동시 요청 수 | httpx | aiohttp | 차이 |
|---|---|---|---|
| 100개 | 1.22초 | 1.19초 | 거의 동일 |
| 1,000개 | 10.22초 | 3.79초 | ~2.7배 |

"10배" 수치는 GitHub Issue #3215에서 **네트워크 지연이 극히 작은 로컬 서버** 대상 테스트에서 나온 것입니다.

### 왜 차이가 나는가?

API 호출의 총 소요 시간은 두 부분으로 나뉩니다:

```
총 소요 시간 = 라이브러리 내부 처리 시간 + 네트워크 대기 시간
```

**네트워크 대기 시간이 지배적인 일반적 상황**에서는 라이브러리 내부 처리 시간이 무시할 수 있는 수준이므로 차이가 거의 없습니다. 차이가 벌어지는 것은 **동시 요청이 수백~수천 개로 늘어나면서 라이브러리 내부 오버헤드가 누적**될 때입니다.

httpx가 느린 세 가지 아키텍처 원인:

**1. AnyIO Lock 추상화 오버헤드**

httpx의 내부 라이브러리 httpcore는 asyncio와 trio 양쪽을 지원하기 위해 `asyncio.Lock` 대신 `anyio.Lock`을 사용합니다. 이 추상화 레이어의 CPU 비용이 동시 요청마다 누적됩니다.

```
httpx:   anyio.Lock → asyncio/trio 분기 → 실제 Lock
aiohttp: asyncio.Lock → 직접 실행
```

실제로 `anyio.Lock` → `asyncio.Lock`으로 패치하면 성능이 급격히 개선됨이 확인되었습니다.

**2. 커넥션 풀 헬스체크**

httpx의 `AsyncConnectionPool`은 요청을 배정할 때마다 모든 커넥션에 대해 `is_readable` 소켓 상태 체크를 반복 수행합니다. 동시 요청이 많을수록 이 체크 횟수가 기하급수적으로 증가하여 병목이 됩니다.

**3. HTTP 파서 구현 차이**

| 항목 | httpx | aiohttp |
|---|---|---|
| 파서 | h11 (Pure Python) | httptools (C 바인딩) |
| 설계 철학 | 스펙 정확성 우선 | 성능 우선 |
| 오버헤드 | 상대적으로 높음 | 최소 |

### 실질적 영향 정리

```
외부 API 호출 (네트워크 지연 ~100ms):
  ├── 동시 10~50개  → httpx ≈ aiohttp (차이 무의미)
  ├── 동시 100~500개 → aiohttp가 약간 유리
  └── 동시 1,000개+  → aiohttp가 확실히 유리 (~2.7x)

로컬/내부 API 호출 (네트워크 지연 ~1ms):
  ├── 라이브러리 오버헤드가 상대적으로 커짐
  └── 동시 20개에서도 차이 발생 가능 (최대 ~10x)
```

핵심은 **네트워크 지연이 클수록 라이브러리 차이는 희석**되고, **네트워크 지연이 작고 동시 요청이 많을수록 차이가 극대화**된다는 것입니다.

---

## 사용 목적별 추천

| 상황 | 추천 | 이유 |
|---|---|---|
| FastAPI 프로젝트 + 일반 API 호출 | **httpx** | 동일 팀 개발, sync/async 유연성 |
| 대량 동시 연결 (수백 개 이상) | **aiohttp** | 검증된 고동시성 성능 |
| 기존 requests 코드 마이그레이션 | **httpx** 또는 **niquests** | API 호환성 |
| 봇 감지 우회 (웹 스크래핑) | **curl_cffi** | TLS 핑거프린트 모방 |
| HTTP/3 필요 | **niquests** 또는 **curl_cffi** | HTTP/3 지원 |

일반적인 서버 사이드 애플리케이션에서 동시 API 호출이 수십 개 수준이라면, 어떤 라이브러리를 선택해도 성능 차이는 체감할 수 없는 수준입니다. 이 경우 API 편의성, 생태계 호환성, 유지보수성이 더 중요한 선택 기준이 됩니다.

### 설치

```bash
# 고동시성 async 전용
pip install aiohttp

# sync/async 범용 (FastAPI 추천)
pip install httpx

# requests drop-in 대체 (HTTP/3 포함)
pip install niquests

# 최고 성능 + TLS 우회
pip install curl_cffi
```
