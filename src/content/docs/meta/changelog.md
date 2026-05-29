---
title: 변경 이력
description: 위키 단위의 추가/개편 기록. 페이지별 updated와 별개로, 돌아온 독자가 무엇이 새로운지 본다.
section: "90"
type: reference
status: stable
tags: ["meta"]
sidebar:
  order: 6
---

페이지별 `updated`와 별개로, **위키 전체에서 무엇이 추가·개편되었는지**를 시간순으로 적습니다.

## 2026-05-30

- 기존 HTML 위키 콘텐츠를 Starlight로 이전 시작. **CH 1 · 1-3 에디터 투어** 및 **CH 2 전체(2-1~2-5)** 이전·보강 완료.
- 재사용 컴포넌트 추가: `<DriveVideo>`(구글 드라이브 영상), `<Figure>`(캡션 이미지), `<VectorSimulator>`(2-2 인터랙티브 벡터 시뮬레이터).
- 사이드바를 실제 챕터 구조(CH1/CH2/CH3)로 정리.
- **CH 3 전체(3-1~3-4)** 이전 및 **CH 1의 1-1·1-2** 이전·보강 완료. → 기존 HTML 위키 콘텐츠 이전 완료.
- 신규 작성: **3-5 리플렉션과 가비지 컬렉션**, **[부록] 3-6 라이브 코딩 vs 빌드**, **[부록] 3-7 언리얼 빌드 파이프라인(UHT·UBT)**.

## 2026-05-29

- 위키 초기 골격 구축: Astro Starlight 기반, 정보구조(00~90) 스켈레톤, 페이지 템플릿,
  스타일 가이드, 태그 어휘, 버전 정책 정리.
- C++ 코스(10) 개요 및 Arena Survivor 모듈 로드맵(8개) 작성. 레슨 본문은 추후 추가 예정.
- Cloudflare Pages(직접 업로드)로 첫 배포 — https://unreal-wiki.pages.dev 공개. 갱신은 `npm run deploy`.
