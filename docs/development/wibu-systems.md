---
title: Wibu-Systems
parent: 개발
nav_order: 41
description: 독일 Wibu-Systems의 소프트웨어 보호·라이선스 관리 플랫폼 CodeMeter 소개. AxProtector, IxProtector, Blurry Box 등 보호 기술과 CmDongle, CmCloud 등 라이선스 컨테이너를 정리합니다.
---

# Wibu-Systems와 CodeMeter
{:.no_toc}

독일 기반 소프트웨어 보호 및 라이선스 관리 전문 기업. 1989년 설립, 핵심 플랫폼은 **CodeMeter**.

### Link

- [wibu.com](https://www.wibu.com)
- [CodeMeter 제품 페이지](https://www.wibu.com/us/products/codemeter.html)
- [라이선스 모델 안내](https://www.wibu.com/products/license-models.html)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 개요

Wibu-Systems는 소프트웨어 자산과 기술 IP를 위변조·리버스 엔지니어링으로부터 보호하고, 유연한 라이선스 모델로 수익화를 지원하는 B2B 솔루션 기업입니다.

하드웨어, 소프트웨어, 클라우드 전반에 걸친 암호화 및 난독화 기술을 단일 플랫폼(CodeMeter)으로 제공합니다.

**대상 산업**: 제조, 의료기기, 국방, 금융/법률 테크, 교육, 미디어, 산업 자동화 등

---

## 소프트웨어 보호 기술

### AxProtector

소프트웨어 전체를 암호화하고 **AxEngine** 보안 쉘을 주입하는 자동화 보호 도구입니다.

- 지원 언어/플랫폼: .NET, Java, Python, JavaScript, 네이티브 애플리케이션
- **Compile Time Obfuscation**: 빌드 시스템 컴파일 과정에 난독화를 통합
- 자동 보호 모드, 모듈식 라이선스 모드, IP 보호(라이선스 없는) 모드, 파일 암호화 모드 지원
- 최신 안티-디버깅 및 안티-디스어셈블리 기법 적용

### IxProtector

AxProtector의 함수 단위 보호 모듈로, **개별 함수를 추출·암호화**하여 크래킹 저항성을 높입니다.

- **메모리 상주 시간 최소화**: 함수는 실제 실행되는 최소 시간만 메모리에 복호화되어 메모리 덤핑·패칭·에뮬레이션 공격을 차단
- **Honey Pot 트랩**: IxProtector가 소프트웨어에 숨겨진 명령을 삽입해, 크래커가 암호화된 함수를 전부 복호화하려 하면 트랩에 빠져 라이선스가 잠김
- **Record & Playback 공격 차단**: 암호화 연산을 통해 재생 공격을 원천 차단

### Blurry Box

2014년 독일 IT 보안 어워드(카를스루에 공대·FZI 연구센터 공동 수상)에서 1위를 차지한 **독자적 난독화 기술**입니다.

- 전통적인 암호화보다 강력한 보호가 필요한 복잡·민감한 소프트웨어에 적합
- 기능 단위로 암호화된 코드가 런타임에 동적으로 변형되어 정적 분석을 무력화
- AxProtector와 결합하여 최고 수준의 보호 구성 가능

---

## 라이선스 컨테이너

CodeMeter는 세 가지 라이선스 컨테이너 타입을 지원합니다.

| 컨테이너 | 방식 | 특징 |
|---------|------|------|
| **CmDongle** | 하드웨어 (USB 동글) | 스마트카드 칩에 암호화된 라이선스 저장, 완전 오프라인 동작, 탬퍼링 내성 최고. USB, SD, microSD, CF, CFast, ASIC 등 다양한 폼팩터 지원 |
| **CmActLicense** | 소프트웨어 | 기기의 디지털 핑거프린트에 라이선스를 바인딩. 동글이 불필요하거나 불가능한 환경에 적합 |
| **CmCloudContainer** | 클라우드 | Wibu CodeMeter Cloud Server에 라이선스 저장. 사용자 인증 기반으로 어디서나 접근 가능 |

---

## 라이선스 관리

### 지원 라이선스 모델

CodeMeter는 전통적 모델부터 현대적 소비형 모델까지 폭넓게 지원합니다.

- 단일 사용자 라이선스 (Single User)
- 네트워크 라이선스 (Floating License)
- 구독형 (Subscription)
- 사용량 기반 (Pay-per-Use)
- 기간 한정, 업그레이드, 체험판, 이동식(Movable), 반납형(Returnable) 라이선스

### CodeMeter License Central

소프트웨어 라이선스 전체 생명주기를 관리하는 중앙 집중형 솔루션입니다.

- 라이선스 생성 → 배포 → 일상 관리까지 통합
- **SOAP 기반 API** 제공으로 기존 ERP·CRM SKU와 직접 매핑 가능
- 온라인 활성화, 체험판, 이동식, 반납형 라이선스 등 지원

### CodeMeter License Portal

고객이 직접 자신의 라이선스를 조회·관리할 수 있는 셀프서비스 포털입니다.

---

## 요약

| 구분 | 핵심 내용 |
|-----|---------|
| 보호 | AxProtector(전체 암호화) + IxProtector(함수 단위) + Blurry Box(동적 난독화) |
| 컨테이너 | CmDongle(하드웨어) / CmActLicense(소프트웨어) / CmCloud(클라우드) |
| 라이선스 관리 | License Central(백오피스) + License Portal(고객 포털) |
| 특징 | 단일 플랫폼(CodeMeter)으로 불법 복제 방지 + 난독화 + 수익화 모델 통합 |
