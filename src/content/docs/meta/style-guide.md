---
title: 스타일 가이드
description: 위키 작성 규칙 — 네이밍, 폴더 구조, 링크, 태그, 코드/이미지, 한국어 표기.
section: "90"
type: reference
status: stable
tags: ["meta"]
sidebar:
  order: 2
---

일관성은 1인 운영 위키의 유지보수성을 좌우합니다. 아래 규칙을 따르세요.

## 네이밍 & 폴더

- 파일명은 **kebab-case ASCII 슬러그** (제목이 한국어여도): `character-class.md`.
- 코스 레슨은 번호를 접두사로: `10.03-character-class.md` (정렬·식별 용이).
- 폴더는 섹션과 1:1. 이미지는 섹션 폴더 안 `_img/`에 둔다(섹션을 옮기면 이미지도 함께 따라감).

## 한 개념 = 한 페이지

- 같은 개념이 두 섹션에 필요하면, 가장 "레퍼런스다운" 곳에 두고 다른 쪽은 **링크**한다.
- 페이지 간 복붙 금지. 중복은 위키 유지보수성의 1순위 킬러.

## 링크

- 내부 링크는 **슬러그 기준**(경로/제목 기준 X) → 폴더를 옮겨도 깨지지 않게.
- "위에서 본 것처럼" 같은 **페이지 간 의존 표현 금지**. 링크로 공유되어 단독으로 읽혀야 한다.

## 태그

- [태그 어휘](/meta/tags/)의 **닫힌 목록**만 사용. 임의 태그 금지.
- 태그 가족: 난이도(`beginner`/`intermediate`/`advanced`) · 서브시스템(`gas`/`umg`/...) ·
  종류(`crash`/`compile-error`/`recipe`) · 언어(`cpp`/`blueprint`).

## 코드 표기

- 모든 C++ 블록은 언어 + **파일명 제목**을 표기: ` ```cpp title="MyCharacter.h" `.
- **헤더(.h) 먼저, 구현(.cpp) 나중.** 한 블록에 .h/.cpp를 섞지 않는다.
- 처음 소개 시 **전체 파일**, 이후 수정 시 **바뀐 줄만** 강조: ` ```cpp {4-7} `.
- 기존 파일 수정은 diff 마커(`ins`/`del`)로 무엇이 바뀌었는지 보여준다.
- 줄 번호로 본문에서 코드를 지칭하지 말 것("42번째 줄" X → "`BeginPlay()`에서" O). 줄 번호는 밀린다.
- 긴 파일은 보일러플레이트(include, `GENERATED_BODY`)를 `<details>`로 접는다.
- API 식별자·매크로·메뉴 경로는 **원문 영어**로: `UPROPERTY`, `Edit > Project Settings`.

## 이미지 / 영상

- 스크린샷은 **WebP**, 에디터 녹화는 무거운 GIF 대신 짧은 **MP4/WebM**.
- 모든 이미지에 **한국어 alt 텍스트**. 파일명은 `10.03-add-component-01.webp`처럼 레슨+순번.

## 버전 표기

- 페이지 frontmatter의 `ue_version`/`ue_verified`로 버전 배너를 단다.
- 버전별로 동작이 다르면 코드 **바로 옆**에 admonition: `:::note[UE 5.3 이하]` / `:::tip[UE 5.4+]`.

## 페이지네이션(이전/다음)

- **코스(10)** 페이지는 prev/next를 유지한다(순차).
- **레퍼런스(20~80)** 페이지는 frontmatter에 `prev: false`, `next: false`를 두어 끈다(비순차 탐색).
