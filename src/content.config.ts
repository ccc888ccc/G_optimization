import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 三維度分類（交接檔第 3 節）。
const DOMAINS = [
  'foundations',
  'lp',
  'ip',
  'nlp',
  'sp',
  'sip',
  'dp',
  'decomposition',
  'tools',
] as const;

const TYPES = ['concept', 'method', 'proof', 'application', 'guide', 'qa'] as const;

const PATHS = ['undergrad', 'grad', 'review'] as const;

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    domain: z.enum(DOMAINS),
    type: z.array(z.enum(TYPES)).min(1),
    tags: z.array(z.string()).default([]),
    paths: z.array(z.enum(PATHS)).default([]),
    order: z.number(),
    hasProof: z.boolean().default(false),
    hasInteractive: z.boolean().default(false),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    description: z.string(),
    /** 上/下篇導覽用（同領域內按 order 排序時亦可留空自動推導，先手動指定較穩）。 */
    prevSlug: z.string().optional(),
    nextSlug: z.string().optional(),
    /** 延伸閱讀：關聯文章的 slug 清單。 */
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { articles };
