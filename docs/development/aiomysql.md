---
title: aiomysql
parent: 개발
nav_order: 37
description: "Python MySQL 비동기 라이브러리 비교 분석. aiomysql, asyncmy, mysql-connector-python의 성능, 안정성, SQLAlchemy 호환성을 비교하고 Supabase 비동기 클라이언트 옵션도 정리합니다."
---

# Python MySQL 비동기 라이브러리 비교
{:.no_toc}

Python에서 MySQL을 비동기로 사용하기 위한 라이브러리 선택지를 정리하고, Supabase 비동기 클라이언트까지 함께 비교합니다.

### Link

- [aiomysql GitHub](https://github.com/aio-libs/aiomysql)
- [asyncmy GitHub](https://github.com/long2ice/asyncmy)
- [MySQL Connector/Python Async Docs](https://dev.mysql.com/doc/connector-python/en/connector-python-asyncio.html)
- [supabase-py GitHub](https://github.com/supabase/supabase-py)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## MySQL 비동기 라이브러리

Python에서 MySQL을 `asyncio`로 사용하려면 전용 비동기 드라이버가 필요합니다. 현재 실질적인 선택지는 세 가지입니다.

### 전체 비교

| 항목 | aiomysql | asyncmy | mysql-connector-python |
|---|---|---|---|
| 기반 | PyMySQL (Pure Python) | PyMySQL + Cython | Oracle 공식 |
| GitHub Stars | ~1,700 | ~370 | - |
| 최신 버전 | 0.3.2 | 0.2.11 (2026-01) | 9.x |
| Python 지원 | 3.7+ | 3.9+ | 3.8+ |
| SQLAlchemy 지원 | `mysql+aiomysql://` | `mysql+asyncmy://` | 미지원 |
| Connection Pool | 내장 | 내장 | 미내장 |
| 성능 | 기준선 | 22~100% 빠름 | 동기 대비 26~49% 향상 |

---

## aiomysql

[PyMySQL](https://github.com/PyMySQL/PyMySQL)의 I/O 호출을 asyncio로 교체한 라이브러리입니다. aio-libs 프로젝트에서 관리하며 커뮤니티가 가장 큽니다.

### 특징

- Pure Python 구현 (C 컴파일 불필요)
- Connection Pool 내장
- SQLAlchemy 2.0 async dialect 공식 지원
- 레퍼런스와 예제가 가장 풍부

### 사용 예시

```python
import asyncio
import aiomysql

async def main():
    pool = await aiomysql.create_pool(
        host='127.0.0.1',
        port=3307,
        user='root',
        password='password',
        db='trading_bot',
        minsize=5,
        maxsize=10,
    )

    async with pool.acquire() as conn:
        async with conn.cursor() as cur:
            await cur.execute("SELECT * FROM ohlcv_1m LIMIT 10")
            rows = await cur.fetchall()
            print(rows)

    pool.close()
    await pool.wait_closed()

asyncio.run(main())
```

### SQLAlchemy 연동

```python
from sqlalchemy.ext.asyncio import create_async_engine

engine = create_async_engine(
    "mysql+aiomysql://root:password@127.0.0.1:3307/trading_bot"
)
```

---

## asyncmy

aiomysql과 API 호환을 유지하면서 핵심 프로토콜을 **Cython**으로 재작성한 고성능 드라이버입니다.

### 성능 벤치마크 (vs aiomysql)

| 테스트 항목 | asyncmy | 비교 |
|---|---|---|
| Connection Pool (QPS) | ~10,500 | **22~28% 빠름** |
| 대량 데이터 (50k rows) | ~0.090초 | **2배 빠름** |
| 동시 쿼리 | 유사 | 동등 |

### 특징

- Cython 컴파일로 프로토콜 파싱 최적화
- MySQL Replication (BinLog) 지원
- aiomysql과 API 호환 → 전환 비용 낮음
- SQLAlchemy 2.0에서 **asyncmy를 권장 dialect로 지정**

### 사용 예시

```python
import asyncio
import asyncmy

async def main():
    pool = await asyncmy.create_pool(
        host='127.0.0.1',
        port=3307,
        user='root',
        password='password',
        db='trading_bot',
    )

    async with pool.acquire() as conn:
        async with conn.cursor() as cur:
            await cur.execute("SELECT * FROM ohlcv_1m LIMIT 10")
            rows = await cur.fetchall()
            print(rows)

    pool.close()
    await pool.wait_closed()

asyncio.run(main())
```

aiomysql과 코드가 거의 동일한 것을 확인할 수 있습니다. import만 바꾸면 됩니다.

### SQLAlchemy 연동

```python
from sqlalchemy.ext.asyncio import create_async_engine

engine = create_async_engine(
    "mysql+asyncmy://root:password@127.0.0.1:3307/trading_bot"
)
```

---

## mysql-connector-python (공식)

Oracle이 직접 유지보수하는 공식 MySQL 드라이버입니다. `mysql.connector.aio` 모듈로 비동기를 지원합니다.

### 특징

- Oracle 공식 지원 → 장기 유지보수 보장
- `async with` 컨텍스트 매니저 지원
- `asyncio.gather()`로 병렬 쿼리 가능
- **SQLAlchemy async dialect 미지원** (독립 사용만 가능)

### 사용 예시

```python
import asyncio
from mysql.connector.aio import connect

async def main():
    async with await connect(
        user='root',
        password='password',
        host='127.0.0.1',
        port=3307,
        database='trading_bot',
    ) as cnx:
        async with await cnx.cursor() as cur:
            await cur.execute("SELECT * FROM ohlcv_1m LIMIT 10")
            rows = await cur.fetchall()
            print(rows)

asyncio.run(main())
```

### 제약사항

- Connection Pool을 자체적으로 제공하지 않음 → 별도 구현 필요
- SQLAlchemy async 미지원으로 ORM 사용 불가
- 커뮤니티 레퍼런스가 상대적으로 적음

---

## Supabase 비동기 클라이언트

Supabase Python은 별도 라이브러리 없이 공식 패키지에서 비동기를 지원합니다.

| 라이브러리 | 유지보수 | 최신 버전 | 비고 |
|---|---|---|---|
| **supabase** (공식) | Supabase 팀 | 2.28.0 (2026-02) | `acreate_client()` 내장 |
| supabase-py-async | 커뮤니티 | 2.5.6 | 공식 통합 전 포크, 비추천 |
| aiosupabase | 커뮤니티 | - | 비공식, 비추천 |

### 공식 패키지 사용

```python
from supabase import acreate_client

async def main():
    supabase = await acreate_client(
        supabase_url="https://xxx.supabase.co",
        supabase_key="your-anon-key",
    )

    # 비동기 쿼리
    response = await supabase.table("ohlcv_1m").select("*").limit(10).execute()
    print(response.data)
```

Realtime 기능(실시간 구독)은 비동기 클라이언트에서만 동작합니다. 별도 패키지 설치 없이 `pip install supabase`만으로 사용 가능합니다.

---

## 추천

### MySQL

| 평가 항목 | aiomysql | asyncmy | mysql-connector-python |
|---|---|---|---|
| 안정성/성숙도 | ★★★★★ | ★★★☆☆ | ★★★★★ |
| 커뮤니티/레퍼런스 | ★★★★★ | ★★☆☆☆ | ★★★☆☆ |
| 성능 | ★★★☆☆ | ★★★★★ | ★★★★☆ |
| SQLAlchemy 호환 | ★★★★★ | ★★★★★ | ☆☆☆☆☆ |

**가장 무난한 선택: aiomysql**

- 커뮤니티가 가장 크고 레퍼런스가 풍부
- PyMySQL 기반 프로젝트에서 마이그레이션이 자연스러움
- SQLAlchemy 호환으로 확장성 확보
- 성능 이슈 발생 시 asyncmy로 전환이 용이 (API 호환)

**성능 우선이라면: asyncmy**

- 대량 데이터 처리가 빈번한 경우
- SQLAlchemy가 공식 권장하는 MySQL async dialect
- aiomysql과 API 호환이므로 전환 비용 최소

### Supabase

공식 패키지(`supabase`)의 `acreate_client()`를 사용하면 됩니다. 별도 라이브러리 불필요.

### 설치

```bash
# MySQL 비동기 (무난한 선택)
pip install aiomysql

# MySQL 비동기 (고성능)
pip install asyncmy

# Supabase (비동기 포함)
pip install supabase
```
