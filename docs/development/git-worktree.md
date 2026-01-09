---
title: Git Worktree
parent: 개발
nav_order: 5
description: "` project/.git/ project/                 (main branch) project-feature/         (feature branch) `"
---

# Git Worktree
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## Git Worktree 개념

### 다른 디렉토리에 다른 브랜치로 checkout  

```
project/.git/
project/                 (main branch)
project-feature/         (feature branch)
```

같은 .git 저장소를 공유하지만  
각 디렉토리는 서로 다른 브랜치를 가리킴

### 주요 명령어

```
# 현재 연결된 worktree 목록 확인
git worktree list

# 새로운 worktree 디렉터리 생성 및 브랜치 checkout
git worktree add ../newdir branch_name

# 해당 worktree 제거
git worktree remove ../newdir

# 삭제된 worktree 정보 정리
git worktree prune
```

### 특징

- 로컬에 clone 받아서 다른 브랜치를 편집하는 것과 같은 효과
- 로컬 repo 하나만 유지한 채로 clone을 여러번 한 것 같은 효과 - 여러 브랜치 동시에 유지 가능
- .git 폴더는 루트 repo에만 존재하고, worktree 쪽은 .git 파일(포인터)만 있음.
- worktree를 수동으로 삭제하면 git worktree prune으로 정리 필요.

--- 

## Git Worktree 사용 시나리오

핫픽스(hotfix) 브랜치를 급하게 고쳐야 할 때

상황
- 현재 main 브랜치에서 새 기능을 개발 중입니다.
- 그런데 배포된 버전에서 긴급한 버그가 발생했습니다.
- main은 아직 불안정해서 바로 배포할 수 없습니다.

이럴 때 보통은 stash 하거나, checkout 해서 main → hotfix로 이동하고, 다시 돌아와야 하죠.  
번거롭고, 실수로 코드가 섞일 위험이 있습니다.


### 해결: git worktree 사용

1. 현재 작업 확인

```bash
$ git branch
* main
  develop
```

지금 main에서 작업 중이에요.

2. 새로운 워크트리 생성

```bash
git worktree add ../hotfix-branch hotfix/login-bug
```

- ../hotfix-branch: 새로운 폴더 경로
- hotfix/login-bug: 새로 만들거나 기존 브랜치를 checkout (없으면 자동으로 새 브랜치를 만듭니다.)

이 때 디렉토리 구조

```
project/                 (main branch)
project/.git/
hotfix-branch/           (hotfix/login-bug branch)
```

3. 새 워크트리에서 버그 수정

```bash
cd ../hotfix-branch
# 코드 수정
git add .
git commit -m "Fix: login crash on null token"
git push origin hotfix/login-bug
```

버그 수정 구현 후 머지

4. 기존 작업으로 복귀 및 워크트리 정리

```bash
cd ../project

git worktree remove ../hotfix-branch
git worktree prune
```
