// サイト全体で使う定数

// 本番ドメイン（このドメインのときだけ計測タグを発火させる）
export const PRODUCTION_HOSTNAME = 'koharu-nurse.com';

// Google Analytics 4 / Google Tag Manager の計測ID（旧WordPressから引き継ぎ）
export const GA4_MEASUREMENT_ID = 'G-JW5QDJ093G';
export const GTM_CONTAINER_ID = 'GT-NB9VCPZH';

// Google AdSense Publisher ID（ads.txt と同じ値）
export const ADSENSE_PUBLISHER_ID = 'pub-7347574472696539';

export const SITE_TITLE = '看護師ママこはるの家計管理ブログ';
export const SITE_TITLE_SHORT = 'こはるの家計管理ブログ';
export const SITE_TAGLINE = '看護師ママ・3児の母';
export const SITE_DESCRIPTION =
	'3児のママで現役看護師のこはるが、資産2000万円達成までの家計管理・つみたてNISA・固定費見直しの実体験を、やさしい言葉でお届けします。';
export const SITE_AUTHOR = 'こはる';

// プロフィール
export const PROFILE = {
	name: 'こはる',
	role: 'NURSE・MAMA・BLOGGER',
	bio: '3児のママで現役看護師。夫のブラック企業退職をきっかけに家計を見直し、コツコツ積み立てで資産2000万円を達成。「がんばりすぎない家計管理」を発信中。',
	stats: [
		{ value: '3児', label: 'の母' },
		{ value: '2000万', label: '資産達成' },
		{ value: '看護師', label: '現役' },
	],
};

// ナビゲーション
export const NAV_ITEMS = [
	{ label: 'ホーム', href: '/' },
	{ label: '暮らし・家計', href: '/category/household/' },
	{ label: '看護師の経験', href: '/category/nurse/' },
	{ label: '子育て', href: '/category/parenting/' },
	{ label: 'プロフィール', href: '/about/' },
	{ label: '🔍 検索', href: '/search/' },
];

// カテゴリ → 表示名・絵文字・ブロブ背景色・英字ラベル・イラストパス
// blobColor はSTEEN風ブロブ背景に使う色。イラストが背景と同色で溶けないための区別色
// illustration が未指定のカテゴリは絵文字でフォールバック表示される
export const CATEGORIES: Record<
	string,
	{ label: string; emoji: string; blobColor: string; en: string; illustration?: string }
> = {
	household: { label: '家計管理', emoji: '💰', blobColor: '#d4c4a0', en: 'HOUSEHOLD', illustration: '/illustrations/household.png' },
	nisa: { label: '投資', emoji: '📈', blobColor: '#b8c4a8', en: 'NISA', illustration: '/illustrations/nisa.png' },
	'fixed-cost': { label: '固定費見直し', emoji: '📱', blobColor: '#c9b896', en: 'FIXED COST', illustration: '/illustrations/fixed-cost.png' },
	furusato: { label: 'ふるさと納税', emoji: '🎁', blobColor: '#d6a687', en: 'FURUSATO', illustration: '/illustrations/furusato.png' },
	parenting: { label: '子育て', emoji: '👶', blobColor: '#c4b5a0', en: 'PARENTING', illustration: '/illustrations/parenting.png' },
	life: { label: '暮らし', emoji: '💡', blobColor: '#a8b5b8', en: 'LIFE', illustration: '/illustrations/life.png' },
	nurse: { label: '看護師', emoji: '👩‍⚕️', blobColor: '#d4a99e', en: 'NURSE', illustration: '/illustrations/nurse.png' },
};

// プロフィール用アバター画像（看護師キャラ）
export const AVATAR_ILLUSTRATION = '/illustrations/avatar.png';
