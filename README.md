# Unreal Wiki

링크만 있으면 누구나 볼 수 있는 **언리얼 엔진 한국어 지식 베이스**.
게임을 만들며 배우는 C++ 기초부터 시작하고, 점차 레퍼런스 위키로 확장합니다.

- **생성기**: [Astro Starlight](https://starlight.astro.build/)
- **콘텐츠**: `src/content/docs/` 의 마크다운(.md/.mdx)
- **배포(예정)**: Cloudflare Pages (정적, 무료, 로그인 없이 공개)

## 로컬에서 실행

```bash
npm install        # 최초 1회 (의존성 설치)
npm run dev        # http://localhost:4321
npm run build      # 정적 사이트 생성 → ./dist
npm run preview    # 빌드 결과 미리보기
```

> Node.js LTS(또는 v20+) 필요. Windows/PowerShell 기준 동일.

## 정보 구조 (IA)

좌측 사이드바 = 번호 섹션 00~90. 폴더명은 깔끔한 슬러그, 라벨에만 번호를 붙여 정렬합니다.

| URL 폴더 | 섹션 | 성격 |
| --- | --- | --- |
| `start` | 00 시작하기 | 온보딩 |
| `cpp-course` | 10 C++ 코스 | 순차 코스 (Arena Survivor) |
| `gameplay-systems` | 20 게임플레이 | 레퍼런스 |
| `blueprint-interop` | 30 BP 연동 | 레퍼런스 |
| `rendering` | 40 렌더링 | 레퍼런스 |
| `networking` | 50 네트워킹 | 레퍼런스 |
| `tools-workflow` | 60 툴/워크플로우 | 레퍼런스 |
| `troubleshooting` | 70 문제 해결 | 레퍼런스 |
| `snippets` | 80 스니펫 | 레시피 |
| `meta` | 90 메타 | 운영 문서 |

## 새 페이지 작성

`src/content/docs/meta/_template.md`를 복사 → frontmatter 채우기 → 파일명을 슬러그로.
규칙은 사이트의 **90 · 메타 > 스타일 가이드 / 페이지 템플릿** 참고.

## 배포 (Cloudflare Pages · 직접 업로드)

현재 라이브: **https://unreal-wiki.pages.dev** (공개, 로그인 불필요).
Wrangler 직접 업로드 방식으로 배포합니다.

최초 1회만:

```bash
npx wrangler login    # 브라우저에서 Cloudflare 로그인
```

이후 업데이트할 때마다 (빌드 + 배포 한 번에):

```bash
npm run deploy
```

### (선택) GitHub 연동 자동 배포로 전환

Cloudflare 대시보드 → **Workers & Pages → Pages → Connect to Git** 로 저장소를 연결하면
`git push` 시 자동 배포됩니다. (Framework preset: **Astro** / Build: `npm run build` / Output: `dist`)

### (선택) 커스텀 도메인

프로젝트 → Custom domains에서 연결(무료 SSL 자동) 후 `astro.config.mjs`의 `SITE_URL`을 그 도메인으로 교체.
