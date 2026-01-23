---
title: Binance API
parent: 투자
nav_order: 10
description: "Binance API 완벽 가이드. REST API, WebSocket 스트림, 인증 방식, Rate Limit 정책. Spot, Futures, Margin 거래 API 엔드포인트 정리. 에러 코드와 모범 사례."
---

# Binance API
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 개요

Binance API는 프로그래밍 방식으로 거래, 시장 데이터 조회, 계정 관리를 할 수 있는 인터페이스를 제공함.

### API 유형

| 유형 | 용도 | 특징 |
|------|------|------|
| REST API | 요청-응답 방식 | 주문, 계정 조회, 과거 데이터 |
| WebSocket Streams | 실시간 데이터 스트리밍 | 시세, 오더북, 체결 내역 |
| WebSocket API | WebSocket으로 REST 기능 | 낮은 지연시간 거래 |

### Base URL

| 서비스 | REST API | WebSocket |
|--------|----------|-----------|
| Spot | `https://api.binance.com` | `wss://stream.binance.com:9443` |
| Spot (데이터 전용) | `https://data-api.binance.vision` | `wss://data-stream.binance.vision` |
| USDT-M Futures | `https://fapi.binance.com` | `wss://fstream.binance.com` |
| Coin-M Futures | `https://dapi.binance.com` | `wss://dstream.binance.com` |
| Testnet (Spot) | `https://testnet.binance.vision` | `wss://testnet.binance.vision` |
| Testnet (Futures) | `https://demo-fapi.binance.com` | `wss://fstream.binancefuture.com` |

---

## 인증 (Authentication)

### API Key 유형

| 보안 수준 | 설명 | 예시 |
|----------|------|------|
| NONE | 인증 불필요 | 시세 조회, 서버 시간 |
| USER_STREAM | API Key만 필요 | User Data Stream |
| MARKET_DATA | API Key만 필요 | 과거 데이터 조회 |
| TRADE | API Key + 서명 | 주문 생성/취소 |
| USER_DATA | API Key + 서명 | 잔고 조회, 주문 내역 |

### API Key 전달

```http
X-MBX-APIKEY: your-api-key
```

### HMAC SHA256 서명

TRADE, USER_DATA 엔드포인트는 `signature` 파라미터가 필요함.

#### 서명 생성 절차

1. 쿼리 스트링 + 요청 바디를 연결하여 `totalParams` 생성
2. Secret Key로 HMAC SHA256 해시
3. 결과를 16진수 문자열로 인코딩

#### 예시 (Python)

```python
import hashlib
import hmac
import time

api_key = "your_api_key"
secret_key = "your_secret_key"

# 파라미터 구성
params = {
    "symbol": "BTCUSDT",
    "side": "BUY",
    "type": "MARKET",
    "quantity": 0.001,
    "timestamp": int(time.time() * 1000)
}

# 쿼리 스트링 생성
query_string = "&".join([f"{k}={v}" for k, v in params.items()])

# 서명 생성
signature = hmac.new(
    secret_key.encode('utf-8'),
    query_string.encode('utf-8'),
    hashlib.sha256
).hexdigest()

# 최종 쿼리
final_query = f"{query_string}&signature={signature}"
```

#### recvWindow 파라미터

네트워크 지연으로 인한 문제 방지용. 요청이 `timestamp + recvWindow` 이내에 도착해야 유효.

```python
params["recvWindow"] = 5000  # 권장: 5000ms 이하
```

### 공식 서명 예제

다양한 언어의 서명 예제: [binance/binance-signature-examples](https://github.com/binance/binance-signature-examples)

---

## Rate Limit 정책

### Limit 유형

| 유형 | 설명 | 단위 |
|------|------|------|
| REQUEST_WEIGHT | 요청 가중치 합계 | IP 기준 |
| ORDERS | 주문 수 | 계정 기준 |
| RAW_REQUESTS | 순수 요청 수 | IP 기준 |

### Spot API Limit

| 항목 | 제한 |
|------|------|
| IP당 Request Weight | **6,000 / 분** (2023-08-25부터 1,200 → 6,000 증가) |
| 계정당 주문 수 | 10 / 초, 100,000 / 일 |
| 계정당 주문 수 (10초) | 50 / 10초 |
| SAPI 엔드포인트 (IP) | 12,000 / 분 (엔드포인트별 독립) |
| SAPI 엔드포인트 (UID) | 180,000 / 분 (엔드포인트별 독립) |

### Futures API Limit

| 항목 | 제한 |
|------|------|
| IP당 Request Weight | 2,400 / 분 |
| 계정당 주문 수 | VIP 등급에 따라 다름 |

### Weight 계산

각 엔드포인트마다 Weight가 다름:

| 엔드포인트 | Weight |
|-----------|--------|
| `GET /api/v3/ping` | 1 |
| `GET /api/v3/time` | 1 |
| `GET /api/v3/exchangeInfo` | 20 |
| `GET /api/v3/depth` (limit ≤ 100) | 5 |
| `GET /api/v3/depth` (limit = 500) | 10 |
| `GET /api/v3/depth` (limit = 1000) | 20 |
| `GET /api/v3/depth` (limit = 5000) | 50 |
| `GET /api/v3/klines` | 2 |
| `GET /api/v3/ticker/price` (단일) | 2 |
| `GET /api/v3/ticker/price` (전체) | 4 |
| `POST /api/v3/order` | 1 |
| `DELETE /api/v3/order` | 1 |

### 응답 헤더

| 헤더 | 설명 |
|------|------|
| `X-MBX-USED-WEIGHT-1M` | 현재 분의 사용된 Weight |
| `X-MBX-ORDER-COUNT-10S` | 10초간 주문 수 |
| `X-MBX-ORDER-COUNT-1M` | 1분간 주문 수 |
| `Retry-After` | 제한 해제까지 대기 시간 (초) |

### 제한 초과 시

| HTTP 코드 | 상태 | 설명 |
|-----------|------|------|
| 429 | Rate Limit | 요청 제한 초과 |
| 418 | IP Ban | 반복 위반으로 IP 차단 |

IP 차단 기간은 반복 위반 시 2분 → 3일까지 증가.

---

## Spot API 주요 엔드포인트

### General Endpoints

| 메서드 | 엔드포인트 | 설명 | Weight |
|--------|-----------|------|--------|
| GET | `/api/v3/ping` | 연결 테스트 | 1 |
| GET | `/api/v3/time` | 서버 시간 | 1 |
| GET | `/api/v3/exchangeInfo` | 거래소 정보 (심볼, 규칙) | 20 |

### Market Data Endpoints

| 메서드 | 엔드포인트 | 설명 | 주요 파라미터 |
|--------|-----------|------|-------------|
| GET | `/api/v3/depth` | 오더북 | symbol, limit |
| GET | `/api/v3/trades` | 최근 체결 내역 | symbol, limit |
| GET | `/api/v3/historicalTrades` | 과거 체결 내역 | symbol, limit, fromId |
| GET | `/api/v3/aggTrades` | 집계 체결 내역 | symbol, startTime, endTime |
| GET | `/api/v3/klines` | 캔들스틱 | symbol, interval, limit |
| GET | `/api/v3/avgPrice` | 평균 가격 | symbol |
| GET | `/api/v3/ticker/24hr` | 24시간 통계 | symbol |
| GET | `/api/v3/ticker/price` | 현재 가격 | symbol |
| GET | `/api/v3/ticker/bookTicker` | 최우선 호가 | symbol |

#### Kline Interval 값

```
1s, 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
```

### Trading Endpoints (TRADE 권한)

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| POST | `/api/v3/order` | 주문 생성 |
| POST | `/api/v3/order/test` | 주문 테스트 (실제 실행 X) |
| GET | `/api/v3/order` | 주문 조회 |
| DELETE | `/api/v3/order` | 주문 취소 |
| GET | `/api/v3/openOrders` | 미체결 주문 조회 |
| DELETE | `/api/v3/openOrders` | 모든 미체결 주문 취소 |
| GET | `/api/v3/allOrders` | 전체 주문 내역 |

#### 주문 타입

| 타입 | 설명 | 필수 파라미터 |
|------|------|-------------|
| LIMIT | 지정가 | price, quantity, timeInForce |
| MARKET | 시장가 | quantity 또는 quoteOrderQty |
| STOP_LOSS | 손절 | quantity, stopPrice |
| STOP_LOSS_LIMIT | 손절 지정가 | price, quantity, stopPrice, timeInForce |
| TAKE_PROFIT | 익절 | quantity, stopPrice |
| TAKE_PROFIT_LIMIT | 익절 지정가 | price, quantity, stopPrice, timeInForce |
| LIMIT_MAKER | Maker 전용 지정가 | price, quantity |

#### timeInForce 값

| 값 | 설명 |
|----|------|
| GTC | Good Till Cancel - 취소 전까지 유효 |
| IOC | Immediate Or Cancel - 즉시 체결 가능 수량만 |
| FOK | Fill Or Kill - 전량 체결 또는 취소 |

### Account Endpoints (USER_DATA 권한)

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/v3/account` | 계정 정보 (잔고 포함) |
| GET | `/api/v3/myTrades` | 체결 내역 |
| GET | `/api/v3/rateLimit/order` | 주문 Rate Limit 상태 |

---

## Margin API 주요 엔드포인트

Base URL: `https://api.binance.com`

### Cross Margin

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| POST | `/sapi/v1/margin/transfer` | Spot ↔ Margin 자산 이체 |
| POST | `/sapi/v1/margin/borrow-repay` | 대출/상환 |
| GET | `/sapi/v1/margin/borrow-repay` | 대출/상환 기록 조회 |
| GET | `/sapi/v1/margin/maxBorrowable` | 최대 대출 가능 금액 |
| GET | `/sapi/v1/margin/account` | Cross Margin 계정 정보 |
| POST | `/sapi/v1/margin/order` | Margin 주문 |
| GET | `/sapi/v1/margin/interestRateHistory` | 이자율 내역 |

### Isolated Margin

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/sapi/v1/margin/isolated/account` | Isolated Margin 계정 정보 |
| POST | `/sapi/v1/margin/isolated/transfer` | Isolated Margin 자산 이체 |

### sideEffectType 파라미터

Margin 주문 시 자동 대출/상환 설정:

| 값 | 설명 |
|----|------|
| NO_SIDE_EFFECT | 수동 대출/상환 (기본값) |
| MARGIN_BUY | 매수 시 자동 대출 |
| AUTO_REPAY | 매도 시 자동 상환 |
| AUTO_BORROW_REPAY | 자동 대출 및 상환 |

---

## Futures API 주요 엔드포인트

Base URL: `https://fapi.binance.com` (USDT-M)

### Market Data

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/fapi/v1/exchangeInfo` | 거래소 정보 |
| GET | `/fapi/v1/depth` | 오더북 |
| GET | `/fapi/v1/klines` | 캔들스틱 |
| GET | `/fapi/v1/premiumIndex` | 프리미엄 인덱스, Mark Price |
| GET | `/fapi/v1/fundingRate` | Funding Rate 내역 |
| GET | `/fapi/v1/openInterest` | Open Interest |

### Trading

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| POST | `/fapi/v1/order` | 주문 생성 |
| GET | `/fapi/v1/order` | 주문 조회 |
| DELETE | `/fapi/v1/order` | 주문 취소 |
| GET | `/fapi/v1/openOrders` | 미체결 주문 |
| POST | `/fapi/v1/leverage` | 레버리지 설정 |
| POST | `/fapi/v1/marginType` | 마진 타입 설정 (ISOLATED/CROSSED) |

### Account

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/fapi/v2/account` | 계정 정보 |
| GET | `/fapi/v2/positionRisk` | 포지션 정보 |
| GET | `/fapi/v2/balance` | 잔고 조회 |
| GET | `/fapi/v1/income` | 수익 내역 |

---

## WebSocket Streams

### 연결 방식

**단일 스트림:**
```
wss://stream.binance.com:9443/ws/<streamName>
```

**복합 스트림:**
```
wss://stream.binance.com:9443/stream?streams=<stream1>/<stream2>/<stream3>
```

### 주요 스트림

| 스트림 이름 | 설명 | 예시 |
|------------|------|------|
| `<symbol>@trade` | 실시간 체결 | btcusdt@trade |
| `<symbol>@kline_<interval>` | 실시간 캔들 | btcusdt@kline_1m |
| `<symbol>@depth` | 오더북 업데이트 | btcusdt@depth |
| `<symbol>@depth@100ms` | 오더북 (100ms) | btcusdt@depth@100ms |
| `<symbol>@bookTicker` | 최우선 호가 | btcusdt@bookTicker |
| `<symbol>@ticker` | 24h 통계 | btcusdt@ticker |
| `<symbol>@miniTicker` | 미니 통계 | btcusdt@miniTicker |
| `<symbol>@aggTrade` | 집계 체결 | btcusdt@aggTrade |
| `!ticker@arr` | 전체 심볼 통계 | - |
| `!miniTicker@arr` | 전체 미니 통계 | - |

### WebSocket 제한

| 항목 | 제한 |
|------|------|
| 연결 수 | 300개 / 5분 / IP |
| 스트림 수 | 1,024개 / 연결 |
| 수신 메시지 | 5개 / 초 |
| Ping/Pong | 1분 내 응답 필수 |

### Ping/Pong

서버에서 Ping을 보내면 Pong으로 응답해야 함. 1분 내 응답하지 않으면 연결 종료.

### User Data Stream

계정 정보 실시간 수신 (잔고 변경, 주문 상태 등):

```
POST /api/v3/userDataStream  # Listen Key 생성
PUT /api/v3/userDataStream   # Listen Key 연장 (30분마다)
DELETE /api/v3/userDataStream # Listen Key 삭제
```

WebSocket 연결:
```
wss://stream.binance.com:9443/ws/<listenKey>
```

---

## 에러 코드

### HTTP 상태 코드

| 코드 | 설명 |
|------|------|
| 4XX | 클라이언트 에러 (잘못된 요청) |
| 403 | WAF 제한 위반 |
| 409 | 취소/교체 중 부분 체결 발생 |
| 418 | IP 차단 |
| 429 | Rate Limit 초과 |
| 5XX | 서버 에러 |

### 주요 에러 코드

| 코드 | 메시지 | 설명 |
|------|--------|------|
| -1000 | UNKNOWN | 알 수 없는 에러 |
| -1001 | DISCONNECTED | 내부 에러, 재시도 필요 |
| -1002 | UNAUTHORIZED | 권한 없음 |
| -1003 | TOO_MANY_REQUESTS | Rate Limit 초과 |
| -1006 | UNEXPECTED_RESP | 비정상 응답 |
| -1007 | TIMEOUT | 타임아웃 |
| -1014 | UNKNOWN_ORDER_COMPOSITION | 지원하지 않는 주문 조합 |
| -1015 | TOO_MANY_ORDERS | 주문 수 초과 |
| -1021 | INVALID_TIMESTAMP | 타임스탬프 범위 초과 |
| -1022 | INVALID_SIGNATURE | 서명 불일치 |
| -1100 | ILLEGAL_CHARS | 파라미터에 잘못된 문자 |
| -1101 | TOO_MANY_PARAMETERS | 파라미터 수 초과 |
| -1102 | MANDATORY_PARAM_EMPTY | 필수 파라미터 누락 |
| -1121 | BAD_SYMBOL | 유효하지 않은 심볼 |
| -2010 | NEW_ORDER_REJECTED | 주문 거부 |
| -2011 | CANCEL_REJECTED | 취소 거부 |
| -2013 | NO_SUCH_ORDER | 주문 없음 |
| -2014 | BAD_API_KEY_FMT | API Key 형식 오류 |
| -2015 | REJECTED_MBX_KEY | 유효하지 않은 API Key |

### Margin 관련 에러

| 코드 | 설명 |
|------|------|
| -3006 | 최대 대출 금액 초과 |
| -3012 | 해당 자산 대출 불가 |
| -3015 | 상환 금액이 대출 금액 초과 |

---

## 모범 사례 (Best Practices)

### Rate Limit 관리

1. **응답 헤더 모니터링**: `X-MBX-USED-WEIGHT-1M` 확인
2. **WebSocket 활용**: 실시간 데이터는 REST 대신 WebSocket 사용
3. **캐싱**: `exchangeInfo` 등 자주 변경되지 않는 데이터 캐싱
4. **배치 요청**: 가능한 경우 여러 심볼을 한 번에 조회

### 안정성

1. **타임아웃 설정**: 10초 이상 설정 권장
2. **재시도 로직**: 5XX 에러, TIMEOUT 시 지수 백오프
3. **Listen Key 갱신**: User Data Stream 사용 시 30분마다 갱신
4. **서버 시간 동기화**: `GET /api/v3/time`으로 시간 동기화

### 보안

1. **API Key 권한 최소화**: 필요한 권한만 부여
2. **IP 제한**: API Key에 허용 IP 설정
3. **Secret Key 보호**: 환경 변수로 관리, 코드에 직접 포함 금지
4. **recvWindow 설정**: 5000ms 이하 권장

### 주문

1. **Test 엔드포인트 활용**: 실제 주문 전 `/order/test`로 검증
2. **Testnet 사용**: 개발 시 Testnet에서 테스트
3. **Client Order ID**: 중복 주문 방지를 위해 `newClientOrderId` 활용

---

## 공식 SDK 및 도구

### 공식 라이브러리

| 언어 | 저장소 |
|------|--------|
| Python | [binance-connector-python](https://github.com/binance/binance-connector-python) |
| Python (Futures) | [binance-futures-connector-python](https://github.com/binance/binance-futures-connector-python) |
| JavaScript | [binance-connector-node](https://github.com/binance/binance-connector-node) |
| Java | [binance-connector-java](https://github.com/binance/binance-connector-java) |

### 설치 (Python)

```bash
pip install binance-connector        # Spot
pip install binance-futures-connector # Futures
```

### Postman Collection

Binance는 공식 Postman Collection을 제공하여 빠른 API 테스트 가능.

---

## 참고 자료

### 공식 문서

- [Binance Spot API Documentation](https://developers.binance.com/docs/binance-spot-api-docs/rest-api)
- [Binance Spot API GitHub](https://github.com/binance/binance-spot-api-docs)
- [Binance Futures API Documentation](https://developers.binance.com/docs/derivatives/usds-margined-futures/general-info)
- [Binance Margin Trading API](https://developers.binance.com/docs/margin_trading/borrow-and-repay/Margin-Account-Borrow-Repay)
- [WebSocket Streams](https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams)

### Rate Limit 관련

- [Spot API Limits](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/limits)
- [Futures Rate Limits FAQ](https://www.binance.com/en/support/faq/rate-limits-on-binance-futures-281596e222414cdd9051664ea621cdc3)
- [Rate Limit 증가 공지 (2023)](https://www.binance.com/en/support/announcement/detail/9820396bf54644c39e666b4780622846)

### 인증 및 보안

- [Request Security](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/request-security)
- [Signature Examples GitHub](https://github.com/binance/binance-signature-examples)
- [HMAC Signature Academy](https://academy.binance.com/en/articles/hmac-signature-what-it-is-and-how-to-use-it-for-binance-api-security)

### 에러 처리

- [Error Codes Documentation](https://developers.binance.com/docs/binance-spot-api-docs/errors)
- [Error Codes GitHub](https://github.com/binance/binance-spot-api-docs/blob/master/errors.md)

### 엔드포인트 레퍼런스

- [General Endpoints](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/general-endpoints)
- [Market Data Endpoints](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
- [Trading Endpoints](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints)
- [Account Endpoints](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/account-endpoints)
- [Margin Best Practice](https://developers.binance.com/docs/margin_trading/best-practice)

### 학습 자료

- [Binance Academy: Rate Limit 회피 방법](https://academy.binance.com/en/articles/how-to-avoid-getting-banned-by-rate-limits)
- [python-binance 문서](https://python-binance.readthedocs.io/en/latest/)
