---
title: yfinance
parent: 투자
nav_order: 1
description: "Yahoo used to have its own official API but this was shutdown in 2017."
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

### Sector and Industry List

- basic-materials
   - agricultural-inputs
   - aluminum
   - building-materials
   - chemicals
   - coking-coal
   - copper
   - gold
   - lumber-wood-production
   - other-industrial-metals-mining
   - other-precious-metals-mining
   - paper-paper-products
   - silver
   - specialty-chemicals
   - steel
- communication-services
   - advertising-agencies
   - broadcasting
   - electronic-gaming-multimedia
   - entertainment
   - internet-content-information
   - publishing
   - telecom-services
- consumer-cyclical
   - apparel-manufacturing
   - apparel-retail
   - auto-manufacturers
   - auto-parts
   - auto-truck-dealerships
   - department-stores
   - footwear-accessories
   - furnishings-fixtures-appliances
   - gambling
   - home-improvement-retail
   - internet-retail
   - leisure
   - lodging
   - luxury-goods
   - packaging-containers
   - personal-services
   - recreational-vehicles
   - residential-construction
   - resorts-casinos
   - restaurants
   - specialty-retail
   - textile-manufacturing
   - travel-services"
- consumer-defensive
   - beverages-brewers
   - beverages-non-alcoholic
   - beverages-wineries-distilleries
   - confectioners
   - discount-stores
   - education-training-services
   - farm-products
   - food-distribution
   - grocery-stores
   - household-personal-products
   - packaged-foods
   - tobacco
- energy
   - oil-gas-drilling
   - oil-gas-e-p
   - oil-gas-equipment-services
   - oil-gas-integrated
   - oil-gas-midstream
   - oil-gas-refining-marketing
   - thermal-coal
   - uranium
- financial-services
   - asset-management
   - banks-diversified
   - banks-regional
   - capital-markets
   - credit-services
   - financial-conglomerates
   - financial-data-stock-exchanges
   - insurance-brokers
   - insurance-diversified
   - insurance-life
   - insurance-property-casualty
   - insurance-reinsurance
   - insurance-specialty
   - mortgage-finance
   - shell-companies
- healthcare
   - biotechnology
   - diagnostics-research
   - drug-manufacturers-general
   - drug-manufacturers-specialty-generic
   - health-information-services
   - healthcare-plans
   - medical-care-facilities
   - medical-devices
   - medical-distribution
   - medical-instruments-supplies
   - pharmaceutical-retailers
- industrials
   - aerospace-defense
   - airlines
   - airports-air-services
   - building-products-equipment
   - business-equipment-supplies
   - conglomerates
   - consulting-services
   - electrical-equipment-parts
   - engineering-construction
   - farm-heavy-construction-machinery
   - industrial-distribution
   - infrastructure-operations
   - integrated-freight-logistics
   - marine-shipping
   - metal-fabrication
   - pollution-treatment-controls
   - railroads
   - rental-leasing-services
   - security-protection-services
   - specialty-business-services
   - specialty-industrial-machinery
   - staffing-employment-services
   - tools-accessories
   - trucking
   - waste-management
- real-estate
   - real-estate-development
   - real-estate-diversified
   - real-estate-services
   - reit-diversified
   - reit-healthcare-facilities
   - reit-hotel-motel
   - reit-industrial
   - reit-mortgage
   - reit-office
   - reit-residential
   - reit-retail
   - reit-specialty
- technology
   - communication-equipment
   - computer-hardware
   - consumer-electronics
   - electronic-components
   - electronics-computer-distribution
   - information-technology-services
   - scientific-technical-instruments
   - semiconductor-equipment-materials
   - semiconductors
   - software-application
   - software-infrastructure
   - solar
- utilities
   - utilities-diversified
   - utilities-independent-power-producers
   - utilities-regulated-electric
   - utilities-regulated-gas
   - utilities-regulated-water
   - utilities-renewable

