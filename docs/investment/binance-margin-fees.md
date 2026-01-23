---
title: Binance 마진 거래 수수료
parent: 투자
nav_order: 9
description: "Binance 현물(Spot) 및 마진(Margin) 거래 수수료 완벽 가이드. VIP 등급별 수수료, 자산별 이자율, BNB 할인, 실제 마진거래 비용 계산 예시."
---

# Binance 마진 거래 수수료
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## Spot (현물) 거래 수수료

Binance 현물 거래의 기본 수수료 구조.

### 기본 수수료

| 구분 | Maker | Taker |
|------|-------|-------|
| 기본 수수료 | 0.1% | 0.1% |
| BNB 결제 시 (25% 할인) | 0.075% | 0.075% |
| USDC 페어 | 0.1% | 0.095% |

- **Maker**: 지정가 주문으로 오더북에 유동성을 추가하는 경우
- **Taker**: 시장가 주문으로 오더북에서 유동성을 가져가는 경우

### VIP 등급별 수수료

| VIP 등급 | 30일 거래량 | BNB 잔고 | Maker | Taker |
|---------|------------|---------|-------|-------|
| Regular | - | - | 0.1000% | 0.1000% |
| VIP 1 | ≥ $1M | ≥ 25 BNB | 0.0900% | 0.1000% |
| VIP 2 | ≥ $5M | ≥ 100 BNB | 0.0800% | 0.1000% |
| VIP 3 | ≥ $20M | ≥ 250 BNB | 0.0420% | 0.0600% |
| VIP 4 | ≥ $100M | ≥ 500 BNB | 0.0320% | 0.0480% |
| VIP 5 | ≥ $150M | ≥ 1,000 BNB | 0.0250% | 0.0310% |
| VIP 9 | 최상위 | - | 0.00825% | 0.01725% |

최신 수수료율은 [Binance 공식 수수료 페이지](https://www.binance.com/en/fee/schedule)에서 확인.

### 수수료 할인 방법

1. **BNB 결제**: 거래 수수료를 BNB로 결제 시 25% 할인
2. **VIP 등급 상승**: 30일 거래량 및 BNB 보유량에 따라 할인
3. **레퍼럴 코드**: 일부 레퍼럴 코드로 추가 할인 가능

---

## Margin (마진) 거래 수수료

마진 거래는 **거래 수수료**와 **대출 이자** 두 가지 비용이 발생함.

### 거래 수수료

마진 거래의 거래 수수료는 현물 거래와 동일함.

| 구분 | Maker | Taker |
|------|-------|-------|
| 기본 | 0.1% | 0.1% |
| BNB 결제 시 | 0.075% | 0.075% |

### 대출 이자 (Interest Rate)

마진 거래 시 레버리지를 사용하면 거래소에서 자산을 빌리게 되며, 빌린 자산에 대해 **시간당** 이자가 부과됨.

#### 이자 계산 공식

```
이자 = 대출 원금 × 시간당 이자율 × 대출 시간(시간)
```

#### 이자 부과 방식

- 대출 시점에 **즉시 1시간분 이자 부과**
- 이후 매 정각(13:00, 14:00...)마다 새로운 1시간분 이자 부과
- 예: 13:55에 대출 → 13:55에 1시간분, 14:00에 1시간분 = 총 2시간분 이자

#### 주요 자산별 이자율 (참고용, 실시간 변동)

| 자산 | 일 이자율 (약) | 시간당 이자율 (약) | 연 이자율 (약) |
|------|---------------|------------------|---------------|
| USDT | 0.03% | 0.00125% | ~11% |
| BTC | 0.012% | 0.0005% | ~4.4% |
| ETH | 0.015% | 0.000625% | ~5.5% |

이자율은 시장 상황, VIP 등급, 수요/공급에 따라 **시간당 변동**됨.

#### 이자율 확인 URL

- **[Binance 마진 일일 이자율](https://www.binance.com/en/fee/marginFee)**: 자산별 일일 이자율 및 VIP 등급별 할인율
- **[Binance 마진 데이터](https://www.binance.com/en/margin-fee)**: 대출 이자 및 Cross Margin 한도 정보
- **[CoinGlass 이자율 비교](https://www.coinglass.com/pro/i/MarginFeeChart)**: Binance, OKX, Bybit 등 거래소별 이자율 비교

#### 이자 할인

- **BNB로 이자 지불**: 5% 할인
- **VIP 등급**: 등급이 높을수록 이자율 감소

---

## Cross Margin vs Isolated Margin

| 구분 | Cross Margin | Isolated Margin |
|------|-------------|-----------------|
| 담보 | 전체 마진 계정 잔고 | 해당 포지션에 할당된 금액만 |
| 최대 레버리지 | 20x | 10x |
| 청산 리스크 | 전체 계정 영향 | 해당 포지션만 영향 |
| 수수료/이자 | 동일 | 동일 |
| 적합한 경우 | 헤지, 복수 포지션 관리 | 리스크 제한, 단일 포지션 |

수수료와 이자율은 Cross와 Isolated 모두 동일함.

---

## 마진 거래 수수료 계산 예시

### 시나리오: 3배 레버리지 BTC 매수

**조건:**
- 보유 자금: 10,000 USDT
- 레버리지: 3x (Cross Margin)
- 대출 금액: 20,000 USDT
- 총 매수 금액: 30,000 USDT
- BTC 가격: 100,000 USDT/BTC
- 매수량: 0.3 BTC
- 포지션 유지 기간: 48시간
- USDT 시간당 이자율: 0.00125%

#### 1. 진입 수수료 (매수 시)

```
매수 금액 × 거래 수수료율
= 30,000 USDT × 0.1%
= 30 USDT

BNB 결제 시:
= 30,000 USDT × 0.075%
= 22.5 USDT
```

#### 2. 대출 이자 (48시간 보유)

```
대출 원금 × 시간당 이자율 × 시간
= 20,000 USDT × 0.00125% × 48시간
= 20,000 × 0.0000125 × 48
= 12 USDT

BNB로 이자 지불 시 (5% 할인):
= 12 × 0.95
= 11.4 USDT
```

#### 3. 청산 수수료 (매도 시)

BTC가 5% 상승하여 105,000 USDT가 되었다고 가정:

```
매도 금액 = 0.3 BTC × 105,000 USDT
= 31,500 USDT

매도 수수료 = 31,500 × 0.1%
= 31.5 USDT

BNB 결제 시:
= 31,500 × 0.075%
= 23.625 USDT
```

#### 4. 총 비용 정리

| 항목 | 기본 | BNB 할인 적용 |
|------|------|--------------|
| 진입 수수료 | 30 USDT | 22.5 USDT |
| 대출 이자 (48h) | 12 USDT | 11.4 USDT |
| 청산 수수료 | 31.5 USDT | 23.625 USDT |
| **총 비용** | **73.5 USDT** | **57.525 USDT** |

#### 5. 손익 계산

```
수익 = (105,000 - 100,000) × 0.3 BTC = 1,500 USDT
비용 = 73.5 USDT (또는 BNB 할인 시 57.525 USDT)
대출 상환 = 20,000 USDT

순수익 (기본) = 1,500 - 73.5 = 1,426.5 USDT
순수익 (BNB 할인) = 1,500 - 57.525 = 1,442.475 USDT

수익률 (원금 10,000 USDT 기준):
- 기본: 14.27%
- BNB 할인: 14.42%
```

---

## 비용 최소화 전략

### 1. BNB 보유 및 활용

- 거래 수수료 25% 할인
- 이자 지불 5% 할인
- VIP 등급 요건 충족에도 필요

### 2. 적절한 레버리지 사용

- 높은 레버리지 = 더 많은 대출 = 더 많은 이자
- 필요 이상의 레버리지는 비용만 증가

### 3. 포지션 유지 기간 최소화

- 이자는 시간당 누적됨
- 불필요하게 긴 포지션 유지는 비용 증가

### 4. VIP 등급 관리

- 거래량을 한 거래소에 집중하여 VIP 등급 상승
- 높은 VIP = 낮은 수수료 + 낮은 이자율

---

## 참고 자료

### Binance 공식 문서

- [Binance Spot 수수료 페이지](https://www.binance.com/en/fee/schedule)
- [Binance 마진 일일 이자율](https://www.binance.com/en/fee/marginFee)
- [Binance 마진 데이터 (대출 한도)](https://www.binance.com/en/margin-fee)
- [마진 이자 내역 조회](https://www.binance.com/en/margin/interest-history)
- [마진 거래 수수료 계산 FAQ](https://www.binance.com/en/support/faq/detail/e85d6e703b874674840122196b89780a)
- [동적 이자율 시스템 FAQ](https://www.binance.com/en/support/faq/new-dynamic-interest-rate-system-for-binance-margin-trading-360030157812)
- [Cross/Isolated Margin 차이점](https://www.binance.com/en/support/faq/differences-between-isolated-margin-and-cross-margin-b4e9e6ad70934bd082e8e09e33e69513)
- [Isolated Margin 거래 가이드](https://www.binance.com/en/support/faq/0135c8c00a4240f695ee71a0d18efb08)

### 학습 자료

- [Binance Academy: Cross vs Isolated Margin](https://academy.binance.com/en/articles/what-are-isolated-margin-and-cross-margin-in-crypto-trading)
- [BitDegree: Binance 마진 거래 튜토리얼](https://www.bitdegree.org/crypto/tutorials/binance-margin-trading)
- [CryptoNinjas: Binance 마진 거래 가이드](https://www.cryptoninjas.net/exchange/binance-margin-trading/)

### 비교 및 분석

- [CoinGlass: 거래소별 마진 이자율 비교](https://www.coinglass.com/pro/i/MarginFeeChart)
- [TradersUnion: Binance 마진 수수료 분석](https://tradersunion.com/brokers/crypto/view/binance/margin-fees/)
- [CryptoPotato: Binance 수수료 설명](https://cryptopotato.com/binance-fees/)
- [BitDegree: Binance 수수료 가이드 2026](https://www.bitdegree.org/crypto/tutorials/binance-fees)
