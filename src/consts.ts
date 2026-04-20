// サイト全体で使う定数
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
];

// カテゴリ → 表示名・絵文字
export const CATEGORIES: Record<string, { label: string; emoji: string }> = {
	household: { label: '家計管理', emoji: '💰' },
	nisa: { label: '投資', emoji: '📈' },
	'fixed-cost': { label: '固定費見直し', emoji: '📱' },
	furusato: { label: 'ふるさと納税', emoji: '🎁' },
	parenting: { label: '子育て', emoji: '👶' },
	life: { label: '暮らし', emoji: '💡' },
	nurse: { label: '看護師', emoji: '👩‍⚕️' },
};
