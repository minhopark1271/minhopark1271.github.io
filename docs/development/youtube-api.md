---
title: Youtube API
parent: 개발
nav_order: 13
description: "YouTube API 인증 설정 가이드. Google Cloud Console에서 OAuth 2.0 발급, consent screen 설정, youtube.readonly 스코프 추가 방법."
---

# Youtube API
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

--- 

## Link

- [Youtube API docs](https://developers.google.com/youtube/v3/docs?hl=ko)


---

## 인증

- [Youtube API Docs - 인증](https://developers.google.com/youtube/registering_an_application)
- [Google Cloud Console - Auth](https://console.cloud.google.com/auth)

### 1. API Console Credintial Page에서 인증키 발급

- [Google API Console - Credential](https://console.cloud.google.com/apis/credentials)
- OAuth 2.0 사용자 인증 정보가 포함된 JSON 다운로드 - 토큰 발행시 사용
- OAuth consent screen - Clients에 사용자 추가된 것 확인

### 2. OAuth consent screen

- Data Access 메뉴
- Add or remove scopes
- `.../auth/youtube.readonly` 스콥 추가
- Save

### 3. 테스트 사용자 추가

- Audience 메뉴
- Add users
- google 계정 이메일 입력
