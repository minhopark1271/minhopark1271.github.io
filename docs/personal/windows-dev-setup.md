---
title: 윈도우 PC 설정
parent: 개인
nav_order: 3
published: false
description: 개발용 윈도우 PC 초기 설정 체크리스트. 키보드, 터미널, 패키지 매니저, IDE, SSH, Docker 등 Mac 설정을 윈도우로 치환한 가이드.
---

# 윈도우 PC 개발 환경 설정
{:.no_toc}

Mac 설정 체크리스트를 윈도우로 치환한 개발 환경 세팅 가이드.

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 키보드 & 입력 설정

- [ ] **한영전환**: 설정 → 시간 및 언어 → 입력 → 고급 키보드 설정에서 `Alt + Space` 또는 `Right Alt` 등으로 변경 (기본값 `한/영` 키 또는 `Shift + Space`)
- [ ] **키 반복 속도 & 지연 시간**: 설정 → 접근성 → 키보드, 또는 제어판 → 키보드 속성에서 조절
- [ ] **캡처**: `Win + Shift + S` (Snipping Tool, 기본 내장). 더 강력한 도구 원하면 [ShareX](https://getsharex.com/) 설치
- [ ] **대문자 자동변환 끄기**: 설정 → 시간 및 언어 → 입력 → 자동 고침 옵션 해제
- [ ] **창분할**: `Win + 방향키`로 기본 스냅 지원. 더 세밀한 분할 원하면 [PowerToys FancyZones](https://learn.microsoft.com/ko-kr/windows/powertoys/) 설치

---

## 마우스 설정

- [ ] **포인터 속도**: 설정 → Bluetooth 및 디바이스 → 마우스에서 포인터 속도 조절
- [ ] **탭하여 클릭** (터치패드 노트북): 설정 → Bluetooth 및 디바이스 → 터치 패드에서 탭 동작 설정

---

## 패키지 매니저 (Homebrew → winget / Scoop / Chocolatey)

윈도우 내장 `winget`이 기본이고, 개발 도구는 **Scoop**이 편리함.

```powershell
# winget (Windows 11 기본 내장)
winget --version

# Scoop 설치 (PowerShell)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# Scoop extras 버킷 추가 (GUI 앱용)
scoop bucket add extras
```

---

## 터미널 설정 (iTerm → Windows Terminal)

```powershell
# Windows Terminal (Windows 11 기본 내장, 없으면)
winget install Microsoft.WindowsTerminal
```

- [ ] **Windows Terminal 설정**: 설정 → 기본 프로필을 PowerShell 7 또는 Git Bash로 변경
- [ ] **PowerShell 7 설치** (기본 5.1 말고 최신):

```powershell
winget install Microsoft.PowerShell
```

- [ ] **Oh My Posh** (zsh 프롬프트 커스터마이징 대응):

```powershell
winget install JanDeDobbeleer.OhMyPosh
```

- [ ] **또는 Git Bash 사용**: Git 설치 시 함께 설치됨 (zsh와 유사한 bash 환경)

---

## 잠금 방지 (Amphetamine → PowerToys Awake)

```powershell
winget install Microsoft.PowerToys
```

PowerToys 실행 → **Awake** 기능 활성화 (화면 꺼짐/절전 방지)

---

## 계정 설정

- [ ] **캘린더, 메모, 이메일**: 설정 → 계정 → 이메일 및 계정에서 Google/Outlook 계정 추가
- [ ] **또는** Outlook 앱에서 계정 통합 관리

---

## IDE 설치 (PyCharm)

```powershell
# winget으로 설치
winget install JetBrains.PyCharm.Professional

# 또는 Scoop
scoop install pycharm-professional
```

- [ ] GitHub 계정 로그인 (minhopark1271, postech 메일 Pro 라이센스)
- [ ] Settings → Plugins → IdeaVim 설치, 불필요한 플러그인 끄기
- [ ] Settings → Editor → Code Style → 자동 포매팅 옵션 끄기
- [ ] Help → Change Memory Settings → 8GB로 올리기

---

## OTP Manager

- [ ] Microsoft Authenticator 또는 기존 OTP 앱 설치
- [ ] iCloud 연동이 필요하면 [iCloud for Windows](https://www.microsoft.com/store/productId/9PKTQ5699M62) 설치

---

## Git & GitHub

```powershell
# Git 설치
winget install Git.Git

# GitHub CLI
winget install GitHub.cli
```

- [ ] 프로젝트 클론

```bash
git clone --recursive <repo-url>
```

---

## Python 환경 (pyenv → pyenv-win)

```powershell
# pyenv-win 설치
scoop install pyenv

# Python 3.11 설치
pyenv install 3.11.9
pyenv global 3.11.9

# uv 설치
scoop install uv
# 또는
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

---

## SSH Key 생성 & 등록

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"

# SSH 에이전트 시작 (PowerShell)
Get-Service ssh-agent | Set-Service -StartupType Automatic
Start-Service ssh-agent
ssh-add ~/.ssh/id_ed25519

# 공개키 복사
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
```

- [ ] GitHub → Settings → SSH Keys에 등록
- [ ] 서버에 공개키 등록

---

## Node.js (nvm → nvm-windows 또는 fnm)

```powershell
# fnm 설치 (nvm보다 빠름, 추천)
scoop install fnm

# 또는 nvm-windows
scoop install nvm

# Node.js 설치
fnm install --lts
fnm use lts-latest
```

---

## Serverless Framework

```bash
npm install -g serverless@3.38.0
```

---

## AWS CLI & 설정

```powershell
winget install Amazon.AWSCLI

# 기존 PC에서 설정 복사
scp -r user@old-pc-ip:~/.aws ~/.aws
```

---

## Docker

```powershell
winget install Docker.DockerDesktop
```

- [ ] 설치 후 **WSL 2 백엔드** 활성화 확인 (Docker Desktop → Settings → General)
- [ ] WSL 2가 없으면 자동 설치 안내 따르기

---

## VPN (OpenVPN)

```powershell
winget install OpenVPNTechnologies.OpenVPNConnect
```

- [ ] VPN 프로필에 `auth-nocache` 설정 추가

---

## DB 클라이언트 (Sequel Ace → DBeaver 또는 HeidiSQL)

```powershell
# DBeaver (크로스플랫폼, 추천)
winget install dbeaver.dbeaver

# 또는 HeidiSQL (윈도우 네이티브, 가벼움)
winget install HeidiSQL.HeidiSQL
```

---

## 추가 윈도우 전용 설정

- [ ] **WSL 2 설치** (Linux 환경 필요 시):

```powershell
wsl --install
```

- [ ] **PowerToys** (전체 유틸리티): FancyZones(창분할), Awake(절전방지), PowerToys Run(Spotlight 대응), Keyboard Manager(키 리맵)

```powershell
winget install Microsoft.PowerToys
```

---

## 기존 PC에서 자료 이전

원래 사용하던 PC에서 원격 연결 포트를 열어서 새 PC에서 SSH 접속으로 파일을 가져올 수 있음.

```powershell
# 윈도우에서 OpenSSH 서버 활성화 (기존 PC)
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
Start-Service sshd
Set-Service -Name sshd -StartupType Automatic

# 새 PC에서 파일 가져오기
scp -r user@old-pc-ip:C:/Users/user/Documents ./Documents
```

Mac에서 가져오는 경우:

```bash
scp -r user@mac-ip:/Users/user/target-folder ./
```
