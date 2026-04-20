import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// src/content/blog/ 配下のMarkdown/MDXを記事として読み込む
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			// カテゴリ（CATEGORIESキーに対応）。未指定はlife扱い
			category: z.string().default('life'),
			// タグ（任意）
			tags: z.array(z.string()).default([]),
			// 下書きフラグ（trueだと公開しない）
			draft: z.boolean().default(false),
		}),
});

export const collections = { blog };
