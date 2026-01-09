---
title: Supabase
parent: 개발
nav_order: 24
description: "Supabase 완벽 가이드. PostgreSQL 기반 오픈소스 Firebase 대안. 인증, 실시간 DB, 스토리지, Edge Functions. Firebase 대비 장단점 비교."
---

# Supabase
{:.no_toc}

오픈소스 Firebase 대안. PostgreSQL 기반 BaaS(Backend as a Service) 플랫폼.
"Build in a weekend, scale to millions"

### Link

- [Supabase 공식 사이트](https://supabase.com/)
- [Supabase GitHub](https://github.com/supabase/supabase)
- [Supabase 문서](https://supabase.com/docs)
- [내 프로젝트 대시보드](https://supabase.com/dashboard/project/eytgntmhfhclrlhdvsde)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 개요

Supabase는 모바일 및 웹 애플리케이션을 위한 오픈소스 백엔드 서비스(BaaS)다. Firebase의 대안으로 주목받고 있으며, PostgreSQL을 기반으로 한다.

**핵심 특징**:
- PostgreSQL 기반 관계형 데이터베이스
- 자동 RESTful API 및 GraphQL API 생성
- 실시간 데이터 동기화
- 인증 시스템 내장
- 파일 스토리지
- Edge Functions

---

## 주요 기능

### Database (PostgreSQL)

PostgreSQL 데이터베이스를 제공하며, 테이블 생성 시 자동으로 RESTful API가 생성된다.

**특징**:
- 완전한 PostgreSQL 기능 사용 가능
- Table Editor / SQL Editor 제공
- Row Level Security (RLS) 지원
- Foreign Key, Join 등 관계형 DB 기능

```sql
-- RLS 정책 예시: 본인 데이터만 조회 가능
CREATE POLICY "Users can view own data"
ON profiles FOR SELECT
USING (auth.uid() = user_id);
```

### Authentication

다양한 인증 방식을 기본 제공한다.

| 인증 방식 | 설명 |
|----------|------|
| Email/Password | 기본 이메일 로그인 |
| Magic Link | 이메일 링크 클릭으로 로그인 |
| OAuth | Google, GitHub, Apple, Discord 등 |
| Phone | SMS 인증 |
| Kakao | 카카오 로그인 (Firebase 미지원) |

```javascript
// 이메일 로그인 예시
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// OAuth 로그인 예시
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
})
```

### Storage

S3 호환 파일 스토리지를 제공한다.

**기능**:
- 버킷(Bucket) 생성 및 관리
- 파일 업로드/다운로드
- Public/Private 접근 제어
- CDN을 통한 파일 제공

```javascript
// 파일 업로드
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('public/avatar.png', file)

// Public URL 가져오기
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('public/avatar.png')
```

### Realtime

WebSocket을 통해 데이터 변경사항을 실시간으로 수신한다.

```javascript
// 실시간 구독
const channel = supabase
  .channel('messages')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      console.log('New message:', payload.new)
    }
  )
  .subscribe()
```

**활용 사례**:
- 채팅 애플리케이션
- 실시간 대시보드
- 협업 도구
- 알림 시스템

### Edge Functions

Deno 기반 서버리스 함수. 전 세계 CDN에 배포되어 지연 시간이 짧다.

```typescript
// supabase/functions/hello/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { name } = await req.json()
  return new Response(
    JSON.stringify({ message: `Hello ${name}!` }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

---

## Firebase vs Supabase

| 항목 | Firebase | Supabase |
|------|----------|----------|
| **데이터베이스** | NoSQL (Firestore) | PostgreSQL (관계형) |
| **소스코드** | 비공개 | 오픈소스 |
| **호스팅** | Google Cloud 전용 | 클라우드 / 셀프호스팅 |
| **쿼리** | 제한적 | 완전한 SQL |
| **보안 규칙** | Firestore Rules | Row Level Security |
| **카카오 로그인** | 미지원 | 지원 |
| **비용** | 상대적 고가 | 저렴 |
| **벤더 종속** | 높음 | 낮음 |

---

## 기술 스택

Supabase는 여러 오픈소스 프로젝트를 조합하여 구성된다.

| 컴포넌트 | 역할 |
|----------|------|
| **PostgreSQL** | 핵심 데이터베이스 |
| **PostgREST** | PostgreSQL → RESTful API 변환 |
| **GoTrue** | 사용자 인증 및 JWT 발급 |
| **Kong** | API Gateway |
| **Realtime** | WebSocket 기반 실시간 동기화 |
| **Storage API** | S3 호환 파일 스토리지 |
| **Deno** | Edge Functions 런타임 |

---

## 시작하기

### 1. 프로젝트 생성

1. [supabase.com](https://supabase.com) 접속
2. GitHub 또는 이메일로 로그인
3. "New Project" 클릭
4. 프로젝트명, 비밀번호, 리전 설정

### 2. 클라이언트 설치

```bash
npm install @supabase/supabase-js
```

### 3. 클라이언트 초기화

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
)
```

### 4. 데이터 CRUD

```javascript
// Create
const { data, error } = await supabase
  .from('posts')
  .insert({ title: 'Hello', content: 'World' })

// Read
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('id', 1)

// Update
const { data, error } = await supabase
  .from('posts')
  .update({ title: 'Updated' })
  .eq('id', 1)

// Delete
const { data, error } = await supabase
  .from('posts')
  .delete()
  .eq('id', 1)
```

---

## 장단점

### 장점

- **오픈소스**: 벤더 종속 없음, 셀프호스팅 가능
- **PostgreSQL**: 강력한 SQL, 풍부한 학습 자료
- **빠른 개발**: 서버 구축 없이 바로 시작
- **Row Level Security**: Firestore Rules보다 강력
- **카카오 로그인**: 한국 서비스에 유리
- **비용 효율**: Firebase 대비 저렴

### 단점

- **서버리스 제약**: 복잡한 비즈니스 로직은 Edge Functions 필요
- **플랫폼별 중복**: 웹/앱 각각 동일 로직 구현 필요
- **상대적 신생**: Firebase 대비 커뮤니티 작음

---

## 요금제

| 플랜 | 가격 | 특징 |
|------|------|------|
| Free | $0/월 | 500MB DB, 1GB Storage, 50K MAU |
| Pro | $25/월 | 8GB DB, 100GB Storage, 100K MAU |
| Team | $599/월 | 무제한 확장, 우선 지원 |
| Enterprise | 문의 | 맞춤 설정, SLA |

---

## 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase GitHub](https://github.com/supabase/supabase)
- [Supabase YouTube](https://www.youtube.com/@Supabase)
