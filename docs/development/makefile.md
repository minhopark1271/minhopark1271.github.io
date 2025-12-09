---
title: Makefile
parent: 개발
nav_order: 16
---

# Makefile
{:.no_toc}

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## makefile이 뭔지 (shell과 뭐가 다른가)

Makefile은 `make` 프로그램이 읽어서 **빌드와 자동화 작업을 수행하기 위해 작성되는 규칙 기반 설정 파일**이다.  
일반적인 쉘 스크립트가 “명령을 순서대로 실행하는 절차적 구조”라면, Makefile은 **파일 간 의존성(Dependency)에 따라 필요한 작업만 실행하는 선언적 빌드 시스템**이라는 점이 핵심적인 차이이다.

### Makefile의 특징
- **타겟(target)**: 만들고자 하는 결과물 (예: 실행 파일, 라이브러리, 작업 이름 등)
- **의존성(dependencies)**: 타겟을 만들기 위해 필요한 파일 목록
- **명령(command)**: 타겟을 빌드할 때 실제 실행되는 쉘 명령
- **증분 빌드(incremental build)** 지원 → 변경된 파일만 다시 컴파일
- **병렬 빌드(`make -j`)** 지원
- 오픈소스 생태계에서 표준적인 빌드 인터페이스 제공 (`make`, `make clean`, `make install` 등)

### Shell 스크립트와의 차이점
- Shell은 작업 순서를 직접 기술하는 **절차적 스크립트**
- Makefile은 파일 변경 여부를 기반으로 **필요한 부분만 자동으로 실행**
- 병렬 처리, 규칙 패턴, 자동 변수 등 **빌드 최적화 기능 내장**

---

## GNU 와 배경

**GNU(GNU’s Not Unix)**는 1983년 리처드 스톨만이 시작한 **자유 소프트웨어 운영체제 프로젝트**로,  
"Unix와 비슷하지만 누구나 자유롭게 사용할 수 있는 OS"를 만드는 것이 목표였다.

### GNU의 핵심 철학 (Free Software)
사용자에게 다음의 네 가지 자유를 보장해야 한다고 정의한다.
1. 프로그램을 어떤 목적으로든 사용할 자유  
2. 소스 코드를 읽고 이해할 자유  
3. 수정할 자유  
4. 수정본 및 원본을 다시 배포할 자유  

이를 실현하기 위해 GNU는 **GPL(GNU General Public License)**라는 라이선스를 만들었다.

### GNU가 만든 주요 구성 요소
- **GCC**: 컴파일러 모음
- **GDB**: 디버거
- **GNU Make**: Make의 구현체
- **glibc**: C 표준 라이브러리
- **bash**: 셸
- **coreutils**: ls, cp, rm 같은 기본 유틸리티들

GNU는 운영체제 대부분을 완성했지만 커널이 부족했고, 이후 **Linux 커널**이 등장하여  
GNU 도구들과 결합해 현재의 **GNU/Linux** 시스템이 널리 사용되었다.

---

## makefile 예시

아래는 간단한 C 프로젝트를 위한 Makefile 예시이다.

```makefile
CC      = gcc
CFLAGS  = -Wall -O2

TARGET  = app

SRCS    = main.c utils.c
OBJS    = $(SRCS:.c=.o)

$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) $(OBJS) -o $(TARGET)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

.PHONY: clean
clean:
	rm -f $(OBJS) $(TARGET)
```