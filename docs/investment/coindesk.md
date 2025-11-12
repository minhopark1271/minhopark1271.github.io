---
title: Coindesk
parent: 투자
nav_order: 7
---

# Coindesk API
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## APIs

- [APIs Introduction](https://developers.coindesk.com/documentation/data-api/introduction)
- [API Keys](https://developers.coindesk.com/settings/api-keys)

---

## Indices & Ref. Rates

- [OHLCV](https://data-api.coindesk.com/index/cc/v1/historical/minutes?market=cadli&instrument=BTC-USD&limit=1&aggregate=1&fill=true&apply_mapping=true&response_format=JSON&to_ts=1762822793)
- [Markets](https://data-api.coindesk.com/index/cc/v2/markets)
- [Instruments](https://data-api.coindesk.com/index/cc/v1/markets/instruments?market=cadli&instruments=BTC-USD,ETH-USD&instrument_status=ACTIVE)

### Markets code options

| 코드       | 정식 명칭                                                   | 설명                                                                                           |
|------------|--------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| **cadli**  | Adaptive Diversified Liquidity Index                         | 여러 거래소의 디지털 자산 거래 데이터를 통합해 USD 기준으로 산출한 **공정가(reference price)** 지수. 24시간 거래량 가중 평균, 시간 페널티 및 이상치 필터링 방식 적용. |
| **ccix**   | CoinDesk Crypto Index / Reference Rate                       | 단일 자산(예: BTC‑USD) 기준의 참조가격 지수로, 250개 이상 거래소의 체결 데이터를 취합해 시장 대표 가격을 제공. 24시간 볼륨 가중, 시간 페널티, 이상치 제거 적용. ([indices.coindesk.com](https://indices.coindesk.com/ccix)) |
| **ccxrp**  | CoinDesk XRP Price Index                                     | XRP/USD 등 여러 거래소에서의 가격을 종합해 계산된 리플(XRP)의 참조가격 지수. (단일 자산 지수 형태) |
| **ccxrpperp** | CoinDesk XRP Perpetual Futures Index                     | 리플(XRP)의 무기한 선물(perpetual futures) 시장을 기반으로 산출된 가격지표. 여러 거래소 선물체결 데이터를 통합하여 산출됨. |
| **cd_mc**  | CoinDesk Market Cap Index                                    | 전체 암호화폐 시장의 시가총액을 기반으로 산출된 지수로, 시장 전체 규모 및 흐름을 추적. |
| **cdi_b**  | CoinDesk Bitcoin Index                                       | 비트코인(BTC)의 기준가를 산출하는 지수. 여러 거래소의 BTC/USD 체결 데이터를 통합해 제공. |
| **cdi_mda**| CoinDesk Major Digital Assets Index                           | 시가총액 상위 주요 디지털 자산들(BTC, ETH, SOL 등)을 포함하여 구성된 대표 지수. 시장 주요 자산군 성과를 반영. |
| **cdor**   | CoinDesk DeFi Rate                                            | 탈중앙금융(DeFi) 프로토콜의 예치율 및 대출금리 등을 종합해 만든 **탈중앙금융 금리지수(DeFi Reference Rate)**. |
| **sda**    | CoinDesk Smart Contract Platform Index                         | 스마트 컨트랙트 플랫폼(예: ETH, ADA, SOL 등) 관련 토큰들의 가격을 종합해 산출된 지수로, L1 생태계의 흐름을 반영. |

### Market, Instrument pairs

Market별 가용한 Instruments 조회하려니 브라우저에서는 타임아웃.  

참조할만한 인덱스 목록 (binance x 10 스케일 볼륨):

- cadli, BTC-USD
- cadli, BTC-USDT
- cadli, ETH-USD
- cadli, ETH-USDT
- ccix, BTC-USD
- ccix, BTC-USDT
- ccix, ETH-USD
- ccix, ETH-USDT

### Fare Rates

- [FOREX rates(403)](https://data-api.coindesk.com/index/cc/v1/latest/tick/forex?instruments=GBP-USD,MYR-USD)
- [OHLCV cadli USD-JPY](https://data-api.coindesk.com/index/cc/v1/historical/minutes?market=cadli&instrument=USD-JPY)

---

## Spot

- [OHLCV](https://data-api.coindesk.com/spot/v1/historical/minutes?market=kraken&instrument=BTC-USD&limit=1&aggregate=1&fill=true&apply_mapping=true&response_format=JSON&to_ts=1762822793)
- [Market](https://data-api.coindesk.com/spot/v2/markets)
- [Market specific](https://data-api.coindesk.com/spot/v2/markets?markets=binance)
- [Instrument](https://data-api.coindesk.com/spot/v1/markets/instruments?market=kraken&instrument_status=ACTIVE)
- [Instrument specific](https://data-api.coindesk.com/spot/v1/markets/instruments?market=kraken&instruments=BTC-USD,ETH-USD&instrument_status=ACTIVE)

---

## Future

- [OHLCV](https://data-api.coindesk.com/futures/v1/historical/minutes?market=binance&instrument=BTC-USDT-VANILLA-PERPETUAL&limit=1&aggregate=1&fill=true&apply_mapping=true&response_format=JSON&to_ts=1762822793)
- [Market](https://data-api.coindesk.com/futures/v2/markets)
- [Market specific](https://data-api.coindesk.com/futures/v2/markets?markets=binance)
- [Instrument](https://data-api.coindesk.com/futures/v1/markets/instruments?market=binance&instrument_status=ACTIVE)
- [Instrument specific](https://data-api.coindesk.com/futures/v1/markets/instruments?market=kraken&instruments=BTC-USD-INVERSE-PERPETUAL,ETH-USD-INVERSE-PERPETUAL&instrument_status=ACTIVE)

### OHLCV 응답 주요 변수

- TIMESTAMP
- MARKET
- MAPPED_INSTRUMENT
- QUOTE_CURRENCY
- SETTLEMENT_CURRENCY
- OPEN
- HIGH
- LOW
- CLOSE
- VOLUME
- VOLUME_BUY
- VOLUME_SELL

### Market, Instrument pairs of interest

binance

- BTC-USD-INVERSE-PERPETUAL
- BTC-USDC-VANILLA-PERPETUAL
- BTC-USDT-VANILLA-PERPETUAL
- ETH-USD-INVERSE-PERPETUAL
- ETH-USDC-VANILLA-PERPETUAL
- ETH-USDT-VANILLA-PERPETUAL

### OI OHLC+

- [Open Interest OHLC+](https://data-api.coindesk.com/futures/v1/historical/open-interest/minutes?market=binance&instrument=BTC-USDT-VANILLA-PERPETUAL&limit=1&aggregate=1&fill=true&apply_mapping=true&response_format=JSON&to_ts=1762822793)

**응답 주요 변수**

- TIMESTAMP
- MARKET
- INSTRUMENT: BTCUSDT
- MAPPED_INSTRUMENT: BTC-USDT-VANILLA-PERPETUAL
- QUOTE_CURRENCY: USDT
- SETTLEMENT_CURRENCY: USDT
- CONTRACT_CURRENCY: BTC
- OPEN_SETTLEMENT
- OPEN_MARK_PRICE
- HIGH_SETTLEMENT
- HIGH_MARK_PRICE
- LOW_SETTLEMENT
- LOW_MARK_PRICE
- CLOSE_SETTLEMENT **<< 요거 두개만 넣어도 될듯**
- CLOSE_MARK_PRICE **<< 요거 두개만 넣어도 될듯**

### FR OHLC+

- [Funding Rate OHLC+](https://data-api.coindesk.com/futures/v1/historical/funding-rate/minutes?market=binance&instrument=BTC-USDT-VANILLA-PERPETUAL&limit=1&aggregate=1&fill=true&apply_mapping=true&response_format=JSON&to_ts=1762822793)

**응답 주요 변수**

- TIMESTAMP
- MARKET
- INSTRUMENT: BTCUSDT
- MAPPED_INSTRUMENT: BTC-USDT-VANILLA-PERPETUAL
- QUOTE_CURRENCY: USDT
- SETTLEMENT_CURRENCY: USDT
- CONTRACT_CURRENCY: BTC
- OPEN
- HIGH
- LOW
- CLOSE **<< 요거만 넣어도 될듯**