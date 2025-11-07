---
title: Github Pages
parent: 개발
nav_order: 1
---

# GitHub Pages 사용한 블로그 생성 및 배포
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## GitHub Pages 개요

GitHub Pages는 GitHub에서 제공하는 무료 정적 웹사이트 호스팅 서비스입니다.

- **무료 호스팅**: 별도 비용 없이 웹사이트 운영
- **Jekyll 지원**: 정적 사이트 생성기 내장
- **커스텀 도메인**: 개인 도메인 연결 가능
- **HTTPS 자동 적용**: SSL 인증서 자동 제공

---

## 사전 준비사항

### 필수 요구사항
- GitHub 계정
- Git 기본 지식
- 텍스트 에디터
- **Ruby**: Jekyll 실행을 위한 런타임

---

## 저장소 생성 및 GitHub Pages 활성화

### Repository 생성
1. GitHub에 로그인 후 `New repository` 클릭
2. Repository 이름을 `username.github.io` 형식으로 입력
3. `Public`으로 설정 - (유료 플랜에서 단계적으로 Private 지원)
4. `Add a README file` 체크
5. `Create repository` 클릭

### GitHub Pages 활성화
1. 생성된 저장소의 `Settings` 탭 이동
2. 왼쪽 메뉴에서 `Pages` 클릭
3. Source를 `Deploy from a branch` 선택
4. Branch를 `main` 선택
5. `Save` 클릭

---

## 로컬 개발 환경 설정

### Ruby 설치
```bash
brew install ruby
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Jekyll 설치
```bash
# Jekyll과 Bundler 설치
gem install jekyll bundler
# WebRick 설치 (Ruby 3.0+에서 필요)
gem install webrick
```

### 저장소 클론
```bash
# 저장소를 로컬로 클론
git clone https://github.com/username/username.github.io.git
cd username.github.io
```

---

## Jekyll 테마 선택 및 적용

### 인기 Jekyll 테마 사이트
- [Jekyll Themes](http://jekyllthemes.org/)
- [Jekyll Themes IO](https://jekyllthemes.io/free)
- [GitHub Jekyll Themes](https://github.com/topics/jekyll-theme)

### 테마 적용 방법 1: Remote Theme 사용
(제공되는 테마를 바탕으로 커스텀할 항목이 많은 경우 오히려 복잡할 수 있음)
```yaml
# _config.yml에 추가
remote_theme: username/theme-name
plugins:
  - jekyll-remote-theme
```

### 방법 2: Fork 또는 다운로드
1. 테마 저장소를 Fork하거나 ZIP 다운로드
2. 파일들을 로컬 저장소에 복사
3. `bundle install` 실행

### 나의 경우
[just-the-docs](https://just-the-docs.com/) 사용.  
정보를 카테고리별로 깔끔하게 정리하고 추후 검색하기 용이한 템플릿으로 판단.  
just-the-docs에서 사용하는 검색에 사용하는 lunr라이브러리가 기본적으로 한국어 지원을 하지 않아서 한국어 검색 기능을 커스텀으로 추가.  
[참고; lunr-languages](https://github.com/MihaiValentin/lunr-languages)
[블로그 - just the docs 사용한 사람](https://devshjeon.github.io/12)

### Jekyll 사이트 초기화
```bash
# 새로운 Jekyll 사이트 생성
jekyll new ./
# 의존성 설치
bundle install
# 로컬 서버 실행
bundle exec jekyll serve
# 브라우저에서 http://localhost:4000 확인
```

---

## 기본 설정 (_config.yml)

```yaml
# 사이트 기본 정보
title: "내 블로그"
tagline: "개발과 일상 이야기"
description: "블로그입니다"
url: "https://username.github.io"
baseurl: ""

# 플러그인
plugins:
  - jekyll-feed
  - jekyll-sitemap
  - jekyll-seo-tag
  - ...
```

템플릿에 따라 표시되기도하고 숨겨져있기도 함.  
검색시에 크롤러가 긁어갈 수 있는 항목들은 검색 최적화 고려해서 작성.  
템플릿 및 플러그인마다 사용하는 항목이 있다면 적절히 추가.

---

## 콘텐츠 구조 설정

### 기본 디렉토리 구조
```
username.github.io/
├── _config.yml          # Jekyll 설정
├── index.md             # 홈페이지
└── Gemfile              # Ruby 의존성
```

### 필수 페이지 생성

```
---
title: 홈
layout: default
nav_order: 1
description: "description"
permalink: /
---

# Title

Contents...

```
markdown으로 index.md 적당히 작성

---

## SEO 및 웹마스터 도구 설정

### Google Search Console 등록
1. [Google Search Console](https://search.google.com/search-console) 접속 -> 시작하기
2. 속성 추가 -> URL 접두어 선택
3. 사이트 URL 입력: `https://username.github.io`
4. 소유권 확인용 HTML 파일을 저장소 루트에 업로드

### Sitemap 생성
```yaml
# _config.yml에 플러그인 추가
plugins:
  - jekyll-sitemap
```

### robots.txt 생성
```
---
layout: null
---
User-agent: *
Allow: /

Sitemap: {{ site.url }}/sitemap.xml
```

### Google Analytics 연동
```html
<!-- _includes/google-analytics.html -->
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```
내 경우엔 Footer에 추가함.

---

## 배포 및 자동화

### GitHub Actions로 자동 배포
```yaml
# .github/workflows/pages.yml
name: Build and deploy Jekyll site
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    - name: Setup Ruby
      uses: ruby/setup-ruby@v1
      with:
        ruby-version: 3.1
        bundler-cache: true
    - name: Build site
      run: bundle exec jekyll build
    - name: Deploy to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./_site
```

### 빌드 & 배포 확인 및 접속
Github main 푸시 이후 build, deploy 상태 확인  
[https://minhopark1271.github.io/](https://minhopark1271.github.io/)

---

## 성능 최적화

### CDN 사용
```yaml
# _config.yml
cdn_url: "https://cdn.jsdelivr.net/gh/username/username.github.io@main"
```
이미지가 많이 들어갈 일이 없을듯. 추후 고려

### 압축 및 최적화
```yaml
# _config.yml
sass:
  style: compressed
plugins:
  - jekyll-compress-html
```
이것도 추후 고려

---

## 참고 자료

- [Jekyll 공식 문서](https://jekyllrb.com/)
- [GitHub Pages 문서](https://pages.github.com/)
- [Liquid 템플릿 언어](https://shopify.github.io/liquid/)
- [Markdown 가이드](https://www.markdownguide.org/)
- [Jekyll 테마 갤러리](http://jekyllthemes.org/)
