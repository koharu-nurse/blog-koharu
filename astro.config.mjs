// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://koharu-nurse.com',
	integrations: [mdx(), sitemap()],
	fonts: [
		{
			// 本文用：Noto Sans JPでやわらかい明るさを保つ
			provider: fontProviders.google(),
			name: 'Noto Sans JP',
			cssVariable: '--font-body',
			fallbacks: ['sans-serif'],
			weights: [400, 500, 700],
			styles: ['normal'],
			subsets: ['japanese', 'latin'],
		},
		{
			// 見出し用：STEEN風の細めセリフでエディトリアル感
			provider: fontProviders.google(),
			name: 'Noto Serif JP',
			cssVariable: '--font-heading',
			fallbacks: ['serif'],
			weights: [400, 500, 700],
			styles: ['normal'],
			subsets: ['japanese', 'latin'],
		},
		{
			// 英字見出し・アウトライン用：太めサンセリフ
			provider: fontProviders.google(),
			name: 'Jost',
			cssVariable: '--font-display',
			fallbacks: ['sans-serif'],
			weights: [400, 500, 700],
			styles: ['normal'],
			subsets: ['latin'],
		},
	],
});
