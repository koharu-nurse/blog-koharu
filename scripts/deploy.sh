#!/usr/bin/env bash
# Cloudflare Pages への本番デプロイ
# 使い方: npm run deploy
# 前提: .env に CLOUDFLARE_API_TOKEN と CLOUDFLARE_ACCOUNT_ID が記載されていること

set -euo pipefail

# プロジェクトルート（このスクリプトの1階層上）に移動
cd "$(dirname "$0")/.."

# .env がなければエラー終了（認証情報が必要）
if [ ! -f ".env" ]; then
	echo "❌ .env が見つかりません。"
	echo "   CLOUDFLARE_API_TOKEN と CLOUDFLARE_ACCOUNT_ID を書いた .env を作ってください。"
	exit 1
fi

# .env の値をシェル環境変数にロード（# で始まる行は無視）
set -a
# shellcheck disable=SC1091
source .env
set +a

# 必須変数チェック
: "${CLOUDFLARE_API_TOKEN:?CLOUDFLARE_API_TOKEN が .env に設定されていません}"
: "${CLOUDFLARE_ACCOUNT_ID:?CLOUDFLARE_ACCOUNT_ID が .env に設定されていません}"

echo "🛠  ビルドを実行..."
npx astro build

echo ""
echo "🔎 Pagefind（サイト内検索）インデックスを生成..."
npx pagefind --site dist

echo ""
echo "🚀 Cloudflare Pages にデプロイ..."
# コミットメッセージに日本語/絵文字が含まれるとCloudflare側でUTF-8エラーになるため英語固定
npx wrangler pages deploy dist \
	--project-name=blog-koharu \
	--branch=main \
	--commit-dirty=true \
	--commit-message="deploy"

echo ""
echo "✅ デプロイ完了！"
echo "   本番: https://blog-koharu-4xx.pages.dev/"
