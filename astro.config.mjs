// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// 배포 후 실제 도메인으로 교체하세요. (사이트맵/OG 카드의 절대 URL에 사용됩니다.)
// 예: 'https://ue-wiki.pages.dev' 또는 커스텀 도메인.
const SITE_URL = 'https://unreal-wiki.pages.dev';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [
    starlight({
      title: 'Unreal Wiki',
      // 단일 한국어 사이트: /ko/ 접두사 없이 루트가 한국어가 되도록 설정.
      defaultLocale: 'root',
      locales: {
        root: { label: '한국어', lang: 'ko' },
      },
      // 한국어 웹폰트(Pretendard) — 빌드 타임 fetch 없이 <head>에서 로드.
      head: [
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' } },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css',
          },
        },
      ],
      customCss: ['./src/styles/custom.css'],
      // 좌측 사이드바 = 정보구조(IA)의 번호 섹션 00~90과 1:1.
      // 폴더명은 깔끔한 슬러그(URL용), 라벨에만 번호를 붙여 정렬·멘탈모델을 유지.
      sidebar: [
        { label: '00 · 시작하기', items: [{ autogenerate: { directory: 'start' } }] },
        { label: '10 · 게임으로 배우는 C++ 기초', items: [{ autogenerate: { directory: 'cpp-course' } }] },
        { label: '20 · 게임플레이 시스템', items: [{ autogenerate: { directory: 'gameplay-systems' } }] },
        { label: '30 · 블루프린트 & C++ 연동', items: [{ autogenerate: { directory: 'blueprint-interop' } }] },
        { label: '40 · 렌더링 & 그래픽스', items: [{ autogenerate: { directory: 'rendering' } }] },
        { label: '50 · 네트워킹 & 멀티플레이', items: [{ autogenerate: { directory: 'networking' } }] },
        { label: '60 · 툴 & 워크플로우', items: [{ autogenerate: { directory: 'tools-workflow' } }] },
        { label: '70 · 문제 해결 & FAQ', items: [{ autogenerate: { directory: 'troubleshooting' } }] },
        { label: '80 · 스니펫 & 레시피', items: [{ autogenerate: { directory: 'snippets' } }] },
        { label: '90 · 위키 정보 (메타)', items: [{ autogenerate: { directory: 'meta' } }] },
      ],
    }),
  ],
});
