---
title: Spec Kit 2
parent: 개발
nav_order: 11
description: "` /constitution"
---

# Spec Kit 기존 프로젝트 개선에 사용 - Trial & Error Season 2
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

--- 

## 1. Constitution 작성

```
/constitution

기존 scaffold 생성 작업은 완료하고,
완성된 scaffold 바탕으로 세부 기능 구현을 할거야.
아래 구현 절차와 의존성 관리 기준을 바탕으로
최소한의 요건을 새로 정리해줘

# 구현 절차
1. Phase 단위로 나눠서 구현 진행
2. 구현을 진행하기 전에 master로 부터 새 브랜치로 포크
3. 브랜치 명은 phase-{phase}-{description}
4. 직전 Phase의 specs를 이번 Phase의 브랜치명과 동일하게 카피, ex. `cp -r phase-0-init phase-1-some-execution`
5. 구현 및 테스트, 테스트는 모두 통과해야 완료
6. 모든 Phase의 구현이 완료된 이후에는 docs/ 아래 브랜치명으로 구현 내용 문서 작성
7. 완료된 구현을 바탕으로 기존 구현된 내용 수정
8. 완료된 구현을 바탕으로 다음 task에 수정 필요한 것 수정 & 구제화
9. 커밋
10. 사용자 확인, 마스터머지 - 사용자가 직접

# Python 버전과 라이브러리 의존성
1. Python 의존성은 uv로 관리
2. Python 버전 다양성 최소화, 가능하면 단일화
```

---

## 2. 하고싶은 작업 specify

```
/speckit.specify 

- 기존에 구현한 아래 로직들을 수정/이용하여 고도화 할거야.
   - 데이터베이스에 구현된 테이블들,
   - OHLCV_1M 테이블에 적재된 데이터,
   - data_collection 부분에 구현된 backfill 로직,
   - data_collection 부분에 구현된 데이터 추가 수집 로직,
   - dashboard에 구현된 대시보드 scaffold
- 어떤 종류의 ASSET 데이터를 얼마나 갖고 있는지 확인하고 싶어.
- OHLCV_1M 데이터베이스에 수집된 데이터 종류(exchange, symbol)를 확인하고 ASSET 테이블에 업데이트 할거야.
- 수집된 데이터가 어느 기간에 해당하는지도 ASSET 테이블에 기록할 수 있도록 수정할거야.
- ASSET 종류와 기간을 대시보드에서 확인할 수 있게 api만들고 대시보드 페이지에도 추가할거야.
- ASSET별로 최신 OHLCV_1M 데이터를 계속 수집하는 로컬 앱을 만들거야.
- ASSET별로 1분봉 최대 2000개씩 한번에 조회할 수 있으니깐, 현재로서는 하루에 한 번 돌면 데이터를 모으기는 충분한 것 같아.
- 추후에는 실시간에 가깝게 예측에 필요한 입력으로 사용할거라서 더 자주(1시간 단위) 돌리는 것도 고려하지면, 현재로서는 MVP로 24시간에 한번씩 수집하는 것만 구현할거야.
```

이어서 claify


```
/clarify
```

---

## 3. plan & task

바로 플랜 때리기

```
/plan
```

이어서 바로 tasks 때리기, phase 11 부터로 명시

```
/tasks

Phase numbering starts from 11
```

Research.md, data-model.md, quickstart.md, plan.md, tasks.md를  
Phase 11, 12, 13으로 넣고 완료로 해놨네.  
Pre-phase로 빼도록 변경

```
Phase 11, 12, 13은 pre-phase로 빼고 Phase 14를 Phase 11로 넘버링해줘
```

이어서 checklist 작성

```
/checklist

# Before implement
1. phase-{phase}-{description} 브랜치로 포크
2. 직전 Phase의 specs 파일 새 phase명에 맞춰 복사

# After implement
1. phase 별로 docs작성
2. 새로운 아키텍처 구성요소가 추가되는 경우 Readme 추가
3. 새로운 애플리케이션 추가되는 경우 Readme 추가
4. 완료된 구현 내용에 맞춰 기존 구현사항 중 수정할 내용이 있는지 검토
5. 완료된 구현 내용에 맞춰 다음 tasks 구체화 및 수정
6. 커밋
```

체크리스트는 절차를 확인하는게 아니라, implement 내에서 품질 요구사항을 규정하는 것이라고 한다.

```
“요구사항 품질(Requirements Quality)” 유닛 테스트 형태로 만들어야 합니다.
```

그럼 패스!  
대신 constitution으로 돌아가서 작업 단위 절차 상세 정의

```
/constituion

# Before implement
1. phase-{phase}-{description} 브랜치로 포크
2. 직전 Phase의 specs 파일 새 phase명에 맞춰 복사

# After implement
1. phase 별로 docs작성
2. 새로운 아키텍처 구성요소가 추가되는 경우 Readme 추가
3. 새로운 애플리케이션 추가되는 경우 Readme 추가
4. 완료된 구현 내용에 맞춰 기존 구현사항 중 수정할 내용이 있는지 검토
5. 완료된 구현 내용에 맞춰 다음 tasks 구체화 및 수정
6. 커밋

# 절차를 체크리스트로 관리
1. 위에 명시한 절차들 관리하는 체크리스트 생성
2. Phase 및 하위 Tasks를 체크리스트 형태로 관리하면서 진행상황 관리
```

결과

- constitution 업데이트
- checklists/workflow.md 체크리스트 생성

```
# Actions Taken

- Amended constitution to version 2.4.0 adding Principle VII (Procedural Checklist Governance) and refining Phase workflow (Before vs After implement).
- Created directory checklists and added workflow.md procedural checklist aligning with new principles.
- Sync Impact Report embedded at top of the updated constitution; README follow-up TODO noted.
```

---

## 4. implement Phase 11

```
/implement

Phase 11
```

웬걸 완전 새로 짜기 시작하노 미친놈이.  
다시 기존 코드 참고하도록 주입.

```
/tasks

기존에 구현된 함수, 데이터베이스, 대시보드, api 이용하도록 하고,
필요한 부분은 수정
src/data_collection/collectors
src/database
src/dashboard
src/api
```

- spec은 GPT5
- implement는 Sonnet 4.5

```
For User:

1. Review and test the implementation
2. Run migration: `uv run python scripts/run_phase_11_migration.py`
3. Run backfill: `uv run python scripts/asset_inventory_backfill.py`
4. Test API endpoints
5. Run tests: uv run pytest -k asset -v
6. Commit with: feat(phase11): asset coverage visibility MVP
```

일단 대충 다 돌아가게 수정시키고
커밋 가자

---

## 5. implement Phase 12

```
/implement

workflow.md 확인하고 phase 11 구현 시작해
```

크레딧 다 썼네..

```
You have exceeded your premium request allowance. We have automatically switched you to GPT-4.1 which is included with your plan. To enable additional paid premium requests, contact your organization admin.
```

무료 옵션 전환

- GPT4.1
- GPT4o
- Grok Code Fast 1

어떤 쓰레기를 뱉어낼지...  

응. 여기서 스탑  
모델의 문제만이 아니라 tasks 단계에서 정의가 잘못 된 것들이 있는 듯.  
/specify 했던 요소들이 tasks에서 Phase로 정의할 때 이상한 작업으로 치환된 것 같네.  
Existing Project에서 이어서 작업할 때는 딱 한 Phase 단위로 작업하자.

```
/specify
   > /clarify
      > /plan
         > /tasks
            > /analyze
               > /checklist
                  > /implement

공통
- 기존에 구현한 아래 로직들을 수정/이용하여 고도화 할거야.
   - 데이터베이스에 구현된 테이블들,
   - OHLCV_1M 테이블에 적재된 데이터,
   - data_collection 부분에 구현된 backfill 로직,
   - data_collection 부분에 구현된 데이터 추가 수집 로직,
   - dashboard에 구현된 대시보드 scaffold

Phase 11 - Done
- 어떤 종류의 ASSET 데이터를 얼마나 갖고 있는지 확인하고 싶어.
- OHLCV_1M 데이터베이스에 수집된 데이터 종류(exchange, symbol)를 확인하고 ASSET 테이블에 업데이트 할거야.
- 수집된 데이터가 어느 기간에 해당하는지도 ASSET 테이블에 기록할 수 있도록 수정할거야.

Phase 12
- ASSET 종류와 기간을 대시보드에서 확인할 수 있게 api만들거야

Phase 13
- ASSET 종류와 기간을 확인하는 대시보드 페이지를 추가할거야.
- ASSET별로 최신 OHLCV_1M 데이터를 계속 수집하는 로컬 앱을 만들거야.
- ASSET별로 1분봉 최대 2000개씩 한번에 조회할 수 있으니깐, 현재로서는 하루에 한 번 돌면 데이터를 모으기는 충분한 것 같아.
- 추후에는 실시간에 가깝게 예측에 필요한 입력으로 사용할거라서 더 자주(1시간 단위) 돌리는 것도 고려하지면, 현재로서는 MVP로 24시간에 한번씩 수집하는 것만 구현할거야.
```

---

TODO later
1. script/evaluate_positions.py 실행부분 따로 떼기
2. src/data_collection 안에 collectors/continuous_collector.py 실행하는 app 생성
3. src/features 안에 inference_assembler.py, training_assembler.py 합치기
4. httpx, requests > requests로 단일화

...