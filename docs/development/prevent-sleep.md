---
title: Sleep 방지 앱
parent: 개발
nav_order: 60
description: macOS와 Windows에서 PC 슬립을 방지하는 앱(Amphetamine, Caffeine, KeepingYouAwake 등)의 작동 원리와 사용법을 정리합니다.
---

# PC Sleep 방지 앱 총정리
{:.no_toc}

장시간 빌드, 모델 학습, 대용량 다운로드 등 작업 중 PC가 잠들어 버리면 곤란합니다. 시스템 설정을 바꾸지 않고도 슬립을 방지하는 앱들의 원리와 사용법을 정리합니다.

### Link

- [Apple IOPMAssertionTypes 공식 문서](https://developer.apple.com/documentation/iokit/iopmlib_h/iopmassertiontypes)
- [Windows SetThreadExecutionState 공식 문서](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-setthreadexecutionstate)
- [Amphetamine - Mac App Store](https://apps.apple.com/us/app/amphetamine/id937984704)
- [KeepingYouAwake GitHub](https://github.com/newmarcel/KeepingYouAwake)
- [Caffeine (macOS)](https://www.caffeine-app.net/)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 작동 원리

Sleep 방지 앱들은 크게 **세 가지 방식**으로 동작합니다.

### 1. Power Assertion API (macOS)

macOS는 **IOPMAssertion**이라는 전원 관리 API를 제공합니다. 앱이 시스템에 "지금 작업 중이니 잠들지 마세요"라는 선언(assertion)을 등록하는 방식입니다.

```c
// macOS Power Assertion 예시 (C/Objective-C)
IOPMAssertionID assertionID;
IOPMAssertionCreateWithName(
    kIOPMAssertionTypeNoIdleSleep,  // assertion 타입
    kIOPMAssertionLevelOn,          // 활성화
    CFSTR("빌드 작업 진행 중"),       // 사유 설명
    &assertionID                    // assertion ID 반환
);

// 작업 완료 후 해제
IOPMAssertionRelease(assertionID);
```

**주요 Assertion 타입:**

| 타입 | 효과 |
|------|------|
| `kIOPMAssertionTypeNoIdleSleep` | 유휴 상태 슬립 방지 |
| `kIOPMAssertionTypeNoDisplaySleep` | 디스플레이 꺼짐 방지 |
| `kIOPMAssertionTypePreventUserIdleSystemSleep` | 사용자 유휴 시 시스템 슬립 방지 |
| `kIOPMAssertionTypePreventUserIdleDisplaySleep` | 사용자 유휴 시 디스플레이 슬립 방지 |

**한계:** 이 API는 **강제 슬립(lid close, Apple 메뉴 → 잠자기, 배터리 부족)**을 막을 수 없습니다. 유휴 상태에서 자동으로 슬립에 진입하는 것만 방지합니다.

현재 활성화된 assertion은 터미널에서 확인 가능합니다:

```bash
pmset -g assertions
```

### 2. SetThreadExecutionState API (Windows)

Windows는 **SetThreadExecutionState** API를 제공합니다. 앱이 시스템에 "아직 사용 중"임을 알려 슬립 타이머를 리셋하는 방식입니다.

```c
// Windows 예시 (C/C++)
// 시스템 슬립 + 디스플레이 꺼짐 방지 (지속)
SetThreadExecutionState(
    ES_CONTINUOUS | ES_SYSTEM_REQUIRED | ES_DISPLAY_REQUIRED
);

// 복원
SetThreadExecutionState(ES_CONTINUOUS);
```

**주요 플래그:**

| 플래그 | 효과 |
|--------|------|
| `ES_SYSTEM_REQUIRED` | 시스템 슬립 방지 |
| `ES_DISPLAY_REQUIRED` | 디스플레이 꺼짐 방지 |
| `ES_CONTINUOUS` | 상태를 지속적으로 유지 (없으면 1회 리셋만) |

`ES_CONTINUOUS` 없이 호출하면 유휴 타이머를 1회만 리셋합니다. 지속적으로 방지하려면 반드시 `ES_CONTINUOUS`와 함께 사용해야 합니다.

### 3. 입력 시뮬레이션 (Mouse Jiggler 방식)

가장 원시적인 방법으로, **마우스 커서를 주기적으로 미세하게 움직여** OS가 사용자가 활동 중이라고 인식하게 합니다.

- 소프트웨어 방식: 일정 간격(보통 수십 초)으로 커서를 1~2px 이동
- 하드웨어 방식: USB 장치가 HID(Human Interface Device)로 인식되어 물리적 마우스 움직임 신호 전송

이 방식은 OS API를 사용하지 않으므로 **IT 관리 소프트웨어에 탐지될 수 있습니다**.

---

## macOS 앱

### caffeinate (내장 명령어)

macOS에 기본 내장된 커맨드라인 도구입니다. 별도 설치 없이 터미널에서 바로 사용 가능합니다.

```bash
# 기본 사용: 유휴 슬립 방지 (Ctrl+C로 해제)
caffeinate

# 주요 옵션
caffeinate -d        # 디스플레이 슬립 방지
caffeinate -i        # 시스템 유휴 슬립 방지
caffeinate -m        # 디스크 유휴 슬립 방지
caffeinate -s        # 시스템 슬립 방지 (AC 전원 연결 시에만)
caffeinate -u        # 사용자 활동 선언 (디스플레이 켜기)

# 옵션 조합
caffeinate -d -i     # 디스플레이 + 시스템 슬립 동시 방지

# 시간 제한 (초 단위)
caffeinate -t 3600   # 1시간 동안 슬립 방지

# 특정 명령어와 함께 사용 (프로세스 종료 시 자동 해제)
caffeinate -i npm run build
caffeinate -i python train_model.py
caffeinate -i make -j8

# 실행 중인 caffeinate 종료
killall caffeinate
```

**장점:** 설치 불필요, 스크립트에 통합 가능, 프로세스 연동 가능
**단점:** GUI 없음, 클램쉘 모드 지원 불가

### Amphetamine

macOS에서 가장 강력하고 다기능인 슬립 방지 앱입니다. Mac App Store에서 무료로 제공됩니다.

**핵심 기능:**

- **세션 관리**: 무기한 / 지정 시간 / 지정 시각까지 슬립 방지
- **트리거**: 조건 기반 자동 활성화
  - 특정 앱 실행 중일 때
  - 특정 Wi-Fi 네트워크 연결 시
  - 외장 디스플레이/USB 장치 연결 시
  - 특정 시간대
  - 배터리 잔량 기준
- **클램쉘 모드(Closed-Display Mode)**: 외부 디스플레이/키보드/마우스 없이도 덮개를 닫은 상태에서 Mac을 깨어있게 유지 (v5.0+)
- **디스플레이 제어**: 디스플레이 슬립 허용/차단 별도 설정
- **화면 보호기**: 활성화/비활성화 제어
- **마우스 커서 이동**: 자동 커서 움직임으로 추가 슬립 방지

**사용법:**

1. Mac App Store에서 "Amphetamine" 검색 후 설치
2. 메뉴바의 알약 아이콘 클릭
3. 세션 시작: 원하는 시간/조건 선택
4. 트리거 설정: Preferences → Triggers에서 자동 조건 구성

**클램쉘 모드 설정:**

Amphetamine 5.0+에서는 Apple의 클램쉘 요구사항(외부 디스플레이 + 전원 연결)을 우회하여, 덮개를 닫아도 Mac이 슬립되지 않도록 설정할 수 있습니다. Apple Silicon Mac에서는 번인 방지를 위해 내장 디스플레이를 강제로 끕니다.

### KeepingYouAwake

caffeinate 명령어의 **GUI 래퍼**입니다. 내부적으로 caffeinate를 호출하므로 동작 원리가 동일합니다.

```bash
# Homebrew로 설치
brew install --cask keepingyouawake
```

**사용법:**

1. 메뉴바의 커피잔 아이콘 클릭 → 슬립 방지 활성화
2. 시간 제한 설정 가능 (5분 ~ 5시간 또는 무기한)
3. 커피잔이 채워진 상태 = 활성, 빈 상태 = 비활성

**장점:** 가볍고 오픈소스, caffeinate과 동일한 안정성
**한계:** 데스크톱 Mac 또는 덮개가 열린 노트북에서만 동작 (클램쉘 모드 미지원)

### Caffeine (macOS)

가장 오래된 Mac 슬립 방지 앱으로, 심플한 토글 방식입니다.

**사용법:**

1. [caffeine-app.net](https://www.caffeine-app.net/)에서 다운로드
2. 메뉴바의 커피잔 아이콘 클릭 → 활성화/비활성화
3. 우클릭으로 타임아웃 설정 가능

**참고:** 오래전부터 업데이트가 중단되었으며, KeepingYouAwake가 사실상 후속 대체 앱입니다.

---

## Windows 앱

### Caffeine (Windows)

59초마다 키 입력(F15)을 시뮬레이션하여 시스템이 사용자가 활동 중이라고 인식하게 합니다.

```
다운로드: https://www.zhornsoftware.co.uk/caffeine/
```

**특징:**

- 시스템 트레이에 커피잔 아이콘으로 상주
- 클릭으로 활성/비활성 토글
- F15 키를 사용하므로 실제 작업에 영향 없음
- 설치 불필요 (포터블)

### Don't Sleep

시스템 종료, 대기 모드, 최대 절전 모드를 포괄적으로 방지하는 유틸리티입니다.

**특징:**

- 슬립/최대절전/화면꺼짐/시스템 종료 각각 개별 제어
- 타이머 기능
- 포터블 (설치 불필요)
- 시스템 트레이 상주

### Insomnia

SetThreadExecutionState API를 직접 호출하는 가장 단순한 구현입니다.

**특징:**

- 실행만 하면 슬립 방지, 종료하면 복원
- 오픈소스
- 별도 설정 없는 미니멀 디자인

### Mouse Jiggler

마우스 커서를 주기적으로 미세하게 움직여 슬립을 방지합니다.

**소프트웨어 버전:** 무료 앱으로 설치 후 실행
**하드웨어 버전:** USB 동글을 꽂으면 OS가 마우스로 인식, 별도 소프트웨어 불필요

**주의:** 기업 환경에서는 IT 부서가 Mouse Jiggler 사용을 탐지하는 도구를 운영하는 경우가 있습니다.

---

## 비교표

| 앱 | OS | 방식 | 클램쉘 지원 | GUI | 가격 |
|---|---|---|---|---|---|
| caffeinate | macOS | Power Assertion | X | X (CLI) | 내장 |
| Amphetamine | macOS | Power Assertion | O (v5.0+) | O | 무료 |
| KeepingYouAwake | macOS | caffeinate 래퍼 | X | O | 무료 |
| Caffeine (Mac) | macOS | Power Assertion | X | O | 무료 |
| Caffeine (Win) | Windows | 키 입력 시뮬레이션 | - | O | 무료 |
| Don't Sleep | Windows | SetThreadExecutionState | - | O | 무료 |
| Insomnia | Windows | SetThreadExecutionState | - | O | 무료 |
| Mouse Jiggler | 공통 | 입력 시뮬레이션 | - | O/하드웨어 | 무료/유료 |

---

## 클램쉘 모드(Closed-Display Mode)

MacBook 덮개를 닫은 상태에서 외부 디스플레이로 작업하는 모드입니다.

### Apple 공식 요구사항

클램쉘 모드를 사용하려면 다음이 **모두** 필요합니다:

1. 전원 어댑터 연결
2. 외부 디스플레이 연결
3. 외부 키보드 + 마우스/트랙패드 연결

이 조건이 충족되지 않으면 덮개를 닫을 때 MacBook은 자동으로 슬립에 진입합니다.

### Amphetamine의 클램쉘 우회

Amphetamine 5.0+는 Apple의 클램쉘 요구사항을 우회하는 유일한 앱입니다:

- 외부 디스플레이, 키보드, 마우스, 전원 어댑터 없이도 클램쉘 모드 가능
- 공개 API를 활용하여 Apple의 요구사항을 비활성화
- Apple Silicon Mac에서는 내장 디스플레이 번인 방지를 위해 자동으로 디스플레이를 끔

**사용 시나리오:** 서버 용도로 MacBook을 덮어 두고 SSH로만 접속할 때, 또는 장시간 다운로드/빌드 시 덮개를 닫고 싶을 때 유용합니다.

---

## 추천 가이드

| 상황 | 추천 |
|------|------|
| 빌드/학습 중 일시적 슬립 방지 | `caffeinate -i <command>` |
| 조건 기반 자동 제어가 필요할 때 | Amphetamine (트리거) |
| 가볍게 토글만 원할 때 (Mac) | KeepingYouAwake |
| 덮개 닫고 작업해야 할 때 | Amphetamine (클램쉘 모드) |
| Windows에서 간단하게 | Caffeine (Windows) |
| Windows에서 세밀한 제어 | Don't Sleep |
| 기업 환경에서 IT 정책 우회 (비추천) | Mouse Jiggler |
