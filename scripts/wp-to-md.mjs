#!/usr/bin/env node
/**
 * WordPress → Astro Markdown 変換スクリプト
 *
 * 使い方:
 *   1. WordPress管理画面の「ツール → エクスポート」で全記事のXML(WXR)を書き出す
 *   2. 書き出したXMLファイルをこのプロジェクトに置く
 *   3. 以下を実行:
 *      node scripts/wp-to-md.mjs <WXRファイルパス>
 *
 *   例：node scripts/wp-to-md.mjs ../wordpress-export.xml
 *
 * 出力先: src/content/blog/<slug>.md
 *   （既に同名ファイルがある場合はスキップ。既存記事は手動で確認してね）
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import TurndownService from 'turndown';
import { XMLParser } from 'fast-xml-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const OUTPUT_DIR = join(PROJECT_ROOT, 'src/content/blog');

// カテゴリslug → consts.tsのキーへのマッピング
// WordPress側のカテゴリslugに合わせて適宜書き換える
const CATEGORY_MAP = {
	'household': 'household',
	'kakei': 'household',
	'kakei-kanri': 'household',
	'nisa': 'nisa',
	'tsumitate-nisa': 'nisa',
	'investment': 'nisa',
	'fixed-cost': 'fixed-cost',
	'koteihi': 'fixed-cost',
	'furusato': 'furusato',
	'furusato-nouzei': 'furusato',
	'parenting': 'parenting',
	'kosodate': 'parenting',
	'life': 'life',
	'kurashi': 'life',
	'nurse': 'nurse',
	'kango': 'nurse',
};

const args = process.argv.slice(2);
if (args.length === 0) {
	console.error('使い方: node scripts/wp-to-md.mjs <WXRファイルパス>');
	process.exit(1);
}

const wxrPath = resolve(args[0]);
if (!existsSync(wxrPath)) {
	console.error(`ファイルが見つかりません: ${wxrPath}`);
	process.exit(1);
}

console.log(`📥 読込: ${wxrPath}`);
const xml = readFileSync(wxrPath, 'utf-8');

// XMLパース（WordPressのWXR形式は名前空間付きなので注意）
const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: '@_',
	cdataPropName: '__cdata',
	parseTagValue: false,
	trimValues: true,
});
const data = parser.parse(xml);

const items = data?.rss?.channel?.item ?? [];
const itemArray = Array.isArray(items) ? items : [items];

// HTML → Markdown 変換器
const turndown = new TurndownService({
	headingStyle: 'atx',         // ## のスタイル
	bulletListMarker: '-',
	codeBlockStyle: 'fenced',
	emDelimiter: '*',
	strongDelimiter: '**',
});

// WordPress固有のショートコード等を除去するルール
turndown.addRule('removeWPShortcodes', {
	filter: (node) => node.nodeType === 3 && /\[\/?[a-zA-Z_]+/.test(node.nodeValue ?? ''),
	replacement: (content) => content.replace(/\[\/?[^\]]+\]/g, ''),
});

mkdirSync(OUTPUT_DIR, { recursive: true });

let postCount = 0;
let skipCount = 0;
let draftCount = 0;

for (const item of itemArray) {
	const postType = item['wp:post_type']?.__cdata ?? item['wp:post_type'] ?? '';
	if (postType !== 'post') continue;

	const status = item['wp:status']?.__cdata ?? item['wp:status'] ?? '';
	const isPublished = status === 'publish';
	const isDraft = status === 'draft' || status === 'pending';
	if (!isPublished && !isDraft) continue;

	const title = (item.title?.__cdata ?? item.title ?? '無題').toString().trim();
	const slug = (item['wp:post_name']?.__cdata ?? item['wp:post_name'] ?? '')
		.toString().trim() || `post-${item['wp:post_id']}`;
	const pubDateStr = item['wp:post_date']?.__cdata ?? item['wp:post_date'] ?? '';
	const pubDate = pubDateStr ? new Date(pubDateStr.replace(' ', 'T') + '+09:00') : new Date();
	const contentHtml = item['content:encoded']?.__cdata ?? item['content:encoded'] ?? '';
	const excerpt = item['excerpt:encoded']?.__cdata ?? item['excerpt:encoded'] ?? '';

	// カテゴリ抽出（最初の1つだけ採用）
	let category = 'life';
	const categories = item.category;
	if (categories) {
		const catArray = Array.isArray(categories) ? categories : [categories];
		for (const c of catArray) {
			if (c['@_domain'] === 'category') {
				const slug = c['@_nicename'];
				if (CATEGORY_MAP[slug]) {
					category = CATEGORY_MAP[slug];
					break;
				}
			}
		}
	}

	// タグ抽出
	const tags = [];
	if (categories) {
		const catArray = Array.isArray(categories) ? categories : [categories];
		for (const c of catArray) {
			if (c['@_domain'] === 'post_tag') {
				const tagName = c.__cdata ?? c['#text'] ?? '';
				if (tagName) tags.push(tagName);
			}
		}
	}

	// HTML → Markdown 変換
	const markdown = turndown.turndown(contentHtml.toString());

	// description（excerptが空ならtitle）
	const description = (excerpt || title).toString().trim().slice(0, 150);

	// frontmatter組み立て
	const frontmatter = [
		'---',
		`title: ${JSON.stringify(title)}`,
		`description: ${JSON.stringify(description)}`,
		`pubDate: ${pubDate.toISOString().slice(0, 10)}`,
		`category: ${category}`,
		tags.length > 0 ? `tags: [${tags.map((t) => JSON.stringify(t)).join(', ')}]` : 'tags: []',
		isDraft ? 'draft: true' : null,
		'---',
		'',
	].filter(Boolean).join('\n');

	const outPath = join(OUTPUT_DIR, `${slug}.md`);
	if (existsSync(outPath)) {
		console.log(`⏭️  スキップ（既存）: ${slug}.md`);
		skipCount++;
		continue;
	}

	writeFileSync(outPath, frontmatter + markdown + '\n', 'utf-8');
	if (isDraft) {
		console.log(`📝 下書き保存: ${slug}.md`);
		draftCount++;
	} else {
		console.log(`✅ 保存: ${slug}.md`);
		postCount++;
	}
}

console.log('');
console.log(`📊 結果`);
console.log(`   公開記事: ${postCount}件`);
console.log(`   下書き　: ${draftCount}件`);
console.log(`   スキップ: ${skipCount}件（同名ファイル既存）`);
console.log('');
console.log(`出力先: ${OUTPUT_DIR}`);
console.log(`次のステップ: npm run dev でローカル確認 → 必要に応じて記事を整理`);
