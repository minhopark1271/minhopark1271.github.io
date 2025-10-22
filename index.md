---
title: 홈
layout: default
nav_order: 1
description: "기술, 개발, 사업, 투자, 취미, 여행"
permalink: /
---

# Mimi Note

## 소개

기술, 개발, 사업, 투자, 취미, 여행 관련하여 조사하고 경험한 지식이 증발하지 않도록 모아두는 곳입니다.

### 주요 특징

- **빠른 검색**: 내장된 검색 기능으로 원하는 내용을 빠르게 찾을 수 있습니다
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 환경에서 최적화된 경험을 제공합니다
- **다크 모드**: 눈에 편한 다크 테마를 지원합니다
- **GitHub Pages**: GitHub Actions를 통해 자동으로 배포됩니다

## Getting started

### 구조

이 사이트는 다음과 같은 구조로 구성되어 있습니다:

```
blog/
├── _config.yml          # Jekyll 설정
├── Gemfile              # Ruby 의존성
├── index.md             # 홈페이지
├── docs/               # 문서들
│   ├── guides/         # 가이드
│   └── tutorials/      # 튜토리얼
└── assets/             # 이미지, CSS 등
```

### 로컬 개발

1. 저장소를 클론합니다:
   ```bash
   git clone https://github.com/minhopark1271/minhopark1271.github.io.git
   cd minhopark1271.github.io
   ```

2. 의존성을 설치합니다:
   ```bash
   bundle install
   ```

3. 로컬 서버를 시작합니다:
   ```bash
   bundle exec jekyll serve
   ```

4. [http://localhost:4000](http://localhost:4000)에서 확인합니다.
