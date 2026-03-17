---
title: SW 보안 관리
parent: 개발
nav_order: 58
description: 소프트웨어 보안 관리의 핵심 개념 정리. SSDLC, DevSecOps, 보안 테스팅(SAST/DAST/SCA/IAST), SBOM, 주요 컴플라이언스 프레임워크(NIST/ISO 27001/SOC 2)를 한눈에 파악할 수 있도록 구성했습니다.
---

# 소프트웨어 보안 관리 핵심 정리
{:.no_toc}

SW 개발 전 주기에 걸친 보안 관리의 핵심 개념, 도구, 프레임워크를 빠르게 파악할 수 있도록 정리한 글입니다.

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 1. Secure SDLC (SSDLC)

기존 SDLC의 각 단계에 보안 활동을 내장(embed)하는 접근법입니다.

| 단계 | 핵심 보안 활동 |
|------|---------------|
| **요구사항** | 보안 요구사항 정의, 위험 분류 |
| **설계** | 위협 모델링 (STRIDE, DREAD), 보안 아키텍처 검토 |
| **구현** | 시큐어 코딩 표준 적용, 코드 리뷰 |
| **검증** | SAST/DAST/SCA/IAST 테스팅 |
| **배포** | 환경 설정 점검, 침투 테스트 |
| **운영/유지보수** | 취약점 모니터링, 패치 관리, 인시던트 대응 |

**핵심 원칙**: 보안을 별도 단계로 분리하지 않고, 기존 개발 라이프사이클 안에 녹여야 합니다.

---

## 2. DevSecOps

DevOps 파이프라인에 보안을 자동화하여 통합하는 방식입니다.

- **Shift Left**: 보안 점검을 개발 초기(IDE/PR 단계)로 이동
- **자동화**: CI/CD 파이프라인에 보안 테스트 자동 실행
- **피드백 루프**: 취약점 발견 → 즉시 개발자에게 알림 → 코드 머지 전 수정
- **문화**: 보안은 보안팀만의 책임이 아니라 개발팀 전체의 책임

**파이프라인 통합 포인트**:

```
코드 작성 → [SAST/SCA] → PR 리뷰 → 빌드 → [컨테이너 스캔] → 스테이징 → [DAST/IAST] → 배포 → [모니터링]
```

---

## 3. 보안 테스팅 도구 비교

| 구분 | 대상 | 시점 | 특징 |
|------|------|------|------|
| **SAST** | 소스코드 | 빌드 전 (IDE/CI) | 코드 패턴 분석, SQLi/XSS/하드코딩 시크릿 탐지 |
| **DAST** | 실행 중인 앱 | 스테이징/QA | 외부 공격 시뮬레이션, 런타임 취약점 발견 |
| **SCA** | 오픈소스 의존성 | 빌드/PR 시 | 서드파티 라이브러리 CVE 탐지, 라이선스 검사 |
| **IAST** | 실행 중인 앱 내부 | 테스트 시 | SAST+DAST 결합, 코드 레벨 매핑, 낮은 오탐률 |

**2025~2026 트렌드**: 개별 도구 → 통합 플랫폼(ASPM)으로 수렴 추세

---

## 4. SBOM (Software Bill of Materials)

소프트웨어를 구성하는 모든 컴포넌트(라이브러리, 프레임워크, 의존성)의 목록입니다.

- **왜 필요한가**
  - 공급망 공격 대응 (Log4j 사태 등)
  - 취약점 발생 시 영향 범위 즉시 파악
  - 규제 준수 (EU CRA, FDA, PCI DSS 4.0)
- **핵심 구성 요소**: 컴포넌트명, 버전, 공급자, 의존관계, 라이선스
- **표준 포맷**: SPDX, CycloneDX
- **자동화 도구**: Syft, Trivy, Snyk, Dependabot

**현황**: 2025년 기준 대기업 60%가 SBOM 도구 도입, 2028년 85% 전망 (Gartner)

---

## 5. 취약점 관리 라이프사이클

```
탐지 → 분류(심각도/CVSS) → 우선순위 결정 → 수정/완화 → 검증 → 모니터링
```

- **심각도 기준**: CVSS 점수 (Critical ≥ 9.0 / High ≥ 7.0 / Medium ≥ 4.0 / Low < 4.0)
- **우선순위 요소**: 공격 가능성(Exploitability), 자산 가치, 비즈니스 영향도
- **SLA 권장 기준**:
  - Critical: 24~48시간
  - High: 7일
  - Medium: 30일
  - Low: 90일 또는 다음 릴리스

---

## 6. 주요 컴플라이언스 프레임워크

| 프레임워크 | 대상 | 인증 가능 | 특징 |
|-----------|------|----------|------|
| **NIST CSF** | 범용 (미 연방기관 필수) | 자체 평가 | 5개 핵심 기능: 식별, 보호, 탐지, 대응, 복구 |
| **NIST SSDF** | SW 개발 조직 | 자체 평가 | 4개 실천 영역: 조직 준비, SW 보호, 안전한 SW 생산, 취약점 대응 |
| **ISO 27001** | 글로벌 조직 | 제3자 인증 | ISMS 수립·운영, 국제적 신뢰도 높음 |
| **SOC 2** | 서비스 제공 조직 | 감사 보고서 | 5개 신뢰 서비스 원칙: 보안, 가용성, 무결성, 기밀성, 프라이버시 |
| **OWASP SAMM** | SW 개발 조직 | 자체 평가 | 보안 성숙도 모델, 점진적 개선 로드맵 제공 |
| **CIS Controls** | 범용 | 자체 평가 | 18개 우선순위별 보안 통제, 빠른 적용 가능 |

**선택 기준**:
- 미국 시장 B2B SaaS → **SOC 2** 우선
- 글로벌/해외 고객 대응 → **ISO 27001**
- 정부/공공기관 납품 → **NIST** 계열
- 개발 조직 보안 성숙도 향상 → **OWASP SAMM**

> 주요 프레임워크 간 보안 통제 항목의 **96%가 중복**되므로, 하나를 체계적으로 구축하면 다른 프레임워크 확장이 용이합니다.

---

## 7. OWASP Top 10 (2021)

웹 애플리케이션의 가장 치명적인 보안 위험 10가지입니다.

1. **Broken Access Control** — 권한 검증 누락/우회
2. **Cryptographic Failures** — 암호화 미적용/취약한 알고리즘
3. **Injection** — SQL/NoSQL/OS/LDAP 인젝션
4. **Insecure Design** — 설계 단계 보안 결함
5. **Security Misconfiguration** — 기본값/불필요한 기능 활성화
6. **Vulnerable Components** — 알려진 취약점 있는 의존성 사용
7. **Auth Failures** — 인증/세션 관리 결함
8. **SW & Data Integrity Failures** — 무결성 검증 없는 업데이트/CI-CD
9. **Logging & Monitoring Failures** — 로깅/모니터링 부재
10. **SSRF** — 서버 측 요청 위조

---

## 8. 보안 관리 체계 구축 체크리스트

### 거버넌스
- [ ] 보안 정책 및 표준 문서화
- [ ] 보안 책임자(Security Champion) 지정
- [ ] 보안 교육 프로그램 운영
- [ ] 인시던트 대응 계획 수립

### 개발 프로세스
- [ ] SSDLC 적용 (각 단계별 보안 활동 정의)
- [ ] CI/CD에 SAST/SCA 자동화
- [ ] 코드 리뷰 시 보안 체크리스트 활용
- [ ] 시크릿 관리 도구 사용 (Vault, AWS Secrets Manager 등)

### 테스트 & 운영
- [ ] 정기 DAST/침투 테스트 실행
- [ ] SBOM 생성 및 관리 자동화
- [ ] 취약점 관리 SLA 수립 및 추적
- [ ] 런타임 보안 모니터링 (WAF, RASP)

### 컴플라이언스
- [ ] 목표 프레임워크 선정 및 갭 분석
- [ ] 감사 증적(Audit Trail) 자동 수집
- [ ] 정기 내부 감사 실행

---

## 참고 자료

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [NIST Secure Software Development Framework (SSDF)](https://csrc.nist.gov/projects/ssdf)
- [OWASP SAMM - Software Assurance Maturity Model](https://owasp.org/www-project-samm/)
- [OWASP Developer Guide - Secure Development](https://devguide.owasp.org/en/02-foundations/02-secure-development/)
- [SAST vs DAST vs IAST vs RASP Explained (2025)](https://deepstrike.io/blog/sast-vs-dast-vs-iast-vs-rasp-2025)
- [SBOMs in 2025: Trends & Predictions - Anchore](https://anchore.com/blog/software-supply-chain-security-in-2025-sboms-take-center-stage/)
- [NIST, ISO 27001 & SOC 2 Comparison Guide 2025](https://juncyber.com/cybersecurity-framework-comparison/)
