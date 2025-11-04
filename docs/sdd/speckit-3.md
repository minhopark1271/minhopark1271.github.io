---
title: Spec Kit 3
parent: SDD
nav_order: 30
---

# Spec Kit 기존 프로젝트 개선에 사용 - Trial & Error Season 3
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

--- 

## 1. 대시보드 구성 추가

Constitution 작성은 생략, 바로 specify

```
/speckit.specify 

# 현재까지 구현된 조회 api
- src/api/assets.py
- src/api/models.py
- src/api/app.py
- src/api/README.md

# 현재 구현된 dashboard
- src/dashboard/api_client.py
- src/dashboard/app.py
- src/dashboard/README.md


이 소스를 기반으로 대시보드에 현재 어떤 종류의 ASSET 데이터를 갖고 있는지 확인할 수 있도록 dashboard에 페이지를 추가할거야.

- ASSET 종류와 기간을 대시보드에서 확인하는 페이지
- ASSET별로 OHLCV 데이터를 대시보드에서 확인하는 페이지
```

결과 단일 phase, 단일 구현으로 spec 생성 잘됨.

```

# Feature Specification: Dashboard Asset View

**Feature Name:** Dashboard Asset View
**Branch:** phase-13-dashboard-asset-view
**Spec Created:** 2025-11-03

---

## 1. Feature Overview

Add dashboard pages to visualize:
- ASSET types and available data periods
- OHLCV data for each ASSET type and period

---

## 2. Actors
- Dashboard user (internal analyst, operator)

---

## 3. User Scenarios
- User opens dashboard and sees a summary of ASSET types and available periods.
- User selects an ASSET type and period, views OHLCV chart.

---

## 4. Functional Requirements
- Dashboard displays all ASSET types with available data periods.
- User can select ASSET type and period to view OHLCV data.
- OHLCV data is visualized in a chart (candlestick or line).
- Export of displayed data is not required; dashboard is for viewing only.
- Minimum granularity for OHLCV data display is one minute.
- Users can filter ASSETs by type only (not by category).

---

## 5. Success Criteria
- Users can view ASSET types and available periods within 2 clicks.
- OHLCV data loads and displays in under 2 seconds for selected ASSET/period.
- 100% of ASSETs with data are accessible via dashboard.

---

## 6. Key Entities
- ASSET (type, name, available periods)
- OHLCV data (open, high, low, close, volume, timestamp)

---

## 7. Assumptions
- All ASSETs in inventory have at least one period of OHLCV data.
- Dashboard users are authenticated and authorized.
- Visualization uses standard chart types.

---

## 8. Constraints
- Only show ASSETs with available data
- Period selection should be intuitive (e.g., calendar or dropdown)
- OHLCV data must be visualized clearly

---

## 9. Out of Scope
- Implementation details (frameworks, APIs, code structure)
- Authentication/authorization mechanisms

---

## 10. Edge Cases
- No ASSETs with available data
- Large volume of OHLCV data for long periods

---

## 11. Dependencies
- Existing API endpoints for ASSET and OHLCV data

---

## 12. Notes
- Specification written for business stakeholders, not developers.
- No implementation details included.
```

---

## 2. plan, tasks

```
/plan

api는 python3.11, httpx 사용. 기존에 사용하는 라이브러리(pyproject.toml) 외에 꼭 필요한 경우 아니면 의존성 추가하지 않음.

dashboard는 기존 구현된 streamlit사용.
```

```
/tasks


# 현재까지 구현된 조회 api
- src/api/assets.py
- src/api/models.py
- src/api/app.py
- src/api/README.md

# 현재 구현된 dashboard
- src/dashboard/api_client.py
- src/dashboard/app.py
- src/dashboard/README.md


이 소스를 기반으로 대시보드에 현재 어떤 종류의 ASSET 데이터를 갖고 있는지 확인할 수 있도록 dashboard에 페이지를 추가할거야.

- ASSET 종류와 기간을 대시보드에서 확인하는 페이지
- ASSET별로 OHLCV 데이터를 대시보드에서 확인하는 페이지
```
