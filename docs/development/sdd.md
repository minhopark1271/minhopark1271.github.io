---
title: SDD (Spec Kit)
parent: 개발
nav_order: 3
---

# SDD(Spec Driven Development)
{:.no_toc}

[Spec Kit - GitHub](https://github.com/github/spec-kit)

[SDD with AI - GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
[speckit comprehensive guide](https://github.com/github/spec-kit/blob/main/spec-driven.md)
[video overview](https://www.youtube.com/watch?v=a9eR1xsfvHg)


## 목차
{:.no_toc}

1. TOC
{:toc}

--- 

## Spec kit 탐구

1. 설치

```
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

2. 프로젝트 초기화

```
specify init <PROJECT_NAME>
specify check
```

3. 커서로 project principles 작성

```
/speckit.constitution Create principles focused on code quality, testing standards, user experience consistency, and performance requirements
```

여기까지 했는데 speckit.constitution에서 이미 압도당했을 뿐이고...

가이드랑 video overview 보면서 따라가보자

---
---
---

4. 커서로 스펙 작성

What and Why 에 집중해서 기능적 스펙 작성

```
/speckit.specify Build an application that can help me organize my photos in separate photo albums. Albums are grouped by date and can be re-organized by dragging and dropping on the main page. Albums are never in other nested albums. Within each album, photos are previewed in a tile-like interface.
```

5. 커서로 technical implementation plan 작성

Tech Stack and Architecture 명시

```
/speckit.plan The application uses Vite with minimal number of libraries. Use vanilla HTML, CSS, and JavaScript as much as possible. Images are not uploaded anywhere and metadata is stored in a local SQLite database.
```

6. 커서로 작업을 task 단위로 나누기

```
/speckit.tasks
```

7. 구현

```
/speckit.implement
```
