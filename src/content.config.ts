import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Starlight 기본 스키마(title, description, sidebar, ...)에 위키 전용 frontmatter 필드를 추가한다.
// 이 필드들은 생성기-독립적으로 설계되어 있어, 추후 다른 SSG로 옮겨도 그대로 의미를 유지한다.
export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        // 정보구조 메타
        section: z.string().optional(), // 번호 섹션 id ("00"~"90")
        order: z.number().optional(), // 섹션 내 정렬 키(코스 전용, 1000 간격 권장)
        type: z
          .enum(['lesson', 'reference', 'recipe', 'troubleshooting', 'index'])
          .optional(),
        tags: z.array(z.string()).default([]),
        // 버전 관리 메타 (페이지별 경량 버전 전략)
        ue_version: z.string().optional(), // 작성 기준 UE 버전 (예: "5.6")
        ue_verified: z.string().optional(), // 마지막으로 재검증한 UE 버전
        status: z
          .enum(['draft', 'stable', 'needs-update', 'deprecated'])
          .default('draft'),
        updated: z.coerce.date().optional(), // 마지막 수정/검증 일자 (YAML 날짜 또는 문자열 허용)
        prereqs: z.array(z.string()).default([]), // 선행 페이지 slug 목록
      }),
    }),
  }),
};
