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
			provider: fontProviders.google(),
			name: 'Noto Sans JP',
			cssVariable: '--font-body',
			fallbacks: ['sans-serif'],
			weights: [400, 500, 700],
			styles: ['normal'],
			subsets: ['japanese', 'latin'],
		},
		{
			// 本文中の見出し用：丸ゴシックで柔らかく
			provider: fontProviders.google(),
			name: 'Zen Maru Gothic',
			cssVariable: '--font-heading',
			fallbacks: ['sans-serif'],
			weights: [500, 700],
			styles: ['normal'],
			subsets: ['japanese', 'latin'],
		},
		{
			// ブランド・セクションタイトル用：手書きペン風で温かみを出す
			provider: fontProviders.google(),
			name: 'Klee One',
			cssVariable: '--font-display',
			fallbacks: ['serif'],
			weights: [400, 600],
			styles: ['normal'],
			subsets: ['japanese', 'latin'],
		},
	],
});
