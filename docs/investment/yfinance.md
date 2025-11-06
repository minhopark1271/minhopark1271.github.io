---
title: yfinance
parent: 투자
nav_order: 10
---

# Financial data source - yfinance lib.
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## Links

- [[Blog] Yahoo Finance API guide](https://algotrading101.com/learn/yahoo-finance-api-guide/)
- [[Blog] yfinance Library guide](https://algotrading101.com/learn/yfinance-guide/)
- [[Blog] Google Finance API and 9 alts](https://algotrading101.com/learn/google-finance-api-guide/)

---

## yfinance - Yahoo Finance Python Library (Open source)

Yahoo used to have its own official API but this was shutdown in 2017.

- [[Official] yfinance documentation](https://ranaroussi.github.io/yfinance/#)
- [[Official] yfinance doc. API Reference](https://ranaroussi.github.io/yfinance/reference/index.html)

---

## Quickstart

### install

```
pip install yfinance
```

### One ticker symbol

```
import yfinance as yf
iren = yf.Ticker("IREN")
iren.info
iren.calendar
iren.analyst_price_targets
iren.quarterly_income_stmt
iren.history(period='max', interval='1h')
iren.option_chain(dat.options[0]).calls
```

### Multiple ticker symbols

```
assets = yf.Tickers('MSFT,AAPL,GOOG')
assets.history(period='max', interval='1h')
```

---

## Details

### History class

```
ticker.history(
    period=None,
    interval='1d',
    start=None,
    end=None,
    prepost=False,
    actions=True,
    auto_adjust=True,
    back_adjust=False,
    repair=False,
    keepna=False,
    proxy=<object object>,
    rounding=False,
    timeout=10,
    raise_errors=False
) → DataFrame

period: str
    Valid periods: 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max
    Default: 1mo
    Can combine with start/end e.g. end = start + period
interval: str
    Valid intervals: 1m,2m,5m,15m,30m,60m,90m,1h,4h,1d,5d,1wk,1mo,3mo
    Intraday data cannot extend last 60 days
start: str
    Download start date string (YYYY-MM-DD) or _datetime, inclusive.
    Default: 99 years ago
    E.g. for start=”2020-01-01”, first data point = “2020-01-01”
end: str
    Download end date string (YYYY-MM-DD) or _datetime, exclusive.
    Default: now
    E.g. for end=”2023-01-01”, last data point = “2022-12-31”
```

### Interval vs. Max period for ticker.history

- 1m - 8d
- 2m, 5m, 15m, 30m - 60d
- 1h, 4h - 730d
- 1d 이상 - inf.

### Other tiker tools

- get_history_metadata()
- option_chain()
- get_info()
- get_financials()
- get_calendar()
- get_earnings_dates()
- get_balance_sheet()
- get_cash_flow()
- get_analyst_price_targets()
- get_growth_estimates()

---

## Market class

```
import yfinance as yf

EUROPE = yf.Market("EUROPE")

status = EUROPE.status
summary = EUROPE.summary
```

Available markets

- US
- GB
- ASIA
- EUROPE
- RATES
- COMMODITIES
- CURRENCIES
- CRYPTOCURRENCIES

---

## Sector and Industry

```
import yfinance as yf

tech = yf.Sector('technology')
software = yf.Industry('software-infrastructure')

# Common information
tech.key
tech.name
tech.symbol
tech.ticker
tech.overview
tech.top_companies
tech.research_reports

# Sector information
tech.top_etfs
tech.top_mutual_funds
tech.industries

# Industry information
software.sector_key
software.sector_name
software.top_performing_companies
software.top_growth_companies
```

```
import yfinance as yf

# Ticker to Sector and Industry
msft = yf.Ticker('MSFT')
tech = yf.Sector(msft.info.get('sectorKey'))
software = yf.Industry(msft.info.get('industryKey'))

# Sector and Industry to Ticker
tech_ticker = tech.ticker
tech_ticker.info
software_ticker = software.ticker
software_ticker.history()
```