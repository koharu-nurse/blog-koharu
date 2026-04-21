# 看護師ママこはるの家計管理ブログ

看護師ママ・3児の母である「こはる」の家計管理ブログを [Astro](https://astro.build/) で構築し、[Cloudflare Pages](https://pages.cloudflare.com/) にデプロイするためのプロジェクトです。

- 本番URL（予定）：<https://koharu-nurse.com>
- 仮公開URL：<https://blog-koharu-4xx.pages.dev>

## 🚀 開発コマンド

プロジェクトルート（`blog-koharu/`）で実行します。

| コマンド | 内容 |
| :--- | :--- |
| `npm install` | 依存パッケージをインストール |
| `npm run dev` | ローカル開発サーバー起動（<http://localhost:4321>） |
| `npm run build` | `dist/` に本番ビルドを出力 |
| `npm run preview` | ビルド結果をローカルで確認 |
| `npm run wp-import <xmlパス>` | WordPress書き出しXMLをMarkdownに変換 |

## 📁 ディレクトリ構成

```
blog-koharu/
├── public/          # ads.txt / robots.txt / _redirects / _headers / og-default.svg など
├── scripts/         # WordPress → Markdown 変換スクリプト
├── src/
│   ├── components/  # Header・Footer・BaseHead など共通パーツ
│   ├── content/     # 記事本体（Markdown / MDX）
│   ├── layouts/     # 記事レイアウト
│   ├── pages/       # トップ・ブログ一覧・プロフィール・問い合わせ など
│   ├── styles/      # グローバルCSS
│   └── consts.ts    # サイト名・プロフィール・カテゴリ・計測ID
├── astro.config.mjs
└── wrangler.toml
```

## 🎨 デザイン方針

- カラーパレット：ベージュ（`#faf0ec`）× くすみピンク（`#d4a5a5`）
- フォント：本文 `Noto Sans JP` / 見出し `Zen Maru Gothic`
- やわらかい雰囲気で、看護師ママ層を意識した読みやすさ重視

## 📊 計測タグの扱い

`src/components/BaseHead.astro` で、**本番ドメイン（`koharu-nurse.com`）でのみ** Google Analytics 4 / Google Tag Manager を発火させています。
仮URL（`*.pages.dev`）ではタグが動かないので、プレビュー確認時のアクセスが計測に混ざりません。

## 🚢 デプロイ

現在は手動でZIPアップロードする運用です。

```bash
npm run build
cd dist && zip -r ../../dist.zip . -x ".DS_Store" && cd ..
```

生成された `dist.zip` を Cloudflare ダッシュボードの `Workers & Pages → blog-koharu → Create deployment` からアップロードします。

> GitHub連携による自動デプロイは、今後 API Token 方式で設定予定です。

## 🌷 運営者

- こはる（現役看護師・3児の母）
- お問い合わせ：<koharu.nurse.info@gmail.com>
