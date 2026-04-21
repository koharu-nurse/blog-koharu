// 記事個別のOGP画像を動的SVGで生成
// /og/<slug>.svg にアクセスすると1200×630のSVG画像を返す
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { CATEGORIES, SITE_TITLE_SHORT, SITE_AUTHOR } from '../../consts';

export async function getStaticPaths() {
	const posts = await getCollection('blog', ({ data }) => !data.draft);
	return posts.map((post) => ({
		params: { slug: post.id },
		props: { post },
	}));
}

// 長いタイトルを折り返す（日本語の区切り文字優先→句読点→連続英数字→強制折り返し）
function wrapTitle(title: string, maxCharsPerLine = 16, maxLines = 3): string[] {
	const lines: string[] = [];
	const BREAK_PREFERRED = /[｜|、。・！？「」『』（）()【】\s]/;
	let buf = '';
	let i = 0;
	while (i < title.length && lines.length < maxLines - 1) {
		buf += title[i];
		i++;
		if (buf.length >= maxCharsPerLine) {
			// maxCharsPerLine を超えたら、直前の優先区切り文字で折り返す
			const breakIdx = (() => {
				for (let j = buf.length - 1; j > maxCharsPerLine / 2; j--) {
					if (BREAK_PREFERRED.test(buf[j])) return j + 1;
				}
				return -1;
			})();
			// 英数字が続いている場合は分断せず、後ろにはみ出しても維持
			const isMidAlphanum =
				/[A-Za-z0-9]/.test(buf[buf.length - 1]) &&
				i < title.length &&
				/[A-Za-z0-9,.]/.test(title[i]);
			if (isMidAlphanum) continue;
			if (breakIdx > 0) {
				lines.push(buf.slice(0, breakIdx).trimEnd());
				buf = buf.slice(breakIdx);
			} else {
				lines.push(buf);
				buf = '';
			}
		}
	}
	// 残り
	const rest = buf + title.slice(i);
	if (rest.length > maxCharsPerLine + 2) {
		lines.push(rest.slice(0, maxCharsPerLine - 1) + '…');
	} else if (rest) {
		lines.push(rest);
	}
	return lines;
}

// XMLエスケープ（タイトルに<>&等があってもSVGが壊れないように）
function escapeXml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const GET: APIRoute = ({ props }) => {
	const { post } = props as { post: Awaited<ReturnType<typeof getCollection>>[number] };
	const category = CATEGORIES[post.data.category] ?? CATEGORIES.life;
	const titleLines = wrapTitle(post.data.title).map(escapeXml);

	// 1行目のY位置を調整（行数が少ないときは下げる）
	const startY = 300 - (titleLines.length - 1) * 36;

	const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
	<defs>
		<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0%" stop-color="#faf0ec" />
			<stop offset="100%" stop-color="#f3e5e1" />
		</linearGradient>
		<linearGradient id="card" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color="#ffffff" />
			<stop offset="100%" stop-color="#fefaf8" />
		</linearGradient>
	</defs>

	<!-- 背景 -->
	<rect width="1200" height="630" fill="url(#bg)" />
	<circle cx="100" cy="100" r="180" fill="#d4a5a533" />
	<circle cx="1100" cy="530" r="220" fill="#ffffff77" />

	<!-- 内側の白いカード -->
	<rect x="60" y="60" width="1080" height="510" rx="32" fill="url(#card)" stroke="#e8d3cd" stroke-width="2" />

	<!-- サイト名 -->
	<text x="100" y="130" font-family="system-ui, sans-serif" font-size="22" fill="#bd8b8b" font-weight="700">🌷 ${escapeXml(SITE_TITLE_SHORT)}</text>

	<!-- カテゴリバッジ -->
	<rect x="100" y="160" width="220" height="46" rx="23" fill="#f3e5e1" />
	<text x="120" y="192" font-family="system-ui, sans-serif" font-size="22" fill="#8b4d4d" font-weight="700">${escapeXml(category.emoji)} ${escapeXml(category.label)}</text>

	<!-- タイトル -->
	${titleLines
		.map(
			(line, i) => `
	<text x="100" y="${startY + i * 72}" font-family="Hiragino Sans, 'Yu Gothic', system-ui, sans-serif" font-size="54" fill="#2d2d2d" font-weight="900">${line}</text>`,
		)
		.join('')}

	<!-- 著者 -->
	<text x="100" y="550" font-family="system-ui, sans-serif" font-size="20" fill="#7a6a6a">by ${escapeXml(SITE_AUTHOR)}（現役看護師・3児ママ）</text>
</svg>`;

	return new Response(svg, {
		headers: {
			'Content-Type': 'image/svg+xml',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
