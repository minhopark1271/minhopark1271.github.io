---
title: SW 보안관리
parent: 경영
nav_order: 37
description: 연구/해석용 SW 개발기업에 필요한 기술적 보안(VPN, 권한관리, DLP)과 법적/관리적 보안(NDA, IP 귀속, 온보딩 교육)을 실무 중심으로 정리합니다.
---

# SW 개발기업의 보안관리 체계
{:.no_toc}

연구/해석용 소프트웨어를 개발하는 기업이 갖춰야 할 보안관리를 **기술적 보안**과 **법적/관리적 보안** 두 축으로 정리합니다.

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## Part 1. 기술적 보안

### 1. VPN + IP 화이트리스트

#### GitHub Enterprise IP 제한

```
Settings → Organizations → Security
→ "IP allow list"에 허용 IP 등록
```

- 회사 사무실 고정 IP
- VPN 출구 IP (개발자는 VPN 연결 후에만 접근 가능)
- VPN 미연결 시 GitHub 자체가 접근 차단

#### VPN 구성 방식

| 방식 | 도구 | 특징 |
|------|------|------|
| 클라우드 VPN | AWS Client VPN, GCP Cloud VPN | 인프라와 통합 용이 |
| 자체 구축 | WireGuard, OpenVPN | 비용 저렴, 관리 필요 |
| 제로트러스트 | Cloudflare Access, Tailscale | VPN 없이 ID 기반 접근 |

#### 실무 운영 팁

- 개발자 PC에 **VPN 자동 연결 정책 강제**
- VPN 접속 로그와 GitHub 접근 로그 **교차 검증**
- 재택/해외 접속 시 별도 승인 프로세스

---

### 2. 레벨별 권한 관리 및 승인 구조

#### GitHub 기본 권한 5단계

| 레벨 | 권한 | 대상 |
|------|------|------|
| Read | 코드 열람만 | 외부 협업자, QA |
| Triage | 이슈 관리 | PM, 기획자 |
| Write | 브랜치 push | 일반 개발자 |
| Maintain | 저장소 설정 일부 | 시니어 개발자 |
| Admin | 전체 관리 | 팀 리드, CTO |

#### Branch Protection Rules

```
Settings → Branches → Branch protection rules

main/master 브랜치 설정:
  Require pull request reviews (최소 2명 승인)
  Require review from Code Owners
  Dismiss stale reviews (코드 변경 시 기존 승인 무효화)
  Require status checks to pass (CI 통과 필수)
  Restrict who can push (특정 팀만 push 가능)
  Require linear history (force push 금지)
```

Branch Protection은 **코드 품질과 보안을 동시에 확보**하는 가장 중요한 설정입니다.

#### CODEOWNERS로 모듈별 승인자 지정

```bash
# .github/CODEOWNERS

# 핵심 알고리즘 → CTO만 승인 가능
/src/core/algorithm/    @cto-github-id

# AI 모델 관련 → ML팀 리드만
/src/models/            @ml-lead

# API → 백엔드 팀 전체
/src/api/               @org/backend-team

# 인프라 설정 → DevOps만
/infra/                 @org/devops-team
```

#### 팀/저장소 분리 구조 예시

```
Organization
├── Team: core-engine (핵심 알고리즘)
│   └── Repo: research-core (Admin: 시니어만)
├── Team: api-team
│   └── Repo: research-api (Write 권한)
└── Team: external-collaborators
    └── Repo: research-sdk (Read만, 공개 인터페이스만 포함)
```

#### PR 승인 흐름

```
개발자 → feature 브랜치 push
         ↓
     PR 생성 (자동으로 CODEOWNERS에 리뷰 요청)
         ↓
  CODEOWNERS 승인 + CI 통과
         ↓
     main 머지 가능
```

---

### 3. DLP 솔루션 + 접근 로그 모니터링

#### GitHub 자체 기능

**Audit Log (감사 로그)**

```
Organization → Settings → Audit log

기록되는 항목:
- 저장소 clone/download 시각 및 IP
- 권한 변경 이력
- 멤버 추가/제거
- 브랜치 보호 규칙 변경
- Secret 접근 이력
```

**Secret Scanning**

```
Settings → Code security → Secret scanning
  활성화 시 API키, 토큰 등이 커밋에 포함되면 자동 알림
  Push protection: 커밋 자체를 차단
```

**GitHub Advanced Security (유료)**
- Code scanning (취약점 자동 탐지)
- Dependency review
- Secret scanning push protection

#### 외부 DLP 솔루션 연동

| 솔루션 | 특징 |
|--------|------|
| **GitGuardian** | 코드 내 시크릿/민감정보 실시간 탐지, GitHub 연동 |
| **Nightfall AI** | 코드베이스 내 PII/IP 탐지 |
| **Cycode** | SCM 전체 보안 모니터링 |
| **Spectral** | 오픈소스, 커밋 전 로컬 스캔 가능 |

**GitGuardian 연동 예시 (가장 많이 사용)**

```yaml
# .github/workflows/secret-scan.yml
name: GitGuardian Security Check
on: [push, pull_request]

jobs:
  scanning:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: GitGuardian/ggshield-action@v1
        env:
          GITGUARDIAN_API_KEY: ${{ secrets.GITGUARDIAN_API_KEY }}
```

#### 접근 로그 모니터링 자동화

**Audit Log → SIEM 연동**

```
GitHub Audit Log
      ↓ (Webhook 또는 API polling)
Splunk / Datadog / AWS CloudWatch
      ↓
이상 탐지 룰 적용
      ↓
Slack/이메일 알림
```

**모니터링 핵심 이벤트**

| 이벤트 | 설명 |
|--------|------|
| `repo.clone` | 저장소 클론 (대량 클론 감지) |
| `repo.download` | ZIP 다운로드 |
| `org.invite_member` | 신규 멤버 초대 |
| `protected_branch` | 브랜치 보호 규칙 변경 |
| `oauth_application` | 외부 앱 권한 부여 |
| `repo.destroy` | 저장소 삭제 |

**이상 탐지 룰 예시**

```python
# 비업무시간 접근 알림
if access_time not in business_hours:
    alert("비업무시간 접근: {user} at {time}")

# 단시간 대량 clone 감지
if clone_count > 5 within 10_minutes:
    alert("비정상 대량 clone: {user}")

# 해외 IP 접근
if ip_country != "KR":
    alert("해외 IP 접근: {ip} by {user}")
```

#### 기술적 보안 최소 필수 구성

| 순서 | 항목 |
|------|------|
| 1 | GitHub Organization Private + IP allowlist |
| 2 | VPN 필수 접속 정책 |
| 3 | Branch Protection + CODEOWNERS |
| 4 | Audit Log → Slack 알림 연동 |
| 5 | GitGuardian (시크릿 스캔) |

이 5가지만 갖춰도 **대부분의 내부 유출 시나리오**를 커버할 수 있습니다.

---

## Part 2. 법적/관리적 보안

### 1. NDA (비밀유지계약)

#### 핵심 포함 항목

1. 비밀정보의 정의
2. 의무 범위 (수령자의 의무)
3. 예외 사항
4. 계약 기간 및 비밀유지 존속 기간
5. 위반 시 제재
6. 분쟁 해결

#### NDA 조항 예시

```
제1조 (비밀정보의 정의)
본 계약에서 "비밀정보"란 (주)OOO(이하 "갑")이
을에게 제공하는 다음 각 호의 정보를 말한다.

1. 소스코드, 알고리즘, 데이터베이스 구조
2. 연구개발 자료, 기술 문서, 설계도
3. 미공개 제품·서비스 정보
4. 고객 정보, 계약 내용
5. 기타 "대외비", "Confidential" 등으로
   표시된 일체의 정보

제2조 (비밀유지 의무)
을은 비밀정보를 본 계약 목적 외에 사용하거나
제3자에게 공개·누설하여서는 아니 된다.

제3조 (예외)
다음의 경우 비밀유지 의무를 지지 않는다.
1. 수령 당시 이미 공지된 정보
2. 을이 독자적으로 개발한 정보
3. 법령에 의해 공개가 강제된 경우

제4조 (계약 기간)
- 계약 기간: 서명일로부터 OO년
- 비밀유지 존속: 계약 종료 후 3년간 유지

제5조 (위반 시 제재)
을이 본 조항을 위반할 경우:
1. 손해배상 청구 가능
2. 위약벌: 위반 1건당 OO만원
3. 형사 고소 (영업비밀보호법 위반)
```

#### 실무 운영 포인트

- **계약 전 서명 → GitHub 계정 권한 부여** 순서 엄수
- 서명본 스캔 후 계약 관리 시스템에 보관 (만료일 알림 설정)
- 갱신 주기: 매년 또는 계약 종료 시 재서명

---

### 2. IP 귀속 계약 (지식재산권 귀속)

협업 중 작성한 코드의 소유권이 **누구에게 귀속되는지** 명확히 하는 것이 핵심입니다.

#### IP 귀속 조항 예시

```
제1조 (업무 결과물의 귀속)
을이 본 계약 수행 중 개발·작성한
모든 소프트웨어, 소스코드, 문서,
아이디어, 발명은 갑에게 귀속된다.

제2조 (저작권 양도)
을은 계약 기간 중 생성한 저작물에 대해
저작재산권 전부를 갑에게 양도한다.
(저작인격권은 을에게 유보)

제3조 (기존 IP 보호)
을이 계약 이전부터 보유한 기술·코드는
본 계약의 귀속 대상에서 제외된다.
(단, 별도 목록으로 사전 명시 필요)

제4조 (오픈소스 사용 제한)
을은 갑의 사전 서면 동의 없이
GPL 등 Copyleft 라이선스 코드를
결과물에 포함할 수 없다.

제5조 (계약 종료 후)
계약 종료 시 을은:
1. 비밀정보 및 결과물 전부 반환
2. 로컬 사본 즉시 삭제
3. 삭제 확인서 제출
```

#### 프리랜서 vs 기업 협업 차이

| 구분 | 프리랜서 | 협업 기업 |
|------|---------|---------|
| IP 귀속 | 전부 갑에게 양도 | 공동 개발 시 지분 협의 |
| 2차 활용 | 포트폴리오 사용 금지 | 별도 라이선스 계약 |
| 퇴직 후 | 경업금지 조항 추가 | 기술 유용 금지 조항 |

---

### 3. 온보딩 보안 교육

#### 교육 커리큘럼

**Day 1 - 보안 서약 및 기본 규정**

- NDA/IP 계약 서명 (교육 전 완료)
- 보안 정책 문서 숙지 확인서 서명
- 금지 행위 목록 전달

**절대 금지 행위:**
- 코드를 개인 GitHub에 push
- ChatGPT/Copilot 등 외부 AI에 코드 붙여넣기
- 카카오톡/슬랙 외부 채널로 코드 공유
- 개인 USB/외장드라이브에 저장
- 스크린샷 후 외부 전송

**Day 2 - 기술 보안 도구 사용법**

- VPN 설치 및 접속 방법
- GitHub 권한 구조 설명
- 승인 없이 접근 불가한 저장소 안내
- 커밋 전 시크릿 스캔 방법 (GitGuardian 등)
- 보안 사고 발생 시 신고 채널 안내

**Day 3 - 실제 사례 교육**

- 국내외 소스코드 유출 사례 공유 (예: 삼성 ChatGPT 코드 유출 사건, 2023)
- 유출 시 법적 처벌 수위 안내
  - 영업비밀보호법 위반: 최대 **10년 이하 징역**
  - 손해배상 청구 가능

#### 보안 서약서 예시

```
본인은 아래 사항을 준수할 것을 서약합니다.

1. 업무상 취득한 소스코드, 기술 정보를
   외부에 공개하거나 유출하지 않겠습니다.

2. 외부 AI 도구(ChatGPT 등)에 회사 코드를
   입력하지 않겠습니다.

3. 개인 저장소(GitHub 등)에 업무 코드를
   업로드하지 않겠습니다.

4. 계약 종료 시 모든 자료를 반환하고
   로컬 사본을 삭제하겠습니다.

5. 위 사항 위반 시 민·형사상 책임을
   감수하겠습니다.

서명: ___________  날짜: ___________
```

#### 주기적 관리 체계

```
입사/계약 시    → NDA 서명 + 보안 교육
     ↓
매분기          → 보안 정책 업데이트 공지
     ↓
매년            → NDA 갱신 + 보안 교육 재이수
     ↓
퇴직/계약 종료  → 접근 권한 즉시 회수
                 + 자료 반환 확인서 징구
                 + 경업금지 기간 안내
```

---

## 최소 필수 체크리스트

### 기술적 보안

| 항목 | 설명 |
|------|------|
| GitHub Organization Private + IP allowlist | 접근 자체를 물리적으로 제한 |
| VPN 필수 접속 정책 | 네트워크 레벨 보안 |
| Branch Protection + CODEOWNERS | 코드 변경 통제 |
| Audit Log → Slack 알림 연동 | 이상 행위 탐지 |
| GitGuardian (시크릿 스캔) | 민감정보 유출 방지 |

### 법적/관리적 보안

| 항목 | 설명 |
|------|------|
| NDA (비밀유지계약) | 유출 시 법적 대응 근거 |
| IP 귀속 계약 | 코드 소유권 명확화 |
| 보안 서약서 | 개인 책임 명시 |
| 보안 교육 이수 확인서 | 교육 이행 증빙 |
| 퇴직/종료 시 자료 반환 확인서 | 자료 회수 증빙 |

기술적 보안 5가지 + 법적 보안 5가지, **총 10가지**를 갖추면 SW 개발기업의 핵심 보안 체계가 완성됩니다. 계약서는 반드시 **법무사 또는 변호사 검토**를 받는 것을 권장합니다.

---

## 스타트업 보안 도입 순서 (관리자 1인 기준)

보안 전담 인력 없이 관리자 1명이 수동으로 운영하는 스타트업이라면, 한꺼번에 모든 것을 갖추려 하기보다 **효과 대비 도입 난이도**를 기준으로 단계적으로 접근하는 것이 현실적입니다.

### Phase 1. 즉시 (1일 이내)

> 돈과 기술 없이 바로 할 수 있는 것부터

| 순서 | 항목 | 소요 시간 | 이유 |
|------|------|-----------|------|
| 1 | **NDA + IP 귀속 계약 서명** | 30분 | 법적 보호 장치가 없으면 유출되어도 대응 불가. 템플릿 기반으로 즉시 서명 가능 |
| 2 | **보안 서약서 징구** | 10분 | NDA와 함께 서명. 심리적 억제 효과가 크고 비용 제로 |
| 3 | **GitHub Organization Private 전환** | 5분 | Public 저장소가 있다면 즉시 Private 전환. 가장 기본적인 접근 차단 |

### Phase 2. 1주 이내

> GitHub 설정만으로 코드 변경 통제 확보

| 순서 | 항목 | 소요 시간 | 이유 |
|------|------|-----------|------|
| 4 | **Branch Protection Rules 설정** | 30분 | main 브랜치 직접 push 차단 + PR 리뷰 필수. 실수·악의적 변경 모두 방어 |
| 5 | **GitHub 권한 레벨 정리** | 1시간 | 전원 Admin인 상태에서 벗어나 역할별 최소 권한 부여 |
| 6 | **Secret Scanning 활성화** | 5분 | GitHub 무료 기능. 설정 토글만 켜면 API키·토큰 유출 자동 감지 |

### Phase 3. 1개월 이내

> 모니터링과 네트워크 보안 추가

| 순서 | 항목 | 소요 시간 | 이유 |
|------|------|-----------|------|
| 7 | **Audit Log → Slack 알림 연동** | 2~3시간 | clone, 권한 변경 등 핵심 이벤트를 Slack으로 받아 이상 행위 감지 |
| 8 | **GitGuardian 무료 플랜 연동** | 1시간 | CI/CD 파이프라인에 시크릿 스캔 추가. 무료로 시작 가능 |
| 9 | **온보딩 보안 교육 프로세스 수립** | 반나절 | 교육 자료 1장 + 금지 행위 목록. 신규 입사자부터 적용 |

### Phase 4. 3개월 이내

> 인프라 레벨 보안 강화

| 순서 | 항목 | 소요 시간 | 이유 |
|------|------|-----------|------|
| 10 | **VPN + IP 화이트리스트** | 1~2일 | Tailscale 등으로 빠르게 구축 가능. 네트워크 레벨에서 접근 자체를 제한 |
| 11 | **CODEOWNERS 파일 설정** | 1시간 | 핵심 디렉토리별 승인자 지정. 팀이 3명 이상일 때 효과적 |
| 12 | **퇴직/종료 프로세스 문서화** | 반나절 | 권한 회수 체크리스트 + 자료 반환 확인서 양식 준비 |

### 우선순위 판단 기준

```
          높은 효과
              ↑
              │  ★ NDA/서약서     ★ Branch Protection
              │  (즉시, 무료)     (즉시, 무료)
              │
              │  ★ Secret Scan   ★ Audit Log→Slack
              │  (즉시, 무료)     (반나절, 무료)
              │
              │  ★ GitGuardian   ★ 온보딩 교육
              │  (1시간, 무료)    (반나절, 무료)
              │
              │                  ★ VPN/IP제한
              │                  (1~2일, 유료)
              │
    낮은 난이도 ────────────────────────── 높은 난이도
```

핵심 원칙은 **"계약 먼저, 설정 다음, 인프라 나중"**입니다. 법적 보호 장치는 비용이 거의 들지 않으면서 유출 시 대응 근거가 되므로 반드시 첫 번째로 갖춰야 합니다. GitHub 설정 기반 보안은 무료이면서 효과가 높아 두 번째로 적용하고, VPN 등 인프라 투자가 필요한 항목은 팀 규모가 커지는 시점에 도입합니다.
