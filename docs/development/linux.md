---
title: Linux
parent: 개발
nav_order: 15
---

# Linux
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

--- 

## 리눅스 배포판 계열 정리

리눅스 배포판은 크게 **Debian 계열**, **Red Hat 계열**, 그리고 그 외의 **독립 계열**로 나눌 수 있다.  
아래는 서버·개발 환경에서 많이 사용하는 배포판 중심으로 정리한 내용이다.

---

## 1. Debian 계열
패키지: `.deb` / APT  
특징: 안정성과 오픈소스 철학 중심. 데스크탑·서버 모두에서 널리 쓰임.

### 주요 배포판
- **Debian**  
  가장 기본이 되는 배포판으로, 많은 파생 OS의 기반이 됨.
- **Ubuntu**  
  Debian 기반의 가장 인기 많은 배포판.  
  - 서버/데스크탑 모두 친숙하고 문서가 많음  
  - GPU·머신러닝 환경 구성에 매우 적합(CUDA 호환성 우수)
  - PyTorch/TensorFlow 공식 가이드 대부분 Ubuntu 기준
- **Linux Mint**, **Pop!\_OS**, **Kali Linux** 등 다양한 파생판 존재

---

## 2. Red Hat 계열
패키지: `.rpm` / YUM or DNF  
특징: 기업·서버 환경에서 가장 많이 사용되는 계열. 안정성과 장기 지원(LTS)이 강점.

### 주요 배포판
- **RHEL (Red Hat Enterprise Linux)**  
  기업용 서버 표준.
- **CentOS Stream**, **Rocky Linux**, **AlmaLinux**  
  RHEL 호환 서버 배포판으로 많이 사용.
- **Fedora**  
  최신 기술 테스트베드. 데스크탑 사용자도 많음.

### Amazon Linux는 어디에 해당?
- **Amazon Linux (1, 2, 2023)**  
  엄밀히 말하면 **AWS가 만든 독립 배포판**이지만,  
  구조와 패키지 시스템은 **RHEL 계열(.rpm)** 방식과 더 가깝다.  
  다만 **완전한 RHEL 호환은 아닌 독자 시스템**이다.
  - AWS 서비스와 최적화되어 있고, 가볍고 안정적  
  - 운영 서버에서 널리 사용  
  - GPU 환경 구성은 Ubuntu보다 상대적으로 번거로움

---

## 3. 그 외 주요 계열 (간단 정리)

### Arch 계열
- **Arch Linux**, **Manjaro**  
- 최신 기술, 높은 자유도, 롤링 업데이트 방식

### SUSE 계열
- **openSUSE**, **SLES**  
- 기업 서버용으로 강함

### 독립 계열
- **Gentoo**, **Slackware**, **NixOS**  
- 고급 사용자용 또는 설정 재현성·최적화 목적

---

## 요약
- **Debian 계열 → Ubuntu 중심, 개발·ML에 최적**
- **Red Hat 계열 → 서버 운영 안정성, 기업 환경 강세**
- **Amazon Linux → AWS 최적화된 RHEL 계열 스타일의 독립 배포판**