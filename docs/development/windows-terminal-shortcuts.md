---
title: Terminal 단축키
parent: 개발
nav_order: 61
description: "Windows Terminal에서 탭 열기/닫기, 창 분할, 포커스 이동, 크기 조절 등 생산성을 높이는 핵심 단축키를 정리합니다."
---

# Windows Terminal 단축키 총정리
{:.no_toc}

탭과 창(Pane)을 키보드만으로 자유롭게 다루면 터미널 작업 속도가 확 올라갑니다.

### Link

- [Windows Terminal Panes - Microsoft Learn](https://learn.microsoft.com/en-us/windows/terminal/panes)
- [Windows Terminal Actions - Microsoft Learn](https://learn.microsoft.com/en-us/windows/terminal/customize-settings/actions)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 탭(Tab) 관리

| 동작 | 단축키 |
|------|--------|
| 새 탭 열기 (기본 프로필) | `Ctrl + Shift + T` |
| 특정 프로필로 탭 열기 | `Ctrl + Shift + 1~9` |
| 다음 탭으로 이동 | `Ctrl + Tab` |
| 이전 탭으로 이동 | `Ctrl + Shift + Tab` |
| N번째 탭으로 이동 | `Ctrl + Alt + 1~9` |
| 현재 탭 닫기 | `Ctrl + Shift + W` |

> **Tip**: 프로필 번호는 Settings → 프로필 목록 순서 기준입니다. PowerShell, CMD, WSL 등 자주 쓰는 프로필을 상위에 배치하면 `Ctrl + Shift + 1`로 바로 열 수 있습니다.

---

## 창 분할(Pane)

하나의 탭 안에서 화면을 나눠 여러 셸을 동시에 볼 수 있습니다.

| 동작 | 단축키 |
|------|--------|
| 자동 분할 (긴 축 기준) | `Alt + Shift + D` |
| 세로 분할 (좌우) | `Alt + Shift + +` |
| 가로 분할 (상하) | `Alt + Shift + -` |
| 현재 창 닫기 | `Ctrl + Shift + W` |

### 자동 분할 vs 수동 분할

- **`Alt + Shift + D`**: 현재 창의 긴 축을 기준으로 자동 분할합니다. 가로로 넓으면 세로 분할, 세로로 길면 가로 분할이 됩니다. 현재 프로필을 복제합니다.
- **`Alt + Shift + +` / `-`**: 방향을 직접 지정합니다. 기본 프로필로 새 창이 열립니다.

---

## 창 간 포커스 이동

| 동작 | 단축키 |
|------|--------|
| 위쪽 창으로 이동 | `Alt + ↑` |
| 아래쪽 창으로 이동 | `Alt + ↓` |
| 왼쪽 창으로 이동 | `Alt + ←` |
| 오른쪽 창으로 이동 | `Alt + →` |

---

## 창 크기 조절

| 동작 | 단축키 |
|------|--------|
| 위로 확장 | `Alt + Shift + ↑` |
| 아래로 확장 | `Alt + Shift + ↓` |
| 왼쪽으로 확장 | `Alt + Shift + ←` |
| 오른쪽으로 확장 | `Alt + Shift + →` |

---

## 기타 유용한 단축키

| 동작 | 단축키 |
|------|--------|
| 텍스트 검색 | `Ctrl + Shift + F` |
| 전체 화면 전환 | `Alt + Enter` 또는 `F11` |
| 글꼴 크기 키우기 | `Ctrl + +` |
| 글꼴 크기 줄이기 | `Ctrl + -` |
| 글꼴 크기 초기화 | `Ctrl + 0` |
| 스크롤 위로 | `Ctrl + Shift + ↑` |
| 스크롤 아래로 | `Ctrl + Shift + ↓` |
| 명령 팔레트 열기 | `Ctrl + Shift + P` |
| 설정 열기 | `Ctrl + ,` |

---

## 마우스로 창 분할하기

키보드가 아닌 마우스로도 가능합니다.

1. 탭을 **우클릭** → **탭 분할(Split Tab)** 선택
2. 드롭다운 메뉴에서 프로필 옆 분할 아이콘 클릭

---

## 단축키 커스터마이징

Settings(`Ctrl + ,`) → **Actions** 탭에서 모든 단축키를 변경할 수 있습니다.

`settings.json`을 직접 편집할 수도 있습니다.

```json
{
  "actions": [
    { "command": "newTab", "keys": "ctrl+t" },
    { "command": { "action": "splitPane", "split": "horizontal" }, "keys": "alt+shift+minus" },
    { "command": { "action": "splitPane", "split": "vertical" }, "keys": "alt+shift+plus" },
    { "command": { "action": "moveFocus", "direction": "left" }, "keys": "alt+left" }
  ]
}
```

> 기본 단축키가 다른 프로그램과 충돌하면 여기서 원하는 키 조합으로 바꿔 쓸 수 있습니다.

---

## 실전 활용 예시

### 개발 + 서버 + 로그 동시 모니터링

```
┌──────────────────────┬──────────────────────┐
│                      │                      │
│   코드 편집/Git      │   개발 서버 실행      │
│                      │                      │
├──────────────────────┴──────────────────────┤
│                                             │
│              로그 모니터링                    │
│                                             │
└─────────────────────────────────────────────┘
```

1. `Ctrl + Shift + T`로 새 탭 열기
2. `Alt + Shift + +`로 세로 분할 → 오른쪽에서 서버 실행
3. 왼쪽 창 클릭 후 `Alt + Shift + -`로 가로 분할 → 아래에서 로그 확인
4. `Alt + 방향키`로 창 간 이동하며 작업
