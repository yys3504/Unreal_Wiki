---
title: 페이지 템플릿
description: 모든 콘텐츠 페이지의 frontmatter 필드와 본문 구조. 새 페이지는 _template.md를 복사해 시작한다.
section: "90"
type: reference
status: stable
tags: ["meta"]
sidebar:
  order: 3
---

새 페이지는 `src/content/docs/meta/_template.md`를 복사해 시작하세요. (밑줄로 시작해 라우트가
생성되지 않는 복사용 원본입니다.)

## Frontmatter 필드

```yaml
---
title: "Character 클래스 만들기"      # 페이지 제목 (H1 자동 생성, 본문에 반복 금지)
description: "ACharacter를 상속해 플레이어 폰을 정의한다"  # SEO·소셜카드·검색에 사용
slug: cpp-course/character-class      # (선택) URL 고정용. 폴더를 옮겨도 URL 유지
section: "10"                          # 번호 섹션 id
order: 1003                            # 섹션 내 정렬 키(코스 전용, 1000 간격 → 사이 삽입 가능)
type: lesson                           # lesson | reference | recipe | troubleshooting | index
tags: ["beginner", "actor", "cpp"]     # 닫힌 어휘(meta/tags)에서만
ue_version: "5.6"                      # 작성 기준 UE 버전
ue_verified: "5.6"                     # 마지막으로 재검증한 UE 버전
status: stable                         # draft | stable | needs-update | deprecated
updated: 2026-05-29                    # 마지막 수정/검증 일자
prereqs: ["cpp-course/project-setup"]  # 선행 페이지 slug 목록
# 레퍼런스 페이지는 아래를 추가해 이전/다음을 끈다:
# prev: false
# next: false
---
```

## 본문 구조 (고정 순서)

레슨(type: lesson) 기준 순서입니다. 레퍼런스/레시피/문제해결은 해당 없는 항목을 생략합니다.

1. **버전 콜아웃** — `ue_version`·`updated`로 "UE 5.6 · 마지막 확인 2026-05-29"를 표시. `status: needs-update`면 경고 배너.
2. **이 페이지에서 배우는 것** — 2~3개 불릿. 레슨은 만들 결과물 명시.
3. **선행 지식** — `prereqs`를 링크로 (레슨만).
4. **개념** — 설명. 짧은 문단 + 필요한 다이어그램.
5. **구현** — `.h` 먼저, `.cpp` 나중. 각각 파일명 제목 블록.
6. **결과** — 에디터/게임 화면 스크린샷 또는 영상 (레슨 특히).
7. **자주 겪는 문제** — 함정 불릿. 관련 [70 · 문제 해결](/troubleshooting/) 링크.
8. **정리** — 3~5개 불릿 요약.
9. **연습** — 1~3개 과제, 필요시 `<details>`로 힌트 (레슨만).
10. **더 보기** — 태그/주제별 교차 링크 (이전/다음은 코스에서 자동).

:::note
버전 콜아웃·`status` 배너의 자동 렌더링은 커스텀 컴포넌트로 추후 구현 예정입니다. 그 전까지는
본문 상단에 `:::note[UE 5.6 · 마지막 확인 2026-05-29]` admonition을 수동으로 답니다.
:::
