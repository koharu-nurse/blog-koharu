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
			provider: fontProviders.google(),
			name: 'Zen Maru Gothic',
			cssVariable: '--font-heading',
			fallbacks: ['sans-serif'],
			weights: [500, 700],
			styles: ['normal'],
			subsets: ['japanese', 'latin'],
		},
	],
});
