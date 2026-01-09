---
title: Git Submodule
parent: 개발
nav_order: 6
description: "- 공용 코드 재사용 - 버전 고정이 필요한 서브 프로젝트 - 여러 저장소를 하나의 상위 저장소에서 통합 관리"
---

# Git Submodule
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 필요한 경우

- 공용 코드 재사용
- 버전 고정이 필요한 서브 프로젝트
- 여러 저장소를 하나의 상위 저장소에서 통합 관리

git project안에 다른 git project를 넣으면  
상위 저장소가 하위 저장소의 .git을 추적하지 않음.

---

## 초기화

```
# 서브모듈 추가
git submodule add https://github.com/example/sub-proj.git sub-proj

# 서브모듈 초기화 및 클론
git submodule init
git submodule update

# 최신 버전으로 업데이트
cd sub-proj
git pull
cd ..
git add sub-proj
git commit -m "Update submodule to latest"
```

---

## 수정 및 푸시 절차

### 하위 저장소 수정사항 푸시

```
# 하위 저장소로 이동
cd path/to/submodule

# 변경사항 확인 및 커밋
git status
git add .
git commit -m "Fix bug or update feature in submodule"

# 하위 저장소 원격으로 푸시
git push
```

### 상위 저장소 업데이트

상위 저장소가 submodule의 어떤 커밋을 가리키는가를 업데이트해야함.

```
# 상위 저장소로 돌아오기
cd ..

# submodule이 새로운 커밋을 가리키도록 표시됨
git status

# 새로운 submodule 커밋을 상위 repo에 반영
git commit -m "Update submodule to latest commit"
git push
```

---

## 상위 저장소 클론 받을 때 서브모듈 초기화

### 새로 클론할 때

```
git clone --recurse-submodules <url>
```

### 이미 클론한 레포

```
git submodule update --init --recursive
```

---

## 원격 변경사항 반영

```
git submodule init
git submodule update --remote
```

혹시 비장이 아플 떄는

```
git submodule deinit -f .
git submodule update —init
```