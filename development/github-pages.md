---
layout: default
title: Github Pages
parent: 개발
nav_order: 1
permalink: /development/github-pages/
---

# Github Pages 가이드

Github Pages를 사용하여 정적 웹사이트를 호스팅하는 방법에 대한 완전한 가이드입니다.

## Github Pages란?

Github Pages는 Github에서 제공하는 무료 정적 웹사이트 호스팅 서비스입니다. 개인 블로그, 프로젝트 문서, 포트폴리오 사이트 등을 쉽게 만들고 배포할 수 있습니다.

## 주요 특징

- **무료 호스팅**: Github 계정만 있으면 무료로 사용 가능
- **자동 배포**: Git push만으로 자동 배포
- **커스텀 도메인 지원**: 개인 도메인 연결 가능
- **Jekyll 지원**: 정적 사이트 생성기 Jekyll 내장 지원
- **HTTPS 지원**: 무료 SSL 인증서 제공

## 시작하기

### 1. 저장소 생성

Github Pages를 사용하는 방법은 두 가지입니다:

1. **개인/조직 사이트**: `username.github.io` 형식의 저장소 생성
2. **프로젝트 사이트**: 기존 저장소에서 Pages 활성화

### 2. 설정 방법

#### 개인 사이트 생성
```bash
# 저장소 이름: username.github.io
git clone https://github.com/username/username.github.io.git
cd username.github.io
echo "Hello World" > index.html
git add .
git commit -m "Initial commit"
git push origin main
```

#### 프로젝트 사이트 설정
1. 저장소 Settings → Pages 메뉴 이동
2. Source에서 배포 브랜치 선택 (main, gh-pages 등)
3. 폴더 선택 (/ 또는 /docs)

## Jekyll 사용하기

### Jekyll 테마 적용

#### Remote Theme 사용 (권장)
`_config.yml` 파일에 다음 내용 추가:

```yaml
remote_theme: just-the-docs/just-the-docs
plugins:
  - jekyll-remote-theme
```

#### Fork 방식
1. 원하는 테마 저장소 Fork
2. 저장소 이름을 `username.github.io`로 변경
3. `_config.yml` 파일 수정

### 기본 디렉토리 구조

```
username.github.io/
├── _config.yml          # Jekyll 설정 파일
├── _posts/              # 블로그 포스트
├── _layouts/            # 레이아웃 템플릿
├── _includes/           # 재사용 가능한 컴포넌트
├── assets/              # CSS, JS, 이미지 등
└── index.md             # 홈페이지
```

## 커스텀 도메인 설정

### 1. DNS 설정

도메인 DNS 설정에서 다음 레코드 추가:

#### A 레코드
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

#### CNAME 레코드 (서브도메인의 경우)
```
www.yourdomain.com → username.github.io
```

### 2. Github 설정

1. 저장소 Settings → Pages
2. Custom domain 섹션에 도메인 입력
3. Enforce HTTPS 체크박스 활성화

### 3. CNAME 파일 생성

저장소 루트에 `CNAME` 파일 생성:
```
yourdomain.com
```

## 고급 기능

### Github Actions 활용

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.0
          
      - name: Install dependencies
        run: bundle install
        
      - name: Build site
        run: bundle exec jekyll build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
```

### 환경별 설정

#### 개발 환경
```bash
bundle exec jekyll serve --drafts --incremental
```

#### 프로덕션 빌드
```bash
JEKYLL_ENV=production bundle exec jekyll build
```

## 성능 최적화

### 1. 이미지 최적화
- WebP 형식 사용
- 적절한 크기로 리사이징
- Lazy loading 구현

### 2. CSS/JS 최적화
```yaml
# _config.yml
sass:
  style: compressed

plugins:
  - jekyll-minifier
```

### 3. CDN 활용
```html
<!-- Font loading optimization -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

## 트러블슈팅

### 일반적인 문제들

#### 배포가 안 될 때
1. 저장소가 public인지 확인
2. Pages 설정에서 소스 브랜치 확인
3. `_config.yml` 파일 문법 오류 체크

#### 404 에러
1. 파일 경로와 URL 구조 확인
2. `permalink` 설정 검토
3. 대소문자 구분 주의

#### 빌드 실패
1. Jekyll 버전 호환성 확인
2. 플러그인 의존성 문제 해결
3. Gemfile.lock 파일 업데이트

## 유용한 리소스

- [Github Pages 공식 문서](https://docs.github.com/en/pages)
- [Jekyll 공식 사이트](https://jekyllrb.com/)
- [Jekyll 테마 모음](https://jekyllthemes.io/)
- [Liquid 템플릿 언어](https://shopify.github.io/liquid/)

## 마무리

Github Pages는 개발자들이 쉽게 웹사이트를 만들고 호스팅할 수 있는 훌륭한 플랫폼입니다. Jekyll과 함께 사용하면 강력하고 유연한 정적 사이트를 구축할 수 있습니다.

---

*이 가이드가 Github Pages를 시작하는 데 도움이 되었기를 바랍니다. 추가 질문이 있으시면 언제든지 문의해 주세요.*